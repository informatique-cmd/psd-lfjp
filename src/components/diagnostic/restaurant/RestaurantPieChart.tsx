
import React from 'react';
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { sanitizeNumberOrFallback } from '@/lib/pageDataSanitizer';

interface PieChartData {
  name: string;
  value: number;
}

interface RestaurantPieChartProps {
  title: string;
  data: PieChartData[];
  colors: string[];
}

const RestaurantPieChart: React.FC<RestaurantPieChartProps> = ({ title, data = [], colors = ['#0055A4', '#EF4135', '#00A86B', '#F59E0B'] }) => {
  const safeData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        name: typeof item.name === 'string' && item.name.trim() !== '' ? item.name : String(item.name ?? 'Catégorie'),
        value: Math.max(0, sanitizeNumberOrFallback(item.value, 0)),
      }));
  }, [data]);

  const totalValue = safeData.reduce((sum, item) => sum + item.value, 0);
  const safeColors = Array.isArray(colors) && colors.length > 0 ? colors : ['#0055A4', '#EF4135', '#00A86B', '#F59E0B'];

  return (
    <div className="bg-white p-4 rounded-lg border border-french-blue/10 shadow-md">
      <h3 className="text-lg font-medium text-french-blue mb-4">{title}</h3>
      {safeData.length === 0 || totalValue <= 0 ? (
        <div className="h-[300px] flex items-center justify-center text-sm text-slate-500 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
          Aucune donnée à afficher
        </div>
      ) : (
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={safeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${String(name ?? '')}: ${Number.isFinite(Number(value)) ? value : 0}%`}
              >
                {safeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={safeColors[index % safeColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${Number.isFinite(Number(value)) ? value : 0}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RestaurantPieChart;
