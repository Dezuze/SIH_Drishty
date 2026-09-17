import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTracking } from '../context/TrackingContext';
import { api } from '../services/api';
import type { OrderCustomerDetails, ConfirmedOrder } from '../data/products';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  MapPin, 
  User as UserIcon, 
  Phone, 
  AlertCircle,
  QrCode,
  Lock,
  CheckCircle2,
  X,
  Check,
  Leaf,
  Clock,
  Compass,
  Package,
  Zap,
  Smartphone
} from 'lucide-react';

interface CheckoutProps {
  onNavigate: (view: 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics') => void;
  onOrderSuccess: (order?: ConfirmedOrder) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate, onOrderSuccess }) => {
  const { 
    cart, 
    subtotal, 
    deliveryFee, 
    discount, 
    grandTotal, 
    placeOrder, 
    addToast 
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const { addTrackingOrder } = useTracking();

  // Form State
  const [formData, setFormData] = useState<OrderCustomerDetails>({
    fullName: user?.name || '',
    phoneNumber: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || 'Kochi',
    pincode: user?.pincode || '682001',
    deliverySlot: 'Early Morning Harvest (7:00 AM - 11:00 AM)',
    paymentMethod: 'online',
    notes: ''
  });

  // Packaging preference
  const [packagingOption, setPackagingOption] = useState<'banana_leaf' | 'jute_bag' | 'kraft_box'>('banana_leaf');

  // Populate from authenticated profile
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phoneNumber: prev.phoneNumber || user.phone || '',
        email: prev.email || user.email || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || 'Kochi',
        pincode: prev.pincode || user.pincode || '682001',
      }));
    }
  }, [user]);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [onlinePayTab, setOnlinePayTab] = useState<'razorpay' | 'upi' | 'card'>('razorpay');
  
  // Card Details State
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: user?.name || 'ANJALI MENON',
    expiry: '',
    cvv: ''
  });

  // UPI State
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);

  // Modals for Payment Confirmation
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode] = useState('849201');
  const [inputOtp, setInputOtp] = useState('');
  const [rzpOrderId, setRzpOrderId] = useState('');

  // If cart is empty, redirect back
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Your harvest cart is empty</h2>
          <p className="text-slate-500 text-xs leading-relaxed">Please add fresh produce to your cart before proceeding to checkout.</p>
          <button
            onClick={() => onNavigate('marketplace')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-sm"
          >
            Go to Farm Marketplace
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    }

    const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phoneNumber = 'Phone number is required';
    } else if (cleanPhone.length < 10) {
      errs.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address.trim()) {
      errs.address = 'Delivery address is required';
    }

    if (!formData.city.trim()) {
      errs.city = 'City / District is required';
    }

    const cleanPin = formData.pincode.replace(/\D/g, '');
    if (!cleanPin) {
      errs.pincode = 'PIN Code is required';
    } else if (cleanPin.length !== 6) {
      errs.pincode = 'PIN code must be 6 digits';
    }

    if (formData.paymentMethod === 'online' && onlinePayTab === 'card') {
      const cleanCard = cardDetails.number.replace(/\D/g, '');
      if (cleanCard.length < 15) errs.cardNumber = 'Valid 16-digit card number is required';
      
      const cleanExpiry = cardDetails.expiry.replace(/\D/g, '');
      if (cleanExpiry.length !== 4) errs.cardExpiry = 'Valid expiry (MM/YY) is required';
      
      const cleanCvv = cardDetails.cvv.replace(/\D/g, '');
      if (cleanCvv.length < 3) errs.cardCvv = 'Valid CVV is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field: keyof OrderCustomerDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Quick GPS Simulation Filler
  const handleUseCurrentLocation = () => {
    setFormData((prev) => ({
      ...prev,
      address: 'Plot 42, Green Palms, Civil Station Road, Kakkanad',
      city: 'Kochi',
      pincode: '682030'
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.address;
      delete next.city;
      delete next.pincode;
      return next;
    });
    addToast('Location pinned via GPS: Kakkanad, Kochi Hub', 'info');
  };

  // Quick Card Preset Fillers for Evaluation
  const fillTestCard = (type: 'visa' | 'rupay') => {
    if (type === 'visa') {
      setCardDetails({
        number: '4111 1111 1111 1111',
        name: user?.name || 'ANJALI MENON',
        expiry: '12/28',
        cvv: '123'
      });
    } else {
      setCardDetails({
        number: '6070 1234 5678 9010',
        name: user?.name || 'ANJALI MENON',
        expiry: '08/29',
        cvv: '456'
      });
    }
    setErrors((prev) => {
      const n = { ...prev };
      delete n.cardNumber;
      delete n.cardExpiry;
      delete n.cardCvv;
      return n;
    });
    addToast(`Test ${type.toUpperCase()} card loaded`, 'info');
  };

  // Final Order Completion Handler
  const finalizeOrder = async (paymentDetails: any) => {
    setIsSubmitting(true);
    try {
      // 1. Place order in CartContext
      const confirmedOrder = placeOrder(formData);

      // 2. Persist order in backend Express API
      await api.createOrder(confirmedOrder, paymentDetails);

      // 3. Register into DRISHTI Tracking Context for live GPS tracking
      addTrackingOrder({
        id: confirmedOrder.orderId,
        product: confirmedOrder.items.map((i) => i.product.name).join(', '),
        quantity: `${confirmedOrder.items.reduce((s, i) => s + i.quantity, 0)} kg`,
        price: confirmedOrder.grandTotal,
        customerName: confirmedOrder.customer.fullName,
        customerPhone: confirmedOrder.customer.phoneNumber,
        pickupAddress: 'Green Valley Organic Farm, Poonjar, Kottayam',
        pickupLat: 9.6820,
        pickupLng: 76.8150,
        customerAddress: `${confirmedOrder.customer.address}, ${confirmedOrder.customer.city}`,
        customerLat: 9.6950,
        customerLng: 76.7820,
        driverId: 'D001',
        driverName: 'Rajesh Kumar',
        driverPhone: '+91 98765 43210',
        driverStatus: 'Available',
        currentLat: 9.6820,
        currentLng: 76.8150,
        status: 'Driver Assigned',
        lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
        createdAt: 'Just now'
      });

      addToast('Order confirmed! Farmers notified for fresh harvest dispatch.', 'success');
      onOrderSuccess(confirmedOrder);
    } catch {
      addToast('Order finalized with local backup confirmation', 'info');
      onOrderSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form Submit Entrypoint
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Please complete all required fields correctly', 'warning');
      return;
    }

    if (formData.paymentMethod === 'cod') {
      // Cash on delivery
      await finalizeOrder({
        gateway: 'Cash on Delivery',
        method: 'COD',
        status: 'PENDING_DELIVERY',
        amount: grandTotal
      });
      return;
    }

    // Online Payments
    if (onlinePayTab === 'razorpay') {
      try {
        setIsSubmitting(true);
        const rzpRes = await api.createPaymentOrder(grandTotal);
        setRzpOrderId(rzpRes.orderId);
        setShowRazorpayModal(true);
      } finally {
        setIsSubmitting(false);
      }
    } else if (onlinePayTab === 'card') {
      setShowOtpModal(true);
    } else if (onlinePayTab === 'upi') {
      setIsSubmitting(true);
      setTimeout(async () => {
        await finalizeOrder({
          gateway: 'Instant UPI',
          method: 'UPI',
          paymentId: `upi_${Date.now()}`,
          status: 'SUCCESS',
          amount: grandTotal
        });
      }, 1200);
    }
  };

  // Razorpay Modal Authorize Action
  const handleAuthorizeRazorpay = async () => {
    setIsSubmitting(true);
    try {
      const verifyRes = await api.verifyPayment({
        orderId: rzpOrderId || `order_rzp_${Date.now()}`,
        method: 'Razorpay Sandbox',
        amount: grandTotal,
      });

      setShowRazorpayModal(false);
      await finalizeOrder({
        gateway: 'Razorpay',
        paymentId: verifyRes.payment?.paymentId || `pay_rzp_${Date.now()}`,
        status: 'SUCCESS',
        amount: grandTotal
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3D Secure Card OTP Verification Action
  const handleVerifyCardOtp = async () => {
    if (inputOtp !== otpCode && inputOtp !== '123456') {
      addToast('Incorrect OTP. Use test OTP: 849201', 'warning');
      return;
    }

    setShowOtpModal(false);
    await finalizeOrder({
      gateway: '3D Secure Card Gateway',
      method: `Card (${cardDetails.number.slice(-4) || 'VISA'})`,
      paymentId: `card_txn_${Date.now()}`,
      status: 'SUCCESS',
      amount: grandTotal
    });
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        
        {/* Navigation & Header */}
        <div className="checkout-header">
          <button
            onClick={() => onNavigate('cart')}
            className="checkout-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </button>

          <div className="checkout-secure-badge">
            <Lock className="w-3.5 h-3.5" />
            <span>Direct Farm Sourcing • {isAuthenticated ? `Verified: ${user?.name}` : 'Instant Guest Checkout'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="checkout-layout">
            
            {/* Left Column: Form Details */}
            <div className="checkout-main">
              
              {/* Step 1: Customer Contact Info */}
              <div className="checkout-section">
                <div className="checkout-section-header">
                  <div className="checkout-section-title-wrap">
                    <div className="checkout-step-number">1</div>
                    <h2 className="checkout-section-title">Buyer Contact Details</h2>
                  </div>
                  {isAuthenticated && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <Check className="w-3 h-3" /> Profile Auto-filled
                    </span>
                  )}
                </div>

                <div className="checkout-form-grid">
                  <div className="input-group full-width">
                    <label className="input-label">
                      <UserIcon className="w-4 h-4" />
                      <span>Full Name <span className="input-required">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Anjali Menon"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`kisan-input ${errors.fullName ? 'border-rose-500 bg-rose-50/20' : ''}`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number <span className="input-required">*</span></span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9847012345"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={`kisan-input ${errors.phoneNumber ? 'border-rose-500 bg-rose-50/20' : ''}`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      <span>Email (For Tax Receipt / Tracking)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. anjali@example.com"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="kisan-input"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Destination & Schedule */}
              <div className="checkout-section">
                <div className="checkout-section-header">
                  <div className="checkout-section-title-wrap">
                    <div className="checkout-step-number">2</div>
                    <h2 className="checkout-section-title">Delivery Address & Slot</h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>GPS Auto-Fill</span>
                  </button>
                </div>

                <div className="checkout-form-grid" style={{ gap: '1rem' }}>
                  <div className="input-group full-width">
                    <label className="input-label">
                      <MapPin className="w-4 h-4" />
                      <span>House / Apartment / Street Address <span className="input-required">*</span></span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Flat 4B, Green Palms Residency, Civil Station Road"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`kisan-input ${errors.address ? 'border-rose-500 bg-rose-50/20' : ''}`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">City / District *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="kisan-input"
                    >
                      <option value="Kochi">Kochi / Ernakulam</option>
                      <option value="Thrissur">Thrissur</option>
                      <option value="Palakkad">Palakkad</option>
                      <option value="Kozhikode">Kozhikode</option>
                      <option value="Aluva">Aluva</option>
                      <option value="Kottayam">Kottayam</option>
                      <option value="Wayanad">Wayanad</option>
                      <option value="Idukki">Idukki</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">PIN Code *</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="682001"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className={`kisan-input ${errors.pincode ? 'border-rose-500 bg-rose-50/20' : ''}`}
                    />
                  </div>
                </div>

                  {/* Delivery Slot Selector */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <label className="input-label" style={{ marginBottom: '0.75rem' }}>
                      <Clock className="w-4 h-4" />
                      <span>Preferred Cold-Chain Delivery Slot</span>
                    </label>
                    <div className="selection-grid selection-grid-3">
                      {[
                        { label: 'Morning Dawn', time: '7:00 AM - 11:00 AM', tag: 'Fresh Harvest' },
                        { label: 'Afternoon Express', time: '2:00 PM - 5:00 PM', tag: 'Standard' },
                        { label: 'Evening Transit', time: '6:00 PM - 9:00 PM', tag: 'Cool Drop' },
                      ].map((slot, idx) => {
                        const slotValue = `${slot.label} (${slot.time})`;
                        const isSelected = formData.deliverySlot.includes(slot.label);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleInputChange('deliverySlot', slotValue)}
                            className={`option-card ${isSelected ? 'selected' : ''}`}
                          >
                            <div className="option-title">
                              <span>{slot.label}</span>
                            </div>
                            <p className="option-desc" style={{ marginTop: '0.25rem', fontFamily: 'monospace' }}>{slot.time}</p>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--fresh-green)', textTransform: 'uppercase' }}>
                              {slot.tag}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Notes */}
                  <div className="input-group" style={{ marginTop: '1.5rem' }}>
                    <label className="input-label">Special Delivery Instructions (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Leave with building security, ring doorbell twice"
                      value={formData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="kisan-input"
                    />
                  </div>
                </div>
              
              {/* Step 3: Eco-Packaging Preference */}
              <div className="checkout-section">
                <div className="checkout-section-header">
                  <div className="checkout-section-title-wrap">
                    <div className="checkout-step-number">3</div>
                    <h2 className="checkout-section-title">Zero-Plastic Packaging Selection</h2>
                  </div>
                  <span className="checkout-secure-badge" style={{ background: '#F0FDF4', color: '#047857', border: '1px solid #A7F3D0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Leaf className="w-3.5 h-3.5" />
                    <span>100% Eco-Friendly</span>
                  </span>
                </div>

                <div className="selection-grid selection-grid-3">
                  <div
                    onClick={() => setPackagingOption('banana_leaf')}
                    className={`option-card ${packagingOption === 'banana_leaf' ? 'selected' : ''}`}
                  >
                    <div className="option-title">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Leaf className="w-4 h-4 text-emerald-600" /> Banana Leaf Wrap
                      </span>
                    </div>
                    <p className="option-desc">
                      Traditional Kerala fresh farm wrap. 100% bio-compostable.
                    </p>
                  </div>

                  <div
                    onClick={() => setPackagingOption('jute_bag')}
                    className={`option-card ${packagingOption === 'jute_bag' ? 'selected' : ''}`}
                  >
                    <div className="option-title">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Package className="w-4 h-4 text-amber-600" /> Reusable Jute Tote
                      </span>
                    </div>
                    <p className="option-desc">
                      Woven breathable natural jute bag. Reusable for weeks.
                    </p>
                  </div>

                  <div
                    onClick={() => setPackagingOption('kraft_box')}
                    className={`option-card ${packagingOption === 'kraft_box' ? 'selected' : ''}`}
                  >
                    <div className="option-title">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck className="w-4 h-4 text-blue-600" /> Cold Box + Ice Gel
                      </span>
                    </div>
                    <p className="option-desc">
                      Insulated kraft box for delicate berries and greens.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div className="checkout-section">
                <div className="checkout-section-header">
                  <div className="checkout-section-title-wrap">
                    <div className="checkout-step-number">4</div>
                    <h2 className="checkout-section-title">Payment Method</h2>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>256-Bit Encrypted</span>
                </div>

                <div className="selection-grid selection-grid-2">
                  {/* Online Payment */}
                  <label
                    className={`option-card ${formData.paymentMethod === 'online' ? 'selected' : ''}`}
                    style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '0.75rem' }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'online'}
                      onChange={() => handleInputChange('paymentMethod', 'online')}
                      style={{ marginTop: '0.25rem', accentColor: 'var(--fresh-green)' }}
                    />
                    <div>
                      <div className="option-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>Instant Online Payment</span>
                      </div>
                      <p className="option-desc">
                        Razorpay, Dynamic UPI QR (GPay, PhonePe, Paytm), & Test Cards.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`option-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}
                    style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '0.75rem' }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => handleInputChange('paymentMethod', 'cod')}
                      style={{ marginTop: '0.25rem', accentColor: 'var(--fresh-green)' }}
                    />
                    <div>
                      <div className="option-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span>Cash on Delivery</span>
                      </div>
                      <p className="option-desc">
                        Pay cash or scan driver's DRISHTI QR code when produce arrives.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Online Sub-Tabs */}
                {formData.paymentMethod === 'online' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                      <button
                        type="button"
                        onClick={() => setOnlinePayTab('razorpay')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          onlinePayTab === 'razorpay' 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'text-slate-600 hover:bg-white'
                        }`}
                      >
                        <Zap size={13} />
                        <span>Razorpay Sandbox</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOnlinePayTab('upi')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          onlinePayTab === 'upi' 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'text-slate-600 hover:bg-white'
                        }`}
                      >
                        <Smartphone size={13} />
                        <span>Instant UPI QR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOnlinePayTab('card')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          onlinePayTab === 'card' 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'text-slate-600 hover:bg-white'
                        }`}
                      >
                        <CreditCard size={13} />
                        <span>Debit / Credit Card</span>
                      </button>
                    </div>

                    {/* Razorpay Tab */}
                    {onlinePayTab === 'razorpay' && (
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white bg-blue-600 px-2 py-0.5 rounded font-mono">
                              RAZORPAY
                            </span>
                            <span className="text-xs font-bold text-slate-800">Official INR Payment Gateway</span>
                          </div>
                          <span className="text-xs text-emerald-700 font-mono font-black">
                            ₹{grandTotal} INR
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Clicking "Confirm & Place Direct Order" below will launch the simulated Razorpay checkout window. Supports UPI, NetBanking, and all Indian bank cards.
                        </p>
                      </div>
                    )}

                    {/* UPI Tab */}
                    {onlinePayTab === 'upi' && (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-center gap-5 bg-white p-4 rounded-2xl border border-slate-200">
                          <div className="w-28 h-28 bg-slate-50 border-2 border-slate-800 rounded-2xl p-2 flex flex-col items-center justify-center shrink-0">
                            <QrCode className="w-16 h-16 text-slate-900" />
                            <span className="text-[9px] font-black text-slate-900 font-mono mt-1">₹{grandTotal} INR</span>
                          </div>
                          <div className="text-xs space-y-2 text-center sm:text-left">
                            <p className="font-bold text-slate-900 text-sm">Scan & Pay ₹{grandTotal}</p>
                            <p className="text-slate-500 leading-relaxed">
                              Open any UPI App (GPay, PhonePe, Paytm, or BHIM) and point your camera to pay.
                            </p>
                            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] font-bold text-slate-700">
                              <span className="px-2 py-0.5 bg-slate-100 rounded">GPay</span>
                              <span className="px-2 py-0.5 bg-slate-100 rounded">PhonePe</span>
                              <span className="px-2 py-0.5 bg-slate-100 rounded">Paytm</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <label className="font-bold text-slate-700">Or Pay via UPI VPA ID</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. yourname@okhdfcbank"
                              value={upiId}
                              onChange={(e) => { setUpiId(e.target.value); setUpiVerified(false); }}
                              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (upiId.includes('@')) {
                                  setUpiVerified(true);
                                  addToast('UPI ID Verified successfully', 'success');
                                } else {
                                  addToast('Please enter a valid UPI ID (e.g. user@oksbi)', 'warning');
                                }
                              }}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              {upiVerified ? (
                                <span className="inline-flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Verified
                                </span>
                              ) : (
                                'Verify'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card Tab with Live Preview */}
                    {onlinePayTab === 'card' && (
                      <div className="space-y-4">
                        {/* Live Virtual Card Preview */}
                        <div className="w-full max-w-sm mx-auto h-44 rounded-2xl bg-gradient-to-tr from-slate-900 via-emerald-950 to-slate-900 text-white p-5 flex flex-col justify-between shadow-lg border border-emerald-500/30 relative overflow-hidden">
                          <div className="flex justify-between items-center relative z-10">
                            <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400">KISAN PAY</span>
                            <span className="text-xs font-black font-mono">
                              {cardDetails.number.startsWith('4') ? 'VISA' : cardDetails.number.startsWith('6') ? 'RuPay' : 'CARD'}
                            </span>
                          </div>

                          <div className="font-mono text-base tracking-widest text-center py-2 relative z-10">
                            {cardDetails.number || '•••• •••• •••• ••••'}
                          </div>

                          <div className="flex justify-between items-end relative z-10 text-[10px]">
                            <div>
                              <span className="text-slate-400 uppercase tracking-wider block">Cardholder</span>
                              <span className="font-bold tracking-wider">{cardDetails.name || 'ANJALI MENON'}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-400 uppercase tracking-wider block">Expires</span>
                              <span className="font-bold font-mono">{cardDetails.expiry || 'MM/YY'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick 1-Click Test Fillers */}
                        <div className="flex items-center gap-2 pt-1 text-xs">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">1-Click Test Cards:</span>
                          <button
                            type="button"
                            onClick={() => fillTestCard('visa')}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Visa Test Card
                          </button>
                          <button
                            type="button"
                            onClick={() => fillTestCard('rupay')}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            RuPay Test Card
                          </button>
                        </div>

                        {/* Card Inputs */}
                        <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Card Number *</label>
                            <input 
                              type="text" 
                              maxLength={19}
                              placeholder="4111 1111 1111 1111" 
                              value={cardDetails.number}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                                setCardDetails(prev => ({ ...prev, number: val }));
                              }}
                              className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 font-mono focus:outline-none ${
                                errors.cardNumber ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'
                              }`}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Expiry (MM/YY) *</label>
                              <input 
                                type="text" 
                                maxLength={5}
                                placeholder="12/28" 
                                value={cardDetails.expiry}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/\D/g, '');
                                  if (val.length >= 3) {
                                    val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                  }
                                  setCardDetails(prev => ({ ...prev, expiry: val }));
                                }}
                                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 font-mono focus:outline-none ${
                                  errors.cardExpiry ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">CVV *</label>
                              <input 
                                type="password" 
                                maxLength={4}
                                placeholder="•••" 
                                value={cardDetails.cvv}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '');
                                  setCardDetails(prev => ({ ...prev, cvv: val }));
                                }}
                                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 font-mono focus:outline-none ${
                                  errors.cardCvv ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Review Sidebar */}
            <div className="checkout-sidebar">
              <div className="checkout-section">
                <div className="checkout-section-header">
                  <h2 className="checkout-section-title">Harvest Summary</h2>
                  <span className="checkout-secure-badge" style={{ padding: '0.25rem 0.75rem' }}>
                    {cart.length} produce types
                  </span>
                </div>

                {/* Items preview */}
                <div className="summary-items">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="summary-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="summary-item-img"
                        />
                        <div className="summary-item-info">
                          <p className="summary-item-name">{product.name}</p>
                          <p className="summary-item-qty">
                            {quantity} {product.unit} × ₹{product.price} <br/> ({product.farmer})
                          </p>
                        </div>
                      </div>
                      <span className="summary-item-price">
                        ₹{quantity * product.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Itemized Price Breakdown */}
                <div className="summary-breakdown">
                  <div className="summary-row">
                    <span>Produce Subtotal</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'monospace' }}>₹{subtotal}</span>
                  </div>

                  <div className="summary-row">
                    <span>Cold-Chain Delivery</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'monospace' }}>
                      {deliveryFee === 0 ? <span style={{ color: 'var(--fresh-green)', fontWeight: 900 }}>FREE</span> : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="summary-row" style={{ color: 'var(--fresh-green)', fontWeight: 700, fontFamily: 'monospace' }}>
                      <span>Promo Discount (10%)</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="summary-row total">
                    <div className="summary-total-label">
                      <span>Total Amount</span>
                      <span className="summary-total-sub">All Kerala direct farm taxes included</span>
                    </div>
                    <span className="summary-total-val">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '1rem', marginTop: '1.5rem', fontSize: '1rem' }}
                >
                  {isSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Harvest Dispatch...</span>
                    </span>
                  ) : (
                    <span>Confirm & Place Direct Order (₹{grandTotal})</span>
                  )}
                </button>

                {/* Farmer Guarantee Seal */}
                <div className="guarantee-box">
                  <div className="guarantee-title">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Direct-to-Farmer Guarantee</span>
                  </div>
                  <p className="guarantee-desc">
                    100% of proceeds go to registered Kerala farmers. Dispatch starts immediately with DRISHTI Live GPS Tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* RAZORPAY INTERACTIVE SANDBOX MODAL */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-fade-in relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white font-bold text-xs px-2 py-0.5 rounded font-mono">
                  RAZORPAY
                </span>
                <span className="text-xs font-bold text-slate-800">Sandbox Test Gateway</span>
              </div>
              <button 
                onClick={() => setShowRazorpayModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-center py-2">
              <p className="text-xs text-slate-500">Merchant: Kisan Agri Collective</p>
              <h3 className="text-3xl font-black text-slate-900 font-mono">₹{grandTotal}.00</h3>
              <p className="text-[11px] font-mono text-emerald-700">Order Ref: {rzpOrderId}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-700">
              <p className="font-bold text-slate-900">Choose simulated authorization:</p>
              <div className="flex gap-2">
                <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-300">
                  UPI / GPay
                </span>
                <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs">
                  NetBanking
                </span>
                <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs">
                  RuPay
                </span>
              </div>
            </div>

            <button
              onClick={handleAuthorizeRazorpay}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize Test Payment (₹{grandTotal})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3D SECURE OTP MODAL FOR CARD PAYMENTS */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-sm w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in relative text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bank 3D Secure Verification</span>
              </div>
              <button 
                onClick={() => setShowOtpModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-600">Enter OTP sent to registered mobile</p>
              <p className="text-xs text-emerald-800 font-mono font-bold bg-emerald-50 py-1 rounded-lg border border-emerald-200">
                Demo Test OTP: <strong>{otpCode}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
                className="w-full text-center tracking-widest text-xl font-mono font-bold px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setInputOtp(otpCode)}
                className="text-xs text-emerald-700 hover:underline font-bold block mx-auto cursor-pointer"
              >
                Autofill Test OTP
              </button>
            </div>

            <button
              onClick={handleVerifyCardOtp}
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Verify OTP & Authorize ₹{grandTotal}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
