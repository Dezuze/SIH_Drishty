import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, CheckCircle2, ArrowLeft, Database, Smartphone } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Privacy Policy • KisanDirect" 
        description="Learn how KisanDirect protects and processes your personal data, delivery addresses, and live GPS telemetry under the Digital Personal Data Protection Act."
        canonicalPath="/privacy"
      />

      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
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
              <Shield size={18} />
            </span>
            <span>Data Protection Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Last Updated: September 17, 2026 • Compliant with DPDP Act 2023 &amp; Global Privacy Standards
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-slate-100 pt-5">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
              <Lock size={13} /> End-to-End TLS Encryption
            </span>
            <span className="flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full">
              <Eye size={13} /> Zero Third-Party Ad Trackers
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-3 py-1 rounded-full">
              <Database size={13} /> User Data Sovereignty
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">1</span>
              Information We Collect
            </h2>
            <p>
              We collect information strictly necessary to fulfill fresh farm deliveries, verify agricultural producer identities, and optimize cold-chain logistics routes:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Customer Profiles:</strong> Name, verified mobile phone number, delivery address, city, and postal code.</li>
              <li><strong>Farmer Data:</strong> Land survey reference, agricultural cluster district, organic certification documents, bank settlement details.</li>
              <li><strong>Driver &amp; Logistics Telematics:</strong> Real-time vehicle GPS coordinates captured strictly during active delivery assignments to power doorstep tracking.</li>
              <li><strong>Payment Records:</strong> Tokenized transaction references and payment status (card numbers and CVV codes are never stored on KisanDirect servers).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">2</span>
              How We Use Your Data
            </h2>
            <p>
              Your information is utilized solely for:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>Facilitating direct crop purchases and routing cold-chain logistics trucks.</li>
              <li>Providing real-time live map navigation for drivers and arrival radar for buyers.</li>
              <li>Processing payments and direct bank settlements for local cultivators.</li>
              <li>Preventing fraudulent orders and ensuring high food hygiene standards.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">3</span>
              Live GPS Telematics Disclosure
            </h2>
            <p>
              Our driver telematics system continuously broadcasts vehicle coordinates only while an order is in "Out for Delivery" status. Once an order is marked as "Delivered", live coordinate polling terminates immediately. Historical delivery trails are anonymized after 30 days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">4</span>
              Your Data Protection Rights
            </h2>
            <p>
              Under the Digital Personal Data Protection Act, 2023, you retain full ownership of your data:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Right to Access:</strong> View and export your order history and address records in your Profile dashboard.</li>
              <li><strong>Right to Correction:</strong> Update outdated delivery addresses, phone numbers, or vehicle details at any time.</li>
              <li><strong>Right to Erasure:</strong> Request permanent deletion of your account and saved credentials by contacting <code className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">privacy@kisandirect.in</code>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">5</span>
              Data Protection Officer Contact
            </h2>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono">
              <div><strong>Data Protection Officer:</strong> Priya N. Menon</div>
              <div><strong>Email:</strong> privacy@kisandirect.in</div>
              <div><strong>Office:</strong> KisanDirect Infopark Campus, Kochi, Kerala</div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
