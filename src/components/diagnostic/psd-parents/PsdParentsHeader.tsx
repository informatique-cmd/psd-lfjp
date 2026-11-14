import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Progress } from '@/components/ui/progress';
import { usePsdSurveyData } from '../PsdSurveyDataContext';

const PsdParentsHeader = () => {
  const { parents } = usePsdSurveyData();
  const totalResponses = Number.isFinite(Number(parents?.totalResponses)) ? Number(parents.totalResponses) : 0;
  const singleChildRate = Number.isFinite(Number(parents?.singleChildRate))
    ? Math.min(100, Math.max(0, Number(parents.singleChildRate)))
    : 0;
  const recommendationRate = Number.isFinite(Number(parents?.recommendationRate))
    ? Math.min(100, Math.max(0, Number(parents.recommendationRate)))
    : 0;

  return (
    <DiagnosticCard
      title="Enquête Parents LFJP"
      description="Sondage sur la satisfaction et les priorités - Analyse des résultats"
      className="bg-green-50 border-green-200"
    >
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-2">Échantillon et barème</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>{totalResponses} réponses</strong> au total</li>
              <li>• <strong>{singleChildRate}%</strong> des répondants n&apos;ont qu&apos;un seul enfant inscrit</li>
              <li>• Échelle : 1 = très insatisfaisant/pas prioritaire → 5 = très satisfaisant/priorité absolue</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 mb-2">Indicateur général de recommandation</h4>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {recommendationRate}%
                </div>
                <p className="text-sm text-gray-600">recommandent le LFJP</p>
                {parents?.recommendationNote && (
                  <p className="text-xs text-green-600 mt-1">{parents.recommendationNote}</p>
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

export default PsdParentsHeader;
