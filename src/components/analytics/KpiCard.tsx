// src/components/analytics/KpiCard.tsx
import React from 'react';
import { 
  TrendingDown, 
  IndianRupee, 
  ShoppingBag, 
  Receipt, 
  Percent, 
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import type { KpiMetric } from '../../data/analyticsData';
import './KpiCard.css';

interface KpiCardProps {
  metric: KpiMetric;
}

export const KpiCard: React.FC<KpiCardProps> = ({ metric }) => {
  const renderIcon = () => {
    switch (metric.icon) {
      case 'IndianRupee':
        return <IndianRupee size={20} />;
      case 'ShoppingBag':
        return <ShoppingBag size={20} />;
      case 'Receipt':
        return <Receipt size={20} />;
      case 'TrendingUp':
        return <Percent size={20} />;
      default:
        return <BarChart3 size={20} />;
    }
  };

  return (
    <article className={`analytics-kpi-card accent-${metric.accent}`}>
      <div className="kpi-card-header">
        <span className="kpi-label">{metric.label}</span>
        <div className="kpi-icon-wrapper" aria-hidden="true">
          {renderIcon()}
        </div>
      </div>

      <div className="kpi-value-row">
        <div className="kpi-value">{metric.value}</div>
      </div>

      <div className="kpi-footer">
        <span className={`kpi-change ${metric.isPositive ? 'positive' : 'negative'}`}>
          {metric.isPositive ? (
            <ArrowUpRight size={14} className="change-icon" />
          ) : (
            <TrendingDown size={14} className="change-icon" />
          )}
          {metric.change}
        </span>
        <span className="kpi-comparison">{metric.comparisonText}</span>
      </div>
    </article>
  );
};

export default KpiCard;
