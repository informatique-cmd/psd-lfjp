import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocaleNumberInput } from '@/components/ui/locale-number-input';
import { ArrowDown, ArrowUp, BarChart3, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { usePrivilegedAccess } from '@/lib/authAccess';
import type { MethodeData } from '@/data/methodeData';
import { sanitizeMethodeData } from '@/lib/pageDataSanitizer';

export interface AdminMethodeEditorProps {
  methodeData: MethodeData;
  onChange: (next: MethodeData) => void;
}

export const AdminMethodeEditor: React.FC<AdminMethodeEditorProps> = ({ methodeData, onChange }) => {
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();
  const [isOpen, setIsOpen] = useState(false);

  if (!isPrivileged || !showEditorControls) {
    return null;
  }

  const emit = (next: MethodeData) => {
    const clean = (sanitizeMethodeData(next) || next) as MethodeData;
    onChange(clean);
  };

  const moveItem = <T,>(list: T[], index: number, dir: -1 | 1): T[] => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return list;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    return copy;
  };

  const keyMetrics = methodeData.keyMetrics || [];
  const chartItems =
    methodeData.chartItems && methodeData.chartItems.length > 0
      ? methodeData.chartItems
      : methodeData.steps.map((s, i) => ({
          name: s.title.length > 18 ? `Étape ${i + 1}` : s.title,
          value: 100,
          target: 100,
        }));

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
                  Espace Éditeur · Page Méthode
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                  Privilège Éditeur
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Modifiez les sections de la page Méthode dans leur ordre exact d&apos;apparition : en-tête, étapes, gouvernance, cycle de validation et indicateurs.
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
                1. En-tête de la page Méthode (Hero)
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Titre Hero</label>
                  <Input
                    value={methodeData.heroTitle}
                    onChange={(e) => emit({ ...methodeData, heroTitle: e.target.value })}
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Sous-titre Hero</label>
                  <Input
                    value={methodeData.heroSubtitle}
                    onChange={(e) => emit({ ...methodeData, heroSubtitle: e.target.value })}
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Section Démarche & Étapes */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Étapes de la démarche ({methodeData.steps.length})
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    emit({
                      ...methodeData,
                      steps: [
                        ...methodeData.steps,
                        { title: 'Nouvelle étape', description: "Description de l'étape méthodologique." },
                      ],
                    })
                  }
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter une étape
                </Button>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <Input
                  value={methodeData.stepsEyebrow}
                  placeholder="Surtitre"
                  onChange={(e) => emit({ ...methodeData, stepsEyebrow: e.target.value })}
                  className="h-8 text-xs bg-white"
                />
                <Input
                  value={methodeData.stepsTitle}
                  placeholder="Titre de la section"
                  onChange={(e) => emit({ ...methodeData, stepsTitle: e.target.value })}
                  className="h-8 text-xs bg-white sm:col-span-2 font-semibold"
                />
              </div>
              <Input
                value={methodeData.stepsSubtitle}
                placeholder="Introduction"
                onChange={(e) => emit({ ...methodeData, stepsSubtitle: e.target.value })}
                className="h-8 text-xs bg-white"
              />

              <div className="space-y-2">
                {methodeData.steps.map((step, idx) => (
                  <div
                    key={`meth-step-${idx}`}
                    className="grid gap-2 sm:grid-cols-[auto_220px_1fr_auto] items-center rounded-lg border border-slate-200 bg-slate-50/50 p-2"
                  >
                    <span className="text-[11px] font-bold text-french-blue px-1">Étape {idx + 1}</span>
                    <Input
                      value={step.title}
                      onChange={(e) =>
                        emit({
                          ...methodeData,
                          steps: methodeData.steps.map((s, i) => (i === idx ? { ...s, title: e.target.value } : s)),
                        })
                      }
                      className="h-7 text-xs bg-white font-semibold"
                    />
                    <Input
                      value={step.description}
                      onChange={(e) =>
                        emit({
                          ...methodeData,
                          steps: methodeData.steps.map((s, i) =>
                            i === idx ? { ...s, description: e.target.value } : s
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
                        onClick={() => emit({ ...methodeData, steps: moveItem(methodeData.steps, idx, -1) })}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={idx === methodeData.steps.length - 1}
                        onClick={() => emit({ ...methodeData, steps: moveItem(methodeData.steps, idx, 1) })}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          emit({
                            ...methodeData,
                            steps: methodeData.steps.filter((_, i) => i !== idx),
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

            {/* 3. Section Gouvernance & Cycle de validation */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Carte gauche : Commission PSD */}
              <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  3a. Carte Commission PSD & APE
                </span>
                <Input
                  value={methodeData.commissionCard.eyebrow}
                  placeholder="Surtitre"
                  onChange={(e) =>
                    emit({
                      ...methodeData,
                      commissionCard: { ...methodeData.commissionCard, eyebrow: e.target.value },
                    })
                  }
                  className="h-7 text-xs bg-white"
                />
                <Input
                  value={methodeData.commissionCard.title}
                  placeholder="Titre"
                  onChange={(e) =>
                    emit({
                      ...methodeData,
                      commissionCard: { ...methodeData.commissionCard, title: e.target.value },
                    })
                  }
                  className="h-7 text-xs bg-white font-semibold"
                />
                {methodeData.commissionCard.paragraphs.map((p, idx) => (
                  <div key={`comm-p-${idx}`} className="flex items-start gap-1.5">
                    <textarea
                      rows={2}
                      value={p}
                      onChange={(e) =>
                        emit({
                          ...methodeData,
                          commissionCard: {
                            ...methodeData.commissionCard,
                            paragraphs: methodeData.commissionCard.paragraphs.map((it, i) =>
                              i === idx ? e.target.value : it
                            ),
                          },
                        })
                      }
                      className="w-full rounded-md border border-slate-200 bg-white p-1.5 text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        emit({
                          ...methodeData,
                          commissionCard: {
                            ...methodeData.commissionCard,
                            paragraphs: methodeData.commissionCard.paragraphs.filter((_, i) => i !== idx),
                          },
                        })
                      }
                      className="h-6 w-6 p-0 text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    emit({
                      ...methodeData,
                      commissionCard: {
                        ...methodeData.commissionCard,
                        paragraphs: [...methodeData.commissionCard.paragraphs, 'Nouveau paragraphe.'],
                      },
                    })
                  }
                  className="h-6 text-[11px]"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter un paragraphe
                </Button>

                <div className="grid gap-3 sm:grid-cols-2 pt-2">
                  <div className="space-y-1.5">
                    <Input
                      value={methodeData.commissionCard.roleBoxTitle}
                      onChange={(e) =>
                        emit({
                          ...methodeData,
                          commissionCard: { ...methodeData.commissionCard, roleBoxTitle: e.target.value },
                        })
                      }
                      className="h-7 text-xs font-bold bg-blue-50/60"
                    />
                    {methodeData.commissionCard.roleItems.map((item, idx) => (
                      <div key={`role-it-${idx}`} className="flex items-center gap-1">
                        <Input
                          value={item}
                          onChange={(e) =>
                            emit({
                              ...methodeData,
                              commissionCard: {
                                ...methodeData.commissionCard,
                                roleItems: methodeData.commissionCard.roleItems.map((it, i) =>
                                  i === idx ? e.target.value : it
                                ),
                              },
                            })
                          }
                          className="h-7 text-xs bg-white"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            emit({
                              ...methodeData,
                              commissionCard: {
                                ...methodeData.commissionCard,
                                roleItems: methodeData.commissionCard.roleItems.filter((_, i) => i !== idx),
                              },
                            })
                          }
                          className="h-6 w-6 p-0 text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        emit({
                          ...methodeData,
                          commissionCard: {
                            ...methodeData.commissionCard,
                            roleItems: [...methodeData.commissionCard.roleItems, 'Nouveau rôle.'],
                          },
                        })
                      }
                      className="h-6 text-[11px]"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <Input
                      value={methodeData.commissionCard.validationBoxTitle}
                      onChange={(e) =>
                        emit({
                          ...methodeData,
                          commissionCard: { ...methodeData.commissionCard, validationBoxTitle: e.target.value },
                        })
                      }
                      className="h-7 text-xs font-bold bg-emerald-50/60"
                    />
                    {methodeData.commissionCard.validationItems.map((item, idx) => (
                      <div key={`val-it-${idx}`} className="flex items-center gap-1">
                        <Input
                          value={item}
                          onChange={(e) =>
                            emit({
                              ...methodeData,
                              commissionCard: {
                                ...methodeData.commissionCard,
                                validationItems: methodeData.commissionCard.validationItems.map((it, i) =>
                                  i === idx ? e.target.value : it
                                ),
                              },
                            })
                          }
                          className="h-7 text-xs bg-white"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            emit({
                              ...methodeData,
                              commissionCard: {
                                ...methodeData.commissionCard,
                                validationItems: methodeData.commissionCard.validationItems.filter(
                                  (_, i) => i !== idx
                                ),
                              },
                            })
                          }
                          className="h-6 w-6 p-0 text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        emit({
                          ...methodeData,
                          commissionCard: {
                            ...methodeData.commissionCard,
                            validationItems: [...methodeData.commissionCard.validationItems, 'Nouveau point.'],
                          },
                        })
                      }
                      className="h-6 text-[11px]"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter
                    </Button>
                  </div>
                </div>
              </div>

              {/* Carte droite : Cycle de validation */}
              <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  3b. Carte Cycle de validation
                </span>
                <Input
                  value={methodeData.validationCard.eyebrow}
                  placeholder="Surtitre"
                  onChange={(e) =>
                    emit({
                      ...methodeData,
                      validationCard: { ...methodeData.validationCard, eyebrow: e.target.value },
                    })
                  }
                  className="h-7 text-xs bg-white"
                />
                <Input
                  value={methodeData.validationCard.title}
                  placeholder="Titre"
                  onChange={(e) =>
                    emit({
                      ...methodeData,
                      validationCard: { ...methodeData.validationCard, title: e.target.value },
                    })
                  }
                  className="h-7 text-xs bg-white font-semibold"
                />
                {methodeData.validationCard.paragraphs.map((p, idx) => (
                  <div key={`vc-p-${idx}`} className="flex items-start gap-1.5">
                    <textarea
                      rows={2}
                      value={p}
                      onChange={(e) =>
                        emit({
                          ...methodeData,
                          validationCard: {
                            ...methodeData.validationCard,
                            paragraphs: methodeData.validationCard.paragraphs.map((it, i) =>
                              i === idx ? e.target.value : it
                            ),
                          },
                        })
                      }
                      className="w-full rounded-md border border-slate-200 bg-white p-1.5 text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        emit({
                          ...methodeData,
                          validationCard: {
                            ...methodeData.validationCard,
                            paragraphs: methodeData.validationCard.paragraphs.filter((_, i) => i !== idx),
                          },
                        })
                      }
                      className="h-6 w-6 p-0 text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    emit({
                      ...methodeData,
                      validationCard: {
                        ...methodeData.validationCard,
                        paragraphs: [...methodeData.validationCard.paragraphs, 'Nouveau paragraphe.'],
                      },
                    })
                  }
                  className="h-6 text-[11px]"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter un paragraphe
                </Button>

                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Points clés de validation</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        emit({
                          ...methodeData,
                          validationCard: {
                            ...methodeData.validationCard,
                            highlights: [
                              ...methodeData.validationCard.highlights,
                              { title: 'Nouveau jalon', description: 'Précision du jalon.' },
                            ],
                          },
                        })
                      }
                      className="h-6 text-[11px]"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter
                    </Button>
                  </div>
                  {methodeData.validationCard.highlights.map((hl, idx) => (
                    <div key={`hl-m-${idx}`} className="grid gap-1.5 grid-cols-[1fr_1.4fr_auto] items-center">
                      <Input
                        value={hl.title}
                        onChange={(e) =>
                          emit({
                            ...methodeData,
                            validationCard: {
                              ...methodeData.validationCard,
                              highlights: methodeData.validationCard.highlights.map((it, i) =>
                                i === idx ? { ...it, title: e.target.value } : it
                              ),
                            },
                          })
                        }
                        className="h-7 text-xs bg-white font-semibold"
                      />
                      <Input
                        value={hl.description}
                        onChange={(e) =>
                          emit({
                            ...methodeData,
                            validationCard: {
                              ...methodeData.validationCard,
                              highlights: methodeData.validationCard.highlights.map((it, i) =>
                                i === idx ? { ...it, description: e.target.value } : it
                              ),
                            },
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          emit({
                            ...methodeData,
                            validationCard: {
                              ...methodeData.validationCard,
                              highlights: methodeData.validationCard.highlights.filter((_, i) => i !== idx),
                            },
                          })
                        }
                        className="h-6 w-6 p-0 text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Chiffres clés & Graphique */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  4. Chiffres clés & Graphique méthodologique ({keyMetrics.length} indicateurs)
                </span>
                <label className="text-xs flex items-center gap-1.5 font-medium text-purple-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(methodeData.showMetricsOnPage)}
                    onChange={(e) => emit({ ...methodeData, showMetricsOnPage: e.target.checked })}
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
                        emit({
                          ...methodeData,
                          keyMetrics: [...keyMetrics, { label: 'Indicateur', value: '100 %', note: 'Suivi continu' }],
                        })
                      }
                      className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter
                    </Button>
                  </div>
                  {keyMetrics.map((km, idx) => (
                    <div key={`m-km-${idx}`} className="grid gap-1.5 grid-cols-[1fr_90px_1fr_auto] items-center">
                      <Input
                        value={km.label}
                        onChange={(e) =>
                          emit({
                            ...methodeData,
                            keyMetrics: keyMetrics.map((it, i) => (i === idx ? { ...it, label: e.target.value } : it)),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                      <Input
                        value={km.value}
                        onChange={(e) =>
                          emit({
                            ...methodeData,
                            keyMetrics: keyMetrics.map((it, i) => (i === idx ? { ...it, value: e.target.value } : it)),
                          })
                        }
                        className="h-7 text-xs bg-white font-bold"
                      />
                      <Input
                        value={km.note || ''}
                        onChange={(e) =>
                          emit({
                            ...methodeData,
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
                          emit({
                            ...methodeData,
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
                        emit({
                          ...methodeData,
                          chartItems: [...chartItems, { name: 'Nouvelle phase', value: 50, target: 100 }],
                        })
                      }
                      className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter barre
                    </Button>
                  </div>
                  {chartItems.map((ci, idx) => (
                    <div key={`m-ci-${idx}`} className="grid gap-1.5 grid-cols-[1fr_80px_auto] items-center">
                      <Input
                        value={ci.name}
                        onChange={(e) =>
                          emit({
                            ...methodeData,
                            chartItems: chartItems.map((it, i) => (i === idx ? { ...it, name: e.target.value } : it)),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                      <LocaleNumberInput
                        min={0}
                        value={ci.value}
                        onValueChange={(num) =>
                          emit({
                            ...methodeData,
                            chartItems: chartItems.map((it, i) =>
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
                          emit({
                            ...methodeData,
                            chartItems: chartItems.filter((_, i) => i !== idx),
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
                      <Bar dataKey="value" name="Avancement (%)" fill="#005BAC" radius={[4, 4, 0, 0]} />
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

export default AdminMethodeEditor;
