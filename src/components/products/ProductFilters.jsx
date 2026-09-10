import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, RotateCcw, Check, Sparkles, Award } from 'lucide-react';
import { KERALA_DISTRICTS, PRODUCT_CATEGORIES } from '../../data/productsData';
import './ProductFilters.css';

export function ProductFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDistrict,
  setSelectedDistrict,
  selectedAvailability,
  setSelectedAvailability,
  selectedHarvestStatus,
  setSelectedHarvestStatus,
  selectedPriceRange,
  setSelectedPriceRange,
  onlyOrganic,
  setOnlyOrganic,
  onlyGiTagged,
  setOnlyGiTagged,
  sortBy,
  setSortBy,
  onClearFilters,
  hasActiveFilters,
  totalResultsCount
}) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-100', label: 'Under ₹100' },
    { value: '100-500', label: '₹100 – ₹500' },
    { value: 'above-500', label: 'Above ₹500' }
  ];

  const availabilityOptions = [
    { value: 'all', label: 'All Stock' },
    { value: 'In Stock', label: 'In Stock' },
    { value: 'Limited Stock', label: 'Limited Stock' },
    { value: 'Pre-Order', label: 'Pre-Order' }
  ];

  const harvestStatusOptions = [
    { value: 'all', label: 'All Harvests' },
    { value: 'Fresh Harvest', label: 'Fresh Harvest' },
    { value: 'Peak Season', label: 'Peak Season' },
    { value: 'Harvest Imminent', label: 'Harvest Imminent' },
    { value: 'Pre-Order', label: 'Pre-Order' }
  ];

  return (
    <div className="product-filters-wrapper">
      {/* 1. Search Bar */}
      <div className="produce-search-container">
        <div className="produce-search-bar">
          <Search size={20} className="search-icon" aria-hidden="true" />
          <input
            type="text"
            className="produce-search-input"
            placeholder="Search product, crop, GI tag or farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search produce"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`mobile-filter-trigger-btn ${hasActiveFilters ? 'has-filters' : ''}`}
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-label="Open produce filters"
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
          {hasActiveFilters && <span className="active-dot" aria-hidden="true" />}
        </button>
      </div>

      {/* 2. Desktop Filter Toolbar (Warm Cream Background) */}
      <div className="desktop-filter-toolbar" role="region" aria-label="Produce Filter Controls">
        <div className="filter-group">
          <label htmlFor="filter-district" className="filter-label">District</label>
          <select
            id="filter-district"
            className="filter-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            {KERALA_DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-price" className="filter-label">Price Range</label>
          <select
            id="filter-price"
            className="filter-select"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
          >
            {priceRanges.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-availability" className="filter-label">Availability</label>
          <select
            id="filter-availability"
            className="filter-select"
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
          >
            {availabilityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-harvest-status" className="filter-label">Harvest Status</label>
          <select
            id="filter-harvest-status"
            className="filter-select"
            value={selectedHarvestStatus}
            onChange={(e) => setSelectedHarvestStatus(e.target.value)}
          >
            {harvestStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Checkbox / Pill Toggles */}
        <div className="filter-toggles-group">
          <button
            type="button"
            className={`filter-toggle-pill ${onlyOrganic ? 'active-organic' : ''}`}
            onClick={() => setOnlyOrganic(!onlyOrganic)}
            aria-pressed={onlyOrganic}
          >
            <Sparkles size={14} />
            <span>Organic</span>
            {onlyOrganic && <Check size={14} />}
          </button>

          <button
            type="button"
            className={`filter-toggle-pill ${onlyGiTagged ? 'active-gi' : ''}`}
            onClick={() => setOnlyGiTagged(!onlyGiTagged)}
            aria-pressed={onlyGiTagged}
          >
            <Award size={14} />
            <span>GI Tagged</span>
            {onlyGiTagged && <Check size={14} />}
          </button>
        </div>

        {/* Clear Filters button */}
        {hasActiveFilters && (
          <button
            type="button"
            className="btn-filter-reset"
            onClick={onClearFilters}
            title="Reset all filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 3. Mobile Filter Drawer / Modal */}
      {isMobileDrawerOpen && (
        <div
          className="mobile-filter-drawer-overlay"
          onClick={() => setIsMobileDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Filter produce mobile dialog"
        >
          <div
            className="mobile-filter-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <div className="drawer-title-row">
                <SlidersHorizontal size={20} color="#1B381E" />
                <h2 className="drawer-title">Filter Harvests</h2>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsMobileDrawerOpen(false)}
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            <div className="drawer-content">
              {/* Category */}
              <div className="drawer-field">
                <label className="drawer-label">Produce Category</label>
                <select
                  className="drawer-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.query}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="drawer-field">
                <label className="drawer-label">District</label>
                <select
                  className="drawer-select"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  {KERALA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="drawer-field">
                <label className="drawer-label">Price Range</label>
                <select
                  className="drawer-select"
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                >
                  {priceRanges.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div className="drawer-field">
                <label className="drawer-label">Availability</label>
                <select
                  className="drawer-select"
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                >
                  {availabilityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Harvest Status */}
              <div className="drawer-field">
                <label className="drawer-label">Harvest Status</label>
                <select
                  className="drawer-select"
                  value={selectedHarvestStatus}
                  onChange={(e) => setSelectedHarvestStatus(e.target.value)}
                >
                  {harvestStatusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Certification Toggles */}
              <div className="drawer-field">
                <label className="drawer-label">Special Certifications</label>
                <div className="drawer-toggles">
                  <label className="drawer-checkbox-label">
                    <input
                      type="checkbox"
                      checked={onlyOrganic}
                      onChange={(e) => setOnlyOrganic(e.target.checked)}
                    />
                    <span>Certified Organic Produce</span>
                  </label>
                  <label className="drawer-checkbox-label">
                    <input
                      type="checkbox"
                      checked={onlyGiTagged}
                      onChange={(e) => setOnlyGiTagged(e.target.checked)}
                    />
                    <span>Geographical Indication (GI) Protected</span>
                  </label>
                </div>
              </div>

              {/* Sort By */}
              <div className="drawer-field">
                <label className="drawer-label">Sort Order</label>
                <select
                  className="drawer-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Harvest</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            <div className="drawer-footer">
              <button
                type="button"
                className="btn-drawer-clear"
                onClick={() => {
                  onClearFilters();
                }}
              >
                Clear Filters
              </button>
              <button
                type="button"
                className="btn-drawer-apply"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                Apply Filters ({totalResultsCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductFilters;
