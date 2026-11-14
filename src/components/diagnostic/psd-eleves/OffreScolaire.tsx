import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { usePsdSurveyData, formatScoreFr, getToneClasses } from '../PsdSurveyDataContext';

const OffreScolaire = () => {
  const { eleves } = usePsdSurveyData();
  const items = Array.isArray(eleves?.offreScolaire) ? eleves.offreScolaire.filter(Boolean) : [];
  const midpoint = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, midpoint);
  const rightItems = items.slice(midpoint);

  return (
    <DiagnosticCard title="Offre scolaire et enseignements" className="border-amber-200">
      <div className="space-y-6">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Satisfaction mitigée :</p>

        {items.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucune donnée à afficher.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {[leftItems, rightItems].map((group, colIdx) => (
              <div key={`col-${colIdx}`} className="space-y-3">
                {group.map((item, idx) => {
                  const cls = getToneClasses(item?.tone, item?.score);
                  return (
                    <div
                      key={`${String(item?.name ?? 'offre')}-${idx}`}
                      className={`flex justify-between items-center p-3 ${cls.bg} rounded-lg`}
                    >
                      <span className="font-medium">{String(item?.name ?? '')}</span>
                      <span className={`${cls.text} font-semibold`}>{formatScoreFr(item?.score ?? 0)}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </DiagnosticCard>
  );
};

export default OffreScolaire;
