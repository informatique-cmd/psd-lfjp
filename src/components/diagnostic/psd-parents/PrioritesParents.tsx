
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { ArrowUp } from 'lucide-react';

const PrioritesParents = () => {
  return (
    <DiagnosticCard title="Priorités pour les prochaines années" className="border-purple-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Priorités hautes (notes ≥ 4) :</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-3">
              <ArrowUp className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Restauration scolaire</span>
            </div>
            <div className="text-right">
              <span className="text-purple-600 font-semibold">4,40/5</span>
              <p className="text-xs text-purple-500">Priorité absolue</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-3">
              <ArrowUp className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Climatisation des salles</span>
            </div>
            <span className="text-purple-600 font-semibold">4,33/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-3">
              <ArrowUp className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Développement du plurilinguisme</span>
            </div>
            <span className="text-purple-600 font-semibold">4,24/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Équipements sportifs</span>
            <span className="text-blue-600 font-semibold">3,93/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Numérique éducatif</span>
            <span className="text-blue-600 font-semibold">3,92/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Transport scolaire</span>
            <span className="text-blue-600 font-semibold">3,48/5</span>
          </div>
        </div>
        
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-700 mb-2">Priorités secondaires :</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Garderie matinale : 2,49/5</li>
              <li>• Augmentation des effectifs : 2,68/5</li>
            </ul>
          </div>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default PrioritesParents;
