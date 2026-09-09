import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Vendors from './pages/Vendors';
import Products from './pages/Products';
import DeliveryTracking from './pages/DeliveryTracking';
import DriverPortal from './pages/DriverPortal';
import { Dashboard } from './pages/Dashboard';
import SimplifiedUI from './pages/SimplifiedUI';
import { TrackingProvider } from './context/TrackingContext';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (_item, qty = 1) => {
    setCartCount(prev => prev + (typeof qty === 'number' && qty > 0 ? qty : 1));
  };

  return (
    <TrackingProvider>
      <BrowserRouter>
        <Header cartCount={cartCount} />
        <Routes>
          {/* Marketplace & E-commerce */}
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/products" element={<Products onAddToCart={handleAddToCart} />} />
          <Route path="/produce-market" element={<Products onAddToCart={handleAddToCart} />} />
          <Route path="/search" element={<SearchResults onAddToCart={handleAddToCart} />} />
          <Route path="/vendors" element={<Vendors onAddToCart={handleAddToCart} />} />

          {/* DRISHTI Live Delivery Tracking & Driver Module */}
          <Route path="/tracking" element={<DeliveryTracking />} />
          <Route path="/tracking/:orderId" element={<DeliveryTracking />} />
          <Route path="/customer" element={<Navigate to="/tracking" replace />} />
          <Route path="/customer/:orderId" element={<DeliveryTracking />} />
          <Route path="/driver" element={<DriverPortal />} />
          <Route path="/driver/order/:orderId" element={<DriverPortal />} />

          {/* AI Logistics & Route Optimization Command Center */}
          <Route path="/logistics" element={<Dashboard />} />
          <Route path="/simplified" element={<SimplifiedUI />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TrackingProvider>
  );
}

export default App;
