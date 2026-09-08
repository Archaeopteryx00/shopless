'use client';

import React from 'react';
import { SHIPPING_STAGES, ShippingStatusResult } from '@/services/ShippingCalculator';
import { Truck, Check } from 'lucide-react';

interface ShippingTimelineProps {
  status: ShippingStatusResult;
}

export function ShippingTimeline({ status }: ShippingTimelineProps) {
  const { stageIndex, isDelivered, progressPercent, estimatedTimeRemainingText } = status;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600">
            Lacak Pesanan
          </span>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>{status.currentStage.label}</span>
          </h3>
        </div>

        <div className="text-right">
          <span className={`text-xs font-bold ${isDelivered ? 'text-emerald-600' : 'text-amber-600'}`}>
            {estimatedTimeRemainingText}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Progress {progressPercent}%
          </p>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isDelivered
              ? 'bg-emerald-600'
              : 'bg-blue-600'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 8-Stage Vertical Stepper */}
      <div className="flex flex-col gap-3.5 mt-1 relative pl-2">
        {SHIPPING_STAGES.map((stage, idx) => {
          const isCompleted = idx < stageIndex || isDelivered;
          const isCurrent = idx === stageIndex && !isDelivered;

          return (
            <div key={stage.key} className="flex items-start gap-3 relative z-10 group">
              {/* Connector line */}
              {idx < SHIPPING_STAGES.length - 1 && (
                <div
                  className={`absolute left-[13px] top-[24px] w-[2px] h-[calc(100%+6px)] -z-10 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Icon badge */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-all duration-200 ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : isCurrent
                    ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-xs scale-105 animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
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
                        ? 'text-slate-800'
                        : isCurrent
                        ? 'text-blue-600 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Timeline {stage.minHours}h
                  </span>
                </div>
                <p
                  className={`text-[11px] mt-0.5 leading-snug ${
                    isCurrent ? 'text-slate-700' : 'text-slate-400'
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
