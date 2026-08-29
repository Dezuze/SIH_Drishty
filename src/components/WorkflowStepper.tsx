import React from 'react';
import { Package, Layers, MapPin, Route, Check } from 'lucide-react';

export type WorkflowStep = 1 | 2 | 3 | 4;

interface WorkflowStepperProps {
  currentStep: WorkflowStep;
  onSelectStep: (step: WorkflowStep) => void;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStep,
  onSelectStep,
}) => {
  const steps = [
    {
      number: 1 as WorkflowStep,
      title: 'Orders',
      icon: Package,
    },
    {
      number: 2 as WorkflowStep,
      title: 'Group Nearby Orders',
      icon: Layers,
    },
    {
      number: 3 as WorkflowStep,
      title: 'Show Locations on Map',
      icon: MapPin,
    },
    {
      number: 4 as WorkflowStep,
      title: 'Generate Route',
      icon: Route,
    },
  ];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-md">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <button
              key={step.number}
              onClick={() => onSelectStep(step.number)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/30'
                  : isCompleted
                  ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-slate-950/30 border-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500 text-slate-950 font-extrabold'
                    : isActive
                    ? 'bg-emerald-400 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className={`text-xs font-semibold truncate ${isActive ? 'text-emerald-300' : ''}`}>
                    {step.title}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

