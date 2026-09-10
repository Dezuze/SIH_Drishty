import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import SortDropdown from '../components/SortDropdown';
import ProductGrid from '../components/ProductGrid';
import { products } from '../data/products';
import { Filter } from 'lucide-react';
import './SearchResults.css';

function SearchResults({ onAddToCart }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sort, setSort] = useState('relevance');
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    rating: [],
    organic: [],
    availability: []
  });

  // Redirect to home if empty search cleared from URL manually
  useEffect(() => {
    if (!query) {
      navigate('/');
    }
  }, [query, navigate]);

  const handleClearAll = () => {
    setFilters({
      priceRange: { min: '', max: '' },
      rating: [],
      organic: [],
      availability: []
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    // 1. Search Query filtering
    const searchLower = query.toLowerCase();
    let result = products.filter(p => {
      const matchName = p.name.toLowerCase().includes(searchLower);
      const matchKeywords = p.searchKeywords.some(k => k.toLowerCase().includes(searchLower));
      return matchName || matchKeywords;
    });

    // 2. Apply Filters (AND logic)
    result = result.filter(p => {
      let pass = true;

      // Price
      if (filters.priceRange.min !== '') {
        pass = pass && p.price >= filters.priceRange.min;
      }
      if (filters.priceRange.max !== '') {
        pass = pass && p.price <= filters.priceRange.max;
      }

      // Rating
      if (filters.rating.length > 0) {
        // Find if product rating is >= any of the selected rating minimums
        const meetsRating = filters.rating.some(r => p.rating >= Number(r));
        pass = pass && meetsRating;
      }

      // Organic
      if (filters.organic.length > 0) {
        const isOrganicStr = p.organic ? 'true' : 'false';
        pass = pass && filters.organic.includes(isOrganicStr);
      }

      // Availability
      if (filters.availability.length > 0) {
        pass = pass && filters.availability.includes(p.availability);
      }

      return pass;
    });

    // 3. Apply Sorting
    result.sort((a, b) => {
      switch (sort) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'relevance':
        default:
          return 0; // Maintain search order
      }
    });

    return result;
  }, [query, filters, sort]);

  return (
    <div className="search-results-page container">
      <div className="search-header">
        <h1 className="search-title">
          Search results for: <span>"{query}"</span>
        </h1>
        <p className="search-count">{filteredAndSortedProducts.length} products found</p>
      </div>

      <div className="search-controls-mobile">
        <button className="btn-filter-mobile" onClick={() => setIsFilterOpen(true)}>
          <Filter size={18} /> Filters
        </button>
        <SortDropdown sort={sort} setSort={setSort} />
      </div>

      <div className="search-layout">
        <aside className="search-sidebar">
          <FilterPanel 
            filters={filters} 
            setFilters={setFilters} 
            onClearAll={handleClearAll}
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
          />
        </aside>
        
        <main className="search-main">
          <div className="search-controls-desktop">
            <SortDropdown sort={sort} setSort={setSort} />
          </div>
          
          <ProductGrid products={filteredAndSortedProducts} onAddToCart={onAddToCart} />
        </main>
      </div>
    </div>
  );
}

export default SearchResults;
