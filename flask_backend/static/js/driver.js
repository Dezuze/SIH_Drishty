/**
 * ==========================================================================
 * DRISHTI - Driver Module JavaScript
 * Handles Leaflet Map, Geolocation watchPosition, and Status Transitions
 * ==========================================================================
 */

let map = null;
let driverMarker = null;
let farmerMarker = null;
let customerMarker = null;
let routeLine = null;
let watchId = null;
let simulationInterval = null;

// Custom HTML emoji markers for clean visual distinction without needing image assets
function createEmojiIcon(emoji, label, bgColor = '#ffffff', borderColor = '#2E7D32') {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="
        background: ${bgColor};
        border: 2px solid ${borderColor};
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      ">${emoji}</div>
      <div style="
        background: rgba(0,0,0,0.75);
        color: #ffffff;
        font-size: 11px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 4px;
        white-space: nowrap;
        text-align: center;
        margin-top: 3px;
      ">${label}</div>
    `,
    iconSize: [38, 55],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
}

// Initialize Leaflet Map
function initDriverMap(orderData) {
  if (!orderData) return;

  const pickup = [orderData.pickup_lat, orderData.pickup_lng];
  const customer = [orderData.customer_lat, orderData.customer_lng];

  // Center between pickup and customer
  const midLat = (pickup[0] + customer[0]) / 2;
  const midLng = (pickup[1] + customer[1]) / 2;

  map = L.map('driver-map').setView([midLat, midLng], 14);

  // High-speed CDN tiles (Cloudflare/Fastly cached)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // 1. 🌾 Farmer / Pickup Marker
  farmerMarker = L.marker(pickup, {
    icon: createEmojiIcon('🌾', 'Farmer Pickup', '#E8F5E9', '#2E7D32')
  }).addTo(map);
  farmerMarker.bindPopup(`<b>🌾 Farmer Pickup Location</b><br>${orderData.pickup_address}`);

  // 2. 📍 Customer Destination Marker
  customerMarker = L.marker(customer, {
    icon: createEmojiIcon('📍', 'Customer Drop', '#FFF8E1', '#E65100')
  }).addTo(map);
  customerMarker.bindPopup(`<b>📍 Customer Delivery Location</b><br>${orderData.customer_name}<br>${orderData.customer_address}`);

  // 3. 🚚 Driver Current Position Marker (starts at pickup)
  driverMarker = L.marker(pickup, {
    icon: createEmojiIcon('🚚', 'Your Vehicle', '#FFFFFF', '#1976D2'),
    zIndexOffset: 1000
  }).addTo(map);
  driverMarker.bindPopup(`<b>🚚 Driver Current Location</b><br>Order #${orderData.id}`);

  // Connect pickup and customer with a route line
  routeLine = L.polyline([pickup, customer], {
    color: '#2E7D32',
    weight: 4,
    opacity: 0.8,
    dashArray: '8, 8'
  }).addTo(map);

  // Fit bounds to show all markers
  map.fitBounds(L.latLngBounds([pickup, customer]), { padding: [50, 50] });

  // Map Click listener for manual coordinate simulation during testing/viva
  map.on('click', function (e) {
    const simCheckbox = document.getElementById('click-to-move-toggle');
    if (simCheckbox && simCheckbox.checked) {
      updateDriverPosition(e.latlng.lat, e.latlng.lng, true);
    }
  });

  // Fetch latest location from server in case driver previously moved
  fetchLatestDriverLocation(orderData.id);
}

