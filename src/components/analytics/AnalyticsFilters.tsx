// src/components/analytics/AnalyticsFilters.tsx
import React from 'react';
import { RotateCcw, Calendar, MapPin, Tag, Users } from 'lucide-react';
import { 
  ANALYTICS_CATEGORIES, 
  ANALYTICS_DISTRICTS, 
  ANALYTICS_VENDORS 
} from '../../data/analyticsData';
import './AnalyticsFilters.css';

export interface AnalyticsFilterState {
  dateRange: 'Today' | '7 Days' | '30 Days' | '3 Months' | 'Custom';
  category: string;
  district: string;
  vendor: string;
}

interface AnalyticsFiltersProps {
  filters: AnalyticsFilterState;
  onFilterChange: (updated: Partial<AnalyticsFilterState>) => void;
  onReset: () => void;
}

const DATE_RANGES: Array<'Today' | '7 Days' | '30 Days' | '3 Months' | 'Custom'> = [
  'Today',
  '7 Days',
  '30 Days',
  '3 Months',
  'Custom'
];

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  const isFiltered = 
    filters.dateRange !== '30 Days' ||
    filters.category !== 'All Categories' ||
    filters.district !== 'All Districts' ||
    filters.vendor !== 'All Vendors';

  return (
    <section className="analytics-filter-bar" aria-label="Market Intelligence Filter Controls">
      <div className="filter-bar-inner">
        
        {/* Date Range Tabs */}
        <div className="filter-group date-range-group">
          <span className="filter-group-label">
            <Calendar size={14} className="filter-icon" />
            <span>Period:</span>
          </span>
          <div className="date-range-pills" role="radiogroup" aria-label="Select date range">
            {DATE_RANGES.map((range) => {
              const isSelected = filters.dateRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`date-pill-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => onFilterChange({ dateRange: range })}
                >
                  {range}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="filter-dropdowns-row">
          {/* Category Filter */}
          <div className="filter-select-wrapper">
            <Tag size={14} className="select-icon" />
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              aria-label="Filter by agricultural category"
              className="analytics-select"
            >
              {ANALYTICS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="filter-select-wrapper">
            <MapPin size={14} className="select-icon" />
            <select
              value={filters.district}
              onChange={(e) => onFilterChange({ district: e.target.value })}
              aria-label="Filter by Kerala district"
              className="analytics-select"
            >
              {ANALYTICS_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Vendor Filter */}
          <div className="filter-select-wrapper">
            <Users size={14} className="select-icon" />
            <select
              value={filters.vendor}
              onChange={(e) => onFilterChange({ vendor: e.target.value })}
              aria-label="Filter by verified producer or cooperative"
              className="analytics-select"
            >
              {ANALYTICS_VENDORS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Clear / Reset Filter Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="btn-reset-filters"
              title="Reset all filters to defaults"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>
    </section>
  );
};

export default AnalyticsFilters;
