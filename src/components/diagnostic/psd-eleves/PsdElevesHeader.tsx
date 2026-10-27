
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Progress } from "@/components/ui/progress";

const PsdElevesHeader = () => {
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
              <li>• <strong>98 réponses</strong> au total</li>
              <li>• Classes les mieux représentées :</li>
              <li className="ml-4">- 1ʳᵉ : 24%</li>
              <li className="ml-4">- 2ⁿᵈᵉ : 21%</li>
              <li className="ml-4">- 6ᵉ : 19%</li>
              <li>• Échelle : 1 = très insatisfaisant → 5 = très satisfaisant</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-french-blue mb-2">Indicateur général de recommandation</h4>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">59%</div>
                <p className="text-sm text-gray-600">recommandent le LFJP</p>
                <p className="text-xs text-amber-600 mt-1">Taux modéré - Marge d'amélioration</p>
              </div>
              <Progress value={59} className="h-3" />
            </div>
          </div>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default PsdElevesHeader;
