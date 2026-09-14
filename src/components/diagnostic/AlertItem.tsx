
import React from 'react';
import { AlertTriangle } from "lucide-react";

interface AlertItemProps {
  name: string;
  value: string | number;
  label?: string;
}

const AlertItem = ({ name, value, label }: AlertItemProps) => {
  return (
    <div className="flex items-start mb-2">
      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
      <div>
        <span className="text-sm font-medium">{name} : </span>
        <span className="text-sm">{value}{label && ` ${label}`}</span>
      </div>
    </div>
  );
};

export default AlertItem;
