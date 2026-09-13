// src/data/analyticsData.ts
// Kerala Agricultural Marketplace Intelligence & Market Analytics Dataset
// Haritha Heritage Agritech

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  rawValue: number;
  change: string;
  isPositive: boolean;
  comparisonText: string;
  accent: 'forest' | 'papaya' | 'gold' | 'sprout';
  icon: string;
}

export interface RevenueSeriesPoint {
  label: string;
  fullDate: string;
  revenue: number; // in ₹ Lakhs or ₹ thousands
  revenueFormatted: string;
  orders: number;
}

export interface MarketPriceMspItem {
  id: string;
  product: string;
  malayalamName?: string;
  currentPrice: number;
  msp: number;
  differencePercent: number;
  trend: 'up' | 'stable' | 'down';
  unit: string;
  district: string;
  category: string;
  qualityGrade: string;
}

export interface DemandSignalItem {
  id: string;
  product: string;
  demandPercentage: number;
  status: 'High demand' | 'Rising' | 'Growing' | 'Stable growth';
  region: string;
  volumeRequestTons: number;
  primaryBuyers: string;
  trendDirection: 'up' | 'neutral';
}

export interface TopProduceItem {
  rank: number;
  id: string;
  product: string;
  category: string;
  district: string;
  image: string;
  unitsSold: string;
  revenue: string;
  revenueRaw: number;
  growth: string;
  rating: number;
  isGiTagged?: boolean;
}

export interface HarvestPerformanceStats {
  activeHarvests: number;
  upcomingHarvests: number;
  completedHarvests: number;
  fulfillmentRate: number;
  inFieldFarms: number;
  currentSeasonalCycle: string;
}

export interface VendorPerformanceItem {
  id: string;
  vendor: string;
  type: string;
  district: string;
  orders: number;
  revenue: string;
  revenueRaw: number;
  fulfillmentRate: string;
  rating: number;
  verified: boolean;
}

export interface AvailabilityWatchStats {
  inStock: number;
  lowStock: number;
  harvestImminent: number;
  soldOut: number;
}

export interface RegionalPerformanceItem {
  district: string;
  revenue: string;
  revenueRaw: number;
  orders: number;
  sharePercent: number;
  primaryProduce: string;
  growthRate: string;
}

export interface ProfitBreakdownStats {
  grossRevenue: string;
  grossRevenueRaw: number;
  productCost: string;
  productCostRaw: number;
  logisticsCost: string;
  logisticsCostRaw: number;
  platformOpsCost: string;
  platformOpsCostRaw: number;
  netProfit: string;
  netProfitRaw: number;
  netMarginPercent: number;
}

export interface OperationalInsightsStats {
  averageFulfillmentHours: number;
  onTimeDeliveryRate: number;
  verifiedVendors: number;
  activeProduceListings: number;
  traceableLotsPercentage: number;
  qualityInspectionPassRate: number;
}

export interface MarketInsightNotice {
  id: string;
  title: string;
  text: string;
  tag: string;
  accent: 'papaya' | 'gold' | 'sprout';
  timestamp: string;
}

// ----------------------------------------------------
// DEFAULT ANALYTICS DATA
// ----------------------------------------------------

export const KPI_METRICS: KpiMetric[] = [
  {
    id: 'kpi-revenue',
    label: 'TOTAL REVENUE',
    value: '₹12.84L',
    rawValue: 1284000,
    change: '+18.6%',
    isPositive: true,
    comparisonText: 'vs previous period',
    accent: 'papaya',
    icon: 'IndianRupee'
  },
  {
    id: 'kpi-orders',
    label: 'ORDERS',
    value: '1,284',
    rawValue: 1284,
    change: '+12.4%',
    isPositive: true,
    comparisonText: 'vs previous period',
    accent: 'forest',
    icon: 'ShoppingBag'
  },
  {
    id: 'kpi-aov',
    label: 'AVERAGE ORDER VALUE',
    value: '₹2,460',
    rawValue: 2460,
    change: '+7.8%',
    isPositive: true,
    comparisonText: 'vs previous period',
    accent: 'gold',
    icon: 'Receipt'
  },
  {
    id: 'kpi-margin',
    label: 'NET MARGIN',
    value: '24.8%',
    rawValue: 24.8,
    change: '+3.2%',
    isPositive: true,
    comparisonText: 'vs previous period',
    accent: 'sprout',
    icon: 'TrendingUp'
  }
];

