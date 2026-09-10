import React from 'react';
import { useCart } from '../context/CartContext';
import { ExternalLink, ShieldCheck, Clock, CreditCard, ArrowLeft, Smartphone, QrCode } from 'lucide-react';

type MainViewType = 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics' | 'purchase' | 'login' | 'payment' | 'vendor';

interface PaymentPageProps {
  onNavigate: (view: MainViewType) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ onNavigate }) => {
  const { cart, subtotal, deliveryFee, grandTotal, addToast, placeOrder, clearCart } = useCart();

  const discount = (() => {
    try {
      const d = JSON.parse(localStorage.getItem('ann_purchase_details') || '{}');
      return d.couponApplied ? 50 : 0;
    } catch { return 0; }
  })();

  const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('ann_user_session') || '{}');
    } catch { return {}; }
  };
  const user = getUser();

  const handleCompletePayment = () => {
    try {
      const purchaseDetails = JSON.parse(localStorage.getItem('ann_purchase_details') || '{}');
      placeOrder({
        fullName: purchaseDetails.fullName || user.name || 'Customer',
        phoneNumber: purchaseDetails.phone || '',
        email: user.email || '',
        address: purchaseDetails.address || '',
        city: purchaseDetails.city || 'Kochi',
        pincode: purchaseDetails.pincode || '',
        deliverySlot: purchaseDetails.deliverySlot || 'Tomorrow, 7:00 AM – 11:00 AM',
        paymentMethod: 'cod',
        notes: purchaseDetails.driverNotes || '',
      });
    } catch { /* ignore */ }
    addToast('🎉 Payment processed! Handing off to Order Confirmation...', 'success');
    setTimeout(() => onNavigate('confirmation'), 600);
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Stepper */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-16 z-10 py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-0">
          {['Cart', 'Purchase', 'Login', 'Payment'].map((step, idx) => {
            const isCurrent = idx === 3;
            const isDone = idx < 3;
            const icons = ['🛒', '📦', '🔑', '💳'];
            return (
              <React.Fragment key={step}>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${isCurrent ? 'text-emerald-400' : isDone ? 'text-emerald-300' : 'text-slate-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 border ${isCurrent ? 'bg-emerald-500 border-emerald-400 text-slate-950' : isDone ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 text-slate-500'}`}>
                    {isDone ? '✓' : idx + 1}
                  </span>
                  <span className="hidden sm:inline">{step}</span>
                </div>
                {idx < 3 && <div className="flex-1 h-px mx-2 bg-emerald-600" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600/20 border-2 border-emerald-500 mb-4">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Secure Payment Gateway</h1>
          <p className="text-slate-400 text-sm mt-1">This module is a <strong className="text-slate-300">handoff point</strong> to Hanna's secure payment processing module.</p>
        </div>

        {/* Handoff card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xl shrink-0">💳</div>
            <div>
              <h2 className="font-extrabold text-white text-base">Payment Processing – Hanna's Module</h2>
              <p className="text-slate-400 text-xs mt-1">This completes Ann's checkout pipeline. In the integrated SIH product, a secure API call transfers the finalised cart, user identity, and dispatch slot to Hanna's payment microservice.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: <CreditCard className="w-4 h-4" />, label: 'Accepted Methods', value: 'UPI / Cards / COD / Net Banking', color: 'blue' },
              { icon: <ShieldCheck className="w-4 h-4" />, label: 'Security', value: 'SSL + PCI DSS Level 1 Compliant', color: 'emerald' },
              { icon: <Clock className="w-4 h-4" />, label: 'Settlement', value: 'T+1 to Farmer\'s linked Account', color: 'yellow' },
            ].map(item => (
              <div key={item.label} className={`bg-slate-950/50 border border-${item.color}-500/20 rounded-xl p-3`}>
                <div className={`text-${item.color}-400 mb-1.5`}>{item.icon}</div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{item.label}</p>
                <p className="text-xs text-white font-bold mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Payment method mockups */}
          <div className="border-t border-slate-800 pt-5">
            <p className="text-xs font-extrabold text-white mb-3 uppercase tracking-wider">Supported Payment Methods</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <QrCode className="w-5 h-5" />, label: 'UPI / QR Code', badge: 'Most Popular', badgeColor: 'emerald' },
                { icon: <CreditCard className="w-5 h-5" />, label: 'Debit / Credit Card', badge: 'Instant', badgeColor: 'blue' },
                { icon: <Smartphone className="w-5 h-5" />, label: 'Mobile Wallets', badge: '0% Fee', badgeColor: 'yellow' },
                { icon: <span className="text-lg">💵</span>, label: 'Cash on Delivery', badge: 'Always Free', badgeColor: 'slate' },
              ].map(method => (
                <div key={method.label} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-center cursor-default transition-colors">
                  <div className="text-slate-300 flex justify-center mb-2">{method.icon}</div>
                  <p className="text-[11px] text-slate-300 font-semibold leading-tight">{method.label}</p>
                  <span className={`mt-1.5 inline-block text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-${method.badgeColor}-900/60 text-${method.badgeColor}-300 border border-${method.badgeColor}-800`}>
                    {method.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
          <h3 className="font-extrabold text-white text-sm mb-4 flex items-center gap-2">
            📦 Order Summary for Payment
          </h3>
          <div className="space-y-2 mb-4">
            {cart.slice(0, 3).map(item => (
              <div key={item.product.id} className="flex justify-between items-center text-xs">
                <span className="text-slate-300">{item.product.name} × {item.quantity}</span>
                <span className="text-white font-mono font-bold">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
            {cart.length > 3 && (
              <p className="text-[11px] text-slate-500">+ {cart.length - 3} more items</p>
            )}
          </div>
          <div className="border-t border-slate-800 pt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400"><span>Subtotal</span><span className="font-mono">₹{subtotal}</span></div>
            <div className="flex justify-between text-xs text-slate-400"><span>Delivery</span><span className="font-mono">{deliveryFee === 0 ? <span className="text-emerald-400">FREE</span> : `₹${deliveryFee}`}</span></div>
            {discount > 0 && <div className="flex justify-between text-xs text-emerald-400 font-bold"><span>Coupon Discount</span><span className="font-mono">-₹{discount}</span></div>}
            <div className="flex justify-between text-base font-extrabold pt-2 border-t border-slate-700">
              <span className="text-white">Amount to Pay</span>
              <span className="text-emerald-400 font-mono text-xl">₹{finalTotal}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={() => onNavigate('login')}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-slate-700 hover:border-slate-600 text-white rounded-xl font-bold text-sm cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={handleCompletePayment}
            className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-emerald-600/30 cursor-pointer transition-all flex items-center justify-center gap-2">
            Complete Payment (Demo) &amp; Confirm Order <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-4">
          🔒 This is a demo payment flow. In the integrated SIH product, clicking the button above will initiate Hanna's secure payment gateway API. Cart data and user session will be passed via <code className="text-slate-400 text-[10px]">POST /api/payment/initiate</code>.
        </p>
      </div>
    </div>
  );
};
