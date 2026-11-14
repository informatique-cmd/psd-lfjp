import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { usePsdSurveyData, formatScoreFr, getToneClasses } from '../PsdSurveyDataContext';

const InstallationsEquipementsParents = () => {
  const { parents } = usePsdSurveyData();
  const items = Array.isArray(parents?.installations) ? parents.installations.filter(Boolean) : [];

  return (
    <DiagnosticCard title="Installations & équipements" className="border-red-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Plusieurs points critiques identifiés :</p>

        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Aucune donnée à afficher.</p>
          ) : (
            items.map((item, idx) => {
              const cls = getToneClasses(item?.tone, item?.score);
              const isPositive = item?.tone === 'green' || item?.tone === 'emerald';
              const safeName = String(item?.name ?? '');
              const showHighlight = Boolean(item?.note) || safeName.toLowerCase().includes('cdi');
              return (
                <div
                  key={`${safeName || 'instp'}-${idx}`}
                  className={`flex items-center justify-between p-3 ${cls.bg} rounded-lg ${
                    showHighlight ? `border-l-4 ${cls.border}` : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {showHighlight && (
                      isPositive
                        ? <CheckCircle className="h-5 w-5 text-green-600" />
                        : <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-medium">{safeName}</span>
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

        {parents?.installationsConstat && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Verbatims récurrents :</strong> {parents.installationsConstat}
            </p>
          </div>
        )}
      </div>
    </DiagnosticCard>
  );
};

export default InstallationsEquipementsParents;
