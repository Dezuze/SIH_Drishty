import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, MapPin, Sparkles, Check } from 'lucide-react';
import GiTag from '../vendors/GiTag';
import VerificationBadge from '../vendors/VerificationBadge';
import './FeaturedHarvests.css';

export function FeaturedHarvests({
  featuredProducts,
  onAddToCart,
  onViewDetails
}) {
  const [addedItem, setAddedItem] = useState(null);

  const handleAdd = (prod) => {
    if (onAddToCart) {
      onAddToCart(prod, prod.minimumOrder || 1);
    }
    setAddedItem(prod.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1800);
  };

  return (
    <section className="featured-harvests-section" aria-labelledby="featured-harvests-title">
      <div className="featured-harvests-header">
        <div className="featured-header-text">
          <span className="featured-eyebrow">CURATED SELECTION</span>
          <h2 id="featured-harvests-title" className="featured-section-title">
            Featured Harvests
          </h2>
          <p className="featured-section-subtitle">
            Prime seasonal yields from verified agricultural guilds with certified origin protection and verified farming practices.
          </p>
        </div>
      </div>

      <div className="featured-harvests-grid">
        {featuredProducts.slice(0, 3).map((prod) => {
          const isRecentlyAdded = addedItem === prod.id;

          return (
            <article key={prod.id} className="featured-harvest-card">
              {/* Media with 4:3 aspect ratio */}
              <div className="card-media-wrapper">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="card-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/products/black-pepper.jpg';
                  }}
                />

                {/* Badges Overlay */}
                <div className="card-badges-top-left">
                  {prod.giTag && (
                    <GiTag label={prod.giTag.name} code={prod.giTag.code} />
                  )}
                </div>

                {prod.organic && (
                  <div className="card-badges-top-right">
                    <span className="card-organic-pill">
                      <Sparkles size={11} />
                      <span>Organic</span>
                    </span>
                  </div>
                )}

                <div className="card-harvest-tag">
                  {prod.harvestStatus}
                </div>
              </div>

              {/* Card Body */}
              <div className="card-content">
                <div className="card-district-rating">
                  <div className="card-location">
                    <MapPin size={13} className="pin-icon" />
                    <span>{prod.district}, Kerala</span>
                  </div>

                  {prod.rating && (
                    <div className="card-rating">
                      <Star size={13} className="star-icon" />
                      <span>{prod.rating.toFixed(1)}</span>
                      <span className="review-count">({prod.reviewCount})</span>
                    </div>
                  )}
                </div>

                <h3
                  className="card-product-title"
                  onClick={() => onViewDetails(prod)}
                >
                  {prod.name}
                </h3>

                <div className="card-vendor-row">
                  <span className="card-vendor-name">{prod.vendor}</span>
                  {prod.vendorVerified && <VerificationBadge size="compact" />}
                </div>

                <div className="card-stats-strip">
                  <div className="stat-pill">
                    <span className="stat-pill-label">Available:</span>
                    <span className="stat-pill-val">{prod.availableQuantity} {prod.unit}</span>
                  </div>
                  <div className="stat-pill">
                    <span className="stat-pill-label">Min Order:</span>
                    <span className="stat-pill-val">{prod.minimumOrder} {prod.unit}</span>
                  </div>
                </div>

                {/* Card Footer: Price & Actions */}
                <div className="card-footer">
                  <div className="card-price-group">
                    <div className="card-price-label">DIRECT FARM PRICE</div>
                    <div className="card-price-value">
                      ₹{prod.price} <span className="card-unit">/ {prod.unit}</span>
                    </div>
                  </div>

                  <div className="card-actions-group">
                    <button
                      type="button"
                      className={`btn-card-add ${isRecentlyAdded ? 'btn-card-add-success' : ''}`}
                      onClick={() => handleAdd(prod)}
                      title={`Add ${prod.minimumOrder || 1} ${prod.unit} to your crate`}
                    >
                      {isRecentlyAdded ? (
                        <>
                          <Check size={14} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} />
                          <span>Add to Crate</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn-card-details"
                      onClick={() => onViewDetails(prod)}
                      aria-label={`View details for ${prod.name}`}
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedHarvests;
