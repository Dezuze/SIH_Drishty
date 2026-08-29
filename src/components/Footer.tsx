import React from 'react';
import { Sprout, Heart, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                <Sprout className="w-5 h-5 font-bold" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">Kisan Marketplace</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering Kerala's local farmers with direct consumer access and smart AI-powered cold chain dispatch logistics. Transparent prices and zero middlemen commissions.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-500/40">
              <ShieldCheck className="w-4 h-4" /> Direct-to-Farmer Trade
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  🌾 Browse All Farm Produce
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cart')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  🛒 Active Cart & Checkout
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('logistics')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  🚚 AgriRoute AI Command Center
                </button>
              </li>
              <li>
                <span className="text-slate-500">🌱 Organic Farmer Registry</span>
              </li>
            </ul>
          </div>

          {/* Sourcing Hubs */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">Direct Sourcing Hubs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Kochi - Green Valley Organic Farms</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Thrissur - Sunrise Agro Collectives</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Palakkad - Foothill Harvest Guild</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Wayanad - Highland Polyhouse Farms</span>
              </li>
            </ul>
          </div>

          {/* Farmer Helpline & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">Farmer Care & Support</h4>
            <p className="text-xs text-slate-400">
              Questions regarding harvest freshness, logistics dispatch or bulk orders?
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 484 290 1234 (Kochi Hub)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@kisanmarket.in</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Kisan & AgriRoute AI • Smart India Hackathon Presentation Prototype</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> for our farmers and logistics network
          </p>
        </div>
      </div>
    </footer>
  );
};
