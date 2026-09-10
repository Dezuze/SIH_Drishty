import React from 'react';
import { Package, Users, Award, Leaf } from 'lucide-react';
import './ProductMarketplaceSummary.css';

export function ProductMarketplaceSummary({ stats }) {
  const summaryItems = [
    {
      id: 'active',
      label: 'ACTIVE PRODUCE',
      value: stats?.activeListings || 128,
      sub: 'Verified Listings',
      icon: <Package size={20} strokeWidth={2.2} />,
      accentColor: '#1B381E',
      iconBg: 'rgba(27, 56, 30, 0.10)'
    },
    {
      id: 'farmers',
      label: 'VERIFIED FARMERS',
      value: stats?.verifiedProducers || 42,
      sub: 'Active Growers & Guilds',
      icon: <Users size={20} strokeWidth={2.2} />,
      accentColor: '#FF6D2E',
      iconBg: 'rgba(255, 109, 46, 0.12)'
    },
    {
      id: 'gi',
      label: 'GI PRODUCTS',
      value: stats?.giProducts || 24,
      sub: 'Protected Origins',
      icon: <Award size={20} strokeWidth={2.2} />,
      accentColor: '#F0A800',
      iconBg: 'rgba(240, 168, 0, 0.18)'
    },
    {
      id: 'organic',
      label: 'ORGANIC PRODUCE',
      value: stats?.organicListings || 36,
      sub: 'Certified Chemical-Free',
      icon: <Leaf size={20} strokeWidth={2.2} />,
      accentColor: '#1B381E',
      iconBg: 'rgba(163, 213, 93, 0.28)'
    }
  ];

  return (
    <section className="marketplace-summary-section" aria-label="Marketplace Discovery Overview">
      <div className="summary-grid">
        {summaryItems.map((item) => (
          <div key={item.id} className="summary-card">
            <div className="summary-card-header">
              <span className="summary-label">{item.label}</span>
              <div
                className="summary-icon"
                style={{ backgroundColor: item.iconBg, color: item.accentColor }}
                aria-hidden="true"
              >
                {item.icon}
              </div>
            </div>
            <div className="summary-card-body">
              <div className="summary-number">{item.value}</div>
              <div className="summary-sub">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductMarketplaceSummary;
