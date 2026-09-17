import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  // Handle both data formats (products vs PRODUCTS_DATA)
  const vendorName = product.producer || product.vendor;
  const rating = product.rating || 4.5;
  const unit = product.unit || 'kg';

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
              e.target.src = `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400`;
            }
          }}
        />
        {product.organic && <span className="badge badge-organic">Organic</span>}
        {product.isFeatured && <span className="badge badge-featured">Featured</span>}
      </div>
      <div className="product-info">
        <div className="product-meta-top">
          <span className="product-category">{product.category}</span>
          <span className="product-rating inline-flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400 inline" />
            {rating.toFixed(1)}
          </span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-origin">
          <span className="district">{product.district}</span>
          {vendorName && (
            <>
              <span className="dot">•</span>
              <span className="producer">{vendorName}</span>
            </>
          )}
        </div>
        
        <div className="product-bottom">
          <div className="product-price-block">
            <span className="product-price">₹{product.price}</span>
            <span className="unit">/{unit}</span>
          </div>
          <button 
            className="btn-primary add-to-cart-btn" 
            onClick={() => onAddToCart && onAddToCart(product, 1)}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={18} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
