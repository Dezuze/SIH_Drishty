import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  Truck,
  Sprout,
  ShoppingBag,
  ArrowLeft,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';

export const Login: React.FC = () => {
  const { user, isAuthenticated, login, register, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/profile';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'customer' | 'farmer' | 'driver'>('customer');
  const [regAddress, setRegAddress] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both email and password');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(loginEmail.trim(), loginPassword);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill all required fields');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    setIsSubmitting(true);
    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        role: regRole,
        address: regAddress.trim(),
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickRole = async (role: 'customer' | 'farmer' | 'driver') => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await quickLogin(role);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to switch demo user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-slate-50 text-slate-900 flex items-center justify-center px-4 pt-28 pb-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white/90 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        {/* Top Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-400 font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Marketplace</span>
          </button>
          <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
            Secure Portal
          </span>
        </div>

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">KISAN DRISHTI</h1>
          <p className="text-xs text-slate-600">
            Empowering Farmers, Logistics, and Consumers with Direct Fresh Harvests
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'register' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign In form */}
        {activeTab === 'login' && (
          <div className="space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  <span>Email or Phone</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. customer@kisan.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:border-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                    <span>Password</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:border-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-[11px] font-bold text-slate-600 text-center mb-3 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Demo Profiles</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickRole('customer')}
                  disabled={isSubmitting}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-emerald-500/40 text-center transition-all cursor-pointer group"
                >
                  <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-900 block">Customer</span>
                  <span className="text-[9px] text-slate-600">Anjali (Kochi)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickRole('farmer')}
                  disabled={isSubmitting}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-amber-500/40 text-center transition-all cursor-pointer group"
                >
                  <Sprout className="w-4 h-4 mx-auto mb-1 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-900 block">Farmer</span>
                  <span className="text-[9px] text-slate-600">Ramesh</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickRole('driver')}
                  disabled={isSubmitting}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-blue-500/40 text-center transition-all cursor-pointer group"
                >
                  <Truck className="w-4 h-4 mx-auto mb-1 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-900 block">Driver</span>
                  <span className="text-[9px] text-slate-600">Rajesh EV</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sign Up form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Maya Suresh"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:border-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email *</label>
                <input
                  type="email"
                  placeholder="name@mail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:border-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Role</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'customer', label: 'Consumer', icon: ShoppingBag },
                  { key: 'farmer', label: 'Farmer', icon: Sprout },
                  { key: 'driver', label: 'Driver', icon: Truck },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = regRole === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setRegRole(item.key as any)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/80 text-white font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 mx-auto mb-0.5" />
                      <span className="text-[10px] block">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Address / City</label>
              <input
                type="text"
                placeholder="House / Farm address, District"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password *</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:border-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Kisan Account</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
export default Login;