export const REVENUE_SALES_SERIES_MAP: Record<string, RevenueSeriesPoint[]> = {
  '30 Days': [
    { label: 'Week 1', fullDate: 'Day 1 - 5', revenue: 1.2, revenueFormatted: '₹1.20L', orders: 120 },
    { label: 'Week 2', fullDate: 'Day 6 - 10', revenue: 1.5, revenueFormatted: '₹1.50L', orders: 145 },
    { label: 'Week 3', fullDate: 'Day 11 - 15', revenue: 1.4, revenueFormatted: '₹1.40L', orders: 132 },
    { label: 'Week 4', fullDate: 'Day 16 - 20', revenue: 1.8, revenueFormatted: '₹1.80L', orders: 168 },
    { label: 'Week 5', fullDate: 'Day 21 - 25', revenue: 2.1, revenueFormatted: '₹2.10L', orders: 190 },
    { label: 'Week 6', fullDate: 'Day 26 - 28', revenue: 2.4, revenueFormatted: '₹2.40L', orders: 214 },
    { label: 'Current', fullDate: 'Day 29 - 30', revenue: 2.7, revenueFormatted: '₹2.70L', orders: 238 }
  ],
  '7 Days': [
    { label: 'Mon', fullDate: '7 Days Ago', revenue: 0.38, revenueFormatted: '₹38.2K', orders: 36 },
    { label: 'Tue', fullDate: '6 Days Ago', revenue: 0.44, revenueFormatted: '₹44.1K', orders: 42 },
    { label: 'Wed', fullDate: '5 Days Ago', revenue: 0.41, revenueFormatted: '₹41.5K', orders: 39 },
    { label: 'Thu', fullDate: '4 Days Ago', revenue: 0.52, revenueFormatted: '₹52.0K', orders: 48 },
    { label: 'Fri', fullDate: '3 Days Ago', revenue: 0.61, revenueFormatted: '₹61.2K', orders: 55 },
    { label: 'Sat', fullDate: 'Yesterday', revenue: 0.73, revenueFormatted: '₹73.4K', orders: 68 },
    { label: 'Sun', fullDate: 'Today', revenue: 0.82, revenueFormatted: '₹82.6K', orders: 74 }
  ],
  'Today': [
    { label: '06:00', fullDate: 'Morning Influx', revenue: 0.08, revenueFormatted: '₹8,200', orders: 8 },
    { label: '09:00', fullDate: 'Market Opening', revenue: 0.16, revenueFormatted: '₹16,400', orders: 15 },
    { label: '12:00', fullDate: 'Midday Spurt', revenue: 0.22, revenueFormatted: '₹22,100', orders: 21 },
    { label: '15:00', fullDate: 'Afternoon Lots', revenue: 0.28, revenueFormatted: '₹28,500', orders: 26 },
    { label: '18:00', fullDate: 'Evening Peak', revenue: 0.35, revenueFormatted: '₹35,200', orders: 32 },
    { label: '21:00', fullDate: 'Night Closures', revenue: 0.29, revenueFormatted: '₹29,000', orders: 28 },
    { label: 'Now', fullDate: 'Live Run Rate', revenue: 0.41, revenueFormatted: '₹41,200', orders: 38 }
  ],
  '3 Months': [
    { label: 'May', fullDate: 'Pre-Monsoon Season', revenue: 8.4, revenueFormatted: '₹8.40L', orders: 820 },
    { label: 'Jun', fullDate: 'Edavappathi Monsoon', revenue: 9.8, revenueFormatted: '₹9.80L', orders: 940 },
    { label: 'Jul', fullDate: 'Harvest Spurt', revenue: 11.2, revenueFormatted: '₹11.20L', orders: 1080 },
    { label: 'Aug', fullDate: 'Chingam Festival Pre-Orders', revenue: 12.1, revenueFormatted: '₹12.10L', orders: 1190 },
    { label: 'Sep (MTD)', fullDate: 'Onam Harvest Peak', revenue: 12.84, revenueFormatted: '₹12.84L', orders: 1284 }
  ]
};

