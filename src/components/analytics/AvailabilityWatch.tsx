// src/components/analytics/AvailabilityWatch.tsx
import React from 'react';
import { PackageCheck, AlertTriangle, Clock, Ban } from 'lucide-react';
import type { AvailabilityWatchStats } from '../../data/analyticsData';
import './AvailabilityWatch.css';

interface AvailabilityWatchProps {
  stats: AvailabilityWatchStats;
}

export const AvailabilityWatch: React.FC<AvailabilityWatchProps> = ({ stats }) => {
  const total = stats.inStock + stats.lowStock + stats.harvestImminent + stats.soldOut;

  return (
    <section className="availability-watch-card" aria-label="Produce Availability Watch">
      <div className="section-header-compact">
        <div>
          <div className="availability-badge">
            <PackageCheck size={13} />
            <span>INVENTORY STATUS</span>
          </div>
          <h2 className="section-title-md">Availability Watch</h2>
          <p className="section-subtitle-sm">
            Current farm lot readiness, inventory buffers, and harvest replenishment watch.
          </p>
        </div>
      </div>

      <div className="availability-grid">
        {/* In Stock */}
        <div className="avail-card status-in-stock">
          <div className="avail-card-header">
            <span className="avail-label">IN STOCK</span>
            <div className="avail-indicator green" />
          </div>
          <div className="avail-val">{stats.inStock}</div>
          <div className="avail-desc">Healthy supply ({((stats.inStock / total) * 100).toFixed(0)}%)</div>
        </div>

        {/* Low Stock */}
        <div className="avail-card status-low-stock">
          <div className="avail-card-header">
            <span className="avail-label">LOW STOCK</span>
            <AlertTriangle size={15} className="avail-icon orange" />
          </div>
          <div className="avail-val">{stats.lowStock}</div>
          <div className="avail-desc">Reorder threshold reached</div>
        </div>

        {/* Harvest Imminent */}
        <div className="avail-card status-imminent">
          <div className="avail-card-header">
            <span className="avail-label">HARVEST IMMINENT</span>
            <Clock size={15} className="avail-icon gold" />
          </div>
          <div className="avail-val">{stats.harvestImminent}</div>
          <div className="avail-desc">Expected in 48-72 hrs</div>
        </div>

        {/* Sold Out */}
        <div className="avail-card status-sold-out">
          <div className="avail-card-header">
            <span className="avail-label">SOLD OUT</span>
            <Ban size={15} className="avail-icon slate" />
          </div>
          <div className="avail-val">{stats.soldOut}</div>
          <div className="avail-desc">Awaiting next batch</div>
        </div>
      </div>

      {/* Proportional Inventory Stack Bar */}
      <div className="avail-proportional-bar-wrapper">
        <div className="avail-stack-bar" role="progressbar" aria-label="Inventory Distribution">
          <div 
            className="stack-segment segment-green" 
            style={{ width: `${(stats.inStock / total) * 100}%` }}
            title={`In Stock: ${stats.inStock}`}
          />
          <div 
            className="stack-segment segment-gold" 
            style={{ width: `${(stats.harvestImminent / total) * 100}%` }}
            title={`Harvest Imminent: ${stats.harvestImminent}`}
          />
          <div 
            className="stack-segment segment-orange" 
            style={{ width: `${(stats.lowStock / total) * 100}%` }}
            title={`Low Stock: ${stats.lowStock}`}
          />
          <div 
            className="stack-segment segment-slate" 
            style={{ width: `${(stats.soldOut / total) * 100}%` }}
            title={`Sold Out: ${stats.soldOut}`}
          />
        </div>
      </div>
    </section>
  );
};

export default AvailabilityWatch;
