import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { usePsdSurveyData, formatScoreFr, getToneClasses } from '../PsdSurveyDataContext';

const InstallationsEquipements = () => {
  const { eleves } = usePsdSurveyData();
  const items = Array.isArray(eleves?.installations) ? eleves.installations.filter(Boolean) : [];
  const keywords = Array.isArray(eleves?.installationsKeywords) ? eleves.installationsKeywords.filter(Boolean) : [];

  return (
    <DiagnosticCard title="Installations & équipements" className="border-red-200">
      <div className="space-y-6">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Équipements jugés insuffisants :</p>

        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Aucune donnée à afficher.</p>
          ) : (
            items.map((item, idx) => {
              const cls = getToneClasses(item?.tone, item?.score);
              const showHighlight = Boolean(item?.note);
              const isPositive = item?.tone === 'green' || item?.tone === 'emerald';
              return (
                <div
                  key={`${String(item?.name ?? 'inst')}-${idx}`}
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

        {keywords.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h5 className="font-medium text-red-800 mb-2">Mots-clés les plus cités :</h5>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, idx) => (
                <Badge key={`kw-${idx}`} variant="destructive">
                  {String(kw)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </DiagnosticCard>
  );
};

export default InstallationsEquipements;
