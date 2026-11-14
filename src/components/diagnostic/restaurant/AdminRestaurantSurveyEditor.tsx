import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BarChart3,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Link2,
} from 'lucide-react';
import type { RestaurantPageData } from '@/data/restaurantPageData';
import { usePrivilegedAccess } from '@/lib/authAccess';
import { LocaleNumberInput } from '@/components/ui/locale-number-input';
import { parseLocaleNumber, sanitizeNumberOrFallback, sanitizeRestaurantDataset } from '@/lib/pageDataSanitizer';
import {
  computeRestaurantAnalytics,
  rebalancePieDistribution,
  recalculateStudentDistribution,
  toSafeString,
} from './restaurantCorrelations';

export interface AdminRestaurantSurveyEditorProps {
  restaurant: RestaurantPageData;
  onChange: (updated: RestaurantPageData) => void;
}

export const AdminRestaurantSurveyEditor: React.FC<AdminRestaurantSurveyEditorProps> = ({
  restaurant,
  onChange,
}) => {
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'student' | 'interest' | 'lunch' | 'days' | 'meals' | 'prices' | 'metrics'
  >('student');

  if (!isPrivileged || !showEditorControls) {
    return null;
  }

  const emitSanitized = (next: Partial<RestaurantPageData>) => {
    onChange(sanitizeRestaurantDataset(next) as unknown as RestaurantPageData);
  };

  // Helper to re-balance student percentages to 100%
  const rebalanceStudentPercentages = () => {
    const recalculated = recalculateStudentDistribution(restaurant.studentDistributionData || []);
    const totalPct = recalculated.reduce((s, it) => s + it.percentage, 0);
    if (totalPct > 0 && recalculated.length > 0) {
      const diff = Math.round((100 - totalPct) * 10) / 10;
      if (diff !== 0) {
        recalculated[0].percentage = Math.max(0, Math.round((recalculated[0].percentage + diff) * 10) / 10);
      }
    }
    emitSanitized({ ...restaurant, studentDistributionData: recalculated });
  };

  // Helper to rebalance any PieChart to 100%
  const rebalancePieChart = (key: 'priceForDishData' | 'priceForMenuData' | 'restaurationInterestData') => {
    const list = restaurant[key] || [];
    const updated = rebalancePieDistribution(list);
    const nextRestaurant: RestaurantPageData = { ...restaurant, [key]: updated };

    // Synchronize correlated metrics cleanly
    if (key === 'restaurationInterestData' && nextRestaurant.keyMetrics?.[0]) {
      const oui = updated.find((it) => toSafeString(it.name).trim().toLowerCase() === 'oui') || updated[0];
      const metrics = [...nextRestaurant.keyMetrics];
      metrics[0] = { ...metrics[0], value: oui?.value ?? 0 };
      nextRestaurant.keyMetrics = metrics;
    } else if (key === 'priceForDishData' && nextRestaurant.keyMetrics?.[2]) {
      const metrics = [...nextRestaurant.keyMetrics];
      const target =
        updated.find((it) => toSafeString(it.name).includes('1 500') || toSafeString(it.name).includes('1500')) ||
        updated[0];
      if (target) {
        metrics[2] = { ...metrics[2], label: `pour ${target.value}% des parents` };
        nextRestaurant.keyMetrics = metrics;
      }
    } else if (key === 'priceForMenuData' && nextRestaurant.alertPoints?.[2]) {
      const alerts = [...nextRestaurant.alertPoints];
      const target =
        updated.find((it) => toSafeString(it.name).includes('2 000') || toSafeString(it.name).includes('2000')) ||
        updated[0];
      if (target) {
        alerts[2] = { ...alerts[2], value: `${target.value}%` };
        nextRestaurant.alertPoints = alerts;
      }
    }

    emitSanitized(nextRestaurant);
  };

  // Student row updates: auto-correlate percentage when effectif value changes
  const updateStudentRow = (index: number, field: string, val: string | number) => {
    const list = [...(restaurant.studentDistributionData || [])];
    if (!list[index]) return;
    const parsedNum = parseLocaleNumber(val);
    const parsedVal =
      field === 'value' || field === 'percentage'
        ? parsedNum !== null
          ? Math.max(0, parsedNum)
          : 0
        : val;

    list[index] = {
      ...list[index],
      [field]: parsedVal,
    };

    const nextList = field === 'value' ? recalculateStudentDistribution(list) : list;
    emitSanitized({ ...restaurant, studentDistributionData: nextList });
  };

  const addStudentRow = () => {
    const list = [...(restaurant.studentDistributionData || [])];
    list.push({ name: 'Nouveau niveau', value: 15, percentage: 0 });
    emitSanitized({ ...restaurant, studentDistributionData: recalculateStudentDistribution(list) });
  };

  const deleteStudentRow = (index: number) => {
    const list = restaurant.studentDistributionData || [];
    if (list.length <= 1) return;
    const filtered = list.filter((_, i) => i !== index);
    emitSanitized({ ...restaurant, studentDistributionData: recalculateStudentDistribution(filtered) });
  };

  // Bidirectional correlation engine between survey tables, metric cards & charts
  const syncCorrelations = (
    base: RestaurantPageData,
    key: keyof RestaurantPageData,
    index: number,
    field: string,
    val: string | number
  ): RestaurantPageData => {
    const next: RestaurantPageData = { ...base };

    // 1. Intérêt cantine (PieChart) <---> keyMetrics[0] ("Intérêt global")
    if (key === 'restaurationInterestData') {
      const list = [...(next.restaurationInterestData || [])];
      if (field === 'value' && list.length >= 2) {
        const num = Math.min(100, Math.max(0, sanitizeNumberOrFallback(val, 0)));
        const otherIndex = index === 0 ? 1 : 0;
        list[index] = { ...list[index], value: num };
        list[otherIndex] = { ...list[otherIndex], value: Math.round((100 - num) * 10) / 10 };
        next.restaurationInterestData = list;

        // Synchronize keyMetrics[0]
        if (next.keyMetrics && next.keyMetrics.length > 0) {
          const metrics = [...next.keyMetrics];
          const yesVal = list[0]?.value ?? num;
          metrics[0] = {
            ...metrics[0],
            value: yesVal,
          };
          next.keyMetrics = metrics;
        }
      }
    }

    // 2. Types de repas souhaités (BarChart) <---> keyMetrics[1] ("Plats chauds")
    if (key === 'mealTypePreferenceData') {
      const list = [...(next.mealTypePreferenceData || [])];
      const isPlatsChauds = index === 0 || toSafeString(list[index]?.name).toLowerCase().includes('chaud');
      if (isPlatsChauds && (field === 'percentage' || field === 'value')) {
        const pct = field === 'percentage'
          ? parseLocaleNumber(val)
          : parseLocaleNumber(list[index]?.percentage ?? val);
        if (pct !== null && next.keyMetrics && next.keyMetrics.length > 1) {
          const metrics = [...next.keyMetrics];
          metrics[1] = {
            ...metrics[1],
            value: Math.round(pct * 10) / 10,
          };
          next.keyMetrics = metrics;
        }
      }
    }

    // 3. Budget plat unique (PieChart) <---> keyMetrics[2] ("Budget moyen par plat")
    if (key === 'priceForDishData') {
      const list = [...(next.priceForDishData || [])];
      const rowName = toSafeString(list[index]?.name);
      const isBudget15002000 = index === 1 || rowName.includes('1 500') || rowName.includes('1500');
      if (isBudget15002000 && field === 'value') {
        const num = parseLocaleNumber(val);
        if (num !== null && next.keyMetrics && next.keyMetrics.length > 2) {
          const metrics = [...next.keyMetrics];
          metrics[2] = {
            ...metrics[2],
            label: `pour ${num}% des parents`,
          };
          next.keyMetrics = metrics;
        }
      }
    }

    // 4. Intérêt par jour (BarChart) <---> alertPoints[0] ("Mercredi")
    if (key === 'serviceInterestByDayData') {
      const list = [...(next.serviceInterestByDayData || [])];
      const isMercredi = index === 2 || toSafeString(list[index]?.name).toLowerCase().includes('mercredi');
      if (isMercredi && (field === 'percentage' || field === 'value')) {
        const pct = field === 'percentage'
          ? parseLocaleNumber(val)
          : parseLocaleNumber(list[index]?.percentage ?? val);
        if (pct !== null && next.alertPoints && next.alertPoints.length > 0) {
          const alerts = [...next.alertPoints];
          alerts[0] = {
            ...alerts[0],
            value: `${Math.round(pct * 10) / 10}%`,
          };
          next.alertPoints = alerts;
        }
      }
    }

    // 5. Budget menu complet (PieChart) <---> alertPoints[2] ("Tarification")
    if (key === 'priceForMenuData') {
      const list = [...(next.priceForMenuData || [])];
      const rowName = toSafeString(list[index]?.name);
      const is20003000 = index === 2 || rowName.includes('2 000') || rowName.includes('2000');
      if (is20003000 && field === 'value') {
        const num = parseLocaleNumber(val);
        if (num !== null && next.alertPoints && next.alertPoints.length > 2) {
          const alerts = [...next.alertPoints];
          alerts[2] = {
            ...alerts[2],
            value: `${num}%`,
          };
          next.alertPoints = alerts;
        }
      }
    }

    // REVERSE: When keyMetrics are modified directly in Tab 7
    if (key === 'keyMetrics') {
      // keyMetrics[0]: Intérêt global -> update restaurationInterestData PieChart
      if (index === 0 && field === 'value') {
        const num = parseLocaleNumber(String(val).replace('%', '').trim());
        if (num !== null && num >= 0 && num <= 100 && next.restaurationInterestData && next.restaurationInterestData.length >= 2) {
          const list = [...next.restaurationInterestData];
          list[0] = { ...list[0], value: num };
          list[1] = { ...list[1], value: Math.round((100 - num) * 10) / 10 };
          next.restaurationInterestData = list;
        }
      }
      // keyMetrics[1]: Plats chauds -> update mealTypePreferenceData BarChart
      if (index === 1 && field === 'value') {
        const num = parseLocaleNumber(String(val).replace('%', '').trim());
        if (num !== null && next.mealTypePreferenceData && next.mealTypePreferenceData.length > 0) {
          const list = [...next.mealTypePreferenceData];
          const idx = list.findIndex((r) => toSafeString(r?.name).toLowerCase().includes('chaud'));
          const target = idx >= 0 ? idx : 0;
          list[target] = { ...list[target], percentage: num };
          next.mealTypePreferenceData = list;
        }
      }
      // keyMetrics[2]: Budget moyen par plat -> update priceForDishData PieChart
      if (index === 2 && field === 'label') {
        const match = String(val).replace(',', '.').match(/(\d+(\.\d+)?)%/);
        if (match && next.priceForDishData && next.priceForDishData.length > 0) {
          const num = parseFloat(match[1]);
          const list = [...next.priceForDishData];
          const idx = list.findIndex((r) => {
            const n = toSafeString(r?.name);
            return n.includes('1 500') || n.includes('1500');
          });
          const target = idx >= 0 ? idx : Math.min(1, list.length - 1);
          list[target] = { ...list[target], value: num };
          next.priceForDishData = list;
        }
      }
    }

    // REVERSE: When alertPoints are modified directly in Tab 7
    if (key === 'alertPoints') {
      // alertPoints[0]: Mercredi -> update serviceInterestByDayData BarChart
      if (index === 0 && field === 'value') {
        const num = parseLocaleNumber(String(val).replace('%', '').trim());
        if (num !== null && next.serviceInterestByDayData && next.serviceInterestByDayData.length > 0) {
          const list = [...next.serviceInterestByDayData];
          const idx = list.findIndex((r) => toSafeString(r?.name).toLowerCase().includes('mercredi'));
          const target = idx >= 0 ? idx : Math.min(2, list.length - 1);
          list[target] = { ...list[target], percentage: num };
          next.serviceInterestByDayData = list;
        }
      }
      // alertPoints[2]: Tarification -> update priceForMenuData PieChart
      if (index === 2 && field === 'value') {
        const num = parseLocaleNumber(String(val).replace('%', '').trim());
        if (num !== null && next.priceForMenuData && next.priceForMenuData.length > 0) {
          const list = [...next.priceForMenuData];
          const idx = list.findIndex((r) => {
            const n = toSafeString(r?.name);
            return n.includes('2 000') || n.includes('2000');
          });
          const target = idx >= 0 ? idx : Math.min(2, list.length - 1);
          list[target] = { ...list[target], value: num };
          next.priceForMenuData = list;
        }
      }
    }

    return next;
  };

  // Generic updater with dynamic chart auto-correlation
  const updateGenericRow = <K extends keyof RestaurantPageData>(
    key: K,
    index: number,
    field: string,
    val: string | number
  ) => {
    const current = (restaurant[key] as Record<string, unknown>[]) || [];
    let parsedVal: string | number = val;

    if (key === 'keyMetrics' || key === 'alertPoints') {
      if (field === 'value') {
        const num = parseLocaleNumber(val);
        parsedVal = num !== null && String(val).trim() !== '' ? num : String(val ?? '');
      }
    } else if (field === 'value' || field === 'percentage') {
      parsedVal = sanitizeNumberOrFallback(val, 0);
    }

    const updated = current.map((row, i) =>
      i === index
        ? {
            ...row,
            [field]: parsedVal,
          }
        : row
    );

    let nextRestaurant: RestaurantPageData = { ...restaurant, [key]: updated };
    nextRestaurant = syncCorrelations(nextRestaurant, key, index, field, parsedVal);
    onChange(sanitizeRestaurantDataset(nextRestaurant) as unknown as RestaurantPageData);
  };

  const addGenericRow = <K extends keyof RestaurantPageData>(key: K, defaultItem: Record<string, unknown>) => {
    const current = (restaurant[key] as Record<string, unknown>[]) || [];
    emitSanitized({ ...restaurant, [key]: [...current, defaultItem] });
  };

  const deleteGenericRow = <K extends keyof RestaurantPageData>(key: K, index: number) => {
    const current = (restaurant[key] as Record<string, unknown>[]) || [];
    const nextRows = current.filter((_, i) => i !== index);
    const nextRestaurant: RestaurantPageData = { ...restaurant, [key]: nextRows };

    if (key === 'mealTypePreferenceData' && nextRestaurant.keyMetrics && nextRestaurant.keyMetrics.length > 1) {
      const analytics = computeRestaurantAnalytics(nextRestaurant);
      const metrics = [...nextRestaurant.keyMetrics];
      metrics[1] = {
        ...metrics[1],
        value: analytics.platsChaudsPct,
      };
      nextRestaurant.keyMetrics = metrics;
    }

    if (key === 'serviceInterestByDayData' && nextRestaurant.alertPoints && nextRestaurant.alertPoints.length > 0) {
      const analytics = computeRestaurantAnalytics(nextRestaurant);
      const alerts = [...nextRestaurant.alertPoints];
      alerts[0] = {
        ...alerts[0],
        name: analytics.weakestDayName,
        value: `${analytics.weakestDayPct}%`,
        label: analytics.otherDaysSummaryLabel,
      };
      nextRestaurant.alertPoints = alerts;
    }

    emitSanitized(nextRestaurant);
  };

  return (
    <div
      className="mb-8 rounded-2xl border border-purple-200 bg-white p-4 sm:p-5 shadow-sm text-slate-800"
      data-interactive="true"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-purple-950 font-playfair">
                Espace Éditeur · Données & Graphiques Restauration Scolaire
              </h3>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                Privilège Éditeur
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifiez les effectifs, pourcentages et statistiques : tous les graphiques et indicateurs ci-dessous se recalculent en temps réel et en parfaite synchronisation.
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="border-purple-300 text-purple-800 hover:bg-purple-50 text-xs font-semibold cursor-pointer"
        >
          {isOpen ? (
            <>
              <ChevronUp className="mr-1.5 h-3.5 w-3.5" /> Masquer l’éditeur de données
            </>
          ) : (
            <>
              <ChevronDown className="mr-1.5 h-3.5 w-3.5" /> Ouvrir l’éditeur de données
            </>
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4 animate-in fade-in duration-200">
          {/* Sub-tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
            {[
              { id: 'student', label: '1. Répartition niveaux (BarChart)' },
              { id: 'interest', label: '2. Intérêt cantine (PieChart)' },
              { id: 'lunch', label: '3. Repas actuels (BarChart)' },
              { id: 'days', label: '4. Par jour (BarChart)' },
              { id: 'meals', label: '5. Types de repas (BarChart)' },
              { id: 'prices', label: '6. Budgets (PieCharts)' },
              { id: 'metrics', label: '7. Chiffres clés & Alertes' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Répartition par niveau */}
          {activeTab === 'student' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Effectifs et pourcentages par niveau scolaire (synchronisé avec BarChart)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={rebalanceStudentPercentages}
                    className="h-7 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Sparkles className="mr-1 h-3 w-3" /> Équilibrer à 100%
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addStudentRow}
                    className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Ajouter un niveau
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Niveau</th>
                      <th className="p-2.5 w-32">Effectif (Élèves)</th>
                      <th className="p-2.5 w-32">Pourcentage (%)</th>
                      <th className="p-2.5 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(restaurant.studentDistributionData || []).map((row, i) => (
                      <tr key={`stud-${i}`} className="hover:bg-slate-50/70">
                        <td className="p-2">
                          <Input
                            value={row.name}
                            onChange={(e) => updateStudentRow(i, 'name', e.target.value)}
                            className="h-7 text-xs bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <LocaleNumberInput
                            min={0}
                            value={row.value}
                            onValueChange={(nextNum) => updateStudentRow(i, 'value', nextNum)}
                            className="h-7 text-xs font-bold text-sky-900 bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <LocaleNumberInput
                            min={0}
                            value={row.percentage}
                            onValueChange={(nextNum) => updateStudentRow(i, 'percentage', nextNum)}
                            className="h-7 text-xs font-semibold text-emerald-700 bg-white"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={(restaurant.studentDistributionData || []).length <= 1}
                            title="Au moins un niveau scolaire est requis"
                            onClick={() => deleteStudentRow(i)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Intérêt pour la cantine */}
          {activeTab === 'interest' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Intérêt pour la restauration scolaire (PieChart)
                    </span>
                    <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Link2 className="w-3 h-3" /> Synchronisé avec la Stat Clé
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-light block mt-0.5">
                    Modifiez « Oui » ou « Non » : l'autre part et la statistique clé s'adaptent instantanément pour totaliser 100%.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => rebalancePieChart('restaurationInterestData')}
                    className="h-7 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Sparkles className="mr-1 h-3 w-3" /> Équilibrer à 100%
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addGenericRow('restaurationInterestData', { name: 'Nouvelle réponse', value: 10 })}
                    className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Ajouter une réponse
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Réponse</th>
                      <th className="p-2.5 w-36">Pourcentage (%)</th>
                      <th className="p-2.5 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(restaurant.restaurationInterestData || []).map((row, i) => (
                      <tr key={`int-${i}`}>
                        <td className="p-2">
                          <Input
                            value={row.name}
                            onChange={(e) => updateGenericRow('restaurationInterestData', i, 'name', e.target.value)}
                            className="h-7 text-xs bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <LocaleNumberInput
                            min={0}
                            max={100}
                            value={row.value}
                            onValueChange={(nextNum) => updateGenericRow('restaurationInterestData', i, 'value', nextNum)}
                            className="h-7 text-xs font-bold text-purple-900 bg-white"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={(restaurant.restaurationInterestData || []).length <= 1}
                            title="Au moins une réponse est requise"
                            onClick={() => deleteGenericRow('restaurationInterestData', i)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Repas actuels */}
          {activeTab === 'lunch' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Situation actuelle des repas (HorizontalBarChart)
                  </span>
                  <span className="text-[11px] text-slate-500 font-light">
                    Les valeurs et pourcentages sont directement modifiables et se mettent à jour sur le graphique.
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addGenericRow('currentLunchData', { name: 'Nouvelle situation', value: 10, percentage: 10 })}
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter une situation
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Situation</th>
                      <th className="p-2.5 w-32">Réponses</th>
                      <th className="p-2.5 w-32">Pourcentage (%)</th>
                      <th className="p-2.5 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(restaurant.currentLunchData || []).map((row, i) => (
                      <tr key={`lunch-${i}`}>
                        <td className="p-2">
                          <Input
                            value={row.name}
                            onChange={(e) => updateGenericRow('currentLunchData', i, 'name', e.target.value)}
                            className="h-7 text-xs bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <LocaleNumberInput
                            min={0}
                            value={row.value}
                            onValueChange={(nextNum) => updateGenericRow('currentLunchData', i, 'value', nextNum)}
                            className="h-7 text-xs font-bold text-sky-900 bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <LocaleNumberInput
                            min={0}
                            value={row.percentage}
                            onValueChange={(nextNum) => updateGenericRow('currentLunchData', i, 'percentage', nextNum)}
                            className="h-7 text-xs font-semibold text-emerald-700 bg-white"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={(restaurant.currentLunchData || []).length <= 1}
                            title="Au moins une situation est requise"
                            onClick={() => deleteGenericRow('currentLunchData', i)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Intérêt par jour */}
          {activeTab === 'days' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Intérêt par jour de la semaine (VerticalBarChart)
                  </span>
                  <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Link2 className="w-3 h-3" /> « Mercredi » synchronisé avec le Point d'attention
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    addGenericRow('serviceInterestByDayData', {
                      name: 'Nouveau jour',
                      value: 0,
                      percentage: 0,
                    })
                  }
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter un jour
                </Button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Jour</th>
                      <th className="p-2.5 w-32">Réponses</th>
                      <th className="p-2.5 w-32">Pourcentage (%)</th>
                      <th className="p-2.5 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(restaurant.serviceInterestByDayData || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-xs text-slate-400 italic">
                          Aucun jour configuré. Cliquez sur « + Ajouter un jour » pour créer une entrée.
                        </td>
                      </tr>
                    ) : (
                      (restaurant.serviceInterestByDayData || []).map((row, i) => (
                        <tr key={`day-${i}`} className="hover:bg-slate-50/70">
                          <td className="p-2">
                            <Input
                              value={row.name}
                              onChange={(e) => updateGenericRow('serviceInterestByDayData', i, 'name', e.target.value)}
                              className="h-7 text-xs bg-white"
                            />
                          </td>
                          <td className="p-2">
                            <LocaleNumberInput
                              min={0}
                              value={row.value}
                              onValueChange={(nextNum) => updateGenericRow('serviceInterestByDayData', i, 'value', nextNum)}
                              className="h-7 text-xs font-bold text-sky-900 bg-white"
                            />
                          </td>
                          <td className="p-2">
                            <LocaleNumberInput
                              min={0}
                              value={row.percentage}
                              onValueChange={(nextNum) => updateGenericRow('serviceInterestByDayData', i, 'percentage', nextNum)}
                              className="h-7 text-xs font-semibold text-emerald-700 bg-white"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              title="Supprimer ce jour"
                              onClick={() => deleteGenericRow('serviceInterestByDayData', i)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: Types de repas */}
          {activeTab === 'meals' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Types de repas souhaités (VerticalBarChart)
                  </span>
                  <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Link2 className="w-3 h-3" /> « Plats chauds » synchronisé avec Stat Clé
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    addGenericRow('mealTypePreferenceData', {
                      name: 'Nouveau type de repas',
                      value: 0,
                      percentage: 0,
                    })
                  }
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter un type de repas
                </Button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Type de repas</th>
                      <th className="p-2.5 w-32">Réponses</th>
                      <th className="p-2.5 w-32">Pourcentage (%)</th>
                      <th className="p-2.5 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(restaurant.mealTypePreferenceData || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-xs text-slate-400 italic">
                          Aucun type de repas configuré. Cliquez sur « + Ajouter un type de repas » pour créer une entrée.
                        </td>
                      </tr>
                    ) : (
                      (restaurant.mealTypePreferenceData || []).map((row, i) => (
                        <tr key={`meal-${i}`} className="hover:bg-slate-50/70">
                          <td className="p-2">
                            <Input
                              value={row.name}
                              onChange={(e) => updateGenericRow('mealTypePreferenceData', i, 'name', e.target.value)}
                              className="h-7 text-xs bg-white"
                            />
                          </td>
                          <td className="p-2">
                            <LocaleNumberInput
                              min={0}
                              value={row.value}
                              onValueChange={(nextNum) => updateGenericRow('mealTypePreferenceData', i, 'value', nextNum)}
                              className="h-7 text-xs font-bold text-sky-900 bg-white"
                            />
                          </td>
                          <td className="p-2">
                            <LocaleNumberInput
                              min={0}
                              value={row.percentage}
                              onValueChange={(nextNum) => updateGenericRow('mealTypePreferenceData', i, 'percentage', nextNum)}
                              className="h-7 text-xs font-semibold text-emerald-700 bg-white"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              title="Supprimer ce type de repas"
                              onClick={() => deleteGenericRow('mealTypePreferenceData', i)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 6: Budgets */}
          {activeTab === 'prices' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Budget plat unique (PieChart)
                    </span>
                    <span className="text-[10px] text-purple-700 font-medium flex items-center gap-1">
                      <Link2 className="w-3 h-3" /> 1 500 - 2 000 FCFA synchronisé avec Stat Clé
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => rebalancePieChart('priceForDishData')}
                      className="h-6 text-[11px] border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Sparkles className="mr-1 h-3 w-3" /> Équilibrer
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addGenericRow('priceForDishData', { name: 'Autre budget', value: 10 })}
                      className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs divide-y divide-slate-200">
                    <thead className="bg-slate-50 font-semibold">
                      <tr>
                        <th className="p-2">Tranche</th>
                        <th className="p-2 w-24">Part (%)</th>
                        <th className="p-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(restaurant.priceForDishData || []).map((row, i) => (
                        <tr key={`dish-${i}`}>
                          <td className="p-1.5">
                            <Input
                              value={row.name}
                              onChange={(e) => updateGenericRow('priceForDishData', i, 'name', e.target.value)}
                              className="h-7 text-xs bg-white"
                            />
                          </td>
                          <td className="p-1.5">
                            <LocaleNumberInput
                              min={0}
                              value={row.value}
                              onValueChange={(nextNum) => updateGenericRow('priceForDishData', i, 'value', nextNum)}
                              className="h-7 text-xs font-bold text-purple-900 bg-white"
                            />
                          </td>
                          <td className="p-1.5 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              disabled={(restaurant.priceForDishData || []).length <= 1}
                              title="Au moins une tranche budgétaire est requise"
                              onClick={() => deleteGenericRow('priceForDishData', i)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Budget menu complet (PieChart)
                    </span>
                    <span className="text-[10px] text-purple-700 font-medium flex items-center gap-1">
                      <Link2 className="w-3 h-3" /> 2 000 - 3 000 FCFA synchronisé avec Point d'attention
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => rebalancePieChart('priceForMenuData')}
                      className="h-6 text-[11px] border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Sparkles className="mr-1 h-3 w-3" /> Équilibrer
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addGenericRow('priceForMenuData', { name: 'Autre budget', value: 10 })}
                      className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs divide-y divide-slate-200">
                    <thead className="bg-slate-50 font-semibold">
                      <tr>
                        <th className="p-2">Tranche</th>
                        <th className="p-2 w-24">Part (%)</th>
                        <th className="p-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(restaurant.priceForMenuData || []).map((row, i) => (
                        <tr key={`menu-${i}`}>
                          <td className="p-1.5">
                            <Input
                              value={row.name}
                              onChange={(e) => updateGenericRow('priceForMenuData', i, 'name', e.target.value)}
                              className="h-7 text-xs bg-white"
                            />
                          </td>
                          <td className="p-1.5">
                            <LocaleNumberInput
                              min={0}
                              value={row.value}
                              onValueChange={(nextNum) => updateGenericRow('priceForMenuData', i, 'value', nextNum)}
                              className="h-7 text-xs font-bold text-purple-900 bg-white"
                            />
                          </td>
                          <td className="p-1.5 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              disabled={(restaurant.priceForMenuData || []).length <= 1}
                              title="Au moins une tranche budgétaire est requise"
                              onClick={() => deleteGenericRow('priceForMenuData', i)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: Statistiques clés & Alertes */}
          {activeTab === 'metrics' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Statistiques clés (MetricCard)
                    </span>
                    <span className="text-[10px] text-purple-700 font-medium">
                      Modifiez ici ou dans les onglets graphiques : la synchronisation est bilatérale.
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addGenericRow('keyMetrics', { name: 'Nouvelle stat clé', value: 80, label: 'des réponses', trend: 'up' })}
                    className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Ajouter stat
                  </Button>
                </div>
                <div className="space-y-2">
                  {(restaurant.keyMetrics || []).map((m, i) => (
                    <div key={`km-${i}`} className="p-2.5 rounded-lg border bg-slate-50 text-xs space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <Input
                          value={m.name}
                          onChange={(e) => updateGenericRow('keyMetrics', i, 'name', e.target.value)}
                          className="h-6.5 text-xs font-semibold bg-white"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={(restaurant.keyMetrics || []).length <= 1}
                          title="Au moins une statistique clé est requise"
                          onClick={() => deleteGenericRow('keyMetrics', i)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 shrink-0 disabled:opacity-30"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Valeur / %</label>
                          <Input
                            value={String(m?.value ?? '')}
                            onChange={(e) => updateGenericRow('keyMetrics', i, 'value', e.target.value)}
                            className="h-6.5 text-xs font-bold text-french-blue bg-white"
                            placeholder="ex: 92 ou 1500-2000 FCFA"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Précision / Label</label>
                          <Input
                            value={m?.label || ''}
                            onChange={(e) => updateGenericRow('keyMetrics', i, 'label', e.target.value)}
                            className="h-6.5 text-[11px] text-slate-600 bg-white"
                            placeholder="Précision"
                          />
                        </div>
                      </div>
                      {i === 0 && (
                        <div className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                          <Link2 className="w-3 h-3" /> Synchronisé avec le PieChart Intérêt (Oui: {(restaurant.restaurationInterestData?.find((d) => toSafeString(d?.name).trim().toLowerCase() === 'oui') || restaurant.restaurationInterestData?.[0])?.value ?? 0}%)
                        </div>
                      )}
                      {i === 1 && (
                        <div className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                          <Link2 className="w-3 h-3" /> Synchronisé avec le BarChart Types de repas (Plats chauds: {(restaurant.mealTypePreferenceData?.find((d) => toSafeString(d?.name).toLowerCase().includes('chaud')) || restaurant.mealTypePreferenceData?.[0])?.percentage ?? 0}%)
                        </div>
                      )}
                      {i === 2 && (
                        <div className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                          <Link2 className="w-3 h-3" /> Synchronisé avec le PieChart Budget 1500-2000 FCFA ({(restaurant.priceForDishData?.find((d) => toSafeString(d?.name).includes('1 500') || toSafeString(d?.name).includes('1500')) || restaurant.priceForDishData?.[0])?.value ?? 0}%)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Points d’attention (MetricCard)
                    </span>
                    <span className="text-[10px] text-amber-700 font-medium">
                      Synchronisés avec le calendrier et la tarification.
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addGenericRow('alertPoints', { name: 'Nouveau point d attention', value: '40%', label: 'des avis', trend: 'down' })}
                    className="h-6 text-[11px] bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Ajouter point
                  </Button>
                </div>
                <div className="space-y-2">
                  {(restaurant.alertPoints || []).map((m, i) => (
                    <div key={`ap-${i}`} className="p-2.5 rounded-lg border bg-amber-50/50 text-xs space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <Input
                          value={m?.name || ''}
                          onChange={(e) => updateGenericRow('alertPoints', i, 'name', e.target.value)}
                          className="h-6.5 text-xs font-semibold bg-white"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={(restaurant.alertPoints || []).length <= 1}
                          title="Au moins un point d'attention est requis"
                          onClick={() => deleteGenericRow('alertPoints', i)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 shrink-0 disabled:opacity-30"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Valeur</label>
                          <Input
                            value={String(m?.value ?? '')}
                            onChange={(e) => updateGenericRow('alertPoints', i, 'value', e.target.value)}
                            className="h-6.5 text-xs font-bold text-amber-900 bg-white"
                            placeholder="ex: 36.3%"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Précision / Label</label>
                          <Input
                            value={m?.label || ''}
                            onChange={(e) => updateGenericRow('alertPoints', i, 'label', e.target.value)}
                            className="h-6.5 text-[11px] text-slate-600 bg-white"
                            placeholder="Précision"
                          />
                        </div>
                      </div>
                      {i === 0 && (
                        <div className="text-[10px] text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                          <Link2 className="w-3 h-3" /> Synchronisé avec le BarChart Mercredi ({(restaurant.serviceInterestByDayData?.find((d) => toSafeString(d?.name).toLowerCase().includes('mercredi')) || restaurant.serviceInterestByDayData?.[0])?.percentage ?? 0}%)
                        </div>
                      )}
                      {i === 2 && (
                        <div className="text-[10px] text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                          <Link2 className="w-3 h-3" /> Synchronisé avec le PieChart Menu complet 2000-3000 FCFA ({(restaurant.priceForMenuData?.find((d) => toSafeString(d?.name).includes('2 000') || toSafeString(d?.name).includes('2000')) || restaurant.priceForMenuData?.[0])?.value ?? 0}%)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminRestaurantSurveyEditor;
