import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Maximize2, 
  LocateFixed, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  CheckCircle2,
  Navigation,
  Info
} from 'lucide-react';
import { LocationPoint, RouteMetrics } from '../../types/dashboardTypes';
import { DETAILED_ROUTE_COORDS } from '../../data/dashboardData';

interface MapSectionProps {
  farm: LocationPoint;
  customers: LocationPoint[];
  metrics: RouteMetrics;
  isOptimized: boolean;
  onSelectCustomer: (cust: LocationPoint) => void;
  selectedCustomerId?: string;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  simulationStep: number;
  setSimulationStep: React.Dispatch<React.SetStateAction<number>>;
}

export const MapSection: React.FC<MapSectionProps> = ({
  farm,
  customers,
  metrics,
  isOptimized,
  onSelectCustomer,
  selectedCustomerId,
  isSimulating,
  setIsSimulating,
  simulationStep,
  setSimulationStep,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);
  const clusterCircleRef = useRef<L.Circle | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [mapTheme, setMapTheme] = useState<'carto' | 'osm' | 'dark'>('dark');
  const [showGeofence, setShowGeofence] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x

  // Tile layers
  const tileLayers = {
    dark: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    carto: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [8.539, 76.951],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    tileLayerRef.current = L.tileLayer(tileLayers[mapTheme], {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer Theme
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(tileLayers[mapTheme]);
  }, [mapTheme]);

  // Create or Update Markers & Route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (clusterCircleRef.current) {
      clusterCircleRef.current.remove();
      clusterCircleRef.current = null;
    }

    // 1. Farm Hub Marker (Special Glowing Icon)
    const farmIconHtml = `
      <div class="relative flex items-center justify-center">
        <span class="absolute -top-1 -left-1 w-10 h-10 rounded-full bg-emerald-500/30 animate-ping"></span>
        <div class="relative z-10 w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center shadow-xl border-2 border-emerald-300 ring-2 ring-emerald-950">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </div>
        <div class="absolute top-10 whitespace-nowrap bg-slate-900/95 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 shadow-lg pointer-events-none">
          =�� Farm Hub
        </div>
      </div>
    `;

    const farmIcon = L.divIcon({
      className: 'custom-farm-marker',
      html: farmIconHtml,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const farmMarker = L.marker([farm.lat, farm.lng], { icon: farmIcon }).addTo(map);
    farmMarker.bindPopup(`
      <div class="p-3.5 max-w-xs">
        <div class="flex items-center justify-between pb-2 border-b border-emerald-500/30 mb-2">
          <span class="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/40">ORIGIN HUB</span>
          <span class="text-xs text-slate-400 font-mono">06:30 AM Dispatch</span>
        </div>
        <h4 class="font-bold text-sm text-white">${farm.name}</h4>
        <p class="text-xs text-slate-300 mt-1">${farm.address}</p>
        <div class="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span class="text-slate-400">Manager:</span>
          <span class="text-emerald-400 font-medium">${farm.contactPerson}</span>
        </div>
      </div>
    `);
    markersRef.current[farm.id] = farmMarker;

    // 2. Customer Markers (Numbered Stops A, B, C)
    customers.forEach((cust, idx) => {
      const isSelected = selectedCustomerId === cust.id;
      const letter = String.fromCharCode(65 + idx); // A, B, C
      const badgeColor = idx === 0 ? 'from-teal-600 to-emerald-500' : idx === 1 ? 'from-emerald-600 to-teal-500' : 'from-cyan-600 to-teal-600';

      const custIconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${isSelected ? '<span class="absolute -top-1.5 -left-1.5 w-11 h-11 rounded-full bg-emerald-400/40 animate-ping"></span>' : ''}
          <div class="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br ${badgeColor} text-white flex items-center justify-center shadow-lg border-2 ${isSelected ? 'border-amber-400 ring-4 ring-amber-400/30 scale-110' : 'border-white ring-2 ring-slate-900'} transition-all">
            <span class="font-extrabold text-xs">${letter}</span>
          </div>
          <div class="absolute top-9 whitespace-nowrap bg-slate-900/95 text-slate-100 text-[10px] font-semibold px-2 py-0.5 rounded shadow-lg border border-slate-700 pointer-events-none">
            Stop #${idx + 1} (${cust.weightKg} kg)
          </div>
        </div>
      `;

      const custIcon = L.divIcon({
        className: `custom-cust-marker-${cust.id}`,
        html: custIconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const custMarker = L.marker([cust.lat, cust.lng], { icon: custIcon }).addTo(map);

      // Popup Content
      const produceListHtml = cust.produceItems?.map(item => `
        <li class="flex justify-between text-xs py-0.5">
          <span class="text-slate-300">G�� ${item.name}</span>
          <span class="text-emerald-400 font-mono font-medium">${item.quantity}</span>
        </li>
      `).join('') || '';

      custMarker.bindPopup(`
        <div class="p-3.5 max-w-sm">
          <div class="flex items-center justify-between pb-2 border-b border-emerald-500/30 mb-2">
            <span class="px-2 py-0.5 bg-slate-800 text-teal-300 text-[10px] font-bold rounded-full border border-teal-500/40">
              STOP #${idx + 1} G�� CUSTOMER ${letter}
            </span>
            <span class="text-xs font-semibold px-1.5 py-0.5 rounded ${cust.priority === 'High' ? 'bg-red-950 text-red-400 border border-red-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'}">
              ${cust.priority} Priority
            </span>
          </div>
          <h4 class="font-bold text-sm text-white">${cust.name}</h4>
          <p class="text-xs text-slate-300 mt-0.5">${cust.address}</p>
          
          <div class="mt-2 p-2 rounded bg-slate-950/70 border border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Perishable Farm Basket:</span>
            <ul class="mt-1 space-y-0.5">${produceListHtml}</ul>
          </div>

          <div class="mt-2.5 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-slate-400 text-[10px] block">Payload Weight</span>
              <span class="text-amber-400 font-bold font-mono">${cust.weightKg} kg</span>
            </div>
            <div>
              <span class="text-slate-400 text-[10px] block">Delivery OTP</span>
              <span class="text-emerald-400 font-bold font-mono tracking-widest">${cust.otp}</span>
            </div>
          </div>
        </div>
      `);

      custMarker.on('click', () => {
        onSelectCustomer(cust);
      });

      markersRef.current[cust.id] = custMarker;
    });

    // 3. Draw Delivery Route Line
    const routeColor = isOptimized ? '#10b981' : '#f59e0b';
    const polyline = L.polyline(DETAILED_ROUTE_COORDS, {
      color: routeColor,
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: isOptimized ? undefined : '8, 8',
    }).addTo(map);

    // Add glowing underline for visual impact
    const glowLine = L.polyline(DETAILED_ROUTE_COORDS, {
      color: isOptimized ? '#34d399' : '#fbbf24',
      weight: 10,
      opacity: 0.25,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    routePolylineRef.current = polyline;

    // 4. Geofence / Cluster Radius Overlay
    if (showGeofence) {
      const clusterCenter: [number, number] = [8.544, 76.956];
      const circle = L.circle(clusterCenter, {
        radius: 2200, // 2.2 km
        color: '#10b981',
        fillColor: '#059669',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '5, 5',
      }).addTo(map);
      clusterCircleRef.current = circle;
    }

    // 5. Truck Delivery Marker
    const truckIconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-emerald-400/50 animate-bounce">
          <svg class="w-4 h-4 text-slate-950 fill-current" viewBox="0 0 24 24">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-2 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>
      </div>
    `;

    const truckIcon = L.divIcon({
      className: 'custom-truck-marker',
      html: truckIconHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const initialPos = DETAILED_ROUTE_COORDS[simulationStep] || DETAILED_ROUTE_COORDS[0];
    const truckMarker = L.marker(initialPos, { icon: truckIcon, zIndexOffset: 1000 }).addTo(map);
    truckMarkerRef.current = truckMarker;

    // Fit bounds smoothly
    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

  }, [customers, farm, isOptimized, showGeofence]);

  // Handle Simulation Steps
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isSimulating) {
      timer = setInterval(() => {
        setSimulationStep((prev) => {
          if (prev >= DETAILED_ROUTE_COORDS.length - 1) {
            setIsSimulating(false);
            return prev;
          }
          const next = prev + 1;
          if (truckMarkerRef.current) {
            truckMarkerRef.current.setLatLng(DETAILED_ROUTE_COORDS[next]);
          }
          return next;
        });
      }, 1200 / simSpeed);
    }
    return () => clearInterval(timer);
  }, [isSimulating, simSpeed]);

  // Recenter map handler
  const handleRecenter = () => {
    if (mapInstanceRef.current && routePolylineRef.current) {
      mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), { padding: [50, 50] });
    }
  };

  return (
    <div className="relative w-full h-[450px] lg:h-[530px] rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-slate-950">
      
      {/* Real-time Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Top Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Badge: Route Status */}
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/30 text-xs shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">
            {isOptimized ? 'Route: AI-Optimized Sequence' : 'Route: Unoptimized Multi-Stop'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-mono font-medium">{metrics.totalDistanceKm} km G�� {metrics.estimatedTimeMin} min</span>
        </div>

        {/* Right Tools: Map Style & Geofence Toggle */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg text-xs">
          
          <button
            onClick={() => setShowGeofence(!showGeofence)}
            className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
              showGeofence ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Cluster 1 Geofence Perimeter"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Geofence</span>
          </button>

          <div className="h-4 w-px bg-slate-800" />

          {/* Theme switcher */}
          <button
            onClick={() => setMapTheme(mapTheme === 'dark' ? 'carto' : mapTheme === 'carto' ? 'osm' : 'dark')}
            className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 flex items-center gap-1 transition"
            title="Switch Map Tile Style"
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span className="capitalize">{mapTheme}</span>
          </button>

          <button
            onClick={handleRecenter}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            title="Recenter Map View"
          >
            <LocateFixed className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Floating Bottom: Delivery Simulator Controller */}
      <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
        <div className="pointer-events-auto max-w-2xl mx-auto rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-emerald-500/40 p-3 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Simulation Status */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Truck className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Live GPS Delivery Simulation</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Step {simulationStep + 1}/{DETAILED_ROUTE_COORDS.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {simulationStep === 0 && 'At Farm Origin Hub G�� Cargo Loaded (85 kg)'}
                  {simulationStep > 0 && simulationStep < 4 && 'Transit to Customer A (Kowdiar)'}
                  {simulationStep >= 4 && simulationStep < 8 && 'Stop 1 Complete G�� Transit to Customer B (Sasthamangalam)'}
                  {simulationStep >= 8 && simulationStep < 12 && 'Stop 2 Complete G�� Transit to Customer C (Vellayambalam)'}
                  {simulationStep === 12 && 'All 3 Cluster Deliveries Completed Successfully! =���'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setSimSpeed(simSpeed === 1 ? 2 : 1)}
                className="px-2 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                {simSpeed}x
              </button>

              <button
                onClick={() => {
                  setSimulationStep(0);
                  if (truckMarkerRef.current) {
                    truckMarkerRef.current.setLatLng(DETAILED_ROUTE_COORDS[0]);
                  }
                  setIsSimulating(false);
                }}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
                title="Reset Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
                  isSimulating 
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25'
                }`}
              >
                {isSimulating ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Sim</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{simulationStep > 0 && simulationStep < DETAILED_ROUTE_COORDS.length - 1 ? 'Resume' : 'Start Sim'}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

