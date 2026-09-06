import React from 'react';
import './SortDropdown.css';

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' }
];

function SortDropdown({ sort, setSort }) {
  return (
    <div className="sort-dropdown-wrapper">
      <label htmlFor="sort-select" className="sort-label">Sort By:</label>
      <select 
        id="sort-select" 
        className="sort-select"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortDropdown;
