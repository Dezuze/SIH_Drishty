// src/components/analytics/ProfitBreakdown.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { ProfitBreakdownStats } from '../../data/analyticsData';
import './ProfitBreakdown.css';

interface ProfitBreakdownProps {
  stats: ProfitBreakdownStats;
}

export const ProfitBreakdown: React.FC<ProfitBreakdownProps> = ({ stats }) => {
  const farmerSharePercent = ((stats.productCostRaw / stats.grossRevenueRaw) * 100).toFixed(1);
  const logisticsPercent = ((stats.logisticsCostRaw / stats.grossRevenueRaw) * 100).toFixed(1);
  const platformPercent = ((stats.platformOpsCostRaw / stats.grossRevenueRaw) * 100).toFixed(1);
  const netMarginPercent = stats.netMarginPercent.toFixed(1);

  return (
    <section className="profit-breakdown-card" aria-label="Marketplace Margin and Profit Breakdown">
      <div className="section-header-compact">
        <div>
          <div className="profit-badge">
            <TrendingUp size={13} />
            <span>FINANCIAL SUSTAINABILITY</span>
          </div>
          <h2 className="section-title-md">Profit Breakdown</h2>
          <p className="section-subtitle-sm">
            Value flow across the supply chain, highlighting direct farmer payout and net marketplace margin.
          </p>
        </div>

        <div className="net-margin-highlight-box">
          <span className="net-margin-lbl">Net Operating Margin</span>
          <span className="net-margin-val">{netMarginPercent}%</span>
        </div>
      </div>

      {/* Visual Proportional Distribution Bar */}
      <div className="distribution-bar-wrapper">
        <div className="distribution-bar" role="progressbar" aria-label="Value Allocation Breakdown">
          <div 
            className="dist-segment farmer" 
            style={{ width: `${farmerSharePercent}%` }}
            title={`Farmer Share: ${stats.productCost} (${farmerSharePercent}%)`}
          />
          <div 
            className="dist-segment logistics" 
            style={{ width: `${logisticsPercent}%` }}
            title={`Logistics & Cold Chain: ${stats.logisticsCost} (${logisticsPercent}%)`}
          />
          <div 
            className="dist-segment platform" 
            style={{ width: `${platformPercent}%` }}
            title={`Platform Operations: ${stats.platformOpsCost} (${platformPercent}%)`}
          />
          <div 
            className="dist-segment net-profit" 
            style={{ width: `${netMarginPercent}%` }}
            title={`Net Margin: ${stats.netProfit} (${netMarginPercent}%)`}
          />
        </div>
      </div>

      {/* Cost Waterfall Breakdown Items */}
      <div className="cost-breakdown-grid">
        {/* Gross Revenue */}
        <div className="cost-item gross">
          <div className="cost-item-header">
            <span className="cost-dot gross" />
            <span className="cost-name">Gross Revenue</span>
          </div>
          <div className="cost-val">{stats.grossRevenue}</div>
          <div className="cost-ratio">100.0% of Volume</div>
        </div>

        {/* Product Cost (Farmer share) */}
        <div className="cost-item farmer">
          <div className="cost-item-header">
            <span className="cost-dot farmer" />
            <span className="cost-name">Direct Farmer Share</span>
          </div>
          <div className="cost-val">{stats.productCost}</div>
          <div className="cost-ratio">{farmerSharePercent}% Producer Payout</div>
        </div>

        {/* Logistics */}
        <div className="cost-item logistics">
          <div className="cost-item-header">
            <span className="cost-dot logistics" />
            <span className="cost-name">Logistics &amp; Cold-Chain</span>
          </div>
          <div className="cost-val">{stats.logisticsCost}</div>
          <div className="cost-ratio">{logisticsPercent}% Transport &amp; Storage</div>
        </div>

        {/* Platform Operations */}
        <div className="cost-item platform">
          <div className="cost-item-header">
            <span className="cost-dot platform" />
            <span className="cost-name">Platform / Ops</span>
          </div>
          <div className="cost-val">{stats.platformOpsCost}</div>
          <div className="cost-ratio">{platformPercent}% QA &amp; Traceability</div>
        </div>

        {/* Net Profit */}
        <div className="cost-item net">
          <div className="cost-item-header">
            <span className="cost-dot net" />
            <span className="cost-name">Net Marketplace Profit</span>
          </div>
          <div className="cost-val net-val">{stats.netProfit}</div>
          <div className="cost-ratio net-ratio">{netMarginPercent}% Net Margin</div>
        </div>
      </div>

      <div className="profit-guarantee-note">
        <span className="guarantee-bold">Fair Agrarian Promise:</span> Over 61% of all marketplace revenue directly reaches primary Kerala farmers and producer cooperatives with zero middleman deductions.
      </div>
    </section>
  );
};

export default ProfitBreakdown;
