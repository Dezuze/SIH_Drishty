import React, { useState, useMemo } from 'react';
import { seasonalData, seasonalCategories } from '../data/seasonalData';
import { 
  TrendingUp, 
  Search, 
  CheckSquare, 
  Square, 
  Sparkles, 
  Calendar,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Sprout
} from 'lucide-react';
import './SeasonalChart.css';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// Current calendar month (0 = Jan, 8 = Sep)
const CURRENT_MONTH_INDEX = new Date().getMonth(); // 8 for September

// Initial selection: 5 prominent crops
const DEFAULT_SELECTED_IDS = ['banana', 'mango', 'cardamom', 'black-pepper', 'matta-rice'];

export function SeasonalChart({ isHero = false }) {
  const [selectedIds, setSelectedIds] = useState(DEFAULT_SELECTED_IDS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'highest-current' | 'name-asc' | 'annual-peak'
  const [hoveredCropId, setHoveredCropId] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showFilters, setShowFilters] = useState(false); // Default open for immediate interaction

  // Filter and sort available crops based on category, search query, and sort mode
  const filteredCrops = useMemo(() => {
    let result = seasonalData.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = 
        item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.malayalamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'highest-current') {
      result = [...result].sort((a, b) => b.yields[CURRENT_MONTH_INDEX] - a.yields[CURRENT_MONTH_INDEX]);
    } else if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.crop.localeCompare(b.crop));
    } else if (sortBy === 'annual-peak') {
      result = [...result].sort((a, b) => Math.max(...b.yields) - Math.max(...a.yields));
    }
    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  // Selected crops that should be rendered on the line graph
  const activeLineCrops = useMemo(() => {
    return seasonalData.filter((item) => selectedIds.includes(item.id));
  }, [selectedIds]);

  // Toggle single crop selection
  const toggleCrop = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Quick Action Presets
  const selectAll = () => {
    setSelectedIds(filteredCrops.map((c) => c.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  const selectPeakThisMonth = () => {
    // Select crops where current month yield is >= 75
    const peakThisMonth = seasonalData
      .filter((c) => c.yields[CURRENT_MONTH_INDEX] >= 70)
      .map((c) => c.id);
    setSelectedIds(peakThisMonth.length > 0 ? peakThisMonth : DEFAULT_SELECTED_IDS);
  };

  const selectTopSpices = () => {
    const spices = seasonalData.filter((c) => c.category === 'Spices').map((c) => c.id);
    setSelectedIds(spices);
  };

  const selectTopFruits = () => {
    const fruits = seasonalData.filter((c) => c.category === 'Fruits').map((c) => c.id);
    setSelectedIds(fruits);
  };

  // SVG Dimension Calculations
  const svgWidth = 920;
  const svgHeight = 380;
  const padding = { top: 35, right: 30, bottom: 45, left: 65 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const getX = (monthIndex) => {
    return padding.left + (monthIndex / 11) * graphWidth;
  };

  const getY = (yieldVal) => {
    // yieldVal from 0 to 100, maps to bottom (padding.top + graphHeight) to top (padding.top)
    return padding.top + graphHeight - (yieldVal / 100) * graphHeight;
  };

  // Generate smooth SVG spline curve path
  const generateSmoothPath = (yields) => {
    const points = yields.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
    if (points.length === 0) return '';

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      // Catmull-Rom to Cubic Bezier control points
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  // Yield level descriptors
  const getYieldLabel = (val) => {
    if (val >= 80) return 'Peak Harvest (High Yield)';
    if (val >= 50) return 'Moderate Harvest Yield';
    if (val >= 20) return 'Early Season / Growth';
    return 'Off-Season / Dormant';
  };

  return (
    <section className={`seasonal-chart-container ${isHero ? 'is-hero-chart' : ''}`} aria-label="Seasonal Agricultural Intelligence">
      
      {/* Header Bar */}
      {!isHero ? (
        <div className="chart-header-row">
          <div>
            <div className="chart-badge">
              <TrendingUp size={14} className="text-emerald-600" />
              <span>Regional Agronomic Intelligence</span>
            </div>
            <h2 className="chart-title">
              Kerala Produce Seasonality & Yield Index
            </h2>
            <p className="chart-subtitle">
              Dynamic 12-month harvest curves across 24 regional crops. Filter by category, sort by yield, toggle lines, and inspect month-by-month telemetry.
            </p>
          </div>

          <div className="view-mode-toggle">
            <button
              type="button"
              className={`view-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              title="Toggle Filter Options"
            >
              <SlidersHorizontal size={16} />
              <span>{showFilters ? 'Hide Filters' : 'Filters & Controls'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 16, right: 24, zIndex: 100 }}>
          <button
            type="button"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fff', border: '1px solid #d1fae5', borderRadius: 9999, fontSize: 13, fontWeight: 700, color: '#047857', boxShadow: '0 4px 12px rgba(16,185,129,0.15)', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            onClick={() => setShowFilters(!showFilters)}
            title="Toggle Filter Options"
          >
            <SlidersHorizontal size={14} />
            {showFilters ? 'Close Filters' : 'Filters & Controls'}
          </button>
        </div>
      )}

      {/* Filter & Controls Toolbar */}
      {showFilters && (
      <div className={`chart-controls-box ${isHero ? 'hero-filter-popup' : ''}`}>
        
        {/* Category Pills, Search & Sort */}
        <div className="category-and-search-row">
          <div className="category-pills" role="tablist">
            {seasonalCategories.map((cat) => {
              const count = cat === 'All' 
                ? seasonalData.length 
                : seasonalData.filter((c) => c.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} <span className="cat-count">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="controls-right-group">
            {/* Quick Search */}
            <div className="crop-search-input-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                className="crop-search-input"
                placeholder="Search crops (e.g., Mango, Cardamom)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="crop-sort-selector-wrapper">
              <ArrowUpDown size={14} className="text-emerald-600 shrink-0" />
              <label htmlFor="crop-sort-select" className="sort-label">Sort:</label>
              <select
                id="crop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="crop-sort-dropdown"
              >
                <option value="default">Default Catalog</option>
                <option value="highest-current">Top Yield in {months[CURRENT_MONTH_INDEX]}</option>
                <option value="name-asc">Name (A → Z)</option>
                <option value="annual-peak">Highest Peak Yield</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Presets */}
        <div className="preset-actions-row">
          <div className="quick-presets">
            <span className="presets-label">
              <SlidersHorizontal size={13} /> Quick Presets:
            </span>
            <button type="button" className="preset-chip" onClick={selectAll}>
              Select All ({filteredCrops.length})
            </button>
            <button type="button" className="preset-chip" onClick={selectPeakThisMonth}>
              <Sparkles size={12} className="text-amber-500" /> Peak in {months[CURRENT_MONTH_INDEX]}
            </button>
            <button type="button" className="preset-chip" onClick={selectTopFruits}>
              All Fruits
            </button>
            <button type="button" className="preset-chip" onClick={selectTopSpices}>
              All Spices
            </button>
            <button type="button" className="preset-chip text-rose-600" onClick={clearAll}>
              Clear
            </button>
          </div>

          <div className="active-count-indicator">
            Active Lines: <strong>{activeLineCrops.length}</strong> of {seasonalData.length}
          </div>
        </div>

        {/* 24 Crop Toggle Chips */}
        <div className="crop-checkboxes-grid">
          {filteredCrops.map((crop) => {
            const isSelected = selectedIds.includes(crop.id);
            const isHovered = hoveredCropId === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                className={`crop-toggle-chip ${isSelected ? 'selected' : 'deselected'} ${isHovered ? 'hovered' : ''}`}
                onClick={() => toggleCrop(crop.id)}
                onMouseEnter={() => setHoveredCropId(crop.id)}
                onMouseLeave={() => setHoveredCropId(null)}
              >
                <span 
                  className="crop-color-indicator" 
                  style={{ backgroundColor: crop.color }} 
                />
                <span className="crop-name-label">{crop.crop}</span>
                <span className="crop-cat-tag">{crop.category}</span>
                {isSelected ? (
                  <CheckSquare size={14} className="toggle-icon checked" />
                ) : (
                  <Square size={14} className="toggle-icon unchecked" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* MAIN VIEW: Interactive Multi-Line Graph */}
      <div className="chart-svg-card">
          
          {/* Top telemetry legend */}
          <div className="svg-legend-bar">
            <div className="yield-legend-badges">
              <span className="legend-indicator peak"><span className="dot"></span> Peak Yield (80-100%)</span>
              <span className="legend-indicator moderate"><span className="dot"></span> Harvest Season (50-79%)</span>
              <span className="legend-indicator early"><span className="dot"></span> Growth / Sowing (20-49%)</span>
              <span className="legend-indicator off"><span className="dot"></span> Off-Season (0-19%)</span>
            </div>
            <div className="current-month-badge">
              <Calendar size={14} /> Current Month: <strong>{months[CURRENT_MONTH_INDEX]}</strong>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="svg-chart-wrapper" style={{ height: isHero ? '100%' : '480px', flex: isHero ? 1 : 'none' }}>
            <svg 
              className="seasonal-svg"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="xMidYMid meet"
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <defs>
                {/* Horizontal grid gradients */}
                <linearGradient id="monthHighlightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity="0.02" />
                </linearGradient>

                {/* Drop shadow for hovered line */}
                <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Current Month Highlight Background Column */}
              <rect
                x={getX(CURRENT_MONTH_INDEX) - (graphWidth / 22)}
                y={padding.top}
                width={graphWidth / 11}
                height={graphHeight}
                fill="url(#monthHighlightGrad)"
                rx="6"
              />

              {/* Y-Axis Horizontal Grid Lines */}
              {[0, 25, 50, 75, 100].map((level) => {
                const yPos = getY(level);
                return (
                  <g key={level} className="grid-line-group">
                    <line
                      x1={padding.left}
                      y1={yPos}
                      x2={svgWidth - padding.right}
                      y2={yPos}
                      className="grid-line"
                    />
                    <text
                      x={padding.left - 10}
                      y={yPos + 4}
                      className="axis-label y-axis-label"
                      textAnchor="end"
                    >
                      {level}%
                    </text>
                  </g>
                );
              })}

              {/* X-Axis Vertical Guide Lines & Month Labels */}
              {months.map((m, idx) => {
                const xPos = getX(idx);
                const isCurrent = idx === CURRENT_MONTH_INDEX;
                return (
                  <g key={m} className="x-axis-group">
                    <line
                      x1={xPos}
                      y1={padding.top}
                      x2={xPos}
                      y2={padding.top + graphHeight}
                      className={`grid-line-vertical ${isCurrent ? 'current-month-line' : ''}`}
                    />
                    <text
                      x={xPos}
                      y={padding.top + graphHeight + 22}
                      className={`axis-label x-axis-label ${isCurrent ? 'current-month-label' : ''}`}
                      textAnchor="middle"
                    >
                      {m}
                    </text>
                    {isCurrent && (
                      <circle
                        cx={xPos}
                        cy={padding.top + graphHeight + 32}
                        r="3"
                        fill="#16A34A"
                      />
                    )}
                  </g>
                );
              })}

              {/* Empty state when no crops selected */}
              {activeLineCrops.length === 0 && (
                <text
                  x={svgWidth / 2}
                  y={svgHeight / 2}
                  textAnchor="middle"
                  className="empty-state-text"
                >
                  No crops selected. Check one or more crops above to display their seasonal curves.
                </text>
              )}

              {/* RENDER CROP LINES */}
              {activeLineCrops.map((crop) => {
                const isHovered = hoveredCropId === crop.id;
                const pathD = generateSmoothPath(crop.yields);
                const strokeOpacity = hoveredCropId ? (isHovered ? 1 : 0.2) : 0.88;
                const strokeWidth = isHovered ? 3.8 : 2.4;

                return (
                  <g 
                    key={crop.id}
                    className={`crop-path-group ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredCropId(crop.id)}
                    onMouseLeave={() => setHoveredCropId(null)}
                  >
                    {/* Wider transparent hit-area for easy mouse interaction */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={16}
                      className="cursor-pointer"
                    />

                    {/* Visible line stroke */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={crop.color}
                      strokeWidth={strokeWidth}
                      strokeOpacity={strokeOpacity}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={isHovered ? 'url(#activeGlow)' : undefined}
                      className="crop-curve transition-all duration-200"
                    />

                    {/* Data Points on Month Nodes */}
                    {crop.yields.map((yieldVal, mIdx) => {
                      const cx = getX(mIdx);
                      const cy = getY(yieldVal);
                      const isPointActive = activeTooltip?.crop.id === crop.id && activeTooltip.monthIndex === mIdx;

                      return (
                        <circle
                          key={mIdx}
                          cx={cx}
                          cy={cy}
                          r={isPointActive ? 7 : (isHovered ? 4.5 : 3)}
                          fill={crop.color}
                          stroke="#ffffff"
                          strokeWidth={isPointActive ? 2.5 : 1.5}
                          opacity={strokeOpacity}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setActiveTooltip({
                              crop,
                              monthIndex: mIdx,
                              x: rect.left + window.scrollX,
                              y: rect.top + window.scrollY
                            });
                          }}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Card */}
            {activeTooltip && (
              <div 
                className="chart-telemetry-tooltip"
                style={{
                  left: `${activeTooltip.x}px`,
                  top: `${activeTooltip.y - 12}px`
                }}
              >
                <div className="tooltip-header">
                  <span 
                    className="tooltip-dot" 
                    style={{ backgroundColor: activeTooltip.crop.color }} 
                  />
                  <div>
                    <h4 className="tooltip-title">{activeTooltip.crop.crop}</h4>
                    <span className="tooltip-malayalam">{activeTooltip.crop.malayalamName}</span>
                  </div>
                </div>
                <div className="tooltip-meta-grid">
                  <div className="tooltip-meta-item">
                    <span className="meta-label">Month:</span>
                    <span className="meta-val">{months[activeTooltip.monthIndex]}</span>
                  </div>
                  <div className="tooltip-meta-item">
                    <span className="meta-label">Yield Index:</span>
                    <span className="meta-val font-bold">{activeTooltip.crop.yields[activeTooltip.monthIndex]}%</span>
                  </div>
                </div>
                <div className="tooltip-status-banner">
                  {getYieldLabel(activeTooltip.crop.yields[activeTooltip.monthIndex])}
                </div>
                <div className="tooltip-peak-note flex items-center gap-1.5">
                  <Sprout size={12} className="text-emerald-600 shrink-0" />
                  <span>Typical Peak Window: <strong>{activeTooltip.crop.peakMonths}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Active Curves Bottom Pills Bar */}
          {activeLineCrops.length > 0 && (
            <div className="active-crops-summary-strip">
              <span className="strip-title">Active Curves:</span>
              <div className="strip-chips-row">
                {activeLineCrops.map((c) => (
                  <span 
                    key={c.id} 
                    className={`active-legend-tag ${hoveredCropId === c.id ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredCropId(c.id)}
                    onMouseLeave={() => setHoveredCropId(null)}
                  >
                    <span className="tag-dot" style={{ backgroundColor: c.color }} />
                    <span className="tag-name">{c.crop}</span>
                    <span className="tag-yield font-mono">({c.yields[CURRENT_MONTH_INDEX]}% now)</span>
                    <button
                      type="button"
                      className="tag-remove-btn"
                      onClick={() => toggleCrop(c.id)}
                      title={`Remove ${c.crop}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

    </section>
  );
};

export default SeasonalChart;
