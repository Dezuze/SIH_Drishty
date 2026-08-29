import React from 'react';
import { 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  ShieldCheck, 
  TrendingDown, 
  Leaf, 
  Sparkles,
  Award
} from 'lucide-react';
import { WeatherInfo, RouteMetrics } from '../types';

interface WeatherTelematicsCardProps {
  weather: WeatherInfo;
  metrics: RouteMetrics;
}

export const WeatherTelematicsCard: React.FC<WeatherTelematicsCardProps> = ({ 
  weather,
  metrics 
}) => {
  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
      
      <div>
        {/* Header: Weather */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Corridor Micro-Weather
              </h3>
              <p className="text-xs text-slate-400">
                {weather.location}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-extrabold text-amber-300 font-mono">
              {weather.tempCelsius}°C
            </span>
            <span className="text-[10px] text-slate-400 block">Clear & Dry</span>
          </div>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 my-3.5">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Droplets className="w-3 h-3 text-blue-400" />
              Humidity
            </span>
            <span className="font-bold text-xs text-white font-mono mt-0.5 block">{weather.humidityPercent}%</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Wind className="w-3 h-3 text-teal-400" />
              Wind
            </span>
            <span className="font-bold text-xs text-white font-mono mt-0.5 block">{weather.windSpeedKmh} km/h</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <CloudRain className="w-3 h-3 text-cyan-400" />
              Rain Risk
            </span>
            <span className="font-bold text-xs text-emerald-400 font-mono mt-0.5 block">{weather.rainRiskPercent}%</span>
          </div>
        </div>

        {/* Estimated Fuel & Carbon Savings Summary Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              Estimated Sustainability ROI
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200">
              Cluster 1 Batch
            </span>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Fuel Saved</span>
              <span className="font-mono font-bold text-white">{metrics.fuelSavedLitres} Litres (₹{metrics.costSavedInr})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Carbon Offset</span>
              <span className="font-mono font-bold text-emerald-400">{metrics.co2SavedKg} kg CO₂ eq.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Road condition status footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Road Surface: <strong className="text-white">Dry & Optimal</strong>
        </span>
        <span className="text-emerald-400 font-semibold">Zero Fog Delay</span>
      </div>

    </div>
  );
};
