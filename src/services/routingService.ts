import precomputedRoutes from '../data/cachedRoadRoutes.json';

export interface RouteResult {
  coordinates: [number, number][]; // [lat, lng]
  distanceKm: number;
  durationMinutes: number;
  isRoadNetwork: boolean;
}

// In-memory cache for fast lookups
const routeCache = new Map<string, RouteResult>();

/**
 * Generate a cache key from start and end coordinates
 */
function getCacheKey(startLat: number, startLng: number, endLat: number, endLng: number): string {
  return `${startLat.toFixed(4)},${startLng.toFixed(4)}->${endLat.toFixed(4)},${endLng.toFixed(4)}`;
}

/**
 * Calculate distance between two lat/lng points in kilometers (Haversine formula)
 */
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Fallback generator: creates a realistic road-like path with curves and street-like turns
 * instead of a raw straight line when network is unavailable.
 */
function generateRealisticRoadFallback(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): RouteResult {
  const points: [number, number][] = [];
  const numSegments = 30;
  
  const dLat = endLat - startLat;
  const dLng = endLng - startLng;
  const directDist = calculateHaversineDistance(startLat, startLng, endLat, endLng);

  // Perpendicular vector for realistic road switchbacks/curves
  const perpLat = -dLng;
  const perpLng = dLat;
  const perpLen = Math.hypot(perpLat, perpLng) || 1;
  const normPerpLat = perpLat / perpLen;
  const normPerpLng = perpLng / perpLen;

  for (let i = 0; i <= numSegments; i++) {
    const t = i / numSegments;
    // Multi-frequency curve simulating road turns and terrain detours
    const curve1 = Math.sin(t * Math.PI) * 0.25;
    const curve2 = Math.sin(t * Math.PI * 3) * 0.08;
    const curve3 = Math.cos(t * Math.PI * 5) * 0.03;
    const totalCurve = (curve1 + curve2 + curve3) * (directDist * 0.003);

    const lat = startLat + dLat * t + normPerpLat * totalCurve;
    const lng = startLng + dLng * t + normPerpLng * totalCurve;
    points.push([+lat.toFixed(6), +lng.toFixed(6)]);
  }

  const estimatedRoadDist = +(directDist * 1.32).toFixed(2);
  const estimatedDuration = Math.max(8, Math.round(estimatedRoadDist * 2.4)); // avg 25 km/h in regional Kerala

  return {
    coordinates: points,
    distanceKm: estimatedRoadDist,
    durationMinutes: estimatedDuration,
    isRoadNetwork: false
  };
}

/**
 * Check if the given coordinates match any precomputed demo route
 */
function checkPrecomputedRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): RouteResult | null {
  const routes = (precomputedRoutes as unknown) as Record<string, { coordinates: [number, number][]; distanceKm: number; durationMinutes: number }>;

  for (const key of Object.keys(routes)) {
    const r = routes[key];
    if (r.coordinates && r.coordinates.length > 0) {
      const first = r.coordinates[0];
      const last = r.coordinates[r.coordinates.length - 1];
      
      const startDist = Math.hypot(first[0] - startLat, first[1] - startLng);
      const endDist = Math.hypot(last[0] - endLat, last[1] - endLng);

      if (startDist < 0.015 && endDist < 0.015) {
        return {
          coordinates: r.coordinates,
          distanceKm: r.distanceKm,
          durationMinutes: r.durationMinutes,
          isRoadNetwork: true
        };
      }
    }
  }
  return null;
}

/**
 * Fetch a true driving road route between two points using OSRM (Open Source Routing Machine).
 * Falls back to high-fidelity cached or generated road paths if network is unavailable.
 */
export async function fetchRoadRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<RouteResult> {
  const cacheKey = getCacheKey(startLat, startLng, endLat, endLng);
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  // Check precomputed routes for instant zero-latency response
  const precomputed = checkPrecomputedRoute(startLat, startLng, endLat, endLng);
  if (precomputed) {
    routeCache.set(cacheKey, precomputed);
    return precomputed;
  }

  // Attempt live road query from OSRM driving service
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // OSRM returns GeoJSON coordinates as [longitude, latitude]
        // Leaflet requires [latitude, longitude]
        const leafletCoords: [number, number][] = route.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [+lat.toFixed(6), +lng.toFixed(6)]
        );

        const result: RouteResult = {
          coordinates: leafletCoords,
          distanceKm: +(route.distance / 1000).toFixed(2),
          durationMinutes: Math.max(1, Math.round(route.duration / 60)),
          isRoadNetwork: true
        };

        routeCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    // Network timeout or error - continue to realistic road fallback
    console.warn('OSRM route fetch failed or timed out, using realistic road curve fallback:', err);
  }

  // Generate realistic curved road fallback
  const fallback = generateRealisticRoadFallback(startLat, startLng, endLat, endLng);
  routeCache.set(cacheKey, fallback);
  return fallback;
}

/**
 * Given a road polyline coordinates array, compute the exact position for a given progress (0.0 to 1.0)
 * by following the road segments proportionally.
 */
export function getPositionAlongRoute(
  coordinates: [number, number][],
  progress: number
): [number, number] {
  if (!coordinates || coordinates.length === 0) return [0, 0];
  if (coordinates.length === 1 || progress <= 0) return coordinates[0];
  if (progress >= 1) return coordinates[coordinates.length - 1];

  // Calculate cumulative segment distances
  const segmentDistances: number[] = [];
  let totalDistance = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const d = calculateHaversineDistance(
      coordinates[i][0],
      coordinates[i][1],
      coordinates[i + 1][0],
      coordinates[i + 1][1]
    );
    segmentDistances.push(d);
    totalDistance += d;
  }

  if (totalDistance === 0) return coordinates[0];

  const targetDistance = totalDistance * progress;
  let accumulated = 0;

  for (let i = 0; i < segmentDistances.length; i++) {
    const segDist = segmentDistances[i];
    if (accumulated + segDist >= targetDistance) {
      const segProgress = segDist > 0 ? (targetDistance - accumulated) / segDist : 0;
      const start = coordinates[i];
      const end = coordinates[i + 1];
      const lat = start[0] + (end[0] - start[0]) * segProgress;
      const lng = start[1] + (end[1] - start[1]) * segProgress;
      return [+lat.toFixed(6), +lng.toFixed(6)];
    }
    accumulated += segDist;
  }

  return coordinates[coordinates.length - 1];
}

/**
 * Find the closest coordinate index along the route for a given position
 */
export function findClosestRouteIndex(
  coordinates: [number, number][],
  currentLat: number,
  currentLng: number
): number {
  if (!coordinates || coordinates.length === 0) return 0;
  let closestIndex = 0;
  let minDistance = Infinity;

  for (let i = 0; i < coordinates.length; i++) {
    const dist = Math.hypot(coordinates[i][0] - currentLat, coordinates[i][1] - currentLng);
    if (dist < minDistance) {
      minDistance = dist;
      closestIndex = i;
    }
  }

  return closestIndex;
}
