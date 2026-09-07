import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, ShieldCheck, Award, Leaf, RotateCcw } from 'lucide-react';
import { KERALA_DISTRICTS, VENDOR_TYPES, CROP_CATEGORIES } from '../../data/vendorsData';
import './VendorFilters.css';

export function VendorFilters({
  searchQuery,
  setSearchQuery,
  selectedDistrict,
  setSelectedDistrict,
  selectedCrop,
  setSelectedCrop,
  selectedType,
  setSelectedType,
  onlyVerified,
  setOnlyVerified,
  onlyGiTagged,
  setOnlyGiTagged,
  onlyOrganic,
  setOnlyOrganic,
  onClearFilters,
  hasActiveFilters
}) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <section className="vendor-filters-container" aria-label="Search and filter agricultural vendors">
      {/* Search Bar Row */}
      <div className="filters-search-row">
        <div className="filters-search-wrapper">
          <Search size={18} className="filters-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="filters-search-input"
            placeholder="Search farmers, farms or vendors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search farmers, farms or vendors"
          />
          {searchQuery && (
            <button
              type="button"
              className="filters-clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search text"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="filters-mobile-toggle-btn"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          aria-expanded={mobileExpanded}
          aria-label="Toggle filter options"
        >
          <SlidersHorizontal size={17} />
          <span>Filters</span>
        </button>
      </div>

      {/* Primary Dropdowns Grid */}
      <div className={`filters-controls-grid ${!mobileExpanded ? 'mobile-collapsed' : ''}`}>
        {/* District Filter */}
        <div className="filter-control-group">
          <label htmlFor="filter-district" className="filter-control-label">
            District
          </label>
          <select
            id="filter-district"
            className="filter-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            {KERALA_DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Crop Filter */}
        <div className="filter-control-group">
          <label htmlFor="filter-crop" className="filter-control-label">
            Crop
          </label>
          <select
            id="filter-crop"
            className="filter-select"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            {CROP_CATEGORIES.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        {/* Vendor Type Filter */}
        <div className="filter-control-group">
          <label htmlFor="filter-type" className="filter-control-label">
            Vendor Type
          </label>
          <select
            id="filter-type"
            className="filter-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {VENDOR_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Toggles & Reset Row */}
      <div className="filters-pills-row">
        <div className="filters-toggles-group" role="group" aria-label="Quick verification and certification toggles">
          {/* Verified Toggle */}
          <button
            type="button"
            className={`filter-toggle-chip chip-verified ${onlyVerified ? 'active' : ''}`}
            onClick={() => setOnlyVerified(!onlyVerified)}
            aria-pressed={onlyVerified}
          >
            <ShieldCheck size={16} />
            <span>Verified Farmers Only</span>
          </button>

          {/* GI Tagged Toggle */}
          <button
            type="button"
            className={`filter-toggle-chip chip-gi ${onlyGiTagged ? 'active' : ''}`}
            onClick={() => setOnlyGiTagged(!onlyGiTagged)}
            aria-pressed={onlyGiTagged}
          >
            <Award size={16} />
            <span>GI-Origin Tagged</span>
          </button>

          {/* Organic Toggle */}
          <button
            type="button"
            className={`filter-toggle-chip chip-organic ${onlyOrganic ? 'active' : ''}`}
            onClick={() => setOnlyOrganic(!onlyOrganic)}
            aria-pressed={onlyOrganic}
          >
            <Leaf size={16} />
            <span>100% Organic</span>
          </button>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn-reset-filters"
            onClick={onClearFilters}
            aria-label="Reset all search filters"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </section>
  );
}

export default VendorFilters;
