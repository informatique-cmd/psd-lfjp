import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Star } from 'lucide-react';
import { usePsdSurveyData, formatScoreFr, getToneClasses } from '../PsdSurveyDataContext';

const PointsFortsParents = () => {
  const { parents } = usePsdSurveyData();
  const items = Array.isArray(parents?.pointsForts) ? parents.pointsForts.filter(Boolean) : [];

  return (
    <DiagnosticCard title="Points forts perçus par les parents" className="border-emerald-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Hiérarchie des atouts :</p>

        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Aucune donnée à afficher.</p>
          ) : (
            items.map((item, idx) => {
              const cls = getToneClasses(item?.tone, item?.score);
              return (
                <div
                  key={`${String(item?.name ?? 'pfp')}-${idx}`}
                  className={`flex items-center justify-between p-3 ${cls.bg} rounded-lg ${
                    idx === 0 ? `border-l-4 ${cls.border}` : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {idx === 0 && <Star className="h-5 w-5 text-emerald-600" />}
                    <span className="font-medium">{String(item?.name ?? '')}</span>
                  </div>
                  <span className={`${cls.text} font-semibold`}>{formatScoreFr(item?.score ?? 0)}</span>
                </div>
              );
            })
          )}
        </div>

        {parents?.pointsFortsConstat && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-emerald-800">
              <strong>Reconnaissance particulière :</strong> {parents.pointsFortsConstat}
            </p>
          </div>
        )}
      </div>
    </DiagnosticCard>
  );
};

export default PointsFortsParents;
