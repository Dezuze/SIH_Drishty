/**
 * ==========================================================================
 * DRISHTI - Customer Module JavaScript
 * Flipkart-style Live Map Tracking & 3-second GPS Polling
 * ==========================================================================
 */

let customerMap = null;
let customerDriverMarker = null;
let customerFarmerMarker = null;
let customerDestMarker = null;
let customerRouteLine = null;
let pollingTimer = null;

// Custom HTML emoji markers for Leaflet
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

// Initialize Leaflet map for customer
function initCustomerMap(orderData) {
  if (!orderData) return;

  const pickup = [orderData.pickup_lat, orderData.pickup_lng];
  const destination = [orderData.customer_lat, orderData.customer_lng];

  const midLat = (pickup[0] + destination[0]) / 2;
  const midLng = (pickup[1] + destination[1]) / 2;

  customerMap = L.map('customer-map').setView([midLat, midLng], 14);

  // High-speed CDN tiles (Cloudflare/Fastly cached)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(customerMap);

  // 1. 🌾 Farmer / Pickup Location
  customerFarmerMarker = L.marker(pickup, {
    icon: createEmojiIcon('🌾', 'Farmer Pickup', '#E8F5E9', '#2E7D32')
  }).addTo(customerMap);
  customerFarmerMarker.bindPopup(`<b>🌾 Farmer Location</b><br>${orderData.pickup_address}`);

  // 2. 📍 Customer Destination
  customerDestMarker = L.marker(destination, {
    icon: createEmojiIcon('📍', 'Your Location', '#FFF8E1', '#E65100')
  }).addTo(customerMap);
  customerDestMarker.bindPopup(`<b>📍 Your Delivery Address</b><br>${orderData.customer_address}`);

  // 3. 🚚 Driver Marker (starts at pickup or last known position)
  customerDriverMarker = L.marker(pickup, {
    icon: createEmojiIcon('🚚', 'Driver Live', '#FFFFFF', '#1976D2'),
    zIndexOffset: 1000
  }).addTo(customerMap);
  customerDriverMarker.bindPopup(`<b>🚚 Driver On The Way</b><br>${orderData.driver_name || 'Driver'}`);

  // Route dashed polyline
  customerRouteLine = L.polyline([pickup, destination], {
    color: '#2E7D32',
    weight: 4,
    opacity: 0.85,
    dashArray: '8, 8'
  }).addTo(customerMap);

  // Fit bounds to show both endpoints
  customerMap.fitBounds(L.latLngBounds([pickup, destination]), { padding: [50, 50] });

  // Initial fetch and start fast 1-second polling for instant updates
  pollLiveUpdates(orderData.id);
  pollingTimer = setInterval(() => {
    pollLiveUpdates(orderData.id);
  }, 1000);
}

// 3-second Polling function
function pollLiveUpdates(orderId) {
  // 1. Fetch latest driver GPS location
  fetch(`/api/driver/location?order_id=${orderId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.latitude && data.longitude) {
        if (customerDriverMarker) {
          customerDriverMarker.setLatLng([data.latitude, data.longitude]);
        }
        const coordElem = document.getElementById('customer-driver-coords');
        if (coordElem) {
          coordElem.innerText = `${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)}`;
        }
        const timeElem = document.getElementById('customer-last-poll-time');
        if (timeElem) {
          timeElem.innerText = new Date().toLocaleTimeString();
        }
      }
    })
    .catch(err => console.log('Location polling:', err));

  // 2. Fetch latest order status & update timeline
  fetch(`/api/order?order_id=${orderId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.order) {
        updateCustomerTimeline(data.order.status, data.order.status_index, data.stages);
      }
    })
    .catch(err => console.log('Order status polling:', err));
}

// Update the visual timeline and status badges dynamically
function updateCustomerTimeline(currentStatus, statusIndex, stages) {
  const badgeElem = document.getElementById('live-status-badge');
  if (badgeElem && badgeElem.innerText !== currentStatus) {
    badgeElem.innerText = currentStatus;
    if (currentStatus === 'Delivered') {
      badgeElem.className = 'badge badge-status completed';
    } else if (currentStatus === 'Out for Delivery') {
      badgeElem.className = 'badge badge-status active';
    }
  }

  // Update timeline step elements
  if (!stages || stages.length === 0) return;

  const totalSteps = stages.length;
  const progressPercent = totalSteps > 1 ? (statusIndex / (totalSteps - 1)) * 100 : 0;

  const progressBar = document.getElementById('customer-timeline-progress');
  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }

  const stepElements = document.querySelectorAll('.timeline-step');
  stepElements.forEach((elem, idx) => {
    const iconElem = elem.querySelector('.timeline-icon');
    elem.classList.remove('completed', 'active');

    if (idx < statusIndex) {
      elem.classList.add('completed');
      if (iconElem) iconElem.innerHTML = '✓';
    } else if (idx === statusIndex) {
      elem.classList.add('active');
      if (iconElem) iconElem.innerHTML = '●';
    } else {
      if (iconElem) iconElem.innerHTML = '○';
    }
  });

  // Stop polling if delivered
  if (currentStatus === 'Delivered' && pollingTimer) {
    const indicator = document.getElementById('customer-live-indicator');
    if (indicator) {
      indicator.innerHTML = '✅ <strong>Order Delivered!</strong> Thank you for supporting local farmers.';
      indicator.style.background = '#E8F5E9';
      indicator.style.borderColor = '#81C784';
    }
  }
}
