import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Building2,
  Coins,
  Euro,
  Info,
  PiggyBank,
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
    (amountInXOF: number): string => {
      if (currency === 'EUR') {
        const val = Math.round(amountInXOF / XOF_TO_EUR);
        return `${val.toLocaleString('fr-FR').replace(/\s/g, ' ')} €`;
      }
      return `${amountInXOF.toLocaleString('fr-FR').replace(/\s/g, ' ')} FCFA`;
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

  const timelineData = useMemo(() => {
    const tl = budgetData.financialTimeline && budgetData.financialTimeline.length > 0
      ? budgetData.financialTimeline
      : defaultBudgetData.financialTimeline;

    return YEARS.map((year) => {
      const row = tl.find((r) => Number(r.year) === year) || {
        year,
        capacite: 54_000_000,
        leviers: 70_042_377,
        recettesTotales: 124_042_377,
        depenses: 155_000_000,
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
  }, [budgetData, activeProjects, currency]);

  const annualCashFlowTotal = useMemo(() => {
    return timelineData.reduce((sum, r) => sum + r.capaciteXOF, 0);
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
              Vue synthétique des investissements, flux de trésorerie et leviers de financement sur 2026-2030.
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

      {/* Lower Two-Column Section: Projets (Left) + Analyse Financière (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Projets (7 projets clés) */}
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
            {activeProjects.map((project) => {
              const cost = Number(project.totalCost) || Number(project.budget) || 0;
              return (
                <div
                  key={project.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                        {getProjectIcon(project.id, project.title)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-slate-900 truncate">
                          {project.title}
                        </h3>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {project.period || `${project.startYear || 2026} – ${(project.startYear || 2026) + (project.durationYears || 1) - 1}`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-french-blue font-playfair whitespace-nowrap block">
                        {formatCurrency(cost)}
                      </span>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {project.link && (
                    <div className="pt-1">
                      <Link
                        to={project.link}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-french-blue hover:underline"
                      >
                        <span>Consulter la fiche détaillée</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Analyse Financière - Flux de trésorerie prévisionnel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <p className="text-[11px] font-bold text-[#005BAC] tracking-wider uppercase">
                ANALYSE FINANCIÈRE
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                Flux de trésorerie prévisionnel ({currency === 'XOF' ? 'XOF' : 'EUR'})
              </h2>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 text-[#005BAC]">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <span className="font-medium">Capacité d'investissement vs Dépenses projets</span>
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

            <div className="h-72 w-full min-w-0" role="img" aria-label="Graphique des flux de trésorerie">
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

            {/* Footnote matching Netlify */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">
                Synthèse de modélisation financière :
              </p>
              <p className="text-[11px] leading-relaxed">
                • Capacité socle garantie : 43 M (2026), 37 M (2027), 62 M (2028), 54 M (2029-2030).
                <br />
                • Concours & subventions externes : Dotation ANEFE et réserves foncières estimées à 89 999 998 FCFA.
                <br />
                • Manque à gagner net à résorber : {formatCurrency(fundingGap)} pour équilibrer l'ensemble des {activeProjects.length} projets clés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCadreVieInfrastructures;
