
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart4 } from "lucide-react";
import MetricItem from './MetricItem';
import AlertItem from './AlertItem';

interface Metric {
  name: string;
  value: number | string;
  label?: string;
  average?: number;
  trend?: 'up' | 'down';
}

interface MetricCardProps {
  title: string;
  primary: Metric[];
  secondary: Metric[];
  inverse?: boolean;
}

const MetricCard = ({ title, primary, secondary, inverse = false }: MetricCardProps) => {
  return (
    <Card className="border-french-blue/10 shadow-md h-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b pb-3">
        <CardTitle className="text-lg text-french-blue flex items-center">
          <BarChart4 className="mr-2 h-5 w-5" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {primary.map((item, idx) => (
          <MetricItem 
            key={`p-${idx}`}
            name={item.name}
            value={item.value}
            label={item.label}
            average={item.average}
            trend={item.trend}
            inverse={inverse}
          />
        ))}
        
        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Points d'attention</h4>
          {secondary.map((item, idx) => (
            <AlertItem 
              key={`s-${idx}`}
              name={item.name}
              value={item.value}
              label={item.label}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
