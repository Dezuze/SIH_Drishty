import { LocationPoint, ClusterInfo, RouteMetrics, VehicleInfo, WeatherInfo, ActivityEvent } from '../types';

export const FARM_LOCATION: LocationPoint = {
  id: 'farm-hub-01',
  name: 'Haritha Organic Agri Hub & Packing Center',
  type: 'farm',
  lat: 8.5241,
  lng: 76.9366,
  address: 'Sector 4, Central Agro Aggregation Hub, Trivandrum Rural, Kerala',
  contactPerson: 'K. Sivaraman (Hub Manager)',
  phone: '+91 94471 28019',
  weightKg: 0,
  priority: 'High',
  expectedDelivery: '06:30 AM (Harvest Dispatch)',
  status: 'Ready for Dispatch',
  deliveryWindow: '06:00 AM - 07:00 AM',
  otp: 'HUB-00',
  sequenceNumber: 0,
};

export const CUSTOMER_LOCATIONS: LocationPoint[] = [
  {
    id: 'cust-a',
    name: 'Customer A - Anita Sharma',
    type: 'customer',
    lat: 8.5341,
    lng: 76.9466,
    address: 'Flat 4B, Greenfield Heights, Kowdiar Road, Trivandrum',
    contactPerson: 'Anita Sharma',
    phone: '+91 98460 33120',
    orderId: 'ORD-AGR-8921',
    produceItems: [
      { name: 'Fresh Organic Tomatoes', quantity: '20 kg crate', weightKg: 20, farmSource: 'Haritha Farm Plot #3', category: 'Perishable' },
      { name: 'Root Carrots & Beetroot', quantity: '15 kg bag', weightKg: 15, farmSource: 'Wayanad High-Altitude Coop', category: 'Vegetables' },
    ],
    weightKg: 35,
    priority: 'High',
    expectedDelivery: '07:12 AM',
    status: 'Pending',
    deliveryWindow: '07:00 AM - 07:30 AM',
    otp: '4829',
    sequenceNumber: 1,
  },
  {
    id: 'cust-b',
    name: 'Customer B - Rajesh Varma',
    type: 'customer',
    lat: 8.5441,
    lng: 76.9566,
    address: 'Villa 12, Palm Meadows Enclave, Sasthamangalam, Trivandrum',
    contactPerson: 'Rajesh Varma',
    phone: '+91 98471 90812',
    orderId: 'ORD-AGR-8922',
    produceItems: [
      { name: 'Hydroponic Colored Bell Peppers', quantity: '16 kg pack', weightKg: 16, farmSource: 'GreenGrow AgriTech', category: 'Vegetables' },
      { name: 'Farm-Fresh Spinach & Methi', quantity: '12 kg bundle', weightKg: 12, farmSource: 'Haritha Farm Polyhouse A', category: 'Perishable' },
    ],
    weightKg: 28,
    priority: 'High',
    expectedDelivery: '07:32 AM',
    status: 'Pending',
    deliveryWindow: '07:20 AM - 07:45 AM',
    otp: '7193',
    sequenceNumber: 2,
  },
  {
    id: 'cust-c',
    name: 'Customer C - Deepa Nair',
    type: 'customer',
    lat: 8.5541,
    lng: 76.9666,
    address: 'House 88, Green Valley Avenue, Vellayambalam, Trivandrum',
    contactPerson: 'Deepa Nair',
    phone: '+91 94463 45110',
    orderId: 'ORD-AGR-8923',
    produceItems: [
      { name: 'A2 Farm Raw Milk & Butter', quantity: '12 Litres/Kg', weightKg: 12, farmSource: 'Desi Dairy Cooperative', category: 'Dairy' },
      { name: 'Organic Moringa & Curry Leaves', quantity: '10 kg box', weightKg: 10, farmSource: 'Pattambi Herbals', category: 'Perishable' },
    ],
    weightKg: 22,
    priority: 'Medium',
    expectedDelivery: '07:52 AM',
    status: 'Pending',
    deliveryWindow: '07:40 AM - 08:10 AM',
    otp: '5561',
    sequenceNumber: 3,
  },
];

