import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SimplifiedUI from './pages/SimplifiedUI';
import { CartProvider } from './context/CartContext';
import { PRODUCTS, type Product, type OrderCustomerDetails } from './data/products';
import { Navbar, type MainViewType } from './components/dashboard/Navbar';
import { Marketplace } from './components/Marketplace';
import { ProductDetails } from './components/ProductDetails';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';

// Ann's module pages: Purchase → Login → Payment → Vendor handoff
import { PurchasePage } from './pages/PurchasePage';
import { LoginPage } from './pages/LoginPage';
import { PaymentPage } from './pages/PaymentPage';
import { VendorPage } from './pages/VendorPage';

// Teammate logistics dashboard components
import { MetricCards } from './components/dashboard/MetricCards';
import { MapSection } from './components/dashboard/MapSection';
import { ClusterPanel } from './components/dashboard/ClusterPanel';
import { RouteOptimizationPanel } from './components/dashboard/RouteOptimizationPanel';
import { DeliveryProgressSection } from './components/dashboard/DeliveryProgressSection';
import { VehicleInfoCard } from './components/dashboard/VehicleInfoCard';
import { WeatherTelematicsCard } from './components/dashboard/WeatherTelematicsCard';
import { RecentActivityPanel } from './components/dashboard/RecentActivityPanel';
import { ManifestModal } from './components/dashboard/ManifestModal';
import { AddOrderModal } from './components/dashboard/AddOrderModal';

import { 
  FARM_LOCATION, 
  CUSTOMER_LOCATIONS, 
  INITIAL_CLUSTER, 
  INITIAL_METRICS, 
  VEHICLE_DETAILS, 
  WEATHER_DATA, 
  INITIAL_ACTIVITIES 
} from './data/demoData';

import type { LocationPoint, RouteMetrics, ClusterInfo, ActivityEvent } from './types';

export const MainAppContent: React.FC = () => {
  // Navigation View State: Defaults to Marketplace, with instant toggle to Logistics
  const [activeView, setActiveView] = useState<MainViewType>('marketplace');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Teammate Logistics State
  const [farm] = useState<LocationPoint>(FARM_LOCATION);
  const [customers, setCustomers] = useState<LocationPoint[]>(CUSTOMER_LOCATIONS);
  const [cluster, setCluster] = useState<ClusterInfo>(INITIAL_CLUSTER);
  const [metrics, setMetrics] = useState<RouteMetrics>(INITIAL_METRICS);
  const [vehicle] = useState(VEHICLE_DETAILS);
  const [weather] = useState(WEATHER_DATA);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  const [isManifestOpen, setIsManifestOpen] = useState<boolean>(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState<boolean>(false);

  // Navigation Handler
  const handleNavigate = (view: MainViewType, productId?: number) => {
    setActiveView(view);
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Teammate Logistics Handlers
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
    
    const updatedWeight = cluster.totalWeightKg + newOrder.weightKg;
    const updatedCount = cluster.ordersCount + 1;
    
    setCluster((prev) => ({
      ...prev,
      ordersCount: updatedCount,
      totalWeightKg: updatedWeight,
      orderIds: [...prev.orderIds, newOrder.orderId || 'ORD-NEW'],
    }));

    setMetrics((prev) => ({
      ...prev,
      totalOrders: updatedCount,
      currentPayloadKg: updatedWeight,
      totalDistanceKm: 27.8,
      estimatedTimeMin: 59,
      unoptimizedDistanceKm: 39.5,
      unoptimizedTimeMin: 92,
    }));

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

  // Bridge buyer checkout order directly into logistics cluster & map
  const handleBuyerOrderPlaced = (customerDetails?: OrderCustomerDetails) => {
    if (customerDetails) {
      const randomOffsetLat = (Math.random() - 0.5) * 0.04;
      const randomOffsetLng = (Math.random() - 0.5) * 0.04;
      
      const newLogisticsPoint: LocationPoint = {
        id: `cust-${Date.now()}`,
        name: customerDetails.fullName,
        type: 'customer',
        lat: 8.5241 + randomOffsetLat,
        lng: 76.9366 + randomOffsetLng,
        address: `${customerDetails.address}, ${customerDetails.city}`,
        orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        weightKg: 12,
        contactPerson: customerDetails.fullName,
        phone: customerDetails.phoneNumber,
        deliveryWindow: customerDetails.deliverySlot || '7:00 AM - 11:00 AM',
        expectedDelivery: 'Tomorrow, 08:30 AM',
        priority: 'High',
        status: 'Pending',
        otp: String(Math.floor(1000 + Math.random() * 9000))
      };
      
      handleAddOrder(newLogisticsPoint);
    }
    handleNavigate('confirmation');
  };

  const handleSelectCustomer = (cust: LocationPoint) => {
    setSelectedCustomerId(cust.id);
  };

  const handleSimulateCompleteStop = (index: number) => {
    setSimulationStep((index + 1) * 4);
  };

  const selectedProduct: Product | undefined = PRODUCTS.find((p) => p.id === selectedProductId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Merged Navigation */}
      <Navbar 
        onOpenManifest={() => setIsManifestOpen(true)}
        onOpenAddOrder={() => setIsAddOrderOpen(true)}
        isSimulating={isSimulating}
        activeView={activeView}
        onNavigate={handleNavigate}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* 1. MARKETPLACE PAGE */}
        {activeView === 'marketplace' && (
          <Marketplace
            products={PRODUCTS}
            onViewProduct={(id) => handleNavigate('details', id)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* 2. PRODUCT DETAILS PAGE */}
        {activeView === 'details' && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => handleNavigate('marketplace')}
            onNavigate={handleNavigate}
          />
        )}

        {/* 3. CART PAGE */}
        {activeView === 'cart' && (
          <Cart onNavigate={handleNavigate} />
        )}

        {/* 4. CHECKOUT PAGE */}
        {activeView === 'checkout' && (
          <Checkout
            onNavigate={handleNavigate}
            onOrderSuccess={handleBuyerOrderPlaced}
          />
        )}

        {/* 5. ORDER CONFIRMATION PAGE */}
        {activeView === 'confirmation' && (
          <OrderConfirmation onNavigate={handleNavigate} />
        )}

        {/* 6. TEAMMATE LOGISTICS & ROUTE AI COMMAND CENTER */}
        {activeView === 'logistics' && (
          <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
            
            {/* Top Hero Banner */}
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

                {/* Route Optimization Section */}
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

          </div>
        )}

        {/* 7. ANN'S PURCHASE PAGE (Delivery Dispatch Configuration) */}
        {activeView === 'purchase' && (
          <PurchasePage onNavigate={handleNavigate} />
        )}

        {/* 8. ANN'S LOGIN PAGE (Consumer / Vendor Auth Gate) */}
        {activeView === 'login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {/* 9. ANN'S PAYMENT PAGE (Handoff to Hanna) */}
        {activeView === 'payment' && (
          <PaymentPage onNavigate={handleNavigate} />
        )}

        {/* 10. ANN'S VENDOR PAGE (Handoff to Ihsana) */}
        {activeView === 'vendor' && (
          <VendorPage onNavigate={handleNavigate} />
        )}

      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Teammate Modals */}
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

      {/* Global Toast Feedback */}
      <ToastContainer />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainAppContent />} />
          <Route path="/simplified" element={<SimplifiedUI />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
