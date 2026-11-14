import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import type { PsdScoreItem, PsdSurveyData } from '@/data/psdSurveyData';
import { usePrivilegedAccess } from '@/lib/authAccess';
import { LocaleNumberInput } from '@/components/ui/locale-number-input';
import { mergeAndSanitizePsdSurveyData } from './PsdSurveyDataContext';

export interface AdminPsdSurveyEditorProps {
  psdSurveyData: PsdSurveyData;
  onChange: (updated: PsdSurveyData) => void;
}

const TONE_OPTIONS: Array<{ value: NonNullable<PsdScoreItem['tone']>; label: string }> = [
  { value: 'green', label: 'Vert (Point fort)' },
  { value: 'emerald', label: 'Émeraude' },
  { value: 'blue', label: 'Bleu' },
  { value: 'amber', label: 'Ambre' },
  { value: 'orange', label: 'Orange' },
  { value: 'red', label: 'Rouge (Critique)' },
  { value: 'purple', label: 'Violet (Priorité)' },
];

export const AdminPsdSurveyEditor: React.FC<AdminPsdSurveyEditorProps> = ({
  psdSurveyData,
  onChange,
}) => {
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();
  const [isOpen, setIsOpen] = useState(false);
  const [audience, setAudience] = useState<'eleves' | 'parents'>('eleves');
  const [subTab, setSubTab] = useState<'synthese' | 'info' | 'offre' | 'priorites'>('synthese');

  if (!isPrivileged || !showEditorControls) {
    return null;
  }

  const safeData = mergeAndSanitizePsdSurveyData(psdSurveyData);

  const emitUpdate = (next: PsdSurveyData) => {
    onChange(mergeAndSanitizePsdSurveyData(next));
  };

  const renderScoreTable = (
    title: string,
    rawItems: PsdScoreItem[],
    onItemsChange: (updatedItems: PsdScoreItem[]) => void
  ) => {
    const items = Array.isArray(rawItems) ? rawItems.filter(Boolean) : [];
    return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</span>
        <Button
          type="button"
          size="sm"
          onClick={() =>
            onItemsChange([
              ...items,
              { name: 'Nouvel indicateur', score: 3.0, tone: 'blue' },
            ])
          }
          className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="mr-1 h-3 w-3" /> Ajouter
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs divide-y divide-slate-200">
          <thead className="bg-slate-50 font-semibold text-slate-700">
            <tr>
              <th className="p-2">Critère</th>
              <th className="p-2 w-24">Note (/5)</th>
              <th className="p-2">Précision / Note</th>
              <th className="p-2 w-32">Couleur</th>
              <th className="p-2 text-right w-12">Suppr.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <tr key={`${title}-${idx}`} className="hover:bg-slate-50/70">
                <td className="p-1.5">
                  <Input
                    value={String(item?.name ?? '')}
                    onChange={(e) => {
                      const next = items.map((it, i) => (i === idx ? { ...it, name: e.target.value } : it));
                      onItemsChange(next);
                    }}
                    className="h-7 text-xs bg-white"
                  />
                </td>
                <td className="p-1.5">
                  <LocaleNumberInput
                    min={0}
                    max={5}
                    value={Number.isFinite(Number(item?.score)) ? Number(item.score) : 0}
                    onValueChange={(num) => {
                      const clamped = Math.min(5, Math.max(0, num));
                      const next = items.map((it, i) => (i === idx ? { ...it, score: clamped } : it));
                      onItemsChange(next);
                    }}
                    className="h-7 text-xs font-bold text-purple-900 bg-white"
                  />
                </td>
                <td className="p-1.5">
                  <Input
                    value={item?.note || ''}
                    placeholder="Optionnel"
                    onChange={(e) => {
                      const next = items.map((it, i) => (i === idx ? { ...it, note: e.target.value } : it));
                      onItemsChange(next);
                    }}
                    className="h-7 text-xs bg-white"
                  />
                </td>
                <td className="p-1.5">
                  <select
                    value={item?.tone || 'blue'}
                    onChange={(e) => {
                      const tone = e.target.value as PsdScoreItem['tone'];
                      const next = items.map((it, i) => (i === idx ? { ...it, tone } : it));
                      onItemsChange(next);
                    }}
                    className="h-7 w-full rounded-md border border-slate-200 bg-white px-1.5 text-xs"
                  >
                    {TONE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-1.5 text-right">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={items.length <= 1}
                    onClick={() => {
                      if (items.length <= 1) return;
                      onItemsChange(items.filter((_, i) => i !== idx));
                    }}
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
    );
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
                Espace Éditeur · Données & Graphiques Diagnostic PSD
              </h3>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                Privilège Éditeur
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifiez les scores sur 5, taux de recommandation et priorités des sondages Élèves et Parents : les synthèses et graphiques se recalculent en direct.
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
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAudience('eleves')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                  audience === 'eleves'
                    ? 'bg-french-blue text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Sondage Élèves ({safeData.eleves.totalResponses} rép.)
              </button>
              <button
                type="button"
                onClick={() => setAudience('parents')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                  audience === 'parents'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Sondage Parents ({safeData.parents.totalResponses} rép.)
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'synthese', label: '1. Échantillon & Recommandation' },
                { id: 'info', label: '2. Information & Installations' },
                { id: 'offre', label: '3. Offre & Accompagnement' },
                { id: 'priorites', label: '4. Points forts & Priorités' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSubTab(tab.id as typeof subTab)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium cursor-pointer ${
                    subTab === tab.id
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {audience === 'eleves' && (
            <div className="space-y-5">
              {subTab === 'synthese' && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Total réponses élèves
                      </label>
                      <LocaleNumberInput
                        min={0}
                        value={safeData.eleves.totalResponses}
                        onValueChange={(num) =>
                          emitUpdate({
                            ...safeData,
                            eleves: { ...safeData.eleves, totalResponses: Math.round(num) },
                          })
                        }
                        className="h-8 text-xs bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Taux de recommandation (%)
                      </label>
                      <LocaleNumberInput
                        min={0}
                        max={100}
                        value={safeData.eleves.recommendationRate}
                        onValueChange={(num) =>
                          emitUpdate({
                            ...safeData,
                            eleves: {
                              ...safeData.eleves,
                              recommendationRate: Math.min(100, Math.max(0, num)),
                            },
                          })
                        }
                        className="h-8 text-xs bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Commentaire recommandation
                      </label>
                      <Input
                        value={safeData.eleves.recommendationNote}
                        onChange={(e) =>
                          emitUpdate({
                            ...safeData,
                            eleves: { ...safeData.eleves, recommendationNote: e.target.value },
                          })
                        }
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Classes les mieux représentées
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          emitUpdate({
                            ...safeData,
                            eleves: {
                              ...safeData.eleves,
                              topClasses: [...safeData.eleves.topClasses, { name: '3ᵉ', percentage: 10 }],
                            },
                          })
                        }
                        className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Plus className="mr-1 h-3 w-3" /> Ajouter une classe
                      </Button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {safeData.eleves.topClasses.map((cls, idx) => (
                        <div key={`cls-${idx}`} className="flex items-center gap-1.5 rounded-lg border p-2 bg-slate-50">
                          <Input
                            value={cls.name}
                            onChange={(e) => {
                              const next = safeData.eleves.topClasses.map((c, i) =>
                                i === idx ? { ...c, name: e.target.value } : c
                              );
                              emitUpdate({ ...safeData, eleves: { ...safeData.eleves, topClasses: next } });
                            }}
                            className="h-7 text-xs bg-white"
                          />
                          <LocaleNumberInput
                            min={0}
                            max={100}
                            value={cls.percentage}
                            onValueChange={(num) => {
                              const next = safeData.eleves.topClasses.map((c, i) =>
                                i === idx ? { ...c, percentage: Math.min(100, Math.max(0, num)) } : c
                              );
                              emitUpdate({ ...safeData, eleves: { ...safeData.eleves, topClasses: next } });
                            }}
                            className="h-7 w-20 text-xs bg-white font-bold"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={safeData.eleves.topClasses.length <= 1}
                            onClick={() => {
                              const next = safeData.eleves.topClasses.filter((_, i) => i !== idx);
                              emitUpdate({ ...safeData, eleves: { ...safeData.eleves, topClasses: next } });
                            }}
                            className="h-7 w-7 p-0 text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {subTab === 'info' && (
                <div className="space-y-5">
                  {renderScoreTable(
                    "Qualité de l'information fournie aux élèves",
                    safeData.eleves.qualiteInformation,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        eleves: { ...safeData.eleves, qualiteInformation: next },
                      })
                  )}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Constat qualité de l&apos;information
                    </label>
                    <Input
                      value={safeData.eleves.qualiteInformationConstat}
                      onChange={(e) =>
                        emitUpdate({
                          ...safeData,
                          eleves: { ...safeData.eleves, qualiteInformationConstat: e.target.value },
                        })
                      }
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  {renderScoreTable(
                    'Installations & équipements (Élèves)',
                    safeData.eleves.installations,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        eleves: { ...safeData.eleves, installations: next },
                      })
                  )}
                </div>
              )}

              {subTab === 'offre' && (
                <div className="space-y-5">
                  {renderScoreTable(
                    'Offre scolaire et enseignements (Élèves)',
                    safeData.eleves.offreScolaire,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        eleves: { ...safeData.eleves, offreScolaire: next },
                      })
                  )}
                  {renderScoreTable(
                    'Accompagnement des élèves (Élèves)',
                    safeData.eleves.accompagnement,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        eleves: { ...safeData.eleves, accompagnement: next },
                      })
                  )}
                </div>
              )}

              {subTab === 'priorites' && (
                <div className="space-y-5">
                  {renderScoreTable(
                    'Points forts perçus (Élèves)',
                    safeData.eleves.pointsForts,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        eleves: { ...safeData.eleves, pointsForts: next },
                      })
                  )}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Constat points forts
                    </label>
                    <Input
                      value={safeData.eleves.pointsFortsConstat}
                      onChange={(e) =>
                        emitUpdate({
                          ...safeData,
                          eleves: { ...safeData.eleves, pointsFortsConstat: e.target.value },
                        })
                      }
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  {renderScoreTable(
                    'Priorités pour les prochaines années (Élèves)',
                    safeData.eleves.priorites,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        eleves: { ...safeData.eleves, priorites: next },
                      })
                  )}
                </div>
              )}
            </div>
          )}

          {audience === 'parents' && (
            <div className="space-y-5">
              {subTab === 'synthese' && (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Total réponses parents
                      </label>
                      <LocaleNumberInput
                        min={0}
                        value={safeData.parents.totalResponses}
                        onValueChange={(num) =>
                          emitUpdate({
                            ...safeData,
                            parents: { ...safeData.parents, totalResponses: Math.round(num) },
                          })
                        }
                        className="h-8 text-xs bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        1 seul enfant inscrit (%)
                      </label>
                      <LocaleNumberInput
                        min={0}
                        max={100}
                        value={safeData.parents.singleChildRate}
                        onValueChange={(num) =>
                          emitUpdate({
                            ...safeData,
                            parents: { ...safeData.parents, singleChildRate: Math.min(100, Math.max(0, num)) },
                          })
                        }
                        className="h-8 text-xs bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Taux recommandation (%)
                      </label>
                      <LocaleNumberInput
                        min={0}
                        max={100}
                        value={safeData.parents.recommendationRate}
                        onValueChange={(num) =>
                          emitUpdate({
                            ...safeData,
                            parents: {
                              ...safeData.parents,
                              recommendationRate: Math.min(100, Math.max(0, num)),
                            },
                          })
                        }
                        className="h-8 text-xs bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Commentaire recommandation
                      </label>
                      <Input
                        value={safeData.parents.recommendationNote}
                        onChange={(e) =>
                          emitUpdate({
                            ...safeData,
                            parents: { ...safeData.parents, recommendationNote: e.target.value },
                          })
                        }
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  </div>
                  {renderScoreTable(
                    'Pourquoi les familles choisissent-elles le LFJP ?',
                    safeData.parents.motifChoix,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        parents: { ...safeData.parents, motifChoix: next },
                      })
                  )}
                </div>
              )}

              {subTab === 'info' && (
                <div className="space-y-5">
                  {renderScoreTable(
                    "Qualité de l'information fournie aux parents",
                    safeData.parents.qualiteInformation,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        parents: { ...safeData.parents, qualiteInformation: next },
                      })
                  )}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Demande récurrente (Information)
                    </label>
                    <Input
                      value={safeData.parents.qualiteInformationConstat}
                      onChange={(e) =>
                        emitUpdate({
                          ...safeData,
                          parents: { ...safeData.parents, qualiteInformationConstat: e.target.value },
                        })
                      }
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  {renderScoreTable(
                    'Installations & équipements (Parents)',
                    safeData.parents.installations,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        parents: { ...safeData.parents, installations: next },
                      })
                  )}
                </div>
              )}

              {subTab === 'offre' && (
                <div className="space-y-5">
                  {renderScoreTable(
                    'Offre scolaire et enseignements (Parents)',
                    safeData.parents.offreScolaire,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        parents: { ...safeData.parents, offreScolaire: next },
                      })
                  )}
                  {renderScoreTable(
                    'Accompagnement des élèves (Parents)',
                    safeData.parents.accompagnement,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        parents: { ...safeData.parents, accompagnement: next },
                      })
                  )}
                </div>
              )}

              {subTab === 'priorites' && (
                <div className="space-y-5">
                  {renderScoreTable(
                    'Points forts perçus (Parents)',
                    safeData.parents.pointsForts,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        parents: { ...safeData.parents, pointsForts: next },
                      })
                  )}
                  {renderScoreTable(
                    'Priorités pour les prochaines années (Parents)',
                    safeData.parents.priorites,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        parents: { ...safeData.parents, priorites: next },
                      })
                  )}
                  {renderScoreTable(
                    'Priorités secondaires (Parents)',
                    safeData.parents.prioritesSecondaires,
                    (next) =>
                      emitUpdate({
                        ...safeData,
                        parents: { ...safeData.parents, prioritesSecondaires: next },
                      })
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPsdSurveyEditor;
