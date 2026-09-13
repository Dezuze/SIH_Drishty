// src/components/analytics/HarvestPerformance.tsx
import React from 'react';
import { Sprout, Clock, CheckCircle2, CheckSquare, Calendar } from 'lucide-react';
import type { HarvestPerformanceStats } from '../../data/analyticsData';
import './HarvestPerformance.css';

interface HarvestPerformanceProps {
  stats: HarvestPerformanceStats;
}

export const HarvestPerformance: React.FC<HarvestPerformanceProps> = ({ stats }) => {
  return (
    <section className="harvest-performance-card" aria-label="Agricultural Harvest Performance">
      <div className="section-header-compact">
        <div>
          <div className="harvest-badge">
            <Sprout size={13} />
            <span>FIELD OPERATIONS</span>
          </div>
          <h2 className="section-title-md">Harvest Performance</h2>
          <p className="section-subtitle-sm">
            Live operational status across registered farms and seasonal harvest cycles in Kerala.
          </p>
        </div>

        <div className="season-cycle-tag">
          <Calendar size={14} />
          <span>{stats.currentSeasonalCycle}</span>
        </div>
      </div>

      <div className="harvest-stats-grid">
        {/* Active Harvests */}
        <div className="harvest-stat-tile active">
          <div className="harvest-stat-header">
            <span className="harvest-label">ACTIVE HARVESTS</span>
            <div className="harvest-icon-dot active" />
          </div>
          <div className="harvest-metric-val">{stats.activeHarvests}</div>
          <div className="harvest-subtext">56 participating smallholder plots</div>
        </div>

        {/* Upcoming */}
        <div className="harvest-stat-tile upcoming">
          <div className="harvest-stat-header">
            <span className="harvest-label">UPCOMING</span>
            <Clock size={16} className="harvest-icon upcoming" />
          </div>
          <div className="harvest-metric-val">{stats.upcomingHarvests}</div>
          <div className="harvest-subtext">Scheduled next 14 days</div>
        </div>

        {/* Completed */}
        <div className="harvest-stat-tile completed">
          <div className="harvest-stat-header">
            <span className="harvest-label">COMPLETED</span>
            <CheckCircle2 size={16} className="harvest-icon completed" />
          </div>
          <div className="harvest-metric-val">{stats.completedHarvests}</div>
          <div className="harvest-subtext">100% QA inspected lots</div>
        </div>

        {/* Fulfillment Rate */}
        <div className="harvest-stat-tile fulfillment">
          <div className="harvest-stat-header">
            <span className="harvest-label">FULFILLMENT RATE</span>
            <CheckSquare size={16} className="harvest-icon fulfillment" />
          </div>
          <div className="harvest-metric-val">{stats.fulfillmentRate}%</div>
          <div className="harvest-subtext">+1.8% vs regional targets</div>
        </div>
      </div>

      {/* Progress Bar Visualizer */}
      <div className="harvest-progress-container">
        <div className="progress-labels-row">
          <span className="progress-caption">Harvest Dispatch Quota (Current Season)</span>
          <span className="progress-percent-text">124 of 178 lots fulfilled (69.6%)</span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: '69.6%' }} />
        </div>
      </div>
    </section>
  );
};

export default HarvestPerformance;
