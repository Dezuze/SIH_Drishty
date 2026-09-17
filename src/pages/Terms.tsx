import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, Scale, Clock, RefreshCw, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Terms and Conditions • KisanDirect" 
        description="Read the terms of service and consumer agreement for purchasing fresh farm produce directly from local producers on KisanDirect."
        canonicalPath="/terms"
      />

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb / Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 mb-8">
          <div className="flex items-center gap-3 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-3">
            <span className="p-2 bg-emerald-50 rounded-xl">
              <FileText size={18} />
            </span>
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Effective Date: September 17, 2026 • Version 2.4 (FSSAI &amp; Consumer Protection E-Commerce Rules)
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-slate-100 pt-5">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
              <CheckCircle2 size={13} /> Direct Farmer Fair Trade
            </span>
            <span className="flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full">
              <Scale size={13} /> Legal Weights &amp; Measures
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-3 py-1 rounded-full">
              <ShieldCheck size={13} /> Consumer Dispute Protection
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">1</span>
              Platform Role &amp; Marketplace Model
            </h2>
            <p>
              KisanDirect provides a digital logistics, dispatch, and ordering infrastructure connecting agricultural producers, cooperatives, and organic farmers directly with individual consumers and retail buyers. We do not maintain bulk middleman warehouse inventories; instead, each order triggers direct farm dispatch from verified cultivators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">2</span>
              Product Freshness, Weighing &amp; Weight Tolerance
            </h2>
            <p>
              Agricultural commodities naturally lose minor moisture weight during transit. In accordance with the Legal Metrology (Packaged Commodities) Rules, all produce weighed at farm dispatch complies with maximum permissible weight variations (within ±3%). Organic certificates, FSSAI registrations, and GI (Geographical Indication) tags displayed on producer profiles are verified at vendor onboarding.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">3</span>
              Pricing, Payment &amp; Gateway Security
            </h2>
            <p>
              All listed prices are inclusive of farm-gate harvest compensation and applicable statutory taxes. Delivery charges and cold-chain handling surcharges are transparently calculated at checkout based on actual road distance. Online transactions via UPI, Credit/Debit Cards, and Net Banking are authenticated through PCI-DSS Level 1 certified gateways.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">4</span>
              Cold-Chain Logistics &amp; Doorstep Delivery SLA
            </h2>
            <p>
              Our temperature-monitored fleet and verified regional delivery drivers operate on scheduled morning and afternoon harvest time windows. Consumers receive real-time GPS road tracking via the Live Tracking portal. If an unforeseen weather event or road closure causes delay, customers are notified immediately with revised ETA estimations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">5</span>
              Perishable Goods Return &amp; Refund Guarantee
            </h2>
            <p>
              Due to the perishable nature of fresh greens, fruits, and dairy, conventional multi-day returns are not applicable. However, under our <strong>Fresh Harvest Guarantee</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>Damaged, rotten, or incorrect produce reported within 4 hours of delivery is eligible for an instant full refund or next-day fresh replacement.</li>
              <li>Customers can inspect produce at doorstep handover for Cash-on-Delivery orders before accepting the package.</li>
              <li>Refunds are processed back to the original payment source within 24–48 banking hours.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">6</span>
              Dispute Resolution &amp; Grievance Officer
            </h2>
            <p>
              In compliance with the Consumer Protection (E-Commerce) Rules, 2020:
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono">
              <div><strong>Grievance Officer:</strong> Anand V. Pillai</div>
              <div><strong>Email:</strong> legal@kisandirect.in</div>
              <div><strong>Address:</strong> KisanDirect Agritech Hub, Infopark Phase II, Kochi, Kerala 682042</div>
              <div><strong>Response SLA:</strong> Acknowledgment within 24 hours; resolution within 7 working days.</div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
