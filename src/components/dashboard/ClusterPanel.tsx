import React from 'react';
import { 
  Layers, 
  Package, 
  Weight, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  Phone,
  Clock,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { ClusterInfo, LocationPoint } from '../../types/dashboardTypes';

interface ClusterPanelProps {
  cluster: ClusterInfo;
  customers: LocationPoint[];
  selectedCustomerId?: string;
  onSelectCustomer: (cust: LocationPoint) => void;
  simulationStep: number;
}

export const ClusterPanel: React.FC<ClusterPanelProps> = ({
  cluster,
  customers,
  selectedCustomerId,
  onSelectCustomer,
  simulationStep,
}) => {
  // Determine customer delivery progress status based on simulation step
  const getCustomerSimStatus = (index: number) => {
    if (simulationStep === 0) return 'Scheduled';
    if (index === 0) {
      return simulationStep >= 4 ? 'Delivered' : 'In Transit';
    }
    if (index === 1) {
      return simulationStep >= 8 ? 'Delivered' : simulationStep >= 4 ? 'In Transit' : 'Scheduled';
    }
    if (index === 2) {
      return simulationStep >= 12 ? 'Delivered' : simulationStep >= 8 ? 'In Transit' : 'Scheduled';
    }
    return 'Scheduled';
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
      
      <div>
        {/* Header with Title and Cluster Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Nearby Order Cluster
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Cluster 1
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Trivandrum Urban North Corridor G�� AI Geofence Grouping
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>94% Density Match</span>
          </div>
        </div>

        {/* 3 Core Highlight Metrics: Orders, Weight, Priority */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          
          {/* Number of Orders */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Package className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium">Orders</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                {cluster.ordersCount}
              </span>
              <span className="text-[11px] text-slate-400">Orders</span>
            </div>
          </div>

          {/* Total Weight */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Weight className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">Total Weight</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
                {cluster.totalWeightKg}
              </span>
              <span className="text-[11px] text-amber-400/80 font-bold">kg</span>
            </div>
          </div>

          {/* Delivery Priority */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-medium">Priority</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-rose-950/90 text-rose-300 border border-rose-500/40">
                {cluster.priority}
              </span>
            </div>
          </div>

        </div>

        {/* Customer Order Cards List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>Grouped Customer Manifest (Cluster 1)</span>
            <span>Tap to locate on map</span>
          </div>

          {customers.map((cust, idx) => {
            const isSelected = selectedCustomerId === cust.id;
            const letter = String.fromCharCode(65 + idx);
            const simStatus = getCustomerSimStatus(idx);

            return (
              <div
                key={cust.id}
                onClick={() => onSelectCustomer(cust)}
                className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/30 shadow-lg' 
                    : 'bg-slate-950/50 border-slate-800/90 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    
                    {/* Badge Letter */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-md shrink-0 ${
                      simStatus === 'Delivered'
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400'
                        : isSelected
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400'
                        : 'bg-slate-800 text-emerald-300 border border-slate-700'
                    }`}>
                      {simStatus === 'Delivered' ? <CheckCircle2 className="w-4 h-4" /> : letter}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">{cust.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {cust.orderId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {cust.address}
                      </p>

                      {/* Produce items chips */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {cust.produceItems?.map((item, i) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30"
                          >
                            =�� {item.name} ({item.quantity})
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right: Weight & Status */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-amber-400 font-mono block">
                      {cust.weightKg} kg
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${
                      simStatus === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : simStatus === 'In Transit'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {simStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Window: <strong className="text-slate-300 font-medium">{cust.deliveryWindow}</strong>
                  </span>
                  <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
                    OTP: {cust.otp}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Cluster Automation Note */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Auto-Grouped via DBSCAN Spatio-Temporal Model
        </span>
        <span className="font-semibold text-emerald-400">3.4 km Corridor</span>
      </div>

    </div>
  );
};

