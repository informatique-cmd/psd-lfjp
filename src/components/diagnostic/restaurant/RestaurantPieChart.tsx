
import React from 'react';
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

interface PieChartData {
  name: string;
  value: number;
}

interface RestaurantPieChartProps {
  title: string;
  data: PieChartData[];
  colors: string[];
}

const RestaurantPieChart: React.FC<RestaurantPieChartProps> = ({ title, data, colors }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-french-blue/10 shadow-md">
      <h3 className="text-lg font-medium text-french-blue mb-4">{title}</h3>
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RestaurantPieChart;
