
import React from 'react';
import { AlertTriangle } from "lucide-react";

interface AlertItemProps {
  name: string;
  value: string | number;
  label?: string;
}

const AlertItem = ({ name, value, label }: AlertItemProps) => {
  const safeName = typeof name === 'string' ? name : String(name ?? 'Attention');
  const safeValue = typeof value === 'number' && !Number.isFinite(value) ? '' : String(value ?? '');
  const safeLabel = typeof label === 'string' ? label : String(label ?? '');

  return (
    <div className="flex items-start mb-2">
      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 shrink-0" />
      <div>
        <span className="text-sm font-medium">{safeName} : </span>
        <span className="text-sm">{safeValue}{safeLabel ? ` ${safeLabel}` : ''}</span>
      </div>
    </div>
  );
};

export default AlertItem;