export const MARKET_PRICE_MSP_DATA: MarketPriceMspItem[] = [
  {
    id: 'msp-black-pepper',
    product: 'Black Pepper',
    malayalamName: 'കുരുമുളക് (Tellicherry Malabar)',
    currentPrice: 720,
    msp: 650,
    differencePercent: 10.8,
    trend: 'up',
    unit: 'kg',
    district: 'Wayanad',
    category: 'Spices',
    qualityGrade: 'Grade A Export'
  },
  {
    id: 'msp-green-cardamom',
    product: 'Green Cardamom',
    malayalamName: 'ഏലക്ക (High Ranges 8mm+)',
    currentPrice: 1950,
    msp: 1780,
    differencePercent: 9.6,
    trend: 'up',
    unit: 'kg',
    district: 'Idukki',
    category: 'Spices',
    qualityGrade: '8mm Bold Extra'
  },
  {
    id: 'msp-palakkad-matta',
    product: 'Palakkad Matta Rice',
    malayalamName: 'പാലക്കാടൻ മട്ടയരി (GI Certified)',
    currentPrice: 95,
    msp: 88,
    differencePercent: 8.0,
    trend: 'stable',
    unit: 'kg',
    district: 'Palakkad',
    category: 'Rice & Grains',
    qualityGrade: 'Single Polished'
  },
  {
    id: 'msp-wayanad-ginger',
    product: 'Wayanad Fresh Ginger',
    malayalamName: 'വയനാടൻ ഇഞ്ചി',
    currentPrice: 88,
    msp: 82,
    differencePercent: 7.3,
    trend: 'up',
    unit: 'kg',
    district: 'Wayanad',
    category: 'Spices',
    qualityGrade: 'Zero Chemical Residue'
  },
  {
    id: 'msp-pokkali-rice',
    product: 'Pokkali Rice',
    malayalamName: 'പൊക്കാളിയരി (Tidal Organic Grain)',
    currentPrice: 110,
    msp: 102,
    differencePercent: 7.8,
    trend: 'up',
    unit: 'kg',
    district: 'Alappuzha',
    category: 'Rice & Grains',
    qualityGrade: 'Traditional Heritage'
  },
  {
    id: 'msp-malabar-turmeric',
    product: 'Malabar Wild Turmeric',
    malayalamName: 'മഞ്ഞൾ (Curcumin > 5%)',
    currentPrice: 165,
    msp: 150,
    differencePercent: 10.0,
    trend: 'up',
    unit: 'kg',
    district: 'Kannur',
    category: 'Spices',
    qualityGrade: 'Steam Washed'
  },
  {
    id: 'msp-nendran-banana',
    product: 'Nendran Banana',
    malayalamName: 'നേന്ത്രക്കായ (GI Grade A)',
    currentPrice: 60,
    msp: 55,
    differencePercent: 9.1,
    trend: 'up',
    unit: 'kg',
    district: 'Thrissur',
    category: 'Fruits',
    qualityGrade: 'Direct Tree-Ripened'
  }
];

export const DEMAND_SIGNALS_DATA: DemandSignalItem[] = [
  {
    id: 'demand-pepper',
    product: 'BLACK PEPPER',
    demandPercentage: 32,
    status: 'High demand',
    region: 'Wayanad / Idukki',
    volumeRequestTons: 14.2,
    primaryBuyers: 'Export Consortia & Ayurvedic Pharmacies',
    trendDirection: 'up'
  },
  {
    id: 'demand-cardamom',
    product: 'GREEN CARDAMOM',
    demandPercentage: 24,
    status: 'Rising',
    region: 'Idukki',
    volumeRequestTons: 6.8,
    primaryBuyers: 'High Range Auction Guilds',
    trendDirection: 'up'
  },
  {
    id: 'demand-ginger',
    product: 'GINGER',
    demandPercentage: 18,
    status: 'Growing',
    region: 'Wayanad',
    volumeRequestTons: 19.5,
    primaryBuyers: 'Fresh Produce Wholesalers & Processors',
    trendDirection: 'up'
  },
  {
    id: 'demand-banana',
    product: 'BANANA',
    demandPercentage: 14,
    status: 'Stable growth',
    region: 'Thrissur',
    volumeRequestTons: 42.0,
    primaryBuyers: 'Kochi & Kozhikode Urban Markets',
    trendDirection: 'neutral'
  }
];