// Fetch latest location stored in DB
function fetchLatestDriverLocation(orderId) {
  fetch(`/api/driver/location?order_id=${orderId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.latitude && data.longitude) {
        updateDriverMarker(data.latitude, data.longitude);
      }
    })
    .catch(err => console.log('Location fetch note:', err));
}

// Update driver marker on Leaflet map
function updateDriverMarker(lat, lng) {
  if (driverMarker) {
    driverMarker.setLatLng([lat, lng]);
  }
}

// Transmit updated coordinates to Flask backend
function sendLocationToBackend(lat, lng) {
  const payload = {
    order_id: window.ORDER_DATA.id,
    driver_id: window.ORDER_DATA.driver_id,
    latitude: lat,
    longitude: lng
  };

  fetch('/api/driver/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      const coordDisplay = document.getElementById('current-coords');
      if (coordDisplay) {
        coordDisplay.innerText = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      }
      const timeDisplay = document.getElementById('last-updated-time');
      if (timeDisplay) {
        timeDisplay.innerText = new Date().toLocaleTimeString();
      }
    })
    .catch(err => console.error('Error broadcasting GPS location:', err));
}

// Combine marker update and backend transmission
function updateDriverPosition(lat, lng, sendToServer = true) {
  updateDriverMarker(lat, lng);
  if (sendToServer) {
    sendLocationToBackend(lat, lng);
  }
}

// ==========================================================================
// BROWSER GEOLOCATION API (navigator.geolocation.watchPosition)
// ==========================================================================
function startGpsTracking() {
  const statusElem = document.getElementById('gps-status-indicator');

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your current browser.');
    if (statusElem) statusElem.innerText = 'GPS not supported by browser.';
    return;
  }

  if (watchId !== null) {
    console.log('GPS tracking already active.');
    return;
  }

  if (statusElem) {
    statusElem.innerHTML = '<span class="gps-live-dot"></span> GPS Tracking Active (Live Broadcasting)';
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  watchId = navigator.geolocation.watchPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      updateDriverPosition(lat, lng, true);
    },
    error => {
      console.warn('Geolocation watch error:', error.message);
      if (statusElem) {
        statusElem.innerText = `GPS Note: ${error.message}. You can use "Simulate Movement" for demo.`;
      }
    },
    options
  );
}

function stopGpsTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  const statusElem = document.getElementById('gps-status-indicator');
  if (statusElem) {
    statusElem.innerText = 'GPS Tracking Stopped.';
  }
}

// ==========================================================================
// VIVA DEMO SIMULATION MODE (Move Truck smoothly along route)
// ==========================================================================
let simStep = 0;
const TOTAL_SIM_STEPS = 20;

function toggleRouteSimulation() {
  const btn = document.getElementById('btn-simulate-route');

  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    if (btn) btn.innerText = '🎮 Start Route Simulation';
    return;
  }

  if (btn) btn.innerText = '⏸ Pause Route Simulation';

  const pLat = window.ORDER_DATA.pickup_lat;
  const pLng = window.ORDER_DATA.pickup_lng;
  const cLat = window.ORDER_DATA.customer_lat;
  const cLng = window.ORDER_DATA.customer_lng;

  simulationInterval = setInterval(() => {
    simStep = (simStep + 1) % (TOTAL_SIM_STEPS + 1);
    const progress = simStep / TOTAL_SIM_STEPS;

    // Linear interpolation between pickup and customer coordinates
    const curLat = pLat + (cLat - pLat) * progress;
    const curLng = pLng + (cLng - pLng) * progress;

    updateDriverPosition(curLat, curLng, true);

    if (simStep === TOTAL_SIM_STEPS) {
      clearInterval(simulationInterval);
      simulationInterval = null;
      if (btn) btn.innerText = '🎮 Restart Route Simulation';
    }
  }, 700); // Fast step every 700ms for lively demo
}

// Single step forward helper
function stepForwardOnce() {
  simStep = (simStep + 1) % (TOTAL_SIM_STEPS + 1);
  const progress = simStep / TOTAL_SIM_STEPS;
  const curLat = window.ORDER_DATA.pickup_lat + (window.ORDER_DATA.customer_lat - window.ORDER_DATA.pickup_lat) * progress;
  const curLng = window.ORDER_DATA.pickup_lng + (window.ORDER_DATA.customer_lng - window.ORDER_DATA.pickup_lng) * progress;
  updateDriverPosition(curLat, curLng, true);
}

// ==========================================================================
// ORDER STATUS TRANSITIONS
// ==========================================================================
function setOrderStatus(newStatus) {
  if (!confirm(`Change order status to "${newStatus}"?`)) {
    return;
  }

  fetch('/api/order/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: window.ORDER_DATA.id,
      status: newStatus
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Update local status badge
        const badge = document.getElementById('order-status-badge');
        if (badge) badge.innerText = newStatus;

        // Trigger or stop GPS tracking based on state
        if (newStatus === 'Out for Delivery') {
          startGpsTracking();
        } else if (newStatus === 'Delivered') {
          stopGpsTracking();
          if (simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
          }
        }

        // Refresh UI state
        window.location.reload();
      } else {
        alert('Could not update status: ' + data.message);
      }
    })
    .catch(err => {
      console.error('Error updating order status:', err);
      alert('Network error while updating status');
    });
}
