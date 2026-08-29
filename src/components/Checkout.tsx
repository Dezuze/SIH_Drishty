import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import type { OrderCustomerDetails } from '../data/products';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  MapPin, 
  User, 
  Phone, 
  Calendar, 
  AlertCircle,
  QrCode,
  Lock
} from 'lucide-react';

interface CheckoutProps {
  onNavigate: (view: 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics') => void;
  onOrderSuccess: (details?: OrderCustomerDetails) => void;
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

  // Form State
  const [formData, setFormData] = useState<OrderCustomerDetails>({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: 'Kochi',
    pincode: '',
    deliverySlot: 'Tomorrow Morning (7:00 AM - 11:00 AM)',
    paymentMethod: 'cod',
    notes: ''
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [onlinePayTab, setOnlinePayTab] = useState<'upi' | 'card'>('upi');

  // If cart is empty, redirect back
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100">
        <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-400 text-sm mb-6">Please add fresh produce to your cart before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('marketplace')}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm cursor-pointer"
        >
          Go to Marketplace
        </button>
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

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field: keyof OrderCustomerDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for that field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Please fill all required fields correctly', 'warning');
      return;
    }

    setIsSubmitting(true);

    // Simulate short network processing for realistic feel
    setTimeout(() => {
      placeOrder(formData);
      setIsSubmitting(false);
      onOrderSuccess(formData);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('cart')}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-emerald-400 text-sm font-bold bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 shadow-sm hover:border-emerald-500/50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>Direct Farmer Checkout</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Checkout Information Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Customer Contact Info */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 backdrop-blur-md">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-slate-950 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h2 className="text-lg font-black text-white">Buyer Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Full Name <span className="text-red-400">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Anjali Nair"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm bg-slate-950 border rounded-xl text-white focus:outline-hidden transition-all ${
                        errors.fullName
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Phone Number <span className="text-red-400">*</span></span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9847012345"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm bg-slate-950 border rounded-xl text-white focus:outline-hidden transition-all ${
                        errors.phoneNumber
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-[11px] text-red-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Email (Optional) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      <span>Email (For Receipt / Updates)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. anjali@example.com"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:outline-hidden transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Address */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 backdrop-blur-md">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-slate-950 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h2 className="text-lg font-black text-white">Delivery Address</h2>
                </div>

                <div className="space-y-4">
                  {/* Street Address */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>House / Flat / Street Address <span className="text-red-400">*</span></span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Flat 4B, Green Palms Apartment, MG Road"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm bg-slate-950 border rounded-xl text-white focus:outline-hidden transition-all ${
                        errors.address
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-red-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">
                        <span>City / District <span className="text-red-400">*</span></span>
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:outline-hidden"
                      >
                        <option value="Kochi">Kochi / Ernakulam</option>
                        <option value="Thrissur">Thrissur</option>
                        <option value="Palakkad">Palakkad</option>
                        <option value="Kozhikode">Kozhikode</option>
                        <option value="Aluva">Aluva</option>
                        <option value="Wayanad">Wayanad</option>
                        <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                      </select>
                    </div>

                    {/* PIN Code */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">
                        <span>PIN Code <span className="text-red-400">*</span></span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 682011"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        className={`w-full px-4 py-2.5 text-sm bg-slate-950 border rounded-xl text-white focus:outline-hidden transition-all ${
                          errors.pincode
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        }`}
                      />
                      {errors.pincode && (
                        <p className="text-[11px] text-red-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Slot */}
                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Preferred Delivery Slot</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <label
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.deliverySlot.includes('Morning')
                            ? 'border-emerald-500 bg-emerald-950/80 text-white font-bold'
                            : 'border-slate-800 hover:bg-slate-950 text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliverySlot"
                          checked={formData.deliverySlot.includes('Morning')}
                          onChange={() => handleInputChange('deliverySlot', 'Tomorrow Morning (7:00 AM - 11:00 AM)')}
                          className="accent-emerald-500"
                        />
                        <div className="text-xs">
                          <p className="font-bold">🌅 Morning Harvest Slot</p>
                          <p className="text-slate-400 font-normal">7:00 AM - 11:00 AM</p>
                        </div>
                      </label>

                      <label
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.deliverySlot.includes('Evening')
                            ? 'border-emerald-500 bg-emerald-950/80 text-white font-bold'
                            : 'border-slate-800 hover:bg-slate-950 text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliverySlot"
                          checked={formData.deliverySlot.includes('Evening')}
                          onChange={() => handleInputChange('deliverySlot', 'Tomorrow Evening (4:00 PM - 8:00 PM)')}
                          className="accent-emerald-500"
                        />
                        <div className="text-xs">
                          <p className="font-bold">🌇 Evening Slot</p>
                          <p className="text-slate-400 font-normal">4:00 PM - 8:00 PM</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 backdrop-blur-md">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-slate-950 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <h2 className="text-lg font-black text-white">Payment Option</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-emerald-500 bg-emerald-950/60 shadow-xs'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => handleInputChange('paymentMethod', 'cod')}
                      className="mt-1 accent-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                        <Banknote className="w-4 h-4 text-emerald-400" />
                        <span>Cash on Delivery</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Pay cash or UPI to the delivery person once your fresh vegetables arrive.
                      </p>
                    </div>
                  </label>

                  {/* Online Payment (Mock) */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'online'
                        ? 'border-emerald-500 bg-emerald-950/60 shadow-xs'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'online'}
                      onChange={() => handleInputChange('paymentMethod', 'online')}
                      className="mt-1 accent-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                        <span>Online Payment</span>
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">Demo</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Simulated instant UPI (GPay, PhonePe, Paytm) or Card verification.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Simulated Online Payment Drawer */}
                {formData.paymentMethod === 'online' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <button
                        type="button"
                        onClick={() => setOnlinePayTab('upi')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          onlinePayTab === 'upi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        📱 UPI Apps / QR
                      </button>
                      <button
                        type="button"
                        onClick={() => setOnlinePayTab('card')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          onlinePayTab === 'card' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        💳 Debit / Credit Card
                      </button>
                    </div>

                    {onlinePayTab === 'upi' ? (
                      <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <div className="w-16 h-16 bg-slate-950 rounded-lg flex items-center justify-center text-slate-300 border border-slate-800">
                          <QrCode className="w-10 h-10 text-emerald-400" />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <p className="font-bold text-white">Scan & Pay ₹{grandTotal}</p>
                          <p className="text-slate-400">Supports GPay, PhonePe, Paytm & BHIM</p>
                          <span className="inline-block text-[11px] text-emerald-400 font-semibold">
                            ✓ Instant sandbox payment enabled
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                        <div className="text-slate-400">Mock Card Number: <span className="font-mono font-bold text-white">4242 •••• •••• 4242</span></div>
                        <div className="text-[11px] text-emerald-400 font-semibold">✓ Test card pre-filled for instant verification</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Complete Order Summary Review */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-5 sticky top-28 backdrop-blur-md">
                <h2 className="text-lg font-black text-white pb-3 border-b border-slate-800 flex items-center justify-between">
                  <span>Complete Order Summary</span>
                  <span className="text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    {cart.length} items
                  </span>
                </h2>

                {/* Compact Item Breakdown */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white">{product.name}</p>
                          <p className="text-slate-400">
                            {quantity} {product.unit} × ₹{product.price} ({product.farmer})
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-white font-mono shrink-0">
                        ₹{quantity * product.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-bold text-white font-mono">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Delivery Charge</span>
                    <span className="font-bold text-white font-mono">
                      {deliveryFee === 0 ? <span className="text-emerald-400 font-black">FREE</span> : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold font-mono">
                      <span>Promo Discount (10%)</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-black text-white block">Total Amount</span>
                      <span className="text-[10px] text-slate-400">All taxes included</span>
                    </div>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                {/* Submit / Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Placing Order with Farmers...</span>
                    </span>
                  ) : (
                    <span>Place Order (₹{grandTotal})</span>
                  )}
                </button>

                {/* Guarantee */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct Farmer Guarantee</span>
                  </div>
                  <p className="text-slate-400">
                    Every rupee supports local growers directly. Fresh harvest packed within hours of your order.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};
