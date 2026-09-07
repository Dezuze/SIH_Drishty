import React, { useEffect } from 'react';
import { X, MapPin, Phone, Mail, Compass, ShoppingBag, Sprout } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import GiTag from './GiTag';
import './VendorModal.css';

export function VendorModal({ vendor, isOpen, onClose, onAddToCart }) {
  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !vendor) return null;

  return (
    <div 
      className="vendor-modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vendor-modal-title"
    >
      <div className="vendor-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="vendor-modal-close-btn" 
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Banner */}
        <div className="vendor-modal-hero">
          <img 
            src={vendor.image} 
            alt={vendor.name} 
            className="vendor-modal-hero-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Modal Body */}
        <div className="vendor-modal-content">
          <div className="vendor-modal-badge-row">
            <VerificationBadge type={vendor.type} />
            {vendor.giTag && (
              <GiTag label={vendor.giTag.name} code={vendor.giTag.code} />
            )}
            {vendor.isOrganic && (
              <span className="vendor-organic-indicator">
                <Sprout size={12} strokeWidth={2.4} />
                <span>100% Certified Organic</span>
              </span>
            )}
          </div>

          <h2 id="vendor-modal-title" className="vendor-modal-title">
            {vendor.name}
          </h2>
          <p className="vendor-modal-tagline">{vendor.tagline}</p>

          {/* Key Agronomic Stats */}
          <div className="vendor-modal-stats-grid">
            <div className="modal-stat-box">
              <span className="modal-stat-label">Location</span>
              <span className="modal-stat-value">{vendor.taluk}, {vendor.district}</span>
            </div>
            <div className="modal-stat-box">
              <span className="modal-stat-label">Land Holding</span>
              <span className="modal-stat-value">{vendor.farmSizeAcres} Acres</span>
            </div>
            <div className="modal-stat-box">
              <span className="modal-stat-label">Altitude</span>
              <span className="modal-stat-value">{vendor.elevationMeters ? `${vendor.elevationMeters}m MSL` : 'Plains'}</span>
            </div>
            <div className="modal-stat-box">
              <span className="modal-stat-label">Verified Since</span>
              <span className="modal-stat-value">{vendor.verifiedSince}</span>
            </div>
          </div>

          {/* Farm Story */}
          <div className="vendor-modal-section">
            <h3 className="vendor-modal-section-title">
              <Compass size={18} color="#1B381E" />
              <span>Farm Heritage & Story</span>
            </h3>
            <p className="vendor-modal-body-text">{vendor.description}</p>
          </div>

          {/* Farming Practices */}
          {vendor.farmingPractices && vendor.farmingPractices.length > 0 && (
            <div className="vendor-modal-section">
              <h3 className="vendor-modal-section-title">
                <Sprout size={18} color="#1B381E" />
                <span>Sustainable Agricultural Practices</span>
              </h3>
              <div className="farming-practices-list">
                {vendor.farmingPractices.map((practice, idx) => (
                  <span key={idx} className="practice-pill">
                    ✓ {practice}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Farm Produce */}
          {vendor.products && vendor.products.length > 0 && (
            <div className="vendor-modal-section">
              <h3 className="vendor-modal-section-title">
                <ShoppingBag size={18} color="#1B381E" />
                <span>Harvest Produce Directly from {vendor.name}</span>
              </h3>
              <div className="modal-products-grid">
                {vendor.products.map((prod) => (
                  <div key={prod.id} className="modal-product-card">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="modal-product-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/products/rice.jpg';
                      }}
                    />
                    <div className="modal-product-info">
                      <div className="modal-product-name">{prod.name}</div>
                      <div className="modal-product-price">
                        ₹{prod.price} <span className="modal-product-unit">/ {prod.unit}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-add-modal-cart"
                      onClick={() => onAddToCart && onAddToCart(prod)}
                      title="Add this authentic farm harvest to your cart"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="vendor-modal-contact-bar">
            <div className="modal-contact-item">
              <Phone size={15} color="#1B381E" />
              <span>{vendor.contact?.phone}</span>
            </div>
            <div className="modal-contact-item">
              <Mail size={15} color="#1B381E" />
              <span>{vendor.contact?.email}</span>
            </div>
            <div className="modal-contact-item">
              <MapPin size={15} color="#1B381E" />
              <span>{vendor.contact?.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorModal;
