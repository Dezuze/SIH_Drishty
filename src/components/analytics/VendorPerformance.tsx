// src/components/analytics/VendorPerformance.tsx
import React from 'react';
import { Users, CheckCircle, Star } from 'lucide-react';
import type { VendorPerformanceItem } from '../../data/analyticsData';
import './VendorPerformance.css';

interface VendorPerformanceProps {
  vendors: VendorPerformanceItem[];
}

export const VendorPerformance: React.FC<VendorPerformanceProps> = ({ vendors }) => {
  return (
    <section className="vendor-performance-card" aria-label="Vendor and Producer Performance">
      <div className="section-header-compact">
        <div>
          <div className="vendor-badge">
            <Users size={13} />
            <span>GROWER METRICS</span>
          </div>
          <h2 className="section-title-md">Vendor Performance</h2>
          <p className="section-subtitle-sm">
            Top-performing verified farmers, cooperatives, and producer organizations across Kerala.
          </p>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="vendor-table">
          <thead>
            <tr>
              <th scope="col">Vendor / Producer Guild</th>
              <th scope="col">District</th>
              <th scope="col" className="text-right">Orders</th>
              <th scope="col" className="text-right">Revenue</th>
              <th scope="col" className="text-right">Fulfillment</th>
              <th scope="col" className="text-center">Rating</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id} className="vendor-row">
                <td>
                  <div className="vendor-name-cell">
                    <div className="vendor-title-row">
                      <span className="vendor-name">{v.vendor}</span>
                      {v.verified && (
                        <span className="vendor-verified-pill" title="Verified Kerala Agricultural Producer">
                          <CheckCircle size={12} />
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="vendor-type-tag">{v.type}</span>
                  </div>
                </td>

                <td>
                  <span className="vendor-district-pill">{v.district}</span>
                </td>

                <td className="text-right font-numeric font-medium">
                  {v.orders.toLocaleString()}
                </td>

                <td className="text-right font-numeric font-bold revenue-accent">
                  {v.revenue}
                </td>

                <td className="text-right font-numeric">
                  <span className="fulfillment-badge">
                    {v.fulfillmentRate}
                  </span>
                </td>

                <td className="text-center">
                  <div className="vendor-rating-box">
                    <Star size={13} fill="#F0A800" color="#F0A800" />
                    <span>{v.rating.toFixed(1)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default VendorPerformance;
