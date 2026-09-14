import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Info,
  Euro,
  PiggyBank,
} from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
} from 'recharts';
import type { LegendProps, TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// Les données sont codées en dur pour faciliter les ajustements futurs.
// Vous pouvez modifier les montants, années ou pourcentages directement dans
// les tableaux ci-dessous afin d'actualiser la page sans toucher à la logique.

const XOF_TO_EUR = 655.957;

const formatCurrency = (value: number, currency: 'XOF' | 'EUR') =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(currency === 'XOF' ? value : value / XOF_TO_EUR);

type Project = {
  title: string;
  description: string;
  period: string;
  budget: number;
  color: string;
  link?: string;
};

type CashFlowYear = {
  year: number;
  capacite: number;
  leviers: number;
  recettesTotales: number;
  depenses: number;
};

const summaryCards = [
  {
    label: 'Investissement total',
    value: 775_000_000,
    icon: PiggyBank,
    accent: 'from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-100',
  },
  {
    label: 'Manque à gagner / besoin de financement à l’horizon 2030',
    value: 89_860_582,
    icon: AlertTriangle,
    accent: 'from-rose-50 to-amber-50 text-amber-700 border-amber-100',
  },
  {
    label: 'Capacité totale estimée (budget + ANEFE + écolages)',
    value: 685_139_418,
    icon: BadgeDollarSign,
    accent: 'from-sky-50 to-indigo-50 text-sky-700 border-sky-100',
  },
];

// Projets à modifier si nécessaire (montants, périodes, descriptions).
const projects: Project[] = [
  {
    title: 'Climatisation (phases 2 & 3)',
    description: 'Déploiement progressif sur les bâtiments restants',
    period: '2026 – 2027',
    budget: 60_000_000,
    color: 'from-sky-100 to-sky-50',
    link: 'https://psd-lfjp.netlify.app/climatisation-durable',
  },
  {
    title: 'Couverture terrain de sport',
    description: 'Protection solaire et confort thermique',
    period: '2026',
    budget: 75_000_000,
    color: 'from-amber-100 to-orange-50',
    link: 'https://psd-lfjp.netlify.app/couverture-terrain-sport',
  },
  {
    title: 'Solaire terrain de sport',
    description: 'Installation photovoltaïque complémentaire',
    period: '2028 – 2029',
    budget: 55_000_000,
    color: 'from-emerald-100 to-emerald-50',
  },
  {
    title: 'Piscine',
    description: 'Réhabilitation et sécurisation du bassin',
    period: '2028 – 2029',
    budget: 125_000_000,
    color: 'from-sky-100 to-blue-50',
  },
  {
    title: 'Restauration scolaire',
    description: 'Montée en charge cuisine & self-service',
    period: '2027 – 2029',
    budget: 200_000_000,
    color: 'from-orange-100 to-amber-50',
    link: 'https://psd-lfjp.netlify.app/construction-cantine',
  },
  {
    title: 'Acquisition terrain',
    description: 'Réserve foncière pour extensions futures',
    period: '2026 – 2027',
    budget: 60_000_000,
    color: 'from-lime-100 to-emerald-50',
  },
  {
    title: 'Projet d’extension phase 1',
    description: 'Création de nouvelles surfaces pédagogiques',
    period: '2030',
    budget: 200_000_000,
    color: 'from-indigo-100 to-indigo-50',
  },
];

// Flux de trésorerie prévisionnels (adapter montants/années si besoin).
const financialTimeline: CashFlowYear[] = [
  { year: 2026, capacite: 43_000_000, leviers: 64_969_911, recettesTotales: 107_969_911, depenses: 135_000_000 },
  { year: 2027, capacite: 37_000_000, leviers: 70_042_377, recettesTotales: 107_042_377, depenses: 126_666_667 },
  { year: 2028, capacite: 62_000_000, leviers: 70_042_377, recettesTotales: 132_042_377, depenses: 156_666_667 },
  { year: 2029, capacite: 54_000_001, leviers: 70_042_377, recettesTotales: 124_042_378, depenses: 156_666_667 },
  { year: 2030, capacite: 54_000_000, leviers: 70_042_377, recettesTotales: 124_042_377, depenses: 200_000_000 },
];

const tuitionBaseRevenue = 1_203_146_500;

const tuitionSimulations = [
  { year: 2026, increase: 5.4, revenue: 64_969_911 },
  { year: 2027, increase: 0.4, revenue: 70_042_377 },
  { year: 2028, increase: 0, revenue: 70_042_377 },
  { year: 2029, increase: 0, revenue: 70_042_377 },
  { year: 2030, increase: 0, revenue: 70_042_377 },
];

const projectSchedule = [
  { project: 'Climatisation (phases 2 & 3)', start: 2026, end: 2027, annualSpend: { 2026: 30_000_000, 2027: 30_000_000 } },
  { project: 'Couverture terrain de sport', start: 2026, end: 2026, annualSpend: { 2026: 75_000_000 } },
  { project: 'Solaire terrain de sport', start: 2028, end: 2029, annualSpend: { 2028: 27_500_000, 2029: 27_500_000 } },
  { project: 'Piscine', start: 2028, end: 2029, annualSpend: { 2028: 62_500_000, 2029: 62_500_000 } },
  { project: 'Restauration scolaire', start: 2027, end: 2029, annualSpend: { 2027: 66_666_667, 2028: 66_666_667, 2029: 66_666_666 } },
  { project: 'Acquisition terrain', start: 2026, end: 2027, annualSpend: { 2026: 30_000_000, 2027: 30_000_000 } },
  { project: 'Projet d’extension phase 1', start: 2030, end: 2030, annualSpend: { 2030: 200_000_000 } },
];

const years = [2026, 2027, 2028, 2029, 2030];

const getPeriodStartYear = (period: string) => Number(period.match(/\d{4}/)?.[0] ?? 0);

const BudgetCadreVieInfrastructures = () => {
  const [currency, setCurrency] = useState<'XOF' | 'EUR'>('XOF');
  const cumulativeTuition = 345_139_418;
  const annualTotals = [135_000_000, 126_666_667, 156_666_667, 156_666_667, 200_000_000];

  const chartData = useMemo(
    () =>
      financialTimeline.map((row) => {
        const factor = currency === 'EUR' ? 1 / XOF_TO_EUR : 1;
        return {
          ...row,
          capacite: row.capacite * factor,
          leviers: row.leviers * factor,
          recettesTotales: row.recettesTotales * factor,
          depenses: row.depenses * factor,
          solde: (row.recettesTotales - row.depenses) * factor,
        };
      }),
    [currency],
  );

  const axisTickFormatter = (value: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);

  const cashFlowRows = useMemo(
    () =>
      financialTimeline.map((row) => ({
        ...row,
        solde: row.recettesTotales - row.depenses,
      })),
    [],
  );

  const projectsByYear = useMemo(
    () => {
      const grouped = projects
        .slice()
        .sort((a, b) => getPeriodStartYear(a.period) - getPeriodStartYear(b.period))
        .reduce<Record<number, Project[]>>((acc, project) => {
          const startYear = getPeriodStartYear(project.period);
          if (!acc[startYear]) {
            acc[startYear] = [];
          }
          acc[startYear].push(project);
          return acc;
        }, {});

      return Object.entries(grouped)
        .map(([year, items]) => ({ year: Number(year), items }))
        .sort((a, b) => a.year - b.year);
    },
    [],
  );

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          {payload.map((entry) => (
            <p key={`${entry.name}-${entry.dataKey}`} className="text-xs text-slate-700">
              {entry.name}: <span className="font-semibold">{formatCurrency(Number(entry.value ?? 0), currency)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: LegendProps) => {
    if (!payload?.length) return null;

    return (
      <div className="flex flex-wrap gap-2 text-xs" aria-label="Légende du graphique des flux de trésorerie">
        {payload.map((entry) => (
          <span
            key={`${entry.dataKey}-${entry.color}`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2.5 py-1.5 font-semibold text-slate-700"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden
            />
            {entry.value}
          </span>
        ))}
      </div>
    );
  };

  return (
    <section id="budget-cadre-vie" className="mt-8 space-y-10 md:space-y-12">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-french-blue">Cadre de vie & infrastructures</p>
          <h4 className="text-xl font-semibold text-slate-900">Budget d’amélioration</h4>
          <p className="text-sm text-slate-600">
            Vue synthétique des investissements, flux de trésorerie et leviers de financement sur 2026-2030.
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch gap-2 text-sm sm:flex-row sm:items-center sm:justify-end md:w-auto">
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-french-blue/10 px-3 py-1 text-xs font-semibold text-french-blue sm:self-auto">
            <Info className="h-4 w-4" aria-hidden />
            Données indicatives – à affiner avec les budgets annuels
          </div>
          <div className="flex flex-col items-stretch gap-1 sm:items-end">
            <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              <button
                type="button"
                onClick={() => setCurrency('XOF')}
                aria-pressed={currency === 'XOF'}
                className={`group inline-flex items-center gap-2 rounded-full px-3 py-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-french-blue ${currency === 'XOF' ? 'border border-french-blue bg-french-blue text-white shadow-sm' : 'border border-transparent hover:bg-slate-50'}`}
              >
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${currency === 'XOF' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <BadgeDollarSign className="h-3.5 w-3.5" aria-hidden />
                  FCFA
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCurrency('EUR')}
                aria-pressed={currency === 'EUR'}
                className={`group inline-flex items-center gap-2 rounded-full px-3 py-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-french-blue ${currency === 'EUR' ? 'border border-french-blue bg-french-blue text-white shadow-sm' : 'border border-transparent hover:bg-slate-50'}`}
              >
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${currency === 'EUR' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <Euro className="h-3.5 w-3.5" aria-hidden />
                  Euros
                </span>
              </button>
            </div>
            <p className="text-left text-[11px] font-semibold text-slate-600 sm:text-right" aria-live="polite">
              Montants affichés en {currency === 'XOF' ? 'franc CFA (FCFA)' : 'euros (€)'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${card.accent} p-5 shadow-sm`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(card.value, currency)}</p>
                </div>
                <span className="rounded-xl bg-white/70 p-2 shadow-inner">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 xl:[grid-template-columns:1.05fr_1.05fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-lg font-semibold text-slate-900">Projets</h5>
            <span className="text-xs font-semibold text-slate-500">7 projets clés</span>
          </div>
          <div className="space-y-5">
            {projectsByYear.map(({ year, items }) => (
              <div key={year} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
                    <CalendarClock className="h-3.5 w-3.5 text-french-blue" aria-hidden />
                    {year}
                  </span>
                  <span className="h-px flex-1 bg-slate-200" aria-hidden />
                </div>
                {items.map((project) => {
                  const hasLink = Boolean(project.link);
                  const cardContent = (
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h6 className="text-base font-semibold text-slate-900">{project.title}</h6>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-french-blue">
                            <CalendarClock className="h-3 w-3" aria-hidden />
                            {project.period}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{project.description}</p>
                        <p className="text-sm font-semibold text-emerald-700">
                          {formatCurrency(project.budget, currency)}
                        </p>
                      </div>
                      {hasLink ? (
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-inner transition group-hover:bg-french-blue/10 group-hover:text-french-blue">
                          <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-white shadow-inner">
                          Lien à venir
                        </span>
                      )}
                    </div>
                  );

                  return hasLink ? (
                    <a
                      key={project.title}
                      href={project.link}
                      className={`group block rounded-2xl border border-slate-200 bg-gradient-to-br ${project.color} p-5 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-french-blue`}
                      aria-label={`En savoir plus sur ${project.title}`}
                    >
                      {cardContent}
                    </a>
                  ) : (
                    <div
                      key={project.title}
                      className={`group rounded-2xl border border-slate-200 bg-gradient-to-br ${project.color} p-5 shadow-sm`}
                      aria-label={project.title}
                    >
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Analyse financière</p>
                <h5 className="text-lg font-semibold text-slate-900">
                  Flux de trésorerie prévisionnel ({currency})
                </h5>
                </div>
                <BarChart3 className="h-5 w-5 text-french-blue" aria-hidden />
              </div>
            <div className="h-72" role="img" aria-label="Graphique des flux de trésorerie prévisionnels 2026-2030">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 28, right: 16, left: 52, bottom: 14 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: '#1e293b', fontSize: 12 }}
                    label={{ value: 'Années', position: 'insideBottom', offset: -5, fill: '#475569', fontSize: 12 }}
                  />
                  <YAxis
                    width={96}
                    tickFormatter={axisTickFormatter}
                    tick={{ fill: '#1e293b', fontSize: 12 }}
                    label={{
                      value: `Montants (${currency})`,
                      angle: -90,
                      position: 'insideLeft',
                      offset: 4,
                      fill: '#334155',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" align="left" content={<CustomLegend />} wrapperStyle={{ paddingLeft: 4 }} />
                  <Bar name="Dépenses projets" dataKey="depenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  <Line
                    name="Capacité d’investissement"
                    type="monotone"
                    dataKey="recettesTotales"
                    stroke="#0f172a"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    name="Capacité (base)"
                    type="monotone"
                    dataKey="capacite"
                    stroke="#22c55e"
                    strokeWidth={3}
                    strokeDasharray="6 4"
                    dot={{ r: 5 }}
                  />
                  <Line
                    name="Leviers écolages"
                    type="monotone"
                    dataKey="leviers"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    strokeDasharray="4 3"
                    dot={{ r: 5 }}
                  />
                  <Line
                    name="Solde annuel"
                    type="monotone"
                    dataKey="solde"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    strokeDasharray="5 4"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h5 className="text-lg font-semibold text-slate-900">Trésorerie annuelle</h5>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
            </div>
            <div className="overflow-auto rounded-xl border border-slate-100" style={{ maxHeight: '320px' }}>
              <table className="min-w-[640px] divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-2 text-left">Année</th>
                    <th className="px-4 py-2 text-right">Capacité (base)</th>
                    <th className="px-4 py-2 text-right">Leviers écolages</th>
                    <th className="px-4 py-2 text-right">Recettes totales</th>
                    <th className="px-4 py-2 text-right">Dépenses projets</th>
                    <th className="px-4 py-2 text-right">Solde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {cashFlowRows.map((row) => {
                    const solde = row.solde;
                    const soldePositive = solde >= 0;
                    return (
                      <tr key={row.year} className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-semibold text-slate-900">{row.year}</td>
                        <td className="px-4 py-2 text-right text-slate-700">{formatCurrency(row.capacite, currency)}</td>
                        <td className="px-4 py-2 text-right text-slate-700">{formatCurrency(row.leviers, currency)}</td>
                        <td className="px-4 py-2 text-right font-semibold text-slate-900">{formatCurrency(row.recettesTotales, currency)}</td>
                        <td className="px-4 py-2 text-right text-rose-600">{formatCurrency(row.depenses, currency)}</td>
                        <td className={`px-4 py-2 text-right font-semibold ${soldePositive ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {formatCurrency(solde, currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h5 className="text-lg font-semibold text-slate-900">Calendrier des dépenses</h5>
              <CalendarClock className="h-5 w-5 text-french-blue" aria-hidden />
            </div>
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <div className="min-w-[720px] space-y-3">
                  <div className="grid grid-cols-[140px_repeat(5,1fr)] items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>Projet</span>
                    {years.map((year) => (
                      <span key={year} className="text-center">
                        {year}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {projectSchedule.map((item, index) => (
                      <div key={item.project} className="grid grid-cols-[140px_repeat(5,1fr)] items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">{item.project}</span>
                        {years.map((year) => {
                          const isActive = year >= item.start && year <= item.end;
                          return (
                            <div key={year} className="relative h-2 rounded-full bg-slate-100">
                              {isActive && (
                                <div
                                  className={`absolute inset-0 rounded-full ${index % 2 === 0 ? 'bg-french-blue/70' : 'bg-emerald-400/80'}`}
                                  style={{ width: '100%' }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm">
                <p className="mb-2 font-semibold text-slate-900">Total annuel (dépenses projets)</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 sm:grid-cols-3 lg:grid-cols-5">
                  {years.map((year, index) => (
                    <div
                      key={year}
                      className="flex flex-col items-center justify-center rounded-lg bg-white px-3 py-2 text-center shadow-sm"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{year}</span>
                      <span className="text-sm font-semibold text-emerald-700">{formatCurrency(annualTotals[index], currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h5 className="text-lg font-semibold text-slate-900">Évolution des écolages</h5>
                <PiggyBank className="h-5 w-5 text-emerald-600" aria-hidden />
              </div>
              <p className="mb-3 text-xs font-semibold text-slate-600">
                Base revenus: <span className="font-bold text-slate-900">{formatCurrency(tuitionBaseRevenue, currency)}</span>
              </p>
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-2 text-left">Année</th>
                      <th className="px-4 py-2 text-right">Augmentation</th>
                      <th className="px-4 py-2 text-right">Recette suppl.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {tuitionSimulations.map((item) => (
                      <tr key={item.year} className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-semibold text-slate-900">{item.year}</td>
                        <td className="px-4 py-2 text-right text-slate-700">{item.increase}%</td>
                        <td className="px-4 py-2 text-right font-semibold text-emerald-700">{formatCurrency(item.revenue, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                <span>Cumul généré (2026-2030)</span>
                <span>{formatCurrency(cumulativeTuition, currency)}</span>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Ajustez les pourcentages d’augmentation ci-dessus pour simuler d’autres scénarios de recettes liées aux écolages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetCadreVieInfrastructures;
