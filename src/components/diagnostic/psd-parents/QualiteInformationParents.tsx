import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { usePsdSurveyData, formatScoreFr, getToneClasses } from '../PsdSurveyDataContext';

const QualiteInformationParents = () => {
  const { parents } = usePsdSurveyData();
  const items = Array.isArray(parents?.qualiteInformation) ? parents.qualiteInformation.filter(Boolean) : [];

  return (
    <DiagnosticCard title="Qualité de l'information fournie aux parents" className="border-purple-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Satisfaction globalement élevée :</p>

        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Aucune donnée à afficher.</p>
          ) : (
            items.map((item, idx) => {
              const cls = getToneClasses(item?.tone, item?.score);
              const showHighlight = Boolean(item?.note);
              const isPositive = item?.tone === 'green' || item?.tone === 'emerald';
              return (
                <div
                  key={`${String(item?.name ?? 'infop')}-${idx}`}
                  className={`flex items-center justify-between p-3 ${cls.bg} rounded-lg ${
                    showHighlight ? `border-l-4 ${cls.border}` : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {showHighlight && (
                      isPositive
                        ? <CheckCircle className="h-5 w-5 text-green-600" />
                        : <AlertTriangle className="h-5 w-5 text-orange-600" />
                    )}
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

        {parents?.qualiteInformationConstat && (
          <div className="mt-4 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Demande récurrente :</strong> {parents.qualiteInformationConstat}
            </p>
          </div>
        )}
      </div>
    </DiagnosticCard>
  );
};

export default QualiteInformationParents;
