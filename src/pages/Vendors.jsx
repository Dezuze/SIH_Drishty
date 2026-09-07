import React, { useState, useMemo } from 'react';
import { UserPlus, SearchX, RotateCcw } from 'lucide-react';
import { VENDORS_DATA } from '../data/vendorsData';
import VendorCard from '../components/vendors/VendorCard';
import VendorFilters from '../components/vendors/VendorFilters';
import TrustSection from '../components/vendors/TrustSection';
import VendorModal from '../components/vendors/VendorModal';
import BecomeVendorModal from '../components/vendors/BecomeVendorModal';
import './Vendors.css';

export function Vendors({ onAddToCart }) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedCrop, setSelectedCrop] = useState('All Crops');
  const [selectedType, setSelectedType] = useState('All Types');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyGiTagged, setOnlyGiTagged] = useState(false);
  const [onlyOrganic, setOnlyOrganic] = useState(false);

  // Sorting State
  const [sortBy, setSortBy] = useState('recommended');

  // Modal States
  const [activeVendorModal, setActiveVendorModal] = useState(null);
  const [isBecomeVendorOpen, setIsBecomeVendorOpen] = useState(false);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedDistrict !== 'All Districts' ||
      selectedCrop !== 'All Crops' ||
      selectedType !== 'All Types' ||
      onlyVerified ||
      onlyGiTagged ||
      onlyOrganic
    );
  }, [searchQuery, selectedDistrict, selectedCrop, selectedType, onlyVerified, onlyGiTagged, onlyOrganic]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('All Districts');
    setSelectedCrop('All Crops');
    setSelectedType('All Types');
    setOnlyVerified(false);
    setOnlyGiTagged(false);
    setOnlyOrganic(false);
  };

  // Filter and Sort Logic
  const filteredAndSortedVendors = useMemo(() => {
    let list = [...VENDORS_DATA];

    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((v) => {
        const matchName = v.name.toLowerCase().includes(q);
        const matchDistrict = v.district.toLowerCase().includes(q);
        const matchTaluk = v.taluk.toLowerCase().includes(q);
        const matchDesc = v.description.toLowerCase().includes(q);
        const matchTagline = v.tagline.toLowerCase().includes(q);
        const matchGi = v.giTag?.name.toLowerCase().includes(q);
        const matchCrops = v.featuredCrops.some((c) => c.toLowerCase().includes(q));
        const matchCategories = v.productCategories.some((cat) => cat.toLowerCase().includes(q));
        return (
          matchName ||
          matchDistrict ||
          matchTaluk ||
          matchDesc ||
          matchTagline ||
          matchGi ||
          matchCrops ||
          matchCategories
        );
      });
    }

    // 2. District Filter
    if (selectedDistrict !== 'All Districts') {
      list = list.filter((v) => v.district === selectedDistrict);
    }

    // 3. Crop Filter
    if (selectedCrop !== 'All Crops') {
      list = list.filter((v) => {
        const inCategories = v.productCategories.some((cat) =>
          cat.toLowerCase().includes(selectedCrop.toLowerCase())
        );
        const inCrops = v.featuredCrops.some((crop) =>
          crop.toLowerCase().includes(selectedCrop.toLowerCase())
        );
        return inCategories || inCrops;
      });
    }

    // 4. Vendor Type Filter
    if (selectedType !== 'All Types') {
      list = list.filter((v) => v.type === selectedType);
    }

    // 5. Verification Filter
    if (onlyVerified) {
      list = list.filter((v) => v.verified);
    }

    // 6. GI Tagged Filter
    if (onlyGiTagged) {
      list = list.filter((v) => !!v.giTag);
    }

    // 7. Organic Filter
    if (onlyOrganic) {
      list = list.filter((v) => v.isOrganic);
    }

    // 8. Sorting
    list.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'products') {
        return b.productsCount - a.productsCount;
      }
      if (sortBy === 'newest') {
        return b.verifiedSince - a.verifiedSince;
      }
      // 'recommended'
      const scoreA = (a.verified ? 2 : 0) + (a.giTag ? 1.5 : 0) + a.rating;
      const scoreB = (b.verified ? 2 : 0) + (b.giTag ? 1.5 : 0) + b.rating;
      return scoreB - scoreA;
    });

    return list;
  }, [
    searchQuery,
    selectedDistrict,
    selectedCrop,
    selectedType,
    onlyVerified,
    onlyGiTagged,
    onlyOrganic,
    sortBy
  ]);

  return (
    <main className="vendors-page">
      {/* 1. Page Header */}
      <header className="vendors-hero-header">
        <div className="vendors-content-container">
          <div className="vendors-header-inner">
            <div className="vendors-header-text">
              <span className="vendors-eyebrow">FROM THE FARM</span>
              <h1 className="vendors-page-title">Verified Farmers &amp; Vendors</h1>
              <p className="vendors-page-subtitle">
                Discover trusted Kerala growers, cooperatives, and agricultural producers bringing authentic farm produce directly to the marketplace.
              </p>
            </div>

            <div className="vendors-header-cta">
              <button
                type="button"
                className="btn-become-vendor"
                onClick={() => setIsBecomeVendorOpen(true)}
                aria-label="Become a verified Haritha Heritage vendor"
              >
                <UserPlus size={18} />
                <span>Become a Vendor</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="vendors-content-container">
        {/* 2. Search and Filter Toolbar */}
        <VendorFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedCrop={selectedCrop}
          setSelectedCrop={setSelectedCrop}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onlyVerified={onlyVerified}
          setOnlyVerified={setOnlyVerified}
          onlyGiTagged={onlyGiTagged}
          setOnlyGiTagged={setOnlyGiTagged}
          onlyOrganic={onlyOrganic}
          setOnlyOrganic={setOnlyOrganic}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* 3. Vendor Summary & Sorting */}
        <div className="vendors-summary-bar">
          <div className="vendors-count-text">
            <span className="vendors-count-number">{filteredAndSortedVendors.length}</span>{' '}
            {filteredAndSortedVendors.length === 1 ? 'verified producer' : 'verified producers & vendors'}
          </div>

          <div className="vendors-sorting-group">
            <label htmlFor="vendor-sort-select" className="vendors-sort-label">
              Sort by:
            </label>
            <select
              id="vendor-sort-select"
              className="vendors-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Highest rated</option>
              <option value="products">Most products</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* 4. Vendor Card Grid / 7. Empty State */}
        {filteredAndSortedVendors.length > 0 ? (
          <div className="vendors-grid" role="region" aria-label="Vendors Directory Grid">
            {filteredAndSortedVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onViewFarm={(v) => setActiveVendorModal(v)}
                onViewProducts={(v) => setActiveVendorModal(v)}
              />
            ))}
          </div>
        ) : (
          <div className="vendors-empty-state">
            <div className="empty-state-icon-box">
              <SearchX size={32} />
            </div>
            <h2 className="empty-state-title">No vendors found</h2>
            <p className="empty-state-desc">
              Try adjusting your filters or searching for another district, crop, or farm name.
            </p>
            <button
              type="button"
              className="btn-empty-clear"
              onClick={handleClearFilters}
            >
              <RotateCcw size={16} />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* 6. Trust / Provenance Section */}
      <TrustSection />

      {/* Modals */}
      <VendorModal
        vendor={activeVendorModal}
        isOpen={!!activeVendorModal}
        onClose={() => setActiveVendorModal(null)}
        onAddToCart={onAddToCart}
      />

      <BecomeVendorModal
        isOpen={isBecomeVendorOpen}
        onClose={() => setIsBecomeVendorOpen(false)}
      />
    </main>
  );
}

export default Vendors;
