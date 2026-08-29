import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileCheck, 
  Truck, 
  MapPin, 
  QrCode, 
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { LocationPoint, RouteMetrics, VehicleInfo, ClusterInfo } from '../types';

interface ManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: LocationPoint;
  customers: LocationPoint[];
  metrics: RouteMetrics;
  vehicle: VehicleInfo;
  cluster: ClusterInfo;
}

export const ManifestModal: React.FC<ManifestModalProps> = ({
  isOpen,
  onClose,
  farm,
  customers,
  metrics,
  vehicle,
  cluster,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Official Digital Dispatch Waybill & Manifest
              </h3>
              <p className="text-xs text-slate-400">
                Manifest Ref: <span className="font-mono text-emerald-400 font-bold">MF-SIH-2026-0829</span> • Trivandrum Corridor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Manifest Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* Header Manifest Summary Table */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Aggregation Origin</span>
              <span className="font-bold text-white text-xs">{farm.name}</span>
              <span className="text-[11px] text-emerald-400 font-mono block">GPS: 8.5241, 76.9366</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Vehicle</span>
              <span className="font-bold text-white text-xs">{vehicle.model}</span>
              <span className="text-[11px] text-amber-400 font-mono block">{vehicle.regNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Driver Pilot</span>
              <span className="font-bold text-white text-xs">{vehicle.driverName}</span>
              <span className="text-[11px] text-teal-400 font-mono block">{vehicle.driverPhone}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Cold Storage Status</span>
              <span className="font-bold text-cyan-300 text-xs">Reefer Active 4.2°C</span>
              <span className="text-[11px] text-slate-400 block">Payload: {metrics.currentPayloadKg} / {metrics.vehicleCapacityKg} kg</span>
            </div>
          </div>

          {/* Stop-by-Stop Manifest Table */}
          <div>
            <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Delivery Sequence & Customer OTP Handover Details
            </h4>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
                    <th className="p-3">Stop #</th>
                    <th className="p-3">Customer & Order ID</th>
                    <th className="p-3">Produce Basket Items</th>
                    <th className="p-3">Weight</th>
                    <th className="p-3">Delivery Window</th>
                    <th className="p-3">Security OTP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/40 text-xs">
                  {customers.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-3 font-bold text-emerald-400 font-mono">
                        0{idx + 1}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-white">{c.name}</div>
                        <div className="text-[11px] text-slate-400">{c.phone}</div>
                        <div className="text-[10px] font-mono text-teal-300">{c.orderId}</div>
                      </td>
                      <td className="p-3">
                        <ul className="space-y-0.5 text-[11px]">
                          {c.produceItems?.map((it, i) => (
                            <li key={i} className="text-slate-300">
                              • {it.name} <span className="text-emerald-400 font-mono">({it.quantity})</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-3 font-mono font-bold text-amber-400">
                        {c.weightKg} kg
                      </td>
                      <td className="p-3 text-slate-300">
                        {c.deliveryWindow}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded bg-slate-900 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                          {c.otp}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compliance & Signature section */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white p-1 rounded-xl flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-950" />
              </div>
              <div>
                <p className="font-bold text-xs text-white">Government Agri Logistics Compliance</p>
                <p className="text-[11px] text-slate-400">Digitally signed & time-stamped for SIH 2026 Smart India Prototype.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-center">
              <div>
                <div className="w-28 border-b border-slate-700 pb-1 text-[10px] text-slate-400 font-mono">
                  Rajesh Kumar M.
                </div>
                <span className="text-[9px] text-slate-400 uppercase">Driver Pilot Sign</span>
              </div>
              <div>
                <div className="w-28 border-b border-slate-700 pb-1 text-[10px] text-emerald-400 font-mono font-bold">
                  VERIFIED & SEALED
                </div>
                <span className="text-[9px] text-slate-400 uppercase">Hub Gate Officer</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            AgriRoute AI Logistics Platform • Smart Logistics & Route Optimization
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
          >
            Close Manifest
          </button>
        </div>

      </div>
    </div>
  );
};
