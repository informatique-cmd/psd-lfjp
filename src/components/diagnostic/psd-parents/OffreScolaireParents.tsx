import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { usePsdSurveyData, formatScoreFr, getToneClasses } from '../PsdSurveyDataContext';

const OffreScolaireParents = () => {
  const { parents } = usePsdSurveyData();
  const items = Array.isArray(parents?.offreScolaire) ? parents.offreScolaire.filter(Boolean) : [];

  return (
    <DiagnosticCard title="Offre scolaire et enseignements" className="border-indigo-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Satisfaction générale avec des axes d&apos;amélioration :</p>

        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Aucune donnée à afficher.</p>
          ) : (
            items.map((item, idx) => {
              const cls = getToneClasses(item?.tone, item?.score);
              return (
                <div
                  key={`${String(item?.name ?? 'offrep')}-${idx}`}
                  className={`flex items-center justify-between p-3 ${cls.bg} rounded-lg`}
                >
                  <span className="font-medium">{String(item?.name ?? '')}</span>
                  <span className={`${cls.text} font-semibold`}>{formatScoreFr(item?.score ?? 0)}</span>
                </div>
              );
            })
          )}
        </div>

        {parents?.offreScolaireConstat && (
          <div className="mt-4 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Attentes principales :</strong> {parents.offreScolaireConstat}
            </p>
          </div>
        )}
      </div>
    </DiagnosticCard>
  );
};

export default OffreScolaireParents;
