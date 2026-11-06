
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  percentage?: number;
}

interface VerticalBarChartProps {
  title: string;
  data: ChartData[];
}

const VerticalBarChart: React.FC<VerticalBarChartProps> = ({ title, data }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-french-blue/10 shadow-md">
      <h3 className="text-lg font-medium text-french-blue mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-2 border rounded shadow-sm">
                  <p className="text-sm">
                    {`${payload[0].name}: ${payload[0].value} réponses${
                      payload[0].payload.percentage ? ` (${payload[0].payload.percentage}%)` : ''
                    }`}
                  </p>
                </div>
              );
            }
            return null;
          }} />
          <Bar dataKey="value" fill="#0055A4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VerticalBarChart;
