import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  CalendarClock,
  Check,
  Clock,
  Coins,
  Euro,
  Info,
  PiggyBank,
  Sprout,
  Sun,
  Trees,
  UtensilsCrossed,
  Wind,
  Waves,
} from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  defaultBudgetData,
  type BudgetData,
  type BudgetProject,
} from '@/data/budgetTransportData';
import pageDataFile from '@/content/pageData.json';

const XOF_TO_EUR = 655.957;
const YEARS = [2026, 2027, 2028, 2029, 2030];
const ANEFE_GRANT = 89_999_998;

export interface BudgetCadreVieInfrastructuresProps {
  onDataChange?: (data: BudgetData) => void;
}

export const getProjectCardStyle = (id: string, title?: string) => {
  const s = `${id} ${title || ''}`.toLowerCase();
  if (s.includes('clim')) return { bg: 'bg-[#F0F7FD]', border: 'border-[#CCE3FD]', barColor: 'bg-sky-500' };
  if (s.includes('couv') || s.includes('sport')) return { bg: 'bg-[#FEF7EC]', border: 'border-[#FCE6CA]', barColor: 'bg-emerald-500' };
  if (s.includes('terrain') || s.includes('foncier')) return { bg: 'bg-[#F2FAF4]', border: 'border-[#D3EEDC]', barColor: 'bg-emerald-500' };
  if (s.includes('cantine') || s.includes('restauration')) return { bg: 'bg-[#FFF5ED]', border: 'border-[#FDDBC5]', barColor: 'bg-sky-500' };
  if (s.includes('solaire') || s.includes('solar')) return { bg: 'bg-[#F2FAF4]', border: 'border-[#D3EEDC]', barColor: 'bg-sky-500' };
  if (s.includes('piscine') || s.includes('pool')) return { bg: 'bg-[#F0F7FD]', border: 'border-[#CCE3FD]', barColor: 'bg-emerald-500' };
  if (s.includes('extension')) return { bg: 'bg-[#F4F3FC]', border: 'border-[#DBD7F7]', barColor: 'bg-sky-500' };
  return { bg: 'bg-[#F8FAFC]', border: 'border-[#E2E8F0]', barColor: 'bg-blue-500' };
};

export const getProjectIcon = (id: string, title?: string, className = 'w-4 h-4') => {
  const s = `${id} ${title || ''}`.toLowerCase();
  if (s.includes('clim')) return <Wind className={className} />;
  if (s.includes('solaire') || s.includes('solar')) return <Sun className={className} />;
  if (s.includes('piscine') || s.includes('pool')) return <Waves className={className} />;
  if (s.includes('cantine') || s.includes('restauration')) return <UtensilsCrossed className={className} />;
  if (s.includes('foncier') || s.includes('terrain')) return <Trees className={className} />;
  return <Building2 className={className} />;
};

