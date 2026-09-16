// src/pages/Analytics.tsx
// Dedicated Market Analytics & Market Intelligence Dashboard
// Haritha Heritage Agritech

import React, { useState, useMemo } from 'react';
import { Download, RefreshCw, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';

// Analytics Components
import AnalyticsFilters, { type AnalyticsFilterState } from '../components/analytics/AnalyticsFilters';
import KpiCard from '../components/analytics/KpiCard';
import RevenueChart from '../components/analytics/RevenueChart';
import MarketPriceAnalysis from '../components/analytics/MarketPriceAnalysis';
import DemandSignals from '../components/analytics/DemandSignals';
import TopProduce from '../components/analytics/TopProduce';
import HarvestPerformance from '../components/analytics/HarvestPerformance';
import VendorPerformance from '../components/analytics/VendorPerformance';
import AvailabilityWatch from '../components/analytics/AvailabilityWatch';
import RegionalPerformance from '../components/analytics/RegionalPerformance';
import ProfitBreakdown from '../components/analytics/ProfitBreakdown';
import OperationalInsights from '../components/analytics/OperationalInsights';
import MarketInsights from '../components/analytics/MarketInsights';

// Analytics Data
import {
  KPI_METRICS,
  REVENUE_SALES_SERIES_MAP,
  MARKET_PRICE_MSP_DATA,
  DEMAND_SIGNALS_DATA,
  TOP_PERFORMING_PRODUCE_DATA,
  HARVEST_PERFORMANCE_DATA,
  VENDOR_PERFORMANCE_DATA,
  AVAILABILITY_WATCH_DATA,
  REGIONAL_PERFORMANCE_DATA,
  PROFIT_BREAKDOWN_DATA,
  OPERATIONAL_INSIGHTS_DATA,
  MARKET_INSIGHTS_EDITORIAL
} from '../data/analyticsData';

import './Analytics.css';

export const Analytics: React.FC = () => {
  const { cartCount } = useCart() || { cartCount: 0 };

  // Filter state
  const [filters, setFilters] = useState<AnalyticsFilterState>({
    dateRange: '30 Days',
    category: 'All Categories',
    district: 'All Districts',
    vendor: 'All Vendors'
  });

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleFilterChange = (updated: Partial<AnalyticsFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: '30 Days',
      category: 'All Categories',
      district: 'All Districts',
      vendor: 'All Vendors'
    });
    showToast('Filters reset to default 30-day overview');
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Market intelligence telemetry refreshed');
    }, 600);
  };

  const handleExportReport = () => {
    showToast('Exporting Market Intelligence Executive Summary (PDF/CSV)...');
  };

  // Filtered Revenue Series based on dateRange
  const activeRevenueSeries = useMemo(() => {
    return REVENUE_SALES_SERIES_MAP[filters.dateRange] || REVENUE_SALES_SERIES_MAP['30 Days'];
  }, [filters.dateRange]);

  // Filtered Market Prices
  const filteredMarketPrices = useMemo(() => {
    let list = [...MARKET_PRICE_MSP_DATA];
    if (filters.category !== 'All Categories') {
      list = list.filter((item) => item.category === filters.category);
    }
    if (filters.district !== 'All Districts') {
      list = list.filter((item) => item.district === filters.district);
    }
    return list;
  }, [filters.category, filters.district]);

  // Filtered Top Produce
  const filteredTopProduce = useMemo(() => {
    let list = [...TOP_PERFORMING_PRODUCE_DATA];
    if (filters.category !== 'All Categories') {
      list = list.filter((item) => item.category === filters.category);
    }
    if (filters.district !== 'All Districts') {
      list = list.filter((item) => item.district === filters.district);
    }
    return list;
  }, [filters.category, filters.district]);

  // Filtered Vendors
  const filteredVendors = useMemo(() => {
    let list = [...VENDOR_PERFORMANCE_DATA];
    if (filters.district !== 'All Districts') {
      list = list.filter((v) => v.district === filters.district);
    }
    if (filters.vendor !== 'All Vendors') {
      list = list.filter((v) => v.vendor === filters.vendor);
    }
    return list;
  }, [filters.district, filters.vendor]);

  // Filtered Regional Performance
  const filteredDistricts = useMemo(() => {
    if (filters.district !== 'All Districts') {
      return REGIONAL_PERFORMANCE_DATA.filter((d) => d.district === filters.district);
    }
    return REGIONAL_PERFORMANCE_DATA;
  }, [filters.district]);

  return (
    <div className="analytics-page">
      {/* 1. Global Navigation Header */}
      <Header cartCount={cartCount} />

      {/* 2. Page Introduction Hero Header */}
      <header className="analytics-hero-header">
        <div className="analytics-container">
          <div className="analytics-header-inner">
            <div className="analytics-header-text">
              {/* Status Badge */}
              <div className="analytics-status-badge" role="status">
                <span className="analytics-pulse-dot" aria-hidden="true" />
                <span className="analytics-badge-text">MARKET INTELLIGENCE</span>
              </div>

              {/* Main Heading */}
              <h1 className="analytics-page-title">Market Analytics</h1>

              {/* Supporting Text */}
              <p className="analytics-page-subtitle">
                Understand market movement, harvest performance, demand, and marketplace growth across Kerala.
              </p>
            </div>

            {/* Header Action Controls */}
            <div className="analytics-header-cta">
              <button
                type="button"
                className="btn-refresh-feed"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                aria-label="Refresh market data feed"
              >
                <RefreshCw size={16} className={isRefreshing ? 'spin-icon' : ''} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Feed'}</span>
              </button>

              <button
                type="button"
                className="btn-export-report"
                onClick={handleExportReport}
                aria-label="Export Market Intelligence Report"
              >
                <Download size={16} />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Analytics Content Container */}
      <main className="analytics-container">
        {/* Filter Bar */}
        <AnalyticsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* 4. Top KPI Section (4 Prominent Cards) */}
        <section className="analytics-kpi-grid" aria-label="Key Performance Indicators">
          {KPI_METRICS.map((metric) => (
            <KpiCard key={metric.id} metric={metric} />
          ))}
        </section>

        {/* 5. Revenue & Sales Performance (Interactive Chart) */}
        <RevenueChart
          data={activeRevenueSeries}
          periodLabel={filters.dateRange}
        />

        {/* 6. Market Price Intelligence & MSP Comparison */}
        <MarketPriceAnalysis data={filteredMarketPrices} />

        {/* 7. Demand Signals (Spikes & Buyer Procurement Trends) */}
        <DemandSignals signals={DEMAND_SIGNALS_DATA} />

        {/* 8. Top Performing Produce & Regional Performance (Dual Section Grid) */}
        <div className="analytics-dual-grid">
          <div className="dual-grid-col-7">
            <TopProduce produceList={filteredTopProduce} />
          </div>
          <div className="dual-grid-col-5">
            <RegionalPerformance districts={filteredDistricts} />
          </div>
        </div>

        {/* 9. Harvest Performance & Availability Watch */}
        <div className="analytics-dual-grid">
          <div className="dual-grid-col-6">
            <HarvestPerformance stats={HARVEST_PERFORMANCE_DATA} />
          </div>
          <div className="dual-grid-col-6">
            <AvailabilityWatch stats={AVAILABILITY_WATCH_DATA} />
          </div>
        </div>

        {/* 10. Vendor Performance */}
        <VendorPerformance vendors={filteredVendors} />

        {/* 11. Profit Breakdown & Agritech Operational Insights */}
        <div className="analytics-dual-grid">
          <div className="dual-grid-col-7">
            <ProfitBreakdown stats={PROFIT_BREAKDOWN_DATA} />
          </div>
          <div className="dual-grid-col-5">
            <OperationalInsights stats={OPERATIONAL_INSIGHTS_DATA} />
          </div>
        </div>

        {/* 12. Editorial Market Insights Panel */}
        <MarketInsights insights={MARKET_INSIGHTS_EDITORIAL} />
      </main>

      {/* Subtle Toast Feedback */}
      {toastMsg && (
        <div className="analytics-toast-notification" role="status">
          <Sparkles size={16} className="toast-sparkle" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

export default Analytics;
