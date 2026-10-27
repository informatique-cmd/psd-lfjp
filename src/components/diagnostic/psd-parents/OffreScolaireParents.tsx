
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';

const OffreScolaireParents = () => {
  return (
    <DiagnosticCard title="Offre scolaire et enseignements" className="border-indigo-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Satisfaction générale avec des axes d'amélioration :</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Citoyenneté & valeurs</span>
            <span className="text-green-600 font-semibold">3,85/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Enseignement du français</span>
            <span className="text-green-600 font-semibold">3,77/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Ouverture culturelle</span>
            <span className="text-green-600 font-semibold">3,73/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Maths & sciences</span>
            <span className="text-blue-600 font-semibold">3,56/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Offre sportive</span>
            <span className="text-blue-600 font-semibold">3,34/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium">Offre linguistique (global)</span>
            <span className="text-orange-600 font-semibold">3,22/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium">Anglais / espagnol</span>
            <span className="text-orange-600 font-semibold">3,13/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium">Options payantes</span>
            <span className="text-orange-600 font-semibold">3,04/5</span>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Attentes principales :</strong> renforcer l'anglais, besoin de "native speakers", 
            optimiser le rapport coût/choix des options.
          </p>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default OffreScolaireParents;
