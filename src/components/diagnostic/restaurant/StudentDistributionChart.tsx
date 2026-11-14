
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
import { sanitizeNumberOrFallback } from '@/lib/pageDataSanitizer';

interface StudentDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

const StudentDistributionChart: React.FC<StudentDistributionChartProps> = ({ data = [] }) => {
  const safeData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        name: typeof item.name === 'string' && item.name.trim() !== '' ? item.name : String(item.name ?? 'Niveau'),
        value: Math.max(0, sanitizeNumberOrFallback(item.value, 0)),
        percentage: Math.max(0, sanitizeNumberOrFallback(item.percentage, 0)),
      }));
  }, [data]);

  return (
    <div className="bg-white p-4 rounded-lg border border-french-blue/10 shadow-md h-full">
      <h3 className="text-lg font-medium text-french-blue mb-4">Répartition des enfants par niveau</h3>
      {safeData.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-sm text-slate-500 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
          Aucune donnée à afficher
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={safeData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={({ active, payload }) => {
              const first = payload?.[0];
              if (active && first) {
                const row = (first.payload || {}) as { name?: string; percentage?: number };
                const labelName = row.name ?? String(first.name ?? 'Niveau');
                const val = Number.isFinite(Number(first.value)) ? Number(first.value) : 0;
                const pct = Number.isFinite(Number(row.percentage)) ? Number(row.percentage) : 0;
                return (
                  <div className="bg-white p-2 border rounded shadow-sm">
                    <p className="text-sm">{`${labelName}: ${val} élèves (${pct}%)`}</p>
                  </div>
                );
              }
              return null;
            }} />
            <Bar dataKey="value" fill="#0055A4" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StudentDistributionChart;
