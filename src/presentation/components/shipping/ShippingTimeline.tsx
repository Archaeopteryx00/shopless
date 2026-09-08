'use client';

import React from 'react';
import { SHIPPING_STAGES, ShippingStatusResult } from '@/services/ShippingCalculator';
import { CheckCircle2, Clock, Truck, Package, MapPin, Check } from 'lucide-react';

interface ShippingTimelineProps {
  status: ShippingStatusResult;
}

export function ShippingTimeline({ status }: ShippingTimelineProps) {
  const { stageIndex, isDelivered, progressPercent, estimatedTimeRemainingText } = status;

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
            Shipment Tracking
          </span>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
            <Truck className="w-4 h-4 text-blue-400" />
            <span>{status.currentStage.label}</span>
          </h3>
        </div>

        <div className="text-right">
          <span className={`text-xs font-bold ${isDelivered ? 'text-emerald-400' : 'text-amber-400'}`}>
            {estimatedTimeRemainingText}
          </span>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {progressPercent}% Total Progress
          </p>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
        <div
          className={`h-full transition-all duration-700 rounded-full ${
            isDelivered
              ? 'bg-emerald-500 shadow-md shadow-emerald-500/50'
              : 'bg-gradient-to-r from-blue-600 to-indigo-500 shadow-md shadow-blue-500/30'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 8-Stage Vertical Stepper */}
      <div className="flex flex-col gap-3.5 mt-1 relative pl-2">
        {SHIPPING_STAGES.map((stage, idx) => {
          const isCompleted = idx < stageIndex || isDelivered;
          const isCurrent = idx === stageIndex && !isDelivered;
          const isUpcoming = idx > stageIndex && !isDelivered;

          return (
            <div key={stage.key} className="flex items-start gap-3 relative z-10 group">
              {/* Connector line */}
              {idx < SHIPPING_STAGES.length - 1 && (
                <div
                  className={`absolute left-[13px] top-[24px] w-[2px] h-[calc(100%+6px)] -z-10 ${
                    isCompleted ? 'bg-emerald-500/60' : 'bg-slate-800'
                  }`}
                />
              )}

              {/* Icon badge */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : isCurrent
                    ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/40 scale-110 animate-pulse'
                    : 'bg-slate-800/80 text-slate-500 border border-slate-700/60'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3px]" />
                ) : isCurrent ? (
                  <Truck className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[10px] font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Stage Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-semibold ${
                      isCompleted
                        ? 'text-slate-200'
                        : isCurrent
                        ? 'text-blue-400 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {stage.minHours}h timeline
                  </span>
                </div>
                <p
                  className={`text-[11px] mt-0.5 leading-snug ${
                    isCurrent ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
