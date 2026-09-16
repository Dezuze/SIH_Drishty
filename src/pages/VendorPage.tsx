import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { BarChart2, Package, TrendingUp, ArrowUpRight, Star, Check, PlusCircle, Eye, ExternalLink } from 'lucide-react';

type MainViewType = 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics' | 'purchase' | 'login' | 'payment' | 'vendor';

interface VendorPageProps {
  onNavigate: (view: MainViewType) => void;
}

const DEMO_PRODUCTS = [
  { id: 1, name: 'Tomato (Cherry)', price: 55, stock: 140, orders: 23, rating: 4.9, revenue: 1265, category: 'Vegetables', organic: true },
  { id: 2, name: 'Forest Honey', price: 360, stock: 45, orders: 12, rating: 4.8, revenue: 4320, category: 'Honey', organic: true },
  { id: 3, name: 'Coconut Oil (Cold-pressed)', price: 240, stock: 30, orders: 8, rating: 4.7, revenue: 1920, category: 'Oils', organic: true },
  { id: 4, name: 'Banana (Nendran)', price: 65, stock: 200, orders: 31, rating: 4.6, revenue: 2015, category: 'Fruits', organic: false },
  { id: 5, name: 'Drumstick', price: 40, stock: 80, orders: 15, rating: 4.5, revenue: 600, category: 'Vegetables', organic: true },
];

const RECENT_ORDERS = [
  { id: 'ORD-7842', buyer: 'Ananya S.', items: 'Cherry Tomato × 2kg, Honey × 1 bottle', time: '2 min ago', status: 'New', color: 'emerald' },
  { id: 'ORD-7841', buyer: 'Priya K.', items: 'Nendran Banana × 5kg', time: '18 min ago', status: 'Dispatched', color: 'blue' },
  { id: 'ORD-7840', buyer: 'Raju M.', items: 'Coconut Oil × 2 bottles', time: '1 hr ago', status: 'Delivered', color: 'slate' },
  { id: 'ORD-7839', buyer: 'Lakshmi V.', items: 'Drumstick × 1kg, Tomato × 2kg', time: '3 hr ago', status: 'Delivered', color: 'slate' },
];

const STAT_CARDS = [
  { label: 'This Week\'s Revenue', value: '₹10,120', sub: '+18% vs last week', icon: <TrendingUp className="w-5 h-5" />, color: 'emerald' },
  { label: 'Orders Pending', value: '4', sub: '2 assigned to drivers', icon: <Package className="w-5 h-5" />, color: 'yellow' },
  { label: 'Products Listed', value: '5', sub: 'All active, 1 low stock', icon: <BarChart2 className="w-5 h-5" />, color: 'blue' },
  { label: 'Avg. Buyer Rating', value: '4.7 ★', sub: 'Across 89 reviews', icon: <Star className="w-5 h-5" />, color: 'orange' },
];

