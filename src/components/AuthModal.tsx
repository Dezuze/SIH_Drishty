import React, { useState } from 'react';
import './AuthModal.css';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
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
  Eye,
  EyeOff
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalTab, 
    closeAuthModal, 
    login, 
    register, 
    quickLogin 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'customer' | 'farmer' | 'driver'>('customer');
  const [regAddress, setRegAddress] = useState('');

  // Sync tab when prop changes
  React.useEffect(() => {
    setActiveTab(authModalTab);
    setErrorMsg('');
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

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
      setErrorMsg('Please fill in all required fields');
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
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to switch demo user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div 
        className="auth-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative ambient gradients */}
        <div className="auth-ambient-top" />
        <div className="auth-ambient-bottom" />

        {/* Modal Header */}
        <div className="auth-header">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="auth-brand-text">
              <h2>KISAN DRISHTI</h2>
              <p>Direct Farm-to-Consumer Network</p>
            </div>
          </div>
          <button onClick={closeAuthModal} className="auth-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="auth-tabs-container">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="auth-error">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Sign In */}
        {activeTab === 'login' && (
          <div className="auth-form-container">
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="auth-input-group">
                <label className="auth-label">
                  <Mail className="w-4 h-4 auth-label-icon" />
                  <span>Email or Phone</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. customer@kisan.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="kisan-input"
                  required
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label" style={{ justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lock className="w-4 h-4 auth-label-icon" />
                    <span>Password</span>
                  </span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="kisan-input"
                    style={{ width: '100%', paddingRight: '4rem' }}
                    required
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-input-action"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In to Account</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Sign Up */}
        {activeTab === 'register' && (
          <div className="auth-form-container">
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="auth-input-group">
                <label className="auth-label">
                  <User className="w-4 h-4 auth-label-icon" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maya Suresh"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="kisan-input"
                  required
                />
              </div>

              <div className="auth-grid-2">
                <div className="auth-input-group">
                  <label className="auth-label">
                    <Mail className="w-4 h-4 auth-label-icon" />
                    <span>Email *</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@mail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="kisan-input"
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">
                    <Phone className="w-4 h-4 auth-label-icon" />
                    <span>Phone</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="kisan-input"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">
                  <Sparkles className="w-4 h-4 auth-label-icon" />
                  <span>Account Role</span>
                </label>
                <div className="auth-role-grid">
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
                        className={`auth-role-btn ${isSelected ? 'active' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="auth-role-label">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">
                  <MapPin className="w-4 h-4 auth-label-icon" />
                  <span>Delivery Address / Location</span>
                </label>
                <input
                  type="text"
                  placeholder="House / Farm street address, City"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  className="kisan-input"
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label">
                  <Lock className="w-4 h-4 auth-label-icon" />
                  <span>Set Password *</span>
                </label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="kisan-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
