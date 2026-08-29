import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MapPin, RotateCcw } from 'lucide-react';

import { WorkflowStepper, WorkflowStep } from './components/WorkflowStepper';
import { MetricsHeader } from './components/MetricsHeader';
import { SimplifiedMap } from './components/SimplifiedMap';
import { OrdersPanel } from './components/OrdersPanel';

import { 
  FARM_LOCATION, 
  CUSTOMER_LOCATIONS, 
  ORDER_CLUSTER, 
  LOGISTICS_SUMMARY,
  ROUTE_SEGMENTS
} from './data/demoData';

import { LocationPoint } from './types';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(1);
  const [farm] = useState<LocationPoint>(FARM_LOCATION);
  const [customers] = useState<LocationPoint[]>(CUSTOMER_LOCATIONS);
  const [cluster] = useState(ORDER_CLUSTER);
  const [summary] = useState(LOGISTICS_SUMMARY);
  const [segments] = useState(ROUTE_SEGMENTS);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isRouteGenerated, setIsRouteGenerated] = useState<boolean>(false);

  const handleSelectStep = (step: WorkflowStep) => {
    setCurrentStep(step);
    if (step === 4 && !isRouteGenerated) {
      handleGenerateRoute();
    }
  };

  const handleGenerateRoute = () => {
    setIsRouteGenerated(true);
    setCurrentStep(4);
    
    // Light celebration effect
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#059669'],
    });
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsRouteGenerated(false);
    setIsSimulating(false);
    setSimulationStep(0);
    setSelectedCustomerId(undefined);
  };

  const handleSelectCustomer = (cust: LocationPoint) => {
    setSelectedCustomerId(cust.id);
  };

  const handleToggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulationStep(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* ── Minimal Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md font-bold">
              <MapPin className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Logistics & Maps
              </h1>
              <p className="text-xs text-slate-400">
                Route planning and delivery workflow
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
            title="Reset workflow to Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

        </div>
      </header>

      {/* ── Main Workspace ──────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-4">
        
        {/* 1. Workflow Stepper */}
        <section aria-label="Workflow Stepper">
          <WorkflowStepper
            currentStep={currentStep}
            onSelectStep={handleSelectStep}
          />
        </section>

        {/* 2. Key Logistics Metrics Display */}
        <section aria-label="Logistics Metrics">
          <MetricsHeader
            ordersCount={summary.ordersCount}
            vehicleCapacityKg={summary.vehicleCapacityKg}
            totalDistanceKm={summary.totalDistanceKm}
            estimatedTimeMin={summary.totalTravelTimeMin}
          />
        </section>

        {/* 3. Main Split View: Actions Panel (Left 4 cols) & Large Interactive Map (Right 8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Left: Orders & Workflow Controller (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <OrdersPanel
              currentStep={currentStep}
              setStep={handleSelectStep}
              farm={farm}
              customers={customers}
              cluster={cluster}
              segments={segments}
              summary={summary}
              selectedCustomerId={selectedCustomerId}
              onSelectCustomer={handleSelectCustomer}
              onGenerateRoute={handleGenerateRoute}
              isSimulating={isSimulating}
              onToggleSimulation={handleToggleSimulation}
              onResetSimulation={handleResetSimulation}
            />
          </div>

          {/* Right: Large Road-accurate Interactive Map (8 Cols - Main Focus) */}
          <div className="lg:col-span-8 flex flex-col">
            <SimplifiedMap
              farm={farm}
              customers={customers}
              showLocations={currentStep >= 3}
              showRoute={currentStep === 4 || isRouteGenerated}
              isSimulating={isSimulating}
              setIsSimulating={setIsSimulating}
              simulationStep={simulationStep}
              setSimulationStep={setSimulationStep}
              selectedCustomerId={selectedCustomerId}
              onSelectCustomer={handleSelectCustomer}
            />
          </div>

        </div>

      </main>

      {/* ── Clean Minimal Footer ─────────────────────────────────── */}
      <footer className="mt-6 border-t border-slate-900 bg-slate-950 py-3.5 px-4 text-center text-xs text-slate-500">
        <p>Logistics & Maps • Road Navigation & Route Optimization</p>
      </footer>

    </div>
  );
};

export default App;

