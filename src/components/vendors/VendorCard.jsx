import React from 'react';
import { MapPin, Star, Package, Calendar, ArrowRight, Leaf } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import GiTag from './GiTag';
import './VendorCard.css';

export function VendorCard({ vendor, onViewFarm, onViewProducts }) {
  const {
    name,
    type,
    district,
    taluk,
    verified,
    verifiedSince,
    isOrganic,
    giTag,
    rating,
    reviewsCount,
    productsCount,
    image,
    description,
    productCategories
  } = vendor;

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <article className="vendor-card" aria-label={`Vendor profile for ${name}`}>
      {/* Visual media banner */}
      <div className="vendor-card-media">
        <img
          src={image}
          alt={`${name} farm in ${district}, Kerala`}
          className="vendor-card-img"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="vendor-card-badges-overlay">
          {verified ? (
            <VerificationBadge type={type.replace('Farmer', '') || 'Farmer'} size="compact" />
          ) : (
            <span style={{ 
              background: 'rgba(31, 41, 55, 0.75)', 
              color: '#FEFDF8', 
              fontSize: '0.6875rem', 
              padding: '3px 8px', 
              borderRadius: '6px', 
              fontWeight: 600 
            }}>
              PENDING AUDIT
            </span>
          )}

          {isOrganic && (
            <span className="vendor-organic-indicator" title="Certified Organic Production">
              <Leaf size={11} strokeWidth={2.4} />
              <span>Organic</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Information Body */}
      <div className="vendor-card-body">
        <div className="vendor-card-header">
          <div className="vendor-type-tag">{type}</div>
          <h3 className="vendor-card-title">{name}</h3>
          
          <div className="vendor-card-location">
            <MapPin size={14} color="#52604D" aria-hidden="true" />
            <span>{taluk}, {district}</span>
          </div>
        </div>

        {/* GI Tag badge if present */}
        {giTag && (
          <div className="vendor-card-gi-row">
            <GiTag label={giTag.name} code={giTag.code} />
          </div>
        )}

        {/* Short description */}
        <p className="vendor-card-desc">{description}</p>

        {/* Product categories chips */}
        {productCategories && productCategories.length > 0 && (
          <div className="vendor-card-categories" aria-label="Main produce categories">
            {productCategories.slice(0, 3).map((category, idx) => (
              <span key={idx} className="vendor-category-chip">
                {category}
              </span>
            ))}
            {productCategories.length > 3 && (
              <span className="vendor-category-chip" style={{ color: '#737970' }}>
                +{productCategories.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Trust & Market information */}
        <div className="vendor-card-trust-metrics">
          <div className="vendor-metric-item">
            <span className="vendor-metric-rating" aria-label={`Rating: ${rating.toFixed(1)} stars out of 5`}>
              <Star size={13} fill="#F0B400" color="#F0B400" />
              <span>{rating.toFixed(1)}</span>
            </span>
            <span className="vendor-metric-reviews">({reviewsCount})</span>
          </div>

          <div className="vendor-metric-item">
            <Package size={13} color="#52604D" aria-hidden="true" />
            <span className="vendor-metric-products">{productsCount} Products</span>
          </div>

          <div className="vendor-metric-item">
            <Calendar size={13} color="#52604D" aria-hidden="true" />
            <span className="vendor-metric-verified-since">Since {verifiedSince}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="vendor-card-actions">
          <button
            type="button"
            className={`btn-view-farm ${giTag && (rating >= 4.9 || type === 'Cooperative') ? 'btn-cta-orange' : ''}`}
            onClick={() => onViewFarm && onViewFarm(vendor)}
            aria-label={`View farm profile for ${name}`}
          >
            <span>View Farm</span>
            <ArrowRight size={15} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="btn-view-products"
            onClick={() => onViewProducts && onViewProducts(vendor)}
            aria-label={`Browse products from ${name}`}
          >
            <span>View Products</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default VendorCard;
