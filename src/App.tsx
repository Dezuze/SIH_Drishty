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
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Footer } from './components/Footer';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import NotFound from './pages/NotFound';
import ThankYou from './pages/ThankYou';
import CookieBanner from './components/CookieBanner';

// Route Guard: Blocks drivers from accessing consumer & farmer marketplace views
function DriverBlockGuard({ children }: { children: React.ReactElement }) {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated && user?.role === 'driver') {
    return <Navigate to="/driver" replace />;
  }
  return children;
}

// Route Guard: Only consumer buyers can access cart and checkout flow
function CustomerOnlyGuard({ children }: { children: React.ReactElement }) {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated && user?.role === 'driver') {
    return <Navigate to="/driver" replace />;
  }
  if (isAuthenticated && user?.role === 'farmer') {
    return <Navigate to="/profile" replace />;
  }
  return children;
}

// Route Guard: Admin-only command center
function AdminOnlyGuard({ children }: { children: React.ReactElement }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'driver') return <Navigate to="/driver" replace />;
  if (user?.role === 'farmer') return <Navigate to="/profile" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

// Fallback redirect honoring current role
function FallbackRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated && user?.role === 'driver') {
    return <Navigate to="/driver" replace />;
  }
  return <Navigate to="/" replace />;
}

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
            {/* Marketplace & E-commerce (Hidden from Drivers) */}
            <Route path="/" element={<DriverBlockGuard><Home onAddToCart={handleAddToCart} /></DriverBlockGuard>} />
            <Route path="/products" element={<DriverBlockGuard><Products onAddToCart={handleAddToCart} /></DriverBlockGuard>} />
            <Route path="/produce-market" element={<DriverBlockGuard><Products onAddToCart={handleAddToCart} /></DriverBlockGuard>} />
            <Route path="/search" element={<DriverBlockGuard><SearchResults onAddToCart={handleAddToCart} /></DriverBlockGuard>} />
            <Route path="/vendors" element={<DriverBlockGuard><Vendors onAddToCart={handleAddToCart} /></DriverBlockGuard>} />
            
            {/* Cart, Checkout & Confirmation (Consumer Only) */}
            <Route path="/cart" element={<CustomerOnlyGuard><CartRouteWrapper /></CustomerOnlyGuard>} />
            <Route path="/checkout" element={<CustomerOnlyGuard><CheckoutRouteWrapper /></CustomerOnlyGuard>} />
            <Route path="/order-confirmation" element={<CustomerOnlyGuard><OrderConfirmationRouteWrapper /></CustomerOnlyGuard>} />

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

            {/* DRISHTI Live Delivery Tracking (Consumer Only; Drivers redirected to /driver) */}
            <Route path="/tracking" element={<DriverBlockGuard><DeliveryTracking /></DriverBlockGuard>} />
            <Route path="/tracking/:orderId" element={<DriverBlockGuard><DeliveryTracking /></DriverBlockGuard>} />
            <Route path="/customer" element={<DriverBlockGuard><Navigate to="/tracking" replace /></DriverBlockGuard>} />
            <Route path="/customer/:orderId" element={<DriverBlockGuard><DeliveryTracking /></DriverBlockGuard>} />

            {/* Fleet Driver Module (Driver & Admin ONLY) */}
            <Route 
              path="/driver" 
              element={
                <ProtectedRoute allowedRoles={['driver', 'admin']}>
                  <DriverPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/driver/order/:orderId" 
              element={
                <ProtectedRoute allowedRoles={['driver', 'admin']}>
                  <DriverPortal />
                </ProtectedRoute>
              } 
            />

            {/* AI Logistics & Route Optimization Command Center (Admin Only) */}
            <Route path="/logistics" element={<AdminOnlyGuard><Dashboard /></AdminOnlyGuard>} />
            <Route path="/simplified" element={<AdminOnlyGuard><SimplifiedUI /></AdminOnlyGuard>} />

            {/* Legal, Information & Compliance Pages (Accessible to all) */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/404" element={<NotFound />} />

            {/* Fallback 404 for unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieBanner />
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
