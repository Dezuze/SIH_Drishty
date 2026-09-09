import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export const STATUS_STAGES = [
  'Order Placed',
  'Payment Completed',
  'Driver Assigned',
  'Driver Accepted',
  'Picked Up',
  'Out for Delivery',
  'Delivered'
];

export const INITIAL_ORDERS = {
  'DR001': {
    id: 'DR001',
    product: 'Fresh Organic Vegetables & Herbs',
    quantity: '5 kg',
    price: 340,
    customerName: 'Anjali Menon',
    customerPhone: '+91 94471 23456',
    pickupAddress: 'Green Valley Organic Farm, Poonjar, Kottayam',
    pickupLat: 9.6820,
    pickupLng: 76.8150,
    customerAddress: 'Hill View Residence, Erattupetta, Kottayam',
    customerLat: 9.6950,
    customerLng: 76.7820,
    driverId: 'D001',
    driverName: 'Rajesh Kumar',
    driverPhone: '+91 98765 43210',
    driverStatus: 'Available', // Available | Offline
    currentLat: 9.6820,
    currentLng: 76.8150,
    status: 'Driver Assigned',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    createdAt: 'Today, 06:30 AM'
  },
  'DR002': {
    id: 'DR002',
    product: 'Organic Farm Fresh Tomatoes & Greens',
    quantity: '3 kg',
    price: 180,
    customerName: 'Suresh Nambiar',
    customerPhone: '+91 98470 11223',
    pickupAddress: 'Highland Spices & Veggies, Teekoy, Kottayam',
    pickupLat: 9.6710,
    pickupLng: 76.8320,
    customerAddress: 'Riverdale Enclave, Pala, Kottayam',
    customerLat: 9.7120,
    customerLng: 76.6840,
    driverId: 'D001',
    driverName: 'Rajesh Kumar',
    driverPhone: '+91 98765 43210',
    driverStatus: 'Available',
    currentLat: 9.6710,
    currentLng: 76.8320,
    status: 'Picked Up',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    createdAt: 'Today, 07:15 AM'
  }
};

const TrackingContext = createContext(null);

