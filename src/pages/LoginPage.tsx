import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Store, Eye, EyeOff, Check } from 'lucide-react';

type MainViewType = 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics' | 'purchase' | 'login' | 'payment' | 'vendor';

interface LoginPageProps {
  onNavigate: (view: MainViewType) => void;
}

const USER_KEY = 'ann_user_session';

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { addToast, grandTotal } = useCart();

  const [role, setRole] = useState<'consumer' | 'vendor'>('consumer');
  const [email, setEmail] = useState('ananya.consumer@gmail.com');
  const [password, setPassword] = useState('ConsumerPass123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const fromPurchase = (() => {
    try {
      return !!localStorage.getItem('ann_purchase_details');
    } catch {
      return false;
    }
  })();

  const switchRole = (newRole: 'consumer' | 'vendor') => {
    setRole(newRole);
    if (newRole === 'consumer') {
      setEmail('ananya.consumer@gmail.com');
      setPassword('ConsumerPass123');
    } else {
      setEmail('ramesh.patel@kisanfarm.in');
      setPassword('FarmerPass456');
    }
  };

  const fillDemo = (demoRole: 'consumer' | 'vendor') => {
    switchRole(demoRole);
    addToast(`${demoRole === 'consumer' ? 'Consumer' : 'Farmer / Vendor'} credentials loaded!`, 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      name: role === 'consumer' ? 'Ananya Sharma' : 'Farmer Ramesh Patel',
      email,
      role,
      isLoggedIn: true,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch { /* ignore */ }

    if (role === 'consumer') {
      addToast(`Logged in as ${user.name}! Proceeding to Payment...`, 'success');
      setTimeout(() => onNavigate('payment'), 600);
    } else {
      addToast(`Welcome ${user.name}! Redirecting to Vendor Dashboard...`, 'success');
      setTimeout(() => onNavigate('vendor'), 600);
    }
  };

  const handleExternalAuth = (provider: string) => {
    addToast(`Connecting to ${provider}...`, 'info');
    setTimeout(() => {
      const user = {
        name: role === 'consumer' ? 'Ananya Sharma' : 'Farmer Ramesh Patel',
        email,
        role,
        isLoggedIn: true,
        timestamp: Date.now(),
      };
      try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch { /* ignore */ }
      addToast(`Signed in via ${provider}!`, 'success');
      setTimeout(() => {
        if (role === 'consumer') onNavigate('payment');
        else onNavigate('vendor');
      }, 400);
    }, 800);
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Stepper */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-16 z-10 py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-0">
          {['Cart', 'Purchase', 'Login', 'Payment'].map((step, idx) => {
            const isCurrent = idx === 2;
            const isDone = idx < 2;
            return (
              <React.Fragment key={step}>
                <button
                  onClick={() => {
                    if (idx === 0) onNavigate('cart');
                    else if (idx === 1) onNavigate('purchase');
                    else if (idx === 2) onNavigate('login');
                  }}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isCurrent ? 'text-emerald-400' : isDone ? 'text-emerald-300 cursor-pointer' : 'text-slate-500'}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 border ${isCurrent ? 'bg-emerald-500 border-emerald-400 text-slate-950' : isDone ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 text-slate-500'}`}>
                    {isDone ? <Check className="w-3 h-3" /> : idx + 1}
                  </span>
                  <span className="hidden sm:inline">{step}</span>
                </button>
                {idx < 3 && <div className={`flex-1 h-px mx-2 ${idx < 2 ? 'bg-emerald-600' : 'bg-slate-700'}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Checkout context banner */}
        {fromPurchase && (
          <div className="mb-6 flex items-center gap-4 bg-blue-950/60 border border-blue-500/30 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg shrink-0">🛒</div>
            <div>
              <p className="font-bold text-blue-300 text-sm">Checkout in Progress</p>
              <p className="text-blue-400 text-xs">Please sign in to your consumer account to complete your purchase and continue to the Payment Page.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
          {/* Left: Farm Photo Panel */}
          <div className="relative hidden md:flex flex-col justify-end min-h-[520px] bg-slate-800 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80"
              alt="Smiling farmer with harvest"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="relative z-10 p-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-300 mb-4">
                🌱 DIRECT FARM TO CONSUMER
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2 leading-snug">
                Fair Profits for Farmers.<br />Fresh Produce for Consumers.
              </h2>
              <p className="text-slate-300 text-sm mb-5 leading-relaxed">
                By bypassing brokers and wholesale middlemen, farmers earn up to 85% higher margins while consumers enjoy farm-gate freshness.
              </p>
              <div className="flex items-center gap-5 pt-4 border-t border-white/20">
                <div>
                  <p className="text-2xl font-extrabold text-emerald-400 font-mono">0%</p>
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">Middlemen Commissions</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <p className="text-2xl font-extrabold text-yellow-300 font-mono">24h</p>
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">Harvest to Doorstep</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form Panel */}
          <div className="p-7 flex flex-col justify-center">
            <h1 className="text-2xl font-extrabold text-white mb-1">Welcome Back</h1>
            <p className="text-slate-400 text-sm mb-5">Choose your account type to continue to the platform.</p>

            {/* Role Tabs */}
            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 mb-5 gap-1">
              <button type="button" onClick={() => switchRole('consumer')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${role === 'consumer' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                id="tabConsumer" role="tab" aria-selected={role === 'consumer'}>
                <ShoppingBag className="w-3.5 h-3.5" /> Consumer
              </button>
              <button type="button" onClick={() => switchRole('vendor')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${role === 'vendor' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                id="tabVendor" role="tab" aria-selected={role === 'vendor'}>
                <Store className="w-3.5 h-3.5" /> Farmer / Vendor
              </button>
            </div>

            {/* Demo Fill Box */}
            <div className="bg-emerald-950/40 border border-dashed border-emerald-500/40 rounded-xl p-3 mb-5">
              <p className="text-xs font-bold text-white mb-1">⚡ Quick Demo Login Fill:</p>
              <p className="text-[11px] text-slate-400 mb-2">
                {role === 'consumer' ? 'Consumer flow: Leads directly to Payment Page.' : 'Farmer flow: Leads to Vendor Dashboard & Analytics.'}
              </p>
              <div className="flex gap-2 flex-wrap">
                <button type="button" onClick={() => fillDemo('consumer')}
                  className="text-[11px] px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg font-semibold cursor-pointer transition-colors">
                  👤 Fill Consumer (Ananya)
                </button>
                <button type="button" onClick={() => fillDemo('vendor')}
                  className="text-[11px] px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg font-semibold cursor-pointer transition-colors">
                  👨‍🌾 Fill Farmer (Ramesh)
                </button>
              </div>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} id="authLoginForm" className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5" id="loginEmailLabel">
                  {role === 'consumer' ? 'Consumer Email or Phone' : 'Registered Farmer / Vendor ID'}
                </label>
                <input type="text" id="loginEmail" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                  <button type="button" onClick={() => addToast('Password reset link will be sent to your registered contact.', 'info')}
                    className="text-xs text-emerald-400 hover:underline cursor-pointer">Forgot password?</button>
                </div>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} id="loginPassword" required value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input type="checkbox" id="rememberMeCheckbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                  className="accent-emerald-500" />
                Remember this device
              </label>

              <button type="submit" id="btnAuthSubmit"
                className={`w-full py-3 rounded-xl font-extrabold text-sm text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all ${role === 'consumer' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'}`}>
                {role === 'consumer' ? 'Sign In as Consumer →' : 'Sign In to Farmer Portal →'}
              </button>

              <p id="routeIndicatorNote" className="text-center text-[11px] text-slate-500">
                Destined for: <strong className="text-slate-300">{role === 'consumer' ? 'Payment Page (Hanna\'s module)' : 'Vendor Page & Analytics (Ihsana\'s module)'}</strong>
              </p>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-[11px] text-slate-500 font-bold">OR SIGN IN WITH</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => handleExternalAuth('Mobile OTP')}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors">
                  📱 Mobile OTP
                </button>
                <button type="button" onClick={() => handleExternalAuth('Google')}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Google
                </button>
              </div>

              <p className="text-center text-xs text-slate-500">
                New to KisanDirect?{' '}
                <button type="button" onClick={() => addToast('Registration portal opening soon!', 'info')}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer">Create an account</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
