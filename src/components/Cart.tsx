import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  Tag, 
  ArrowLeft, 
  Truck, 
  Sparkles,
  Info
} from 'lucide-react';

interface CartProps {
  onNavigate: (view: 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics' | 'purchase' | 'login' | 'payment' | 'vendor', productId?: number) => void;
}

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    deliveryFee, 
    discount, 
    appliedPromo, 
    applyPromo, 
    removePromo, 
    grandTotal 
  } = useCart();

  const [promoInput, setPromoInput] = useState<string>('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    applyPromo(promoInput);
    setPromoInput('');
  };

  const freeDeliveryThreshold = 300;
  const progressToFreeDelivery = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-slate-900/90 rounded-3xl border border-slate-800 p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="w-20 h-20 bg-emerald-950 rounded-3xl flex items-center justify-center mx-auto text-emerald-400 mb-6 border border-emerald-500/30">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Your Cart is Empty</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Looks like you haven't added any fresh farm harvest to your cart yet. Explore fresh produce directly from local farmers!
          </p>
          <button
            onClick={() => onNavigate('marketplace')}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <span>Browse Farm Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">Your Fresh Harvest Cart</h1>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full">
                {cart.length} unique produce
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Directly sourced from trusted Kerala farmers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('marketplace')}
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Add More Produce</span>
            </button>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 px-3.5 py-2 rounded-xl transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-slate-900/90 text-slate-200 rounded-2xl p-4 mb-8 shadow-md border border-emerald-500/30">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-white">
              <Truck className="w-4 h-4 text-emerald-400" />
              {subtotal >= freeDeliveryThreshold ? (
                <span className="text-emerald-300">🎉 Congratulations! You have unlocked FREE Express Farm Delivery!</span>
              ) : (
                <span>Add ₹{amountNeededForFreeDelivery} more for FREE Delivery</span>
              )}
            </span>
            <span className="font-mono text-emerald-400">{Math.round(progressToFreeDelivery)}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressToFreeDelivery}%` }}
            ></div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map(({ product, quantity }) => {
              const itemTotal = product.price * quantity;
              const isMax = quantity >= product.available;

              return (
                <div
                  key={product.id}
                  className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-5 shadow-sm hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between"
                >
                  {/* Item Image and Details */}
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      onClick={() => onNavigate('details', product.id)}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 cursor-pointer group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3
                          onClick={() => onNavigate('details', product.id)}
                          className="font-black text-base sm:text-lg text-white hover:text-emerald-300 cursor-pointer"
                        >
                          {product.name}
                        </h3>
                        <span className="text-xs font-semibold text-slate-400">
                          (₹{product.price} / {product.unit})
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                        <span className="flex items-center gap-1 font-semibold text-slate-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          {product.farmer}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {product.location}
                        </span>
                      </div>

                      <div className="text-[11px] text-emerald-400 font-medium font-mono">
                        Stock: {product.available} {product.unit} available
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    {/* Quantity Selector */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center border border-slate-700 rounded-xl bg-slate-950 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-2 text-slate-300 hover:bg-slate-800 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-xs font-black text-white bg-slate-900 py-1 font-mono">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={isMax}
                          className="p-2 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{product.unit}</span>
                    </div>

                    {/* Total Price & Delete */}
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                        ₹{itemTotal}
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-400 hover:text-red-400 p-1 rounded-md transition-colors inline-flex items-center gap-1 text-xs mt-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Farmer Direct Transparency Banner */}
            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-200">
              <Info className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <strong className="font-bold text-white">Transparent Farm Pricing:</strong> Over 92% of your order value goes straight to the registered farmer bank accounts within 24 hours of delivery.
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-5 sticky top-28 backdrop-blur-md">
              <h2 className="text-lg font-black text-white pb-3 border-b border-slate-800">
                Order Summary
              </h2>

              {/* Price Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-white font-mono">₹{subtotal}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    Delivery Charge
                    {deliveryFee === 0 && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold px-1.5 py-0.5 rounded">FREE</span>
                    )}
                  </span>
                  <span className="font-bold text-white font-mono">
                    {deliveryFee === 0 ? <span className="text-emerald-400">₹0</span> : `₹${deliveryFee}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-semibold font-mono">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Promo Discount (10%)
                    </span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-black text-white block">Grand Total</span>
                    <span className="text-[11px] text-slate-400">Includes all local taxes</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="pt-2">
                {appliedPromo ? (
                  <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Code '{appliedPromo}' Active</span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-slate-400 hover:text-red-400 font-bold underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. KISAN10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Checkout CTA — routes through Ann's Purchase → Login → Payment flow */}
              <button
                onClick={() => onNavigate('purchase')}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all cursor-pointer"
              >
                <span>Proceed to Purchase Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-slate-400 pt-1">
                🔒 Safe & encrypted simulated checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
