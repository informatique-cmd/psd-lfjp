import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import { computeAxisProgressRate, type PsdAxisOverview } from '@/data/psdAxesData';

export const PsdAxisIndicatorsSection: React.FC<{ axis: PsdAxisOverview }> = ({ axis }) => {
  const progress = React.useMemo(() => computeAxisProgressRate(axis), [axis]);

  const chartData = React.useMemo(
    () =>
      (axis.indicators || []).map((ind) => ({
        name: ind.name.length > 26 ? `${ind.name.slice(0, 24)}…` : ind.name,
        fullName: ind.name,
        actuel: Number(ind.currentRate) || 0,
        cible: Number(ind.targetRate) || 100,
      })),
    [axis.indicators]
  );

  const statusColor = (status: string) => {
    switch (status) {
      case 'Objectif atteint':
        return 'bg-emerald-100 text-emerald-800';
      case 'Avancé':
        return 'bg-blue-100 text-blue-800';
      case 'En cours':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">
            Suivi chiffré & Avancement de l&apos;axe
          </h4>
          <p className="text-sm text-slate-600">
            Progression moyenne vers les objectifs cibles 2030 et enveloppe budgétaire associée.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-blue-50 px-4 py-2 text-right">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-blue-700">
              Budget estimé
            </span>
            <span className="text-lg font-bold text-french-blue">
              {axis.budgetMillions} M FCFA
            </span>
          </div>
          <div className="rounded-xl bg-emerald-50 px-4 py-2 text-right">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              Avancement
            </span>
            <span className="text-lg font-bold text-emerald-700">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Progression globale des indicateurs</span>
          <span className="text-french-blue">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-center">
        <div className="h-[250px] w-full">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 text-xs text-slate-500">
              Aucune donnée à afficher
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 16, left: -12, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={54} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    name === 'actuel' ? 'Niveau actuel' : 'Objectif 2030',
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="actuel" name="Niveau actuel (%)" fill="#005BAC" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cible" name="Objectif 2030 (%)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-2.5">
          {(axis.indicators || []).length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-center text-xs text-slate-500 italic">
              Aucun indicateur chiffré renseigné pour cet axe.
            </div>
          ) : (
            (axis.indicators || []).map((ind, idx) => (
              <div
                key={`${ind.name}-${idx}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{ind.name}</p>
                  <span className={`inline-block mt-1 rounded px-2 py-0.5 text-[10px] font-bold ${statusColor(ind.status)}`}>
                    {ind.status}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-french-blue">
                    {ind.currentRate}
                    {ind.unit}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    Cible : {ind.targetRate}
                    {ind.unit}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PsdAxisIndicatorsSection;
