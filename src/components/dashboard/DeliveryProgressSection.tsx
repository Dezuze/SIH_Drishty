import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  KeyRound, 
  ChevronRight, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { LocationPoint } from '../types/dashboardTypes';

interface DeliveryProgressSectionProps {
  farm: LocationPoint;
  customers: LocationPoint[];
  simulationStep: number;
  onSimulateCompleteStop: (index: number) => void;
}

export const DeliveryProgressSection: React.FC<DeliveryProgressSectionProps> = ({
  farm,
  customers,
  simulationStep,
  onSimulateCompleteStop,
}) => {
  // Determine stop status based on simulationStep:
  // 0: At Farm
  // 1-3: En route to Stop 1 (Customer A)
  // 4: At Stop 1
  // 5-7: En route to Stop 2 (Customer B)
  // 8: At Stop 2
  // 9-11: En route to Stop 3 (Customer C)
  // 12: Completed

  const stops = [
    {
      type: 'farm',
      title: 'Haritha Farm Hub',
      subtitle: 'Dispatch & Cold Loading',
      time: '06:30 AM',
      status: simulationStep >= 0 ? 'Completed' : 'Pending',
      isCurrent: simulationStep === 0,
      weightChange: '+85 kg (Loaded)',
      location: farm.address,
      otp: null,
    },
    ...customers.map((c, idx) => {
      const stepThreshold = (idx + 1) * 4;
      const isCompleted = simulationStep >= stepThreshold;
      const isCurrent = simulationStep > (idx * 4) && simulationStep < stepThreshold;
      const isNext = simulationStep <= (idx * 4);

      return {
        type: 'customer',
        title: `Stop #${idx + 1}: ${c.name.split(' - ')[1] || c.name}`,
        subtitle: `${c.weightKg} kg ΓÇó ${c.produceItems?.[0]?.name || 'Produce'}`,
        time: c.expectedDelivery,
        status: isCompleted ? 'Delivered' : isCurrent ? 'In Transit' : 'Scheduled',
        isCurrent: isCurrent,
        weightChange: `-${c.weightKg} kg`,
        location: c.address,
        otp: c.otp,
        customerIndex: idx,
      };
    }),
  ];

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
      
      {/* Header with Route Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white tracking-tight">
              Delivery Progress & Stop Timeline
            </h3>
            <p className="text-xs text-slate-400">
              Farm Hub ΓåÆ Stop 1 (Anita) ΓåÆ Stop 2 (Rajesh) ΓåÆ Stop 3 (Deepa)
            </p>
          </div>
        </div>

        {/* Route Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            simulationStep >= 12
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              : simulationStep > 0
              ? 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
              : 'bg-teal-950 text-teal-300 border border-teal-500/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${simulationStep >= 12 ? 'bg-emerald-400' : simulationStep > 0 ? 'bg-amber-400' : 'bg-teal-400'}`} />
            {simulationStep >= 12 ? 'All Stops Completed' : simulationStep > 0 ? 'Driver En Route' : 'Ready for Dispatch'}
          </span>
        </div>
      </div>

      {/* Interactive Timeline Steps */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {stops.map((stop, idx) => {
          const isDone = stop.status === 'Completed' || stop.status === 'Delivered';
          const isInTransit = stop.status === 'In Transit';

          return (
            <div
              key={idx}
              className={`relative p-3.5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/30 border-emerald-500/50'
                  : isInTransit
                  ? 'bg-amber-950/30 border-amber-500/60 ring-2 ring-amber-500/20 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isDone 
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30' 
                    : isInTransit 
                    ? 'bg-amber-900/80 text-amber-300 border border-amber-500/40' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx === 0 ? 'ORIGIN' : `STOP 0${idx}`}
                </span>
                
                <span className="text-xs font-mono text-slate-400 font-semibold">
                  {stop.time}
                </span>
              </div>

              <h4 className="font-bold text-sm text-white line-clamp-1">{stop.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{stop.subtitle}</p>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className={`font-mono font-bold text-[11px] ${idx === 0 ? 'text-teal-400' : 'text-amber-400'}`}>
                  {stop.weightChange}
                </span>

                {stop.otp && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                    OTP: {stop.otp}
                  </span>
                )}
              </div>

              {/* Status footer button */}
              <div className="mt-2.5">
                {isDone ? (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{idx === 0 ? 'Dispatched' : 'Delivered & Signed'}</span>
                  </div>
                ) : isInTransit ? (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Approaching Customer</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400">
                    Awaiting arrival
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

