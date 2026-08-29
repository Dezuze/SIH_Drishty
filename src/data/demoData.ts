import { LocationPoint, OrderCluster, LogisticsSummary, RouteSegment } from '../types';
import detailedRoadCoordinates from './routeCoordinates.json';

export const FARM_LOCATION: LocationPoint = {
  id: 'farm-hub',
  name: 'Farm (Origin)',
  type: 'farm',
  lat: 8.6042,
  lng: 77.0015,
  address: 'Regional Agro Hub, Nedumangad Agro Corridor',
  weightKg: 0,
  deliveryTime: '06:30 AM Dispatch',
};

export const CUSTOMER_LOCATIONS: LocationPoint[] = [
  {
    id: 'cust-a',
    name: 'Customer A',
    type: 'customer',
    lat: 8.5284,
    lng: 76.9582,
    address: 'Greenfield Enclave, Kowdiar Road',
    orderId: 'ORD-101',
    weightKg: 35,
    itemsSummary: 'Organic Tomatoes & Root Vegetables (35 kg)',
    deliveryTime: '07:15 AM',
  },
  {
    id: 'cust-b',
    name: 'Customer B',
    type: 'customer',
    lat: 8.5020,
    lng: 76.9610,
    address: 'Palm Meadows, Vazhuthacaud Avenue',
    orderId: 'ORD-102',
    weightKg: 28,
    itemsSummary: 'Bell Peppers & Farm Spinach (28 kg)',
    deliveryTime: '07:35 AM',
  },
  {
    id: 'cust-c',
    name: 'Customer C',
    type: 'customer',
    lat: 8.5420,
    lng: 76.9240,
    address: 'Green Valley, Ulloor / Kesavadasapuram',
    orderId: 'ORD-103',
    weightKg: 22,
    itemsSummary: 'Farm Raw Milk & Fresh Greens (22 kg)',
    deliveryTime: '07:55 AM',
  },
];

export const ROUTE_SEGMENTS: RouteSegment[] = [
  {
    id: 'seg-1',
    from: 'Farm',
    to: 'Customer A',
    fromTitle: 'Farm',
    toTitle: 'Customer A',
    distanceKm: 9.8,
    travelTimeMin: 20,
  },
  {
    id: 'seg-2',
    from: 'Customer A',
    to: 'Customer B',
    fromTitle: 'Customer A',
    toTitle: 'Customer B',
    distanceKm: 7.6,
    travelTimeMin: 17,
  },
  {
    id: 'seg-3',
    from: 'Customer B',
    to: 'Customer C',
    fromTitle: 'Customer B',
    toTitle: 'Customer C',
    distanceKm: 7.2,
    travelTimeMin: 15,
  },
];

export const ORDER_CLUSTER: OrderCluster = {
  id: 'cluster-01',
  name: 'Nearby Order Cluster (3 Orders)',
  ordersCount: 3,
  totalWeightKg: 85, // 35 + 28 + 22 kg
  vehicleCapacityKg: 150,
  customerNames: ['Customer A (35 kg)', 'Customer B (28 kg)', 'Customer C (22 kg)'],
};

export const LOGISTICS_SUMMARY: LogisticsSummary = {
  ordersCount: 3,
  vehicleCapacityKg: 150,
  currentPayloadKg: 85,
  totalDistanceKm: 24.6,
  totalTravelTimeMin: 52,
};

// 1001 exact road-following polyline coordinates (from real road network)
export const ROAD_POLYLINE_COORDINATES: [number, number][] = detailedRoadCoordinates as [number, number][];

