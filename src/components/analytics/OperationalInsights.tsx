// src/components/analytics/OperationalInsights.tsx
import React from 'react';
import { Activity, Clock, Truck, ShieldCheck, Layers, QrCode } from 'lucide-react';
import type { OperationalInsightsStats } from '../../data/analyticsData';
import './OperationalInsights.css';

interface OperationalInsightsProps {
  stats: OperationalInsightsStats;
}

export const OperationalInsights: React.FC<OperationalInsightsProps> = ({ stats }) => {
  return (
    <section className="operational-insights-card" aria-label="Agricultural Operational Indicators">
      <div className="section-header-compact">
        <div>
          <div className="ops-badge">
            <Activity size={13} />
            <span>SUPPLY CHAIN EFFICIENCY</span>
          </div>
          <h2 className="section-title-md">Operational Insights</h2>
          <p className="section-subtitle-sm">
            Core performance indicators measuring farm-to-table logistics, verification integrity, and batch traceability.
          </p>
        </div>
      </div>

      <div className="ops-indicators-grid">
        {/* Average Fulfillment Time */}
        <div className="ops-tile">
          <div className="ops-tile-header">
            <Clock size={16} className="ops-tile-icon" />
            <span className="ops-tile-label">Avg. Fulfillment</span>
          </div>
          <div className="ops-tile-val">{stats.averageFulfillmentHours} hrs</div>
          <div className="ops-tile-sub">From harvest to buyer dispatch</div>
        </div>

        {/* On-Time Delivery */}
        <div className="ops-tile">
          <div className="ops-tile-header">
            <Truck size={16} className="ops-tile-icon" />
            <span className="ops-tile-label">On-Time Delivery</span>
          </div>
          <div className="ops-tile-val">{stats.onTimeDeliveryRate}%</div>
          <div className="ops-tile-sub">Cold-transit SLA compliance</div>
        </div>

        {/* Verified Vendors */}
        <div className="ops-tile">
          <div className="ops-tile-header">
            <ShieldCheck size={16} className="ops-tile-icon" />
            <span className="ops-tile-label">Verified Vendors</span>
          </div>
          <div className="ops-tile-val">{stats.verifiedVendors}</div>
          <div className="ops-tile-sub">100% field audited growers</div>
        </div>

        {/* Active Produce */}
        <div className="ops-tile">
          <div className="ops-tile-header">
            <Layers size={16} className="ops-tile-icon" />
            <span className="ops-tile-label">Active Produce</span>
          </div>
          <div className="ops-tile-val">{stats.activeProduceListings}</div>
          <div className="ops-tile-sub">Available for instant order</div>
        </div>

        {/* Traceable Lots */}
        <div className="ops-tile highlight-trace">
          <div className="ops-tile-header">
            <QrCode size={16} className="ops-tile-icon green" />
            <span className="ops-tile-label">Traceable Lots</span>
          </div>
          <div className="ops-tile-val">{stats.traceableLotsPercentage}%</div>
          <div className="ops-tile-sub">Direct QR &amp; GI certificate verified</div>
        </div>
      </div>
    </section>
  );
};

export default OperationalInsights;
