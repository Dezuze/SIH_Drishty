import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { MapPin, Clock, Package, Leaf, User, Phone, FileText, ChevronRight, ArrowLeft, Check } from 'lucide-react';

type MainViewType = 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics' | 'purchase' | 'login' | 'payment' | 'vendor';

interface PurchasePageProps {
  onNavigate: (view: MainViewType) => void;
}

const SLOTS = [
  { id: 'morning', label: '🌅 Morning Harvest', time: '7:00 AM – 10:00 AM', desc: 'Dawn Picked', highlight: true },
  { id: 'afternoon', label: '☀️ Afternoon Express', time: '1:00 PM – 4:00 PM', desc: 'Cold-chain transit', highlight: false },
  { id: 'evening', label: '🌆 Evening Fresh Drop', time: '6:00 PM – 9:00 PM', desc: 'Direct from farm gate', highlight: false },
];

const COUPON_VALID = 'KISANFIRST';
const COUPON_DISCOUNT = 50;

const PURCHASE_KEY = 'ann_purchase_details';

export const PurchasePage: React.FC<PurchasePageProps> = ({ onNavigate }) => {
  const { cart, subtotal, deliveryFee, grandTotal, addToast } = useCart();

  const [form, setForm] = useState({
    fullName: 'Ananya Sharma',
    phone: '+91 98765 43210',
    address: 'Flat 402, Green Meadows, MG Road',
    city: 'Pune',
    pincode: '411001',
    deliverySlot: 'morning',
    driverNotes: 'Please ring bell and leave produce crate on the front porch table in shade.',
  });

  const [couponInput, setCouponInput] = useState(COUPON_VALID);
  const [couponApplied, setCouponApplied] = useState(true);
  const [couponMsg, setCouponMsg] = useState({ text: `✓ Code ${COUPON_VALID} active: ₹${COUPON_DISCOUNT} Harvest Welcome discount applied!`, success: true });

  const discount = couponApplied ? COUPON_DISCOUNT : 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discount);
  const uniqueFarmers = [...new Set(cart.map(i => i.product.farmer))];

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-950 p-8 text-center">
        <div className="text-5xl mb-4">🧺</div>
        <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-400 text-sm mb-6">Please add items to your cart before proceeding.</p>
        <button onClick={() => onNavigate('marketplace')} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm cursor-pointer transition-colors">
          Browse Fresh Produce
        </button>
      </div>
    );
  }

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === COUPON_VALID) {
      setCouponApplied(true);
      setCouponMsg({ text: `✓ Code ${COUPON_VALID} active: ₹${COUPON_DISCOUNT} Harvest Welcome discount applied!`, success: true });
      addToast(`Coupon applied: ₹${COUPON_DISCOUNT} off!`, 'success');
    } else if (code === '') {
      setCouponApplied(false);
      setCouponMsg({ text: '', success: false });
    } else {
      setCouponApplied(false);
      setCouponMsg({ text: 'Invalid code. Try KISANFIRST for ₹50 off.', success: false });
      addToast('Invalid promo code', 'warning');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(PURCHASE_KEY, JSON.stringify({ ...form, couponApplied, finalTotal }));
    } catch { /* ignore */ }
    addToast('Order dispatch details saved! Moving to Login...', 'success');
    setTimeout(() => onNavigate('login'), 400);
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Stepper */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-16 z-10 py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-0">
          {['Cart', 'Purchase', 'Login', 'Payment'].map((step, idx) => {
            const isCurrent = idx === 1;
            const isDone = idx === 0;
            return (
              <React.Fragment key={step}>
                <button
                  onClick={() => {
                    if (isDone) onNavigate('cart');
                    if (isCurrent) onNavigate('purchase');
                  }}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isCurrent ? 'text-emerald-400' : isDone ? 'text-emerald-300 cursor-pointer' : 'text-slate-500'}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 border ${isCurrent ? 'bg-emerald-500 border-emerald-400 text-slate-950' : isDone ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 text-slate-500'}`}>
                    {isDone ? <Check className="w-3 h-3" /> : idx + 1}
                  </span>
                  <span className="hidden sm:inline">{step}</span>
                </button>
                {idx < 3 && <div className={`flex-1 h-px mx-2 ${idx < 1 ? 'bg-emerald-600' : 'bg-slate-700'}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Purchase &amp; Delivery Dispatch</h1>
          <p className="text-slate-400 text-sm mt-1">Configure farm dispatch preferences and recipient details before authentication.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Left: Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            {/* Address Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-emerald-400" /> Delivery &amp; Dispatch Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                  <input type="text" required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Mobile Number (For Driver) <span className="text-red-400">*</span></label>
                  <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Street Address <span className="text-red-400">*</span></label>
                <input type="text" required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">City / District <span className="text-red-400">*</span></label>
                  <input type="text" required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">PIN Code <span className="text-red-400">*</span></label>
                  <input type="text" required value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
              </div>

              {/* Dispatch Slots */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-300 mb-3">
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
                  Select Fresh Harvest Dispatch Window <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SLOTS.map(slot => (
                    <button key={slot.id} type="button" onClick={() => setForm(f => ({ ...f, deliverySlot: slot.id }))}
                      className={`border rounded-xl p-3 text-left transition-all cursor-pointer ${form.deliverySlot === slot.id ? 'border-emerald-500 bg-emerald-950/60 ring-1 ring-emerald-500/30' : 'border-slate-700 bg-slate-950/40 hover:border-slate-600'}`}>
                      <div className="font-bold text-white text-xs">{slot.label}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{slot.time}</div>
                      {slot.highlight && <div className="text-emerald-400 text-[10px] font-bold mt-0.5">{slot.desc}</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Driver Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  <FileText className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
                  Special Instructions for Delivery Driver
                </label>
                <textarea rows={2} value={form.driverNotes} onChange={e => setForm(f => ({ ...f, driverNotes: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm resize-none focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. Please ring doorbell; handle glass honey jars carefully." />
                <p className="text-[11px] text-slate-500 mt-1">This note will be transmitted directly to Hanna's Driver &amp; Delivery app.</p>
              </div>
            </div>

            {/* Farm Traceability */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4">
              <h3 className="text-sm font-extrabold text-emerald-300 flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4" /> Verified Farm Origin &amp; Traceability
              </h3>
              <p className="text-xs text-slate-300 mb-3">Your order is packaged in 100% biodegradable cornstarch wrapping. Zero plastic, zero corporate middlemen taking 60% margins.</p>
              <div className="flex flex-wrap gap-2">
                {uniqueFarmers.map(farmer => (
                  <span key={farmer} className="text-[11px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full font-semibold">
                    👨‍🌾 {farmer}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button type="button" onClick={() => onNavigate('cart')}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-slate-700 hover:border-slate-600 text-white rounded-xl font-bold text-sm cursor-pointer transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Cart
              </button>
              <button type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-emerald-600/30 cursor-pointer transition-all">
                Confirm Details &amp; Proceed to Login <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right: Purchase Summary */}
          <aside className="lg:col-span-2 sticky top-28">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <h2 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" /> Purchase Review
              </h2>

              {/* Mini cart items */}
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between gap-2 text-xs pb-2 border-b border-slate-800/60 last:border-0">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img src={item.product.image} alt={item.product.name}
                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-700" />
                      <div className="overflow-hidden">
                        <p className="font-bold text-white truncate">{item.product.name}</p>
                        <p className="text-slate-400 text-[11px]">Qty: {item.quantity} • {item.product.farmer}</p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-400 font-mono whitespace-nowrap">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="flex gap-2">
                <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono uppercase"
                  placeholder="Promo code (KISANFIRST)" />
                <button type="button" onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors">
                  Apply
                </button>
              </div>
              {couponMsg.text && (
                <p className={`text-[11px] font-semibold -mt-2 ${couponMsg.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {couponMsg.text}
                </p>
              )}

              <div className="border-t border-slate-800 pt-3 space-y-2">
                <div className="flex justify-between text-xs text-slate-300"><span>Produce Subtotal</span><span className="font-mono font-bold text-white">₹{subtotal}</span></div>
                <div className="flex justify-between text-xs text-slate-300"><span>Farm Logistics</span><span className="font-mono font-bold text-white">{deliveryFee === 0 ? <span className="text-emerald-400">FREE</span> : `₹${deliveryFee}`}</span></div>
                {couponApplied && (
                  <div className="flex justify-between text-xs text-emerald-400 font-bold"><span>Harvest Coupon ({COUPON_VALID})</span><span className="font-mono">-₹{COUPON_DISCOUNT}</span></div>
                )}
                <div className="flex justify-between text-base font-extrabold pt-2 border-t border-slate-700">
                  <span className="text-white">Total to Pay</span>
                  <span className="text-emerald-400 font-mono">₹{finalTotal}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400">
                <strong className="text-slate-300">📌 Team Flow:</strong> Per project flowchart (Cart → Purchase → Login), clicking proceed takes you to the <strong>Login Page</strong> to authenticate before <strong>Payment</strong>.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
