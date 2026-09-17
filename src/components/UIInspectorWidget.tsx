import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  Layers, 
  Palette, 
  Activity, 
  UserCheck, 
  Sprout, 
  ShoppingCart, 
  Truck, 
  RotateCcw, 
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  ThermometerSnowflake,
  Package,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTracking } from '../context/TrackingContext';
import { saveCustomProduct, getCustomProducts } from '../data/products';
import './UIInspectorWidget.css';

export const UIInspectorWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflows' | 'design' | 'diagnostics'>('workflows');
  const [ordersCount, setOrdersCount] = useState(0);
  const [cropsCount, setCropsCount] = useState(0);

  const { user, quickLogin } = useAuth();
  const { addToast, placeOrder, clearCart } = useCart();
  const { autoAssignRegionalOrders, orders: trackingOrders } = useTracking();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync metrics on mount & when state updates
  useEffect(() => {
    const updateMetrics = () => {
      try {
        const storedOrders = localStorage.getItem('kisan_all_orders');
        const ordersList = storedOrders ? JSON.parse(storedOrders) : [];
        setOrdersCount(ordersList.length);

        const storedCrops = getCustomProducts();
        setCropsCount(storedCrops.length);
      } catch (e) {
        console.error(e);
      }
    };

    updateMetrics();
    window.addEventListener('kisan_products_updated', updateMetrics);
    window.addEventListener('storage', updateMetrics);
    return () => {
      window.removeEventListener('kisan_products_updated', updateMetrics);
      window.removeEventListener('storage', updateMetrics);
    };
  }, []);

  // 1. Simulate Farmer Harvest Listing
  const handleSimulateFarmerHarvest = () => {
    const sampleId = `prod-sample-${Date.now()}`;
    const sampleProduct = {
      id: sampleId,
      name: 'Kottayam Organic Butter Avocados',
      price: 120,
      unit: 'kg',
      available: 80,
      farmer: user?.role === 'farmer' ? user.name : 'Farmer Madhavan Nair',
      location: 'Kottayam',
      district: 'Kottayam',
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80',
      description: 'Freshly harvested organic butter avocados directly dispatched from Poonjar groves.',
      category: 'Fruits',
      organic: true,
      harvestDate: 'Harvested Today (Direct Dispatch)',
      rating: 5.0,
      reviewsCount: 3,
      requiresRefrigeration: true
    };

    saveCustomProduct(sampleProduct);
    setCropsCount(getCustomProducts().length);
    addToast('Farmer Harvest Published: "Kottayam Organic Butter Avocados" (₹120/kg, 80kg)!', 'success');
  };

  // 2. Simulate Consumer Order Placement
  const handleSimulateConsumerOrder = () => {
    const customOrderId = `KSN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const mockOrder = {
      orderId: customOrderId,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      status: 'Order Placed',
      totalWeightKg: 10,
      requiresRefrigeration: true,
      destinationDistrict: 'Kottayam',
      assignedDriverId: null,
      primaryFarmer: 'Farmer Madhavan Nair',
      items: [
        {
          quantity: 10,
          product: {
            id: 'sample-avocado',
            name: 'Kottayam Organic Butter Avocados',
            price: 120,
            unit: 'kg',
            image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80',
            category: 'Fruits',
            farmer: 'Farmer Madhavan Nair',
            district: 'Kottayam',
            requiresRefrigeration: true
          }
        }
      ],
      subtotal: 1200,
      deliveryFee: 40,
      discount: 0,
      grandTotal: 1240,
      customer: {
        name: 'Rahul Nair',
        phone: '+91 94471 88990',
        email: 'rahul.nair@kisan.in',
        address: 'Plot 14, Riverbank Road, Near Central Junction',
        city: 'Kottayam',
        pincode: '686001',
        district: 'Kottayam',
        notes: 'Cold chain delivery - please ring bell'
      }
    };

    try {
      const stored = localStorage.getItem('kisan_all_orders');
      const allOrders = stored ? JSON.parse(stored) : [];
      allOrders.unshift(mockOrder);
      localStorage.setItem('kisan_all_orders', JSON.stringify(allOrders));
      setOrdersCount(allOrders.length);
      window.dispatchEvent(new Event('kisan_orders_updated'));
      addToast(`Consumer Order Placed: #${customOrderId} (10 kg, Kottayam Hub, Cold-Chain)!`, 'success');
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Simulate Driver Regional Auto-Dispatch
  const handleSimulateDriverDispatch = () => {
    // Ensure driver vehicle config is set
    const vehicleConfig = {
      serviceArea: 'Kottayam',
      vehicleType: 'Refrigerated Reefer Van',
      maxCapacityKg: 250,
      isRefrigerated: true
    };
    localStorage.setItem('kisan_driver_vehicle_config', JSON.stringify(vehicleConfig));

    if (autoAssignRegionalOrders) {
      const res = autoAssignRegionalOrders();
      addToast(
        `Regional Auto-Dispatch: ${res.assignedCount} Kottayam order(s) clustered (${res.totalWeightKg}kg / ${res.maxCapacityKg}kg capacity)!`,
        'success'
      );
    } else {
      addToast('Driver Regional Dispatch Triggered!', 'success');
    }
  };

  // 4. Reset All Demo State
  const handleResetDemoState = () => {
    localStorage.removeItem('kisan_custom_products');
    localStorage.removeItem('kisan_all_orders');
    localStorage.removeItem('kisan_cart_v1');
    localStorage.removeItem('kisan_last_order_v1');
    clearCart();
    setCropsCount(0);
    setOrdersCount(0);
    addToast('Demo state reset to initial pristine defaults!', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <button 
        id="btn-open-ui-inspector"
        onClick={() => setIsOpen(true)}
        className="ui-inspector-trigger-btn"
        title="Open Kisan Test Studio & UI Inspector"
      >
        <span className="ui-inspector-pulse-dot" />
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span>UI &amp; Test Studio</span>
      </button>

      {/* Interactive Modal Drawer */}
      {isOpen && (
        <div className="ui-inspector-overlay" onClick={() => setIsOpen(false)}>
          <div className="ui-inspector-drawer" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="ui-inspector-header">
              <div className="ui-inspector-header-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="ui-inspector-title">
                    <span>Kisan Test Studio &amp; UI Inspector</span>
                  </div>
                  <div className="ui-inspector-subtitle">
                    Verify UI Uniformity, Persona Flows &amp; Regional Dispatch
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="ui-inspector-close-btn"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="ui-inspector-nav-tabs">
              <button 
                onClick={() => setActiveTab('workflows')}
                className={`ui-inspector-tab-btn ${activeTab === 'workflows' ? 'active' : ''}`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>E2E Workflows</span>
              </button>

              <button 
                onClick={() => setActiveTab('design')}
                className={`ui-inspector-tab-btn ${activeTab === 'design' ? 'active' : ''}`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>UI Uniformity</span>
              </button>

              <button 
                onClick={() => setActiveTab('diagnostics')}
                className={`ui-inspector-tab-btn ${activeTab === 'diagnostics' ? 'active' : ''}`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Diagnostics &amp; Nav</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="ui-inspector-body">
              
              {/* TAB 1: E2E WORKFLOWS */}
              {activeTab === 'workflows' && (
                <>
                  {/* Persona Switcher */}
                  <div className="inspector-card">
                    <div className="inspector-card-header">
                      <span>1. Instant Persona Switcher</span>
                      <span className="text-[10px] font-mono text-slate-500">No passwords required</span>
                    </div>
                    <p className="inspector-card-sub">
                      Switch active user session to test role-specific screens &amp; permissions:
                    </p>

                    <div className="persona-switcher-row">
                      <button 
                        onClick={async () => {
                          await quickLogin('farmer');
                          addToast('Logged in as Farmer Madhavan Nair', 'success');
                          navigate('/profile');
                        }}
                        className={`persona-card-btn ${user?.role === 'farmer' ? 'active-farmer' : ''}`}
                      >
                        <span className="persona-icon"><Sprout size={16} /></span>
                        <span className="persona-label">Farmer</span>
                        <span className="persona-sub">Madhavan Nair</span>
                      </button>

                      <button 
                        onClick={async () => {
                          await quickLogin('customer');
                          addToast('Logged in as Consumer Rahul Nair', 'success');
                          navigate('/profile');
                        }}
                        className={`persona-card-btn ${user?.role === 'customer' ? 'active-consumer' : ''}`}
                      >
                        <span className="persona-icon"><ShoppingCart size={16} /></span>
                        <span className="persona-label">Consumer</span>
                        <span className="persona-sub">Rahul Nair</span>
                      </button>

                      <button 
                        onClick={async () => {
                          await quickLogin('driver');
                          addToast('Logged in as Driver Suresh Pillai', 'success');
                          navigate('/profile');
                        }}
                        className={`persona-card-btn ${user?.role === 'driver' ? 'active-driver' : ''}`}
                      >
                        <span className="persona-icon"><Truck size={16} /></span>
                        <span className="persona-label">Driver</span>
                        <span className="persona-sub">Suresh Pillai</span>
                      </button>
                    </div>
                  </div>

                  {/* 1-Click Workflow Automations */}
                  <div className="inspector-card">
                    <div className="inspector-card-header">
                      <span>2. 1-Click Functionality Testing</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Automated
                      </span>
                    </div>
                    <p className="inspector-card-sub">
                      Trigger end-to-end multi-user actions directly from the UI:
                    </p>

                    <div className="workflow-actions-grid">
                      {/* Step 1: Farmer Publish */}
                      <div className="workflow-action-card">
                        <div className="workflow-info">
                          <h4>1. Publish Farmer Harvest</h4>
                          <p>Lists "Kottayam Organic Avocados" (80kg, Cold-Chain) to Marketplace</p>
                        </div>
                        <button 
                          id="test-btn-publish-harvest"
                          onClick={handleSimulateFarmerHarvest}
                          className="btn-trigger-action btn-trigger-amber"
                        >
                          <Sprout className="w-3.5 h-3.5" />
                          <span>Publish</span>
                        </button>
                      </div>

                      {/* Step 2: Consumer Order */}
                      <div className="workflow-action-card">
                        <div className="workflow-info">
                          <h4>2. Place Consumer Order</h4>
                          <p>Generates real customer order (10kg, Kottayam Hub, Refrigerated)</p>
                        </div>
                        <button 
                          id="test-btn-place-order"
                          onClick={handleSimulateConsumerOrder}
                          className="btn-trigger-action btn-trigger-green"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Create Order</span>
                        </button>
                      </div>

                      {/* Step 3: Driver Dispatch */}
                      <div className="workflow-action-card">
                        <div className="workflow-info">
                          <h4>3. Driver Regional Auto-Dispatch</h4>
                          <p>Clusters Kottayam orders matching 250kg refrigerated vehicle</p>
                        </div>
                        <button 
                          id="test-btn-driver-dispatch"
                          onClick={handleSimulateDriverDispatch}
                          className="btn-trigger-action btn-trigger-blue"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Batch Dispatch</span>
                        </button>
                      </div>

                      {/* Reset */}
                      <div className="workflow-action-card" style={{ background: '#fff1f2', borderColor: '#fecdd3' }}>
                        <div className="workflow-info">
                          <h4 style={{ color: '#e11d48' }}>Reset Demo State</h4>
                          <p>Clears test orders, custom crops, and cart back to clean defaults</p>
                        </div>
                        <button 
                          id="test-btn-reset-demo"
                          onClick={handleResetDemoState}
                          className="btn-trigger-action btn-trigger-gray"
                          style={{ background: '#ffffff', color: '#e11d48', border: '1px solid #fecdd3' }}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset Data</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: UI UNIFORMITY & DESIGN SYSTEM */}
              {activeTab === 'design' && (
                <>
                  {/* Color Tokens */}
                  <div className="inspector-card">
                    <div className="inspector-card-header">
                      <span>1. Core Color System &amp; Contrast</span>
                    </div>
                    <div className="color-swatches-grid">
                      <div className="swatch-box">
                        <div className="swatch-color-circle" style={{ background: '#10b981' }} />
                        <div className="swatch-meta">
                          <h5>Emerald Primary</h5>
                          <span>#10B981 • WCAG AAA</span>
                        </div>
                      </div>

                      <div className="swatch-box">
                        <div className="swatch-color-circle" style={{ background: '#059669' }} />
                        <div className="swatch-meta">
                          <h5>Forest Dark</h5>
                          <span>#059669 • Active CTA</span>
                        </div>
                      </div>

                      <div className="swatch-box">
                        <div className="swatch-color-circle" style={{ background: '#d97706' }} />
                        <div className="swatch-meta">
                          <h5>Farmer Amber</h5>
                          <span>#D97706 • Farm Hub</span>
                        </div>
                      </div>

                      <div className="swatch-box">
                        <div className="swatch-color-circle" style={{ background: '#0284c7' }} />
                        <div className="swatch-meta">
                          <h5>Logistics Sky</h5>
                          <span>#0284C7 • Fleet Dispatch</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Components Uniformity Preview */}
                  <div className="inspector-card">
                    <div className="inspector-card-header">
                      <span>2. Component Uniformity Preview</span>
                    </div>

                    <div className="space-y-4 pt-1">
                      {/* Form inputs */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Input &amp; Select Field</span>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <input 
                            type="text" 
                            defaultValue="Standard Field Input" 
                            className="field-input" 
                            style={{ padding: '8px 12px', fontSize: '0.78rem' }} 
                          />
                          <select 
                            className="field-select" 
                            style={{ padding: '8px 12px', fontSize: '0.78rem' }}
                            defaultValue="Kottayam"
                          >
                            <option value="Kottayam">Kottayam Hub</option>
                            <option value="Wayanad">Wayanad Hub</option>
                          </select>
                        </div>
                      </div>

                      {/* Badges */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Status &amp; Guarantee Badges</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className="badge-pill badge-verified">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>KYC Verified</span>
                          </span>
                          <span className="badge-pill badge-farmer">
                            <Sprout className="w-3 h-3 text-amber-700" />
                            <span>100% Organic</span>
                          </span>
                          <span className="badge-pill badge-driver">
                            <ThermometerSnowflake className="w-3 h-3 text-blue-700" />
                            <span>Cold Chain</span>
                          </span>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Button Hierarchy</span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button className="btn-primary-action" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
                            Primary Action
                          </button>
                          <button className="btn-secondary-action" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                            Secondary
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: DIAGNOSTICS & QUICK NAV */}
              {activeTab === 'diagnostics' && (
                <>
                  {/* Live State Diagnostics */}
                  <div className="inspector-card">
                    <div className="inspector-card-header">
                      <span>1. System Health &amp; State</span>
                      <span className="text-[10px] font-mono text-emerald-700">Live</span>
                    </div>

                    <div className="diagnostic-stats-grid">
                      <div className="diagnostic-stat-card">
                        <label>Current Role</label>
                        <value style={{ textTransform: 'capitalize', color: '#059669' }}>
                          {user?.role || 'Guest'}
                        </value>
                      </div>

                      <div className="diagnostic-stat-card">
                        <label>Active User</label>
                        <value style={{ fontSize: '0.85rem' }}>
                          {user?.name || 'Not Logged In'}
                        </value>
                      </div>

                      <div className="diagnostic-stat-card">
                        <label>Total Orders</label>
                        <value>{ordersCount}</value>
                      </div>

                      <div className="diagnostic-stat-card">
                        <label>Market Crops</label>
                        <value>{cropsCount}</value>
                      </div>
                    </div>
                  </div>

                  {/* Quick Page Jumpers */}
                  <div className="inspector-card">
                    <div className="inspector-card-header">
                      <span>2. Direct Page Navigation</span>
                    </div>
                    <p className="inspector-card-sub">
                      Jump immediately to any part of the Kisan DRISHTI platform:
                    </p>

                    <div className="page-jumper-row">
                      {[
                        { label: 'Home', path: '/' },
                        { label: 'Marketplace', path: '/products' },
                        { label: 'Profile & Farm', path: '/profile' },
                        { label: 'Cart View', path: '/cart' },
                        { label: 'Driver Portal', path: '/driver' },
                        { label: 'Live Tracking', path: '/tracking' },
                        { label: 'DRISHTI Command', path: '/logistics' }
                      ].map((item) => (
                        <button
                          key={item.path}
                          onClick={() => {
                            navigate(item.path);
                            setIsOpen(false);
                          }}
                          className={`page-jumper-btn ${location.pathname === item.path ? 'active' : ''}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
};
