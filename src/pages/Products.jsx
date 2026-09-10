import React, { useState, useMemo } from 'react';
import { PlusCircle, SearchX, RotateCcw, CheckCircle2 } from 'lucide-react';
import { PRODUCTS_DATA, PRODUCE_MARKET_SUMMARY } from '../data/productsData';
import ProductMarketplaceSummary from '../components/products/ProductMarketplaceSummary';
import MarketPriceStrip from '../components/products/MarketPriceStrip';
import ProductFilters from '../components/products/ProductFilters';
import CategoryChips from '../components/products/CategoryChips';
import ProductTable from '../components/products/ProductTable';
import FeaturedHarvests from '../components/products/FeaturedHarvests';
import ProductDetailsModal from '../components/products/ProductDetailsModal';
import BecomeVendorModal from '../components/vendors/BecomeVendorModal';
import TrustSection from '../components/vendors/TrustSection';
import './Products.css';

export function Products({ onAddToCart }) {
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedHarvestStatus, setSelectedHarvestStatus] = useState('all');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [onlyGiTagged, setOnlyGiTagged] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState('recommended');

  // Modals & Overlay States
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [isListProduceOpen, setIsListProduceOpen] = useState(false);

  // Toast Feedback State
  const [toastNotification, setToastNotification] = useState(null);

  const handleAddToCartWrapper = (product, qty = 1) => {
    if (onAddToCart) {
      onAddToCart(product, qty);
    }
    setToastNotification(`Added ${qty} ${product.unit} of ${product.name} to your crate`);
    setTimeout(() => {
      setToastNotification(null);
    }, 3000);
  };

  // Check if active filters
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedCategory !== 'ALL' ||
      selectedDistrict !== 'All Districts' ||
      selectedPriceRange !== 'all' ||
      selectedAvailability !== 'all' ||
      selectedHarvestStatus !== 'all' ||
      onlyOrganic ||
      onlyGiTagged
    );
  }, [
    searchQuery,
    selectedCategory,
    selectedDistrict,
    selectedPriceRange,
    selectedAvailability,
    selectedHarvestStatus,
    onlyOrganic,
    onlyGiTagged
  ]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedDistrict('All Districts');
    setSelectedPriceRange('all');
    setSelectedAvailability('all');
    setSelectedHarvestStatus('all');
    setOnlyOrganic(false);
    setOnlyGiTagged(false);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { ALL: PRODUCTS_DATA.length };
    PRODUCTS_DATA.forEach((p) => {
      const cat = p.filterCategory || p.category?.toUpperCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter and Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...PRODUCTS_DATA];

    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const matchName = p.name.toLowerCase().includes(q);
        const matchLot = p.lotNumber.toLowerCase().includes(q);
        const matchVendor = p.vendor.toLowerCase().includes(q);
        const matchDistrict = p.district.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchSubCategory = (p.subCategory || '').toLowerCase().includes(q);
        const matchGi = p.giTag?.name.toLowerCase().includes(q) || p.giTag?.code.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        return matchName || matchLot || matchVendor || matchDistrict || matchCategory || matchSubCategory || matchGi || matchDesc;
      });
    }

    // 2. Category Filter
    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => {
        const cat = p.filterCategory || p.category?.toUpperCase();
        return cat === selectedCategory;
      });
    }

    // 3. District Filter
    if (selectedDistrict !== 'All Districts') {
      list = list.filter((p) => p.district === selectedDistrict);
    }

    // 4. Price Range
    if (selectedPriceRange === 'under-100') {
      list = list.filter((p) => p.price < 100);
    } else if (selectedPriceRange === '100-500') {
      list = list.filter((p) => p.price >= 100 && p.price <= 500);
    } else if (selectedPriceRange === 'above-500') {
      list = list.filter((p) => p.price > 500);
    }

    // 5. Availability Filter
    if (selectedAvailability !== 'all') {
      list = list.filter((p) => p.availability === selectedAvailability);
    }

    // 6. Harvest Status Filter
    if (selectedHarvestStatus !== 'all') {
      list = list.filter((p) => p.harvestStatus === selectedHarvestStatus);
    }

    // 7. Organic
    if (onlyOrganic) {
      list = list.filter((p) => p.organic);
    }

    // 8. GI Tagged
    if (onlyGiTagged) {
      list = list.filter((p) => !!p.giTag);
    }

    // 9. Sorting
    list.sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'newest') {
        return b.id.localeCompare(a.id);
      }
      // 'recommended'
      const scoreA = (a.giTag ? 2 : 0) + (a.organic ? 1.5 : 0) + (a.rating || 4);
      const scoreB = (b.giTag ? 2 : 0) + (b.organic ? 1.5 : 0) + (b.rating || 4);
      return scoreB - scoreA;
    });

    return list;
  }, [
    searchQuery,
    selectedCategory,
    selectedDistrict,
    selectedPriceRange,
    selectedAvailability,
    selectedHarvestStatus,
    onlyOrganic,
    onlyGiTagged,
    sortBy
  ]);

  // Featured harvests (top GI & verified items)
  const featuredHarvests = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => p.isFeatured || p.giTag);
  }, []);

  return (
    <main className="produce-market-page">
      {/* 1. Marketplace Introduction Header */}
      <header className="market-hero-header">
        <div className="market-container">
          <div className="market-header-inner">
            <div className="market-header-text">
              <div className="market-active-indicator" role="status">
                <span className="active-pulse-dot" aria-hidden="true" />
                <span className="active-text">MARKET ACTIVE</span>
              </div>

              <h1 className="market-page-title">Produce Market</h1>

              <p className="market-page-subtitle">
                Discover fresh, traceable produce sourced from verified farmers and agricultural vendors across Kerala.
              </p>
            </div>

            <div className="market-header-cta">
              <button
                type="button"
                className="btn-list-produce"
                onClick={() => setIsListProduceOpen(true)}
                aria-label="List produce on the marketplace"
              >
                <PlusCircle size={18} />
                <span>+ List Produce</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="market-container">
        {/* 2. Marketplace Summary (Product Discovery Metrics) */}
        <ProductMarketplaceSummary stats={PRODUCE_MARKET_SUMMARY} />

        {/* 3. Market Price Strip (Spot prices reference) */}
        <MarketPriceStrip />

        {/* 4. Search and Filter Toolbar */}
        <ProductFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedAvailability={selectedAvailability}
          setSelectedAvailability={setSelectedAvailability}
          selectedHarvestStatus={selectedHarvestStatus}
          setSelectedHarvestStatus={setSelectedHarvestStatus}
          selectedPriceRange={selectedPriceRange}
          setSelectedPriceRange={setSelectedPriceRange}
          onlyOrganic={onlyOrganic}
          setOnlyOrganic={setOnlyOrganic}
          onlyGiTagged={onlyGiTagged}
          setOnlyGiTagged={setOnlyGiTagged}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          totalResultsCount={filteredAndSortedProducts.length}
        />

        {/* 5. Category Navigation Chips */}
        <CategoryChips
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* 6. Product Result Header & Sort Control */}
        <div className="produce-results-header">
          <div className="results-count-text">
            <span className="results-count-number">{filteredAndSortedProducts.length}</span>{' '}
            {filteredAndSortedProducts.length === 1 ? 'produce listing' : 'produce listings'}
            <span className="results-count-sub"> — From verified farmers and vendors across Kerala</span>
          </div>

          <div className="results-sort-wrapper">
            <label htmlFor="produce-sort-select" className="results-sort-label">
              Sort by:
            </label>
            <select
              id="produce-sort-select"
              className="results-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Harvest</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* 7. Main Product Listing / 9. Empty State */}
        {filteredAndSortedProducts.length > 0 ? (
          <ProductTable
            products={filteredAndSortedProducts}
            onAddToCart={handleAddToCartWrapper}
            onViewDetails={(prod) => setActiveProductModal(prod)}
          />
        ) : (
          <div className="produce-empty-state" role="status">
            <div className="empty-state-icon-circle">
              <SearchX size={34} />
            </div>
            <h2 className="empty-state-heading">No harvests match your filters</h2>
            <p className="empty-state-sub">
              Try adjusting your search terms or clearing a category or district filter to discover available crops.
            </p>
            <button
              type="button"
              className="btn-empty-reset"
              onClick={handleClearFilters}
            >
              <RotateCcw size={16} />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}

        {/* 8. Featured Harvests */}
        <FeaturedHarvests
          featuredProducts={featuredHarvests}
          onAddToCart={handleAddToCartWrapper}
          onViewDetails={(prod) => setActiveProductModal(prod)}
        />
      </div>

      {/* 10. Compact Provenance / Trust Section */}
      <TrustSection />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={activeProductModal}
        isOpen={!!activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onAddToCart={handleAddToCartWrapper}
      />

      {/* Sell Your Produce / List Produce Modal (Reusing existing BecomeVendorModal) */}
      <BecomeVendorModal
        isOpen={isListProduceOpen}
        onClose={() => setIsListProduceOpen(false)}
      />

      {/* Toast Notification */}
      {toastNotification && (
        <div className="market-toast-notification" role="status" aria-live="polite">
          <CheckCircle2 size={18} color="#A3D55D" />
          <span>{toastNotification}</span>
        </div>
      )}
    </main>
  );
}

export default Products;
