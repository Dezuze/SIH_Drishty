import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, LogIn } from 'lucide-react';
import './Header.css';

function Header({ cartCount }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Marketplace', path: '/', exact: true },
    { name: 'Produce Market', path: '/products', alt: '/produce-market' },
    { name: 'Farmers & Vendors', path: '/vendors' },
    { name: 'Live Tracking', path: '/tracking' },
    { name: 'Driver Portal', path: '/driver' },
    { name: 'Logistics AI', path: '/logistics' },
  ];

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
          <span className="logo-text">KISAN</span>
        </div>
        
        {/* SEARCH BAR */}
        <div className="modern-search-container">
          <form className="modern-search-bar" onSubmit={handleSearch}>
            <Search className="search-icon-left" size={18} />
            <input 
              type="text" 
              placeholder="Search for fresh produce, grains, or vendors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="modern-search-btn">Search</button>
          </form>
        </div>

        {/* ACTIONS */}
        <div className="modern-actions">
          <button className="action-btn icon-btn group" title="Account">
            <User size={20} />
            <span className="action-tooltip">Account</span>
          </button>
          <button className="action-btn icon-btn group" title="Login">
            <LogIn size={20} />
            <span className="action-tooltip">Login</span>
          </button>
          <button className="action-btn cart-btn group" title="Cart">
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
