import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Calendar, Clock, Truck, ShieldCheck, Award, Sparkles, ShoppingBag, Check } from 'lucide-react';
import GiTag from '../vendors/GiTag';
import VerificationBadge from '../vendors/VerificationBadge';
import QuantityControl from './QuantityControl';
import './ProductDetailsModal.css';

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart
}) {
  if (!isOpen || !product) return null;

  return (
    <ProductDetailsDialog
      key={product.id}
      product={product}
      isOpen={isOpen}
      onClose={onClose}
      onAddToCart={onAddToCart}
    />
  );
}

function ProductDetailsDialog({
  product,
  isOpen,
  onClose,
  onAddToCart
}) {
  const [quantity, setQuantity] = useState(product.minimumOrder || 1);
  const [isAdded, setIsAdded] = useState(false);

  // Handle body scroll locking and Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div
      className="product-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="product-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="product-modal-close-btn"
          onClick={onClose}
          aria-label="Close produce details"
        >
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Left: Product Media Gallery & Highlights */}
          <div className="product-modal-media-col">
            <div className="product-modal-main-img-wrap">
              <img
                src={product.image}
                alt={product.name}
                className="product-modal-main-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/products/rice.jpg';
                }}
              />
              <div className="product-modal-img-badges">
                {product.organic && (
                  <span className="modal-organic-pill">
                    <Sparkles size={12} />
                    <span>100% Organic</span>
                  </span>
                )}
                <span className="modal-lot-pill">
                  {product.lotNumber}
                </span>
              </div>
            </div>

            {/* Origin & Agronomic Trust Summary Box */}
            <div className="product-modal-trust-box">
              <div className="trust-box-item">
                <ShieldCheck size={18} className="trust-box-icon sprout" />
                <div>
                  <div className="trust-box-label">Grower Verification</div>
                  <div className="trust-box-val">Certified Kerala Producer Audit Passed</div>
                </div>
              </div>

              {product.giTag && (
                <div className="trust-box-item">
                  <Award size={18} className="trust-box-icon gold" />
                  <div>
                    <div className="trust-box-label">GI Certification</div>
                    <div className="trust-box-val">{product.giTag.certificateNumber}</div>
                  </div>
                </div>
              )}

              <div className="trust-box-item">
                <Truck size={18} className="trust-box-icon orange" />
                <div>
                  <div className="trust-box-label">Dispatch Care</div>
                  <div className="trust-box-val">{product.deliveryTime || 'Direct farm crate shipping'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Provenance, Specs & Purchase Controls */}
          <div className="product-modal-info-col">
            <div className="modal-category-origin-row">
              <span className="modal-cat-badge">{product.subCategory || product.category}</span>
              <div className="modal-origin-pill">
                <MapPin size={13} color="#FF6D2E" />
                <span>{product.taluk ? `${product.taluk}, ` : ''}{product.district}, Kerala</span>
              </div>
            </div>

            <h2 id="product-modal-title" className="product-modal-title">
              {product.name}
            </h2>

            {/* Vendor & Rating Row */}
            <div className="modal-vendor-rating-row">
              <div className="modal-vendor-info">
                <span className="modal-vendor-label">Cultivated by:</span>
                <span className="modal-vendor-name">{product.vendor}</span>
                {product.vendorVerified && <VerificationBadge size="compact" />}
              </div>

              {product.rating && (
                <div className="modal-rating-badge">
                  <Star size={14} className="star-icon" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="modal-reviews-count">({product.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            {/* GI Tag Box if applicable */}
            {product.giTag && (
              <div className="modal-gi-box">
                <div className="modal-gi-header">
                  <GiTag label={product.giTag.name} code={product.giTag.code} />
                  <span className="gi-reg-no">Reg #{product.giTag.certificateNumber}</span>
                </div>
                {product.giTag.description && (
                  <p className="gi-reg-desc">{product.giTag.description}</p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="modal-desc-section">
              <h3 className="modal-section-h3">Harvest Story &amp; Flavor Profile</h3>
              <p className="modal-desc-text">{product.description}</p>
            </div>

            {/* Specifications Matrix */}
            <div className="modal-specs-grid">
              <div className="spec-card">
                <Calendar size={15} color="#1B381E" />
                <div>
                  <div className="spec-lbl">Harvest Date</div>
                  <div className="spec-val">{product.harvestDate}</div>
                </div>
              </div>

              <div className="spec-card">
                <Clock size={15} color="#1B381E" />
                <div>
                  <div className="spec-lbl">Optimal Shelf Life</div>
                  <div className="spec-val">{product.shelfLife || '12 Months'}</div>
                </div>
              </div>

              <div className="spec-card">
                <Sparkles size={15} color="#1B381E" />
                <div>
                  <div className="spec-lbl">Availability</div>
                  <div className="spec-val">{product.availableQuantity} {product.unit} in stock</div>
                </div>
              </div>

              <div className="spec-card">
                <ShoppingBag size={15} color="#1B381E" />
                <div>
                  <div className="spec-lbl">Minimum Order</div>
                  <div className="spec-val">{product.minimumOrder} {product.unit}</div>
                </div>
              </div>
            </div>

            {/* Pricing & Crate Action Bar */}
            <div className="modal-purchase-footer">
              <div className="modal-price-block">
                <span className="modal-price-tag-lbl">DIRECT FARM PRICE</span>
                <div className="modal-price-display">
                  ₹{product.price} <span className="modal-price-unit">/ {product.unit}</span>
                </div>
              </div>

              <div className="modal-actions-area">
                <QuantityControl
                  value={quantity}
                  min={product.minimumOrder || 1}
                  max={product.availableQuantity || 9999}
                  unit={product.unit}
                  onChange={setQuantity}
                />

                <button
                  type="button"
                  className={`btn-modal-add-crate ${isAdded ? 'btn-modal-added' : ''}`}
                  onClick={handleAdd}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} />
                      <span>Added to Crate</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Add to Crate ({quantity} {product.unit})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsModal;
