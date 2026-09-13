// src/components/analytics/RegionalPerformance.tsx
import React from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import type { RegionalPerformanceItem } from '../../data/analyticsData';
import './RegionalPerformance.css';

interface RegionalPerformanceProps {
  districts: RegionalPerformanceItem[];
}

export const RegionalPerformance: React.FC<RegionalPerformanceProps> = ({ districts }) => {
  const maxRevenue = Math.max(...districts.map((d) => d.revenueRaw), 1);

  return (
    <section className="regional-performance-card" aria-label="Kerala Regional Performance">
      <div className="section-header-compact">
        <div>
          <div className="regional-badge">
            <MapPin size={13} />
            <span>DISTRICT CORRIDORS</span>
          </div>
          <h2 className="section-title-md">Kerala Regional Performance</h2>
          <p className="section-subtitle-sm">
            Revenue generation and direct order volume distributed across Kerala's primary agro-climatic zones.
          </p>
        </div>
      </div>

      <div className="regional-bars-list">
        {districts.map((item, idx) => {
          const barWidthPercent = (item.revenueRaw / maxRevenue) * 100;

          return (
            <div key={item.district} className="regional-bar-item">
              <div className="regional-meta-row">
                <div className="regional-name-group">
                  <span className="regional-rank">#{idx + 1}</span>
                  <span className="regional-district-name">{item.district}</span>
                  <span className="regional-produce-tag">{item.primaryProduce}</span>
                </div>

                <div className="regional-stats-group">
                  <span className="regional-orders-count">{item.orders} orders</span>
                  <span className="regional-revenue-val">{item.revenue}</span>
                  <span className="regional-growth-tag">
                    <ArrowUpRight size={12} />
                    {item.growthRate}
                  </span>
                </div>
              </div>

              {/* Proportional Bar */}
              <div className="regional-progress-track" aria-hidden="true">
                <div 
                  className="regional-progress-fill" 
                  style={{ width: `${barWidthPercent}%` }}
                />
                <span className="regional-share-pill">
                  {item.sharePercent}% market share
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RegionalPerformance;
