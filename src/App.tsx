import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { MapSection } from './components/MapSection';
import { ClusterPanel } from './components/ClusterPanel';
import { RouteOptimizationPanel } from './components/RouteOptimizationPanel';
import { DeliveryProgressSection } from './components/DeliveryProgressSection';
import { VehicleInfoCard } from './components/VehicleInfoCard';
import { WeatherTelematicsCard } from './components/WeatherTelematicsCard';
import { RecentActivityPanel } from './components/RecentActivityPanel';
import { ManifestModal } from './components/ManifestModal';
import { AddOrderModal } from './components/AddOrderModal';

import { 
  FARM_LOCATION, 
  CUSTOMER_LOCATIONS, 
  INITIAL_CLUSTER, 
  INITIAL_METRICS, 
  VEHICLE_DETAILS, 
  WEATHER_DATA, 
  INITIAL_ACTIVITIES 
} from './data/demoData';

import { LocationPoint, RouteMetrics, ClusterInfo, ActivityEvent } from './types';

export const App: React.FC = () => {
  const [farm] = useState<LocationPoint>(FARM_LOCATION);
  const [customers, setCustomers] = useState<LocationPoint[]>(CUSTOMER_LOCATIONS);
  const [cluster, setCluster] = useState<ClusterInfo>(INITIAL_CLUSTER);
  const [metrics, setMetrics] = useState<RouteMetrics>(INITIAL_METRICS);
  const [vehicle, setVehicle] = useState(VEHICLE_DETAILS);
  const [weather] = useState(WEATHER_DATA);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  const [isManifestOpen, setIsManifestOpen] = useState<boolean>(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState<boolean>(false);

  // Handle Generate Optimized Route
  const handleOptimizeRoute = () => {
    setIsOptimizing(true);
    setShowSuccessToast(false);

    setTimeout(() => {
      setIsOptimizing(false);
      setShowSuccessToast(true);
      
      // Update metrics
      setMetrics((prev) => ({
        ...prev,
        totalDistanceKm: 24.6,
        estimatedTimeMin: 52,
        isOptimized: true,
        costSavedInr: 285,
        fuelSavedLitres: 2.8,
        co2SavedKg: 6.4,
      }));

      // Add activity event
      const newAct: ActivityEvent = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        title: 'Route Generated Successfully by AgroRoute Engine',
        description: 'Multi-stop sequence computed: Farm Hub → Cust A → Cust B → Cust C (24.6 km, 52 min).',
        type: 'route',
        badge: 'Optimized',
      };
      setActivities((prev) => [newAct, ...prev]);
    }, 900);
  };

  // Handle Add Customer Order Simulator
  const handleAddOrder = (newOrder: LocationPoint) => {
    setCustomers((prev) => [...prev, newOrder]);
    
    // Update cluster info
    const updatedWeight = cluster.totalWeightKg + newOrder.weightKg;
    const updatedCount = cluster.ordersCount + 1;
    
    setCluster((prev) => ({
      ...prev,
      ordersCount: updatedCount,
      totalWeightKg: updatedWeight,
      orderIds: [...prev.orderIds, newOrder.orderId || 'ORD-NEW'],
    }));

    // Update metrics
    setMetrics((prev) => ({
      ...prev,
      totalOrders: updatedCount,
      currentPayloadKg: updatedWeight,
      totalDistanceKm: 27.8,
      estimatedTimeMin: 59,
      unoptimizedDistanceKm: 39.5,
      unoptimizedTimeMin: 92,
    }));

    // Add activity event
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      title: `Order ${newOrder.orderId} Auto-Grouped into Cluster 1`,
      description: `Customer ${newOrder.contactPerson} (${newOrder.weightKg} kg) added to corridor manifest. Payload: ${updatedWeight}/150 kg.`,
      type: 'order',
      badge: '+1 Order',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleSelectCustomer = (cust: LocationPoint) => {
    setSelectedCustomerId(cust.id);
  };

  const handleSimulateCompleteStop = (index: number) => {
    setSimulationStep((index + 1) * 4);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar 
        onOpenManifest={() => setIsManifestOpen(true)}
        onOpenAddOrder={() => setIsAddOrderOpen(true)}
        isSimulating={isSimulating}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Top Hero Banner & Hackathon Pitch */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-teal-950/80 border border-emerald-500/30 p-5 sm:p-6 shadow-2xl">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md">
                  Smart India Hackathon 2026
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Farmer-to-Consumer Direct Supply Chain
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Smart Logistics & Route Optimization Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
                Empowering regional farmers with intelligent micro-clustering, capacity-constrained vehicle routing, and real-time cold-chain telematics for same-morning delivery.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 shrink-0">
              <div className="text-center px-2">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Efficiency Gain</span>
                <span className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono">+28.1%</span>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div className="text-center px-2">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Carbon Offset</span>
                <span className="text-base sm:text-lg font-extrabold text-teal-300 font-mono">6.4 kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Logistics Overview Cards */}
        <section aria-label="Logistics Overview Cards">
          <MetricCards 
            metrics={metrics} 
            vehicle={vehicle}
            isOptimizing={isOptimizing}
          />
        </section>

        {/* 2. Interactive Map & Clustered Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Center: Interactive Map & Route Optimization Section (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Interactive OpenStreetMap */}
            <section aria-label="Interactive Map with Leaflet">
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Live GIS Logistics Map (OpenStreetMap Leaflet)
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  Farm: 8.5241, 76.9366 • Corridor: 3.4 km
                </span>
              </div>

              <MapSection 
                farm={farm}
                customers={customers}
                metrics={metrics}
                isOptimized={metrics.isOptimized}
                onSelectCustomer={handleSelectCustomer}
                selectedCustomerId={selectedCustomerId}
                isSimulating={isSimulating}
                setIsSimulating={setIsSimulating}
                simulationStep={simulationStep}
                setSimulationStep={setSimulationStep}
              />
            </section>

            {/* Route Optimization Section with Large Action Button */}
            <section aria-label="Route Optimization Section">
              <RouteOptimizationPanel 
                metrics={metrics}
                onOptimize={handleOptimizeRoute}
                isOptimizing={isOptimizing}
                showSuccessToast={showSuccessToast}
                setShowSuccessToast={setShowSuccessToast}
              />
            </section>

            {/* Delivery Progress & Stop Timeline */}
            <section aria-label="Delivery Progress Timeline">
              <DeliveryProgressSection 
                farm={farm}
                customers={customers}
                simulationStep={simulationStep}
                onSimulateCompleteStop={handleSimulateCompleteStop}
              />
            </section>

          </div>

          {/* Right Column: Grouped Orders Panel & Vehicle Telematics (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Nearby Order Cluster Panel */}
            <section aria-label="Nearby Order Cluster Panel">
              <ClusterPanel 
                cluster={cluster}
                customers={customers}
                selectedCustomerId={selectedCustomerId}
                onSelectCustomer={handleSelectCustomer}
                simulationStep={simulationStep}
              />
            </section>

            {/* Vehicle Information Card */}
            <section aria-label="Vehicle Information Card">
              <VehicleInfoCard 
                vehicle={vehicle}
                isSimulating={isSimulating}
              />
            </section>

            {/* Microclimate Weather & Telematics Card */}
            <section aria-label="Weather Telematics Card">
              <WeatherTelematicsCard 
                weather={weather}
                metrics={metrics}
              />
            </section>

            {/* Recent Activity Audit Log */}
            <section aria-label="Recent Activity Stream">
              <RecentActivityPanel 
                activities={activities}
              />
            </section>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800 bg-slate-950/90 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AgriRoute AI • Smart India Hackathon Prototype Presentation</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Leaflet 1.9.4</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>OpenStreetMap</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ManifestModal 
        isOpen={isManifestOpen}
        onClose={() => setIsManifestOpen(false)}
        farm={farm}
        customers={customers}
        metrics={metrics}
        vehicle={vehicle}
        cluster={cluster}
      />

      <AddOrderModal 
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
        onAddOrder={handleAddOrder}
      />

    </div>
  );
};

export default App;

