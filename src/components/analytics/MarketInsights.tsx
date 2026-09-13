// src/components/analytics/MarketInsights.tsx
import React from 'react';
import { Clock, Compass } from 'lucide-react';
import type { MarketInsightNotice } from '../../data/analyticsData';
import './MarketInsights.css';

interface MarketInsightsProps {
  insights: MarketInsightNotice[];
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({ insights }) => {
  return (
    <section className="market-insights-card" aria-label="Editorial Market Insights">
      <div className="section-header-compact">
        <div>
          <div className="insights-badge">
            <Compass size={13} />
            <span>EDITORIAL DISPATCH</span>
          </div>
          <h2 className="section-title-md">Market Insights</h2>
          <p className="section-subtitle-sm">
            Curated intelligence briefs highlighting demand shifts, MSP premiums, and supply stability across Kerala.
          </p>
        </div>
      </div>

      <div className="insights-list-grid">
        {insights.map((item) => (
          <article key={item.id} className={`insight-bullet-card accent-${item.accent}`}>
            <div className="insight-bullet-header">
              <span className="insight-tag">{item.tag}</span>
              <div className="insight-time">
                <Clock size={12} />
                <span>{item.timestamp}</span>
              </div>
            </div>

            <h3 className="insight-bullet-title">{item.title}</h3>
            <p className="insight-bullet-text">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MarketInsights;
