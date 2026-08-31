import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Zap, 
  Truck, 
  Layers, 
  ThermometerSnowflake, 
  Clock, 
  Radio 
} from 'lucide-react';
import { ActivityEvent } from '../types/dashboardTypes';

interface RecentActivityPanelProps {
  activities: ActivityEvent[];
}

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({ activities }) => {
  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'route':
        return <Zap className="w-3.5 h-3.5 text-emerald-400" />;
      case 'order':
        return <Layers className="w-3.5 h-3.5 text-blue-400" />;
      case 'telematics':
        return <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-400" />;
      case 'dispatch':
        return <Truck className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Recent Logistics Activity
              </h3>
              <p className="text-xs text-slate-400">
                Automated Real-Time Telemetry & Dispatch Stream
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-950 text-slate-300 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Feed
          </span>
        </div>

        {/* Activity Stream */}
        <div className="my-3.5 space-y-3">
          {activities.map((item) => (
            <div 
              key={item.id}
              className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                    {getEventIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 block">{item.timestamp}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-900 text-emerald-400 border border-emerald-500/30 inline-block mt-1">
                    {item.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          Subscribed to WebSocket Stream
        </span>
        <span className="text-slate-400">4 Events Logged</span>
      </div>

    </div>
  );
};

