// src/components/analytics/MarketPriceAnalysis.tsx
import React from 'react';
import { ArrowUp, ArrowRight, ArrowDown, ShieldCheck, Scale } from 'lucide-react';
import type { MarketPriceMspItem } from '../../data/analyticsData';
import './MarketPriceAnalysis.css';

interface MarketPriceAnalysisProps {
  data: MarketPriceMspItem[];
}

export const MarketPriceAnalysis: React.FC<MarketPriceAnalysisProps> = ({ data }) => {
  return (
    <section className="market-price-card" aria-label="Market Price and MSP Intelligence">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow-badge gold">
            <Scale size={13} />
            <span>COMMODITY BENCHMARKING</span>
          </div>
          <h2 className="section-editorial-title">Market Price Intelligence</h2>
          <p className="section-editorial-subtitle">
            Live Kerala farmgate spot prices compared against the Government Minimum Support Price (MSP) reference floor.
          </p>
        </div>

        <div className="msp-status-pill">
          <ShieldCheck size={16} className="msp-shield-icon" />
          <span>All Key Crops Trading Above MSP</span>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="commodity-table">
          <thead>
            <tr>
              <th scope="col">Commodity Produce</th>
              <th scope="col">District Origin</th>
              <th scope="col" className="text-right">Market Price</th>
              <th scope="col" className="text-right">Govt. MSP Floor</th>
              <th scope="col" className="text-right">Premium / Diff</th>
              <th scope="col" className="text-center">Trend</th>
              <th scope="col">Quality Grade</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const isUp = item.trend === 'up';
              const isStable = item.trend === 'stable';

              return (
                <tr key={item.id} className="commodity-row">
                  <td className="commodity-name-cell">
                    <span className="commodity-title">{item.product}</span>
                    {item.malayalamName && (
                      <span className="commodity-subname">{item.malayalamName}</span>
                    )}
                  </td>
                  <td>
                    <span className="district-tag">{item.district}</span>
                  </td>
                  <td className="text-right font-numeric price-cell">
                    <span className="current-price-val">₹{item.currentPrice.toLocaleString('en-IN')}</span>
                    <span className="unit-label">/{item.unit}</span>
                  </td>
                  <td className="text-right font-numeric msp-cell">
                    <span className="msp-val">₹{item.msp.toLocaleString('en-IN')}</span>
                    <span className="unit-label">/{item.unit}</span>
                  </td>
                  <td className="text-right font-numeric">
                    <span className="diff-badge positive">
                      +{item.differencePercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={`trend-indicator-pill ${item.trend}`}>
                      {isUp && <ArrowUp size={14} />}
                      {isStable && <ArrowRight size={14} />}
                      {item.trend === 'down' && <ArrowDown size={14} />}
                    </span>
                  </td>
                  <td>
                    <span className="quality-grade-badge">{item.qualityGrade}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Advisory Note */}
      <div className="market-price-footnote">
        <span className="footnote-highlight">MSP Advisory:</span>
        Kerala State Agricultural Prices Board reference rates updated for the current seasonal harvest. Market prices reflect direct farm-to-marketplace transactions across state trading hubs.
      </div>
    </section>
  );
};

export default MarketPriceAnalysis;
