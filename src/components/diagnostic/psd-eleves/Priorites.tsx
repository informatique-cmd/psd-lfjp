import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Badge } from '@/components/ui/badge';
import { usePsdSurveyData, formatScoreFr } from '../PsdSurveyDataContext';

const Priorites = () => {
  const { eleves } = usePsdSurveyData();
  const items = Array.isArray(eleves?.priorites) ? eleves.priorites.filter(Boolean) : [];

  return (
    <DiagnosticCard title="Priorités pour les prochaines années" className="border-blue-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Priorités hautes (notes supérieures à 3/5) selon les élèves :</p>

        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Aucune priorité à afficher.</p>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${String(item?.name ?? 'prio')}-${idx}`}
                className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg ${
                  idx === 0 ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-blue-600">
                    {idx + 1}
                  </Badge>
                  <span className="font-medium">{String(item?.name ?? '')}</span>
                </div>
                <span className="text-blue-600 font-semibold">{formatScoreFr(item?.score ?? 0)}</span>
              </div>
            ))
          )}
        </div>

        {eleves?.prioritesSecondaryNote && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{eleves.prioritesSecondaryNote}</p>
          </div>
        )}
      </div>
    </DiagnosticCard>
  );
};

export default Priorites;
