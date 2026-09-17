import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Clock, Navigation, ArrowRight, Download, PhoneCall, Heart } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export const ThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'DR001';
  const actionType = searchParams.get('type') || 'order'; // 'order' | 'newsletter' | 'vendor'

  return (
    <div className="min-h-[85vh] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Thank You • KisanDirect" 
        description="Thank you for supporting local farmers directly on KisanDirect. Your fresh organic produce is scheduled for morning harvest and cold-chain delivery."
        canonicalPath="/thank-you"
      />

      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Main Success Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 text-center space-y-6">
          
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
            <CheckCircle2 size={44} />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 uppercase tracking-wider">
              {actionType === 'order' ? 'Harvest Order Confirmed' : 'Action Successfully Recorded'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Thank You for Supporting Local Farmers!
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              Your direct farm purchase empowers organic cultivators with 100% fair-trade compensation and zero middleman commissions.
            </p>
          </div>

          {actionType === 'order' && (
            <>
              {/* Order Reference Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between flex-wrap gap-3 text-left">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Tracking Order Reference</div>
                  <div className="text-base font-black text-slate-900 font-mono">#{orderId}</div>
                </div>
                <Link
                  to={`/tracking/${orderId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  <Navigation size={14} /> Open Live GPS Radar
                </Link>
              </div>

              {/* Timeline Steps */}
              <div className="pt-4 border-t border-slate-100 text-left space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Harvest &amp; Fulfillment Schedule
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <Clock size={14} /> 05:30 AM Tomorrow
                    </div>
                    <div className="text-slate-600">Fresh morning field harvest by verified producer.</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-blue-800">
                      <Truck size={14} /> 07:00 AM Dispatch
                    </div>
                    <div className="text-slate-600">Refrigerated cold-chain transit to your area.</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800">
                      <Package size={14} /> 08:30 AM Doorstep
                    </div>
                    <div className="text-slate-600">Eco-friendly bag handover at your doorstep.</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Browse More Produce <ArrowRight size={16} />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-colors cursor-pointer"
            >
              Back to Home
            </Link>
          </div>

        </div>

        {/* Customer Helpline Card */}
        <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider justify-center sm:justify-start">
              <Heart size={14} className="fill-emerald-400 text-emerald-400" /> Dedicated Farmer Care
            </div>
            <h3 className="text-lg font-bold text-white">Have questions about your harvest dispatch?</h3>
            <p className="text-emerald-200 text-xs">Our Kerala customer care hotline is active from 6:00 AM to 9:00 PM daily.</p>
          </div>
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors shrink-0 shadow-lg cursor-pointer"
          >
            <PhoneCall size={15} /> Call Farmer Desk
          </a>
        </div>

      </div>
    </div>
  );
};

export default ThankYou;
