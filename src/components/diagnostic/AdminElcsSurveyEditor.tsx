import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ChartNoAxesCombined,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from 'lucide-react';
import { sanitizeElcsData, type ElcsDataType, type ElcsMetric } from './ElcsDataContext';

export interface AdminElcsSurveyEditorProps {
  elcsData: ElcsDataType;
  onChange: (updated: ElcsDataType) => void;
}

export const AdminElcsSurveyEditor: React.FC<AdminElcsSurveyEditorProps> = ({
  elcsData,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof ElcsDataType>('satisfaction');

  // Defensive sanitization: guarantees all categories and arrays exist
  const safeData = sanitizeElcsData(elcsData);

  const categoriesConfig: { key: keyof ElcsDataType; label: string }[] = [
    { key: 'satisfaction', label: '1. Satisfaction Infrastructures' },
    { key: 'relations', label: '2. Relations Humaines' },
    { key: 'travail', label: '3. Charge de Travail' },
    { key: 'securite', label: '4. Sécurité & Climat' },
  ];

  const updateTitle = (catKey: keyof ElcsDataType, title: string) => {
    onChange({
      ...safeData,
      [catKey]: {
        ...safeData[catKey],
        title,
      },
    });
  };

  const updateMetric = (
    catKey: keyof ElcsDataType,
    group: 'primary' | 'secondary',
    index: number,
    field: keyof ElcsMetric,
    val: string | number
  ) => {
    const list = [...(safeData[catKey]?.[group] || [])];
    if (!list[index]) return;
    list[index] = {
      ...list[index],
      [field]: field === 'value' || field === 'average'
        ? (isNaN(Number(val)) ? val : Number(val))
        : val,
    };
    onChange({
      ...safeData,
      [catKey]: {
        ...safeData[catKey],
        [group]: list,
      },
    });
  };

  const addMetric = (catKey: keyof ElcsDataType, group: 'primary' | 'secondary') => {
    const list = [...(safeData[catKey]?.[group] || [])];
    list.push({
      name: 'Nouvel indicateur',
      value: 75,
      label: 'Satisfaction mesurée',
      average: 70,
      trend: 'up',
    });
    onChange({
      ...safeData,
      [catKey]: {
        ...safeData[catKey],
        [group]: list,
      },
    });
  };

  const deleteMetric = (catKey: keyof ElcsDataType, group: 'primary' | 'secondary', index: number) => {
    const list = (safeData[catKey]?.[group] || []).filter((_, i) => i !== index);
    onChange({
      ...safeData,
      [catKey]: {
        ...safeData[catKey],
        [group]: list,
      },
    });
  };

  const currentCat = safeData[activeCategory] || safeData.satisfaction;

  return (
    <div
      className="mb-8 rounded-2xl border border-blue-200 bg-white p-4 sm:p-5 shadow-sm text-slate-800"
      data-interactive="true"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-100 text-french-blue">
            <ChartNoAxesCombined className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-playfair">
                Espace Éditeur · Données d’Enquête Climat Scolaire (ELCS)
              </h3>
              <span className="text-[10px] bg-blue-100 text-french-blue font-semibold px-2 py-0.5 rounded-full">
                Privilège Éditeur
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifiez les taux de satisfaction, moyennes et tendances : les jauges visuelles s’ajustent automatiquement.
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="border-blue-300 text-french-blue hover:bg-blue-50 text-xs font-semibold cursor-pointer"
        >
          {isOpen ? (
            <>
              <ChevronUp className="mr-1.5 h-3.5 w-3.5" /> Masquer l’éditeur ELCS
            </>
          ) : (
            <>
              <ChevronDown className="mr-1.5 h-3.5 w-3.5" /> Ouvrir l’éditeur ELCS
            </>
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4 animate-in fade-in duration-200">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
            {categoriesConfig.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-french-blue text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Titre de la catégorie
              </label>
              <Input
                value={currentCat?.title || ''}
                onChange={(e) => updateTitle(activeCategory, e.target.value)}
                className="h-8 text-xs font-bold text-french-blue bg-white"
              />
            </div>

            {/* Primary Metrics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Indicateurs Principaux (avec jauge et comparaison moyenne)
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addMetric(activeCategory, 'primary')}
                  className="h-6.5 text-[11px] bg-french-blue hover:bg-blue-800 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter un indicateur
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Nom de l'indicateur</th>
                      <th className="p-2.5 w-24">Valeur (%)</th>
                      <th className="p-2.5 w-24">Moyenne (%)</th>
                      <th className="p-2.5 w-40">Précision / Label</th>
                      <th className="p-2.5 w-28">Tendance</th>
                      <th className="p-2.5 text-right w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(currentCat?.primary || []).map((metric, i) => (
                      <tr key={`prim-${i}`} className="hover:bg-slate-50/70">
                        <td className="p-2">
                          <Input
                            value={metric.name}
                            onChange={(e) => updateMetric(activeCategory, 'primary', i, 'name', e.target.value)}
                            className="h-7 text-xs bg-white font-medium"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={String(metric.value)}
                            onChange={(e) => updateMetric(activeCategory, 'primary', i, 'value', e.target.value)}
                            className="h-7 text-xs font-bold text-french-blue bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={metric.average ?? ''}
                            onChange={(e) => updateMetric(activeCategory, 'primary', i, 'average', e.target.value)}
                            className="h-7 text-xs text-slate-600 bg-white"
                            placeholder="75"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={metric.label || ''}
                            onChange={(e) => updateMetric(activeCategory, 'primary', i, 'label', e.target.value)}
                            className="h-7 text-[11px] text-slate-500 bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <select
                            value={metric.trend || 'up'}
                            onChange={(e) => updateMetric(activeCategory, 'primary', i, 'trend', e.target.value)}
                            className="h-7 text-xs rounded border border-slate-200 bg-white px-2 text-slate-700"
                          >
                            <option value="up">En hausse (▲)</option>
                            <option value="down">En baisse (▼)</option>
                          </select>
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMetric(activeCategory, 'primary', i)}
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

            {/* Secondary Metrics */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Points complémentaires & verbatim
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addMetric(activeCategory, 'secondary')}
                  className="h-6.5 text-[11px] bg-slate-700 hover:bg-slate-800 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter un point
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Sujet / Verbatim</th>
                      <th className="p-2.5 w-32">Valeur constatée</th>
                      <th className="p-2.5 w-44">Précision</th>
                      <th className="p-2.5 text-right w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(currentCat?.secondary || []).map((metric, i) => (
                      <tr key={`sec-${i}`} className="hover:bg-slate-50/70">
                        <td className="p-2">
                          <Input
                            value={metric.name}
                            onChange={(e) => updateMetric(activeCategory, 'secondary', i, 'name', e.target.value)}
                            className="h-7 text-xs bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={String(metric.value)}
                            onChange={(e) => updateMetric(activeCategory, 'secondary', i, 'value', e.target.value)}
                            className="h-7 text-xs font-bold text-slate-800 bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={metric.label || ''}
                            onChange={(e) => updateMetric(activeCategory, 'secondary', i, 'label', e.target.value)}
                            className="h-7 text-[11px] text-slate-500 bg-white"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMetric(activeCategory, 'secondary', i)}
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
        </div>
      )}
    </div>
  );
};

export default AdminElcsSurveyEditor;
