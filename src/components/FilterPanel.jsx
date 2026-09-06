import React from 'react';
import './FilterPanel.css';

function FilterPanel({ filters, setFilters, onClearAll, isOpen, setIsOpen }) {
  const handleCheckboxChange = (filterCategory, value) => {
    setFilters(prev => {
      const current = prev[filterCategory] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [filterCategory]: updated };
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      priceRange: { ...prev.priceRange, [name]: value ? Number(value) : '' }
    }));
  };

  return (
    <>
      <div className={`filter-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}></div>
      <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          <div className="filter-actions">
            <button className="btn-clear" onClick={onClearAll}>Clear All</button>
            <button className="btn-close-mobile" onClick={() => setIsOpen(false)}>✕</button>
          </div>
        </div>

        <div className="filter-group">
          <h4>Price Range (₹)</h4>
          <div className="price-inputs">
            <input 
              type="number" 
              name="min" 
              placeholder="Min" 
              value={filters.priceRange?.min || ''}
              onChange={handlePriceChange}
            />
            <span>-</span>
            <input 
              type="number" 
              name="max" 
              placeholder="Max" 
              value={filters.priceRange?.max || ''}
              onChange={handlePriceChange}
            />
          </div>
        </div>

        <div className="filter-group">
          <h4>Rating</h4>
          {['4', '3', '2'].map(rating => (
            <label key={rating} className="checkbox-label">
              <input 
                type="checkbox"
                checked={filters.rating?.includes(rating) || false}
                onChange={() => handleCheckboxChange('rating', rating)}
              />
              {rating}★ & above
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h4>Type</h4>
          <label className="checkbox-label">
            <input 
              type="checkbox"
              checked={filters.organic?.includes('true') || false}
              onChange={() => handleCheckboxChange('organic', 'true')}
            />
            Organic
          </label>
          <label className="checkbox-label">
            <input 
              type="checkbox"
              checked={filters.organic?.includes('false') || false}
              onChange={() => handleCheckboxChange('organic', 'false')}
            />
            Non-Organic
          </label>
        </div>

        <div className="filter-group">
          <h4>Availability</h4>
          <label className="checkbox-label">
            <input 
              type="checkbox"
              checked={filters.availability?.includes('In Stock') || false}
              onChange={() => handleCheckboxChange('availability', 'In Stock')}
            />
            In Stock
          </label>
        </div>
      </div>
    </>
  );
}

export default FilterPanel;
