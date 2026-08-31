import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LocateFixed, Layers } from 'lucide-react';
import { LocationPoint } from '../types';
import { ROAD_POLYLINE_COORDINATES } from '../data/demoData';

interface SimplifiedMapProps {
  farm: LocationPoint;
  customers: LocationPoint[];
  showLocations: boolean;
  showRoute: boolean;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  simulationStep: number;
  setSimulationStep: React.Dispatch<React.SetStateAction<number>>;
  selectedCustomerId?: string;
  onSelectCustomer: (cust: LocationPoint) => void;
}

export const SimplifiedMap: React.FC<SimplifiedMapProps> = ({
  farm,
  customers,
  showLocations,
  showRoute,
  isSimulating,
  setIsSimulating,
  simulationStep,
  setSimulationStep,
  selectedCustomerId,
  onSelectCustomer,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeGlowRef = useRef<L.Polyline | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [mapTheme, setMapTheme] = useState<'osm' | 'voyager'>('voyager');

  const tileLayers = {
    voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [8.55, 76.96],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    tileLayerRef.current = L.tileLayer(tileLayers[mapTheme], {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Theme
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(tileLayers[mapTheme]);
  }, [mapTheme]);

  // Update Markers, Route, and Vehicle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers & polylines
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    if (routeGlowRef.current) {
      routeGlowRef.current.remove();
      routeGlowRef.current = null;
    }
    if (truckMarkerRef.current) {
      truckMarkerRef.current.remove();
      truckMarkerRef.current = null;
    }

    // 1. Farm Marker (Origin)
    const farmIconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-emerald-300 ring-2 ring-slate-900">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="absolute top-9 whitespace-nowrap bg-slate-900 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-emerald-500/40 pointer-events-none">
          Farm (Origin)
        </div>
      </div>
    `;

    const farmIcon = L.divIcon({
      className: 'farm-pin',
      html: farmIconHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const farmMarker = L.marker([farm.lat, farm.lng], { icon: farmIcon }).addTo(map);
    farmMarker.bindPopup(`
      <div class="p-2.5 max-w-xs text-xs">
        <div class="font-bold text-emerald-400 text-sm mb-1">${farm.name}</div>
        <div class="text-slate-300">${farm.address}</div>
        <div class="mt-2 text-slate-400 font-mono">${farm.lat.toFixed(4)}, ${farm.lng.toFixed(4)}</div>
      </div>
    `);
    markersRef.current[farm.id] = farmMarker;

    // 2. Customer Markers (A, B, C)
    if (showLocations) {
      customers.forEach((cust, idx) => {
        const letter = String.fromCharCode(65 + idx);
        const isSelected = selectedCustomerId === cust.id;

        const custIconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="w-7 h-7 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center font-extrabold text-xs shadow-lg border-2 ${
              isSelected ? 'border-amber-400 ring-4 ring-amber-400/40 scale-110' : 'border-emerald-400 ring-2 ring-slate-900'
            } transition-all">
              ${letter}
            </div>
            <div class="absolute top-8 whitespace-nowrap bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow border border-slate-700 pointer-events-none">
              Customer ${letter} (${cust.weightKg} kg)
            </div>
          </div>
        `;

        const custIcon = L.divIcon({
          className: `cust-pin-${cust.id}`,
          html: custIconHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const custMarker = L.marker([cust.lat, cust.lng], { icon: custIcon }).addTo(map);
        custMarker.bindPopup(`
          <div class="p-2.5 max-w-xs text-xs">
            <div class="font-bold text-white text-sm mb-1">${cust.name}</div>
            <div class="text-slate-300">${cust.address}</div>
            <div class="mt-1.5 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800">
              <span class="text-slate-400">Order Weight:</span>
              <span class="text-amber-400 font-bold font-mono">${cust.weightKg} kg</span>
            </div>
          </div>
        `);

        custMarker.on('click', () => onSelectCustomer(cust));
        markersRef.current[cust.id] = custMarker;
      });
    }

    // 3. Draw Actual Road Route (Following roads on map)
    if (showRoute) {
      // Clean outer route border/glow (Google Maps style)
      const glow = L.polyline(ROAD_POLYLINE_COORDINATES as L.LatLngTuple[], {
        color: '#3b82f6',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      routeGlowRef.current = glow;

      // Realistic Road Polyline (Bold crisp navigation line)
      const polyline = L.polyline(ROAD_POLYLINE_COORDINATES as L.LatLngTuple[], {
        color: '#2563eb',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      routePolylineRef.current = polyline;

      // 4. Vehicle Marker
      const truckIconHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-slate-900 ring-4 ring-amber-400/40 vehicle-active-pulse">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-2 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
        </div>
      `;

      const truckIcon = L.divIcon({
        className: 'truck-pin',
        html: truckIconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const currentCoord = (ROAD_POLYLINE_COORDINATES[simulationStep] || ROAD_POLYLINE_COORDINATES[0]) as L.LatLngTuple;
      const truckMarker = L.marker(currentCoord, { icon: truckIcon, zIndexOffset: 1000 }).addTo(map);
      truckMarkerRef.current = truckMarker;

      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    } else if (showLocations) {
      const allCoords: L.LatLngTuple[] = [
        [farm.lat, farm.lng],
        ...customers.map((c): L.LatLngTuple => [c.lat, c.lng])
      ];
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([farm.lat, farm.lng], 13);
    }
  }, [farm, customers, showLocations, showRoute]);

  // Vehicle Simulation Along Road Network
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isSimulating && showRoute) {
      interval = setInterval(() => {
        setSimulationStep((prev) => {
          if (prev >= ROAD_POLYLINE_COORDINATES.length - 1) {
            setIsSimulating(false);
            return prev;
          }
          // Move forward along road vertices
          const stepJump = 12; // smooth navigation speed
          const next = Math.min(prev + stepJump, ROAD_POLYLINE_COORDINATES.length - 1);
          if (truckMarkerRef.current) {
            truckMarkerRef.current.setLatLng(ROAD_POLYLINE_COORDINATES[next]);
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSimulating, showRoute]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (routePolylineRef.current) {
      mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), { padding: [40, 40] });
    } else {
      mapInstanceRef.current.setView([8.55, 76.96], 12);
    }
  };

  return (
    <div className="relative w-full h-[540px] lg:h-[640px] rounded-3xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Header Status & Controls */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
        
        {/* Route Status Tag */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs shadow-md">
          <span className={`w-2 h-2 rounded-full ${showRoute ? 'bg-blue-400 animate-pulse' : showLocations ? 'bg-teal-400' : 'bg-slate-500'}`} />
          <span className="font-semibold text-slate-200">
            {showRoute 
              ? 'Route: Farm → Customer A → Customer B → Customer C' 
              : showLocations 
              ? '4 Locations Plotted on Map' 
              : 'Farm Origin Plotted'}
          </span>
        </div>

        {/* Map Control Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-md text-xs">
          <button
            onClick={() => setMapTheme(mapTheme === 'voyager' ? 'osm' : 'voyager')}
            className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 flex items-center gap-1 transition cursor-pointer"
            title="Toggle Map Style"
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span className="uppercase">{mapTheme}</span>
          </button>

          <button
            onClick={handleRecenter}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition cursor-pointer"
            title="Recenter Map"
          >
            <LocateFixed className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Road Navigation Legend */}
      {showRoute && (
        <div className="absolute bottom-3.5 left-3.5 z-10 pointer-events-none">
          <div className="pointer-events-auto px-3.5 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs shadow-md flex items-center gap-2.5">
            <span className="w-3.5 h-1.5 bg-blue-500 rounded-full inline-block"></span>
            <span className="text-[11px] text-slate-300 font-semibold">Actual Road Network (24.6 km • 52 min)</span>
          </div>
        </div>
      )}
    </div>
  );
};

