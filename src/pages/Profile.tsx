import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { saveCustomProduct, getCustomProducts, deleteCustomProduct } from '../data/products';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Mail, 
  Truck, 
  Sprout, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Package, 
  ArrowUpRight, 
  Printer, 
  Edit3, 
  Save, 
  ShieldCheck,
  AlertCircle,
  Leaf,
  Plus,
  Trash2,
  X,
  FileText,
  QrCode,
  Compass,
  Star,
  Check
} from 'lucide-react';
import './Profile.css';


interface SavedAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export const Profile: React.FC = () => {
  const { user, logout, updateProfile, quickLogin } = useAuth();
  const { lastOrder, addToCart, addToast } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'details' | 'impact' | 'preferences' | 'farm' | 'vehicle'>(() => {
    return user?.role === 'farmer' ? 'farm' : user?.role === 'driver' ? 'vehicle' : 'orders';
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all');

  // Farmer Farm & Crop state
  const [farmDetails, setFarmDetails] = useState({
    farmName: user?.farmName || `${user?.name || 'Kerala'} Organic Farm`,
    district: user?.city || 'Kottayam',
    taluk: 'Poonjar',
    isOrganic: true,
    bio: 'Cultivating heritage vegetables, spices, and fruits using non-GMO seeds and zero chemical fertilizers.'
  });

  const [publishedCrops, setPublishedCrops] = useState<any[]>(() => getCustomProducts());
  const [newCrop, setNewCrop] = useState({
    name: '',
    category: 'Vegetables',
    price: 60,
    stock: 50,
    district: user?.city || 'Kottayam',
    unit: 'kg',
    requiresRefrigeration: false,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
    description: 'Freshly harvested straight from our organic farm beds.'
  });

  // Driver Fleet & Vehicle state
  const [driverVehicle, setDriverVehicle] = useState(() => {
    try {
      const saved = localStorage.getItem('kisan_driver_vehicle_config');
      return saved ? JSON.parse(saved) : {
        serviceArea: 'Kottayam',
        vehicleType: 'Tata Ace (1 Ton Mini Truck)',
        isRefrigerated: true,
        maxCapacityKg: 250
      };
    } catch {
      return {
        serviceArea: 'Kottayam',
        vehicleType: 'Tata Ace (1 Ton Mini Truck)',
        isRefrigerated: true,
        maxCapacityKg: 250
      };
    }
  });

  // Edit profile form state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || 'Kochi',
    pincode: user?.pincode || '682001',
    deliveryNotes: 'Please ring bell and leave in insulated box'
  });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');

  // Invoice Modal State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);

