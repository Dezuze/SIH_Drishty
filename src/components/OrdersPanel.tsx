import React from 'react';
import { 
  Package, 
  Layers, 
  MapPin, 
  Route, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw,
  Navigation,
  Check
} from 'lucide-react';
import { LocationPoint, OrderCluster, RouteSegment, LogisticsSummary } from '../types';
import { WorkflowStep } from './WorkflowStepper';

interface OrdersPanelProps {
  currentStep: WorkflowStep;
  setStep: (step: WorkflowStep) => void;
  farm: LocationPoint;
  customers: LocationPoint[];
  cluster: OrderCluster;
  segments: RouteSegment[];
  summary: LogisticsSummary;
  selectedCustomerId?: string;
  onSelectCustomer: (cust: LocationPoint) => void;
  onGenerateRoute: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetSimulation: () => void;
}

export const OrdersPanel: React.FC<OrdersPanelProps> = ({
  currentStep,
  setStep,
  farm,
  customers,
  cluster,
  segments,
  summary,
  selectedCustomerId,
  onSelectCustomer,
  onGenerateRoute,
  isSimulating,
  onToggleSimulation,
  onResetSimulation,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg justify-between">
      
      {/* ── STEP 1: ORDERS (View Orders) ────────────────────────── */}
      {currentStep === 1 && (
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">View Orders</h3>
                  <p className="text-xs text-slate-400">3 delivery orders ready for dispatch</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                3 Orders
              </span>
            </div>

            {/* List of Orders */}
            <div className="mt-4 space-y-2.5">
              {customers.map((cust, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isSelected = selectedCustomerId === cust.id;
                return (
                  <div
                    key={cust.id}
                    onClick={() => onSelectCustomer(cust)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500 ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {letter}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{cust.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              {cust.orderId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{cust.address}</p>
                          <p className="text-[11px] text-slate-300 mt-1">{cust.itemsSummary}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-amber-400 font-mono block">
                          {cust.weightKg} kg
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {cust.deliveryTime}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button: Group Nearby Orders */}
          <div className="mt-5 pt-3 border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Group Nearby Orders</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: GROUP NEARBY ORDERS ────────────────────────── */}
      {currentStep === 2 && (
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Group Nearby Orders</h3>
                  <p className="text-xs text-slate-400">Orders grouped for vehicle capacity</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Grouped
              </span>
            </div>

            {/* Group Summary Box */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">Grouped Delivery Batch</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {cluster.totalWeightKg} / {cluster.vehicleCapacityKg} kg
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-medium">Orders Grouped</span>
                  <span className="text-2xl font-bold text-white font-mono mt-0.5 block">
                    {cluster.ordersCount}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-medium">Total Payload</span>
                  <span className="text-2xl font-bold text-amber-400 font-mono mt-0.5 block">
                    {cluster.totalWeightKg} kg
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 block mb-2 font-medium">Grouped Customers:</span>
                <div className="space-y-1.5">
                  {customers.map((cust) => (
                    <div key={cust.id} className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="font-semibold text-slate-200">{cust.name}</span>
                      <span className="font-mono text-amber-400 font-bold">{cust.weightKg} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Show Locations on Map */}
          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setStep(1)}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Show Locations on Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: SHOW LOCATIONS ON MAP ──────────────────────── */}
      {currentStep === 3 && (
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Show Locations on Map</h3>
                  <p className="text-xs text-slate-400">Origin and customer delivery points</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-950 text-teal-300 border border-teal-500/40">
                4 Points
              </span>
            </div>

            {/* Locations List */}
            <div className="mt-4 space-y-2">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                    HUB
                  </span>
                  <div>
                    <span className="font-bold text-white block">Farm (Origin)</span>
                    <span className="text-[11px] text-slate-400">{farm.address}</span>
                  </div>
                </div>
                <span className="text-emerald-300 font-semibold">Origin</span>
              </div>

              {customers.map((cust, idx) => {
                const letter = String.fromCharCode(65 + idx);
                return (
                  <div key={cust.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        {letter}
                      </span>
                      <div>
                        <span className="font-bold text-white block">{cust.name}</span>
                        <span className="text-[11px] text-slate-400">{cust.address}</span>
                      </div>
                    </div>
                    <span className="text-amber-400 font-mono font-bold">{cust.weightKg} kg</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons: Generate Route */}
          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setStep(2)}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => {
                onGenerateRoute();
                setStep(4);
              }}
              className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Route className="w-4 h-4" />
              <span>Generate Route</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: GENERATE ROUTE ────────────────────────────── */}
      {currentStep === 4 && (
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Route className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Delivery Route</h3>
                  <p className="text-xs text-slate-400">Farm → Customer A → Customer B → Customer C</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Route
              </span>
            </div>

            {/* Route Details Breakdown */}
            <div className="mt-3.5 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Route Details:
              </span>

              {segments.map((seg) => (
                <div 
                  key={seg.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">
                        {seg.fromTitle} → {seg.toTitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Distance</span>
                      <span className="text-emerald-400 font-bold">{seg.distanceKm} km</span>
                    </div>
                    <div className="border-l border-slate-800 pl-3">
                      <span className="text-[10px] text-slate-400 block font-sans">Travel Time</span>
                      <span className="text-teal-300 font-bold">{seg.travelTimeMin} min</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Total Summary Footer */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs mt-3">
                <span className="font-bold text-slate-200">Total Route</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-emerald-400 font-extrabold">{summary.totalDistanceKm} km</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-teal-300 font-extrabold">{summary.totalTravelTimeMin} min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Play/Pause Vehicle along Road */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={onResetSimulation}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Reset Vehicle to Farm Hub"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleSimulation}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer ${
                isSimulating
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Delivery Travel</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Simulate Vehicle Travel</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};


