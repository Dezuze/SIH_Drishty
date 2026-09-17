import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, ShoppingBag, Sprout, Navigation, HelpCircle, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export const NotFound: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="404 - Page Not Found • KisanDirect" 
        description="The requested harvest route or produce item could not be found on KisanDirect. Browse our organic catalog or search for fresh farm vegetables."
        canonicalPath="/404"
      />

      <div className="max-w-xl w-full text-center space-y-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200/80">
        
        {/* Visual Badge & 404 Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Sprout size={32} />
          </div>
          <div className="inline-block px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200">
            Error 404 • Harvest Not Found
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Looks like this field hasn't been cultivated!
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            The link you followed may be expired, mistyped, or the farm seasonal harvest has concluded. Let's get you back on route.
          </p>
        </div>

        {/* Search input to assist discovery */}
        <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search farm produce (e.g. tomatoes, avocados)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Quick Route Shortcuts */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Popular Farm Destinations
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link
              to="/"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/60 text-slate-700 hover:text-emerald-700 font-semibold text-xs transition-all group"
            >
              <Home size={18} className="mb-1 text-slate-400 group-hover:text-emerald-600" />
              <span>Home Page</span>
            </Link>

            <Link
              to="/products"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/60 text-slate-700 hover:text-emerald-700 font-semibold text-xs transition-all group"
            >
              <ShoppingBag size={18} className="mb-1 text-slate-400 group-hover:text-emerald-600" />
              <span>All Produce</span>
            </Link>

            <Link
              to="/tracking"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/60 text-slate-700 hover:text-emerald-700 font-semibold text-xs transition-all group col-span-2 sm:col-span-1"
            >
              <Navigation size={18} className="mb-1 text-slate-400 group-hover:text-emerald-600" />
              <span>Live Tracking</span>
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-2">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Go Back to Previous Screen
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
