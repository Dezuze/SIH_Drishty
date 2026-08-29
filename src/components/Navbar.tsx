import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Truck, 
  Layers, 
  FileText, 
  PlusCircle, 
  Wifi, 
  Radio,
  Clock,
  Award
} from 'lucide-react';

interface NavbarProps {
  onOpenManifest: () => void;
  onOpenAddOrder: () => void;
  isSimulating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenManifest, 
  onOpenAddOrder,
  isSimulating 
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-emerald-500/20 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Branding & SIH Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/40">
              <Sprout className="w-6 h-6 stroke-[2.5]" />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-slate-950">
                <Truck className="w-2.5 h-2.5 text-slate-950" />
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                  AgriRoute AI
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded-full">
                  Pro v2.6
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Smart India Hackathon • Smart Logistics & Route Optimization for Farmers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
              Live
            </span>
          </div>
        </div>

        {/* Center: System Telemetry & Clock */}
        <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{timeStr || '06:45:00 AM'}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Corridor: <strong className="text-white">Trivandrum Agri Hub</strong></span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-teal-400 font-medium">GPS Telematics 99.8%</span>
          </div>
          {isSimulating && (
            <>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Simulation Active
              </span>
            </>
          )}
        </div>

        {/* Right: Actions & Operator */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          <button
            onClick={onOpenAddOrder}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/90 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition shadow-sm"
            title="Simulate Adding New Customer Order"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Add Order</span>
          </button>

          <button
            onClick={onOpenManifest}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/50 border border-emerald-500/40 transition shadow-sm"
            title="View Delivery Manifest & Digital Waybill"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Digital Manifest</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Operator Profile */}
          <div className="flex items-center gap-2 pl-1">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-xs text-slate-950 ring-2 ring-emerald-500/40">
                OP
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
            </div>
            <div className="hidden xl:block text-left text-xs">
              <p className="font-semibold text-slate-200 leading-none">Logistics Operator</p>
              <p className="text-[10px] text-emerald-400 font-medium">SIH Hub Command</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
