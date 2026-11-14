import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Progress } from '@/components/ui/progress';
import { usePsdSurveyData } from '../PsdSurveyDataContext';

const PsdElevesHeader = () => {
  const { eleves } = usePsdSurveyData();
  const topClasses = Array.isArray(eleves?.topClasses) ? eleves.topClasses.filter(Boolean) : [];
  const totalResponses = Number.isFinite(Number(eleves?.totalResponses)) ? Number(eleves.totalResponses) : 0;
  const recommendationRate = Number.isFinite(Number(eleves?.recommendationRate))
    ? Math.min(100, Math.max(0, Number(eleves.recommendationRate)))
    : 0;

  return (
    <DiagnosticCard
      title="La voix des élèves du LFJP"
      description="Sondage sur la satisfaction et les priorités - Analyse des résultats"
      className="bg-french-blue/5 border-french-blue/20"
    >
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-french-blue mb-2">Échantillon et barème</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>{totalResponses} réponses</strong> au total</li>
              <li>• Classes les mieux représentées :</li>
              {topClasses.map((cls, idx) => (
                <li key={`${String(cls?.name ?? 'classe')}-${idx}`} className="ml-4">
                  - {String(cls?.name ?? '')} : {Number.isFinite(Number(cls?.percentage)) ? Number(cls.percentage) : 0}%
                </li>
              ))}
              <li>• Échelle : 1 = très insatisfaisant → 5 = très satisfaisant</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-french-blue mb-2">Indicateur général de recommandation</h4>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">
                  {recommendationRate}%
                </div>
                <p className="text-sm text-gray-600">recommandent le LFJP</p>
                {eleves?.recommendationNote && (
                  <p className="text-xs text-amber-600 mt-1">{eleves.recommendationNote}</p>
                )}
              </div>
              <Progress value={recommendationRate} className="h-3" />
            </div>
          </div>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default PsdElevesHeader;
