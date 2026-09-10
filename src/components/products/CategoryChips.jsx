import React from 'react';
import { PRODUCT_CATEGORIES } from '../../data/productsData';
import './CategoryChips.css';

export function CategoryChips({ activeCategory, onSelectCategory, categoryCounts = {} }) {
  return (
    <nav className="category-chips-nav" aria-label="Product Categories Navigation">
      <div className="category-chips-container">
        {PRODUCT_CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.query;
          const count = categoryCounts[cat.query];

          return (
            <button
              key={cat.id}
              type="button"
              className={`category-chip ${isSelected ? 'category-chip-selected' : ''}`}
              onClick={() => onSelectCategory(cat.query)}
              aria-pressed={isSelected}
            >
              <span className="chip-label">{cat.label}</span>
              {typeof count === 'number' && (
                <span className={`chip-badge ${isSelected ? 'chip-badge-selected' : ''}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default CategoryChips;
