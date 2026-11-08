import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  Coins,
  Euro,
  FolderKanban,
  Info,
  Layers,
  MousePointerClick,
  Pencil,
  PiggyBank,
  Plus,
  RefreshCw,
  Sun,
  Trash2,
  Trees,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
  Waves,
  Wind,
  Wrench,
  X,
} from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
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

const XOF_TO_EUR = 655.957;
const YEARS = [2026, 2027, 2028, 2029, 2030];
const EXTENDED_YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];
const DEFAULT_BASE_REVENUE = 1_203_146_500;

export const getProjectIcon = (id: string, title?: string, className = 'w-3 h-3') => {
  const s = `${id} ${title || ''}`.toLowerCase();
  if (s.includes('clim')) return <Wind className={className} />;
  if (s.includes('solaire') || s.includes('solar')) return <Sun className={className} />;
  if (s.includes('piscine') || s.includes('pool')) return <Waves className={className} />;
  if (s.includes('cantine') || s.includes('restauration')) return <UtensilsCrossed className={className} />;
  if (s.includes('foncier') || s.includes('terrain')) return <Trees className={className} />;
  return <Building2 className={className} />;
};

export interface AdminBudgetDashboardProps {
  onDataChange?: (data: BudgetData) => void;
}

export const AdminBudgetDashboard: React.FC<AdminBudgetDashboardProps> = ({
  onDataChange,
}) => {
  const [currency, setCurrency] = useState<'XOF' | 'EUR'>('XOF');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'synced'>('synced');
  const [editingProject, setEditingProject] = useState<BudgetProject | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Helper to detect outdated / desynchronized drafts (e.g. old schema or missing projects)
  const isStaleProjectList = useCallback((projects?: BudgetProject[]): boolean => {
    if (!projects || !Array.isArray(projects) || projects.length === 0) return true;
    const hasCouverture3Years = projects.some(
      (p) =>
        (p.id.includes('sport') || p.title.toLowerCase().includes('couverture')) &&
        (p.durationYears === 3 || p.period?.includes('2028'))
    );
    return hasCouverture3Years;
  }, []);

  // Load initial budget data from pageData or draft, prioritizing official 775M dataset
  const initialData = useMemo<BudgetData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.budgetData?.projects && !isStaleProjectList(parsed.budgetData.projects)) {
            return parsed.budgetData as BudgetData;
          }
        }
      } catch {
        // fallback
      }
    }
    const pageDataBudget = (pageDataFile as { budgetData?: BudgetData }).budgetData;
    if (pageDataBudget?.projects && !isStaleProjectList(pageDataBudget.projects)) {
      return pageDataBudget;
    }
    return defaultBudgetData;
  }, [isStaleProjectList]);

  // Normalization: Ensure all projects have the required interactive fields matching psd-lfjp.netlify.app & psd-lfjp.vercel.app
  const normalizeProjects = useCallback((rawProjects?: BudgetProject[]): BudgetProject[] => {
    const list = rawProjects && Array.isArray(rawProjects) && rawProjects.length > 0 && !isStaleProjectList(rawProjects)
      ? rawProjects
      : defaultBudgetData.projects;

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
        id: p.id || defaultMatch?.id || `proj-${idx}`,
        title: p.title || p.name || defaultMatch?.title || 'Projet',
        name: p.name || p.title || defaultMatch?.name || 'Projet',
        category,
        isActive: p.isActive !== false,
        isVariable: isVar,
        variableMin: varMin,
        variableMax: varMax,
        startYear: Math.max(2026, Math.min(2035, startYear)),
        durationYears: Math.max(1, Math.min(10, durationYears)),
        totalCost: budgetVal,
        budget: budgetVal,
        description: p.description || defaultMatch?.description || '',
        period: p.period || `${startYear}${durationYears > 1 ? ` – ${startYear + durationYears - 1}` : ''}`,
        color: p.color || defaultMatch?.color || 'from-sky-100 to-sky-50',
        link: p.link || defaultMatch?.link,
      };
    });
  }, [isStaleProjectList]);

  const [projectsList, setProjectsList] = useState<BudgetProject[]>(() =>
    normalizeProjects(initialData.projects)
  );

  const projectsRef = useRef(projectsList);
  useEffect(() => {
    projectsRef.current = projectsList;
  }, [projectsList]);

  // Self-heal stale localStorage draft on mount only if genuinely corrupt
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.budgetData?.projects && isStaleProjectList(parsed.budgetData.projects)) {
            parsed.budgetData = defaultBudgetData;
            window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(parsed));
            setProjectsList(normalizeProjects(defaultBudgetData.projects));
          }
        }
      } catch {
        // ignore
      }
    }
  }, [isStaleProjectList, normalizeProjects]);

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

  const baseRevenue = initialData.tuitionBaseRevenue || DEFAULT_BASE_REVENUE;

  // Sync with global custom events or local storage changes without infinite loops
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.budgetData?.projects) {
            const nextList = normalizeProjects(parsed.budgetData.projects);
            const currentSig = projectsRef.current.map((p) => `${p.id}:${p.isActive}:${p.totalCost || p.budget}:${p.startYear}:${p.durationYears}`).join('|');
            const nextSig = nextList.map((p) => `${p.id}:${p.isActive}:${p.totalCost || p.budget}:${p.startYear}:${p.durationYears}`).join('|');
            if (currentSig !== nextSig) {
              setProjectsList(nextList);
            }
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
      if (customEvt.detail?.source === 'admin_budget_dashboard') {
        return;
      }
      if (customEvt.detail?.budgetData?.projects) {
        const nextList = normalizeProjects(customEvt.detail.budgetData.projects);
        const currentSig = projectsRef.current.map((p) => `${p.id}:${p.isActive}:${p.totalCost || p.budget}:${p.startYear}:${p.durationYears}`).join('|');
        const nextSig = nextList.map((p) => `${p.id}:${p.isActive}:${p.totalCost || p.budget}:${p.startYear}:${p.durationYears}`).join('|');
        if (currentSig !== nextSig) {
          setProjectsList(nextList);
        }
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

  // Project Handlers
  const toggleProject = useCallback((id: string) => {
    setProjectsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    setSaveStatus('saved');
  }, []);

  const updateProjectCost = useCallback((id: string, newCost: number) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const val = Math.max(0, newCost);
        const vMin = p.variableMin && p.variableMin > val ? Math.round(val * 0.5) : (p.variableMin ?? Math.round(val * 0.5));
        const vMax = p.variableMax && p.variableMax < val ? Math.round(val * 1.5) : (p.variableMax ?? Math.round(val * 1.5));
        return {
          ...p,
          totalCost: val,
          budget: val,
          variableMin: vMin,
          variableMax: vMax,
        };
      })
    );
    setSaveStatus('saved');
  }, []);

  const updateProjectCategory = useCallback((id: string, newCategory: 'equipment' | 'infra' | 'land') => {
    const colorMap: Record<'equipment' | 'infra' | 'land', string> = {
      equipment: 'from-sky-100 to-sky-50',
      infra: 'from-blue-100 to-indigo-50',
      land: 'from-lime-100 to-emerald-50',
    };
    setProjectsList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, category: newCategory, color: colorMap[newCategory] || p.color } : p
      )
    );
    setSaveStatus('saved');
  }, []);

  const updateProjectPeriod = useCallback((id: string, startYear: number, endYear: number) => {
    const s = Math.max(2026, Math.min(2035, startYear));
    const e = Math.max(s, Math.min(2035, endYear));
    const duration = e - s + 1;
    setProjectsList((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              startYear: s,
              durationYears: duration,
              period: `${s}${duration > 1 ? ` – ${e}` : ''}`,
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

  const openAddProjectModal = useCallback(() => {
    const newId = `proj-${Date.now()}`;
    const newProject: BudgetProject = {
      id: newId,
      title: '',
      name: '',
      category: 'infra',
      description: '',
      period: '2026 – 2027',
      budget: 50_000_000,
      totalCost: 50_000_000,
      startYear: 2026,
      durationYears: 2,
      isActive: true,
      isVariable: true,
      variableMin: 25_000_000,
      variableMax: 80_000_000,
      color: 'from-blue-100 to-indigo-50',
      link: '',
    };
    setEditingProject(newProject);
    setIsAddingNew(true);
  }, []);

  const openEditProjectModal = useCallback((project: BudgetProject) => {
    setEditingProject({ ...project });
    setIsAddingNew(false);
  }, []);

  const saveModalProject = useCallback((projectToSave: BudgetProject) => {
    const s = Math.max(2026, Math.min(2035, projectToSave.startYear || 2026));
    const duration = Math.max(1, projectToSave.durationYears || 1);
    const e = Math.min(2035, s + duration - 1);
    const finalDuration = e - s + 1;
    const periodStr = `${s}${finalDuration > 1 ? ` – ${e}` : ''}`;
    const budgetVal = Math.max(0, Number(projectToSave.totalCost) || Number(projectToSave.budget) || 0);

    const colorMap: Record<'equipment' | 'infra' | 'land', string> = {
      equipment: 'from-sky-100 to-sky-50',
      infra: 'from-blue-100 to-indigo-50',
      land: 'from-lime-100 to-emerald-50',
    };
    const cat = projectToSave.category || 'infra';
    const finalTitle = (projectToSave.title || projectToSave.name || '').trim() || 'Nouveau projet';

    const normalized: BudgetProject = {
      ...projectToSave,
      id: projectToSave.id || `proj-${Date.now()}`,
      title: finalTitle,
      name: finalTitle,
      category: cat,
      color: colorMap[cat] || 'from-blue-100 to-indigo-50',
      startYear: s,
      durationYears: finalDuration,
      period: periodStr,
      budget: budgetVal,
      totalCost: budgetVal,
      isVariable: true,
      variableMin: Math.round(budgetVal * 0.5),
      variableMax: Math.max(budgetVal + 20_000_000, Math.round(budgetVal * 1.5)),
      isActive: projectToSave.isActive ?? true,
    };

    setProjectsList((prev) => {
      const exists = prev.some((p) => p.id === normalized.id);
      if (exists) {
        return prev.map((p) => (p.id === normalized.id ? normalized : p));
      }
      return [...prev, normalized];
    });

    setEditingProject(null);
    setIsAddingNew(false);
    setSaveStatus('saved');
  }, []);

  const handleDeleteProject = useCallback((id: string) => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm('Voulez-vous vraiment supprimer ce projet d’investissement ?');
      if (!ok) return;
    }
    setProjectsList((prev) => prev.filter((p) => p.id !== id));
    if (editingProject?.id === id) {
      setEditingProject(null);
    }
    setSaveStatus('saved');
  }, [editingProject]);

  const resetAllToDefaults = useCallback(() => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(
        'Voulez-vous vraiment réinitialiser toutes les données de simulation aux valeurs officielles (775 M FCFA) ?'
      );
      if (!ok) return;
    }
    setProjectsList(normalizeProjects(defaultBudgetData.projects));
    setFeeRates({ 2026: 5.4, 2027: 0.4, 2028: 0.0, 2029: 0.0, 2030: 0.0 });
    setSaveStatus('saved');
  }, [normalizeProjects]);

  // Financial Calculations based on official psd-lfjp base capacities
  const baseCapacities: Record<number, number> = useMemo(() => ({
    2026: 43_000_000,
    2027: 37_000_000,
    2028: 62_000_000,
    2029: 54_000_001,
    2030: 54_000_000,
  }), []);

  const calendarYears = useMemo(() => {
    const maxEnd = projectsList.reduce((max, p) => {
      const s = p.startYear || 2026;
      const d = p.durationYears || 1;
      return Math.max(max, s + d - 1);
    }, 2030);
    const endYear = Math.min(2035, Math.max(2030, maxEnd));
    const count = endYear - 2026 + 1;
    return Array.from({ length: count }, (_, i) => 2026 + i);
  }, [projectsList]);

  const financialData = useMemo(() => {
    let accumulatedBalance = 0;
    let compoundTuition = baseRevenue;

    const timeline = calendarYears.map((year) => {
      const baseCap = baseCapacities[year] || 54_000_000;
      const rate = feeRates[year] || 0;
      compoundTuition = compoundTuition * (1 + rate / 100);
      const feeRevenue = Math.round(compoundTuition - baseRevenue);
      const investmentCapacity = baseCap + feeRevenue;

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

    const totalInvestment = projectsList
      .filter((p) => p.isActive)
      .reduce((sum, p) => sum + (Number(p.totalCost) || Number(p.budget) || 0), 0);

    // Cumul des flux annuels d'exploitation (socle LFJP + leviers écolages)
    const annualCashFlowTotal = timeline.reduce((sum, r) => sum + r.investmentCapacity, 0);

    // Dotation & subvention officielle ANEFE + réserves foncières (alignement officiel Netlify : 685 139 418 FCFA)
    const ANEFE_GRANT = 89_999_998;
    const totalCapacity = annualCashFlowTotal + ANEFE_GRANT;

    // Manque à gagner / besoin net de financement à combler à l'horizon 2030 (ex: 775 000 000 - 685 139 418 = 89 860 582 FCFA)
    const fundingGap = Math.max(0, totalInvestment - totalCapacity);
    const yearsWithDeficit = timeline.filter((r) => r.balance < 0).length;

    return {
      timeline,
      annualCashFlowTotal,
      ANEFE_GRANT,
      totalInvestment,
      totalCapacity,
      fundingGap,
      yearsWithDeficit,
    };
  }, [projectsList, feeRates, baseRevenue, baseCapacities, calendarYears]);

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
              solde: t.balance,
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
          };

          const merged = {
            ...current,
            budgetData: updatedBudgetData,
          };

          window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(merged));
          window.dispatchEvent(
            new CustomEvent('lfjp_page_data_changed', {
              detail: { budgetData: updatedBudgetData, source: 'admin_budget_dashboard' },
            })
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
    onDataChange,
  ]);

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
      id="admin-budget-dashboard"
      data-currency={currency}
      className="w-full max-w-full overflow-x-hidden min-w-0 font-raleway text-slate-800 space-y-6"
    >
      {/* Top Action Bar without 'LFJP Invest' and without '630 élèves' */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            Modulation des investissements 2026–2030
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">•</span>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Données officielles LFJP (775 M FCFA)
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
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

          {/* Reset button */}
          <button
            type="button"
            onClick={resetAllToDefaults}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            title="Réinitialiser toutes les données aux valeurs officielles (775 M FCFA)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* 3 Executive Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Investment */}
        <div
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs transition hover:shadow-md min-w-0"
          data-summary-field="totalInvestment"
        >
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Investissement Total
              </p>
              <p
                className="text-lg sm:text-xl xl:text-2xl font-bold font-playfair text-slate-900 tracking-tight"
                data-currency-amount={financialData.totalInvestment}
              >
                {formatCurrency(financialData.totalInvestment)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {projectsList.filter((p) => p.isActive).length} projets actifs programmés
              </p>
            </div>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 border border-blue-100 shrink-0">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Funding Gap */}
        <div
          className={`p-3.5 sm:p-4 rounded-xl border shadow-xs transition hover:shadow-md min-w-0 ${
            financialData.fundingGap > 0
              ? 'bg-white border-red-200 ring-1 ring-red-50'
              : 'bg-white border-emerald-200 ring-1 ring-emerald-50'
          }`}
          data-summary-field="fundingGap"
        >
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Manque à gagner (Fin 2030)
              </p>
              <p
                className={`text-lg sm:text-xl xl:text-2xl font-bold font-playfair tracking-tight ${
                  financialData.fundingGap > 0 ? 'text-red-600' : 'text-emerald-600'
                }`}
                data-currency-amount={financialData.fundingGap}
              >
                {formatCurrency(financialData.fundingGap)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {financialData.fundingGap > 0
                  ? 'Besoin net de financement à combler'
                  : 'Capacité d’autofinancement excédentaire'}
              </p>
            </div>
            <div
              className={`p-1.5 rounded-lg border shrink-0 ${
                financialData.fundingGap > 0
                  ? 'bg-red-50 text-red-600 border-red-100'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}
            >
              {financialData.fundingGap > 0 ? (
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>

        {/* Total Capacity */}
        <div
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs transition hover:shadow-md min-w-0"
          data-summary-field="estimatedCapacity"
        >
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Capacité Totale
              </p>
              <p
                className="text-lg sm:text-xl xl:text-2xl font-bold font-playfair text-emerald-600 tracking-tight"
                data-currency-amount={financialData.totalCapacity}
              >
                {formatCurrency(financialData.totalCapacity)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Inclut budget base + ANEFE + % Écolages
              </p>
            </div>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100 shrink-0">
              <Wallet className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Columns Layout: Projects (col-3), Financial Analysis (col-6), Funding / Tuition (col-3) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full min-w-0">
        {/* ===================== COLUMN 1 : PROJETS (XL:COL-SPAN-3) ===================== */}
        <div className="xl:col-span-3 space-y-4 min-w-0 w-full">
          <div className="flex items-center justify-between gap-1.5 pb-1">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1 min-w-0 shrink-0">
              <FolderKanban className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Projets ({projectsList.length})</span>
            </h2>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {projectsList.filter((p) => p.isActive).length} actifs
              </span>
              <button
                type="button"
                onClick={openAddProjectModal}
                className="inline-flex items-center gap-1 h-5 px-1.5 text-[10px] font-bold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                title="Ajouter un nouveau projet d’investissement"
              >
                <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {projectsList.map((project) => {
              const startY = project.startYear || 2026;
              const durationY = project.durationYears || 1;
              const endY = startY + durationY - 1;
              const currentCost = Number(project.totalCost) || Number(project.budget) || 0;
              const hasLink = Boolean(project.link);

              return (
                <div
                  key={project.id}
                  data-project-id={project.id}
                  className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-200 ${
                    project.isActive
                      ? 'bg-white border-slate-200 shadow-xs'
                      : 'bg-slate-50/80 border-slate-200 opacity-70'
                  }`}
                >
                  {/* Top Row: Mini Icon + Title & actions + Ultra-compact Switch */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                          project.isActive ? 'bg-slate-100 text-slate-700' : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {getProjectIcon(project.id, project.title, 'w-2.5 h-2.5')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <h3 className="font-bold text-slate-800 text-xs sm:text-[13px] leading-tight">
                            {project.name || project.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => openEditProjectModal(project)}
                            className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition cursor-pointer"
                            title="Modifier ce projet"
                          >
                            <Pencil className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-slate-400 hover:text-red-600 p-0.5 rounded transition cursor-pointer"
                            title="Supprimer ce projet"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Compact toggle switch cocher / décocher (non-rebounding button) */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={project.isActive}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProject(project.id);
                      }}
                      className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        project.isActive ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                      title={project.isActive ? 'Projet actif (cliquer pour décocher)' : 'Projet inactif (cliquer pour cocher)'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                          project.isActive ? 'translate-x-3' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Period Start & End with floating labels */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="relative">
                      <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-medium text-slate-500 z-10">
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
                        {EXTENDED_YEARS.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-medium text-slate-500 z-10">
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
                        {EXTENDED_YEARS.filter((y) => y >= startY).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Budget Allocation: Slider for variable, total cost for fixed */}
                  {project.isVariable ? (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Budget alloué :</span>
                        <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                          <input
                            type="number"
                            min={0}
                            step={1_000_000}
                            value={currentCost}
                            disabled={!project.isActive}
                            onChange={(e) => updateProjectCost(project.id, Number(e.target.value) || 0)}
                            className="w-24 px-1.5 py-0.5 text-xs font-mono font-bold text-blue-700 bg-blue-50/60 border border-blue-200 rounded text-right focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                            title="Saisir le montant exact en FCFA"
                          />
                          <span className="text-[10px] text-slate-500 font-bold">{currency === 'XOF' ? 'FCFA' : 'EUR'}</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={project.variableMin || Math.round(currentCost * 0.5)}
                        max={project.variableMax || Math.max(currentCost + 20_000_000, Math.round(currentCost * 1.5))}
                        step={1_000_000}
                        value={currentCost}
                        disabled={!project.isActive}
                        onChange={(e) => updateProjectCost(project.id, Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>{formatCurrency(project.variableMin || Math.round(currentCost * 0.5))}</span>
                        <span>{formatCurrency(project.variableMax || Math.max(currentCost + 20_000_000, Math.round(currentCost * 1.5)))}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">Coût total :</span>
                      <span className="font-mono font-bold text-slate-800">{formatCurrency(currentCost)}</span>
                    </div>
                  )}

                  {hasLink && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100/70 flex justify-end">
                      <a
                        href={project.link}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
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
        <div className="xl:col-span-6 space-y-6 min-w-0 w-full overflow-hidden">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-slate-400 shrink-0" />
              Analyse Financière
            </h2>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Exercices 2026–2030 (Capacité 685 M vs Dépenses 775 M)
            </span>
          </div>

          {/* 1. ComposedChart : Flux de Trésorerie Prévisionnel */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm">
                Flux de Trésorerie Prévisionnel ({currency === 'XOF' ? 'FCFA' : 'EUR'})
              </h3>
              <span className="text-xs text-slate-400">
                Capacité vs Dépenses
              </span>
            </div>

            <div className="h-72 w-full min-w-0 overflow-hidden" role="img" aria-label="Graphique des flux de trésorerie">
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

                  <Line
                    type="stepAfter"
                    dataKey="investmentCapacity"
                    name="Capacité d'Investissement"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  />

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
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Trésorerie Annuelle</h3>
                <p className="text-xs text-slate-400">Recettes, dépenses et soldes annuels</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Année</th>
                    <th className="px-4 py-3 text-right">Capacité (Base)</th>
                    <th className="px-4 py-3 text-right text-orange-600">Levier Écolages</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-700">Recettes Totales</th>
                    <th className="px-4 py-3 text-right text-red-500">Dépenses Projets</th>
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
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {formatCurrency(row.investmentCapacity)}
                      </td>
                      <td className="px-4 py-3 text-right text-red-500 font-semibold">
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
                        className={`px-4 py-3 text-right font-semibold ${
                          row.accumulatedBalance >= 0 ? 'text-slate-600' : 'text-red-500'
                        }`}
                      >
                        {formatCurrency(row.accumulatedBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200 text-xs font-semibold">
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-slate-800">Sous-total Trésorerie</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">
                      {formatCurrency(financialData.timeline.reduce((s, r) => s + r.baseCapacity, 0))}
                    </td>
                    <td className="px-4 py-2.5 text-right text-orange-600 font-bold">
                      +{formatCurrency(financialData.timeline.reduce((s, r) => s + r.feeRevenue, 0))}
                    </td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-slate-900">
                      {formatCurrency(financialData.annualCashFlowTotal)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-red-500 font-extrabold">
                      {formatCurrency(financialData.totalInvestment)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-red-600">
                      {formatCurrency(financialData.annualCashFlowTotal - financialData.totalInvestment)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-600 font-semibold">
                      {formatCurrency(financialData.timeline[financialData.timeline.length - 1]?.accumulatedBalance ?? 0)}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/50 text-emerald-900">
                    <td colSpan={3} className="px-4 py-2 font-bold text-emerald-800">
                      + Dotation & Subvention ANEFE / Réserves foncières
                    </td>
                    <td className="px-4 py-2 text-right font-extrabold text-emerald-700">
                      +{formatCurrency(financialData.ANEFE_GRANT)}
                    </td>
                    <td className="px-4 py-2 text-right text-xs text-slate-400">
                      Capacité totale : {formatCurrency(financialData.totalCapacity)}
                    </td>
                    <td className="px-4 py-2 text-right font-extrabold text-emerald-700">
                      +{formatCurrency(financialData.ANEFE_GRANT)}
                    </td>
                    <td className="px-4 py-2 text-right font-extrabold text-emerald-700">
                      +{formatCurrency(financialData.ANEFE_GRANT)}
                    </td>
                  </tr>
                  <tr className="bg-slate-100/90 text-slate-900 font-bold">
                    <td colSpan={3} className="px-4 py-2.5 uppercase tracking-wider text-[11px] text-slate-700">
                      Bilan Net à l'horizon 2030 (Besoin de Financement Résiduel)
                    </td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-emerald-700">
                      {formatCurrency(financialData.totalCapacity)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-blue-600">
                      {formatCurrency(financialData.totalInvestment)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-red-600">
                      -{formatCurrency(financialData.fundingGap)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-red-600">
                      -{formatCurrency(financialData.fundingGap)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 3. Interactive Expense Schedule Table */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Calendrier des Dépenses Interactif ({currency === 'XOF' ? 'FCFA' : 'EUR'})
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full font-medium">
                <MousePointerClick className="w-3 h-3 text-indigo-500" />
                <span>Cliquez sur les cases pour modifier</span>
              </div>
            </div>

            <div className="overflow-x-auto w-full -mx-1 px-1">
              <div className="min-w-[320px]">
                <div
                  className="grid gap-1.5 mb-2 text-center"
                  style={{ gridTemplateColumns: `repeat(${calendarYears.length}, minmax(0, 1fr))` }}
                >
                  {calendarYears.map((y) => (
                    <div key={y} className="text-xs font-bold text-slate-600 bg-slate-100/70 py-1 rounded">
                      {y}
                    </div>
                  ))}
                </div>

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

                        <div
                          className="grid gap-1.5 h-8 bg-slate-50 rounded-md p-1 border border-slate-100"
                          style={{ gridTemplateColumns: `repeat(${calendarYears.length}, minmax(0, 1fr))` }}
                        >
                          {calendarYears.map((y) => {
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

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Total annuel dépenses projets
                  </p>
                  <div
                    className="grid gap-1.5 text-center"
                    style={{ gridTemplateColumns: `repeat(${financialData.timeline.length}, minmax(0, 1fr))` }}
                  >
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
          </div>
        </div>

        {/* ===================== COLUMN 3 : FINANCEMENT & ÉCOLAGES (XL:COL-SPAN-3) ===================== */}
        <div className="xl:col-span-3 min-w-0 w-full sticky top-20">
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <PiggyBank className="w-4 h-4 text-slate-400 shrink-0" />
              Financement & Écolages
            </h2>

            {/* Simulation Ecolages Card */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 bg-orange-100 text-orange-600 rounded-md shrink-0">
                    <Coins className="w-3.5 h-3.5" />
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
                      className={`text-right font-mono font-bold text-xs shrink-0 ${
                        item.extraRevenue >= 0 ? 'text-orange-600' : 'text-red-500'
                      }`}
                    >
                      {item.extraRevenue > 0 ? '+' : ''}
                      {formatCurrency(item.extraRevenue)}
                    </div>
                  </div>
                ))}

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

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-french-blue font-bold">
                <Info className="w-4 h-4 shrink-0" />
                <span>Règles de modélisation</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Capacité annuelle socle : 43M (2026), 37M (2027), 62M (2028), 54M (2029-2030).</li>
                <li>Les leviers écolages s’ajoutent en cumul annuel pour financer les grands équipements.</li>
                <li>Dépenses réparties uniformément sur la durée d’exécution du projet.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit / Add Project Modal Dialog */}
      {editingProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {isAddingNew ? 'Ajouter un nouveau projet' : 'Modifier le projet d’investissement'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Planification budgétaire et programmation pluriannuelle 2026–2030
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              {/* Statut d'activation du projet (Harmonisé en haut, sans débordement) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      editingProject.isActive ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-300'
                    }`}
                  />
                  <div>
                    <p className="font-bold text-xs text-slate-800">
                      {editingProject.isActive ? 'Projet actif dans le budget' : 'Projet désactivé (hors budget)'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {editingProject.isActive
                        ? 'Inclus dans les totaux, flux de trésorerie et graphiques.'
                        : 'Exclu des totaux, graphiques et simulations.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProject({ ...editingProject, isActive: !editingProject.isActive })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    editingProject.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                  aria-label="Activer ou désactiver le projet"
                  title={editingProject.isActive ? 'Désactiver ce projet' : 'Activer ce projet'}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      editingProject.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Titre */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Titre du projet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingProject.title || editingProject.name || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value, name: e.target.value })}
                  placeholder="ex: Restauration scolaire, Climatisation phases 2 & 3..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Catégorie de l'investissement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'infra', label: 'Infrastructure', desc: 'Bâtiments, préaux, sport', icon: Building2, color: 'border-blue-300 bg-blue-50/50 text-blue-800' },
                    { id: 'equipment', label: 'Équipement', desc: 'Climatisation, solaire, tech', icon: Wrench, color: 'border-orange-300 bg-orange-50/50 text-orange-800' },
                    { id: 'land', label: 'Foncier', desc: 'Terrains, réserves foncières', icon: Trees, color: 'border-emerald-300 bg-emerald-50/50 text-emerald-800' },
                  ].map((c) => {
                    const Icon = c.icon;
                    const isSelected = (editingProject.category || 'infra') === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setEditingProject({ ...editingProject, category: c.id as 'infra' | 'equipment' | 'land' })}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                          isSelected ? `${c.color} ring-2 ring-blue-500 font-bold shadow-xs` : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Icon className="w-4 h-4" />
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-bold text-xs">{c.label}</p>
                          <p className="text-[10px] text-slate-500 font-normal">{c.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Total */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    Budget prévisionnel total (FCFA) <span className="text-red-500">*</span>
                  </label>
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {formatCurrency(Number(editingProject.totalCost) || Number(editingProject.budget) || 0)}
                  </span>
                </div>
                <input
                  type="number"
                  min={0}
                  step={1_000_000}
                  value={Number(editingProject.totalCost) || Number(editingProject.budget) || 0}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value) || 0);
                    setEditingProject({ ...editingProject, budget: val, totalCost: val });
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
                />
                {/* Quick amount shortcuts */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 self-center mr-1">Raccourcis :</span>
                  {[25_000_000, 50_000_000, 60_000_000, 75_000_000, 100_000_000, 125_000_000, 200_000_000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, budget: amt, totalCost: amt })}
                      className="px-2 py-0.5 text-[10px] rounded-md bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 transition font-mono cursor-pointer"
                    >
                      {(amt / 1_000_000).toFixed(0)} M
                    </button>
                  ))}
                </div>
              </div>

              {/* Période Début - Fin (Supporte jusqu'à 2035) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Année de début
                  </label>
                  <select
                    value={editingProject.startYear || 2026}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      const curEnd = (editingProject.startYear || 2026) + (editingProject.durationYears || 1) - 1;
                      const newEnd = Math.max(s, curEnd);
                      setEditingProject({
                        ...editingProject,
                        startYear: s,
                        durationYears: newEnd - s + 1,
                      });
                    }}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg font-semibold bg-white cursor-pointer"
                  >
                    {EXTENDED_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Année de fin
                  </label>
                  <select
                    value={(editingProject.startYear || 2026) + (editingProject.durationYears || 1) - 1}
                    onChange={(e) => {
                      const end = Number(e.target.value);
                      const s = editingProject.startYear || 2026;
                      setEditingProject({
                        ...editingProject,
                        durationYears: Math.max(1, end - s + 1),
                      });
                    }}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg font-semibold bg-white cursor-pointer"
                  >
                    {EXTENDED_YEARS.filter((y) => y >= (editingProject.startYear || 2026)).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description de l'action ou des travaux
                </label>
                <textarea
                  rows={2}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Précisez le périmètre des investissements..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50">
              {!isAddingNew ? (
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteProject(editingProject.id);
                  }}
                  className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => saveModalProject(editingProject)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAddingNew ? 'Ajouter le projet' : 'Enregistrer les modifications'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBudgetDashboard;
