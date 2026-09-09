import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  MapPin, 
  Package, 
  Weight, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LocationPoint } from '../../types/dashboardTypes';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (newOrder: LocationPoint) => void;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({
  isOpen,
  onClose,
  onAddOrder,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('Customer D - Karthik Menon');
  const [address, setAddress] = useState('Flat 102, Skyline Imperial, Vazhuthacaud, Trivandrum');
  const [phone, setPhone] = useState('+91 98475 66210');
  const [produceName, setProduceName] = useState('Fresh Organic Strawberries & Herbs');
  const [weightKg, setWeightKg] = useState<number>(20);
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLocation: LocationPoint = {
      id: `cust-${Date.now()}`,
      name: customerName,
      type: 'customer',
      lat: 8.5480,
      lng: 76.9600,
      address: address,
      contactPerson: customerName.split(' - ')[1] || customerName,
      phone: phone,
      orderId: `ORD-AGR-${Math.floor(1000 + Math.random() * 9000)}`,
      produceItems: [
        {
          name: produceName,
          quantity: `${weightKg} kg pack`,
          weightKg: weightKg,
          farmSource: 'Munnar Organic Berries Coop',
          category: 'Perishable',
        },
      ],
      weightKg: weightKg,
      priority: priority,
      expectedDelivery: '08:05 AM',
      status: 'Pending',
      deliveryWindow: '08:00 AM - 08:30 AM',
      otp: `${Math.floor(1000 + Math.random() * 9000)}`,
      sequenceNumber: 4,
    };

    onAddOrder(newLocation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Simulate New Consumer Order
              </h3>
              <p className="text-xs text-slate-400">
                Demonstrates Dynamic Spatial Clustering & Capacity Re-Optimization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Customer Name & ID</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Delivery Address (Trivandrum Corridor)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Order Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-400 focus:outline-none"
              >
                <option value="High">High (Perishable Produce)</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Produce Name</label>
              <input
                type="text"
                value={produceName}
                onChange={(e) => setProduceName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Weight (kg)</label>
              <input
                type="number"
                min={1}
                max={50}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-emerald-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Real-time Capacity Preview */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              New Payload Capacity Impact:
            </span>
            <span className="font-mono font-bold text-white">
              85 kg + {weightKg} kg = <strong className="text-emerald-400">{85 + weightKg} / 150 kg</strong> (OK)
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition"
            >
              Add Order & Auto-Cluster
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

