import React, { useEffect, useMemo, useState } from 'react';
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
import { defaultBudgetData, type BudgetData } from '@/data/budgetTransportData';
import pageDataFile from '@/content/pageData.json';
import { isContentDraftPreview } from '@/lib/contentDraft';

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
    budget: 60_000_009,
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

const parsePeriodYears = (period: string): { start: number; end: number } => {
  if (!period) return { start: 2026, end: 2026 };
  const matches = period.match(/\b(20\d{2})\b/g);
  if (!matches || matches.length === 0) return { start: 2026, end: 2026 };
  const nums = matches.map((m) => parseInt(m, 10)).sort((a, b) => a - b);
  return {
    start: nums[0],
    end: nums[nums.length - 1],
  };
};

const getPeriodStartYear = (period: string) => parsePeriodYears(period).start;

const BudgetCadreVieInfrastructures = () => {
  const [currency, setCurrency] = useState<'XOF' | 'EUR'>('XOF');

  const baseBudgetData = useMemo(() => {
    return (pageDataFile as { budgetData?: BudgetData }).budgetData || defaultBudgetData;
  }, []);

  const [liveBudget, setLiveBudget] = useState<BudgetData>(() => {
    if (typeof window !== 'undefined' && isContentDraftPreview()) {
      try {
        const saved = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.budgetData) return parsed.budgetData as BudgetData;
        }
      } catch {
        // fallback
      }
    }
    return (pageDataFile as { budgetData?: BudgetData }).budgetData || defaultBudgetData;
  });

  // Listen to storage and postMessage events to immediately update React state and Recharts graphs
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.budgetData) {
            setLiveBudget(parsed.budgetData as BudgetData);
          }
        }
      } catch {
        // ignore
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'lfjp-page-data-update' && event.data.data?.budgetData) {
        setLiveBudget(event.data.data.budgetData as BudgetData);
      }
    };

    const handleCustom = (event: Event) => {
      const customEvt = event as CustomEvent;
      if (customEvt.detail?.budgetData) {
        setLiveBudget(customEvt.detail.budgetData as BudgetData);
      } else {
        handleUpdate();
      }
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('message', handleMessage);
    window.addEventListener('lfjp_page_data_changed', handleCustom);
    window.addEventListener('lfjp_draft_cleared', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('lfjp_page_data_changed', handleCustom);
      window.removeEventListener('lfjp_draft_cleared', handleUpdate);
    };
  }, []);

  const activeProjects = useMemo(() => {
    return (liveBudget.projects && liveBudget.projects.length > 0) ? liveBudget.projects : projects;
  }, [liveBudget]);

  const activeTimeline = useMemo(() => {
    return (liveBudget.financialTimeline && liveBudget.financialTimeline.length > 0) ? liveBudget.financialTimeline : financialTimeline;
  }, [liveBudget]);

  // Dynamically derive all active project schedule items directly from active projects
  // So the calendar strictly conforms to the projects' start and end years
  const activeProjectSchedule = useMemo(() => {
    return activeProjects.map((p, idx) => {
      const { start, end } = parsePeriodYears(p.period);
      const duration = Math.max(1, end - start + 1);
      const spendPerYear = Math.round((Number(p.budget) || 0) / duration);
      const annualSpend: Record<string, number> = {};
      for (let y = start; y <= end; y++) {
        annualSpend[String(y)] = spendPerYear;
      }
      return {
        id: p.id || `proj-${idx}`,
        project: p.title,
        period: p.period,
        budget: Number(p.budget) || 0,
        start,
        end,
        annualSpend,
      };
    });
  }, [activeProjects]);

  // Dynamically derive all relevant years from timeline and projects
  const years = useMemo(() => {
    const timelineYears = (activeTimeline || []).map((r) => Number(r.year)).filter((y) => !isNaN(y) && y > 2000);
    const projectYears: number[] = [];
    activeProjectSchedule.forEach((item) => {
      for (let y = item.start; y <= item.end; y++) {
        projectYears.push(y);
      }
    });
    const all = Array.from(new Set([...timelineYears, ...projectYears])).sort((a, b) => a - b);
    return all.length > 0 ? all : [2026, 2027, 2028, 2029, 2030];
  }, [activeTimeline, activeProjectSchedule]);

  // Fill timeline for every year in years so graphs and tables remain 100% complete
  const filledTimeline = useMemo(() => {
    return years.map((year) => {
      const existing = activeTimeline.find((r) => r.year === year);
      if (existing) {
        const cap = Number(existing.capacite) || 0;
        const lev = Number(existing.leviers) || 0;
        const rec = existing.recettesTotales !== undefined && Number(existing.recettesTotales) > 0
          ? Number(existing.recettesTotales)
          : (cap + lev);
        const dep = Number(existing.depenses) || 0;
        return {
          ...existing,
          year,
          capacite: cap,
          leviers: lev,
          recettesTotales: rec,
          depenses: dep,
        };
      }
      const projectedSpend = activeProjectSchedule.reduce((sum, item) => {
        if (year >= item.start && year <= item.end) {
          return sum + (item.annualSpend[String(year)] || 0);
        }
        return sum;
      }, 0);
      return {
        year,
        capacite: 50_000_000,
        leviers: 70_000_000,
        recettesTotales: 120_000_000,
        depenses: projectedSpend,
      };
    });
  }, [years, activeTimeline, activeProjectSchedule]);

  // Derived calculations for full dynamic correlation
  const computedTotalInvestment = useMemo(() => {
    return activeProjects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  }, [activeProjects]);

  const computedTotalCapacity = useMemo(() => {
    return filledTimeline.reduce(
      (sum, row) => sum + (Number(row.recettesTotales) || (Number(row.capacite) + Number(row.leviers)) || 0),
      0
    );
  }, [filledTimeline]);

  const computedFundingGap = useMemo(() => {
    return Math.max(0, computedTotalInvestment - computedTotalCapacity);
  }, [computedTotalInvestment, computedTotalCapacity]);

  const dynamicSummaryCards = useMemo(() => [
    {
      key: 'totalInvestment',
      label: 'Investissement total',
      value: liveBudget.summaryCards?.totalInvestment && liveBudget.summaryCards.totalInvestment !== 775_000_000
        ? liveBudget.summaryCards.totalInvestment
        : computedTotalInvestment,
      icon: PiggyBank,
      accent: 'from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-100',
    },
    {
      key: 'fundingGap',
      label: 'Manque à gagner / besoin de financement à l’horizon 2030',
      value: liveBudget.summaryCards?.fundingGap && liveBudget.summaryCards.fundingGap !== 89_860_582
        ? liveBudget.summaryCards.fundingGap
        : computedFundingGap,
      icon: AlertTriangle,
      accent: 'from-rose-50 to-amber-50 text-amber-700 border-amber-100',
    },
    {
      key: 'estimatedCapacity',
      label: 'Capacité totale estimée (budget + ANEFE + écolages)',
      value: liveBudget.summaryCards?.estimatedCapacity && liveBudget.summaryCards.estimatedCapacity !== 685_139_418
        ? liveBudget.summaryCards.estimatedCapacity
        : computedTotalCapacity,
      icon: BadgeDollarSign,
      accent: 'from-sky-50 to-indigo-50 text-sky-700 border-sky-100',
    },
  ], [liveBudget, computedTotalInvestment, computedFundingGap, computedTotalCapacity]);

  // Dynamic annual expenses matching timeline rows per year
  const annualTotals = useMemo(() => {
    return years.map((year) => {
      const row = filledTimeline.find((r) => r.year === year);
      return row ? Number(row.depenses) || 0 : 0;
    });
  }, [years, filledTimeline]);

  // Tuition simulations and cumulative total
  const activeTuitionSimulations = useMemo(() => {
    if (liveBudget.tuitionSimulations && liveBudget.tuitionSimulations.length > 0) {
      return liveBudget.tuitionSimulations;
    }
    return tuitionSimulations;
  }, [liveBudget]);

  const activeTuitionBaseRevenue = useMemo(() => {
    return liveBudget.tuitionBaseRevenue || tuitionBaseRevenue;
  }, [liveBudget]);

  const cumulativeTuition = useMemo(() => {
    return activeTuitionSimulations.reduce((acc, s) => acc + (Number(s.revenue) || 0), 0);
  }, [activeTuitionSimulations]);

  const chartData = useMemo(
    () =>
      filledTimeline.map((row) => {
        const factor = currency === 'EUR' ? 1 / XOF_TO_EUR : 1;
        const capacite = Number(row.capacite) || 0;
        const leviers = Number(row.leviers) || 0;
        const recettesTotales = Number(row.recettesTotales) || (capacite + leviers);
        const depenses = Number(row.depenses) || 0;
        const solde = recettesTotales - depenses;
        return {
          ...row,
          capacite: Math.round(capacite * factor),
          leviers: Math.round(leviers * factor),
          recettesTotales: Math.round(recettesTotales * factor),
          depenses: Math.round(depenses * factor),
          solde: Math.round(solde * factor),
        };
      }),
    [currency, filledTimeline],
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
      filledTimeline.map((row) => {
        const capacite = Number(row.capacite) || 0;
        const leviers = Number(row.leviers) || 0;
        const recettesTotales = Number(row.recettesTotales) || (capacite + leviers);
        const depenses = Number(row.depenses) || 0;
        return {
          ...row,
          capacite,
          leviers,
          recettesTotales,
          depenses,
          solde: recettesTotales - depenses,
        };
      }),
    [filledTimeline],
  );

  const projectsByYear = useMemo(
    () => {
      const grouped = activeProjects
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
    [activeProjects],
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
    <section id="budget-cadre-vie" data-currency={currency} className="mt-8 space-y-10 md:space-y-12">
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
        {dynamicSummaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${card.accent} p-5 shadow-sm`}
              data-summary-field={card.key}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-900" data-currency-amount={card.value} data-summary-field={card.key}>{formatCurrency(card.value, currency)}</p>
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
            <span className="text-xs font-semibold text-slate-500">{activeProjects.length} projets clés</span>
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
                    <div className="flex items-start gap-3" data-project-id={project.id || project.title}>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h6 className="text-base font-semibold text-slate-900" data-project-id={project.id || project.title} data-project-field="title">{project.title}</h6>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-french-blue" data-project-id={project.id || project.title} data-project-field="period">
                            <CalendarClock className="h-3 w-3" aria-hidden />
                            {project.period}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700" data-project-id={project.id || project.title} data-project-field="description">{project.description}</p>
                        <p
                          className="text-sm font-semibold text-emerald-700"
                          data-currency-amount={project.budget}
                          data-project-id={project.id || project.title}
                          data-project-field="budget"
                        >
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
                      <tr key={row.year} className="hover:bg-slate-50" data-budget-year={row.year}>
                        <td className="px-4 py-2 font-semibold text-slate-900" data-budget-year={row.year} data-budget-field="year">{row.year}</td>
                        <td className="px-4 py-2 text-right text-slate-700 font-medium" data-budget-year={row.year} data-budget-field="capacite" data-currency-amount={row.capacite}>{formatCurrency(row.capacite, currency)}</td>
                        <td className="px-4 py-2 text-right text-slate-700 font-medium" data-budget-year={row.year} data-budget-field="leviers" data-currency-amount={row.leviers}>{formatCurrency(row.leviers, currency)}</td>
                        <td className="px-4 py-2 text-right font-semibold text-slate-900" data-budget-year={row.year} data-budget-field="recettesTotales" data-currency-amount={row.recettesTotales}>{formatCurrency(row.recettesTotales, currency)}</td>
                        <td className="px-4 py-2 text-right text-rose-600 font-medium" data-budget-year={row.year} data-budget-field="depenses" data-currency-amount={row.depenses}>{formatCurrency(row.depenses, currency)}</td>
                        <td className={`px-4 py-2 text-right font-semibold ${soldePositive ? 'text-emerald-700' : 'text-rose-600'}`} data-budget-year={row.year} data-budget-field="solde" data-currency-amount={solde}>
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
                  <div
                    className="grid items-center gap-2 text-xs font-semibold text-slate-500"
                    style={{ gridTemplateColumns: `180px repeat(${years.length}, minmax(60px, 1fr))` }}
                  >
                    <span>Projet</span>
                    {years.map((year) => (
                      <span key={year} className="text-center font-bold">
                        {year}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2.5">
                    {activeProjectSchedule.map((item, index) => (
                      <div
                        key={item.project}
                        className="grid items-center gap-2"
                        style={{ gridTemplateColumns: `180px repeat(${years.length}, minmax(60px, 1fr))` }}
                        data-project-id={item.id || item.project}
                      >
                        <span className="text-sm font-semibold text-slate-800 truncate" title={`${item.project} (${item.period})`}>
                          {item.project}
                        </span>
                        {years.map((year) => {
                          const isActive = year >= item.start && year <= item.end;
                          return (
                            <div key={year} className="relative h-2.5 rounded-full bg-slate-100 overflow-hidden">
                              {isActive && (
                                <div
                                  className={`absolute inset-0 rounded-full transition-all duration-300 ${index % 2 === 0 ? 'bg-french-blue/80' : 'bg-emerald-500/85'}`}
                                  style={{ width: '100%' }}
                                  title={`${item.project} (${item.start} - ${item.end})`}
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
                <div
                  className="grid gap-2 text-xs font-semibold text-slate-700"
                  style={{ gridTemplateColumns: `repeat(${Math.min(years.length, 5)}, minmax(0, 1fr))` }}
                >
                  {years.map((year, index) => (
                    <div
                      key={year}
                      className="flex flex-col items-center justify-center rounded-lg bg-white px-3 py-2 text-center shadow-sm border border-slate-100"
                      data-budget-year={year}
                      data-budget-field="depenses"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{year}</span>
                      <span className="text-sm font-semibold text-emerald-700" data-currency-amount={annualTotals[index]}>
                        {formatCurrency(annualTotals[index], currency)}
                      </span>
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
                Base revenus: <span className="font-bold text-slate-900" data-currency-amount={activeTuitionBaseRevenue}>{formatCurrency(activeTuitionBaseRevenue, currency)}</span>
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
                    {activeTuitionSimulations.map((item) => (
                      <tr key={item.year} className="hover:bg-slate-50" data-tuition-year={item.year}>
                        <td className="px-4 py-2 font-semibold text-slate-900" data-tuition-year={item.year} data-tuition-field="year">{item.year}</td>
                        <td className="px-4 py-2 text-right text-slate-700" data-tuition-year={item.year} data-tuition-field="increase">{item.increase}%</td>
                        <td className="px-4 py-2 text-right font-semibold text-emerald-700" data-tuition-year={item.year} data-tuition-field="revenue" data-currency-amount={item.revenue}>{formatCurrency(item.revenue, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                <span>Cumul généré (2026-2030)</span>
                <span data-currency-amount={cumulativeTuition}>{formatCurrency(cumulativeTuition, currency)}</span>
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
