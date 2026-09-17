import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS_DATA, getLiveProductsData } from '../data/productsData';
import ProductGrid from '../components/ProductGrid';
import SEOHead from '../components/SEOHead';
import './Products.css';

export function Products({ onAddToCart }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('recommended');
  const [rawProducts, setRawProducts] = useState(() => getLiveProductsData());

  useEffect(() => {
    const handleUpdate = () => setRawProducts(getLiveProductsData());
    window.addEventListener('kisan_products_updated', handleUpdate);
    return () => window.removeEventListener('kisan_products_updated', handleUpdate);
  }, []);

  const categories = ['ALL', 'Vegetables', 'Fruits', 'Grains', 'Spices', 'Dairy Products'];

  // Filter and Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...rawProducts];

    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        return p.name.toLowerCase().includes(q) || 
               p.category.toLowerCase().includes(q) ||
               p.district.toLowerCase().includes(q);
      });
    }

    // 2. Category Filter
    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => {
        const cat = p.filterCategory || p.category;
        return cat.toUpperCase() === selectedCategory.toUpperCase();
      });
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // recommended
    });

    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <main className="shop-page container">
      <SEOHead 
        title="Shop Fresh Farm Produce • KisanDirect" 
        description="Browse certified organic fruits, vegetables, native spices, and raw farm dairy dispatched directly from local Kerala cultivators."
        canonicalPath="/products"
      />
      {/* Page Header */}
      <div className="shop-header">
        <h1 className="shop-title">Shop All Products</h1>
        <p className="shop-subtitle">Fresh produce and groceries sourced directly from verified local farms.</p>
      </div>

      <div className="shop-layout">
        {/* Left Sidebar Filters */}
        <aside className="shop-sidebar">
          <div className="filter-widget">
            <h3 className="filter-title">Search</h3>
            <input 
              type="text" 
              className="shop-search-input" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-widget">
            <h3 className="filter-title">Categories</h3>
            <ul className="category-list">
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right Main Content */}
        <section className="shop-main">
          <div className="shop-toolbar">
            <div className="results-count">
              Showing <strong>{filteredAndSortedProducts.length}</strong> products
            </div>
            <div className="sort-control">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <ProductGrid products={filteredAndSortedProducts} onAddToCart={onAddToCart} />
          ) : (
            <div className="empty-results">
              <h3>No products found</h3>
              <p>Try adjusting your search or category filters.</p>
              <button className="btn-primary" onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}>
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Products;
