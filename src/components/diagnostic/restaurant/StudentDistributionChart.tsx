
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

interface StudentDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

const StudentDistributionChart: React.FC<StudentDistributionChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-french-blue/10 shadow-md h-full">
      <h3 className="text-lg font-medium text-french-blue mb-4">Répartition des enfants par niveau</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-2 border rounded shadow-sm">
                  <p className="text-sm">{`${payload[0].name}: ${payload[0].value} élèves (${payload[0].payload.percentage}%)`}</p>
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

export default StudentDistributionChart;
