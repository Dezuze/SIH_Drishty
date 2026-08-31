import React from 'react';
import { Package, Truck, Navigation, Clock } from 'lucide-react';

interface MetricsHeaderProps {
  ordersCount: number;
  vehicleCapacityKg: number;
  totalDistanceKm: number;
  estimatedTimeMin: number;
}

export const MetricsHeader: React.FC<MetricsHeaderProps> = ({
  ordersCount,
  vehicleCapacityKg,
  totalDistanceKm,
  estimatedTimeMin,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {/* 1. Orders: 3 */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Orders</span>
          <Package className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {ordersCount}
          </span>
          <span className="text-xs text-slate-400">Total</span>
        </div>
      </div>

      {/* 2. Vehicle Capacity: 150 kg */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Vehicle Capacity</span>
          <Truck className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {vehicleCapacityKg}
          </span>
          <span className="text-xs text-slate-400 font-semibold">kg</span>
        </div>
      </div>

      {/* 3. Total Distance: 24.6 km */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Total Distance</span>
          <Navigation className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {totalDistanceKm}
          </span>
          <span className="text-xs text-emerald-400 font-bold">km</span>
        </div>
      </div>

      {/* 4. Estimated Delivery Time: 52 min */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Estimated Delivery Time</span>
          <Clock className="w-4 h-4 text-teal-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono">
            {estimatedTimeMin}
          </span>
          <span className="text-xs text-teal-300 font-bold">min</span>
        </div>
      </div>
    </div>
  );
};

