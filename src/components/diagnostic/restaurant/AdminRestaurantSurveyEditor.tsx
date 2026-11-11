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
} from 'lucide-react';
import type { RestaurantPageData } from '@/data/restaurantPageData';

export interface AdminRestaurantSurveyEditorProps {
  restaurant: RestaurantPageData;
  onChange: (updated: RestaurantPageData) => void;
}

export const AdminRestaurantSurveyEditor: React.FC<AdminRestaurantSurveyEditorProps> = ({
  restaurant,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'student' | 'interest' | 'lunch' | 'days' | 'meals' | 'prices' | 'metrics'
  >('student');

  // Helper to re-balance student percentages to 100%
  const rebalanceStudentPercentages = () => {
    const list = restaurant.studentDistributionData || [];
    const totalEffectif = list.reduce((sum, item) => sum + (Math.max(0, Number(item.value)) || 0), 0);
    if (totalEffectif === 0) return;

    const updated = list.map((item) => {
      const v = Math.max(0, Number(item.value)) || 0;
      return {
        ...item,
        percentage: Math.round((v / totalEffectif) * 100),
      };
    });

    const sumPct = updated.reduce((s, it) => s + it.percentage, 0);
    if (sumPct !== 100 && updated.length > 0) {
      const diff = 100 - sumPct;
      updated[0].percentage += diff;
    }

    const next = { ...restaurant, studentDistributionData: updated };
    onChange(next);
  };

  // Student row updates: auto-correlate percentage when effectif value changes
  const updateStudentRow = (index: number, field: string, val: string | number) => {
    const list = [...(restaurant.studentDistributionData || [])];
    const num = Number(val);
    const parsedVal = (field === 'value' || field === 'percentage') ? (!isNaN(num) ? num : val) : val;

    list[index] = {
      ...list[index],
      [field]: parsedVal,
    };

    // If effectif (value) is edited, dynamically correlate percentage to the new total
    if (field === 'value') {
      const totalStudents = list.reduce((sum, item) => sum + (Math.max(0, Number(item.value)) || 0), 0);
      if (totalStudents > 0) {
        list.forEach((item, i) => {
          const itemVal = Math.max(0, Number(item.value)) || 0;
          list[i] = {
            ...item,
            percentage: Math.round((itemVal / totalStudents) * 1000) / 10,
          };
        });
      }
    }

    onChange({ ...restaurant, studentDistributionData: list });
  };

  const addStudentRow = () => {
    const list = [...(restaurant.studentDistributionData || [])];
    list.push({ name: 'Nouveau niveau', value: 15, percentage: 10 });
    onChange({ ...restaurant, studentDistributionData: list });
  };

  const deleteStudentRow = (index: number) => {
    const list = (restaurant.studentDistributionData || []).filter((_, i) => i !== index);
    onChange({ ...restaurant, studentDistributionData: list });
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
      // In metrics, value can be text like "1500-2000 FCFA" or a number like 92
      if (typeof val === 'string') {
        const num = Number(val);
        parsedVal = !isNaN(num) && val.trim() !== '' ? num : val;
      }
    } else if (field === 'value' || field === 'percentage') {
      const num = Number(val);
      parsedVal = !isNaN(num) ? num : val;
    }

    let updated = current.map((row, i) =>
      i === index
        ? {
            ...row,
            [field]: parsedVal,
          }
        : row
    );

    // Dynamic auto-correlation for Intérêt Restauration (PieChart Oui / Non = 100%)
    if (key === 'restaurationInterestData' && field === 'value' && updated.length === 2) {
      const currentVal = Math.min(100, Math.max(0, Number(parsedVal) || 0));
      const otherIndex = index === 0 ? 1 : 0;
      updated[index] = { ...updated[index], value: currentVal };
      updated[otherIndex] = { ...updated[otherIndex], value: 100 - currentVal };
    }

    // Dynamic auto-correlation for BarCharts (calculate percentage if value changes)
    if ((key === 'currentLunchData' || key === 'serviceInterestByDayData' || key === 'mealTypePreferenceData') && field === 'value') {
      const totalResponses = updated.reduce((s, r) => s + (Math.max(0, Number(r.value)) || 0), 0);
      if (totalResponses > 0) {
        updated = updated.map((r) => ({
          ...r,
          percentage: Math.round(((Math.max(0, Number(r.value)) || 0) / totalResponses) * 1000) / 10,
        }));
      }
    }

    onChange({ ...restaurant, [key]: updated });
  };

  const addGenericRow = <K extends keyof RestaurantPageData>(key: K, defaultItem: Record<string, unknown>) => {
    const current = (restaurant[key] as Record<string, unknown>[]) || [];
    onChange({ ...restaurant, [key]: [...current, defaultItem] });
  };

  const deleteGenericRow = <K extends keyof RestaurantPageData>(key: K, index: number) => {
    const current = (restaurant[key] as Record<string, unknown>[]) || [];
    onChange({ ...restaurant, [key]: current.filter((_, i) => i !== index) });
  };

  return (
    <div className="mb-8 rounded-2xl border border-purple-200 bg-white p-4 sm:p-5 shadow-sm text-slate-800" data-interactive="true">
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
              Modifiez les effectifs, pourcentages et réponses : tous les graphiques ci-dessous se recalculent en temps réel.
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
                          <Input
                            type="number"
                            value={row.value}
                            onChange={(e) => updateStudentRow(i, 'value', e.target.value)}
                            className="h-7 text-xs font-bold text-sky-900 bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={row.percentage}
                            onChange={(e) => updateStudentRow(i, 'percentage', e.target.value)}
                            className="h-7 text-xs font-semibold text-emerald-700 bg-white"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteStudentRow(i)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Intérêt pour la restauration scolaire (PieChart)
                  </span>
                  <span className="text-[11px] text-slate-500 font-light">
                    Ajustez Oui ou Non : l'autre part se recalcule automatiquement pour totaliser 100%.
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addGenericRow('restaurationInterestData', { name: 'Nouvelle réponse', value: 10 })}
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter une réponse
                </Button>
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
                          <Input
                            type="number"
                            value={row.value}
                            onChange={(e) => updateGenericRow('restaurationInterestData', i, 'value', e.target.value)}
                            className="h-7 text-xs font-bold text-purple-900 bg-white"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteGenericRow('restaurationInterestData', i)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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
                    Les pourcentages s'actualisent automatiquement avec le nombre de réponses.
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
                          <Input
                            type="number"
                            value={row.value}
                            onChange={(e) => updateGenericRow('currentLunchData', i, 'value', e.target.value)}
                            className="h-7 text-xs font-bold text-sky-900 bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={row.percentage}
                            onChange={(e) => updateGenericRow('currentLunchData', i, 'percentage', e.target.value)}
                            className="h-7 text-xs font-semibold text-emerald-700 bg-white"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteGenericRow('currentLunchData', i)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Intérêt par jour de la semaine (VerticalBarChart)
              </span>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Jour</th>
                      <th className="p-2.5 w-32">Réponses</th>
                      <th className="p-2.5 w-32">Pourcentage (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(restaurant.serviceInterestByDayData || []).map((row, i) => (
                      <tr key={`day-${i}`}>
                        <td className="p-2">
                          <Input
                            value={row.name}
                            onChange={(e) => updateGenericRow('serviceInterestByDayData', i, 'name', e.target.value)}
                            className="h-7 text-xs bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={row.value}
                            onChange={(e) => updateGenericRow('serviceInterestByDayData', i, 'value', e.target.value)}
                            className="h-7 text-xs font-bold text-sky-900 bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={row.percentage}
                            onChange={(e) => updateGenericRow('serviceInterestByDayData', i, 'percentage', e.target.value)}
                            className="h-7 text-xs font-semibold text-emerald-700 bg-white"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: Types de repas */}
          {activeTab === 'meals' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Types de repas souhaités (VerticalBarChart)
              </span>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Type de repas</th>
                      <th className="p-2.5 w-32">Réponses</th>
                      <th className="p-2.5 w-32">Pourcentage (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(restaurant.mealTypePreferenceData || []).map((row, i) => (
                      <tr key={`meal-${i}`}>
                        <td className="p-2">
                          <Input
                            value={row.name}
                            onChange={(e) => updateGenericRow('mealTypePreferenceData', i, 'name', e.target.value)}
                            className="h-7 text-xs bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={row.value}
                            onChange={(e) => updateGenericRow('mealTypePreferenceData', i, 'value', e.target.value)}
                            className="h-7 text-xs font-bold text-sky-900 bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={row.percentage}
                            onChange={(e) => updateGenericRow('mealTypePreferenceData', i, 'percentage', e.target.value)}
                            className="h-7 text-xs font-semibold text-emerald-700 bg-white"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 6: Budgets */}
          {activeTab === 'prices' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Budget plat unique (PieChart)
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addGenericRow('priceForDishData', { name: 'Autre budget', value: 10 })}
                    className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Ajouter tranche
                  </Button>
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
                            <Input
                              type="number"
                              value={row.value}
                              onChange={(e) => updateGenericRow('priceForDishData', i, 'value', e.target.value)}
                              className="h-7 text-xs font-bold text-purple-900 bg-white"
                            />
                          </td>
                          <td className="p-1.5 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteGenericRow('priceForDishData', i)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Budget menu complet (PieChart)
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addGenericRow('priceForMenuData', { name: 'Autre budget', value: 10 })}
                    className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Ajouter tranche
                  </Button>
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
                            <Input
                              type="number"
                              value={row.value}
                              onChange={(e) => updateGenericRow('priceForMenuData', i, 'value', e.target.value)}
                              className="h-7 text-xs font-bold text-purple-900 bg-white"
                            />
                          </td>
                          <td className="p-1.5 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteGenericRow('priceForMenuData', i)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Statistiques clés (MetricCard)
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addGenericRow('keyMetrics', { name: 'Nouvelle stat clé', value: '80%', label: 'des réponses', trend: 'up' })}
                    className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Ajouter stat
                  </Button>
                </div>
                <div className="space-y-2">
                  {(restaurant.keyMetrics || []).map((m, i) => (
                    <div key={`km-${i}`} className="p-2.5 rounded-lg border bg-slate-50 text-xs space-y-1">
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
                          onClick={() => deleteGenericRow('keyMetrics', i)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={String(m.value)}
                          onChange={(e) => updateGenericRow('keyMetrics', i, 'value', e.target.value)}
                          className="h-6.5 text-xs font-bold text-french-blue bg-white"
                          placeholder="Valeur (ex: 92 ou 1500 FCFA)"
                        />
                        <Input
                          value={m.label || ''}
                          onChange={(e) => updateGenericRow('keyMetrics', i, 'label', e.target.value)}
                          className="h-6.5 text-[11px] text-slate-500 bg-white"
                          placeholder="Précision"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Points d’attention (MetricCard)
                  </span>
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
                    <div key={`ap-${i}`} className="p-2.5 rounded-lg border bg-amber-50/50 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <Input
                          value={m.name}
                          onChange={(e) => updateGenericRow('alertPoints', i, 'name', e.target.value)}
                          className="h-6.5 text-xs font-semibold bg-white"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteGenericRow('alertPoints', i)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={String(m.value)}
                          onChange={(e) => updateGenericRow('alertPoints', i, 'value', e.target.value)}
                          className="h-6.5 text-xs font-bold text-amber-900 bg-white"
                          placeholder="Valeur (ex: 36.3%)"
                        />
                        <Input
                          value={m.label || ''}
                          onChange={(e) => updateGenericRow('alertPoints', i, 'label', e.target.value)}
                          className="h-6.5 text-[11px] text-slate-500 bg-white"
                          placeholder="Précision"
                        />
                      </div>
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
