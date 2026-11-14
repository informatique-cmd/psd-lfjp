import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import {
  computeAxisProgressRate,
  defaultPsdAxesData,
  type PsdAxesData,
  type PsdAxisActionSection,
  type PsdAxisIndicator,
  type PsdAxisKey,
  type PsdAxisObjective,
} from '@/data/psdAxesData';
import type { PsdTimelineAction, PsdTimelineKey } from '@/data/psdTimelineData';
import { usePrivilegedAccess } from '@/lib/authAccess';
import { LocaleNumberInput } from '@/components/ui/locale-number-input';
import { sanitizePsdAxesData, sanitizePsdTimelines } from '@/lib/pageDataSanitizer';
import { PsdAxisIndicatorsSection } from './PsdAxisIndicatorsSection';

export interface PlanStrategiqueMeta {
  title: string;
  subtitle: string;
}

export type PsdTimelinesRecord = Record<
  PsdTimelineKey,
  {
    title?: string;
    startYear: number;
    endYear: number;
    actions: PsdTimelineAction[];
  }
>;

export interface AdminPlanStrategiqueEditorProps {
  psdAxesData: PsdAxesData;
  psdTimelines: PsdTimelinesRecord;
  planStrategique: PlanStrategiqueMeta;
  onChange: (next: {
    psdAxesData: PsdAxesData;
    psdTimelines: PsdTimelinesRecord;
    planStrategique: PlanStrategiqueMeta;
  }) => void;
}

const STATUS_OPTIONS: PsdAxisIndicator['status'][] = [
  'Planifié',
  'En cours',
  'Avancé',
  'Objectif atteint',
];

const AXIS_KEYS: PsdAxisKey[] = ['axe1', 'axe2', 'axe3', 'axe4'];

const COLOR_OPTIONS = [
  { value: 'from-french-blue/70 to-french-blue', label: 'Bleu LFJP' },
  { value: 'from-emerald-300/80 to-emerald-500', label: 'Émeraude' },
  { value: 'from-sky-400/80 to-sky-500', label: 'Bleu Ciel' },
  { value: 'from-amber-400/80 to-amber-500', label: 'Ambre' },
  { value: 'from-purple-300/80 to-purple-500', label: 'Violet' },
  { value: 'from-cyan-400/80 to-cyan-500', label: 'Cyan' },
  { value: 'from-indigo-400/80 to-indigo-500', label: 'Indigo' },
];

