import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { 
  Sprout, 
  Truck, 
  FileText, 
  PlusCircle, 
  Wifi, 
  Radio,
  Clock,
  Award,
  Map,
  ShoppingBag,
  Store,
  BarChart2
} from 'lucide-react';

export type MainViewType = 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics' | 'purchase' | 'login' | 'payment' | 'vendor';

interface NavbarProps {
  onOpenManifest: () => void;
  onOpenAddOrder: () => void;
  isSimulating: boolean;
  activeView: MainViewType;
  onNavigate: (view: MainViewType, productId?: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenManifest, 
  onOpenAddOrder,
  isSimulating,
  activeView,
  onNavigate
}) => {
  const { cartCount, grandTotal } = useCart();
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

  const isMarketplaceActive = ['marketplace', 'details', 'cart', 'checkout', 'confirmation'].includes(activeView);
  const isLogisticsActive = activeView === 'logistics';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-500/20 bg-slate-50/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div 
            onClick={() => onNavigate('marketplace')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src="/kisandirect-icon.png" 
              alt="KisanDirect" 
              className="w-10 h-10 rounded-xl object-contain bg-white/10 ring-2 ring-emerald-400/40 shadow-lg group-hover:scale-105 transition-transform" 
            />
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                  Kisan<span className="text-emerald-400">Direct</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded-full">
                  Logistics AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Connecting Farmers to Consumers • Smart Fleet Logistics
              </p>
            </div>
          </div>

          {/* View Mode Switcher Pills (Mobile Quick Toggle) */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => onNavigate('marketplace')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                isMarketplaceActive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
              title="Farm Marketplace"
            >
              <Store className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('logistics')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                isLogisticsActive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
              title="Route AI Logistics"
            >
              <Truck className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 rounded-xl bg-white border border-emerald-500/40 text-emerald-300"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center: Top Main Navigation Switcher (Desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-white/90 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          <button
            onClick={() => onNavigate('marketplace')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              isMarketplaceActive
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/40'
                : 'text-slate-600 hover:text-white hover:bg-slate-100/80'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Farmer Marketplace</span>
          </button>

          <button
            onClick={() => onNavigate('logistics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              isLogisticsActive
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/40'
                : 'text-slate-600 hover:text-white hover:bg-slate-100/80'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>AgriRoute Logistics AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Right: Actions, Telemetry, Cart & Operator */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Cart Quick Button */}
          <button
            onClick={() => onNavigate('cart')}
            className={`relative hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'cart' || activeView === 'checkout'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-white/90 hover:bg-slate-100 text-slate-800 border border-emerald-500/30'
            }`}
            title="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span>{cartCount === 0 ? 'Cart' : `₹${grandTotal}`}</span>
          </button>

          {/* Logistics-specific Action Buttons (Always available or when in logistics) */}
          <button
            onClick={onOpenAddOrder}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-900 border border-slate-300 transition shadow-xs cursor-pointer"
            title="Simulate Adding New Customer Order to Route"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Add Order</span>
          </button>

          <button
            onClick={onOpenManifest}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/40 transition shadow-xs cursor-pointer"
            title="View Delivery Manifest & Digital Waybill"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Digital Manifest</span>
          </button>

          <Link
            to="/analytics"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-950/60 text-amber-300 hover:bg-amber-900/80 border border-amber-500/40 transition shadow-xs cursor-pointer"
            title="Open Market Analytics & Intelligence"
          >
            <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Analytics</span>
          </Link>

          <Link
            to="/tracking"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/40 transition shadow-xs cursor-pointer"
            title="Open Live Delivery Tracking"
          >
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Live Tracking</span>
          </Link>

          <Link
            to="/driver"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white text-sky-400 hover:bg-slate-100 border border-sky-500/30 transition shadow-xs cursor-pointer"
            title="Open Driver Telematics Portal"
          >
            <Truck className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Driver Portal</span>
          </Link>

          <Link
            to="/simplified"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100/60 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-300 transition shadow-sm"
            title="Go to Simplified UI"
          >
            <span className="hidden sm:inline">Simplified UI</span>
          </Link>

          <div className="h-5 w-px bg-slate-100 hidden sm:block" />

          {/* Clock & Operator Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-emerald-400">
              <Clock className="w-3 h-3" />
              <span>{timeStr || '06:45:00 AM'}</span>
            </div>
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-[10px] text-slate-950 ring-2 ring-emerald-500/40">
                OP
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-1 ring-slate-950" />
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

