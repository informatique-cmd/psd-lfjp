
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface MetricItemProps {
  name: string;
  value: number | string;
  label?: string;
  average?: number;
  trend?: 'up' | 'down';
  inverse?: boolean;
}

const MetricItem = ({ 
  name, 
  value, 
  label, 
  average, 
  trend,
  inverse = false
}: MetricItemProps) => {
  const isNumber = typeof value === 'number' && Number.isFinite(value);
  const clampedValue = isNumber ? Math.min(100, Math.max(0, value)) : 0;
  const hasAverage = typeof average === 'number' && Number.isFinite(average);
  const safeName = typeof name === 'string' ? name : String(name ?? '');
  const safeLabel = typeof label === 'string' ? label : String(label ?? '');
  const safeDisplayText = typeof value === 'string' ? value : isNumber ? `${value}` : '0';

  // For inverse metrics (like negative indicators), down is good, up is bad
  const trendIsPositive = inverse 
    ? (trend === 'down')
    : (trend === 'up');
  
  const trendColor = trendIsPositive ? 'text-green-600' : 'text-red-600';
  const progressColor = isNumber 
    ? (inverse 
      ? (trend === 'up' ? 'bg-red-100' : 'bg-green-100')
      : (clampedValue < (hasAverage ? average : 70) ? 'bg-red-100' : 'bg-green-100')
    )
    : '';

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 items-center gap-2">
        <div className="text-sm font-medium">{safeName}</div>
        <div className="flex items-center shrink-0">
          {isNumber ? (
            <>
              <span className={`text-sm font-semibold ${trendColor}`}>
                {value}% 
              </span>
              {trend === 'up' ? 
                <ThumbsUp className={`h-4 w-4 ${inverse ? 'text-red-600' : 'text-green-600'} ml-1`} /> : 
                <ThumbsDown className={`h-4 w-4 ${inverse ? 'text-green-600' : 'text-red-600'} ml-1`} />
              }
            </>
          ) : (
            <span className={`text-sm font-semibold ${trendColor}`}>
              {safeDisplayText}
            </span>
          )}
        </div>
      </div>
      
      {isNumber && (
        <>
          <Progress 
            value={clampedValue} 
            className={`h-2 ${progressColor}`}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{safeLabel}</span>
            {hasAverage && <span>Moyenne : {average}%</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default MetricItem;
