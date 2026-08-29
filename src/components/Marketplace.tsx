import React, { useState, useMemo } from 'react';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Sprout, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  Check, 
  Sparkles,
  Truck,
  Leaf,
  Users
} from 'lucide-react';

interface MarketplaceProps {
  products: Product[];
  onViewProduct: (productId: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  products,
  onViewProduct,
  searchQuery,
  onSearchChange
}) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'availability'>('featured');
  const [addedAnimationId, setAddedAnimationId] = useState<number | null>(null);

  // Extract available categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.farmer.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'availability') return b.available - a.available;
        return a.id - b.id; // featured default
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const res = addToCart(product, 1);
    if (res.success) {
      setAddedAnimationId(product.id);
      setTimeout(() => {
        setAddedAnimationId(null);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/20">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 -mb-10 w-72 h-72 rounded-full bg-teal-500/10 blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-950/90 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 backdrop-blur-xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Farm-to-Doorstep Marketplace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Fresh Harvest Direct From <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">Local Kerala Farmers</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                Skip the middlemen and superstore markups. Order freshly harvested, pesticide-safe vegetables and fruits with transparent farm origins and fair prices for our growers.
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
                <div className="bg-slate-900/80 backdrop-blur-xs border border-slate-800 rounded-xl p-3 text-left">
                  <Truck className="w-5 h-5 text-emerald-400 mb-1" />
                  <p className="text-xs font-bold text-white">Harvest to Home</p>
                  <p className="text-[11px] text-slate-400">Within 24 Hours</p>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-xs border border-slate-800 rounded-xl p-3 text-left">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
                  <p className="text-xs font-bold text-white">100% Direct</p>
                  <p className="text-[11px] text-slate-400">Zero Commissions</p>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-xs border border-slate-800 rounded-xl p-3 text-left">
                  <Users className="w-5 h-5 text-emerald-400 mb-1" />
                  <p className="text-xs font-bold text-white">50+ Farmers</p>
                  <p className="text-[11px] text-slate-400">Kochi & Thrissur</p>
                </div>
              </div>
            </div>

            {/* Quick Hero Farm Card Highlight */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Today's Special Harvest
                  </span>
                  <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full">
                    Fresh Morning Pick
                  </span>
                </div>
                <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80"
                    alt="Tomato"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-white">Organic Red Tomatoes</h4>
                    <p className="text-xs text-emerald-300">By Green Valley Farm, Kochi</p>
                    <p className="text-sm font-black text-amber-400 mt-1">₹30 / kg</p>
                  </div>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-slate-800/80">
                  🌱 "We harvested over 500 kg of fresh vine tomatoes this morning. Thank you for supporting our farm directly!"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Search & Filter Header Container */}
        <div className="bg-slate-900/95 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-800 mb-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search input with badge */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products (e.g. Tomato, Carrot), farmers (Sunrise Farm), or cities (Palakkad)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 border border-slate-700 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/20 transition-all"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded-full"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-300">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-bold text-emerald-400 focus:outline-hidden cursor-pointer"
                >
                  <option value="featured" className="bg-slate-900 text-white">Featured / Newest</option>
                  <option value="price-asc" className="bg-slate-900 text-white">Price: Low to High</option>
                  <option value="price-desc" className="bg-slate-900 text-white">Price: High to Low</option>
                  <option value="availability" className="bg-slate-900 text-white">Highest Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat === 'All' ? '🌱 All Fresh Produce' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Active Filter Badge */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">Available Farm Products</h2>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} items
            </span>
          </div>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                onSearchChange('');
                setSelectedCategory('All');
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-12 text-center max-w-lg mx-auto shadow-xl">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No farm products found</h3>
            <p className="text-sm text-slate-400 mb-6">
              We couldn't find anything matching "{searchQuery}". Try searching for Tomato, Potato, or Carrot.
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/30"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onViewProduct(product.id)}
                className="group bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Product Image Container */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Organic / Fresh badge */}
                  {product.organic && (
                    <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-md">
                      <Sprout className="w-3 h-3" />
                      <span>Organic</span>
                    </div>
                  )}

                  {/* Stock Availability Tag */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/85 text-slate-100 text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{product.available} {product.unit} left</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Title & Price Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {product.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-emerald-400 font-mono">₹{product.price}</span>
                        <span className="text-xs font-semibold text-slate-400">/{product.unit}</span>
                      </div>
                    </div>

                    {/* Farmer & Location Badge */}
                    <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{product.farmer}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{product.location}, Kerala</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProduct(product.id);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-950/80 text-emerald-300 font-bold text-xs hover:bg-emerald-900/90 transition-colors flex items-center justify-center gap-1.5 border border-emerald-500/40"
                    >
                      <span>View Product</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
                        addedAnimationId === product.id
                          ? 'bg-emerald-500 text-slate-950 scale-105'
                          : 'bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white'
                      }`}
                      title="Quick Add 1kg to cart"
                      aria-label="Add to cart"
                    >
                      {addedAnimationId === product.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