export const BudgetCadreVieInfrastructures: React.FC<BudgetCadreVieInfrastructuresProps> = () => {
  const [currency, setCurrency] = useState<'XOF' | 'EUR'>('XOF');

  // Synchronized data from draft or pageDataFile
  const [budgetData, setBudgetData] = useState<BudgetData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const draft = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (draft) {
          const parsed = JSON.parse(draft);
          if (parsed?.budgetData?.projects) {
            return parsed.budgetData as BudgetData;
          }
        }
      } catch {
        // fallback
      }
    }
    const fileBudget = (pageDataFile as { budgetData?: BudgetData }).budgetData;
    return fileBudget || defaultBudgetData;
  });

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ budgetData?: BudgetData }>;
      if (customEvent.detail?.budgetData) {
        setBudgetData(customEvent.detail.budgetData);
      }
    };
    const handleStorage = () => {
      try {
        const draft = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (draft) {
          const parsed = JSON.parse(draft);
          if (parsed?.budgetData?.projects) {
            setBudgetData(parsed.budgetData as BudgetData);
            return;
          }
        }
        const fileBudget = (pageDataFile as { budgetData?: BudgetData }).budgetData;
        if (fileBudget) setBudgetData(fileBudget);
      } catch {
        // ignore storage parse errors
      }
    };
    window.addEventListener('lfjp_page_data_changed', handleSync);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('lfjp_draft_cleared', handleStorage);
    return () => {
      window.removeEventListener('lfjp_page_data_changed', handleSync);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('lfjp_draft_cleared', handleStorage);
    };
  }, []);

  const formatCurrency = useCallback(
    (amountInXOF?: number | null): string => {
      const num = typeof amountInXOF === 'number' && Number.isFinite(amountInXOF) ? amountInXOF : 0;
      if (currency === 'EUR') {
        const val = Math.round(num / XOF_TO_EUR);
        return `${val.toLocaleString('fr-FR').replace(/\s/g, ' ')} €`;
      }
      return `${num.toLocaleString('fr-FR').replace(/\s/g, ' ')} FCFA`;
    },
    [currency]
  );

  const activeProjects = useMemo(() => {
    return (budgetData.projects || defaultBudgetData.projects).filter(
      (p) => p.isActive !== false
    );
  }, [budgetData]);

  const totalInvestment = useMemo(() => {
    return activeProjects.reduce(
      (sum, p) => sum + (Number(p.totalCost) || Number(p.budget) || 0),
      0
    );
  }, [activeProjects]);

  const calendarYears = useMemo(() => {
    const maxEnd = activeProjects.reduce((max, p) => {
      const s = p.startYear || 2026;
      const d = p.durationYears || 1;
      return Math.max(max, s + d - 1);
    }, 2030);
    const endYear = Math.min(2035, Math.max(2030, maxEnd));
    const count = endYear - 2026 + 1;
    return Array.from({ length: count }, (_, i) => 2026 + i);
  }, [activeProjects]);

  const timelineData = useMemo(() => {
    const tl = budgetData.financialTimeline && budgetData.financialTimeline.length > 0
      ? budgetData.financialTimeline
      : defaultBudgetData.financialTimeline;

    return calendarYears.map((year) => {
      const row = tl.find((r) => Number(r.year) === year) || {
        year,
        capacite: 54_000_000,
        leviers: 70_042_377,
        recettesTotales: 124_042_377,
        depenses: 0,
      };

      let annualExpenses = 0;
      activeProjects.forEach((p) => {
        const start = p.startYear || 2026;
        const duration = p.durationYears || 1;
        const end = start + duration - 1;
        if (year >= start && year <= end) {
          annualExpenses += Math.round(
            (Number(p.totalCost) || Number(p.budget) || 0) / duration
          );
        }
      });

      const capacity = Number(row.recettesTotales) || (Number(row.capacite) + Number(row.leviers));

      return {
        year: year.toString(),
        yearNum: year,
        capacite: currency === 'EUR' ? Math.round(capacity / XOF_TO_EUR) : capacity,
        depenses: currency === 'EUR' ? Math.round(annualExpenses / XOF_TO_EUR) : annualExpenses,
        capaciteXOF: capacity,
        depensesXOF: annualExpenses,
      };
    });
  }, [calendarYears, budgetData, activeProjects, currency]);

  // La capacité officielle du plan stratégique est bornée sur les 5 exercices 2026–2030 (685 139 418 FCFA)
  const annualCashFlowTotal = useMemo(() => {
    return timelineData
      .filter((r) => r.yearNum <= 2030)
      .reduce((sum, r) => sum + r.capaciteXOF, 0);
  }, [timelineData]);

  const totalCapacity = useMemo(() => {
    return annualCashFlowTotal + ANEFE_GRANT;
  }, [annualCashFlowTotal]);

  const fundingGap = useMemo(() => {
    return Math.max(0, totalInvestment - totalCapacity);
  }, [totalInvestment, totalCapacity]);

  return (
    <div className="w-full space-y-6">
      {/* Header Card matching https://psd-lfjp.netlify.app/budget-cadre-vie-infrastructures */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-[#005BAC] tracking-wider uppercase">
              CADRE DE VIE & INFRASTRUCTURES
            </p>
            <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-slate-900 tracking-tight">
              Budget d'amélioration
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Vue synthétique des investissements, flux de trésorerie et leviers de financement sur {calendarYears[0]}–{calendarYears[calendarYears.length - 1]}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF3FC] text-[#005BAC] text-xs font-medium border border-blue-100">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Données indicatives – à affiner avec les budgets annuels</span>
            </div>
            <div className="flex flex-col items-end">
              <div className="inline-flex items-center rounded-full bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrency('XOF')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    currency === 'XOF'
                      ? 'bg-[#005BAC] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>FCFA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('EUR')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    currency === 'EUR'
                      ? 'bg-[#005BAC] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Euro className="w-3.5 h-3.5" />
                  <span>Euros</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                Montants affichés en {currency === 'XOF' ? 'franc CFA (FCFA)' : 'Euros (€)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Executive Summary KPI Cards matching Netlify capture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: INVESTISSEMENT TOTAL */}
        <div className="rounded-2xl p-5 sm:p-6 bg-[#EAF8F0] border border-[#C5ECD6] flex items-start justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              INVESTISSEMENT TOTAL
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold font-playfair text-slate-900 tracking-tight whitespace-nowrap mt-2">
              {formatCurrency(totalInvestment)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-white text-[#107C41] shadow-2xs shrink-0">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: MANQUE À GAGNER / BESOIN DE FINANCEMENT */}
        <div className="rounded-2xl p-5 sm:p-6 bg-[#FFF6E9] border border-[#FFE2BC] flex items-start justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              MANQUE À GAGNER / BESOIN DE FINANCEMENT À L'HORIZON 2030
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold font-playfair text-slate-900 tracking-tight whitespace-nowrap mt-2">
              {formatCurrency(fundingGap)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-white text-[#C9510C] shadow-2xs shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: CAPACITÉ TOTALE ESTIMÉE */}
        <div className="rounded-2xl p-5 sm:p-6 bg-[#EEF6FE] border border-[#CCE3FD] flex items-start justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              CAPACITÉ TOTALE ESTIMÉE (BUDGET + ANEFE + ÉCOLAGES)
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold font-playfair text-slate-900 tracking-tight whitespace-nowrap mt-2">
              {formatCurrency(totalCapacity)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-white text-[#005BAC] shadow-2xs shrink-0">
            <Coins className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Lower Two-Column Section: Projets (Left) + Analyse Financière & Tables (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Projets (7 ou 8 projets clés) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Projets</h2>
              <span className="text-xs text-slate-500 font-medium">
                {activeProjects.length} projets clés
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {activeProjects
              .slice()
              .sort((a, b) => (a.startYear || 2026) - (b.startYear || 2026))
              .map((project, idx, arr) => {
                const cost = Number(project.totalCost) || Number(project.budget) || 0;
                const prev = arr[idx - 1];
                const showYearMarker = !prev || prev.startYear !== project.startYear;
                const style = getProjectCardStyle(project.id, project.title);

                return (
                  <React.Fragment key={project.id}>
                    {showYearMarker && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 pt-1 pb-0.5">
                        <div className="w-5 h-5 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600">
                          <Clock className="w-3 h-3" />
                        </div>
                        <span>{project.startYear || 2026}</span>
                      </div>
                    )}

                    <div
                      className={`p-4 rounded-2xl border ${style.bg} ${style.border} shadow-2xs transition-all space-y-2`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm text-slate-900 leading-snug">
                            {project.title}
                          </h3>
                        </div>

                        {project.link && project.link.trim() ? (
                          <Link
                            to={project.link}
                            aria-label={`Consulter la fiche détaillée de ${project.title}`}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:text-french-blue hover:border-slate-300 transition-colors shrink-0 cursor-pointer"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#1E293B] text-white shrink-0">
                            Lien à venir
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-medium text-[#005BAC]">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>
                          {project.period || `${project.startYear || 2026} – ${(project.startYear || 2026) + (project.durationYears || 1) - 1}`}
                        </span>
                      </div>

                      {Boolean(project.description && project.description.trim()) && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}

                      <div className="pt-1">
                        <span className="text-xs sm:text-sm font-bold text-[#0A6C74] font-mono whitespace-nowrap block">
                          {formatCurrency(cost)}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
        </div>

        {/* Right Column: 4 Stacked Sections matching Netlify */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Analyse Financière - Flux de trésorerie prévisionnel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <p className="text-[11px] font-bold text-[#005BAC] tracking-wider uppercase">
                  ANALYSE FINANCIÈRE
                </p>
                <h2 className="text-base font-bold text-slate-900">
                  Flux de trésorerie prévisionnel ({currency === 'XOF' ? 'XOF' : 'EUR'})
                </h2>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 text-[#005BAC]">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <span className="font-medium text-slate-500">Capacité vs Dépenses</span>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-[11px]">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span>Capacité d'Investissement</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px]">
                  <span className="w-3 h-3 rounded-sm bg-red-500" />
                  <span>Dépenses Projets</span>
                </span>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full min-w-0" role="img" aria-label="Graphique des flux de trésorerie">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={timelineData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="year" tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    tickFormatter={(val: number) => {
                      if (currency === 'EUR') return `${Math.round(val / 1000)}k€`;
                      return `${Math.round(val / 1_000_000)}M`;
                    }}
                  />
                  <Tooltip
                    formatter={(val: number, name: string) => [
                      formatCurrency(currency === 'EUR' ? val * XOF_TO_EUR : val),
                      name === 'capacite' ? "Capacité d'Investissement" : 'Dépenses Projets',
                    ]}
                    labelFormatter={(lbl) => `Exercice budgétaire ${lbl}`}
                  />
                  <Bar dataKey="depenses" fill="#EF4444" radius={[6, 6, 0, 0]} name="Dépenses Projets" maxBarSize={48} />
                  <Line
                    type="monotone"
                    dataKey="capacite"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#059669', stroke: '#FFFFFF', strokeWidth: 2 }}
                    name="Capacité d'Investissement"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section 2: Table Trésorerie annuelle */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs overflow-hidden space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Trésorerie annuelle</h3>
                <p className="text-xs text-slate-400">Recettes, dépenses et soldes annuels</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs text-left border-collapse min-w-[540px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Année</th>
                    <th className="py-2.5 px-3 text-right">Capacité (base)</th>
                    <th className="py-2.5 px-3 text-right">Leviers écolages</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-700">Recettes totales</th>
                    <th className="py-2.5 px-3 text-right text-red-500">Dépenses projets</th>
                    <th className="py-2.5 px-3 text-right">Solde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {timelineData.map((row) => {
                    const tlMatch = budgetData.financialTimeline?.find((r) => Number(r.year) === row.yearNum);
                    const baseCapXOF = Number(tlMatch?.capacite) || (row.yearNum === 2026 ? 43_000_000 : row.yearNum === 2027 ? 37_000_000 : row.yearNum === 2028 ? 62_000_000 : 54_000_000);
                    const leviersXOF = Number(tlMatch?.leviers) || (row.yearNum === 2026 ? 64_969_911 : 70_042_377);
                    const recettesXOF = row.capaciteXOF;
                    const depensesXOF = row.depensesXOF;
                    const soldeXOF = recettesXOF - depensesXOF;

                    return (
                      <tr key={row.year} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-800">{row.year}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {formatCurrency(baseCapXOF)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {formatCurrency(leviersXOF)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          {formatCurrency(recettesXOF)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-red-500 font-semibold">
                          {formatCurrency(depensesXOF)}
                        </td>
                        <td
                          className={`py-2.5 px-3 text-right font-bold ${
                            soldeXOF >= 0 ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {formatCurrency(soldeXOF)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Calendrier des dépenses (Gantt Schedule) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Calendrier des dépenses</h3>
              <div className="p-1.5 rounded-lg bg-blue-50 text-french-blue">
                <CalendarClock className="w-4 h-4" />
              </div>
            </div>

            <div className="overflow-x-auto -mx-2 px-2">
              <div className="min-w-[540px] space-y-2.5">
                {/* Year Header Row */}
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-400 pb-2 border-b border-slate-100">
                  <div className="col-span-5 text-slate-500 font-medium">Projet</div>
                  <div className="col-span-7 grid" style={{ gridTemplateColumns: `repeat(${calendarYears.length}, minmax(0, 1fr))` }}>
                    {calendarYears.map((y) => (
                      <div key={y} className="text-center text-[11px] font-bold text-slate-600">
                        {y}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Rows */}
                {activeProjects.map((p) => {
                  const pStart = p.startYear || 2026;
                  const pDuration = p.durationYears || 1;
                  const pEnd = pStart + pDuration - 1;
                  const style = getProjectCardStyle(p.id, p.title);

                  return (
                    <div key={p.id} className="grid grid-cols-12 gap-2 items-center text-xs py-1">
                      <div className="col-span-5 truncate text-slate-700 font-medium pr-2" title={p.title}>
                        {p.title}
                      </div>
                      <div className="col-span-7 grid gap-1.5 items-center" style={{ gridTemplateColumns: `repeat(${calendarYears.length}, minmax(0, 1fr))` }}>
                        {calendarYears.map((y) => {
                          const isActiveThisYear = y >= pStart && y <= pEnd;
                          return (
                            <div key={y} className="h-4 flex items-center justify-center">
                              {isActiveThisYear ? (
                                <div className={`h-2.5 w-full rounded-full ${style.barColor} opacity-90`} />
                              ) : (
                                <div className="h-0.5 w-full bg-slate-100 rounded-full" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Summary Box: Total annuel (dépenses projets) */}
                <div className="mt-4 rounded-xl bg-slate-50/80 border border-slate-200/80 p-3.5 space-y-2">
                  <p className="text-xs font-semibold text-slate-700">
                    Total annuel (dépenses projets)
                  </p>
                  <div className="grid" style={{ gridTemplateColumns: `repeat(${calendarYears.length}, minmax(0, 1fr))` }}>
                    {calendarYears.map((y) => {
                      let yearTotal = 0;
                      activeProjects.forEach((p) => {
                        const s = p.startYear || 2026;
                        const d = p.durationYears || 1;
                        const e = s + d - 1;
                        if (y >= s && y <= e) {
                          yearTotal += Math.round((Number(p.totalCost) || Number(p.budget) || 0) / d);
                        }
                      });
                      return (
                        <div key={y} className="text-center px-1">
                          <p className="text-[10px] text-slate-400 font-medium">{y}</p>
                          <p className="text-xs font-bold text-[#0A6C74] font-mono whitespace-nowrap">
                            {formatCurrency(yearTotal)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Évolution des écolages */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs max-w-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Évolution des écolages</h3>
                <p className="text-xs text-slate-400">
                  Base revenus : {formatCurrency(1_203_146_500)}
                </p>
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Sprout className="w-4 h-4" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2 px-3">Année</th>
                    <th className="py-2 px-3 text-center">Augmentation</th>
                    <th className="py-2 px-3 text-right">Recette suppl.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {[
                    { year: 2026, rate: '5.4 %', revXOF: 64_969_911 },
                    { year: 2027, rate: '0.4 %', revXOF: 70_042_377 },
                    { year: 2028, rate: '0 %', revXOF: 70_042_377 },
                    { year: 2029, rate: '0 %', revXOF: 70_042_377 },
                    { year: 2030, rate: '0 %', revXOF: 70_042_377 },
                  ].map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 font-sans font-bold text-slate-800">{row.year}</td>
                      <td className="py-2 px-3 text-center text-slate-600 font-sans">{row.rate}</td>
                      <td className="py-2 px-3 text-right font-bold text-[#107C41]">
                        +{formatCurrency(row.revXOF)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl bg-[#EAF8F0] border border-[#C5ECD6] p-3 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Cumul généré (2026-2030)</span>
              <span className="font-bold text-[#107C41] font-mono text-sm">
                {formatCurrency(345_139_418)}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              Ajustez les pourcentages d'augmentation ci-dessous pour simuler d'autres scénarios de recettes liées aux écolages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCadreVieInfrastructures;
