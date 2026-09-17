import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import {
  Trash2, Plus, Minus, ArrowRight, ShoppingBag,
  MapPin, ShieldCheck, Tag, ArrowLeft, Truck,
  Sparkles, Sprout, Clock, CheckCircle2, Lock, Gift
} from 'lucide-react';

interface CartProps {
  onNavigate: (view: 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics', productId?: number) => void;
}

const S = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#0f172a',
  } as React.CSSProperties,
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '2.5rem 1.5rem 4rem',
  } as React.CSSProperties,
  // Cards
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  } as React.CSSProperties,
};

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const {
    cart, updateQuantity, removeFromCart, clearCart,
    subtotal, deliveryFee, discount, appliedPromo,
    applyPromo, removePromo, grandTotal, addToCart
  } = useCart();

  const [promoInput, setPromoInput] = useState<string>('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromo(promoInput);
    setPromoInput('');
  };

  const freeDeliveryThreshold = 300;
  const progressToFreeDelivery = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const directFarmerShare = Math.round(subtotal * 0.92);

  const promoOptions = [
    { code: 'KISAN10', desc: '10% Direct Discount' },
    { code: 'ORGANIC', desc: '10% Organic Special' },
    { code: 'FARM2026', desc: 'Harvest Fest 10% Off' }
  ];

  /* ── EMPTY STATE ── */
  if (cart.length === 0) {
    const recommendedProduce = products.slice(0, 4);
    return (
      <div style={S.page}>
        <div style={S.inner}>
          {/* Empty Banner */}
          <div style={{ ...S.card, padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ width: 72, height: 72, borderRadius: 20, background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#059669' }}>
              <ShoppingBag size={32} strokeWidth={1.75} />
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Your Harvest Cart is Empty</h2>
            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 400, margin: '0 auto 1.75rem', lineHeight: 1.7 }}>
              You haven't added any fresh farm harvest yet. Sourced freshly at dawn from verified Kerala farmers!
            </p>
            <button
              onClick={() => onNavigate('marketplace')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.8rem 1.75rem', borderRadius: 14, background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(5,150,105,0.28)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              Explore Farm Marketplace <ArrowRight size={16} />
            </button>
          </div>

          {/* Quick Recommendations */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 7 }}>
                <Sparkles size={16} color="#10b981" /> Today's Fresh Dawn Harvest
              </h3>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Cold-chain ready</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
              {recommendedProduce.map((prod) => (
                <div key={prod.id} style={{ ...S.card, padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'box-shadow 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#a7f3d0'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(16,185,129,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
                  <div style={{ width: '100%', height: 130, borderRadius: 12, overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
                    <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.55)', color: '#fff' }}>{prod.location}</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.name}</h4>
                    <p style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Sprout size={11} color="#059669" />
                      <span>{prod.farmer}</span>
                    </p>
                  </div>
                  <div style={{ paddingTop: '0.625rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 900, fontFamily: 'monospace' }}>₹{prod.price}<span style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8' }}>/{prod.unit}</span></span>
                    <button onClick={() => addToCart(prod, 1)} style={{ padding: '5px 12px', borderRadius: 10, background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", transition: 'background 0.15s,color 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#059669'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#ecfdf5'; (e.currentTarget as HTMLButtonElement).style.color = '#047857'; }}>
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── FILLED CART ── */
  return (
    <div style={S.page}>
      <div style={S.inner}>

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>Your Fresh Harvest Cart</h1>
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', padding: '3px 10px', borderRadius: 9999, background: '#d1fae5', color: '#047857', border: '1px solid #a7f3d0' }}>
                {cart.length} produce {cart.length === 1 ? 'type' : 'types'}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, margin: 0, fontWeight: 500 }}>
              <ShieldCheck size={14} color="#10b981" /> Directly sourced from verified Kerala farmers with 0% middleman cut
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => onNavigate('marketplace')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', fontSize: 13, fontWeight: 700, color: '#374151', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#cbd5e1'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; }}>
              <ArrowLeft size={13} /> Add More
            </button>
            <button onClick={clearCart} style={{ padding: '8px 16px', borderRadius: 12, background: '#fff5f5', border: '1px solid #fecaca', fontSize: 13, fontWeight: 700, color: '#dc2626', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Free Delivery Progress */}
        <div style={{ ...S.card, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', borderColor: '#d1fae5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 700 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Truck size={15} />
              </div>
              {subtotal >= freeDeliveryThreshold
                ? <span style={{ color: '#047857', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CheckCircle2 size={15} color="#059669" />
                    <span>Unlocked: FREE Express Cold-Chain Delivery!</span>
                  </span>
                : <span style={{ color: '#0f172a' }}>Add <strong style={{ color: '#059669', fontFamily: 'monospace' }}>₹{amountNeededForFreeDelivery}</strong> more for <strong style={{ color: '#059669' }}>FREE Delivery</strong></span>
              }
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', padding: '3px 10px', borderRadius: 9999, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              {Math.round(progressToFreeDelivery)}% to Free Delivery
            </span>
          </div>
          <div style={{ width: '100%', height: 8, borderRadius: 9999, background: '#f1f5f9', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 9999, background: 'linear-gradient(90deg,#10b981,#059669)', width: `${progressToFreeDelivery}%`, transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}><CheckCircle2 size={11} color="#10b981" /> ₹0</span>
            <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}><Gift size={11} color="#f59e0b" /> ₹150 bonus</span>
            <span style={{ fontSize: 11, color: subtotal >= 300 ? '#047857' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}><Truck size={11} color="#10b981" /> ₹300 FREE</span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT: Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.map(({ product, quantity }) => {
              const itemTotal = product.price * quantity;
              const isMax = quantity >= product.available;
              return (
                <div key={product.id} style={{ ...S.card, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#a7f3d0'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(16,185,129,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
                  {/* Image */}
                  <div onClick={() => onNavigate('details', Number(product.id))} style={{ width: 88, height: 88, borderRadius: 14, overflow: 'hidden', background: '#f1f5f9', border: '1px solid #e2e8f0', flexShrink: 0, cursor: 'pointer', position: 'relative' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {product.organic && (
                      <span style={{ position: 'absolute', top: 5, left: 5, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: 'rgba(5,150,105,0.85)', color: '#fff' }}>ORGANIC</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <h3 onClick={() => onNavigate('details', Number(product.id))} style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0, cursor: 'pointer', letterSpacing: '-0.02em' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLHeadingElement).style.color = '#059669'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLHeadingElement).style.color = '#0f172a'; }}>
                        {product.name}
                      </h3>
                      <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>₹{product.price}/{product.unit}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '2px 8px', borderRadius: 7, border: '1px solid #a7f3d0' }}>
                        <ShieldCheck size={12} color="#10b981" /> {product.farmer}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8' }}>
                        <MapPin size={12} color="#94a3b8" /> {product.location}, Kerala
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, fontFamily: 'monospace' }}>
                      Stock: {product.available} {product.unit} • Dawn Harvested
                    </span>
                  </div>

                  {/* Stepper + Price */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#f8fafc' }}>
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} style={{ padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}>
                        <Minus size={13} />
                      </button>
                      <span style={{ width: 36, textAlign: 'center', fontSize: 14, fontWeight: 900, fontFamily: 'monospace', color: '#0f172a', background: '#fff', paddingTop: 5, paddingBottom: 5 }}>{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} disabled={isMax} style={{ padding: '7px 10px', background: 'none', border: 'none', cursor: isMax ? 'not-allowed' : 'pointer', color: '#64748b', opacity: isMax ? 0.35 : 1, display: 'flex', alignItems: 'center' }}
                        onMouseEnter={e => { if (!isMax) (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}>
                        <Plus size={13} />
                      </button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 17, fontWeight: 900, fontFamily: 'monospace', color: '#0f172a' }}>₹{itemTotal}</div>
                      <button onClick={() => removeFromCart(product.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', fontFamily: "'Plus Jakarta Sans',sans-serif", marginTop: 2 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Farmer Payout Banner */}
            <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', border: '1px solid #a7f3d0', borderRadius: 16, padding: '1.125rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sprout size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>Transparent Direct Farm Payment</div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>Over 92% of your order value goes straight to the registered Kerala farmers upon doorstep handover.</div>
                </div>
              </div>
              <div style={{ background: '#fff', padding: '8px 16px', borderRadius: 12, border: '1px solid #a7f3d0', textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Farmer Payout</div>
                <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'monospace', color: '#047857' }}>₹{directFarmerShare}</div>
              </div>
            </div>

            {/* Freshness Guarantee */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '0.875rem 1.125rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={15} color="#2563eb" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#1e40af' }}>
                <strong>Guaranteed Freshness Window:</strong> Next dispatch departs tomorrow morning 7:00 AM with active DRISHTI cold-chain temperature telemetry.
              </span>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div style={{ ...S.card, padding: '1.5rem', position: 'sticky', top: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', margin: 0 }}>Order Summary</h2>
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', padding: '3px 9px', borderRadius: 9999, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>{cart.length} items</span>
            </div>

            {/* Price Lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                <span>Harvest Subtotal</span>
                <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  Cold-Chain Delivery
                  {deliveryFee === 0 && <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 5, background: '#d1fae5', color: '#047857', border: '1px solid #a7f3d0' }}>FREE</span>}
                </span>
                <span style={{ fontWeight: 700, color: deliveryFee === 0 ? '#059669' : '#0f172a', fontFamily: 'monospace' }}>{deliveryFee === 0 ? '₹0' : `₹${deliveryFee}`}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#059669', fontWeight: 700 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Tag size={13} /> Promo Discount</span>
                  <span style={{ fontFamily: 'monospace' }}>-₹{discount}</span>
                </div>
              )}
              <div style={{ paddingTop: '0.875rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>Grand Total</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Includes all farm taxes</div>
                </div>
                <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'monospace', color: '#059669' }}>₹{grandTotal}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: '0.5rem' }}>Apply Harvest Promo</span>
              {appliedPromo ? (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#047857' }}>
                    <Sparkles size={14} color="#10b981" /> '{appliedPromo}' Active — 10% OFF
                  </span>
                  <button onClick={removePromo} style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Remove</button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      type="text" placeholder="e.g. KISAN10"
                      value={promoInput} onChange={(e) => setPromoInput(e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', fontSize: 13, fontFamily: 'monospace', fontWeight: 700, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', outline: 'none', textTransform: 'uppercase' }}
                      onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    />
                    <button type="submit" style={{ padding: '8px 14px', borderRadius: 10, background: '#059669', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Apply</button>
                  </form>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {promoOptions.map(opt => (
                      <button key={opt.code} onClick={() => applyPromo(opt.code)} title={opt.desc}
                        style={{ padding: '4px 10px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color: '#475569', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#ecfdf5'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#a7f3d0'; (e.currentTarget as HTMLButtonElement).style.color = '#047857'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLButtonElement).style.color = '#475569'; }}>
                        <Tag size={10} color="#059669" />
                        <span>{opt.code}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Checkout CTA */}
            <button onClick={() => onNavigate('checkout')} style={{ width: '100%', padding: '0.9rem 1.5rem', borderRadius: 14, background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(5,150,105,0.28)', fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: '0.75rem', transition: 'filter 0.15s, transform 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.06)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'none'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
              <Lock size={12} color="#10b981" /> Direct Farmer Guarantee • Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
