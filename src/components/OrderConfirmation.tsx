import React from 'react';
import { useCart } from '../context/CartContext';
import { 
  CheckCircle2, 
  ShoppingBag, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Printer, 
  Sparkles, 
  Phone, 
  User, 
  HeartHandshake,
  Truck
} from 'lucide-react';

interface OrderConfirmationProps {
  onNavigate: (view: 'marketplace' | 'details' | 'cart' | 'checkout' | 'confirmation' | 'logistics') => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ onNavigate }) => {
  const { lastOrder } = useCart();

  if (!lastOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100">
        <h2 className="text-xl font-bold text-white mb-2">No Recent Order Found</h2>
        <p className="text-slate-400 text-sm mb-6">Looks like you haven't placed an order yet in this session.</p>
        <button
          onClick={() => onNavigate('marketplace')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm cursor-pointer"
        >
          Explore Marketplace
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Success Header Banner */}
        <div className="bg-slate-900/90 rounded-3xl border border-emerald-500/40 p-8 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-3">
            <div className="w-20 h-20 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>DIRECT FARM DISPATCH CONFIRMED</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Order Confirmed!
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto">
              Thank you, <strong className="text-white">{lastOrder.customer.fullName}</strong>! Your order has been transmitted directly to our partner farms.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="bg-slate-950 border border-slate-800 text-slate-300 font-bold px-3 py-1 rounded-lg">
                Order ID: <span className="text-emerald-400 font-mono font-black">{lastOrder.orderId}</span>
              </span>
              <span className="bg-slate-950 border border-slate-800 text-slate-400 px-3 py-1 rounded-lg">
                Date: {lastOrder.createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* Farmer Appreciation & Tracking Card */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Direct Farmer Connection
              </span>
            </div>
            <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              Fresh Packing
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              {lastOrder.allFarmers.length === 1
                ? lastOrder.allFarmers[0]
                : lastOrder.allFarmers.join(', ')}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              🌱 Our local growers in {lastOrder.customer.city} & nearby districts are currently handpicking and packing your items with natural protective wrapping.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-white">Estimated Delivery Time</p>
                <p className="text-slate-300">{lastOrder.estimatedDelivery}</p>
              </div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-white">Payment Status</p>
                <p className="text-slate-300">
                  {lastOrder.customer.paymentMethod === 'cod'
                    ? `Pay ₹${lastOrder.grandTotal} on Delivery`
                    : `₹${lastOrder.grandTotal} Paid (Online Demo)`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items Breakdown */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-black text-white">Ordered Produce</h2>
            <span className="text-xs font-bold text-slate-400">
              {lastOrder.items.length} items
            </span>
          </div>

          <div className="space-y-4 divide-y divide-slate-800">
            {lastOrder.items.map(({ product, quantity }) => (
              <div key={product.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{product.name}</h4>
                    <p className="text-xs text-slate-400">
                      Farmer: <span className="font-semibold text-emerald-400">{product.farmer}</span> ({product.location})
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Quantity: <strong className="text-white">{quantity} {product.unit}</strong> @ ₹{product.price}/{product.unit}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-emerald-400 font-mono">
                    ₹{quantity * product.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Recap */}
          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Produce Subtotal</span>
              <span className="font-bold text-white font-mono">₹{lastOrder.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Delivery Fee</span>
              <span className="font-bold text-white font-mono">
                {lastOrder.deliveryFee === 0 ? 'FREE' : `₹${lastOrder.deliveryFee}`}
              </span>
            </div>
            {lastOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold font-mono">
                <span>Discount Applied</span>
                <span>-₹{lastOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-emerald-400 font-mono pt-2 border-t border-slate-800">
              <span>Total Amount</span>
              <span>₹{lastOrder.grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Summary Card */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4 backdrop-blur-md">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Delivery Destination
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="space-y-1">
              <p className="text-slate-500 font-bold uppercase text-[10px]">Recipient</p>
              <p className="font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" /> {lastOrder.customer.fullName}
              </p>
              <p className="text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> {lastOrder.customer.phoneNumber}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 font-bold uppercase text-[10px]">Address</p>
              <p className="font-medium text-slate-300 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                <span>{lastOrder.customer.address}, {lastOrder.customer.city} - {lastOrder.customer.pincode}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Actions Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={() => onNavigate('logistics')}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>View in Route AI</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate('marketplace')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