  // Avatar Picker Modal State
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr_1',
      label: 'Home (Default)',
      recipient: user?.name || 'Anjali Menon',
      phone: user?.phone || '+91 94471 23456',
      address: user?.address || 'Hill View Residence, Erattupetta',
      city: user?.city || 'Kottayam',
      pincode: user?.pincode || '686122',
      isDefault: true
    },
    {
      id: 'addr_2',
      label: 'Office / Studio',
      recipient: user?.name || 'Anjali Menon',
      phone: user?.phone || '+91 94471 23456',
      address: 'Suite 302, Infopark Phase II, Kakkanad',
      city: 'Kochi',
      pincode: '682042',
      isDefault: false
    }
  ]);

  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [newAddressForm, setNewAddressForm] = useState<Omit<SavedAddress, 'id'>>({
    label: 'Apartment',
    recipient: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: 'Kochi',
    pincode: '682001',
    isDefault: false
  });

  // Notification Preferences State
  const [preferences, setPreferences] = useState({
    whatsappUpdates: true,
    smsAlerts: true,
    morningHarvestDrops: true,
    language: 'en'
  });

  const avatarPresets = [
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', label: 'Kerala Consumer' },
    { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', label: 'Culinary Enthusiast' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', label: 'Organic Farmer' },
    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', label: 'Fleet Driver' },
  ];

  // Sync profile form when user updates
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || 'Kochi',
        pincode: user.pincode || '682001',
      }));
    }
  }, [user]);

  // Load orders
  useEffect(() => {
    const fetchUserOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const fetched = await api.getOrders(user?.id);
        const allOrders = [...fetched];
        if (lastOrder && !allOrders.some((o) => o.orderId === lastOrder.orderId)) {
          allOrders.unshift(lastOrder);
        }

        // If no orders found, supply sample realistic past orders for presentation
        if (allOrders.length === 0) {
          allOrders.push({
            orderId: 'KSN-2026-8921',
            createdAt: 'Today, 8:30 AM',
            status: 'Driver Assigned',
            primaryFarmer: 'Green Valley Organic Farm, Kochi',
            grandTotal: 345,
            customer: {
              fullName: user?.name || 'Anjali Menon',
              address: user?.address || 'Hill View Residence, Erattupetta',
              city: user?.city || 'Kottayam',
              paymentMethod: 'UPI (GPay)'
            },
            items: [
              {
                product: {
                  id: 1,
                  name: 'Organic Vine Tomatoes',
                  price: 30,
                  unit: 'kg',
                  farmer: 'Green Valley Farm',
                  image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80'
                },
                quantity: 4
              },
              {
                product: {
                  id: 7,
                  name: 'Kerala Nendran Banana',
                  price: 55,
                  unit: 'kg',
                  farmer: 'Anand Agro Orchards',
                  image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=300&q=80'
                },
                quantity: 3
              },
              {
                product: {
                  id: 5,
                  name: 'Periyar Green Spinach (Palak)',
                  price: 25,
                  unit: 'kg',
                  farmer: 'Riverbank Organic Gardens',
                  image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80'
                },
                quantity: 2
              }
            ]
          });
        }

        setOrders(allOrders);
      } catch {
        if (lastOrder) setOrders([lastOrder]);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, [user?.id, lastOrder]);

  // Ensure active tab corresponds strictly to the user's role
  useEffect(() => {
    if (user?.role === 'driver') {
      if (activeTab !== 'vehicle' && activeTab !== 'details') {
        setActiveTab('vehicle');
      }
    } else if (user?.role === 'farmer') {
      if (activeTab !== 'farm' && activeTab !== 'details' && activeTab !== 'impact') {
        setActiveTab('farm');
      }
    } else {
      if (activeTab === 'farm' || activeTab === 'vehicle') {
        setActiveTab('orders');
      }
    }
  }, [user?.role]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);

    try {
      await updateProfile(formData);
      setSaveSuccess(true);
      setIsEditing(false);
      addToast('Profile details updated successfully', 'success');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save changes');
    }
  };

  const handleReorder = (ord: any) => {
    if (!ord.items || ord.items.length === 0) return;
    ord.items.forEach((item: any) => {
      addToCart(item.product, item.quantity || 1);
    });
    addToast(`Added ${ord.items.length} items from #${ord.orderId} to your cart!`, 'success');
    navigate('/cart');
  };

  const handleSelectAvatar = async (url: string) => {
    try {
      await updateProfile({ avatar: url });
      setShowAvatarPicker(false);
      addToast('Avatar updated', 'success');
    } catch {
      addToast('Failed to update avatar', 'warning');
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.address.trim() || !newAddressForm.recipient.trim()) {
      addToast('Please complete all address fields', 'warning');
      return;
    }

    const created: SavedAddress = {
      ...newAddressForm,
      id: `addr_${Date.now()}`
    };

    if (created.isDefault) {
      setSavedAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(created));
    } else {
      setSavedAddresses(prev => [...prev, created]);
    }

    setShowAddressModal(false);
    setNewAddressForm({
      label: 'Home',
      recipient: user?.name || '',
      phone: user?.phone || '',
      address: '',
      city: 'Kochi',
      pincode: '682001',
      isDefault: false
    });
    addToast('New delivery address saved', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
    addToast('Address removed', 'info');
  };

  const handleSetDefaultAddress = (id: string) => {
    setSavedAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    addToast('Default address updated', 'success');
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'farmer':
        return { label: 'Organic Farmer Producer', color: 'bg-amber-100 text-amber-900 border-amber-300', icon: Sprout };
      case 'driver':
        return { label: 'DRISHTI Fleet Delivery Partner', color: 'bg-blue-100 text-blue-900 border-blue-300', icon: Truck };
      default:
        return { label: 'Direct Harvest Consumer', color: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: ShoppingBag };
    }
  };

  const roleInfo = getRoleBadge();
  const RoleIcon = roleInfo.icon;

  // Compute User Statistics
  const totalSpent = orders.reduce((sum, o) => sum + (o.grandTotal || o.subtotal || 0), 0);
  const totalKg = orders.reduce((sum, o) => {
    if (!o.items) return sum;
    return sum + o.items.reduce((s: number, i: any) => s + (i.quantity || 1), 0);
  }, 0);

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = 
      ord.orderId?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.primaryFarmer?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.items?.some((i: any) => i.product?.name?.toLowerCase().includes(orderSearch.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (orderFilter === 'active') {
      return ord.status !== 'Delivered';
    } else if (orderFilter === 'delivered') {
      return ord.status === 'Delivered';
    }
    return true;
  });

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        
        {/* Profile Hero Header Card */}
        <div className="profile-hero-card">
          <div className="profile-hero-top">
            
            {/* Avatar & User Details */}
            <div className="profile-user-info">
              <div className="profile-avatar-box">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={user?.name || "User"}
                  className="profile-avatar-img"
                />
                <button
                  onClick={() => setShowAvatarPicker(true)}
                  className="absolute inset-0 bg-black/40 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                  title="Change Avatar"
                >
                  <Edit3 className="w-4 h-4 mb-0.5" />
                  <span>Change</span>
                </button>
                <div className="profile-avatar-badge">
                  <RoleIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="profile-user-meta">
                <div className="profile-badges-row">
                  <span className={`badge-pill ${user?.role === 'farmer' ? 'badge-farmer' : user?.role === 'driver' ? 'badge-driver' : 'badge-consumer'}`}>
                    <RoleIcon className="w-3.5 h-3.5" />
                    <span>{roleInfo.label}</span>
                  </span>
                  <span className="badge-pill badge-verified">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>KYC Verified Producer</span>
                  </span>
                </div>

                <h1>
                  {user?.name || 'Kisan User'}
                </h1>

                <div className="profile-contacts-row">
                  <span className="contact-item">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user?.email}</span>
                  </span>
                  {user?.phone && (
                    <span className="contact-item">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user?.phone}</span>
                    </span>
                  )}
                  {user?.city && (
                    <span className="contact-item">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user?.city}, Kerala</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Role Switcher */}
            <div className="profile-actions-bar">
              <div className="role-switcher-box">
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', padding: '0 6px', textTransform: 'uppercase' }}>Demo Role:</span>
                <button
                  onClick={() => quickLogin('customer')}
                  className={`role-switch-btn ${user?.role === 'customer' ? 'active-consumer' : ''}`}
                >
                  Consumer
                </button>
                <button
                  onClick={() => quickLogin('farmer')}
                  className={`role-switch-btn ${user?.role === 'farmer' ? 'active-farmer' : ''}`}
                >
                  Farmer
                </button>
                <button
                  onClick={() => quickLogin('driver')}
                  className={`role-switch-btn ${user?.role === 'driver' ? 'active-driver' : ''}`}
                >
                  Driver
                </button>
              </div>

              <button
                onClick={() => { logout(); navigate('/'); }}
                className="btn-signout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>

          {/* Role-Scoped Metrics & Transparency Strip */}
          <div className="profile-stats-grid">
            {user?.role === 'driver' ? (
              <>
                <div className="profile-stat-box stat-box-blue">
                  <span className="stat-title">
                    <Truck className="w-4 h-4" /> Fleet Dispatch Unit
                  </span>
                  <p className="stat-value text-base font-bold truncate">{driverVehicle.vehicleType.split(' ')[0] || 'Tata Ace'}</p>
                  <span className="stat-sub">Max Payload: {driverVehicle.maxCapacityKg} kg</span>
                </div>
                <div className="profile-stat-box stat-box-green">
                  <span className="stat-title">
                    <Package className="w-4 h-4" /> Cold-Chain Spec
                  </span>
                  <p className="stat-value">{driverVehicle.isRefrigerated ? 'Active 4°C' : 'Ambient'}</p>
                  <span className="stat-sub">Auto Temp Logger</span>
                </div>
                <div className="profile-stat-box stat-box-amber">
                  <span className="stat-title">
                    <MapPin className="w-4 h-4" /> Fleet Base Zone
                  </span>
                  <p className="stat-value">{driverVehicle.serviceArea}</p>
                  <span className="stat-sub">Kottayam Hub</span>
                </div>
                <div className="profile-stat-box stat-box-teal">
                  <span className="stat-title">
                    <ShieldCheck className="w-4 h-4" /> Driver Rating
                  </span>
                  <p className="stat-value flex items-center gap-1">
                    <span>4.9</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
                  </p>
                  <span className="stat-sub">Gold Partner Fleet</span>
                </div>
              </>
            ) : user?.role === 'farmer' ? (
              <>
                <div className="profile-stat-box stat-box-amber">
                  <span className="stat-title">
                    <Sprout className="w-4 h-4" /> Listed Crops
                  </span>
                  <p className="stat-value">{publishedCrops.length}</p>
                  <span className="stat-sub">Active Marketplace Stock</span>
                </div>
                <div className="profile-stat-box stat-box-green">
                  <span className="stat-title">
                    <MapPin className="w-4 h-4" /> Farm Location
                  </span>
                  <p className="stat-value">{farmDetails.district}</p>
                  <span className="stat-sub">Taluk: {farmDetails.taluk}</span>
                </div>
                <div className="profile-stat-box stat-box-teal">
                  <span className="stat-title">
                    <Leaf className="w-4 h-4" /> Quality Grade
                  </span>
                  <p className="stat-value">{farmDetails.isOrganic ? '100% Organic' : 'Natural'}</p>
                  <span className="stat-sub">Zero Synthetic Chemicals</span>
                </div>
                <div className="profile-stat-box stat-box-blue">
                  <span className="stat-title">
                    <ShieldCheck className="w-4 h-4" /> Direct Farm Return
                  </span>
                  <p className="stat-value">92.4%</p>
                  <span className="stat-sub">Fair-Price Payout</span>
                </div>
              </>
            ) : (
              <>
                <div className="profile-stat-box stat-box-green">
                  <span className="stat-title">
                    <ShoppingBag className="w-4 h-4" /> Direct Orders
                  </span>
                  <p className="stat-value">{orders.length}</p>
                  <span className="stat-sub">100% Cold-Chain Tracked</span>
                </div>
                <div className="profile-stat-box stat-box-amber">
                  <span className="stat-title">
                    <Sprout className="w-4 h-4" /> Farmer Support Value
                  </span>
                  <p className="stat-value">₹{totalSpent}</p>
                  <span className="stat-sub">Over 92% direct farm payout</span>
                </div>
                <div className="profile-stat-box stat-box-teal">
                  <span className="stat-title">
                    <Package className="w-4 h-4" /> Fresh Produce
                  </span>
                  <p className="stat-value">{totalKg} kg</p>
                  <span className="stat-sub">Harvested &lt;18h prior</span>
                </div>
                <div className="profile-stat-box stat-box-blue">
                  <span className="stat-title">
                    <Leaf className="w-4 h-4" /> Kisan Green Points
                  </span>
                  <p className="stat-value">140 pts</p>
                  <span className="stat-sub">Tier: Gold Eco Patron</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation: Strictly Role-Scoped */}
        <div className="profile-tabs-strip">
          {/* FARMER TABS */}
          {user?.role === 'farmer' && (
            <>
              <button
                id="tab-btn-farm"
                onClick={() => setActiveTab('farm')}
                className={`profile-tab-item ${activeTab === 'farm' ? 'active-tab-farmer' : ''}`}
              >
                <Sprout className="w-4 h-4" />
                <span>Farm &amp; Produce</span>
                <span className="tab-badge">
                  {publishedCrops.length} Crops
                </span>
              </button>
              <button
                id="tab-btn-details"
                onClick={() => setActiveTab('details')}
                className={`profile-tab-item ${activeTab === 'details' ? 'active-tab-farmer' : ''}`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Estate &amp; Farm Details</span>
              </button>
              <button
                id="tab-btn-impact"
                onClick={() => setActiveTab('impact')}
                className={`profile-tab-item ${activeTab === 'impact' ? 'active-tab-farmer' : ''}`}
              >
                <Leaf className="w-4 h-4" />
                <span>Farmer Impact &amp; Payouts</span>
              </button>
            </>
          )}

          {/* DRIVER TABS */}
          {user?.role === 'driver' && (
            <>
              <button
                id="tab-btn-vehicle"
                onClick={() => setActiveTab('vehicle')}
                className={`profile-tab-item ${activeTab === 'vehicle' ? 'active-tab-driver' : ''}`}
              >
                <Truck className="w-4 h-4" />
                <span>Vehicle &amp; Fleet Specs</span>
              </button>
              <button
                id="tab-btn-details"
                onClick={() => setActiveTab('details')}
                className={`profile-tab-item ${activeTab === 'details' ? 'active-tab-driver' : ''}`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Driver Contact Details</span>
              </button>
            </>
          )}

          {/* CONSUMER BUYER TABS */}
          {(!user || (user?.role !== 'farmer' && user?.role !== 'driver')) && (
            <>
              <button
                id="tab-btn-orders"
                onClick={() => setActiveTab('orders')}
                className={`profile-tab-item ${activeTab === 'orders' ? 'active-tab-default' : ''}`}
              >
                <Package className="w-4 h-4" />
                <span>Orders &amp; Deliveries</span>
                <span className="tab-badge">
                  {orders.length}
                </span>
              </button>
              <button
                id="tab-btn-details"
                onClick={() => setActiveTab('details')}
                className={`profile-tab-item ${activeTab === 'details' ? 'active-tab-default' : ''}`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Profile &amp; Addresses</span>
              </button>
              <button
                id="tab-btn-impact"
                onClick={() => setActiveTab('impact')}
                className={`profile-tab-item ${activeTab === 'impact' ? 'active-tab-default' : ''}`}
              >
                <Leaf className="w-4 h-4" />
                <span>Farmer Impact</span>
              </button>
              <button
                id="tab-btn-preferences"
                onClick={() => setActiveTab('preferences')}
                className={`profile-tab-item ${activeTab === 'preferences' ? 'active-tab-default' : ''}`}
              >
                <Compass className="w-4 h-4" />
                <span>Preferences</span>
              </button>
            </>
          )}
        </div>

        {/* Success / Error Alerts */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}
        {saveError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{saveError}</span>
          </div>
        )}

        {/* TAB: FARM & CROP MANAGEMENT (FARMER ROLE) */}
        {activeTab === 'farm' && (
          <div className="space-y-6">
            {/* Farm Profile Header Card */}
            <div className="content-section-card" style={{ borderColor: '#fde68a' }}>
              <div className="card-header-row">
                <div className="card-header-left">
                  <div className="card-header-icon" style={{ background: '#fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div className="card-header-title">
                    <span className="badge-pill badge-farmer" style={{ marginBottom: '4px' }}>
                      Certified Producer Hub
                    </span>
                    <h3>{farmDetails.farmName}</h3>
                    <p>
                      Location: {farmDetails.taluk}, {farmDetails.district} • Kerala Agri Board ID: KAB-2026-FARM-89
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/products')}
                  className="btn-secondary-action"
                >
                  <span>View Public Marketplace</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Farm Configuration Details */}
              <div className="profile-form-grid pt-4">
                <div className="profile-field-group">
                  <label className="field-label">Farm / Estate Name</label>
                  <input
                    id="farm-name-input"
                    type="text"
                    value={farmDetails.farmName}
                    onChange={(e) => setFarmDetails({ ...farmDetails, farmName: e.target.value })}
                    className="field-input"
                  />
                </div>
                <div className="profile-field-group">
                  <label className="field-label">District / Region</label>
                  <select
                    id="farm-district-input"
                    value={farmDetails.district}
                    onChange={(e) => setFarmDetails({ ...farmDetails, district: e.target.value })}
                    className="field-select"
                  >
                    <option value="Kottayam">Kottayam</option>
                    <option value="Wayanad">Wayanad</option>
                    <option value="Palakkad">Palakkad</option>
                    <option value="Idukki">Idukki</option>
                    <option value="Ernakulam">Ernakulam</option>
                    <option value="Thrissur">Thrissur</option>
                  </select>
                </div>
                <div className="profile-field-group">
                  <label className="field-label">Farming Practice</label>
                  <label className="field-checkbox-row">
                    <input
                      id="farm-organic-input"
                      type="checkbox"
                      checked={farmDetails.isOrganic}
                      onChange={(e) => setFarmDetails({ ...farmDetails, isOrganic: e.target.checked })}
                    />
                    <span className="text-xs font-bold text-slate-800">100% Zero-Chemical Organic</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Add New Produce / Crop Form */}
            <div className="content-section-card">
              <div className="card-header-row">
                <div className="card-header-left">
                  <div className="card-header-icon" style={{ background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div className="card-header-title">
                    <span className="badge-pill badge-verified" style={{ marginBottom: '4px' }}>
                      Live Catalog Entry
                    </span>
                    <h3>Publish New Harvest / Produce</h3>
                    <p>
                      Items published here are instantly displayed across the Kisan Marketplace &amp; DRISHTI Dispatch Network.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCrop.name.trim()) {
                    addToast('Please enter a crop/produce name', 'warning');
                    return;
                  }
                  const createdId = `prod-custom-${Date.now()}`;
                  const createdProduct = {
                    id: createdId,
                    name: newCrop.name.trim(),
                    price: Number(newCrop.price) || 50,
                    unit: newCrop.unit || 'kg',
                    available: Number(newCrop.stock) || 50,
                    farmer: farmDetails.farmName || user?.name || 'Local Organic Farmer',
                    location: newCrop.district,
                    district: newCrop.district,
                    image: newCrop.image,
                    description: newCrop.description || `${newCrop.name} freshly harvested from our local farm.`,
                    category: newCrop.category,
                    organic: farmDetails.isOrganic,
                    harvestDate: 'Harvested Today (Direct Dispatch)',
                    rating: 5.0,
                    reviewsCount: 1,
                    requiresRefrigeration: newCrop.requiresRefrigeration
                  };

                  saveCustomProduct(createdProduct);
                  setPublishedCrops(getCustomProducts());
                  addToast(`"${createdProduct.name}" published to Marketplace!`, 'success');
                  setNewCrop({
                    name: '',
                    category: 'Vegetables',
                    price: 60,
                    stock: 50,
                    district: farmDetails.district,
                    unit: 'kg',
                    requiresRefrigeration: false,
                    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
                    description: 'Freshly harvested straight from our organic farm beds.'
                  });
                }}
                className="space-y-4"
              >
                <div className="profile-form-grid">
                  <div className="profile-field-group">
                    <label className="field-label">
                      Produce Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      id="farm-produce-name"
                      type="text"
                      required
                      placeholder="e.g. Kottayam Fresh Organic Avocados"
                      value={newCrop.name}
                      onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                      className="field-input"
                    />
                  </div>

                  <div className="profile-field-group">
                    <label className="field-label">Produce Category</label>
                    <select
                      id="farm-produce-category"
                      value={newCrop.category}
                      onChange={(e) => setNewCrop({ ...newCrop, category: e.target.value })}
                      className="field-select"
                    >
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Spices">Spices</option>
                      <option value="Dairy Products">Dairy Products</option>
                      <option value="Grains">Grains &amp; Pulses</option>
                    </select>
                  </div>

                  <div className="profile-field-group">
                    <label className="field-label">
                      Price (₹ per kg/unit) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      id="farm-produce-price"
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 75"
                      value={newCrop.price}
                      onChange={(e) => setNewCrop({ ...newCrop, price: Number(e.target.value) })}
                      className="field-input"
                    />
                  </div>

                  <div className="profile-field-group">
                    <label className="field-label">
                      Available Harvest Stock (kg) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      id="farm-produce-stock"
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 100"
                      value={newCrop.stock}
                      onChange={(e) => setNewCrop({ ...newCrop, stock: Number(e.target.value) })}
                      className="field-input"
                    />
                  </div>

                  <div className="profile-field-group">
                    <label className="field-label">Harvest Region / District</label>
                    <select
                      id="farm-produce-district"
                      value={newCrop.district}
                      onChange={(e) => setNewCrop({ ...newCrop, district: e.target.value })}
                      className="field-select"
                    >
                      <option value="Kottayam">Kottayam</option>
                      <option value="Wayanad">Wayanad</option>
                      <option value="Palakkad">Palakkad</option>
                      <option value="Idukki">Idukki</option>
                      <option value="Ernakulam">Ernakulam</option>
                    </select>
                  </div>

                  <div className="profile-field-group">
                    <label className="field-label">Transport Cold-Chain</label>
                    <label className="field-checkbox-row">
                      <input
                        id="farm-produce-refrigerated"
                        type="checkbox"
                        checked={newCrop.requiresRefrigeration}
                        onChange={(e) => setNewCrop({ ...newCrop, requiresRefrigeration: e.target.checked })}
                      />
                      <span className="text-xs font-bold text-slate-800">Requires Refrigerated Vehicle</span>
                    </label>
                  </div>
                </div>

                {/* Preset Fast Image Selection */}
                <div className="profile-field-group pt-1">
                  <label className="field-label">Select Image or Photo Preset</label>
                  <div className="presets-chips-row">
                    {[
                      { name: 'Avocado', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80' },
                      { name: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80' },
                      { name: 'Mango', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80' },
                      { name: 'Black Pepper', url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80' },
                      { name: 'Fresh Banana', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80' },
                      { name: 'Farm Veggies', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80' },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.name}
                        onClick={() => setNewCrop({ ...newCrop, image: img.url })}
                        className={`preset-chip-btn ${newCrop.image === img.url ? 'active' : ''}`}
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="profile-field-group">
                  <label className="field-label">Produce Bio / Description</label>
                  <textarea
                    id="farm-produce-description"
                    rows={2}
                    value={newCrop.description}
                    onChange={(e) => setNewCrop({ ...newCrop, description: e.target.value })}
                    className="field-textarea"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    id="farm-produce-submit"
                    type="submit"
                    className="btn-primary-action"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Harvest to Marketplace</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Published Crops List */}
            <div className="content-section-card">
              <div className="card-header-row">
                <div>
                  <h3 className="text-base font-black text-slate-900">Your Active Marketplace Produce</h3>
                  <p className="text-xs text-slate-500">Live products currently discoverable by consumers in Kerala.</p>
                </div>
                <span className="badge-pill badge-verified">
                  {publishedCrops.length} Active Listings
                </span>
              </div>

              {publishedCrops.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Sprout className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-sm text-slate-600">No custom crops published yet</p>
                  <p className="text-xs text-slate-400 mt-1">Use the form above to list your harvest!</p>
                </div>
              ) : (
                <div className="published-crops-grid">
                  {publishedCrops.map((crop) => (
                    <div
                      key={crop.id}
                      className="published-crop-card"
                    >
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="crop-card-img"
                      />
                      <div className="crop-card-info">
                        <div className="crop-card-top">
                          <h4 className="crop-card-title">{crop.name}</h4>
                          <span className="crop-card-price">
                            ₹{crop.price}/{crop.unit}
                          </span>
                        </div>
                        <p className="crop-card-meta">
                          {crop.category} • {crop.district} • Stock: {crop.available} {crop.unit}
                        </p>
                        <div className="crop-card-bottom">
                          <span className="badge-pill badge-verified" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                            ● Live in Market
                          </span>
                          {crop.requiresRefrigeration && (
                            <span className="badge-pill badge-driver" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                              Cold Chain
                            </span>
                          )}
                          <button
                            onClick={() => {
                              deleteCustomProduct(crop.id);
                              setPublishedCrops(getCustomProducts());
                              addToast(`Removed ${crop.name}`, 'info');
                            }}
                            className="btn-secondary-action"
                            style={{ padding: '4px 8px', marginLeft: 'auto' }}
                            title="Remove listing"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: VEHICLE & HUB DISPATCH (DRIVER ROLE) */}
        {activeTab === 'vehicle' && (
          <div className="space-y-6">
            <div className="content-section-card" style={{ borderColor: '#bfdbfe' }}>
              <div className="card-header-row">
                <div className="card-header-left">
                  <div className="card-header-icon" style={{ background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="card-header-title">
                    <span className="badge-pill badge-driver" style={{ marginBottom: '4px' }}>
                      DRISHTI Logistics Fleet Partner
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      Vehicle Specifications &amp; Service Area
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Configure your delivery area and vehicle limits for automatic smart batch order clustering.
                    </p>
                  </div>
                </div>

                <button
                  id="btn-goto-driver-portal"
                  onClick={() => navigate('/driver')}
                  className="btn-primary-action"
                  style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
                >
                  <Truck className="w-4 h-4" />
                  <span>Open Driver Dispatch Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Vehicle Configuration Form */}
              <div className="profile-form-grid">
                <div className="profile-field-group">
                  <label className="field-label">Service Area / Hub</label>
                  <select
                    id="driver-service-area"
                    value={driverVehicle.serviceArea}
                    onChange={(e) => setDriverVehicle({ ...driverVehicle, serviceArea: e.target.value })}
                    className="field-select"
                  >
                    <option value="Kottayam">Kottayam Hub</option>
                    <option value="Kochi">Kochi / Ernakulam Hub</option>
                    <option value="Thrissur">Thrissur Hub</option>
                    <option value="Wayanad">Wayanad Hub</option>
                  </select>
                </div>

                <div className="profile-field-group">
                  <label className="field-label">Vehicle Model &amp; Type</label>
                  <select
                    id="driver-vehicle-type"
                    value={driverVehicle.vehicleType}
                    onChange={(e) => setDriverVehicle({ ...driverVehicle, vehicleType: e.target.value })}
                    className="field-select"
                  >
                    <option value="Tata Ace (1 Ton Mini Truck)">Tata Ace (1 Ton Mini Truck)</option>
                    <option value="Mahindra Bolero Maxi Truck">Mahindra Bolero Maxi Truck</option>
                    <option value="Refrigerated Reefer Van">Refrigerated Reefer Van</option>
                    <option value="Electric Cargo 3-Wheeler">Electric Cargo 3-Wheeler</option>
                  </select>
                </div>

                <div className="profile-field-group">
                  <label className="field-label">Max Cargo Capacity (kg)</label>
                  <input
                    id="driver-max-capacity"
                    type="number"
                    min="50"
                    step="10"
                    value={driverVehicle.maxCapacityKg}
                    onChange={(e) => setDriverVehicle({ ...driverVehicle, maxCapacityKg: Number(e.target.value) })}
                    className="field-input"
                  />
                </div>

                <div className="profile-field-group">
                  <label className="field-label">Cold-Chain Unit</label>
                  <label className="field-checkbox-row">
                    <input
                      id="driver-refrigerated"
                      type="checkbox"
                      checked={driverVehicle.isRefrigerated}
                      onChange={(e) => setDriverVehicle({ ...driverVehicle, isRefrigerated: e.target.checked })}
                    />
                    <span className="text-xs font-bold text-slate-800">Refrigerated Cold Box Equipped</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  id="driver-save-vehicle"
                  onClick={() => {
                    localStorage.setItem('kisan_driver_vehicle_config', JSON.stringify(driverVehicle));
                    // Update drishti_driver_profile as well
                    try {
                      const dProfRaw = localStorage.getItem('drishti_driver_profile');
                      const dProf = dProfRaw ? JSON.parse(dProfRaw) : {};
                      const merged = { ...dProf, ...driverVehicle };
                      localStorage.setItem('drishti_driver_profile', JSON.stringify(merged));
                      window.dispatchEvent(new Event('kisan_driver_profile_updated'));
                    } catch (e) {
                      console.error(e);
                    }
                    addToast('Driver Vehicle & Service Area saved successfully!', 'success');
                  }}
                  className="btn-primary-action"
                  style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
                >
                  Save Fleet Vehicle Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ORDERS & LIVE DELIVERIES */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    orderFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  onClick={() => setOrderFilter('active')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    orderFilter === 'active' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Active / In Transit
                </button>
                <button
                  onClick={() => setOrderFilter('delivered')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    orderFilter === 'delivered' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Delivered
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search order ID or produce..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full sm:w-64 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {isLoadingOrders ? (
              <div className="text-center py-16 text-slate-500 text-xs">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <span>Loading your orders & live routes...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
                <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No matching orders found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  {orderSearch ? 'Try a different search query or filter.' : 'Explore fresh harvest directly from Kerala farmers and place your first order!'}
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  Explore Fresh Produce
                </button>
              </div>
            ) : (
              filteredOrders.map((ord: any) => {
                const isDelivered = ord.status === 'Delivered';
                return (
                  <div 
                    key={ord.orderId}
                    className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5 hover:border-emerald-300 hover:shadow-md transition-all"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono font-black text-slate-900 text-sm">
                            {ord.orderId}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            isDelivered
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {ord.status || 'Order Placed'}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Direct Farmer Trade
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Placed: {ord.createdAt}</span>
                          <span>•</span>
                          <span>Source Hub: <strong>{ord.primaryFarmer || 'Kerala Farm Collective'}</strong></span>
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="View Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Receipt</span>
                        </button>

                        <button
                          onClick={() => navigate(`/tracking/${ord.orderId}`)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Live DRISHTI Tracking</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-600">
                        <div className="space-y-1">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center text-[10px]">
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span>Harvested</span>
                        </div>
                        <div className="space-y-1">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center text-[10px]">
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span>Quality Lab Checked</span>
                        </div>
                        <div className="space-y-1">
                          <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-[10px] ${
                            isDelivered ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white animate-pulse'
                          }`}>
                            {isDelivered ? <Check size={12} strokeWidth={3} /> : '3'}
                          </div>
                          <span className={isDelivered ? '' : 'text-blue-700 font-bold'}>In Cold-Chain Transit</span>
                        </div>
                        <div className="space-y-1">
                          <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-[10px] ${
                            isDelivered ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {isDelivered ? <Check size={12} strokeWidth={3} /> : '4'}
                          </div>
                          <span>Delivered</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {ord.items?.map((item: any, idx: number) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                        >
                          <img
                            src={item.product?.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80"}
                            alt={item.product?.name || "Produce"}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 truncate">{item.product?.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {item.quantity} {item.product?.unit || 'kg'} × ₹{item.product?.price}
                            </p>
                            <p className="text-[10px] text-emerald-700 font-medium truncate flex items-center gap-1">
                              <Sprout className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{item.product?.farmer || ord.primaryFarmer}</span>
                            </p>
                          </div>
                          <span className="font-mono font-bold text-slate-900">
                            ₹{(item.quantity || 1) * (item.product?.price || 0)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Price */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="text-slate-500 flex items-center gap-2 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Deliver to: {ord.customer?.address || user?.address || 'Kochi, Kerala'}</span>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <button
                          onClick={() => handleReorder(ord)}
                          className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer text-xs"
                        >
                          + Re-Order Fresh
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Total:</span>
                          <span className="text-lg font-black text-emerald-700 font-mono">
                            ₹{ord.grandTotal || ord.subtotal || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & ACCOUNT DETAILS */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            
            {/* Contact Form */}
            <div className="content-section-card">
              <div className="card-header-row">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {user?.role === 'driver' 
                      ? 'Fleet Driver Contact & Dispatch Info' 
                      : user?.role === 'farmer' 
                      ? 'Farmer Producer Contact & Estate Credentials' 
                      : 'Personal Contact Information'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {user?.role === 'driver'
                      ? 'Registered driver credentials used by regional logistics dispatchers for live route assignments'
                      : user?.role === 'farmer'
                      ? 'Registered farmer credentials used for direct-from-farm marketplace sales & APMC compliance'
                      : 'Contact details used for harvest dispatch updates and SMS notifications'}
                  </p>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary-action"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary-action"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="profile-form-grid">
                  <div className="profile-field-group">
                    <label className="field-label">Full Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="field-input"
                    />
                  </div>

                  <div className="profile-field-group">
                    <label className="field-label">Phone Number (For Dispatch &amp; SMS)</label>
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="field-input"
                    />
                  </div>

                  <div className="profile-field-group sm:col-span-2">
                    <label className="field-label">Email Address (For Invoices &amp; Notifications)</label>
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="field-input"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="btn-primary-action"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Saved Delivery Addresses: ONLY visible to consumer buyers */}
            {(!user || user?.role === 'customer') && (
              <div className="content-section-card space-y-6">
                <div className="card-header-row">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Saved Delivery Addresses</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Quickly select where your farm orders should be dispatched
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="btn-primary-action"
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div 
                      key={addr.id}
                      className={`p-5 rounded-2xl border-2 transition-all relative ${
                        addr.isDefault 
                          ? 'border-emerald-500 bg-emerald-50/40' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                            Default Address
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-bold text-slate-800">{addr.recipient}</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{addr.address}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{addr.city} - {addr.pincode}</p>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">Phone: {addr.phone}</p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        {!addr.isDefault ? (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-emerald-700 font-bold hover:underline cursor-pointer text-[11px]"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Selected for checkout</span>
                        )}

                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded transition-colors cursor-pointer"
                          title="Delete Address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Driver Hub Information Card */}
            {user?.role === 'driver' && (
              <div className="content-section-card space-y-4" style={{ borderColor: '#bfdbfe' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Regional Fleet Base</h3>
                    <p className="text-xs text-slate-500">Central Hub Kottayam, Erattupetta Sector 4</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 text-xs text-blue-900 leading-relaxed">
                  As a certified DRISHTI Fleet Driver, you receive real-time batched delivery assignments directly on your <button onClick={() => navigate('/driver')} className="font-bold underline text-blue-700 cursor-pointer">Delivery Operations Portal</button>.
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: FARMER IMPACT & ORIGINS */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
            <div className="content-section-card space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Your Kerala Farmer Impact Report</h3>
                <p className="text-xs text-slate-500 font-medium">
                  By buying directly through Kisan, you eliminate middlemen and help empower sustainable agriculture.
                </p>
              </div>

              {/* Impact Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Direct Farm Revenue</h4>
                  <p className="text-2xl font-black font-mono text-emerald-800">
                    ₹{Math.round(totalSpent * 0.92)}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Credited directly to farmer bank accounts. Zero commission fees taken.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Cold Chain Carbon Savings</h4>
                  <p className="text-2xl font-black font-mono text-blue-800">
                    ~14.2 kg CO₂
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Saved by avoiding multi-tier wholesale mandi transport routes via DRISHTI AI.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Zero Plastic Packaging</h4>
                  <p className="text-2xl font-black font-mono text-amber-800">
                    100% Eco-Wrap
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Packed using natural banana leaves and reusable breathable jute bags.
                  </p>
                </div>
              </div>

              {/* Supported Farms List */}
              <div className="space-y-3 pt-4">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Farms You've Directly Supported
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Green Valley Organic Farms</p>
                      <p className="text-[11px] text-slate-500">Poonjar, Kottayam • Organic certified</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      4 Orders
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Sunrise Agro Collectives</p>
                      <p className="text-[11px] text-slate-500">Thrissur • Sustainable root tubers</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      2 Orders
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Highland Polyhouse Farms</p>
                      <p className="text-[11px] text-slate-500">Wayanad • Chemical-free bell peppers</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      1 Order
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Riverbank Organic Gardens</p>
                      <p className="text-[11px] text-slate-500">Aluva • Dawn-harvested leafy greens</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      3 Orders
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PREFERENCES & NOTIFICATIONS */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="content-section-card space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Communication & App Settings</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Manage how Kisan contacts you regarding harvest departures and live tracking
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-sm font-bold text-slate-900">WhatsApp Live Delivery Tracking</p>
                    <p className="text-xs text-slate-500">Receive live driver GPS arrival updates via WhatsApp</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.whatsappUpdates}
                    onChange={(e) => setPreferences({ ...preferences, whatsappUpdates: e.target.checked })}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-sm font-bold text-slate-900">SMS Order Status Alerts</p>
                    <p className="text-xs text-slate-500">Receive dispatch confirmation and OTP verification via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.smsAlerts}
                    onChange={(e) => setPreferences({ ...preferences, smsAlerts: e.target.checked })}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Morning Dawn Harvest Alerts (6:00 AM)</p>
                    <p className="text-xs text-slate-500">Get notified when fresh Wayanad capsicum or Idukki spices are harvested</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.morningHarvestDrops}
                    onChange={(e) => setPreferences({ ...preferences, morningHarvestDrops: e.target.checked })}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Preferred Platform Language</p>
                    <p className="text-xs text-slate-500">Display names in English or Malayalam</p>
                  </div>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="en">English (default)</option>
                    <option value="ml">മലയാളം (Malayalam)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => addToast('Preferences saved successfully', 'success')}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* TAX INVOICE & RECEIPT MODAL */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                  K
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">KISAN Tax Invoice</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Ref: {selectedInvoiceOrder.orderId}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                Paid Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Billed To</span>
                <strong className="text-slate-900 block">{selectedInvoiceOrder.customer?.fullName || user?.name}</strong>
                <span>{selectedInvoiceOrder.customer?.address || user?.address}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Dispatch Hub</span>
                <strong className="text-slate-900 block">{selectedInvoiceOrder.primaryFarmer || 'Kochi Central Hub'}</strong>
                <span className="text-[10px] text-slate-400">Date: {selectedInvoiceOrder.createdAt}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-700 flex justify-between border-b border-slate-200">
                <span>Produce Item</span>
                <span>Subtotal</span>
              </div>
              <div className="divide-y divide-slate-100 p-2">
                {selectedInvoiceOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="px-2 py-2 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{item.product?.name}</p>
                      <p className="text-[10px] text-slate-500">{item.quantity} {item.product?.unit || 'kg'} × ₹{item.product?.price}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{(item.quantity || 1) * (item.product?.price || 0)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm">
                <span>Total Amount Paid</span>
                <span className="text-emerald-700 font-mono font-black text-base">
                  ₹{selectedInvoiceOrder.grandTotal || selectedInvoiceOrder.subtotal || 0}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-slate-800" />
                <span className="text-[10px]">Scannable FSSAI digital tax receipt</span>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 relative animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Add New Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Address Label</label>
                <select
                  value={newAddressForm.label}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, label: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Home">Home</option>
                  <option value="Office / Work">Office / Work</option>
                  <option value="Farm Pick-up">Farm Pick-up</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Recipient Name</label>
                <input
                  type="text"
                  placeholder="e.g. Anjali Menon"
                  value={newAddressForm.recipient}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, recipient: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 94471 23456"
                  value={newAddressForm.phone}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Street Address / House</label>
                <textarea
                  rows={2}
                  placeholder="House name, Street, Landmark"
                  value={newAddressForm.address}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / District</label>
                  <input
                    type="text"
                    value={newAddressForm.city}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={newAddressForm.pincode}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAddressForm.isDefault}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, isDefault: e.target.checked })}
                  className="accent-emerald-600 rounded"
                />
                <span className="text-slate-600 font-medium">Make this my primary delivery address</span>
              </label>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AVATAR PICKER MODAL */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-sm w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 relative animate-fade-in text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-sm">Choose Profile Avatar</h3>
              <button onClick={() => setShowAvatarPicker(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2">
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAvatar(preset.url)}
                  className="p-2 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer flex flex-col items-center gap-1.5"
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-500"
                  />
                  <span className="text-[11px] font-bold text-slate-700">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
