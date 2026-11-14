import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocaleNumberInput } from '@/components/ui/locale-number-input';
import { ArrowDown, ArrowUp, BarChart3, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { usePrivilegedAccess } from '@/lib/authAccess';
import type { PageChartItem, PageKeyMetric } from '@/data/methodeData';
import type { TextStyle } from '@/content/pageTypes';

export interface HomeCardItem {
  title: string;
  description: string;
  linkLabel: string;
  path: string;
  image?: string;
  style?: TextStyle;
}

export interface HomeMessageItem {
  eyebrow: string;
  title: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  signature: string[];
  wide?: boolean;
}

export interface HomeSectionContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  cards: HomeCardItem[];
  messages: HomeMessageItem[];
  showMetricsOnPage?: boolean;
  metricsSectionTitle?: string;
  keyMetrics?: PageKeyMetric[];
  chartTitle?: string;
  chartItems?: PageChartItem[];
}

export interface AdminHomeEditorProps {
  home: HomeSectionContent;
  onChange: (nextHome: HomeSectionContent) => void;
}

export const AdminHomeEditor: React.FC<AdminHomeEditorProps> = ({ home, onChange }) => {
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();
  const [isOpen, setIsOpen] = useState(false);

  if (!isPrivileged || !showEditorControls) {
    return null;
  }

  const keyMetrics = home.keyMetrics || [];
  const chartItems =
    home.chartItems && home.chartItems.length > 0
      ? home.chartItems
      : [
          { name: 'Cartes rubriques', value: home.cards.length, target: 6 },
          { name: 'Mots officiels', value: home.messages.length, target: 5 },
          { name: 'Chiffres clés', value: keyMetrics.length, target: 4 },
        ];

  const moveItem = <T,>(list: T[], index: number, dir: -1 | 1): T[] => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return list;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    return copy;
  };

  return (
    <div
      className="container mx-auto px-6 pt-6"
      data-interactive="true"
    >
      <div className="rounded-2xl border border-purple-200 bg-white p-4 sm:p-5 shadow-sm text-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-purple-950 font-playfair">
                  Espace Éditeur · Page Accueil
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                  Privilège Éditeur
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Éditez la page d&apos;accueil de haut en bas : bannière d&apos;ouverture, cartes du PSD, mots officiels, chiffres clés et graphique.
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
                1. En-tête & Bannière d&apos;accueil (Hero)
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Titre principal
                  </label>
                  <Input
                    value={home.heroTitle}
                    onChange={(e) => onChange({ ...home, heroTitle: e.target.value })}
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Sous-titre / Devise
                  </label>
                  <Input
                    value={home.heroSubtitle}
                    onChange={(e) => onChange({ ...home, heroSubtitle: e.target.value })}
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Section Cartes du PSD */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Cartes de présentation du Plan Stratégique ({home.cards.length})
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    onChange({
                      ...home,
                      cards: [
                        ...home.cards,
                        {
                          title: 'Nouvelle rubrique',
                          description: 'Description synthétique de la rubrique.',
                          linkLabel: 'Découvrir',
                          path: '/plan-strategique',
                          style: { fontFamily: 'default', fontSize: 'normal', align: 'left', lineHeight: 'relaxed' },
                        },
                      ],
                    })
                  }
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter une carte
                </Button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Titre de la section des cartes
                </label>
                <Input
                  value={home.sectionTitle}
                  onChange={(e) => onChange({ ...home, sectionTitle: e.target.value })}
                  className="h-8 text-xs bg-white"
                />
              </div>

              <div className="space-y-2.5">
                {home.cards.map((card, idx) => (
                  <div key={`home-card-ed-${idx}`} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-french-blue">Carte {idx + 1}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={idx === 0}
                          onClick={() => onChange({ ...home, cards: moveItem(home.cards, idx, -1) })}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={idx === home.cards.length - 1}
                          onClick={() => onChange({ ...home, cards: moveItem(home.cards, idx, 1) })}
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
                              ...home,
                              cards: home.cards.filter((_, i) => i !== idx),
                            })
                          }
                          className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      <Input
                        value={card.title}
                        placeholder="Titre"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            cards: home.cards.map((c, i) => (i === idx ? { ...c, title: e.target.value } : c)),
                          })
                        }
                        className="h-7 text-xs bg-white font-semibold"
                      />
                      <Input
                        value={card.linkLabel}
                        placeholder="Libellé du bouton"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            cards: home.cards.map((c, i) => (i === idx ? { ...c, linkLabel: e.target.value } : c)),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                      <Input
                        value={card.path}
                        placeholder="/route"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            cards: home.cards.map((c, i) => (i === idx ? { ...c, path: e.target.value } : c)),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                    </div>
                    <Input
                      value={card.description}
                      placeholder="Description"
                      onChange={(e) =>
                        onChange({
                          ...home,
                          cards: home.cards.map((c, i) => (i === idx ? { ...c, description: e.target.value } : c)),
                        })
                      }
                      className="h-7 text-xs bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Section Mots officiels & Communications */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Mots officiels & Communications ({home.messages.length})
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    onChange({
                      ...home,
                      messages: [
                        ...home.messages,
                        {
                          eyebrow: 'Nouvelle communication',
                          title: 'Titre du message',
                          image: 'https://i.imgur.com/0YmGlXO.png',
                          imageAlt: 'Illustration LFJP',
                          paragraphs: ['Texte du message officiel.'],
                          signature: ['Direction du LFJP'],
                          wide: false,
                        },
                      ],
                    })
                  }
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter un message
                </Button>
              </div>

              <div className="space-y-3">
                {home.messages.map((msg, mIdx) => (
                  <div key={`home-msg-ed-${mIdx}`} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-french-blue">
                        Message {mIdx + 1} · {msg.title}
                      </span>
                      <div className="flex items-center gap-1">
                        <label className="text-[11px] flex items-center gap-1 mr-2 text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(msg.wide)}
                            onChange={(e) =>
                              onChange({
                                ...home,
                                messages: home.messages.map((m, i) =>
                                  i === mIdx ? { ...m, wide: e.target.checked } : m
                                ),
                              })
                            }
                          />
                          Pleine largeur
                        </label>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={mIdx === 0}
                          onClick={() => onChange({ ...home, messages: moveItem(home.messages, mIdx, -1) })}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={mIdx === home.messages.length - 1}
                          onClick={() => onChange({ ...home, messages: moveItem(home.messages, mIdx, 1) })}
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
                              ...home,
                              messages: home.messages.filter((_, i) => i !== mIdx),
                            })
                          }
                          className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      <Input
                        value={msg.eyebrow}
                        placeholder="Surtitre"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            messages: home.messages.map((m, i) =>
                              i === mIdx ? { ...m, eyebrow: e.target.value } : m
                            ),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                      <Input
                        value={msg.title}
                        placeholder="Titre"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            messages: home.messages.map((m, i) =>
                              i === mIdx ? { ...m, title: e.target.value } : m
                            ),
                          })
                        }
                        className="h-7 text-xs bg-white font-semibold"
                      />
                      <Input
                        value={msg.image}
                        placeholder="URL image"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            messages: home.messages.map((m, i) =>
                              i === mIdx ? { ...m, image: e.target.value } : m
                            ),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-600">Paragraphes ({msg.paragraphs.length})</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onChange({
                              ...home,
                              messages: home.messages.map((m, i) =>
                                i === mIdx
                                  ? { ...m, paragraphs: [...m.paragraphs, 'Nouveau paragraphe.'] }
                                  : m
                              ),
                            })
                          }
                          className="h-6 text-[11px]"
                        >
                          <Plus className="mr-1 h-3 w-3" /> Ajouter un paragraphe
                        </Button>
                      </div>
                      {msg.paragraphs.map((p, pIdx) => (
                        <div key={`msg-${mIdx}-p-${pIdx}`} className="flex items-start gap-1.5">
                          <textarea
                            value={p}
                            rows={2}
                            onChange={(e) =>
                              onChange({
                                ...home,
                                messages: home.messages.map((m, i) =>
                                  i === mIdx
                                    ? {
                                        ...m,
                                        paragraphs: m.paragraphs.map((it, pi) =>
                                          pi === pIdx ? e.target.value : it
                                        ),
                                      }
                                    : m
                                ),
                              })
                            }
                            className="w-full rounded-md border border-slate-200 bg-white p-1.5 text-xs"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              onChange({
                                ...home,
                                messages: home.messages.map((m, i) =>
                                  i === mIdx
                                    ? {
                                        ...m,
                                        paragraphs: m.paragraphs.filter((_, pi) => pi !== pIdx),
                                      }
                                    : m
                                ),
                              })
                            }
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-600">Signataires ({msg.signature.length})</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onChange({
                              ...home,
                              messages: home.messages.map((m, i) =>
                                i === mIdx
                                  ? { ...m, signature: [...m.signature, 'Nouveau signataire'] }
                                  : m
                              ),
                            })
                          }
                          className="h-6 text-[11px]"
                        >
                          <Plus className="mr-1 h-3 w-3" /> Ajouter une ligne
                        </Button>
                      </div>
                      {msg.signature.map((sig, sIdx) => (
                        <div key={`msg-${mIdx}-s-${sIdx}`} className="flex items-center gap-1.5">
                          <Input
                            value={sig}
                            onChange={(e) =>
                              onChange({
                                ...home,
                                messages: home.messages.map((m, i) =>
                                  i === mIdx
                                    ? {
                                        ...m,
                                        signature: m.signature.map((it, si) =>
                                          si === sIdx ? e.target.value : it
                                        ),
                                      }
                                    : m
                                ),
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
                                ...home,
                                messages: home.messages.map((m, i) =>
                                  i === mIdx
                                    ? {
                                        ...m,
                                        signature: m.signature.filter((_, si) => si !== sIdx),
                                      }
                                    : m
                                ),
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
                ))}
              </div>
            </div>

            {/* 4. Chiffres clés & Graphique */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  4. Chiffres clés & Graphique de suivi ({keyMetrics.length} indicateurs)
                </span>
                <label className="text-xs flex items-center gap-1.5 font-medium text-purple-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(home.showMetricsOnPage)}
                    onChange={(e) => onChange({ ...home, showMetricsOnPage: e.target.checked })}
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
                          ...home,
                          keyMetrics: [...keyMetrics, { label: 'Nouveau repère', value: '100 %', note: 'Horizon 2030' }],
                        })
                      }
                      className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter
                    </Button>
                  </div>
                  {keyMetrics.map((km, kIdx) => (
                    <div key={`home-km-${kIdx}`} className="grid gap-1.5 grid-cols-[1fr_90px_1fr_auto] items-center">
                      <Input
                        value={km.label}
                        placeholder="Libellé"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            keyMetrics: keyMetrics.map((it, i) => (i === kIdx ? { ...it, label: e.target.value } : it)),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                      <Input
                        value={km.value}
                        placeholder="Valeur"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            keyMetrics: keyMetrics.map((it, i) => (i === kIdx ? { ...it, value: e.target.value } : it)),
                          })
                        }
                        className="h-7 text-xs bg-white font-bold"
                      />
                      <Input
                        value={km.note || ''}
                        placeholder="Précision"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            keyMetrics: keyMetrics.map((it, i) => (i === kIdx ? { ...it, note: e.target.value } : it)),
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
                            ...home,
                            keyMetrics: keyMetrics.filter((_, i) => i !== kIdx),
                          })
                        }
                        className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
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
                          ...home,
                          chartItems: [...(home.chartItems || chartItems), { name: 'Indicateur', value: 50, target: 100 }],
                        })
                      }
                      className="h-6 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter barre
                    </Button>
                  </div>
                  {(home.chartItems || chartItems).map((ci, cIdx) => (
                    <div key={`home-ci-${cIdx}`} className="grid gap-1.5 grid-cols-[1fr_80px_auto] items-center">
                      <Input
                        value={ci.name}
                        onChange={(e) =>
                          onChange({
                            ...home,
                            chartItems: (home.chartItems || chartItems).map((it, i) =>
                              i === cIdx ? { ...it, name: e.target.value } : it
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
                            ...home,
                            chartItems: (home.chartItems || chartItems).map((it, i) =>
                              i === cIdx ? { ...it, value: Math.max(0, num) } : it
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
                            ...home,
                            chartItems: (home.chartItems || chartItems).filter((_, i) => i !== cIdx),
                          })
                        }
                        className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
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
                      <Bar dataKey="value" name="Valeur" fill="#005BAC" radius={[4, 4, 0, 0]} />
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

export default AdminHomeEditor;
