// src/components/analytics/DemandSignals.tsx
import React from 'react';
import { Flame, MapPin, ArrowUpRight } from 'lucide-react';
import type { DemandSignalItem } from '../../data/analyticsData';
import './DemandSignals.css';

interface DemandSignalsProps {
  signals: DemandSignalItem[];
}

export const DemandSignals: React.FC<DemandSignalsProps> = ({ signals }) => {
  return (
    <section className="demand-signals-section" aria-label="Agricultural Demand Signals">
      <div className="section-header-compact">
        <div>
          <div className="signals-badge">
            <Flame size={13} className="flame-icon" />
            <span>MARKET SPIKES</span>
          </div>
          <h2 className="section-title-md">Demand Signals</h2>
          <p className="section-subtitle-sm">
            Real-time aggregate buyer order surges and institutional procurement requests.
          </p>
        </div>
      </div>

      <div className="signals-grid">
        {signals.map((item) => {
          return (
            <article key={item.id} className="signal-card">
              <div className="signal-card-top">
                <span className="signal-product-name">{item.product}</span>
                <span className={`signal-status-badge ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {item.status}
                </span>
              </div>

              <div className="signal-metric-row">
                <div className="signal-growth-wrapper">
                  <span className="growth-prefix">Demand</span>
                  <span className="growth-val">
                    <ArrowUpRight size={16} />
                    {item.demandPercentage}%
                  </span>
                </div>

                <div className="signal-progress-bar-bg" aria-hidden="true">
                  <div 
                    className="signal-progress-bar-fill" 
                    style={{ width: `${Math.min(item.demandPercentage * 2.6, 100)}%` }}
                  />
                </div>
              </div>

              <div className="signal-card-meta">
                <div className="signal-region">
                  <MapPin size={13} />
                  <span>{item.region}</span>
                </div>
                <div className="signal-volume">
                  <span>{item.volumeRequestTons} tons request</span>
                </div>
              </div>

              <div className="signal-buyers-footnote">
                <span className="buyers-label">Source:</span> {item.primaryBuyers}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default DemandSignals;