export const INITIAL_CLUSTER: ClusterInfo = {
  id: 'cluster-tvm-01',
  name: 'Cluster 1 - Trivandrum Urban North Corridor',
  description: 'Proximity-grouped micro-cluster within 3.4 km corridor for rapid morning perishable dispatch',
  radiusKm: 3.4,
  ordersCount: 3,
  totalWeightKg: 85, // 35 + 28 + 22 = 85 kg
  vehicleCapacityKg: 150,
  priority: 'High',
  densityScore: 94,
  carbonScore: 'A+ (Optimal Batching)',
  orderIds: ['ORD-AGR-8921', 'ORD-AGR-8922', 'ORD-AGR-8923'],
};

export const INITIAL_METRICS: RouteMetrics = {
  totalDistanceKm: 24.6,
  estimatedTimeMin: 52,
  totalOrders: 3,
  vehicleCapacityKg: 150,
  currentPayloadKg: 85,
  fuelSavedLitres: 2.8,
  costSavedInr: 285,
  co2SavedKg: 6.4,
  routeEfficiencyScore: 96,
  isOptimized: true,
  unoptimizedDistanceKm: 34.2,
  unoptimizedTimeMin: 78,
};

export const VEHICLE_DETAILS: VehicleInfo = {
  id: 'EV-REEFER-04',
  model: 'Tata Ace EV Smart Reefer (Cold Chain)',
  regNumber: 'KL-01-AG-2026',
  driverName: 'Rajesh Kumar M.',
  driverRating: 4.9,
  driverPhone: '+91 97455 12099',
  driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  batteryPercent: 84,
  storageTempCelsius: 4.2,
  targetTempCelsius: 4.0,
  maxPayloadKg: 150,
  currentSpeedKmh: 34,
  status: 'Ready',
};

export const WEATHER_DATA: WeatherInfo = {
  location: 'Trivandrum City & Agri Hub Corridor',
  tempCelsius: 26,
  condition: 'Pleasant & Clear Morning',
  humidityPercent: 68,
  windSpeedKmh: 11,
  rainRiskPercent: 5,
  roadCondition: 'Optimal',
  visibility: '10 km (Excellent)',
};

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: '06:15 AM',
    title: 'Cluster #1 Auto-Formed by AgroRoute Engine',
    description: '3 orders grouped with 94% geographic proximity index within 3.4 km radius.',
    type: 'order',
    badge: 'AI Cluster',
  },
  {
    id: 'act-2',
    timestamp: '06:22 AM',
    title: 'Vehicle Capacity & Reefer Pre-Cooling Verified',
    description: 'Tata Ace EV #KL-01-AG-2026 pre-cooled to 4.2°C. Payload: 85 kg / 150 kg (56.6%).',
    type: 'telematics',
    badge: 'Cold Chain OK',
  },
  {
    id: 'act-3',
    timestamp: '06:30 AM',
    title: 'Multi-Stop TSP Route Optimization Computed',
    description: 'Sequence: Farm Hub → Anita (Cust A) → Rajesh (Cust B) → Deepa (Cust C). Saved 9.6 km.',
    type: 'route',
    badge: 'AI Optimized',
  },
  {
    id: 'act-4',
    timestamp: '06:35 AM',
    title: 'Driver राजेश Kumar Assigned & Manifest Dispatched',
    description: 'Driver received digital manifest with 3 customer delivery OTP codes.',
    type: 'dispatch',
    badge: 'Dispatched',
  },
];

// Realistic detailed road polyline coordinates connecting Farm -> Cust A -> Cust B -> Cust C
export const DETAILED_ROUTE_COORDS: [number, number][] = [
  // Farm Hub
  [8.5241, 76.9366],
  [8.5262, 76.9388],
  [8.5285, 76.9412],
  [8.5310, 76.9435],
  [8.5341, 76.9466], // Customer A
  [8.5365, 76.9490],
  [8.5392, 76.9518],
  [8.5418, 76.9542],
  [8.5441, 76.9566], // Customer B
  [8.5468, 76.9592],
  [8.5495, 76.9620],
  [8.5520, 76.9645],
  [8.5541, 76.9666], // Customer C
];
