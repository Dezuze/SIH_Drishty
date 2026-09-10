import React from 'react';
import { 
  Truck, 
  BatteryCharging, 
  ThermometerSnowflake, 
  UserCheck, 
  Star, 
  Phone, 
  ShieldCheck, 
  Gauge,
  Zap,
  Radio
} from 'lucide-react';
import { VehicleInfo } from '../../types/dashboardTypes';

interface VehicleInfoCardProps {
  vehicle: VehicleInfo;
  isSimulating: boolean;
}

export const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ 
  vehicle,
  isSimulating 
}) => {
  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  {vehicle.model}
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Reg: <span className="text-slate-200 font-bold">{vehicle.regNumber}</span>
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Active EV
          </span>
        </div>

        {/* Driver Profile */}
        <div className="my-3.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-slate-950 ring-2 ring-emerald-400/40">
              RK
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-white">{vehicle.driverName}</h4>
                <div className="flex items-center text-amber-400 text-xs font-bold">
                  <Star className="w-3 h-3 fill-current ml-0.5" />
                  <span className="ml-0.5">{vehicle.driverRating}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">Certified Cold-Chain Agri Pilot</p>
            </div>
          </div>

          <a 
            href={`tel:${vehicle.driverPhone}`}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 transition"
            title="Call Driver"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Telematics Grid: Battery & Cold-Chain Reefer */}
        <div className="grid grid-cols-2 gap-2.5">
          
          {/* Battery Status */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                EV Battery
              </span>
              <span className="text-emerald-400 font-bold font-mono">{vehicle.batteryPercent}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 p-0.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${vehicle.batteryPercent}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Est. 112 km Range Left</span>
          </div>

          {/* Reefer Cold-Chain Temp */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-400" />
                Reefer Temp
              </span>
              <span className="text-cyan-300 font-bold font-mono">{vehicle.storageTempCelsius}-�C</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 p-0.5 overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full w-3/4" />
            </div>
            <span className="text-[10px] text-cyan-400 font-medium mt-1 block">Target: {vehicle.targetTempCelsius}-�C (Optimal)</span>
          </div>

        </div>
      </div>

      {/* Speed & Real-time Telematics */}
      <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Gauge className="w-3.5 h-3.5 text-teal-400" />
          Speed: <strong className="text-white font-mono">{isSimulating ? '38 km/h' : '0 km/h (At Depot)'}</strong>
        </span>
        <span className="text-emerald-400 font-medium">IoT Sensor Sync OK</span>
      </div>

    </div>
  );
};

