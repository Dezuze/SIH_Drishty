import React from 'react';
import { 
  Navigation, 
  Clock, 
  Package, 
  Truck, 
  TrendingDown, 
  Leaf, 
  Sparkles,
  ThermometerSnowflake,
  ShieldCheck
} from 'lucide-react';
import { RouteMetrics, VehicleInfo } from '../types';

interface MetricCardsProps {
  metrics: RouteMetrics;
  vehicle: VehicleInfo;
  isOptimizing: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ 
  metrics, 
  vehicle,
  isOptimizing 
}) => {
  const capacityPercent = Math.min(100, Math.round((metrics.currentPayloadKg / metrics.vehicleCapacityKg) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 w-full">
      
      {/* 1. Total Distance */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/70 p-4 shadow-xl hover:border-emerald-500/50 transition-all duration-300 group">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Distance</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Navigation className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl sm:text-3xl font-extrabold text-white tracking-tight ${isOptimizing ? 'animate-pulse text-emerald-400' : ''}`}>
            {metrics.totalDistanceKm}
          </span>
          <span className="text-sm font-semibold text-emerald-400">km</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Naive: {metrics.unoptimizedDistanceKm} km</span>
          <span className="inline-flex items-center text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
            <TrendingDown className="w-3 h-3 mr-0.5" />
            -28.1%
          </span>
        </div>
      </div>

      {/* 2. Estimated Delivery Time */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/70 p-4 shadow-xl hover:border-teal-500/50 transition-all duration-300 group">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Est. Delivery Time</span>
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl sm:text-3xl font-extrabold text-white tracking-tight ${isOptimizing ? 'animate-pulse text-teal-400' : ''}`}>
            {metrics.estimatedTimeMin}
          </span>
          <span className="text-sm font-semibold text-teal-400">min</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Naive: {metrics.unoptimizedTimeMin} min</span>
          <span className="inline-flex items-center text-teal-400 font-semibold bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-500/30">
            <TrendingDown className="w-3 h-3 mr-0.5" />
            -33.3%
          </span>
        </div>
      </div>

      {/* 3. Total Orders */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/70 p-4 shadow-xl hover:border-blue-500/50 transition-all duration-300 group">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {metrics.totalOrders}
          </span>
          <span className="text-xs font-medium text-slate-400">in Cluster 1</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">100% Grouped</span>
          <span className="inline-flex items-center text-blue-400 font-semibold bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-500/30">
            3 Customers
          </span>
        </div>
      </div>

      {/* 4. Vehicle Capacity */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/70 p-4 shadow-xl hover:border-amber-500/50 transition-all duration-300 group">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition" />
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle Capacity</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {metrics.vehicleCapacityKg}
            </span>
            <span className="text-xs font-semibold text-amber-400">kg max</span>
          </div>
          <span className="text-xs font-bold text-slate-300 font-mono">{metrics.currentPayloadKg} kg load</span>
        </div>
        
        {/* Visual Payload Progress Bar */}
        <div className="mt-2 w-full">
          <div className="w-full bg-slate-950/80 rounded-full h-2 p-0.5 border border-slate-700">
            <div 
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>{capacityPercent}% Utilized</span>
            <span className="text-emerald-400 font-semibold">65 kg Available</span>
          </div>
        </div>
      </div>

      {/* 5. Fuel & Cost Savings (Bonus High Value Metric) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/70 p-4 shadow-xl hover:border-emerald-500/50 transition-all duration-300 group">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Est. Fuel & Cost</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Leaf className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
            ₹{metrics.costSavedInr}
          </span>
          <span className="text-xs font-semibold text-slate-400">saved</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-mono">2.8L Fuel</span>
          <span className="inline-flex items-center text-emerald-300 font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
            <Sparkles className="w-3 h-3 mr-0.5 text-emerald-400" />
            {metrics.co2SavedKg}kg CO₂
          </span>
        </div>
      </div>

      {/* 6. Cold-Chain Telematics */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/70 p-4 shadow-xl hover:border-cyan-500/50 transition-all duration-300 group">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cold-Chain Temp</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ThermometerSnowflake className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 tracking-tight">
            {vehicle.storageTempCelsius}°C
          </span>
          <span className="text-xs font-semibold text-slate-400">Target: {vehicle.targetTempCelsius}°C</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Fresh Produce</span>
          <span className="inline-flex items-center text-cyan-400 font-semibold bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
            <ShieldCheck className="w-3 h-3 mr-0.5" />
            Optimal
          </span>
        </div>
      </div>

    </div>
  );
};
