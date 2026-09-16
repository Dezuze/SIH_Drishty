import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  User as UserIcon, 
  LogIn, 
  LogOut, 
  ChevronDown, 
  Package, 
  Truck, 
  Sprout, 
  Leaf, 
  ShieldCheck, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout, openAuthModal, quickLogin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', exact: true },
    { name: 'Shop All Produce', path: '/products', alt: '/produce-market' },
    { name: 'Farmers', path: '/vendors' },
    { name: 'Live Tracking', path: '/tracking' }
  ];

  const getRoleBadgeConfig = (role) => {
    switch (role) {
      case 'farmer':
        return { label: 'Organic Farmer', bg: 'bg-amber-100 text-amber-900 border-amber-300', dot: 'bg-amber-500' };
      case 'driver':
        return { label: 'Fleet Driver', bg: 'bg-blue-100 text-blue-900 border-blue-300', dot: 'bg-blue-500' };
      default:
        return { label: 'Direct Consumer', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300', dot: 'bg-emerald-500' };
    }
  };

  const roleConfig = getRoleBadgeConfig(user?.role);

  return (
    <header className={`modern-header ${scrolled ? 'scrolled' : ''}`}>
      {/* Top Tier: Logo, Search, Actions */}
      <div className="header-top-tier container">
        {/* LOGO */}
        <div className="modern-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#FBBF24" strokeWidth="6" />
              <path d="M50 80 C30 80, 25 55, 45 40 C45 40, 50 45, 50 55 C50 55, 55 45, 55 40 C75 55, 70 80, 50 80 Z" fill="#10B981" />
              <path d="M50 55 Q40 25 50 15 Q60 25 50 55" fill="#FBBF24" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="logo-text">KISAN</span>
            <span className="text-[9px] font-bold tracking-widest text-emerald-700 uppercase -mt-1">DRISHTI AI</span>
          </div>
        </div>
        
        {/* SEARCH BAR */}
        <div className="modern-search-container">
          <form className="modern-search-bar" onSubmit={handleSearch}>
            <Search className="search-icon-left" size={18} />
            <input 
              type="text" 
              placeholder="Search organic tomatoes, nendran bananas, wayanad capsicum..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="modern-search-btn">Search</button>
          </form>
        </div>

        {/* ACTIONS */}
        <div className="modern-actions">
          {/* Authenticated User Menu or Sign In */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="user-profile-header-btn flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50/80 border border-emerald-300 shadow-sm transition-all cursor-pointer group"
                aria-expanded={dropdownOpen}
              >
                {/* Avatar with status indicator */}
                <div className="relative">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                  />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${roleConfig.dot}`} />
                </div>

                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black text-slate-900 leading-tight max-w-[100px] truncate">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-700 capitalize leading-none mt-0.5">
                    {user?.role || 'User'}
                  </p>
                </div>

                <ChevronDown size={14} className={`text-slate-600 group-hover:text-emerald-700 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-emerald-700' : ''}`} />
              </button>

              {/* Elevated Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-76 sm:w-80 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] p-3 z-50 animate-fade-in origin-top-right">
                  {/* User Profile Card Header */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 border border-emerald-100/80 mb-2 relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                      <img
                        src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                        alt={user?.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-black text-slate-900 truncate">{user?.name}</p>
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-500 truncate font-medium">{user?.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleConfig.bg}`}>
                            {roleConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Kisan Green Credits Badge */}
                    <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600 flex items-center gap-1 text-[11px]">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kisan Green Points:</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md text-[11px]">
                        140 Pts
                      </span>
                    </div>
                  </div>

                  {/* Quick Role Switcher for Hackathon Demo */}
                  <div className="px-1 py-1.5 mb-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                      Switch Role (Live Demo)
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={async () => {
                          await quickLogin('customer');
                          setDropdownOpen(false);
                        }}
                        className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                          user?.role === 'customer'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        🛒 Buyer
                      </button>
                      <button
                        onClick={async () => {
                          await quickLogin('farmer');
                          setDropdownOpen(false);
                        }}
                        className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                          user?.role === 'farmer'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        🌾 Farmer
                      </button>
                      <button
                        onClick={async () => {
                          await quickLogin('driver');
                          setDropdownOpen(false);
                        }}
                        className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                          user?.role === 'driver'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        🚚 Driver
                      </button>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="space-y-1">
                    <button
                      onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80 flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <UserIcon size={14} />
                        </div>
                        <span>My Profile & Addresses</span>
                      </div>
                      <ArrowRight size={12} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                      onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80 flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Package size={14} />
                        </div>
                        <span>Orders & Deliveries</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                        Active
                      </span>
                    </button>

                    <button
                      onClick={() => { navigate('/tracking'); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Truck size={14} />
                        </div>
                        <span>Live DRISHTI GPS Tracking</span>
                      </div>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                    </button>

                    {/* Contextual links for roles */}
                    {user?.role === 'farmer' && (
                      <button
                        onClick={() => { navigate('/products'); setDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50/80 hover:bg-amber-100 flex items-center justify-between transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center">
                            <Sprout size={14} />
                          </div>
                          <span>Farmer Crop & Produce Portal</span>
                        </div>
                        <ArrowRight size={12} className="text-amber-600" />
                      </button>
                    )}

                    {user?.role === 'driver' && (
                      <button
                        onClick={() => { navigate('/driver'); setDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-900 bg-blue-50/80 hover:bg-blue-100 flex items-center justify-between transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-200/80 text-blue-800 flex items-center justify-center">
                            <Truck size={14} />
                          </div>
                          <span>Fleet Driver Dispatch Portal</span>
                        </div>
                        <ArrowRight size={12} className="text-blue-600" />
                      </button>
                    )}

                    <button
                      onClick={() => { navigate('/logistics'); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                          <Compass size={14} />
                        </div>
                        <span>AI Logistics Command Center</span>
                      </div>
                      <ArrowRight size={12} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="border-t border-slate-100 my-2" />

                  {/* Sign Out */}
                  <div className="px-1">
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 group-hover:bg-rose-100 flex items-center justify-center">
                        <LogOut size={14} />
                      </div>
                      <span>Sign Out Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                className="action-btn icon-btn group" 
                title="Sign In" 
                onClick={() => openAuthModal('login')}
              >
                <LogIn size={20} />
                <span className="action-tooltip">Sign In</span>
              </button>
              <button
                onClick={() => openAuthModal('login')}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-xs cursor-pointer"
              >
                <span>Sign In</span>
              </button>
            </div>
          )}

          {/* Cart Button */}
          <button className="action-btn cart-btn group" title="Cart" onClick={() => navigate('/cart')}>
            <div className="cart-icon-wrapper">
              <ShoppingCart size={20} />
              {Number(cartCount) > 0 && <span className="modern-cart-badge">{cartCount}</span>}
            </div>
            <span className="cart-text">Cart</span>
          </button>
        </div>
      </div>

      {/* Bottom Tier: Navigation */}
      <div className="header-bottom-tier">
        <div className="container">
          <nav className="modern-nav">
            {navLinks.map((link) => {
              const isActive = link.exact 
                ? location.pathname === link.path 
                : (location.pathname.startsWith(link.path) || (link.alt && location.pathname.startsWith(link.alt)));
              
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`modern-nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
