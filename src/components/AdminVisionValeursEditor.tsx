import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocaleNumberInput } from '@/components/ui/locale-number-input';
import { ArrowDown, ArrowUp, BarChart3, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { usePrivilegedAccess } from '@/lib/authAccess';
import type { PageChartItem, PageKeyMetric } from '@/data/methodeData';

export interface VisionValueItem {
  name: string;
  description: string;
}

export interface VisionMissionsValeursContent {
  heroTitle?: string;
  heroSubtitle?: string;
  visionSectionTitle?: string;
  missionsSectionTitle?: string;
  valeursSectionTitle?: string;
  vision: string[];
  missions: string[];
  values: VisionValueItem[];
  showMetricsOnPage?: boolean;
  metricsSectionTitle?: string;
  keyMetrics?: PageKeyMetric[];
  chartTitle?: string;
  chartItems?: PageChartItem[];
}

export interface AdminVisionValeursEditorProps {
  data: VisionMissionsValeursContent;
  onChange: (next: VisionMissionsValeursContent) => void;
}

export const AdminVisionValeursEditor: React.FC<AdminVisionValeursEditorProps> = ({ data, onChange }) => {
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();
  const [isOpen, setIsOpen] = useState(false);

  if (!isPrivileged || !showEditorControls) {
    return null;
  }

  const moveItem = <T,>(list: T[], index: number, dir: -1 | 1): T[] => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return list;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    return copy;
  };

  const keyMetrics = data.keyMetrics || [];
  const chartItems =
    data.chartItems && data.chartItems.length > 0
      ? data.chartItems
      : [
          { name: 'Paragraphes Vision', value: data.vision.length },
          { name: 'Missions prioritaires', value: data.missions.length },
          { name: 'Valeurs cardinales', value: data.values.length },
        ];

  return (
    <div className="container mx-auto px-6 pt-6" data-interactive="true">
      <div className="rounded-2xl border border-purple-200 bg-white p-4 sm:p-5 shadow-sm text-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-purple-950 font-playfair">
                  Espace Éditeur · Page Vision, Missions & Valeurs
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                  Privilège Éditeur
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Éditez chaque bloc dans l&apos;ordre exact de la page : en-tête, 1. Notre Vision, 2. Nos Missions, 3. Nos Valeurs et indicateurs.
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
                <ChevronUp className="mr-1.5 h-3.5 w-3.5" /> Masquer l&apos;éditeur de données
              </>
            ) : (
              <>
                <ChevronDown className="mr-1.5 h-3.5 w-3.5" /> Afficher l&apos;éditeur de données
              </>
            )}
          </Button>
        </div>

        {isOpen && (
          <div className="mt-4 space-y-6 animate-in fade-in duration-200">
            {/* 1. En-tête Hero */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 block">
                1. En-tête Hero de la page
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Titre principal</label>
                  <Input
                    value={data.heroTitle ?? 'NOTRE VISION, NOS MISSIONS, NOS VALEURS'}
                    onChange={(e) => onChange({ ...data, heroTitle: e.target.value })}
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Sous-titre</label>
                  <Input
                    value={data.heroSubtitle ?? 'Lycée Français Jacques Prévert - Sénégal'}
                    onChange={(e) => onChange({ ...data, heroSubtitle: e.target.value })}
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Section 1. NOTRE VISION */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Section « 1. NOTRE VISION » ({data.vision.length} paragraphe(s))
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    onChange({
                      ...data,
                      vision: [...data.vision, 'Nouveau paragraphe de vision.'],
                    })
                  }
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter un paragraphe
                </Button>
              </div>
              <Input
                value={data.visionSectionTitle ?? 'NOTRE VISION'}
                onChange={(e) => onChange({ ...data, visionSectionTitle: e.target.value })}
                className="h-8 text-xs bg-white font-semibold"
              />
              <div className="space-y-2">
                {data.vision.map((paragraph, idx) => (
                  <div key={`vmv-vis-${idx}`} className="flex items-start gap-2">
                    <textarea
                      rows={3}
                      value={paragraph}
                      onChange={(e) =>
                        onChange({
                          ...data,
                          vision: data.vision.map((p, i) => (i === idx ? e.target.value : p)),
                        })
                      }
                      className="w-full rounded-md border border-slate-200 bg-white p-2 text-xs"
                    />
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={idx === 0}
                        onClick={() => onChange({ ...data, vision: moveItem(data.vision, idx, -1) })}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={idx === data.vision.length - 1}
                        onClick={() => onChange({ ...data, vision: moveItem(data.vision, idx, 1) })}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          onChange({
                            ...data,
                            vision: data.vision.filter((_, i) => i !== idx),
                          })
                        }
                        className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Section 2. NOS MISSIONS */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Section « 2. NOS MISSIONS » ({data.missions.length} missions)
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    onChange({
                      ...data,
                      missions: [...data.missions, 'Nouvelle mission prioritaire du LFJP.'],
                    })
                  }
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter une mission
                </Button>
              </div>
              <Input
                value={data.missionsSectionTitle ?? 'NOS MISSIONS'}
                onChange={(e) => onChange({ ...data, missionsSectionTitle: e.target.value })}
                className="h-8 text-xs bg-white font-semibold"
              />
              <div className="space-y-1.5">
                {data.missions.map((mission, idx) => (
                  <div key={`vmv-mis-${idx}`} className="flex items-center gap-2">
                    <span className="w-6 text-center text-[11px] font-bold text-french-blue shrink-0">
                      {idx + 1}.
                    </span>
                    <Input
                      value={mission}
                      onChange={(e) =>
                        onChange({
                          ...data,
                          missions: data.missions.map((m, i) => (i === idx ? e.target.value : m)),
                        })
                      }
                      className="h-7 text-xs bg-white"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={idx === 0}
                      onClick={() => onChange({ ...data, missions: moveItem(data.missions, idx, -1) })}
                      className="h-6 w-6 p-0 shrink-0"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={idx === data.missions.length - 1}
                      onClick={() => onChange({ ...data, missions: moveItem(data.missions, idx, 1) })}
                      className="h-6 w-6 p-0 shrink-0"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        onChange({
                          ...data,
                          missions: data.missions.filter((_, i) => i !== idx),
                        })
                      }
                      className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Section 3. NOS VALEURS */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  4. Section « 3. NOS VALEURS » ({data.values.length} valeurs)
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    onChange({
                      ...data,
                      values: [
                        ...data.values,
                        { name: 'Nouvelle valeur', description: 'Description de la valeur.' },
                      ],
                    })
                  }
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter une valeur
                </Button>
              </div>
              <Input
                value={data.valeursSectionTitle ?? 'NOS VALEURS'}
                onChange={(e) => onChange({ ...data, valeursSectionTitle: e.target.value })}
                className="h-8 text-xs bg-white font-semibold"
              />
              <div className="space-y-2">
                {data.values.map((val, idx) => (
                  <div
                    key={`vmv-val-${idx}`}
                    className="grid gap-2 sm:grid-cols-[180px_1fr_auto] items-center rounded-lg border border-slate-200 bg-slate-50/50 p-2"
                  >
                    <Input
                      value={val.name}
                      onChange={(e) =>
                        onChange({
                          ...data,
                          values: data.values.map((v, i) => (i === idx ? { ...v, name: e.target.value } : v)),
                        })
                      }
                      className="h-7 text-xs bg-white font-bold text-french-blue"
                    />
                    <Input
                      value={val.description}
                      onChange={(e) =>
                        onChange({
                          ...data,
                          values: data.values.map((v, i) =>
                            i === idx ? { ...v, description: e.target.value } : v
                          ),
                        })
                      }
                      className="h-7 text-xs bg-white"
                    />
                    <div className="flex items-center gap-0.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={idx === 0}
                        onClick={() => onChange({ ...data, values: moveItem(data.values, idx, -1) })}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={idx === data.values.length - 1}
                        onClick={() => onChange({ ...data, values: moveItem(data.values, idx, 1) })}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          onChange({
                            ...data,
                            values: data.values.filter((_, i) => i !== idx),
                          })
                        }
                        className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Chiffres clés & Graphique */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  5. Chiffres clés & Graphique de synthèse ({keyMetrics.length} indicateurs)
                </span>
                <label className="text-xs flex items-center gap-1.5 font-medium text-purple-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(data.showMetricsOnPage)}
                    onChange={(e) => onChange({ ...data, showMetricsOnPage: e.target.checked })}
                  />
                  Afficher cette section sur la page publique
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Chiffres clés</span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        onChange({
                          ...data,
                          keyMetrics: [...keyMetrics, { label: 'Repère clé', value: '5 valeurs', note: 'Projet LFJP' }],
                        })
                      }
                      className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter
                    </Button>
                  </div>
                  {keyMetrics.map((km, idx) => (
                    <div key={`vmv-km-${idx}`} className="grid gap-1.5 grid-cols-[1fr_90px_1fr_auto] items-center">
                      <Input
                        value={km.label}
                        onChange={(e) =>
                          onChange({
                            ...data,
                            keyMetrics: keyMetrics.map((it, i) => (i === idx ? { ...it, label: e.target.value } : it)),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                      <Input
                        value={km.value}
                        onChange={(e) =>
                          onChange({
                            ...data,
                            keyMetrics: keyMetrics.map((it, i) => (i === idx ? { ...it, value: e.target.value } : it)),
                          })
                        }
                        className="h-7 text-xs bg-white font-bold"
                      />
                      <Input
                        value={km.note || ''}
                        onChange={(e) =>
                          onChange({
                            ...data,
                            keyMetrics: keyMetrics.map((it, i) => (i === idx ? { ...it, note: e.target.value } : it)),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          onChange({
                            ...data,
                            keyMetrics: keyMetrics.filter((_, i) => i !== idx),
                          })
                        }
                        className="h-6 w-6 p-0 text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Barres du graphique</span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        onChange({
                          ...data,
                          chartItems: [...(data.chartItems || chartItems), { name: 'Indicateur', value: 10 }],
                        })
                      }
                      className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter barre
                    </Button>
                  </div>
                  {(data.chartItems || chartItems).map((ci, idx) => (
                    <div key={`vmv-ci-${idx}`} className="grid gap-1.5 grid-cols-[1fr_80px_auto] items-center">
                      <Input
                        value={ci.name}
                        onChange={(e) =>
                          onChange({
                            ...data,
                            chartItems: (data.chartItems || chartItems).map((it, i) =>
                              i === idx ? { ...it, name: e.target.value } : it
                            ),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                      <LocaleNumberInput
                        min={0}
                        value={ci.value}
                        onValueChange={(num) =>
                          onChange({
                            ...data,
                            chartItems: (data.chartItems || chartItems).map((it, i) =>
                              i === idx ? { ...it, value: Math.max(0, num) } : it
                            ),
                          })
                        }
                        className="h-7 text-xs bg-white font-bold"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          onChange({
                            ...data,
                            chartItems: (data.chartItems || chartItems).filter((_, i) => i !== idx),
                          })
                        }
                        className="h-6 w-6 p-0 text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {chartItems.length > 0 && (
                <div className="h-[180px] w-full rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartItems} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" name="Nombre / Valeur" fill="#005BAC" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVisionValeursEditor;
