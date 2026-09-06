import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={`Fresh ${product.name}`} 
          className="product-image" 
          onError={(e) => {
            if (e.target.dataset.failed !== 'true') {
              e.target.dataset.failed = 'true';
              e.target.src = `https://source.unsplash.com/featured/?${encodeURIComponent(product.name)}`;
            }
          }}
        />
        {product.organic && <span className="organic-badge">Organic</span>}
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-meta">
          <span className="product-price">₹{product.price} <span className="unit">/ {product.unit}</span></span>
          <span className="product-rating">★ {product.rating.toFixed(1)}</span>
        </div>
        
        <div className="product-origin">
          <span className="district">{product.district}</span>
          <span className="dot">•</span>
          <span className="producer">{product.producer}</span>
        </div>
        
        <button className="btn-primary add-to-cart-btn" onClick={onAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
