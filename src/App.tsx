import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import { useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Footer } from './components/Footer';

/**
 * The root Application component.
 * Sets up routing for all frontend views including the customer marketplace,
 * authentication, user profile, checkout flow, driver portal, and logistics dashboard.
 */
function App() {
  const { addToCart } = useCart();

  const handleAddToCart = (item: any, qty: number = 1) => {
    addToCart(item, qty);
  };

  return (
    <AuthProvider>
      <TrackingProvider>
        <BrowserRouter>
          <Header />
          <AuthModal />
          <Routes>
            {/* Marketplace & E-commerce */}
            <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
            <Route path="/products" element={<Products onAddToCart={handleAddToCart} />} />
            <Route path="/produce-market" element={<Products onAddToCart={handleAddToCart} />} />
            <Route path="/search" element={<SearchResults onAddToCart={handleAddToCart} />} />
            <Route path="/vendors" element={<Vendors onAddToCart={handleAddToCart} />} />
            
            {/* Cart, Checkout & Confirmation */}
            <Route path="/cart" element={<CartRouteWrapper />} />
            <Route path="/checkout" element={<CheckoutRouteWrapper />} />
            <Route path="/order-confirmation" element={<OrderConfirmationRouteWrapper />} />

            {/* Authentication & User Account */}
            <Route path="/login" element={<Login />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

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
          <FooterWrapper />
        </BrowserRouter>
      </TrackingProvider>
    </AuthProvider>
  );
}

function FooterWrapper() {
  const navigate = useNavigate();
  return (
    <Footer 
      onNavigate={(view) => {
        if (view === 'marketplace') navigate('/');
        else if (view === 'details') navigate('/products');
        else if (view === 'cart') navigate('/cart');
        else if (view === 'checkout') navigate('/checkout');
        else if (view === 'confirmation') navigate('/order-confirmation');
        else if (view === 'logistics') navigate('/logistics');
        else navigate('/' + view);
      }} 
    />
  );
}

function CartRouteWrapper() {
  const navigate = useNavigate();
  return (
    <Cart 
      onNavigate={(view, id) => {
        if (view === 'marketplace') navigate('/');
        else if (view === 'checkout') navigate('/checkout');
        else if (view === 'details') navigate('/products');
        else navigate('/' + view);
      }} 
    />
  );
}

function CheckoutRouteWrapper() {
  const navigate = useNavigate();
  return (
    <Checkout 
      onNavigate={(view) => {
        if (view === 'cart') navigate('/cart');
        else if (view === 'confirmation') navigate('/order-confirmation');
        else navigate('/');
      }}
      onOrderSuccess={() => navigate('/order-confirmation')} 
    />
  );
}

function OrderConfirmationRouteWrapper() {
  const navigate = useNavigate();
  return (
    <OrderConfirmation 
      onNavigate={(view) => {
        if (view === 'marketplace') navigate('/');
        else if (view === 'logistics') navigate('/logistics');
        else if (view === 'cart') navigate('/cart');
        else navigate('/' + view);
      }} 
    />
  );
}

export default App;
