export interface LocationPoint {
  id: string;
  name: string;
  type: 'farm' | 'customer';
  lat: number;
  lng: number;
  address: string;
  contactPerson: string;
  phone: string;
  orderId?: string;
  produceItems?: {
    name: string;
    quantity: string;
    weightKg: number;
    farmSource: string;
    category: 'Perishable' | 'Grains' | 'Dairy' | 'Vegetables';
  }[];
  weightKg: number;
  priority: 'High' | 'Medium' | 'Low';
  expectedDelivery: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Ready for Dispatch';
  deliveryWindow: string;
  otp: string;
  sequenceNumber?: number;
}

export interface ClusterInfo {
  id: string;
  name: string;
  description: string;
  radiusKm: number;
  ordersCount: number;
  totalWeightKg: number;
  vehicleCapacityKg: number;
  priority: 'High' | 'Medium' | 'Low';
  densityScore: number;
  carbonScore: string;
  orderIds: string[];
}

export interface RouteMetrics {
  totalDistanceKm: number;
  estimatedTimeMin: number;
  totalOrders: number;
  vehicleCapacityKg: number;
  currentPayloadKg: number;
  fuelSavedLitres: number;
  costSavedInr: number;
  co2SavedKg: number;
  routeEfficiencyScore: number;
  isOptimized: boolean;
  unoptimizedDistanceKm: number;
  unoptimizedTimeMin: number;
}

export interface VehicleInfo {
  id: string;
  model: string;
  regNumber: string;
  driverName: string;
  driverRating: number;
  driverPhone: string;
  driverAvatar: string;
  batteryPercent: number;
  storageTempCelsius: number;
  targetTempCelsius: number;
  maxPayloadKg: number;
  currentSpeedKmh: number;
  status: 'Ready' | 'In Route' | 'Completed' | 'Idle';
}

export interface WeatherInfo {
  location: string;
  tempCelsius: number;
  condition: string;
  humidityPercent: number;
  windSpeedKmh: number;
  rainRiskPercent: number;
  roadCondition: 'Optimal' | 'Wet' | 'Congested' | 'Clear';
  visibility: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'route' | 'order' | 'telematics' | 'dispatch' | 'success';
  badge: string;
}
