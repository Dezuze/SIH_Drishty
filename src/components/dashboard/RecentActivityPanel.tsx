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
import { ActivityEvent } from '../../types/dashboardTypes';

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
    <div className="rounded-3xl bg-white/90 border border-slate-200 p-5 shadow-xl flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Recent Logistics Activity
              </h3>
              <p className="text-xs text-slate-600">
                Automated Real-Time Telemetry & Dispatch Stream
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Feed
          </span>
        </div>

        {/* Activity Stream */}
        <div className="my-3.5 space-y-3">
          {activities.map((item) => (
            <div 
              key={item.id}
              className="p-3 rounded-2xl bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5">
                    {getEventIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-600 block">{item.timestamp}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white text-emerald-400 border border-emerald-500/30 inline-block mt-1">
                    {item.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          Subscribed to WebSocket Stream
        </span>
        <span className="text-slate-600">4 Events Logged</span>
      </div>

    </div>
  );
};

