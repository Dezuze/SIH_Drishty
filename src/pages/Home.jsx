import React, { useState, useEffect, useMemo } from 'react';
import ProductGrid from '../components/ProductGrid';
import { getLiveProducts } from '../data/products';
import { ArrowRight, Star, TrendingUp, Carrot, Apple, Milk, Flame } from 'lucide-react';
import SeasonalChart from '../components/SeasonalChart';
import './Home.css';

function Home({ onAddToCart }) {
  const [liveList, setLiveList] = useState(() => getLiveProducts());

  useEffect(() => {
    const handleUpdate = () => setLiveList(getLiveProducts());
    window.addEventListener('kisan_products_updated', handleUpdate);
    return () => window.removeEventListener('kisan_products_updated', handleUpdate);
  }, []);

  const trendingProducts = useMemo(() => liveList.slice(0, 4), [liveList]);
  const freshArrivals = useMemo(() => liveList.slice(4, 8), [liveList]);

  const categories = [
    { name: 'Vegetables', icon: Carrot, color: 'text-emerald-600' },
    { name: 'Fruits', icon: Apple, color: 'text-rose-500' },
    { name: 'Dairy', icon: Milk, color: 'text-blue-500' },
    { name: 'Spices', icon: Flame, color: 'text-amber-500' }
  ];

  return (
    <div className="home-page">
      {/* Simplistic Category Buttons */}
      <section className="categories-section container">
        <div className="category-pills">
          <a href="/products" className="category-pill active">All Categories</a>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <a href={`/products?category=${cat.name}`} key={cat.name} className="category-pill flex items-center gap-1.5">
                <Icon size={16} className={cat.color} />
                <span>{cat.name}</span>
              </a>
            );
          })}
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
