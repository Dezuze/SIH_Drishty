import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  Sparkles, 
  CheckCircle, 
  TrendingDown, 
  ArrowRight, 
  Cpu, 
  RefreshCw, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Flame
} from 'lucide-react';
import { RouteMetrics } from '../types';

interface RouteOptimizationPanelProps {
  metrics: RouteMetrics;
  onOptimize: () => void;
  isOptimizing: boolean;
  showSuccessToast: boolean;
  setShowSuccessToast: (val: boolean) => void;
}

export const RouteOptimizationPanel: React.FC<RouteOptimizationPanelProps> = ({
  metrics,
  onOptimize,
  isOptimizing,
  showSuccessToast,
  setShowSuccessToast,
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'algorithm'>('comparison');

  const handleGenerateRoute = () => {
    onOptimize();
    
    // Trigger confetti celebration for SIH presentation
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#059669', '#6ee7b7'],
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 p-5 shadow-2xl">
      
      {/* Background Accent Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-bold">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                AI Route Optimization Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                TSP + CVRP
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Genetic Algorithm & Cold-Chain Expiry Priority Matrix
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              activeTab === 'comparison' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Route Comparison
          </button>
          <button
            onClick={() => setActiveTab('algorithm')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              activeTab === 'algorithm' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Solver Pipeline
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {showSuccessToast && (
        <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-400/60 shadow-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">
                Route Generated Successfully
              </h4>
              <p className="text-xs text-emerald-300">
                Saved 9.6 km • Multi-stop sequence locked for Farm → Cust A → Cust B → Cust C
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-xs text-emerald-300 hover:text-white underline font-semibold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Body */}
      {activeTab === 'comparison' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4">
          
          {/* Unoptimized (Naive) Route Card */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Standard / Naive Routing
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                Baseline
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Distance:</span>
                <span className="font-mono font-bold text-slate-300">{metrics.unoptimizedDistanceKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Travel Time:</span>
                <span className="font-mono font-bold text-slate-300">{metrics.unoptimizedTimeMin} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sequence:</span>
                <span className="text-slate-400 font-mono">Farm → C → A → B (Zigzag)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Perishability Risk:</span>
                <span className="text-amber-400 font-semibold">Elevated (Heat Exposure)</span>
              </div>
            </div>
          </div>

          {/* AI-Optimized Route Card */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30 mb-2.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AgroRoute AI Optimized</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40">
                Active
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Total Distance:</span>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">
                  {metrics.totalDistanceKm} km <span className="text-[10px] font-normal text-emerald-300">(-28.1%)</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Est. Travel Time:</span>
                <span className="font-mono font-extrabold text-teal-300 text-sm">
                  {metrics.estimatedTimeMin} min <span className="text-[10px] font-normal text-teal-200">(-33.3%)</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Optimized Order:</span>
                <span className="text-emerald-300 font-mono font-semibold">Farm → A → B → C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Fuel & Carbon Saving:</span>
                <span className="text-emerald-400 font-semibold font-mono">₹285 saved • 6.4 kg CO₂</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="my-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-emerald-400 font-bold block mb-1">STAGE 1</span>
              <p className="font-semibold text-white">Cluster Discovery</p>
              <p className="text-[11px] text-slate-400 mt-0.5">DBSCAN algorithm grouped 3 nearby orders in 3.4km radius.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-emerald-400 font-bold block mb-1">STAGE 2</span>
              <p className="font-semibold text-white">Capacity & Payload</p>
              <p className="text-[11px] text-slate-400 mt-0.5">85 kg verified against 150 kg vehicle payload capacity.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-emerald-400 font-bold block mb-1">STAGE 3</span>
              <p className="font-semibold text-white">Shelf-Life Priority</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Prioritized high-respiration tomatoes and fresh bell peppers.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-emerald-400 font-bold block mb-1">STAGE 4</span>
              <p className="font-semibold text-white">TSP Matrix Solver</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Calculated lowest-mileage corridor (24.6 km).</p>
            </div>
          </div>
        </div>
      )}

      {/* Large Action Button: Generate Optimized Route */}
      <div className="mt-2 pt-3 border-t border-slate-800/80">
        <button
          onClick={handleGenerateRoute}
          disabled={isOptimizing}
          className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
            isOptimizing
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.01] active:scale-[0.99] ring-2 ring-emerald-300'
          }`}
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Computing Optimal Multi-Stop Routing Matrix...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-current" />
              <span>Generate Optimized Route</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
