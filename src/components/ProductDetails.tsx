import React, { useState } from 'react';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Sprout, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  Truck, 
  Clock, 
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onNavigate: (view: 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics') => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBack,
  onNavigate
}) => {
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Check if item is already in cart to see existing qty
  const cartItem = cart.find((item) => item.product.id === product.id);
  const alreadyInCart = cartItem ? cartItem.quantity : 0;
  const remainingStock = Math.max(0, product.available - alreadyInCart);

  const handleIncrement = () => {
    if (quantity < product.available) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleManualQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      setQuantity(1);
    } else if (val > product.available) {
      setQuantity(product.available);
    } else {
      setQuantity(val);
    }
  };

  const handleAddToCart = () => {
    const res = addToCart(product, quantity);
    if (res.success) {
      setAddedSuccess(true);
      setTimeout(() => {
        setAddedSuccess(false);
      }, 2000);
    }
  };

  const handleBuyNow = () => {
    const res = addToCart(product, quantity);
    if (res.success) {
      onNavigate('checkout');
    }
  };

  const calculatedTotal = quantity * product.price;
  const isMaxReached = quantity >= product.available;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Breadcrumb & Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-emerald-400 text-sm font-bold bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 shadow-sm hover:border-emerald-500/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Marketplace</span>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="font-bold text-white">{product.name}</span>
          </div>
        </div>

        {/* Product Details Main Card */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">
            
            {/* Left Column: Large Image */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-slate-950/60 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-800">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.organic && (
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                      <Sprout className="w-3.5 h-3.5" /> 100% Organic
                    </span>
                  )}
                  {product.harvestDate && (
                    <span className="bg-slate-950/85 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 border border-slate-800">
                      <Clock className="w-3 h-3 text-emerald-400" /> {product.harvestDate}
                    </span>
                  )}
                </div>

                {/* Stock Tag on Image */}
                <div className="absolute bottom-4 right-4 bg-slate-950/90 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-md border border-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{product.available} {product.unit} Available</span>
                </div>
              </div>

              {/* Quality Guarantee Mini Banner */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Harvested & shipped fresh</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct farm dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Column: Product Information & Purchase Controls */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/90 border border-emerald-500/40 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Product ID: #KSN-00{product.id}
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {product.name}
                  </h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Freshly cultivated agricultural produce
                  </p>
                </div>

                {/* Price Display */}
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Unit Price</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">₹{product.price}</span>
                      <span className="text-base font-bold text-slate-400">/ {product.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400 block">Farm Stock</span>
                    <span className="text-sm font-black text-emerald-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-emerald-500/40 inline-block mt-0.5 font-mono">
                      {product.available} {product.unit} in stock
                    </span>
                  </div>
                </div>

                {/* Farmer Profile Card */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-slate-950 flex items-center justify-center font-bold text-sm">
                        {product.farmer.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white">{product.farmer}</h4>
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" /> {product.location}, Kerala
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      Verified Producer
                    </span>
                  </div>

                  {product.farmStory && (
                    <p className="text-xs text-slate-300 italic pt-1 border-t border-slate-800/80">
                      "{product.farmStory}"
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    About this harvest
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Purchasing Controls */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                {/* Quantity Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Select Quantity ({product.unit}):
                    </label>
                    <span className="text-xs font-semibold text-slate-400">
                      Max: {product.available} {product.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center border border-slate-700 rounded-2xl bg-slate-950 overflow-hidden shadow-xs">
                      <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="p-3 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.available}
                        value={quantity}
                        onChange={handleManualQtyChange}
                        className="w-16 text-center bg-slate-900 py-2 font-black text-white focus:outline-hidden border-x border-slate-700 text-base font-mono"
                      />
                      <button
                        onClick={handleIncrement}
                        disabled={quantity >= product.available}
                        className="p-3 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl px-4 py-2.5 text-right">
                      <span className="text-[11px] font-semibold text-slate-400 block">Total Calculated Price</span>
                      <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                        ₹{calculatedTotal}
                      </span>
                    </div>
                  </div>

                  {/* Stock Limit Warning Notice */}
                  {isMaxReached && (
                    <div className="flex items-center gap-2 p-2.5 bg-amber-950/80 border border-amber-500/40 rounded-xl text-xs text-amber-300 font-medium">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>You have reached the maximum available harvest of {product.available} {product.unit}.</span>
                    </div>
                  )}

                  {alreadyInCart > 0 && (
                    <p className="text-xs text-slate-400">
                      ℹ️ You already have <strong className="text-emerald-400">{alreadyInCart} {product.unit}</strong> in your cart. (Remaining stock: {remainingStock} {product.unit})
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.available === 0}
                    className={`py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer ${
                      addedSuccess
                        ? 'bg-emerald-700 text-white shadow-emerald-700/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 hover:shadow-xl'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-5 h-5 text-emerald-300" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart (₹{calculatedTotal})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.available === 0}
                    className="py-3.5 px-6 rounded-2xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <HeartHandshake className="w-5 h-5 text-amber-400" />
                    <span>Buy Now Directly</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
