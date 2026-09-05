import React from 'react';
import { Sparkles, Carrot, Apple, Wheat, Leaf, Sprout, Milk, Palmtree } from 'lucide-react';
import './CategoryNavigation.css';

const categories = [
  { name: "For You", icon: <Sparkles size={18} /> },
  { name: "Vegetables", icon: <Carrot size={18} /> },
  { name: "Fruits", icon: <Apple size={18} /> },
  { name: "Grains", icon: <Wheat size={18} /> },
  { name: "Spices", icon: <Leaf size={18} /> },
  { name: "Organic Products", icon: <Sprout size={18} /> },
  { name: "Dairy Products", icon: <Milk size={18} /> },
  { name: "Kerala Specials", icon: <Palmtree size={18} /> }
];
function CategoryNavigation({ activeCategory, onSelectCategory }) {
  return (
    <div className="category-nav-wrapper">
      <div className="container">
        <ul className="category-nav-list">
          {categories.map(category => (
            <li key={category.name} className="category-nav-item">
              <button
                className={`category-nav-btn ${activeCategory === category.name ? 'active' : ''}`}
                onClick={() => onSelectCategory(category.name)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CategoryNavigation;