export const TrackingProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('drishti_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  const [driverProfile, setDriverProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('drishti_driver_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      driverCode: 'D001',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      status: 'Available',
      vehicleNumber: 'KL-35-E-4819 (Electric Cargo)',
      rating: 4.9,
      totalDeliveries: 148
    };
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef(null);
  const broadcastChannelRef = useRef(null);

  // Initialize BroadcastChannel for cross-tab realtime sync
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('drishti_tracking_channel');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'UPDATE_ORDERS') {
          setOrders(event.data.orders);
        } else if (event.data?.type === 'UPDATE_DRIVER') {
          setDriverProfile(event.data.driver);
        }
      };

      return () => {
        channel.close();
      };
    }
  }, []);

  // Listen to storage events for cross-tab synchronization fallback
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'drishti_orders' && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
      if (e.key === 'drishti_driver_profile' && e.newValue) {
        try {
          setDriverProfile(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Sync orders to localStorage & broadcast channel
  const persistOrders = (newOrders) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('drishti_orders', JSON.stringify(newOrders));
      broadcastChannelRef.current?.postMessage({
        type: 'UPDATE_ORDERS',
        orders: newOrders
      });
    } catch {
      // ignore
    }
  };

  const persistDriver = (newDriver) => {
    setDriverProfile(newDriver);
    try {
      localStorage.setItem('drishti_driver_profile', JSON.stringify(newDriver));
      broadcastChannelRef.current?.postMessage({
        type: 'UPDATE_DRIVER',
        driver: newDriver
      });
    } catch {
      // ignore
    }
  };

  // Toggle Driver Online / Offline
  const toggleDriverStatus = () => {
    const nextStatus = driverProfile.status === 'Available' ? 'Offline' : 'Available';
    persistDriver({ ...driverProfile, status: nextStatus });
  };

  // Update order status with optional backend sync
  const updateOrderStatus = async (orderId, newStatus) => {
    const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    
    setOrders((prev) => {
      const order = prev[orderId];
      if (!order) return prev;

      const updated = {
        ...prev,
        [orderId]: {
          ...order,
          status: newStatus,
          lastUpdated: timeNow
        }
      };
      persistOrders(updated);
      return updated;
    });

    // Try posting to Flask backend if running
    try {
      await fetch('/api/order/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: newStatus })
      });
    } catch {
      // Silently continue (pure frontend mode)
    }
  };

  // Update driver GPS location
  const updateDriverLocation = async (orderId, lat, lng) => {
    const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    setOrders((prev) => {
      const order = prev[orderId];
      if (!order) return prev;

      const updated = {
        ...prev,
        [orderId]: {
          ...order,
          currentLat: lat,
          currentLng: lng,
          lastUpdated: timeNow
        }
      };
      persistOrders(updated);
      return updated;
    });

    // Try posting to Flask backend if running
    try {
      await fetch('/api/driver/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          driver_id: 1,
          latitude: lat,
          longitude: lng
        })
      });
    } catch {
      // Silently continue
    }
  };

  // Reset Demo Order for Viva demonstration
  const resetDemoOrder = (orderId = 'DR001') => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
    setIsSimulating(false);

    setOrders((prev) => {
      const initial = INITIAL_ORDERS[orderId] || INITIAL_ORDERS['DR001'];
      const updated = {
        ...prev,
        [orderId]: {
          ...initial,
          status: 'Driver Assigned',
          currentLat: initial.pickupLat,
          currentLng: initial.pickupLng,
          lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
        }
      };
      persistOrders(updated);
      return updated;
    });

    // Try reset on backend
    try {
      fetch('/reset_demo', { method: 'POST' });
    } catch {
      // ignore
    }
  };

  // Add new tracking order (e.g. from marketplace checkout)
  const addTrackingOrder = (newOrder) => {
    setOrders((prev) => {
      const updated = {
        ...prev,
        [newOrder.id]: newOrder
      };
      persistOrders(updated);
      return updated;
    });
  };

  // Route simulation runner
  const toggleSimulation = (orderId = 'DR001') => {
    const order = orders[orderId];
    if (!order) return;

    if (isSimulating) {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
      setIsSimulating(false);
      return;
    }

    setIsSimulating(true);

    const pLat = order.pickupLat;
    const pLng = order.pickupLng;
    const cLat = order.customerLat;
    const cLng = order.customerLng;
    const totalSteps = 24;
    let step = 0;

    // Automatically set status to Out for Delivery if not already
    if (order.status !== 'Out for Delivery' && order.status !== 'Delivered') {
      updateOrderStatus(orderId, 'Out for Delivery');
    }

    simulationRef.current = setInterval(() => {
      step += 1;
      const progress = step / totalSteps;

      // Realistic path interpolation with slight curve offset
      const curve = Math.sin(progress * Math.PI) * 0.006;
      const curLat = pLat + (cLat - pLat) * progress + curve;
      const curLng = pLng + (cLng - pLng) * progress - curve * 0.5;

      updateDriverLocation(orderId, curLat, curLng);

      if (step >= totalSteps) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
        setIsSimulating(false);
        updateOrderStatus(orderId, 'Delivered');
      }
    }, 800);
  };

  const stepForwardOnce = (orderId = 'DR001') => {
    const order = orders[orderId];
    if (!order) return;

    const pLat = order.pickupLat;
    const pLng = order.pickupLng;
    const cLat = order.customerLat;
    const cLng = order.customerLng;

    // Calculate current progress based on distance
    const totalDist = Math.hypot(cLat - pLat, cLng - pLng);
    const curDist = Math.hypot(order.currentLat - pLat, order.currentLng - pLng);
    let progress = Math.min(1, Math.max(0, curDist / totalDist)) + 0.1;

    if (progress > 1) progress = 0;

    const curve = Math.sin(progress * Math.PI) * 0.006;
    const nextLat = pLat + (cLat - pLat) * progress + curve;
    const nextLng = pLng + (cLng - pLng) * progress - curve * 0.5;

    updateDriverLocation(orderId, nextLat, nextLng);

    if (progress >= 0.95) {
      updateOrderStatus(orderId, 'Delivered');
    } else if (order.status !== 'Out for Delivery') {
      updateOrderStatus(orderId, 'Out for Delivery');
    }
  };

  return (
    <TrackingContext.Provider
      value={{
        orders,
        driverProfile,
        isSimulating,
        toggleDriverStatus,
        updateOrderStatus,
        updateDriverLocation,
        resetDemoOrder,
        addTrackingOrder,
        toggleSimulation,
        stepForwardOnce
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
