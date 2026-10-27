
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Progress } from "@/components/ui/progress";

const PsdParentsHeader = () => {
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
              <li>• <strong>107 réponses</strong> au total</li>
              <li>• <strong>51%</strong> des répondants n'ont qu'un seul enfant inscrit</li>
              <li>• Échelle : 1 = très insatisfaisant/pas prioritaire → 5 = très satisfaisant/priorité absolue</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 mb-2">Indicateur général de recommandation</h4>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">93%</div>
                <p className="text-sm text-gray-600">recommandent le LFJP</p>
                <p className="text-xs text-green-600 mt-1">Capital de confiance solide à préserver</p>
              </div>
              <Progress value={93} className="h-3" />
            </div>
          </div>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default PsdParentsHeader;
