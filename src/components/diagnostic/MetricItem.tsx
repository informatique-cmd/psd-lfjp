
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
  const isNumber = typeof value === 'number';
  
  // For inverse metrics (like negative indicators), down is good, up is bad
  const trendIsPositive = inverse 
    ? (trend === 'down')
    : (trend === 'up');
  
  const trendColor = trendIsPositive ? 'text-green-600' : 'text-red-600';
  const progressColor = isNumber 
    ? (inverse 
      ? (trend === 'up' ? 'bg-red-100' : 'bg-green-100')
      : (value < (average || 70) ? 'bg-red-100' : 'bg-green-100')
    )
    : '';

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 items-center">
        <div className="text-sm font-medium">{name}</div>
        <div className="flex items-center">
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
              {value}
            </span>
          )}
        </div>
      </div>
      
      {isNumber && (
        <>
          <Progress 
            value={value} 
            className={`h-2 ${progressColor}`}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{label}</span>
            {average && <span>Moyenne : {average}%</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default MetricItem;
