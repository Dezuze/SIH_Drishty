export interface LocationPoint {
  id: string;
  name: string;
  type: 'farm' | 'customer';
  lat: number;
  lng: number;
  address: string;
  weightKg: number;
  orderId?: string;
  itemsSummary?: string;
  deliveryTime?: string;
}

export interface RouteSegment {
  id: string;
  from: string;
  to: string;
  fromTitle: string;
  toTitle: string;
  distanceKm: number;
  travelTimeMin: number;
}

export interface OrderCluster {
  id: string;
  name: string;
  ordersCount: number;
  totalWeightKg: number;
  vehicleCapacityKg: number;
  customerNames: string[];
}

export interface LogisticsSummary {
  ordersCount: number;
  vehicleCapacityKg: number;
  currentPayloadKg: number;
  totalDistanceKm: number;
  totalTravelTimeMin: number;
}

