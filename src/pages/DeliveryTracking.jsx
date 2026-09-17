import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import L from 'leaflet';
import { useTracking, STATUS_STAGES } from '../context/TrackingContext';
import { useAuth } from '../context/AuthContext';
import { fetchRoadRoute, findClosestRouteIndex, calculateHaversineDistance } from '../services/routingService';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Navigation, 
  Phone, 
  RefreshCw, 
  ShieldCheck, 
  Truck, 
  User, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Sprout,
  Package
} from 'lucide-react';

const SVG_ICONS = {
  farmer: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>`,
  driver: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
  customer: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E65100" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`
};

// Custom SVG icon markers for Leaflet
function createSvgMapIcon(type, label, bgColor = '#ffffff', borderColor = '#2E7D32') {
  const iconSvg = SVG_ICONS[type] || SVG_ICONS.farmer;
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="
        background: ${bgColor};
        border: 2px solid ${borderColor};
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        transition: transform 0.2s ease;
      ">${iconSvg}</div>
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
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      ">${label}</div>
    `,
    iconSize: [40, 60],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
}

export const DeliveryTracking = () => {
  const { orderId } = useParams();
  const { orders, resetDemoOrder, isSimulating, toggleSimulation } = useTracking();
  const { user } = useAuth();

  const activeId = orderId && orders[orderId] ? orderId : 'DR001';
  const order = orders[activeId] || orders['DR001'];

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const farmerMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const routeGlowRef = useRef(null);
  const driverPathRef = useRef(null);

  const [distanceKm, setDistanceKm] = useState('3.2');
  const [etaMinutes, setEtaMinutes] = useState('12');
  const [roadRoute, setRoadRoute] = useState(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || !order) return;

    if (!mapInstanceRef.current) {
      const midLat = (order.pickupLat + order.customerLat) / 2;
      const midLng = (order.pickupLng + order.customerLng) / 2;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView([midLat, midLng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      setTimeout(() => {
        try {
          map.invalidateSize();
        } catch {}
      }, 300);

      // 1. Farmer Marker
      const farmMarker = L.marker([order.pickupLat, order.pickupLng], {
        icon: createSvgMapIcon('farmer', 'Farmer Field', '#E8F5E9', '#2E7D32')
      }).addTo(map);
      farmMarker.bindPopup(`<b>Farm Source:</b><br>${order.pickupAddress}`);
      farmerMarkerRef.current = farmMarker;

      // 2. Customer Marker
      const custMarker = L.marker([order.customerLat, order.customerLng], {
        icon: createSvgMapIcon('customer', 'Your Doorstep', '#FFF8E1', '#E65100')
      }).addTo(map);
      custMarker.bindPopup(`<b>Delivery Address:</b><br>${order.customerName}<br>${order.customerAddress}`);
      destMarkerRef.current = custMarker;

      // 3. Driver Marker
      const dMarker = L.marker([order.currentLat, order.currentLng], {
        icon: createSvgMapIcon('driver', 'Driver Live', '#FFFFFF', '#0284C7'),
        zIndexOffset: 1000
      }).addTo(map);
      dMarker.bindPopup(`<b>Driver On Route:</b><br>${order.driverName} (${order.driverPhone})`);
      driverMarkerRef.current = dMarker;

      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount if needed
    };
  }, []);

  // Fetch and draw actual driving road route (turn-by-turn road network)
  useEffect(() => {
    if (!order) return;
    let cancelled = false;

    fetchRoadRoute(order.pickupLat, order.pickupLng, order.customerLat, order.customerLng)
      .then((routeResult) => {
        if (cancelled) return;
        setRoadRoute(routeResult);

        if (mapInstanceRef.current) {
          if (routeLineRef.current) {
            routeLineRef.current.remove();
            routeLineRef.current = null;
          }
          if (routeGlowRef.current) {
            routeGlowRef.current.remove();
            routeGlowRef.current = null;
          }

          // Outer glowing route outline for visual clarity
          routeGlowRef.current = L.polyline(routeResult.coordinates, {
            color: '#86EFAC',
            weight: 9,
            opacity: 0.45,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(mapInstanceRef.current);

          // Crisp foreground driving road polyline
          routeLineRef.current = L.polyline(routeResult.coordinates, {
            color: '#16A34A',
            weight: 5,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(mapInstanceRef.current);

          mapInstanceRef.current.fitBounds(routeLineRef.current.getBounds(), { padding: [50, 50] });
        }
      })
      .catch((err) => {
        console.error('Failed to load driving road route:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [order?.pickupLat, order?.pickupLng, order?.customerLat, order?.customerLng]);

  // Update markers and road-following distance/ETA when driver moves
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

    // Calculate road-following remaining distance along the actual driving path
    if (roadRoute && roadRoute.coordinates && roadRoute.coordinates.length > 0) {
      const closestIdx = findClosestRouteIndex(roadRoute.coordinates, order.currentLat, order.currentLng);
      let remKm = 0;
      for (let i = closestIdx; i < roadRoute.coordinates.length - 1; i++) {
        remKm += calculateHaversineDistance(
          roadRoute.coordinates[i][0],
          roadRoute.coordinates[i][1],
          roadRoute.coordinates[i + 1][0],
          roadRoute.coordinates[i + 1][1]
        );
      }
      const formattedDist = remKm < 0.08 ? 'Arrived' : `${remKm.toFixed(1)} km`;
      const formattedEta = remKm < 0.08 ? '0 min' : `${Math.max(1, Math.round(remKm * 2.8))} mins`;
      setDistanceKm(formattedDist);
      setEtaMinutes(formattedEta);
    } else {
      const distToCustomer = Math.hypot(
        (order.customerLat - order.currentLat) * 111,
        (order.customerLng - order.currentLng) * 111 * Math.cos((order.customerLat * Math.PI) / 180)
      );
      const formattedDist = distToCustomer < 0.1 ? 'Arrived' : `${distToCustomer.toFixed(1)} km`;
      const formattedEta = distToCustomer < 0.1 ? '0 min' : `${Math.max(1, Math.round(distToCustomer * 3.5))} mins`;
      setDistanceKm(formattedDist);
      setEtaMinutes(formattedEta);
    }
  }, [order?.currentLat, order?.currentLng, order?.status, roadRoute]);

  if (!order) {
    return (
      <div style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p>The requested order tracking ID does not exist.</p>
        <Link to="/tracking/DR001" style={{ display: 'inline-block', marginTop: '1rem', color: '#16a34a', fontWeight: 600 }}>
          Track Demo Order #DR001 &rarr;
        </Link>
      </div>
    );
  }

  const currentIdx = STATUS_STAGES.indexOf(order.status) !== -1 ? STATUS_STAGES.indexOf(order.status) : 0;
  const progressPercent = (currentIdx / (STATUS_STAGES.length - 1)) * 100;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAF8', paddingBottom: '3rem' }}>
      
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #10B981 100%)',
        color: '#ffffff',
        padding: '2.5rem 1.5rem 3rem'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.9 }}>
            <Link to="/" style={{ color: '#A7F3D0', textDecoration: 'none' }}>Marketplace</Link>
            <ChevronRight size={14} />
            <span>Live Delivery Tracking</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                <Sparkles size={14} /> Real-Time Farmer-to-Doorstep Tracking
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                Order #{order.id}
              </h1>
              <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '0.95rem' }}>
                {order.product} • {order.quantity}
              </p>
            </div>

            {/* Quick Demo Switcher & Status Badge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{
                background: order.status === 'Delivered' ? '#22C55E' : '#F59E0B',
                color: '#ffffff',
                padding: '6px 16px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', animation: 'pulse 1.5s infinite' }} />
                {order.status}
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                {Object.keys(orders).map((id) => (
                  <Link
                    key={id}
                    to={`/tracking/${id}`}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: id === order.id ? '#ffffff' : 'rgba(255,255,255,0.2)',
                      color: id === order.id ? '#134e27' : '#ffffff',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    #{id}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '-1.5rem auto 0', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* 1. Flipkart-Style 7-Stage Visual Timeline Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
          padding: '1.5rem 1.5rem 1.8rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#16A34A" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Delivery Progress Milestone
              </span>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
              Last sync: <strong style={{ color: '#0F172A' }}>{order.lastUpdated}</strong>
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div style={{ position: 'relative', margin: '2rem 0.5rem 1rem' }}>
            {/* Progress Track Background */}
            <div style={{
              position: 'absolute',
              top: '18px',
              left: '4%',
              right: '4%',
              height: '4px',
              background: '#E2E8F0',
              zIndex: 1
            }}>
              {/* Active Fill */}
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #16A34A, #22C55E)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }} />
            </div>

            {/* Stage Nodes */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 2
            }}>
              {STATUS_STAGES.map((stage, idx) => {
                const isCompleted = idx < currentIdx;
                const isActive = idx === currentIdx;

                return (
                  <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '13%', textAlign: 'center' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: isCompleted ? '#16A34A' : isActive ? '#22C55E' : '#ffffff',
                      color: isCompleted || isActive ? '#ffffff' : '#94A3B8',
                      border: isActive ? '3px solid #86EFAC' : isCompleted ? '2px solid #16A34A' : '2px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      boxShadow: isActive ? '0 0 0 5px rgba(34, 197, 94, 0.2)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <div style={{
                      marginTop: '8px',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 800 : isCompleted ? 600 : 500,
                      color: isActive ? '#15803D' : isCompleted ? '#334155' : '#94A3B8',
                      lineHeight: 1.2
                    }}>
                      {stage}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Interactive Live Map Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}>
          {/* Map Top Bar */}
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Navigation size={20} color="#16A34A" />
                Live Driver GPS Radar (OpenStreetMap)
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                Coordinates: <strong style={{ color: '#0F172A', fontFamily: 'monospace' }}>{order.currentLat.toFixed(4)}, {order.currentLng.toFixed(4)}</strong>
              </div>
            </div>

            {/* Live Telemetry Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                color: '#065F46',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                Distance: <strong>{distanceKm}</strong>
              </div>

              <div style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                color: '#1E40AF',
                fontWeight: 600
              }}>
                ETA: <strong>{etaMinutes}</strong>
              </div>
            </div>
          </div>

          {/* Leaflet Map DOM Element */}
          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '420px',
              position: 'relative',
              zIndex: 1
            }}
          />

          {/* Map Legend & Demo Viva Helper Footer */}
          <div style={{
            padding: '1rem 1.5rem',
            background: '#FAFAF9',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.82rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sprout size={16} className="text-emerald-700" /> <strong>Farmer Pickup</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={16} className="text-sky-600" /> <strong>Driver Live Position</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} className="text-amber-600" /> <strong>Customer Doorstep</strong>
              </div>
            </div>

            {/* Action to Driver Portal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {(user?.role === 'driver' || user?.role === 'admin') && (
                <Link
                  to={`/driver/order/${order.id}`}
                  style={{
                    background: '#0F172A',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Truck size={14} /> Open Driver Portal &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 3. Order & Shipment Metadata Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem'
        }}>
          {/* Product & Quantity */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.2rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
              PRODUCT ORDERED
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} className="text-emerald-600 shrink-0" />
              <span>{order.product}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
              Quantity: <strong>{order.quantity}</strong> • ₹{order.price}
            </div>
          </div>

          {/* Farm Source */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.2rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sprout size={14} />
              <span>FARM SOURCE (PICKUP)</span>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A' }}>
              {order.pickupAddress}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
              Directly harvested organic farm
            </div>
          </div>

          {/* Delivery Partner */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.2rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={14} />
              <span>ASSIGNED DRIVER</span>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
              {order.driverName} ({order.driverId})
            </div>
            <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={13} /> {order.driverPhone}
            </div>
          </div>

          {/* Delivery Destination */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.2rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} />
              <span>DELIVERY DESTINATION</span>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A' }}>
              {order.customerName}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
              {order.customerAddress}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeliveryTracking;
