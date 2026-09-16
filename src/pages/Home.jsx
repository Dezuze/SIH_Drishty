import React, { useMemo } from 'react';
import ProductGrid from '../components/ProductGrid';
import { products } from '../data/products';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';
import SeasonalChart from '../components/SeasonalChart';
import './Home.css';

function Home({ onAddToCart }) {
  const trendingProducts = useMemo(() => products.slice(0, 4), []);
  const freshArrivals = useMemo(() => products.slice(4, 8), []);

  return (
    <div className="home-page">
      {/* Featured Categories */}
      <section className="categories-section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Freshly categorized seasonal harvest</p>
          </div>
          <a href="/products" className="view-all-link">All Categories <ArrowRight size={14} /></a>
        </div>
        <div className="category-cards">
          {[
            { name: 'Vegetables', icon: '🥦', count: '18+ Items' },
            { name: 'Fruits', icon: '🍎', count: '14+ Items' },
            { name: 'Dairy Products', icon: '🥛', count: '6+ Items' },
            { name: 'Spices', icon: '🌶️', count: '12+ Items' }
          ].map(cat => (
            <a href={`/products?category=${cat.name}`} key={cat.name} className="category-card group">
              <div className="category-icon-box">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <span className="category-count">{cat.count}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="trending-section container">
        <div className="section-header">
          <div>
            <h2 className="section-title"><TrendingUp size={22} className="text-emerald-600" /> Trending Harvests</h2>
            <p className="section-subtitle">Most popular among local households this week</p>
          </div>
          <a href="/products" className="view-all-link">View All <ArrowRight size={14} /></a>
        </div>
        <ProductGrid products={trendingProducts} onAddToCart={onAddToCart} />
      </section>

      {/* Fresh Arrivals */}
      <section className="arrivals-section container">
        <div className="section-header">
          <div>
            <h2 className="section-title"><Star size={22} className="text-amber-500" /> Fresh Arrivals</h2>
            <p className="section-subtitle">Harvested today and ready for immediate dispatch</p>
          </div>
          <a href="/products" className="view-all-link">View All <ArrowRight size={14} /></a>
        </div>
        <ProductGrid products={freshArrivals} onAddToCart={onAddToCart} />
      </section>

      {/* Full-viewport seasonal graph (Moved to bottom) */}
      <section className="hero-section" style={{ height: '80vh', borderTop: '1px solid rgba(16, 185, 129, 0.12)' }}>
        <SeasonalChart isHero={true} />
      </section>
    </div>
  );
}

export default Home;