export const AdminPlanStrategiqueEditor: React.FC<AdminPlanStrategiqueEditorProps> = ({
  psdAxesData,
  psdTimelines,
  planStrategique,
  onChange,
}) => {
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PsdAxisKey>('axe1');

  const summary = useMemo(() => {
    const progressRates = AXIS_KEYS.map((k) => computeAxisProgressRate(psdAxesData[k]));
    const globalProgress =
      Math.round((progressRates.reduce((s, v) => s + v, 0) / AXIS_KEYS.length) * 10) / 10;
    const totalBudget = AXIS_KEYS.reduce(
      (s, k) => s + (Number(psdAxesData[k].budgetMillions) || 0),
      0
    );
    const totalActions = AXIS_KEYS.reduce(
      (s, k) => s + (psdTimelines[k]?.actions?.length || 0),
      0
    );
    const totalIndicators = AXIS_KEYS.reduce(
      (s, k) => s + (psdAxesData[k]?.indicators?.length || 0),
      0
    );
    const chartData = AXIS_KEYS.map((k, idx) => ({
      name: `Axe ${idx + 1}`,
      avancement: computeAxisProgressRate(psdAxesData[k]),
      budget: Number(psdAxesData[k].budgetMillions) || 0,
    }));
    return { globalProgress, totalBudget, totalActions, totalIndicators, chartData };
  }, [psdAxesData, psdTimelines]);

  if (!isPrivileged || !showEditorControls) {
    return null;
  }

  const emit = (
    nextAxes: PsdAxesData,
    nextTimelines: PsdTimelinesRecord,
    nextMeta: PlanStrategiqueMeta
  ) => {
    const cleanAxes = sanitizePsdAxesData(nextAxes) as PsdAxesData;
    const cleanTimelines = sanitizePsdTimelines(nextTimelines) as PsdTimelinesRecord;
    onChange({
      psdAxesData: cleanAxes,
      psdTimelines: cleanTimelines,
      planStrategique: nextMeta,
    });
  };

  const axisKey = activeTab;
  const axis = psdAxesData[axisKey];
  const axisObjectives: PsdAxisObjective[] =
    axis.objectives ?? defaultPsdAxesData[axisKey].objectives ?? [];
  const axisActionSections: PsdAxisActionSection[] =
    axis.actionSections ?? defaultPsdAxesData[axisKey].actionSections ?? [];
  const timeline = psdTimelines[axisKey] || {
    startYear: 2026,
    endYear: 2030,
    actions: [],
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
                Espace Éditeur · Données & Graphiques Plan Stratégique (Axes 1 à 4)
              </h3>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                Privilège Éditeur
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifiez les objectifs, actions, jalons, budgets et indicateurs par axe : les graphiques par axe et la synthèse consolidée se recalculent automatiquement en direct.
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
        <div className="mt-4 space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
            {AXIS_KEYS.map((k, idx) => (
              <button
                key={k}
                type="button"
                onClick={() => setActiveTab(k)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                  activeTab === k
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Axe {idx + 1} ({computeAxisProgressRate(psdAxesData[k])}%)
              </button>
            ))}
          </div>

          <div className="space-y-5">
            {/* Paramètres généraux & Budget de l'axe */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Libellé court
                </label>
                <Input
                  value={axis.shortTitle}
                  onChange={(e) =>
                    emit(
                      { ...psdAxesData, [axisKey]: { ...axis, shortTitle: e.target.value } },
                      psdTimelines,
                      planStrategique
                    )
                  }
                  className="h-8 text-xs bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Budget alloué (M FCFA)
                </label>
                <LocaleNumberInput
                  min={0}
                  value={axis.budgetMillions}
                  onValueChange={(num) =>
                    emit(
                      { ...psdAxesData, [axisKey]: { ...axis, budgetMillions: Math.max(0, num) } },
                      psdTimelines,
                      planStrategique
                    )
                  }
                  className="h-8 text-xs bg-white font-bold text-purple-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Taux d&apos;avancement calculé
                </label>
                <div className="h-8 px-3 rounded-md border bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center">
                  {computeAxisProgressRate(axis)}% (moyenne des indicateurs)
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Titre complet de l&apos;axe
              </label>
              <Input
                value={axis.title}
                onChange={(e) =>
                  emit(
                    { ...psdAxesData, [axisKey]: { ...axis, title: e.target.value } },
                    psdTimelines,
                    planStrategique
                  )
                }
                className="h-8 text-xs bg-white mb-2"
              />
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Sous-titre / Cap stratégique
              </label>
              <Input
                value={axis.subtitle}
                onChange={(e) =>
                  emit(
                    { ...psdAxesData, [axisKey]: { ...axis, subtitle: e.target.value } },
                    psdTimelines,
                    planStrategique
                  )
                }
                className="h-8 text-xs bg-white"
              />
            </div>

            {/* Objectifs détaillés CRUD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Objectifs détaillés ({axisObjectives.length})
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const nextObjectives: PsdAxisObjective[] = [
                      ...axisObjectives,
                      {
                        title: 'Nouvel objectif',
                        description: "Description détaillée de l'objectif stratégique.",
                      },
                    ];
                    emit(
                      { ...psdAxesData, [axisKey]: { ...axis, objectives: nextObjectives } },
                      psdTimelines,
                      planStrategique
                    );
                  }}
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter un objectif
                </Button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2 w-56">Intitulé (optionnel)</th>
                      <th className="p-2">Description de l&apos;objectif</th>
                      <th className="p-2 text-right w-12">Suppr.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {axisObjectives.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-xs text-slate-400 italic">
                          Aucun objectif défini. Cliquez sur « + Ajouter un objectif » pour en créer un.
                        </td>
                      </tr>
                    ) : (
                      axisObjectives.map((obj, idx) => (
                        <tr key={`obj-${idx}`}>
                          <td className="p-1.5">
                            <Input
                              value={obj.title || ''}
                              placeholder="Titre court"
                              onChange={(e) => {
                                const nextObjectives = axisObjectives.map((it, i) =>
                                  i === idx ? { ...it, title: e.target.value } : it
                                );
                                emit(
                                  { ...psdAxesData, [axisKey]: { ...axis, objectives: nextObjectives } },
                                  psdTimelines,
                                  planStrategique
                                );
                              }}
                              className="h-7 text-xs bg-white font-semibold"
                            />
                          </td>
                          <td className="p-1.5">
                            <Input
                              value={obj.description}
                              onChange={(e) => {
                                const nextObjectives = axisObjectives.map((it, i) =>
                                  i === idx ? { ...it, description: e.target.value } : it
                                );
                                emit(
                                  { ...psdAxesData, [axisKey]: { ...axis, objectives: nextObjectives } },
                                  psdTimelines,
                                  planStrategique
                                );
                              }}
                              className="h-7 text-xs bg-white"
                            />
                          </td>
                          <td className="p-1.5 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              title="Supprimer cet objectif"
                              onClick={() => {
                                const nextObjectives = axisObjectives.filter((_, i) => i !== idx);
                                emit(
                                  { ...psdAxesData, [axisKey]: { ...axis, objectives: nextObjectives } },
                                  psdTimelines,
                                  planStrategique
                                );
                              }}
                              className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 cursor-pointer"
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

            {/* Rubriques & Actions détaillées CRUD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Rubriques & Actions détaillées ({axisActionSections.length} rubriques)
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const nextSections: PsdAxisActionSection[] = [
                      ...axisActionSections,
                      {
                        title: 'Nouvelle rubrique',
                        items: [{ label: 'Nouvelle action', link: '' }],
                      },
                    ];
                    emit(
                      { ...psdAxesData, [axisKey]: { ...axis, actionSections: nextSections } },
                      psdTimelines,
                      planStrategique
                    );
                  }}
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter une rubrique
                </Button>
              </div>
              {axisActionSections.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 italic">
                  Aucune rubrique définie. Cliquez sur « + Ajouter une rubrique » pour en créer une.
                </div>
              ) : (
                <div className="space-y-3">
                  {axisActionSections.map((section, secIdx) => (
                    <div
                      key={`sec-${secIdx}`}
                      className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Input
                          value={section.title}
                          onChange={(e) => {
                            const nextSections = axisActionSections.map((s, i) =>
                              i === secIdx ? { ...s, title: e.target.value } : s
                            );
                            emit(
                              {
                                ...psdAxesData,
                                [axisKey]: { ...axis, actionSections: nextSections },
                              },
                              psdTimelines,
                              planStrategique
                            );
                          }}
                          className="h-7 text-xs font-bold text-french-blue bg-white max-w-md"
                        />
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const nextSections = axisActionSections.map((s, i) =>
                                i === secIdx
                                  ? {
                                      ...s,
                                      items: [...s.items, { label: 'Nouvelle action', link: '' }],
                                    }
                                  : s
                              );
                              emit(
                                {
                                  ...psdAxesData,
                                  [axisKey]: { ...axis, actionSections: nextSections },
                                },
                                psdTimelines,
                                planStrategique
                              );
                            }}
                            className="h-7 text-[11px] border-purple-200 text-purple-800 hover:bg-purple-50"
                          >
                            <Plus className="mr-1 h-3 w-3" /> Ajouter une action
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            title="Supprimer cette rubrique"
                            onClick={() => {
                              const nextSections = axisActionSections.filter((_, i) => i !== secIdx);
                              emit(
                                {
                                  ...psdAxesData,
                                  [axisKey]: { ...axis, actionSections: nextSections },
                                },
                                psdTimelines,
                                planStrategique
                              );
                            }}
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded border border-slate-200 bg-white">
                        <table className="w-full text-left text-xs divide-y divide-slate-100">
                          <thead className="bg-slate-50 font-semibold text-slate-600">
                            <tr>
                              <th className="p-1.5">Intitulé de l&apos;action</th>
                              <th className="p-1.5 w-56">Lien fiche (/route ou https://...)</th>
                              <th className="p-1.5 text-right w-10">Suppr.</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {section.items.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="p-2.5 text-center text-[11px] text-slate-400 italic">
                                  Aucune action dans cette rubrique.
                                </td>
                              </tr>
                            ) : (
                              section.items.map((item, itemIdx) => (
                                <tr key={`act-${secIdx}-${itemIdx}`}>
                                  <td className="p-1">
                                    <Input
                                      value={item.label}
                                      onChange={(e) => {
                                        const nextSections = axisActionSections.map((s, si) =>
                                          si === secIdx
                                            ? {
                                                ...s,
                                                items: s.items.map((it, ii) =>
                                                  ii === itemIdx
                                                    ? { ...it, label: e.target.value }
                                                    : it
                                                ),
                                              }
                                            : s
                                        );
                                        emit(
                                          {
                                            ...psdAxesData,
                                            [axisKey]: { ...axis, actionSections: nextSections },
                                          },
                                          psdTimelines,
                                          planStrategique
                                        );
                                      }}
                                      className="h-7 text-xs bg-white"
                                    />
                                  </td>
                                  <td className="p-1">
                                    <Input
                                      value={item.link || ''}
                                      placeholder="/exemple-fiche"
                                      onChange={(e) => {
                                        const nextSections = axisActionSections.map((s, si) =>
                                          si === secIdx
                                            ? {
                                                ...s,
                                                items: s.items.map((it, ii) =>
                                                  ii === itemIdx
                                                    ? { ...it, link: e.target.value }
                                                    : it
                                                ),
                                              }
                                            : s
                                        );
                                        emit(
                                          {
                                            ...psdAxesData,
                                            [axisKey]: { ...axis, actionSections: nextSections },
                                          },
                                          psdTimelines,
                                          planStrategique
                                        );
                                      }}
                                      className="h-7 text-xs bg-white text-slate-600"
                                    />
                                  </td>
                                  <td className="p-1 text-right">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      title="Supprimer cette action"
                                      onClick={() => {
                                        const nextSections = axisActionSections.map((s, si) =>
                                          si === secIdx
                                            ? {
                                                ...s,
                                                items: s.items.filter((_, ii) => ii !== itemIdx),
                                              }
                                            : s
                                        );
                                        emit(
                                          {
                                            ...psdAxesData,
                                            [axisKey]: { ...axis, actionSections: nextSections },
                                          },
                                          psdTimelines,
                                          planStrategique
                                        );
                                      }}
                                      className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 cursor-pointer"
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
                  ))}
                </div>
              )}
            </div>

            {/* Indicators Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Indicateurs chiffrés (synchronisés avec le graphique)
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const nextInds: PsdAxisIndicator[] = [
                      ...axis.indicators,
                      {
                        name: 'Nouvel indicateur',
                        currentRate: 25,
                        targetRate: 100,
                        unit: '%',
                        status: 'En cours',
                      },
                    ];
                    emit(
                      { ...psdAxesData, [axisKey]: { ...axis, indicators: nextInds } },
                      psdTimelines,
                      planStrategique
                    );
                  }}
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter un indicateur
                </Button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2">Indicateur</th>
                      <th className="p-2 w-24">Actuel (%)</th>
                      <th className="p-2 w-24">Cible (%)</th>
                      <th className="p-2 w-32">Statut</th>
                      <th className="p-2 text-right w-12">Suppr.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {axis.indicators.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-xs text-slate-400 italic">
                          Aucun indicateur défini. Cliquez sur « + Ajouter un indicateur » pour créer un indicateur.
                        </td>
                      </tr>
                    ) : axis.indicators.map((ind, idx) => (
                      <tr key={`ind-${idx}`}>
                        <td className="p-1.5">
                          <Input
                            value={ind.name}
                            onChange={(e) => {
                              const nextInds = axis.indicators.map((it, i) =>
                                i === idx ? { ...it, name: e.target.value } : it
                              );
                              emit(
                                { ...psdAxesData, [axisKey]: { ...axis, indicators: nextInds } },
                                psdTimelines,
                                planStrategique
                              );
                            }}
                            className="h-7 text-xs bg-white"
                          />
                        </td>
                        <td className="p-1.5">
                          <LocaleNumberInput
                            min={0}
                            value={ind.currentRate}
                            onValueChange={(num) => {
                              const nextInds = axis.indicators.map((it, i) =>
                                i === idx ? { ...it, currentRate: Math.max(0, num) } : it
                              );
                              emit(
                                { ...psdAxesData, [axisKey]: { ...axis, indicators: nextInds } },
                                psdTimelines,
                                planStrategique
                              );
                            }}
                            className="h-7 text-xs font-bold text-french-blue bg-white"
                          />
                        </td>
                        <td className="p-1.5">
                          <LocaleNumberInput
                            min={1}
                            value={ind.targetRate}
                            onValueChange={(num) => {
                              const nextInds = axis.indicators.map((it, i) =>
                                i === idx ? { ...it, targetRate: Math.max(1, num) } : it
                              );
                              emit(
                                { ...psdAxesData, [axisKey]: { ...axis, indicators: nextInds } },
                                psdTimelines,
                                planStrategique
                              );
                            }}
                            className="h-7 text-xs font-semibold text-emerald-700 bg-white"
                          />
                        </td>
                        <td className="p-1.5">
                          <select
                            value={ind.status}
                            onChange={(e) => {
                              const status = e.target.value as PsdAxisIndicator['status'];
                              const nextInds = axis.indicators.map((it, i) =>
                                i === idx ? { ...it, status } : it
                              );
                              emit(
                                { ...psdAxesData, [axisKey]: { ...axis, indicators: nextInds } },
                                psdTimelines,
                                planStrategique
                              );
                            }}
                            className="h-7 w-full rounded-md border border-slate-200 bg-white px-1.5 text-xs"
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-1.5 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            title="Supprimer cet indicateur"
                            onClick={() => {
                              const nextInds = axis.indicators.filter((_, i) => i !== idx);
                              emit(
                                { ...psdAxesData, [axisKey]: { ...axis, indicators: nextInds } },
                                psdTimelines,
                                planStrategique
                              );
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 cursor-pointer"
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

            {/* Timeline Actions Table */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Frise temporelle ({timeline.startYear}–{timeline.endYear})
                </span>
                <div className="flex items-center gap-2">
                  <LocaleNumberInput
                    min={2020}
                    max={2040}
                    value={timeline.startYear}
                    onValueChange={(num) => {
                      const startYear = Math.round(num);
                      const nextTimeline = {
                        ...timeline,
                        startYear,
                        endYear: Math.max(startYear, timeline.endYear),
                      };
                      emit(
                        psdAxesData,
                        { ...psdTimelines, [axisKey]: nextTimeline },
                        planStrategique
                      );
                    }}
                    className="h-7 w-20 text-xs bg-white"
                  />
                  <span className="text-xs text-slate-400">→</span>
                  <LocaleNumberInput
                    min={2020}
                    max={2040}
                    value={timeline.endYear}
                    onValueChange={(num) => {
                      const endYear = Math.max(timeline.startYear, Math.round(num));
                      const nextTimeline = { ...timeline, endYear };
                      emit(
                        psdAxesData,
                        { ...psdTimelines, [axisKey]: nextTimeline },
                        planStrategique
                      );
                    }}
                    className="h-7 w-20 text-xs bg-white"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      const nextActions: PsdTimelineAction[] = [
                        ...timeline.actions,
                        {
                          title: 'Nouvelle action structurante',
                          description: 'Description de la phase de déploiement.',
                          start: timeline.startYear,
                          end: timeline.endYear,
                          color: 'from-french-blue/70 to-french-blue',
                        },
                      ];
                      emit(
                        psdAxesData,
                        { ...psdTimelines, [axisKey]: { ...timeline, actions: nextActions } },
                        planStrategique
                      );
                    }}
                    className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Ajouter un jalon
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2">Action</th>
                      <th className="p-2">Description</th>
                      <th className="p-2 w-20">Début</th>
                      <th className="p-2 w-20">Fin</th>
                      <th className="p-2 w-28">Couleur</th>
                      <th className="p-2 text-right w-12">Suppr.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {timeline.actions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-xs text-slate-400 italic">
                          Aucun jalon programmé sur cette frise. Cliquez sur « + Ajouter un jalon » pour en créer un.
                        </td>
                      </tr>
                    ) : timeline.actions.map((act, idx) => (
                      <tr key={`tl-${idx}`}>
                        <td className="p-1.5">
                          <Input
                            value={act.title}
                            onChange={(e) => {
                              const nextActions = timeline.actions.map((a, i) =>
                                i === idx ? { ...a, title: e.target.value } : a
                              );
                              emit(
                                psdAxesData,
                                { ...psdTimelines, [axisKey]: { ...timeline, actions: nextActions } },
                                planStrategique
                              );
                            }}
                            className="h-7 text-xs bg-white"
                          />
                        </td>
                        <td className="p-1.5">
                          <Input
                            value={act.description}
                            onChange={(e) => {
                              const nextActions = timeline.actions.map((a, i) =>
                                i === idx ? { ...a, description: e.target.value } : a
                              );
                              emit(
                                psdAxesData,
                                { ...psdTimelines, [axisKey]: { ...timeline, actions: nextActions } },
                                planStrategique
                              );
                            }}
                            className="h-7 text-xs bg-white"
                          />
                        </td>
                        <td className="p-1.5">
                          <LocaleNumberInput
                            min={timeline.startYear}
                            max={timeline.endYear}
                            value={act.start}
                            onValueChange={(num) => {
                              const start = Math.min(timeline.endYear, Math.max(timeline.startYear, Math.round(num)));
                              const nextActions = timeline.actions.map((a, i) =>
                                i === idx ? { ...a, start, end: Math.max(start, a.end) } : a
                              );
                              emit(
                                psdAxesData,
                                { ...psdTimelines, [axisKey]: { ...timeline, actions: nextActions } },
                                planStrategique
                              );
                            }}
                            className="h-7 text-xs bg-white font-bold"
                          />
                        </td>
                        <td className="p-1.5">
                          <LocaleNumberInput
                            min={timeline.startYear}
                            max={timeline.endYear}
                            value={act.end}
                            onValueChange={(num) => {
                              const end = Math.min(timeline.endYear, Math.max(act.start, Math.round(num)));
                              const nextActions = timeline.actions.map((a, i) =>
                                i === idx ? { ...a, end } : a
                              );
                              emit(
                                psdAxesData,
                                { ...psdTimelines, [axisKey]: { ...timeline, actions: nextActions } },
                                planStrategique
                              );
                            }}
                            className="h-7 text-xs bg-white font-bold"
                          />
                        </td>
                        <td className="p-1.5">
                          <select
                            value={act.color}
                            onChange={(e) => {
                              const nextActions = timeline.actions.map((a, i) =>
                                i === idx ? { ...a, color: e.target.value } : a
                              );
                              emit(
                                psdAxesData,
                                { ...psdTimelines, [axisKey]: { ...timeline, actions: nextActions } },
                                planStrategique
                              );
                            }}
                            className="h-7 w-full rounded-md border border-slate-200 bg-white px-1 text-xs"
                          >
                            {COLOR_OPTIONS.map((c) => (
                              <option key={c.value} value={c.value}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-1.5 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            title="Supprimer ce jalon"
                            onClick={() => {
                              const nextActions = timeline.actions.filter((_, i) => i !== idx);
                              emit(
                                psdAxesData,
                                { ...psdTimelines, [axisKey]: { ...timeline, actions: nextActions } },
                                planStrategique
                              );
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 cursor-pointer"
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

            {/* Graphique & jauge propres à cet axe */}
            <PsdAxisIndicatorsSection axis={axis} />

            {/* Synthèse consolidée 100 % calculée automatiquement à partir des Axes 1 à 4 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Synthèse consolidée automatique (Axes 1 à 4)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Calculée automatiquement en temps réel à partir des données saisies dans les onglets Axe 1 à Axe 4.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                    Avancement global
                  </span>
                  <div className="mt-0.5 text-xl font-bold text-french-blue">
                    {summary.globalProgress}%
                  </div>
                </div>
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                    Budget consolidé
                  </span>
                  <div className="mt-0.5 text-xl font-bold text-emerald-700">
                    {summary.totalBudget} M FCFA
                  </div>
                </div>
                <div className="rounded-lg border border-amber-100 bg-amber-50/70 p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                    Actions structurantes
                  </span>
                  <div className="mt-0.5 text-xl font-bold text-amber-700">
                    {summary.totalActions}
                  </div>
                </div>
                <div className="rounded-lg border border-purple-100 bg-purple-50/70 p-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-purple-700">
                    Indicateurs suivis
                  </span>
                  <div className="mt-0.5 text-xl font-bold text-purple-700">
                    {summary.totalIndicators}
                  </div>
                </div>
              </div>

              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.chartData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar
                      yAxisId="left"
                      dataKey="avancement"
                      name="Avancement (%)"
                      fill="#005BAC"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="budget"
                      name="Budget (M FCFA)"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlanStrategiqueEditor;
