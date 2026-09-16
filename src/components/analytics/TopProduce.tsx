// src/components/analytics/TopProduce.tsx
import React from 'react';
import { Award, Star, ArrowUpRight } from 'lucide-react';
import type { TopProduceItem } from '../../data/analyticsData';
import './TopProduce.css';

interface TopProduceProps {
  produceList: TopProduceItem[];
}

export const TopProduce: React.FC<TopProduceProps> = ({ produceList }) => {
  return (
    <section className="top-produce-section" aria-label="Top Performing Kerala Produce">
      <div className="section-header-compact">
        <div>
          <div className="top-produce-badge">
            <Award size={13} />
            <span>COMMODITY LEADERS</span>
          </div>
          <h2 className="section-title-md">Top Performing Produce</h2>
          <p className="section-subtitle-sm">
            Ranked by aggregate marketplace transaction volume, revenue yield, and buyer satisfaction.
          </p>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="top-produce-table">
          <thead>
            <tr>
              <th scope="col" className="text-center th-rank">Rank</th>
              <th scope="col">Product Produce</th>
              <th scope="col">District Origin</th>
              <th scope="col" className="text-right">Units Sold</th>
              <th scope="col" className="text-right">Revenue Generated</th>
              <th scope="col" className="text-right">Period Growth</th>
              <th scope="col" className="text-center">Buyer Rating</th>
            </tr>
          </thead>
          <tbody>
            {produceList.map((item) => {
              return (
                <tr key={item.id} className="top-produce-row">
                  <td className="text-center td-rank">
                    <span className={`rank-circle rank-${item.rank}`}>
                      {item.rank}
                    </span>
                  </td>

                  <td>
                    <div className="produce-item-info">
                      <img
                        src={item.image}
                        alt={item.product}
                        className="produce-thumb"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="produce-names-stack">
                        <span className="produce-name-primary">{item.product}</span>
                        <div className="produce-badges-row">
                          <span className="produce-cat-tag">{item.category}</span>
                          {item.isGiTagged && (
                            <span className="gi-mini-badge">GI TAG</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="district-text">{item.district}</span>
                  </td>

                  <td className="text-right font-numeric font-medium">
                    {item.unitsSold}
                  </td>

                  <td className="text-right font-numeric font-bold revenue-cell">
                    {item.revenue}
                  </td>

                  <td className="text-right font-numeric">
                    <span className="growth-pill-positive">
                      <ArrowUpRight size={13} />
                      {item.growth}
                    </span>
                  </td>

                  <td className="text-center">
                    <div className="rating-pill">
                      <Star size={13} className="star-icon" fill="#F0A800" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TopProduce;
