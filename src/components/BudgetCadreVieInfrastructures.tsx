import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Coins,
  DollarSign,
  Euro,
  FolderKanban,
  Info,
  Layers,
  MousePointerClick,
  PiggyBank,
  RefreshCw,
  School,
  Sparkles,
  TrendingUp,
  Wallet,
  Plus,
  Trash2,
  Edit3,
} from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import {
  defaultBudgetData,
  type BudgetData,
  type BudgetProject,
} from '@/data/budgetTransportData';
import pageDataFile from '@/content/pageData.json';
import { isContentDraftPreview } from '@/lib/contentDraft';

const XOF_TO_EUR = 655.957;
const YEARS = [2026, 2027, 2028, 2029, 2030];
const DEFAULT_STUDENT_COUNT = 630;
const DEFAULT_BASE_CAPACITY = 70_000_000;
const DEFAULT_EXTRA_CAPACITY_2028 = 30_000_000;
const THRESHOLD_YEAR = 2028;
const DEFAULT_BASE_REVENUE = 1_203_146_500; // 1 266 470 000 * 0.95

export interface BudgetCadreVieProps {
  adminMode?: boolean;
  onDataChange?: (data: BudgetData) => void;
}

export const BudgetCadreVieInfrastructures: React.FC<BudgetCadreVieProps> = ({
  adminMode = false,
  onDataChange,
}) => {
  const [currency, setCurrency] = useState<'XOF' | 'EUR'>('XOF');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'synced'>('synced');

  // Load initial budget data from pageData or draft
  const initialData = useMemo<BudgetData>(() => {
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
  }, []);

  // Normalization: Ensure all projects have the required interactive fields
  const normalizeProjects = useCallback((rawProjects?: BudgetProject[]): BudgetProject[] => {
    const list = rawProjects && rawProjects.length > 0 ? rawProjects : defaultBudgetData.projects;
    return list.map((p, idx) => {
      const defaultMatch = defaultBudgetData.projects.find((dp) => dp.id === p.id || dp.title === p.title);
      const isClim = p.id.includes('clim') || p.title.toLowerCase().includes('climatisation');
      const isSportCover = p.id.includes('sport_cover') || p.id.includes('sport-couv') || p.title.toLowerCase().includes('couverture');
      const isSolar = p.id.includes('solar') || p.id.includes('solaire');
      const isPool = p.id.includes('pool') || p.id.includes('piscine');
      const isCantine = p.id.includes('cantine') || p.id.includes('restauration');
      const isLand = p.id.includes('terrain') || p.id.includes('foncier');

      const category: 'equipment' | 'infra' | 'land' = p.category || (isLand ? 'land' : (isClim || isSolar ? 'equipment' : 'infra'));
      let startYear = p.startYear;
      let durationYears = p.durationYears;

      if (!startYear || !durationYears) {
        if (defaultMatch?.startYear && defaultMatch?.durationYears) {
          startYear = defaultMatch.startYear;
          durationYears = defaultMatch.durationYears;
        } else {
          // Parse from period
          const matches = (p.period || '').match(/\b(20\d{2})\b/g);
          if (matches && matches.length > 0) {
            const nums = matches.map((m) => parseInt(m, 10)).sort((a, b) => a - b);
            startYear = nums[0];
            const endYear = nums[nums.length - 1];
            durationYears = Math.max(1, endYear - startYear + 1);
          } else {
            startYear = 2026;
            durationYears = 1;
          }
        }
      }

      const budgetVal = Number(p.totalCost) || Number(p.budget) || (defaultMatch?.budget ?? 50_000_000);
      const isVar = p.isVariable ?? (defaultMatch?.isVariable ?? true);
      const varMin = p.variableMin ?? (defaultMatch?.variableMin ?? Math.round(budgetVal * 0.6));
      const varMax = p.variableMax ?? (defaultMatch?.variableMax ?? Math.round(budgetVal * 1.4));

      return {
        ...p,
        id: p.id || `proj-${idx}`,
        title: p.title || p.name || 'Projet',
        name: p.name || p.title || 'Projet',
        category,
        isActive: p.isActive ?? true,
        isVariable: isVar,
        variableMin: varMin,
        variableMax: varMax,
        startYear: Math.max(2026, Math.min(2030, startYear)),
        durationYears: Math.max(1, Math.min(5, durationYears)),
        totalCost: budgetVal,
        budget: budgetVal,
        description: p.description || defaultMatch?.description || '',
        period: p.period || `${startYear} – ${startYear + durationYears - 1}`,
        color: p.color || defaultMatch?.color || 'from-sky-100 to-sky-50',
        link: p.link || defaultMatch?.link,
      };
    });
  }, []);

  const [projectsList, setProjectsList] = useState<BudgetProject[]>(() =>
    normalizeProjects(initialData.projects)
  );

  // Fee rates for each year (default: 2026 => 5.4%, 2027 => 0.4%, others => 0%)
  const [feeRates, setFeeRates] = useState<Record<number, number>>(() => {
    const rates: Record<number, number> = { 2026: 5.4, 2027: 0.4, 2028: 0.0, 2029: 0.0, 2030: 0.0 };
    if (initialData.tuitionSimulations && initialData.tuitionSimulations.length > 0) {
      initialData.tuitionSimulations.forEach((sim) => {
        rates[sim.year] = Number(sim.increase) || 0;
      });
    }
    return rates;
  });

  const [studentCount] = useState<number>(initialData.studentCount || DEFAULT_STUDENT_COUNT);
  const [baseRevenue] = useState<number>(initialData.tuitionBaseRevenue || DEFAULT_BASE_REVENUE);

  // Sync with global custom events or local storage changes
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.budgetData?.projects) {
            setProjectsList(normalizeProjects(parsed.budgetData.projects));
          }
          if (parsed?.budgetData?.tuitionSimulations) {
            setFeeRates((prevRates) => {
              const nextRates: Record<number, number> = { ...prevRates };
              parsed.budgetData.tuitionSimulations.forEach((sim: { year: number; increase: number }) => {
                nextRates[sim.year] = Number(sim.increase) || 0;
              });
              return nextRates;
            });
          }
        }
      } catch {
        // ignore
      }
    };

    const handleCustom = (event: Event) => {
      const customEvt = event as CustomEvent;
      if (customEvt.detail?.budgetData?.projects) {
        setProjectsList(normalizeProjects(customEvt.detail.budgetData.projects));
      }
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('lfjp_page_data_changed', handleCustom);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('lfjp_page_data_changed', handleCustom);
    };
  }, [normalizeProjects]);

  // Currency Formatter Helper
  const formatCurrency = useCallback(
    (value: number, curr?: 'XOF' | 'EUR') => {
      const targetCurr = curr || currency;
      if (targetCurr === 'EUR') {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }).format(value / XOF_TO_EUR);
      }
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        maximumFractionDigits: 0,
      }).format(value);
    },
    [currency]
  );

  // Compact currency formatter for charts (e.g. "120M" or "180k")
  const compactTickFormatter = useCallback(
    (value: number) => {
      if (currency === 'EUR') {
        const eurVal = value / XOF_TO_EUR;
        return `${(eurVal / 1_000).toFixed(0)}k €`;
      }
      return `${(value / 1_000_000).toFixed(0)}M`;
    },
    [currency]
  );

  // Interactive Project Handlers
  const toggleProject = useCallback((id: string) => {
    setProjectsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    setSaveStatus('saved');
  }, []);

  const updateProjectCost = useCallback((id: string, newCost: number) => {
    setProjectsList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, totalCost: newCost, budget: newCost } : p
      )
    );
    setSaveStatus('saved');
  }, []);

  const updateProjectPeriod = useCallback((id: string, startYear: number, endYear: number) => {
    const s = Math.max(2026, Math.min(2030, startYear));
    const e = Math.max(s, Math.min(2030, endYear));
    const duration = e - s + 1;
    setProjectsList((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              startYear: s,
              durationYears: duration,
              period: `${s} – ${e}`,
            }
          : p
      )
    );
    setSaveStatus('saved');
  }, []);

  const handleCalendarCellClick = useCallback((project: BudgetProject, year: number) => {
    const currentStart = project.startYear || 2026;
    const currentEnd = currentStart + (project.durationYears || 1) - 1;

    let nextStart = currentStart;
    let nextEnd = currentEnd;

    if (year < currentStart) {
      nextStart = year;
    } else if (year > currentEnd) {
      nextEnd = year;
    } else if (year === currentStart && currentStart < currentEnd) {
      nextStart = currentStart + 1;
    } else if (year === currentEnd && currentEnd > currentStart) {
      nextEnd = currentEnd - 1;
    } else {
      // Toggle active status if single-cell clicked
      toggleProject(project.id);
      return;
    }

    updateProjectPeriod(project.id, nextStart, nextEnd);
  }, [toggleProject, updateProjectPeriod]);

  const handleRateChange = useCallback((year: number, rate: number) => {
    setFeeRates((prev) => ({
      ...prev,
      [year]: rate,
    }));
    setSaveStatus('saved');
  }, []);

  const resetAllToDefaults = useCallback(() => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(
        'Voulez-vous vraiment réinitialiser toutes les données de simulation aux valeurs par défaut ?'
      );
      if (!ok) return;
    }
    setProjectsList(normalizeProjects(defaultBudgetData.projects));
    setFeeRates({ 2026: 5.4, 2027: 0.4, 2028: 0.0, 2029: 0.0, 2030: 0.0 });
    setSaveStatus('saved');
  }, [normalizeProjects]);

  const handleAddProject = useCallback(() => {
    const newId = `proj-${Date.now()}`;
    const newProject: BudgetProject = {
      id: newId,
      title: 'Nouveau projet d’investissement',
      name: 'Nouveau projet d’investissement',
      category: 'infra',
      description: 'Aménagement ou acquisition prévus dans le cadre de vie.',
      period: '2026 – 2027',
      budget: 25_000_000,
      totalCost: 25_000_000,
      startYear: 2026,
      durationYears: 2,
      isActive: true,
      isVariable: true,
      variableMin: 15_000_000,
      variableMax: 40_000_000,
      color: 'from-blue-100 to-indigo-50',
    };
    setProjectsList((prev) => [...prev, newProject]);
    setSaveStatus('saved');
  }, []);

  const handleDeleteProject = useCallback((id: string) => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm('Voulez-vous vraiment supprimer ce projet d’investissement ?');
      if (!ok) return;
    }
    setProjectsList((prev) => prev.filter((p) => p.id !== id));
    setSaveStatus('saved');
  }, []);

  const updateProjectField = useCallback((id: string, field: 'title' | 'description' | 'category', value: string) => {
    setProjectsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value, ...(field === 'title' ? { name: value } : {}) } : p))
    );
    setSaveStatus('saved');
  }, []);

  // Financial Calculations & Cashflow Timeline
  const financialData = useMemo(() => {
    let accumulatedBalance = 0;
    let compoundTuition = baseRevenue;

    const timeline = YEARS.map((year) => {
      // Base capacity: 70M in 2026-2027, 100M from 2028
      const baseCap = year >= THRESHOLD_YEAR ? DEFAULT_BASE_CAPACITY + DEFAULT_EXTRA_CAPACITY_2028 : DEFAULT_BASE_CAPACITY;
      const rate = feeRates[year] || 0;
      compoundTuition = compoundTuition * (1 + rate / 100);
      const feeRevenue = Math.round(compoundTuition - baseRevenue);
      const investmentCapacity = baseCap + feeRevenue;

      // Project expenses for this year
      let projectCosts = 0;
      const activeProjectNames: string[] = [];

      projectsList.forEach((p) => {
        const start = p.startYear || 2026;
        const duration = p.durationYears || 1;
        const end = start + duration - 1;
        if (p.isActive && year >= start && year <= end) {
          const annualCost = Math.round((Number(p.totalCost) || Number(p.budget) || 0) / duration);
          projectCosts += annualCost;
          activeProjectNames.push(p.name || p.title);
        }
      });

      const balance = investmentCapacity - projectCosts;
      accumulatedBalance += balance;

      return {
        year,
        label: year.toString(),
        baseCapacity: baseCap,
        feeRevenue,
        investmentCapacity,
        projectCosts,
        balance,
        accumulatedBalance,
        activeProjects: activeProjectNames,
      };
    });

    // Summary Metrics
    const totalInvestment = projectsList
      .filter((p) => p.isActive)
      .reduce((sum, p) => sum + (Number(p.totalCost) || Number(p.budget) || 0), 0);

    const totalCapacity = timeline.reduce((sum, r) => sum + r.investmentCapacity, 0);
    const finalAccumulated = timeline[timeline.length - 1].accumulatedBalance;
    const fundingGap = finalAccumulated < 0 ? Math.abs(finalAccumulated) : 0;
    const yearsWithDeficit = timeline.filter((r) => r.balance < 0).length;

    return {
      timeline,
      totalInvestment,
      totalCapacity,
      fundingGap,
      yearsWithDeficit,
    };
  }, [projectsList, feeRates, baseRevenue]);

  // Tuition Simulations Summary for right card
  const tuitionSimulationRows = useMemo(() => {
    let compound = baseRevenue;
    return YEARS.map((year) => {
      const rate = feeRates[year] || 0;
      compound = compound * (1 + rate / 100);
      const extraRevenue = Math.round(compound - baseRevenue);
      return {
        year,
        rate,
        extraRevenue,
      };
    });
  }, [baseRevenue, feeRates]);

  const cumulativeTuitionExtra = useMemo(() => {
    return tuitionSimulationRows.reduce((sum, r) => sum + r.extraRevenue, 0);
  }, [tuitionSimulationRows]);

  // Synchronize changes to localStorage and dispatch event for live preview / draft persistence
  useEffect(() => {
    if (saveStatus !== 'saved') return;

    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          const raw = window.localStorage.getItem('lfjp-admin-page-data-draft');
          const current = raw ? JSON.parse(raw) : (pageDataFile as Record<string, unknown>);

          const updatedBudgetData: BudgetData = {
            summaryCards: {
              totalInvestment: financialData.totalInvestment,
              fundingGap: financialData.fundingGap,
              estimatedCapacity: financialData.totalCapacity,
            },
            projects: projectsList,
            financialTimeline: financialData.timeline.map((t) => ({
              year: t.year,
              capacite: t.baseCapacity,
              leviers: t.feeRevenue,
              recettesTotales: t.investmentCapacity,
              depenses: t.projectCosts,
            })),
            tuitionSimulations: tuitionSimulationRows.map((t) => ({
              year: t.year,
              increase: t.rate,
              revenue: t.extraRevenue,
            })),
            projectSchedule: projectsList.map((p) => {
              const start = p.startYear || 2026;
              const duration = p.durationYears || 1;
              const annualSpend: Record<string, number> = {};
              const spendPerYear = Math.round((Number(p.totalCost) || Number(p.budget) || 0) / duration);
              for (let y = start; y <= start + duration - 1; y++) {
                annualSpend[String(y)] = spendPerYear;
              }
              return {
                project: p.name || p.title,
                start,
                end: start + duration - 1,
                annualSpend,
              };
            }),
            tuitionBaseRevenue: baseRevenue,
            cumulativeTuition: cumulativeTuitionExtra,
            studentCount,
          };

          const merged = {
            ...current,
            budgetData: updatedBudgetData,
          };

          window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(merged));
          window.dispatchEvent(
            new CustomEvent('lfjp_page_data_changed', { detail: { budgetData: updatedBudgetData } })
          );
          if (onDataChange) {
            onDataChange(updatedBudgetData);
          }
        }
        setSaveStatus('synced');
      } catch (err) {
        console.error('Error auto-saving budget draft:', err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [
    saveStatus,
    financialData,
    projectsList,
    tuitionSimulationRows,
    baseRevenue,
    cumulativeTuitionExtra,
    studentCount,
    onDataChange,
  ]);

  // Custom Chart Tooltip
  const CustomChartTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Exercice {label}</p>
          <div className="space-y-1.5 text-xs">
            {payload.map((entry) => (
              <div key={`${entry.name}-${entry.dataKey}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name} :
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(Number(entry.value ?? 0))}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="budget-cadre-vie"
      data-currency={currency}
      className="w-full font-raleway text-slate-800"
    >
      {/* Top Header Bar matching lfjp-investissements.netlify.app */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs mb-6 -mx-4 -mt-4 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-200">
            <School className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              LFJP Invest <span className="font-normal text-slate-400 text-sm sm:text-base">| 2026-2030</span>
            </h1>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Plan Pluriannuel d’Investissements & Cadre de Vie
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Toggle */}
          <button
            type="button"
            onClick={() => setCurrency((curr) => (curr === 'XOF' ? 'EUR' : 'XOF'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer"
            title="Changer la devise (FCFA / EUR)"
          >
            {currency === 'XOF' ? (
              <Coins className="w-4 h-4 text-blue-600" />
            ) : (
              <Euro className="w-4 h-4 text-emerald-600" />
            )}
            <span>{currency === 'XOF' ? 'FCFA' : 'EUR'}</span>
          </button>

          {/* Student count pill */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{studentCount}</span>
            <span className="text-slate-400 font-normal">élèves</span>
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={resetAllToDefaults}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            title="Réinitialiser toutes les données aux valeurs par défaut"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* 3 Executive Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Investment */}
        <div
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition hover:shadow-md"
          data-summary-field="totalInvestment"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Investissement Total
              </p>
              <p
                className="text-2xl sm:text-3xl font-bold font-playfair text-slate-900 tracking-tight"
                data-currency-amount={financialData.totalInvestment}
              >
                {formatCurrency(financialData.totalInvestment)}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {projectsList.filter((p) => p.isActive).length} projets actifs programmés
              </p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Funding Gap */}
        <div
          className={`p-5 rounded-xl border shadow-sm transition hover:shadow-md ${
            financialData.fundingGap > 0
              ? 'bg-white border-red-200 ring-1 ring-red-50'
              : 'bg-white border-emerald-200 ring-1 ring-emerald-50'
          }`}
          data-summary-field="fundingGap"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Manque à gagner (Fin 2030)
              </p>
              <p
                className={`text-2xl sm:text-3xl font-bold font-playfair tracking-tight ${
                  financialData.fundingGap > 0 ? 'text-red-600' : 'text-emerald-600'
                }`}
                data-currency-amount={financialData.fundingGap}
              >
                {formatCurrency(financialData.fundingGap)}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {financialData.fundingGap > 0
                  ? 'Besoin net de financement à combler'
                  : 'Capacité d’autofinancement excédentaire'}
              </p>
            </div>
            <div
              className={`p-2.5 rounded-xl border ${
                financialData.fundingGap > 0
                  ? 'bg-red-50 text-red-600 border-red-100'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}
            >
              {financialData.fundingGap > 0 ? (
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>

        {/* Total Capacity */}
        <div
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition hover:shadow-md"
          data-summary-field="estimatedCapacity"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Capacité Totale
              </p>
              <p
                className="text-2xl sm:text-3xl font-bold font-playfair text-emerald-600 tracking-tight"
                data-currency-amount={financialData.totalCapacity}
              >
                {formatCurrency(financialData.totalCapacity)}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Inclut budget base + ANEFE + % Écolages
              </p>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Columns Layout: Projects (col-3), Financial Analysis (col-6), Funding / Tuition (col-3) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* ===================== COLUMN 1 : PROJETS (XL:COL-SPAN-3) ===================== */}
        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-slate-400" />
              Projets
            </h2>
            <div className="flex items-center gap-2">
              {adminMode && (
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition cursor-pointer"
                  title="Ajouter un nouveau projet"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              )}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {projectsList.filter((p) => p.isActive).length}/{projectsList.length} actifs
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {projectsList.map((project) => {
              const startY = project.startYear || 2026;
              const durationY = project.durationYears || 1;
              const endY = startY + durationY - 1;
              const currentCost = Number(project.totalCost) || Number(project.budget) || 0;
              const hasLink = Boolean(project.link);

              let categoryBadge = 'Infrastructure';
              let categoryClasses = 'bg-blue-50 text-blue-700 border-blue-200';
              if (project.category === 'equipment') {
                categoryBadge = 'Équipement';
                categoryClasses = 'bg-orange-50 text-orange-700 border-orange-200';
              } else if (project.category === 'land') {
                categoryBadge = 'Foncier';
                categoryClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              }

              return (
                <div
                  key={project.id}
                  data-project-id={project.id}
                  className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                    project.isActive
                      ? 'border-slate-200 hover:border-slate-300 shadow-sm'
                      : 'border-slate-200/60 opacity-60 bg-slate-50/50'
                  }`}
                >
                  {/* Top card header: category, delete & active switch */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${categoryClasses}`}
                    >
                      {categoryBadge}
                    </span>

                    <div className="flex items-center gap-2">
                      {adminMode && (
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                          title="Supprimer ce projet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Toggle button */}
                      <button
                        type="button"
                        onClick={() => toggleProject(project.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          project.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        aria-label={`Activer ou désactiver ${project.name || project.title}`}
                        title={project.isActive ? 'Désactiver ce projet' : 'Activer ce projet'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            project.isActive ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className="font-bold text-sm text-slate-800 leading-snug"
                    data-project-field="title"
                  >
                    {project.name || project.title}
                  </h3>
                  <p
                    className="text-xs text-slate-500 mt-1 line-clamp-2"
                    data-project-field="description"
                  >
                    {project.description}
                  </p>

                  {/* Period Pickers: Start & End */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                    <div className="relative">
                      <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-medium text-slate-500">
                        Début
                      </label>
                      <select
                        value={startY}
                        disabled={!project.isActive}
                        onChange={(e) => {
                          const newStart = Number(e.target.value);
                          updateProjectPeriod(project.id, newStart, Math.max(newStart, endY));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
                      >
                        {YEARS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-medium text-slate-500">
                        Fin
                      </label>
                      <select
                        value={endY}
                        disabled={!project.isActive}
                        onChange={(e) => {
                          const newEnd = Number(e.target.value);
                          updateProjectPeriod(project.id, Math.min(startY, newEnd), newEnd);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
                      >
                        {YEARS.filter((y) => y >= startY).map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Variable Budget Slider or Fixed Cost */}
                  {project.isVariable && project.variableMin && project.variableMax ? (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-500 font-medium">Budget alloué</span>
                        <span
                          className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs"
                          data-project-field="budget"
                          data-currency-amount={currentCost}
                        >
                          {formatCurrency(currentCost)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={project.variableMin}
                        max={project.variableMax}
                        step={1_000_000}
                        value={currentCost}
                        disabled={!project.isActive}
                        onChange={(e) => updateProjectCost(project.id, Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>{formatCurrency(project.variableMin)}</span>
                        <span>{formatCurrency(project.variableMax)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-xs mt-3 pt-2 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">Coût Total:</span>
                      <span
                        className="font-bold text-slate-900 font-mono"
                        data-project-field="budget"
                        data-currency-amount={currentCost}
                      >
                        {formatCurrency(currentCost)}
                      </span>
                    </div>
                  )}

                  {/* Optional Link to dedicated page */}
                  {hasLink && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100/70 flex justify-end">
                      <a
                        href={project.link}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-french-blue hover:text-blue-700 hover:underline"
                      >
                        Consulter la fiche détaillée
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================== COLUMN 2 : ANALYSE FINANCIÈRE (XL:COL-SPAN-6) ===================== */}
        <div className="xl:col-span-6 space-y-6">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-400" />
              Analyse Financière
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Projection pluriannuelle 2026–2030
            </span>
          </div>

          {/* 1. ComposedChart : Flux de Trésorerie Prévisionnel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Flux de Trésorerie Prévisionnel ({currency === 'XOF' ? 'FCFA' : 'EUR'})
              </h3>
              <span className="text-xs text-slate-400">
                Capacité vs Dépenses par exercice
              </span>
            </div>

            <div className="h-80 w-full" role="img" aria-label="Graphique des flux de trésorerie">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={financialData.timeline}
                  margin={{ top: 15, right: 15, bottom: 15, left: 10 }}
                >
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    dy={8}
                  />
                  <YAxis
                    tickFormatter={compactTickFormatter}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    width={65}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                  />

                  {/* Investment Capacity Step Line */}
                  <Line
                    type="stepAfter"
                    dataKey="investmentCapacity"
                    name="Capacité d'Investissement"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  />

                  {/* Project Costs Bars with conditional red/blue coloring */}
                  <Bar
                    dataKey="projectCosts"
                    name="Dépenses Projets"
                    radius={[4, 4, 0, 0]}
                    barSize={38}
                  >
                    {financialData.timeline.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.projectCosts > entry.investmentCapacity ? '#ef4444' : '#3b82f6'}
                      />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Table : Trésorerie Annuelle */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Trésorerie Annuelle</h3>
              <span className="text-xs text-slate-500 font-medium">Détail des recettes et charges</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Année</th>
                    <th className="px-4 py-3 text-right">Capacité (Base)</th>
                    <th className="px-4 py-3 text-right text-orange-600">Levier Écolages</th>
                    <th className="px-4 py-3 text-right text-blue-600">Dépenses</th>
                    <th className="px-4 py-3 text-right">Solde</th>
                    <th className="px-4 py-3 text-right">Cumul</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {financialData.timeline.map((row) => (
                    <tr
                      key={row.year}
                      className="hover:bg-slate-50/80 transition-colors"
                      data-budget-year={row.year}
                    >
                      <td className="px-4 py-3 font-sans font-bold text-slate-800">{row.label}</td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {formatCurrency(row.baseCapacity)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${
                          row.feeRevenue < 0 ? 'text-red-500' : 'text-orange-600'
                        }`}
                      >
                        {row.feeRevenue > 0 ? '+' : ''}
                        {formatCurrency(row.feeRevenue)}
                      </td>
                      <td className="px-4 py-3 text-right text-blue-600 font-semibold">
                        {formatCurrency(row.projectCosts)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${
                          row.balance >= 0 ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {formatCurrency(row.balance)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${
                          row.accumulatedBalance >= 0 ? 'text-slate-700' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(row.accumulatedBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Interactive Expense Schedule Table (Calendrier des Dépenses Interactif) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Calendrier des Dépenses Interactif ({currency === 'XOF' ? 'FCFA' : 'EUR'})
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full font-medium">
                <MousePointerClick className="w-3 h-3 text-indigo-500" />
                <span>Cliquez sur les cases pour modifier</span>
              </div>
            </div>

            {/* Year columns header */}
            <div className="grid grid-cols-5 gap-1.5 mb-2 text-center">
              {YEARS.map((y) => (
                <div key={y} className="text-xs font-bold text-slate-600 bg-slate-100/70 py-1 rounded">
                  {y}
                </div>
              ))}
            </div>

            {/* Project rows */}
            <div className="space-y-3 mb-4">
              {projectsList.map((project) => {
                const start = project.startYear || 2026;
                const duration = project.durationYears || 1;
                const end = start + duration - 1;
                const cost = Number(project.totalCost) || Number(project.budget) || 0;
                const annualSpend = duration > 0 ? Math.round(cost / duration) : cost;

                return (
                  <div
                    key={project.id}
                    className={`transition-opacity ${project.isActive ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <div
                        className={`w-2 h-2 rounded-full ${project.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      />
                      <span className="text-xs font-semibold text-slate-800 truncate flex-1">
                        {project.name || project.title}
                      </span>
                      {!project.isActive && (
                        <span className="text-[10px] text-slate-400 italic">Inactif</span>
                      )}
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 h-8 bg-slate-50 rounded-md p-1 border border-slate-100">
                      {YEARS.map((y) => {
                        const isActiveYear = project.isActive && y >= start && y <= end;
                        let cellBg = 'bg-blue-500';
                        if (project.category === 'equipment') cellBg = 'bg-orange-500';
                        if (project.category === 'land') cellBg = 'bg-emerald-600';

                        return (
                          <div
                            key={y}
                            onClick={() => handleCalendarCellClick(project, y)}
                            className={`relative flex items-center justify-center text-[10px] font-bold font-mono rounded cursor-pointer transition-all ${
                              isActiveYear
                                ? `${cellBg} text-white shadow-xs hover:brightness-110`
                                : 'hover:bg-slate-200/70 text-slate-300'
                            }`}
                            title={`${project.name || project.title} (${y}) : ${
                              isActiveYear ? formatCurrency(annualSpend) : 'Cliquer pour activer'
                            }`}
                          >
                            {isActiveYear ? compactTickFormatter(annualSpend) : '·'}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total annual row */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Total annuel dépenses projets
              </p>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {financialData.timeline.map((row) => (
                  <div
                    key={row.year}
                    className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/80 font-mono text-xs font-bold text-blue-700"
                  >
                    {compactTickFormatter(row.projectCosts)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===================== COLUMN 3 : FINANCEMENT & ÉCOLAGES (XL:COL-SPAN-3) ===================== */}
        <div className="xl:col-span-3">
          <div className="sticky top-20 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-slate-400" />
              Financement
            </h2>

            {/* Simulation Ecolages Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                    <Coins className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Simulation Écolages</h3>
                </div>
                <p className="text-xs text-slate-600">
                  Base revenus :{' '}
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(baseRevenue)}
                  </span>
                </p>
              </div>

              {/* Rows */}
              <div className="p-4 space-y-3">
                {tuitionSimulationRows.map((item) => (
                  <div
                    key={item.year}
                    className="flex items-center gap-2.5 text-xs sm:text-sm"
                  >
                    <div className="w-12 font-bold text-slate-700">{item.year}</div>
                    <div className="flex-1 bg-slate-50 rounded-lg p-1.5 flex items-center gap-1.5 border border-slate-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                      <input
                        type="number"
                        min="-20"
                        max="30"
                        step="0.1"
                        value={item.rate}
                        onChange={(e) =>
                          handleRateChange(item.year, parseFloat(e.target.value) || 0)
                        }
                        className={`w-14 bg-transparent font-bold text-right outline-hidden text-xs sm:text-sm ${
                          item.rate < 0 ? 'text-red-500' : 'text-slate-900'
                        }`}
                      />
                      <span className="text-slate-400 font-semibold">%</span>
                    </div>
                    <div
                      className={`w-28 text-right font-mono font-bold text-xs ${
                        item.extraRevenue >= 0 ? 'text-orange-600' : 'text-red-500'
                      }`}
                    >
                      {item.extraRevenue > 0 ? '+' : ''}
                      {formatCurrency(item.extraRevenue)}
                    </div>
                  </div>
                ))}

                {/* Cumulative Extra Tuition Footer */}
                <div className="mt-4 pt-3.5 border-t border-slate-100">
                  <div className="flex justify-between items-center bg-orange-50/80 p-3 rounded-xl border border-orange-100">
                    <div>
                      <span className="text-xs font-semibold text-orange-900 block">
                        Cumul généré
                      </span>
                      <span className="text-[10px] text-orange-700">2026–2030</span>
                    </div>
                    <span className="font-mono font-bold text-sm sm:text-base text-orange-700">
                      +{formatCurrency(cumulativeTuitionExtra)}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                    Ajustez les pourcentages d’augmentation pour simuler l’impact direct sur la capacité de trésorerie et la résorption du gap d’investissement.
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Highlights */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-french-blue font-bold">
                <Info className="w-4 h-4 shrink-0" />
                <span>Règles de modélisation</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Capacité socle : 70M FCFA/an (2026-2027), portée à 100M FCFA dès 2028.</li>
                <li>Les leviers écolages s’ajoutent en cumul annuel pour financer les grands équipements.</li>
                <li>Dépenses réparties uniformément sur la durée d’exécution du projet.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCadreVieInfrastructures;
