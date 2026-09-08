import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, LogIn } from 'lucide-react';
import './Header.css'; // We'll write this later or use inline/styled

function Header({ cartCount }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="site-header">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* ROW 1 */}
        <div className="header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {/* LEFT: LOGO */}
          <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#FBBF24" strokeWidth="4" />
              <path d="M50 80 C30 80, 25 55, 45 40 C45 40, 50 45, 50 55 C50 55, 55 45, 55 40 C75 55, 70 80, 50 80 Z" fill="#10B981" />
              <path d="M50 55 Q40 25 50 15 Q60 25 50 55" fill="#FBBF24" />
            </svg>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#047857', letterSpacing: '0.5px' }}>KISAN</span>
          </div>
          
          {/* CENTER: NAVIGATION */}
          <nav className="header-nav" aria-label="Main Navigation" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`header-nav-link ${location.pathname === '/' ? 'active' : ''}`}
              style={{
                background: location.pathname === '/' ? 'rgba(27, 56, 30, 0.08)' : 'transparent',
                color: location.pathname === '/' ? '#1B381E' : 'var(--text-dark)',
                fontWeight: location.pathname === '/' ? 700 : 500,
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                border: 'none'
              }}
            >
              Marketplace
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className={`header-nav-link ${location.pathname === '/products' || location.pathname === '/produce-market' ? 'active' : ''}`}
              style={{
                background: location.pathname === '/products' || location.pathname === '/produce-market' ? '#1B381E' : 'transparent',
                color: location.pathname === '/products' || location.pathname === '/produce-market' ? '#FFFFFF' : 'var(--text-dark)',
                fontWeight: location.pathname === '/products' || location.pathname === '/produce-market' ? 700 : 500,
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                border: 'none',
                boxShadow: location.pathname === '/products' || location.pathname === '/produce-market' ? '0 2px 6px rgba(27, 56, 30, 0.2)' : 'none'
              }}
            >
              Produce Market
            </button>
            <button
              type="button"
              onClick={() => navigate('/vendors')}
              className={`header-nav-link ${location.pathname === '/vendors' ? 'active' : ''}`}
              style={{
                background: location.pathname === '/vendors' ? '#1B381E' : 'transparent',
                color: location.pathname === '/vendors' ? '#FFFFFF' : 'var(--text-dark)',
                fontWeight: location.pathname === '/vendors' ? 700 : 500,
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                border: 'none',
                boxShadow: location.pathname === '/vendors' ? '0 2px 6px rgba(27, 56, 30, 0.2)' : 'none'
              }}
            >
              Farmers &amp; Vendors
            </button>
          </nav>

          {/* RIGHT: CONTROLS */}
          <div className="header-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className="header-action-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <User size={22} color="var(--text-dark)" />
              <span style={{ fontWeight: 500, color: 'var(--text-dark)' }}>Account</span>
            </div>
            <div className="header-action-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <LogIn size={22} color="var(--text-dark)" />
              <span style={{ fontWeight: 500, color: 'var(--text-dark)' }}>Login</span>
            </div>
            <div className="header-action-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <ShoppingCart size={22} color="var(--text-dark)" />
              <span style={{ fontWeight: 500, color: 'var(--text-dark)' }}>Cart ({cartCount})</span>
            </div>
          </div>
        </div>

        {/* ROW 2: SEARCH */}
        <div className="header-bottom" style={{ width: '100%' }}>
          <form className="search-bar" onSubmit={handleSearch} style={{ maxWidth: '100%', width: '100%' }}>
            <input 
              type="text" 
              placeholder="Search for vegetables, fruits, grains, spices..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <Search size={20} />
              <span className="visually-hidden">Search</span>
            </button>
          </form>
        </div>
        
      </div>
    </header>
  );
}

export default Header;
