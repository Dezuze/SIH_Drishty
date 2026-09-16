// src/components/analytics/RevenueChart.tsx
import React, { useState, useMemo } from 'react';
import type { RevenueSeriesPoint } from '../../data/analyticsData';
import './RevenueChart.css';

interface RevenueChartProps {
  data: RevenueSeriesPoint[];
  periodLabel: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, periodLabel }) => {
  const [activeView, setActiveView] = useState<'both' | 'revenue' | 'orders'>('both');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chart coordinates calculation
  const width = 800;
  const height = 300;
  const padding = { top: 30, right: 40, bottom: 45, left: 55 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxRevenue = useMemo(() => {
    const max = Math.max(...data.map((d) => d.revenue), 1);
    return Math.ceil(max * 1.2 * 10) / 10;
  }, [data]);

  const maxOrders = useMemo(() => {
    const max = Math.max(...data.map((d) => d.orders), 10);
    return Math.ceil(max * 1.25 / 10) * 10;
  }, [data]);

  const points = useMemo(() => {
    return data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1 || 1)) * chartWidth;
      const yRevenue = padding.top + chartHeight - (d.revenue / maxRevenue) * chartHeight;
      const yOrders = padding.top + chartHeight - (d.orders / maxOrders) * chartHeight;
      return { ...d, x, yRevenue, yOrders };
    });
  }, [data, chartWidth, chartHeight, padding.left, padding.top, maxRevenue, maxOrders]);

  // Smooth SVG Path generator
  const createSmoothPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const mx = (curr.x + next.x) / 2;
      path += ` C ${mx},${curr.y} ${mx},${next.y} ${next.x},${next.y}`;
    }
    return path;
  };

  const revenuePath = useMemo(() => {
    const pts = points.map((p) => ({ x: p.x, y: p.yRevenue }));
    return createSmoothPath(pts);
  }, [points]);

  const revenueAreaPath = useMemo(() => {
    if (points.length === 0) return '';
    const pts = points.map((p) => ({ x: p.x, y: p.yRevenue }));
    const linePart = createSmoothPath(pts);
    const last = points[points.length - 1];
    const first = points[0];
    const bottomY = padding.top + chartHeight;
    return `${linePart} L ${last.x},${bottomY} L ${first.x},${bottomY} Z`;
  }, [points, chartHeight, padding.top]);

  const ordersPath = useMemo(() => {
    const pts = points.map((p) => ({ x: p.x, y: p.yOrders }));
    return createSmoothPath(pts);
  }, [points]);

  const ordersAreaPath = useMemo(() => {
    if (points.length === 0) return '';
    const pts = points.map((p) => ({ x: p.x, y: p.yOrders }));
    const linePart = createSmoothPath(pts);
    const last = points[points.length - 1];
    const first = points[0];
    const bottomY = padding.top + chartHeight;
    return `${linePart} L ${last.x},${bottomY} L ${first.x},${bottomY} Z`;
  }, [points, chartHeight, padding.top]);

  // Grid tick marks
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section className="revenue-performance-card" aria-label="Revenue and Sales Performance Chart">
      <div className="revenue-card-header">
        <div>
          <h2 className="revenue-title">Revenue &amp; Sales Performance</h2>
          <p className="revenue-subtitle">
            Marketplace revenue and order movement over {periodLabel.toLowerCase()}.
          </p>
        </div>

        {/* Legend & View Toggles */}
        <div className="chart-controls">
          <div className="chart-legend">
            {(activeView === 'both' || activeView === 'revenue') && (
              <div className="legend-item forest">
                <span className="legend-color-dot forest" />
                <span className="legend-label">Revenue (₹)</span>
              </div>
            )}
            {(activeView === 'both' || activeView === 'orders') && (
              <div className="legend-item papaya">
                <span className="legend-color-dot papaya" />
                <span className="legend-label">Orders (Count)</span>
              </div>
            )}
          </div>

          <div className="view-toggle-btns" role="group" aria-label="Filter chart metric">
            <button
              type="button"
              className={`toggle-btn ${activeView === 'both' ? 'active' : ''}`}
              onClick={() => setActiveView('both')}
            >
              Both
            </button>
            <button
              type="button"
              className={`toggle-btn ${activeView === 'revenue' ? 'active' : ''}`}
              onClick={() => setActiveView('revenue')}
            >
              Revenue
            </button>
            <button
              type="button"
              className={`toggle-btn ${activeView === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveView('orders')}
            >
              Orders
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="svg-chart-container">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="revenue-svg-chart"
          preserveAspectRatio="none"
          role="img"
          aria-label="Interactive Revenue and Orders Trend Line Chart"
        >
          <defs>
            {/* Forest Green Gradient Area */}
            <linearGradient id="forestRevenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B381E" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#1B381E" stopOpacity="0.0" />
            </linearGradient>

            {/* Papaya Orange Gradient Area */}
            <linearGradient id="papayaOrdersGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6D2E" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FF6D2E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {yTicks.map((tickRatio, idx) => {
            const y = padding.top + chartHeight - tickRatio * chartHeight;
            const revVal = (tickRatio * maxRevenue).toFixed(1);
            return (
              <g key={idx} className="chart-grid-line-group">
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(27, 56, 30, 0.08)"
                  strokeDasharray={tickRatio === 0 ? 'none' : '4 4'}
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="chart-axis-text"
                >
                  ₹{revVal}L
                </text>
              </g>
            );
          })}

          {/* Bottom X-Axis line */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={width - padding.right}
            y2={padding.top + chartHeight}
            stroke="rgba(27, 56, 30, 0.18)"
            strokeWidth="1.5"
          />

          {/* X-Axis Category Labels */}
          {points.map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={padding.top + chartHeight + 24}
              textAnchor="middle"
              className={`chart-axis-text ${hoveredIndex === idx ? 'highlight-x' : ''}`}
            >
              {p.label}
            </text>
          ))}

          {/* Active Hover Crosshair Vertical Line */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <line
              x1={points[hoveredIndex].x}
              y1={padding.top}
              x2={points[hoveredIndex].x}
              y2={padding.top + chartHeight}
              stroke="#1B381E"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="chart-crosshair"
            />
          )}

          {/* 1. Revenue Area & Line */}
          {(activeView === 'both' || activeView === 'revenue') && (
            <>
              <path d={revenueAreaPath} fill="url(#forestRevenueGrad)" />
              <path
                d={revenuePath}
                fill="none"
                stroke="#1B381E"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Point Markers */}
              {points.map((p, idx) => (
                <circle
                  key={`rev-pt-${idx}`}
                  cx={p.x}
                  cy={p.yRevenue}
                  r={hoveredIndex === idx ? 6 : 4}
                  fill="#FEFDF8"
                  stroke="#1B381E"
                  strokeWidth="2.5"
                  className="chart-point-marker"
                />
              ))}
            </>
          )}

          {/* 2. Orders Area & Line */}
          {(activeView === 'both' || activeView === 'orders') && (
            <>
              <path d={ordersAreaPath} fill="url(#papayaOrdersGrad)" />
              <path
                d={ordersPath}
                fill="none"
                stroke="#FF6D2E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={activeView === 'both' ? '6 3' : 'none'}
              />
              {/* Point Markers */}
              {points.map((p, idx) => (
                <circle
                  key={`ord-pt-${idx}`}
                  cx={p.x}
                  cy={p.yOrders}
                  r={hoveredIndex === idx ? 5 : 3.5}
                  fill="#FEFDF8"
                  stroke="#FF6D2E"
                  strokeWidth="2"
                  className="chart-point-marker"
                />
              ))}
            </>
          )}

          {/* Invisible Overlay Rectangles for Smooth Hover Interaction */}
          {points.map((p, idx) => {
            const rectWidth = chartWidth / points.length;
            const rx = p.x - rectWidth / 2;
            return (
              <rect
                key={`hover-${idx}`}
                x={rx}
                y={padding.top}
                width={rectWidth}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                <title>{`${p.label} (${p.fullDate}): Revenue ${p.revenueFormatted}, Orders ${p.orders}`}</title>
              </rect>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="chart-tooltip-floating"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(Math.min(points[hoveredIndex].yRevenue, points[hoveredIndex].yOrders) / height) * 100}%`
            }}
          >
            <div className="tooltip-period-badge">{points[hoveredIndex].label}</div>
            <div className="tooltip-date">{points[hoveredIndex].fullDate}</div>
            <div className="tooltip-metrics">
              <div className="tooltip-metric-row forest">
                <span className="tooltip-dot forest" />
                <span className="tooltip-lbl">Revenue:</span>
                <span className="tooltip-val">{points[hoveredIndex].revenueFormatted}</span>
              </div>
              <div className="tooltip-metric-row papaya">
                <span className="tooltip-dot papaya" />
                <span className="tooltip-lbl">Orders:</span>
                <span className="tooltip-val">{points[hoveredIndex].orders} units</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer Bar */}
      <div className="revenue-card-footer">
        <div className="footer-summary-item">
          <span className="summary-title">Period Peak Revenue:</span>
          <span className="summary-value">
            {data.reduce((prev, curr) => (curr.revenue > prev.revenue ? curr : prev), data[0])?.revenueFormatted}
          </span>
        </div>
        <div className="footer-summary-item">
          <span className="summary-title">Total Orders Recorded:</span>
          <span className="summary-value">
            {data.reduce((sum, curr) => sum + curr.orders, 0).toLocaleString()}
          </span>
        </div>
        <div className="footer-summary-item">
          <span className="summary-title">Revenue Trajectory:</span>
          <span className="summary-badge positive">+18.6% Upward</span>
        </div>
      </div>
    </section>
  );
};

export default RevenueChart;