export const TOP_PERFORMING_PRODUCE_DATA: TopProduceItem[] = [
  {
    rank: 1,
    id: 'top-cardamom',
    product: 'Green Cardamom (8mm+ Bold)',
    category: 'Spices',
    district: 'Idukki',
    image: '/assets/products/green-cardamom.jpg',
    unitsSold: '480 kg',
    revenue: '₹9.36L',
    revenueRaw: 936000,
    growth: '+24.6%',
    rating: 4.9,
    isGiTagged: true
  },
  {
    rank: 2,
    id: 'top-pepper',
    product: 'Tellicherry Black Pepper',
    category: 'Spices',
    district: 'Wayanad',
    image: '/assets/products/black-pepper.jpg',
    unitsSold: '1,120 kg',
    revenue: '₹8.06L',
    revenueRaw: 806400,
    growth: '+18.2%',
    rating: 4.8,
    isGiTagged: true
  },
  {
    rank: 3,
    id: 'top-rice',
    product: 'Palakkad Matta Rice',
    category: 'Rice & Grains',
    district: 'Palakkad',
    image: '/assets/products/rice.jpg',
    unitsSold: '4,850 kg',
    revenue: '₹4.61L',
    revenueRaw: 460750,
    growth: '+14.6%',
    rating: 4.9,
    isGiTagged: true
  },
  {
    rank: 4,
    id: 'top-banana',
    product: 'Nendran Raw Plantain',
    category: 'Fruits',
    district: 'Thrissur',
    image: '/assets/products/nendran-banana.jpg',
    unitsSold: '5,200 kg',
    revenue: '₹3.12L',
    revenueRaw: 312000,
    growth: '+12.0%',
    rating: 4.7,
    isGiTagged: true
  },
  {
    rank: 5,
    id: 'top-ginger',
    product: 'Wayanad Fresh Ginger',
    category: 'Spices',
    district: 'Wayanad',
    image: '/assets/products/ginger.jpg',
    unitsSold: '2,450 kg',
    revenue: '₹2.16L',
    revenueRaw: 215600,
    growth: '+16.8%',
    rating: 4.8,
    isGiTagged: false
  }
];

export const HARVEST_PERFORMANCE_DATA: HarvestPerformanceStats = {
  activeHarvests: 38,
  upcomingHarvests: 16,
  completedHarvests: 124,
  fulfillmentRate: 94.2,
  inFieldFarms: 56,
  currentSeasonalCycle: 'Chingam - Kanni Post-Monsoon Harvesting'
};

export const VENDOR_PERFORMANCE_DATA: VendorPerformanceItem[] = [
  {
    id: 'v-wayanad-01',
    vendor: 'Wayanad Highland Agro Guild',
    type: 'Cooperative',
    district: 'Wayanad',
    orders: 342,
    revenue: '₹4.12L',
    revenueRaw: 412000,
    fulfillmentRate: '97.4%',
    rating: 4.9,
    verified: true
  },
  {
    id: 'v-idukki-01',
    vendor: 'High Ranges Spices & Cardamom Collective',
    type: 'Farmer Producer Co.',
    district: 'Idukki',
    orders: 298,
    revenue: '₹3.85L',
    revenueRaw: 385000,
    fulfillmentRate: '96.1%',
    rating: 4.9,
    verified: true
  },
  {
    id: 'v-palakkad-01',
    vendor: 'Palakkad Heritage Matta Farmers',
    type: 'Producer Society',
    district: 'Palakkad',
    orders: 264,
    revenue: '₹2.48L',
    revenueRaw: 248000,
    fulfillmentRate: '95.0%',
    rating: 4.8,
    verified: true
  },
  {
    id: 'v-thrissur-01',
    vendor: 'Thrissur Organic Plantain Syndicate',
    type: 'Growers Guild',
    district: 'Thrissur',
    orders: 198,
    revenue: '₹1.42L',
    revenueRaw: 142000,
    fulfillmentRate: '93.8%',
    rating: 4.7,
    verified: true
  },
  {
    id: 'v-alappuzha-01',
    vendor: 'Kuttanad & Pokkali Heritage Paddy Trust',
    type: 'Cooperative',
    district: 'Alappuzha',
    orders: 182,
    revenue: '₹0.97L',
    revenueRaw: 97000,
    fulfillmentRate: '92.5%',
    rating: 4.8,
    verified: true
  }
];

export const AVAILABILITY_WATCH_DATA: AvailabilityWatchStats = {
  inStock: 84,
  lowStock: 12,
  harvestImminent: 18,
  soldOut: 5
};

