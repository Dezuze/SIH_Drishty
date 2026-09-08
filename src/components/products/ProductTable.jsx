import React, { useState } from 'react';
import { Eye, ShoppingBag, MapPin, Calendar, Star, Sparkles, Check } from 'lucide-react';
import GiTag from '../vendors/GiTag';
import VerificationBadge from '../vendors/VerificationBadge';
import QuantityControl from './QuantityControl';
import './ProductTable.css';

export function ProductTable({
  products,
  onAddToCart,
  onViewDetails
}) {
  // Local quantity state per product ID
  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    products.forEach((p) => {
      initial[p.id] = p.minimumOrder || 1;
    });
    return initial;
  });

  // Track recently added item for temporary confirmation animation
  const [addedItem, setAddedItem] = useState(null);

  const handleQuantityChange = (productId, qty) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: qty
    }));
  };

  const handleAdd = (product) => {
    const qty = quantities[product.id] || product.minimumOrder || 1;
    if (onAddToCart) {
      onAddToCart(product, qty);
    }
    setAddedItem(product.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1800);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'status-badge-active';
      case 'PRE-ORDER':
        return 'status-badge-preorder';
      case 'LIMITED':
      case 'LIMITED STOCK':
        return 'status-badge-limited';
      case 'URGENT':
      case 'FLASH HARVEST':
        return 'status-badge-urgent';
      default:
        return 'status-badge-active';
    }
  };

  return (
    <div className="available-produce-panel" role="region" aria-label="Available Produce Table">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Available Produce</h2>
          <p className="panel-subtitle">
            Browse verified harvests and purchase directly from Kerala’s agricultural marketplace.
          </p>
        </div>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="table-responsive-container">
        <table className="produce-table">
          <thead>
            <tr>
              <th scope="col" className="th-product">PRODUCT</th>
              <th scope="col" className="th-category">CATEGORY</th>
              <th scope="col" className="th-origin">ORIGIN</th>
              <th scope="col" className="th-harvest">HARVEST</th>
              <th scope="col" className="th-available">AVAILABLE</th>
              <th scope="col" className="th-price">PRICE</th>
              <th scope="col" className="th-status">STATUS</th>
              <th scope="col" className="th-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const currentQty = quantities[p.id] || p.minimumOrder || 1;
              const isRecentlyAdded = addedItem === p.id;

              return (
                <tr key={p.id} className="produce-table-row">
                  {/* PRODUCT */}
                  <td className="td-product">
                    <div className="product-cell-content">
                      <div className="product-thumb-container">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="product-thumb-img"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/products/rice.jpg';
                          }}
                        />
                        {p.organic && (
                          <span className="organic-micro-badge" title="100% Certified Organic">
                            <Sparkles size={10} />
                          </span>
                        )}
                      </div>

                      <div className="product-details-cell">
                        <div className="product-lot-row">
                          <span className="product-lot-tag">{p.lotNumber}</span>
                          {p.rating && (
                            <span className="product-rating-badge">
                              <Star size={11} className="star-icon" />
                              <span>{p.rating.toFixed(1)}</span>
                            </span>
                          )}
                        </div>

                        <div
                          className="product-name-link"
                          onClick={() => onViewDetails(p)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && onViewDetails(p)}
                        >
                          {p.name}
                        </div>

                        <div className="product-vendor-meta">
                          <span className="vendor-name-text">{p.vendor}</span>
                          {p.vendorVerified && (
                            <VerificationBadge size="compact" />
                          )}
                        </div>

                        {p.giTag && (
                          <div className="product-gi-row">
                            <GiTag label={p.giTag.name} code={p.giTag.code} />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="td-category">
                    <span className="category-tag">{p.subCategory || p.category}</span>
                  </td>

                  {/* ORIGIN */}
                  <td className="td-origin">
                    <div className="origin-content">
                      <MapPin size={14} className="origin-pin-icon" />
                      <div>
                        <div className="origin-district">{p.district}</div>
                        {p.taluk && <div className="origin-taluk">{p.taluk}</div>}
                      </div>
                    </div>
                  </td>

                  {/* HARVEST */}
                  <td className="td-harvest">
                    <div className="harvest-content">
                      <span className={`harvest-status-pill ${p.harvestStatus === 'Fresh Harvest' ? 'harvest-fresh' : ''}`}>
                        {p.harvestStatus}
                      </span>
                      <span className="harvest-date-text">
                        <Calendar size={12} />
                        <span>{p.harvestDate}</span>
                      </span>
                    </div>
                  </td>

                  {/* AVAILABLE */}
                  <td className="td-available">
                    <div className="available-stock-text">
                      <strong>{p.availableQuantity} {p.unit}</strong>
                      <span className="stock-label">available</span>
                    </div>
                    <div className="min-order-text">
                      Min order: {p.minimumOrder} {p.unit}
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="td-price">
                    <div className="price-main">
                      ₹{p.price}
                    </div>
                    <div className="price-unit">per {p.unit}</div>
                  </td>

                  {/* STATUS */}
                  <td className="td-status">
                    <span className={`status-badge ${getStatusBadgeClass(p.statusBadge || p.availability)}`}>
                      {p.statusBadge || p.availability}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="td-action">
                    <div className="action-cell-group">
                      <QuantityControl
                        value={currentQty}
                        min={p.minimumOrder || 1}
                        max={p.availableQuantity || 9999}
                        unit={p.unit}
                        onChange={(val) => handleQuantityChange(p.id, val)}
                        compact
                      />

                      <div className="action-buttons-row">
                        <button
                          type="button"
                          className={`btn-add-crate ${isRecentlyAdded ? 'btn-add-crate-success' : ''}`}
                          onClick={() => handleAdd(p)}
                          title={`Add ${currentQty} ${p.unit} of ${p.name} to your crate`}
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
                          className="btn-view-produce"
                          onClick={() => onViewDetails(p)}
                          title="View complete harvest provenance and details"
                          aria-label={`View details for ${p.name}`}
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (Rendered on mobile screens) */}
      <div className="produce-mobile-card-list">
        {products.map((p) => {
          const currentQty = quantities[p.id] || p.minimumOrder || 1;
          const isRecentlyAdded = addedItem === p.id;

          return (
            <article key={p.id} className="produce-mobile-card">
              <div className="mobile-card-header">
                <div className="mobile-card-thumb-wrap">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="mobile-card-thumb"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/products/rice.jpg';
                    }}
                  />
                  {p.organic && (
                    <span className="organic-micro-badge">
                      <Sparkles size={10} />
                    </span>
                  )}
                </div>

                <div className="mobile-card-top-info">
                  <div className="mobile-card-lot-rating">
                    <span className="product-lot-tag">{p.lotNumber}</span>
                    <span className={`status-badge ${getStatusBadgeClass(p.statusBadge || p.availability)}`}>
                      {p.statusBadge || p.availability}
                    </span>
                  </div>

                  <h3
                    className="mobile-card-title"
                    onClick={() => onViewDetails(p)}
                  >
                    {p.name}
                  </h3>

                  <div className="product-vendor-meta">
                    <span className="vendor-name-text">{p.vendor}</span>
                    {p.vendorVerified && <VerificationBadge size="compact" />}
                  </div>
                </div>
              </div>

              {p.giTag && (
                <div className="mobile-card-gi">
                  <GiTag label={p.giTag.name} code={p.giTag.code} />
                </div>
              )}

              <div className="mobile-card-meta-grid">
                <div className="mobile-meta-item">
                  <span className="mobile-meta-lbl">Origin:</span>
                  <span className="mobile-meta-val">{p.district}</span>
                </div>
                <div className="mobile-meta-item">
                  <span className="mobile-meta-lbl">Harvest:</span>
                  <span className="mobile-meta-val">{p.harvestStatus} ({p.harvestDate})</span>
                </div>
                <div className="mobile-meta-item">
                  <span className="mobile-meta-lbl">Available:</span>
                  <span className="mobile-meta-val">{p.availableQuantity} {p.unit}</span>
                </div>
                <div className="mobile-meta-item">
                  <span className="mobile-meta-lbl">Min Order:</span>
                  <span className="mobile-meta-val">{p.minimumOrder} {p.unit}</span>
                </div>
              </div>

              <div className="mobile-card-price-action">
                <div className="mobile-price-block">
                  <span className="mobile-price-num">₹{p.price}</span>
                  <span className="mobile-price-unit">/{p.unit}</span>
                </div>

                <div className="mobile-controls-wrap">
                  <QuantityControl
                    value={currentQty}
                    min={p.minimumOrder || 1}
                    max={p.availableQuantity || 9999}
                    unit={p.unit}
                    onChange={(val) => handleQuantityChange(p.id, val)}
                    compact
                  />

                  <div className="mobile-buttons-row">
                    <button
                      type="button"
                      className={`btn-add-crate ${isRecentlyAdded ? 'btn-add-crate-success' : ''}`}
                      onClick={() => handleAdd(p)}
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
                      className="btn-view-produce"
                      onClick={() => onViewDetails(p)}
                      aria-label={`View details for ${p.name}`}
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
    </div>
  );
}

export default ProductTable;