export const VendorPage: React.FC<VendorPageProps> = ({ onNavigate }) => {
  const { addToast } = useCart();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  const getUser = () => {
    try { return JSON.parse(localStorage.getItem('ann_user_session') || '{}'); } catch { return {}; }
  };
  const user = getUser();
  const farmerName = user.name || 'Farmer Ramesh Patel';

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-slate-500 uppercase font-extrabold tracking-widest">Vendor Portal</p>
            <h1 className="text-base font-extrabold text-white leading-none mt-0.5">Welcome, {farmerName} 👨‍🌾</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate('marketplace')}
              className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl font-bold cursor-pointer transition-colors">
              View Marketplace
            </button>
            <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] font-bold px-3 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              LIVE DASHBOARD
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0 border-b border-transparent">
            {(['dashboard', 'products', 'orders'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`capitalize text-xs font-extrabold px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${activeTab === tab ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-white'}`}>
                {tab === 'dashboard' ? '📊 Dashboard' : tab === 'products' ? '🌾 My Listings' : '📋 Recent Orders'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* HANDOFF BANNER */}
        <div className="mb-5 flex items-start gap-3 bg-purple-950/40 border border-purple-500/30 rounded-2xl p-4">
          <div className="text-2xl shrink-0 mt-0.5">🔗</div>
          <div>
            <p className="font-extrabold text-purple-300 text-sm">Handoff Point — Ihsana's Module</p>
            <p className="text-purple-400 text-xs mt-0.5">
              This page is Ann's boundary. In the integrated SIH product, logged-in farmers are redirected to Ihsana's Vendor Dashboard with a secure <code className="text-purple-300/70 text-[10px]">GET /api/vendor/profile</code> call carrying the JWT token. The analytics, listing management, and order operations below are a preview of the expected interface.
            </p>
          </div>
          <button onClick={() => addToast('JWT handoff to Ihsana\'s backend initiated (demo)', 'info')}
            className="shrink-0 text-[11px] font-bold text-purple-200 border border-purple-500/40 bg-purple-950/60 hover:bg-purple-900/60 px-3 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3" /> Simulate Handoff
          </button>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STAT_CARDS.map(card => (
                <div key={card.label} className={`bg-slate-900 border border-slate-800 hover:border-${card.color}-500/30 rounded-2xl p-4 transition-colors`}>
                  <div className={`text-${card.color}-400 mb-2`}>{card.icon}</div>
                  <p className="text-2xl font-extrabold text-white font-mono tracking-tight">{card.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{card.label}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Top Products & Recent Orders split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Top Sellers */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" /> Top Selling Products
                </h3>
                <div className="space-y-3">
                  {DEMO_PRODUCTS.sort((a, b) => b.revenue - a.revenue).slice(0, 3).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className={`text-[11px] font-extrabold w-5 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : 'text-amber-700'}`}>#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{p.name}</p>
                        <p className="text-[11px] text-slate-400">{p.orders} orders • {p.rating} ★</p>
                      </div>
                      <span className="text-emerald-400 font-mono text-xs font-extrabold">₹{p.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-yellow-400" /> Live Order Feed
                </h3>
                <div className="space-y-2.5">
                  {RECENT_ORDERS.slice(0, 3).map(order => (
                    <div key={order.id} className="flex items-start gap-2.5 text-xs">
                      <div>
                        <p className="font-bold text-white">{order.id} • {order.buyer}</p>
                        <p className="text-slate-400 text-[11px] truncate max-w-[200px]">{order.items}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">{order.time}</p>
                      </div>
                      <span className={`ml-auto text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-${order.color}-900/60 text-${order.color}-300 border border-${order.color}-800 whitespace-nowrap`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-white">My Produce Listings</h2>
              <button onClick={() => addToast('Add New Listing → Ihsana\'s product management module', 'info')}
                className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded-xl cursor-pointer transition-colors">
                <PlusCircle className="w-3.5 h-3.5" /> Add New Product
              </button>
            </div>
            <div className="space-y-3">
              {DEMO_PRODUCTS.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex items-center gap-4 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
                    {p.category === 'Vegetables' ? '🥬' : p.category === 'Honey' ? '🍯' : p.category === 'Oils' ? '🫙' : p.category === 'Fruits' ? '🍌' : '🌿'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-extrabold text-white text-sm truncate">{p.name}</p>
                      {p.organic && <span className="text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 bg-emerald-950 border border-emerald-500/40 text-emerald-400 rounded-full">Organic</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-slate-400">₹{p.price}/unit • Stock: {p.stock}</span>
                      <span className="text-[11px] text-slate-400">{p.orders} orders</span>
                      <span className="text-[11px] text-yellow-400">{p.rating} ★</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-emerald-400 font-mono font-extrabold text-base">₹{p.revenue}</p>
                    <p className="text-[11px] text-slate-500">Total Revenue</p>
                  </div>
                  <button onClick={() => addToast(`Edit ${p.name} → Ihsana's listing editor`, 'info')}
                    className="ml-2 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-base font-extrabold text-white mb-4">Recent Order Feed</h2>
            <div className="space-y-3">
              {RECENT_ORDERS.map(order => (
                <div key={order.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex items-start gap-4 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">📋</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-extrabold text-white text-sm">{order.id}</p>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-${order.color}-900/60 text-${order.color}-300 border border-${order.color}-800`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300"><strong className="text-slate-200">Buyer:</strong> {order.buyer}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{order.items}</p>
                    <p className="text-[11px] text-slate-500 mt-1">🕐 {order.time}</p>
                  </div>
                  <button onClick={() => addToast(`Order ${order.id} management → Hanna's delivery tracking module`, 'info')}
                    className="shrink-0 text-xs text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors">
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
