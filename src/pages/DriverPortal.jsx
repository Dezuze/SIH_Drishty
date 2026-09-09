import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import L from 'leaflet';
import { useTracking, STATUS_STAGES } from '../context/TrackingContext';
import {
  Truck,
  User,
  Phone,
  CheckCircle2,
  Package,
  Navigation,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Radio,
  ExternalLink,
  MapPin,
  Clock,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';

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
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      ">${emoji}</div>
      <div style="
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(4px);
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 6px;
        white-space: nowrap;
        text-align: center;
        margin-top: 4px;
        border: 1px solid rgba(255,255,255,0.15);
      ">${label}</div>
    `,
    iconSize: [38, 55],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
}

export const DriverPortal = () => {
  const { orderId } = useParams();
  const {
    orders,
    driverProfile,
    isSimulating,
    toggleDriverStatus,
    updateOrderStatus,
    updateDriverLocation,
    resetDemoOrder,
    toggleSimulation,
    stepForwardOnce
  } = useTracking();

  const activeId = orderId && orders[orderId] ? orderId : 'DR001';
  const order = orders[activeId] || orders['DR001'];

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const farmerMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  const [clickToMove, setClickToMove] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsNote, setGpsNote] = useState('');
  const watchIdRef = useRef(null);

  // Compute metrics
  const ordersList = Object.values(orders);
  const pendingCount = ordersList.filter(o => ['Driver Assigned', 'Driver Accepted'].includes(o.status)).length;
  const activeCount = ordersList.filter(o => ['Picked Up', 'Out for Delivery'].includes(o.status)).length;
  const completedCount = ordersList.filter(o => o.status === 'Delivered').length;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || !order) return;

    if (!mapInstanceRef.current) {
      const midLat = (order.pickupLat + order.customerLat) / 2;
      const midLng = (order.pickupLng + order.customerLng) / 2;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView([midLat, midLng], 14);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Markers
      farmerMarkerRef.current = L.marker([order.pickupLat, order.pickupLng], {
        icon: createEmojiIcon('🌾', 'Farm Pickup', '#E8F5E9', '#2E7D32')
      }).addTo(map).bindPopup(`<b>🌾 Farm Pickup:</b><br>${order.pickupAddress}`);

      destMarkerRef.current = L.marker([order.customerLat, order.customerLng], {
        icon: createEmojiIcon('📍', 'Customer Drop', '#FFF8E1', '#E65100')
      }).addTo(map).bindPopup(`<b>📍 Customer Drop:</b><br>${order.customerName}<br>${order.customerAddress}`);

      driverMarkerRef.current = L.marker([order.currentLat, order.currentLng], {
        icon: createEmojiIcon('🚚', 'Your Vehicle', '#FFFFFF', '#0284C7'),
        zIndexOffset: 1000
      }).addTo(map).bindPopup(`<b>🚚 Your Vehicle:</b><br>Order #${order.id}`);

      routeLineRef.current = L.polyline([
        [order.pickupLat, order.pickupLng],
        [order.customerLat, order.customerLng]
      ], {
        color: '#16A34A',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);

      map.fitBounds(L.latLngBounds([
        [order.pickupLat, order.pickupLng],
        [order.customerLat, order.customerLng]
      ]), { padding: [50, 50] });

      map.on('click', (e) => {
        if (clickToMove) {
          updateDriverLocation(order.id, e.latlng.lat, e.latlng.lng);
        }
      });

      mapInstanceRef.current = map;
    }
  }, []);

  // Update marker position on location changes
  useEffect(() => {
    if (!order || !mapInstanceRef.current) return;

    if (driverMarkerRef.current) {
      driverMarkerRef.current.setLatLng([order.currentLat, order.currentLng]);
    }
    if (farmerMarkerRef.current) {
      farmerMarkerRef.current.setLatLng([order.pickupLat, order.pickupLng]);
    }
    if (destMarkerRef.current) {
      destMarkerRef.current.setLatLng([order.customerLat, order.customerLng]);
    }
  }, [order?.currentLat, order?.currentLng, order?.status]);

  // Handle click-to-move toggle listener
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.off('click');
    mapInstanceRef.current.on('click', (e) => {
      if (clickToMove && order) {
        updateDriverLocation(order.id, e.latlng.lat, e.latlng.lng);
      }
    });
  }, [clickToMove, order?.id]);

  // Browser GPS watchPosition toggle
  const toggleGpsTracking = () => {
    if (gpsActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setGpsActive(false);
      setGpsNote('Device GPS tracking paused.');
      return;
    }

    if (!navigator.geolocation) {
      setGpsNote('Geolocation not supported by this browser.');
      return;
    }

    setGpsActive(true);
    setGpsNote('GPS broadcasting active (live coordinates transmission).');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        updateDriverLocation(order.id, pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setGpsNote(`GPS Note: ${err.message}. You can use "Route Simulator" for demo.`);
        setGpsActive(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const currentIdx = STATUS_STAGES.indexOf(order?.status);
  const progressPercent = (currentIdx / (STATUS_STAGES.length - 1)) * 100;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAF8', paddingBottom: '3rem' }}>
      
      {/* Top Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2e1b 0%, #166534 100%)',
        color: '#ffffff',
        padding: '2rem 1.5rem 2.5rem'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.9 }}>
            <Link to="/" style={{ color: '#A7F3D0', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span>Driver Operations & Telematics</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                border: '2px solid rgba(255,255,255,0.3)'
              }}>
                👨‍🌾
              </div>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
                  {driverProfile.name}
                </h1>
                <div style={{ fontSize: '0.88rem', opacity: 0.9, marginTop: '2px' }}>
                  Driver ID: <strong style={{ color: '#86EFAC' }}>{driverProfile.driverCode}</strong> • {driverProfile.vehicleNumber}
                </div>
              </div>
            </div>

            {/* Online Status Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                background: driverProfile.status === 'Available' ? '#22C55E' : '#64748B',
                color: '#ffffff',
                padding: '5px 14px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />
                {driverProfile.status}
              </span>

              <button
                onClick={toggleDriverStatus}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Switch to {driverProfile.status === 'Available' ? 'Offline' : 'Available'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '-1.5rem auto 0', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* 1. Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{pendingCount}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Pending Orders</div>
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{activeCount}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Active Deliveries</div>
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{completedCount}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Delivered Today</div>
            </div>
          </div>

        </div>

        {/* 2. Current Assigned Delivery Details & Actions */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' }}>
                ACTIVE ORDER TASK
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '4px 0 0' }}>
                Order #{order.id} • {order.product}
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
                Customer: <strong>{order.customerName}</strong> ({order.customerPhone})
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: order.status === 'Delivered' ? '#22C55E' : '#F59E0B',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {order.status}
              </span>

              <Link
                to={`/tracking/${order.id}`}
                target="_blank"
                style={{
                  background: '#F1F5F9',
                  color: '#334155',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid #CBD5E1'
                }}
              >
                Customer View <ExternalLink size={13} />
              </Link>
            </div>
          </div>

          {/* Sequential Status Action Buttons */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
              STEP 1: UPDATE STAGE MILESTONES (DRIVER WORKFLOW)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              
              {/* Accept Delivery */}
              <button
                disabled={order.status !== 'Driver Assigned'}
                onClick={() => updateOrderStatus(order.id, 'Driver Accepted')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: order.status === 'Driver Assigned' ? '#16A34A' : '#F1F5F9',
                  color: order.status === 'Driver Assigned' ? '#ffffff' : '#94A3B8',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: order.status === 'Driver Assigned' ? 'pointer' : 'not-allowed',
                  boxShadow: order.status === 'Driver Assigned' ? '0 2px 8px rgba(22, 163, 74, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={16} /> 1. Accept Order
              </button>

              {/* Picked Up */}
              <button
                disabled={order.status !== 'Driver Accepted'}
                onClick={() => updateOrderStatus(order.id, 'Picked Up')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: order.status === 'Driver Accepted' ? '#16A34A' : '#F1F5F9',
                  color: order.status === 'Driver Accepted' ? '#ffffff' : '#94A3B8',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: order.status === 'Driver Accepted' ? 'pointer' : 'not-allowed',
                  boxShadow: order.status === 'Driver Accepted' ? '0 2px 8px rgba(22, 163, 74, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                🌾 2. Picked Up from Farm
              </button>

              {/* Out for Delivery */}
              <button
                disabled={order.status !== 'Picked Up'}
                onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: order.status === 'Picked Up' ? '#D97706' : '#F1F5F9',
                  color: order.status === 'Picked Up' ? '#ffffff' : '#94A3B8',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: order.status === 'Picked Up' ? 'pointer' : 'not-allowed',
                  boxShadow: order.status === 'Picked Up' ? '0 2px 8px rgba(217, 119, 6, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                🚚 3. Start Delivery (Transit)
              </button>

              {/* Delivered */}
              <button
                disabled={order.status !== 'Out for Delivery'}
                onClick={() => updateOrderStatus(order.id, 'Delivered')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: order.status === 'Out for Delivery' ? '#059669' : '#F1F5F9',
                  color: order.status === 'Out for Delivery' ? '#ffffff' : '#94A3B8',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: order.status === 'Out for Delivery' ? 'pointer' : 'not-allowed',
                  boxShadow: order.status === 'Out for Delivery' ? '0 2px 8px rgba(5, 150, 105, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                ✅ 4. Confirm Delivery
              </button>

            </div>
          </div>
        </div>

        {/* 3. Live Map & Broadcaster Simulator Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}>
          {/* Controls Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase' }}>
                STEP 2: GPS TELEMATICS & VIVA SIMULATOR
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '2px 0 0' }}>
                Broadcast Live GPS Movement to Customers
              </h3>
            </div>

            {/* GPS Controls Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              
              <button
                onClick={() => toggleSimulation(order.id)}
                style={{
                  background: isSimulating ? '#EF4444' : '#16A34A',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}
              >
                {isSimulating ? <Pause size={15} /> : <Play size={15} />}
                {isSimulating ? 'Pause Route Simulation' : 'Start Route Simulation'}
              </button>

              <button
                onClick={() => stepForwardOnce(order.id)}
                style={{
                  background: '#F1F5F9',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FastForward size={15} /> Step Forward
              </button>

              <button
                onClick={toggleGpsTracking}
                style={{
                  background: gpsActive ? '#0284C7' : '#F8FAFC',
                  color: gpsActive ? '#ffffff' : '#334155',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Radio size={15} /> {gpsActive ? 'Device GPS Active' : 'Device GPS'}
              </button>

              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
                userSelect: 'none',
                background: '#F8FAFC',
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1'
              }}>
                <input
                  type="checkbox"
                  checked={clickToMove}
                  onChange={(e) => setClickToMove(e.target.checked)}
                />
                <span>Click Map to Move</span>
              </label>

              <button
                onClick={() => resetDemoOrder(order.id)}
                title="Reset order for College Viva presentation"
                style={{
                  background: '#FEF3C7',
                  color: '#B45309',
                  border: '1px solid #FCD34D',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={15} /> Reset Demo
              </button>
            </div>
          </div>

          {/* GPS Banner */}
          {gpsNote && (
            <div style={{ padding: '8px 1.5rem', background: '#F0FDF4', color: '#15803D', fontSize: '0.82rem', borderBottom: '1px solid #DCFCE7' }}>
              💡 {gpsNote}
            </div>
          )}

          {/* Leaflet Map */}
          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '420px',
              position: 'relative',
              zIndex: 1
            }}
          />

          {/* Footer Info */}
          <div style={{
            padding: '1rem 1.5rem',
            background: '#FAFAF9',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
            color: '#64748B'
          }}>
            <div>
              Current Position: <strong style={{ color: '#0F172A', fontFamily: 'monospace' }}>{order.currentLat.toFixed(5)}, {order.currentLng.toFixed(5)}</strong>
            </div>
            <div>
              Broadcasting Channel: <strong style={{ color: '#16A34A' }}>drishti_tracking_channel (Live Multi-Tab)</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DriverPortal;
