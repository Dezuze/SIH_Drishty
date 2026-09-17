import React, { useState } from 'react';
import {
  Sprout, Heart, Phone, Mail,
  CheckCircle2, Send, Sparkles, ShieldCheck,
  Clock, ThermometerSnowflake, Leaf, Lock
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics' | 'profile' | 'vendors') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() && emailInput.includes('@')) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f0fdf4', borderTop: '1px solid #a7f3d0' }}>

      {/* Main Row */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem 2rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', marginBottom: '1rem', alignItems: 'start' }}>

          {/* Brand — compact horizontal layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <button onClick={() => onNavigate('marketplace')} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: 'fit-content' }}>
              <img 
                src="/kisandirect-icon.png" 
                alt="KisanDirect" 
                style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'contain', border: '1px solid #a7f3d0', background: '#ffffff', boxShadow: '0 2px 8px rgba(16,185,129,0.2)' }} 
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
                    Kisan<span style={{ color: '#059669' }}>Direct</span>
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#4b5563', fontWeight: 600 }}>Connecting Farmers to Consumers</div>
              </div>
            </button>

            {/* Status + badges in one row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 9999, background: '#ecfdf5', border: '1px solid #a7f3d0', fontSize: 11, color: '#065f46', fontWeight: 600 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'block', flexShrink: 0 }} />
                AgriRoute: <strong style={{ color: '#059669' }}>Live</strong>
              </span>
              {[
                { label: 'Organic Alliance', icon: <Leaf size={11} color="#059669" /> },
                { label: 'ONDC', icon: <Lock size={11} color="#d97706" /> },
                { label: 'FSSAI', icon: <CheckCircle2 size={11} color="#059669" /> }
              ].map(b => (
                <span key={b.label} style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {b.icon}
                  <span>{b.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Contact + Newsletter — compact horizontal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d97706' }}>Farmer Care &amp; Alerts</div>

            {/* Phone + Email in one row */}
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <a href='tel:+914842901234' style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', borderRadius: 9, background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none', flex: 1, transition: 'border-color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#a7f3d0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e2e8f0'; }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={11} color='#059669' />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>Kochi Hotline</div>
                  <div style={{ fontSize: 11.5, fontFamily: 'monospace', fontWeight: 700 }}>+91 484 290 1234</div>
                </div>
              </a>
              <a href='mailto:support@kisanmarket.in' style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', borderRadius: 9, background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none', flex: 1, transition: 'border-color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#a7f3d0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e2e8f0'; }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={11} color='#2563eb' />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>Email</div>
                  <div style={{ fontSize: 11.5, fontFamily: 'monospace', fontWeight: 700 }}>support@kisanmarket.in</div>
                </div>
              </a>
            </div>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <Sparkles size={11} color='#f59e0b' /> Updates
              </span>
              <input type='email' placeholder='Your email' value={emailInput} onChange={e => setEmailInput(e.target.value)}
                style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12, color: '#0f172a', background: 'rgba(255,255,255,0.9)', outline: 'none', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              />
              <button type='submit' style={{ padding: '6px 10px', borderRadius: 8, background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }} aria-label='Subscribe'>
                <Send size={12} />
              </button>
            </form>
            {subscribed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#059669' }}>
                <CheckCircle2 size={12} /> Subscribed to harvest drops!
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #d1fae5', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>© 2026 KisanDirect</span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>Connecting Farmers Directly to Consumers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#94a3b8' }}>Simulated:</span>
            {['UPI QR', 'Razorpay', 'RuPay'].map(gw => (
              <span key={gw} style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569' }}>{gw}</span>
            ))}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8', marginLeft: 4 }}>
              Crafted with <Heart size={12} color='#ef4444' fill='#ef4444' /> for Kerala farmers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;