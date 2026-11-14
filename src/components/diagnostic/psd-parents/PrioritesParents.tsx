import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { ArrowUp } from 'lucide-react';
import { usePsdSurveyData, formatScoreFr, getToneClasses } from '../PsdSurveyDataContext';

const PrioritesParents = () => {
  const { parents } = usePsdSurveyData();
  const items = Array.isArray(parents?.priorites) ? parents.priorites.filter(Boolean) : [];
  const secondaryItems = Array.isArray(parents?.prioritesSecondaires)
    ? parents.prioritesSecondaires.filter(Boolean)
    : [];

  return (
    <DiagnosticCard title="Priorités pour les prochaines années" className="border-purple-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Priorités hautes (notes ≥ 4) :</p>

        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Aucune priorité à afficher.</p>
          ) : (
            items.map((item, idx) => {
              const cls = getToneClasses(item?.tone, item?.score);
              const isHigh = Number(item?.score) >= 4 || item?.tone === 'purple';
              return (
                <div
                  key={`${String(item?.name ?? 'priop')}-${idx}`}
                  className={`flex items-center justify-between p-3 ${cls.bg} rounded-lg ${
                    isHigh ? `border-l-4 ${cls.border}` : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isHigh && <ArrowUp className="h-5 w-5 text-purple-600" />}
                    <span className="font-medium">{String(item?.name ?? '')}</span>
                  </div>
                  <div className="text-right">
                    <span className={`${cls.text} font-semibold`}>{formatScoreFr(item?.score ?? 0)}</span>
                    {item?.note && <p className={`text-xs ${cls.subText}`}>{item.note}</p>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {secondaryItems.length > 0 && (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold text-gray-700 mb-2">Priorités secondaires :</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {secondaryItems.map((item, idx) => (
                  <li key={`sec-${idx}`}>
                    • {String(item?.name ?? '')} : {formatScoreFr(item?.score ?? 0)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </DiagnosticCard>
  );
};

export default PrioritesParents;
