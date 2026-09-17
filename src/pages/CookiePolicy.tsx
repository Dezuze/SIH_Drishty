import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, CheckCircle2, Sliders, ArrowLeft, Shield, Trash2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Cookie & Tracking Policy • KisanDirect" 
        description="Learn how KisanDirect uses cookies and local browser storage to keep you logged in, remember your produce cart, and cache route navigation tiles."
        canonicalPath="/cookies"
      />

      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>

        {/* Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 mb-8">
          <div className="flex items-center gap-3 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-3">
            <span className="p-2 bg-emerald-50 rounded-xl">
              <Cookie size={18} />
            </span>
            <span>Cookie &amp; Storage Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Cookie Policy
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Effective Date: September 17, 2026 • Clear breakdown of cookies and local storage tokens
          </p>
        </div>

        {/* Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">What Are Cookies &amp; Local Storage?</h2>
            <p>
              Cookies and HTML5 Local Storage are small text files and key-value records saved in your web browser. KisanDirect uses these technologies to ensure your farm harvest cart persists during browsing, keep you authenticated securely, and cache OpenStreetMap routing tiles so maps load quickly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Categories of Storage Used on KisanDirect</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 size={16} /> Strictly Necessary Storage
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Required for essential functions including <code>kisan_cart</code> (preserves cart across page refreshes), <code>kisan_auth_token</code> (maintains active login session), and CSRF protection.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                  <Sliders size={16} /> Performance &amp; Map Cache
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Stores precomputed OSRM road coordinates and tile cache in memory so live vehicle navigation runs smoothly without excessive network requests.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">Third-Party Advertising Trackers</h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <Shield size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-600">
                <strong>Zero Commercial Ad Networks:</strong> KisanDirect does not embed Google AdSense, Meta Pixel, or behavioral ad tracking cookies. Your grocery browsing preferences and harvest purchases are never shared with advertising brokers.
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900">How to Manage or Clear Cookies</h2>
            <p>
              You can modify your browser settings to block or notify you about cookies. To reset your stored preferences on KisanDirect immediately, click below:
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('kisan_cookie_consent');
                alert('Cookie consent preferences have been reset. The banner will re-appear on your next page refresh.');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <Trash2 size={14} /> Reset Cookie Consent State
            </button>
          </section>

        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
