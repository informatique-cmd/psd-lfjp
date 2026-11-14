import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Star } from 'lucide-react';
import { usePsdSurveyData, formatScoreFr, getToneClasses } from '../PsdSurveyDataContext';

const MotifChoix = () => {
  const { parents } = usePsdSurveyData();
  const items = Array.isArray(parents?.motifChoix) ? parents.motifChoix.filter(Boolean) : [];

  return (
    <DiagnosticCard title="Pourquoi les familles choisissent-elles le LFJP ?" className="border-blue-200">
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucune donnée à afficher.</p>
        ) : (
          items.map((item, idx) => {
            const cls = getToneClasses(item?.tone, item?.score);
            const showHighlight = Boolean(item?.note);
            return (
              <div
                key={`${String(item?.name ?? 'motif')}-${idx}`}
                className={`flex items-center justify-between p-3 ${cls.bg} rounded-lg ${
                  showHighlight ? `border-l-4 ${cls.border}` : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {idx === 0 && <Star className="h-5 w-5 text-blue-600" />}
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
    </DiagnosticCard>
  );
};

export default MotifChoix;