export const REGIONAL_PERFORMANCE_DATA: RegionalPerformanceItem[] = [
  {
    district: 'Wayanad',
    revenue: '₹3.20L',
    revenueRaw: 320000,
    orders: 284,
    sharePercent: 24.9,
    primaryProduce: 'Pepper, Coffee & Ginger',
    growthRate: '+21.4%'
  },
  {
    district: 'Idukki',
    revenue: '₹2.80L',
    revenueRaw: 280000,
    orders: 241,
    sharePercent: 21.8,
    primaryProduce: 'Cardamom & Hill Spices',
    growthRate: '+19.2%'
  },
  {
    district: 'Palakkad',
    revenue: '₹2.40L',
    revenueRaw: 240000,
    orders: 218,
    sharePercent: 18.7,
    primaryProduce: 'Matta Rice & Pulses',
    growthRate: '+15.5%'
  },
  {
    district: 'Thrissur',
    revenue: '₹1.90L',
    revenueRaw: 190000,
    orders: 176,
    sharePercent: 14.8,
    primaryProduce: 'Nendran Banana & Vegetables',
    growthRate: '+12.8%'
  },
  {
    district: 'Kottayam',
    revenue: '₹1.40L',
    revenueRaw: 140000,
    orders: 132,
    sharePercent: 10.9,
    primaryProduce: 'Rubber, Tapioca & Spices',
    growthRate: '+9.4%'
  },
  {
    district: 'Alappuzha',
    revenue: '₹1.14L',
    revenueRaw: 114000,
    orders: 233,
    sharePercent: 8.9,
    primaryProduce: 'Pokkali Rice & Coconut',
    growthRate: '+8.1%'
  }
];

export const PROFIT_BREAKDOWN_DATA: ProfitBreakdownStats = {
  grossRevenue: '₹12.84L',
  grossRevenueRaw: 1284000,
  productCost: '₹7.92L',
  productCostRaw: 792000, // 61.7%
  logisticsCost: '₹1.18L',
  logisticsCostRaw: 118000, // 9.2%
  platformOpsCost: '₹0.56L',
  platformOpsCostRaw: 56000, // 4.4%
  netProfit: '₹3.18L',
  netProfitRaw: 318000, // 24.8%
  netMarginPercent: 24.8
};

export const OPERATIONAL_INSIGHTS_DATA: OperationalInsightsStats = {
  averageFulfillmentHours: 18.4,
  onTimeDeliveryRate: 94.6,
  verifiedVendors: 42,
  activeProduceListings: 128,
  traceableLotsPercentage: 96.0,
  qualityInspectionPassRate: 98.2
};

export const MARKET_INSIGHTS_EDITORIAL: MarketInsightNotice[] = [
  {
    id: 'insight-1',
    title: 'Spice Surge in Malabar Corridor',
    text: 'Black pepper demand increased 32% this period, led by Wayanad and Idukki bulk institutional buyers.',
    tag: 'Demand Spike',
    accent: 'papaya',
    timestamp: '2 hrs ago'
  },
  {
    id: 'insight-2',
    title: 'Premium Cardamom Auction Dynamics',
    text: 'Green cardamom is currently trading at ₹1,950/kg, +9.6% above reference MSP with sustained 8mm pod volumes.',
    tag: 'MSP Outperformance',
    accent: 'gold',
    timestamp: '4 hrs ago'
  },
  {
    id: 'insight-3',
    title: 'Perishable Supply Chain Resiliency',
    text: 'Nendran banana has maintained stable demand across the last 30 days, supported by rapid cold-transit corridors in Thrissur.',
    tag: 'Supply Stability',
    accent: 'sprout',
    timestamp: '6 hrs ago'
  }
];

// District and category filter options
export const ANALYTICS_DISTRICTS = [
  'All Districts',
  'Wayanad',
  'Idukki',
  'Palakkad',
  'Thrissur',
  'Kottayam',
  'Alappuzha',
  'Kannur'
];

export const ANALYTICS_CATEGORIES = [
  'All Categories',
  'Spices',
  'Rice & Grains',
  'Fruits',
  'Vegetables',
  'Plantation'
];

export const ANALYTICS_VENDORS = [
  'All Vendors',
  'Wayanad Highland Agro Guild',
  'High Ranges Spices & Cardamom Collective',
  'Palakkad Heritage Matta Farmers',
  'Thrissur Organic Plantain Syndicate',
  'Kuttanad & Pokkali Heritage Paddy Trust'
];
