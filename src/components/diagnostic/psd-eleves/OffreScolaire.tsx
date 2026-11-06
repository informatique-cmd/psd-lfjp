
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';

const OffreScolaire = () => {
  return (
    <DiagnosticCard title="Offre scolaire et enseignements" className="border-amber-200">
      <div className="space-y-6">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Satisfaction mitigée :</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium">Offre linguistique</span>
              <span className="text-red-600 font-semibold">2,60/5</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium">Options payantes / périscolaire</span>
              <span className="text-red-600 font-semibold">2,66/5</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium">Ouverture culturelle</span>
              <span className="text-red-600 font-semibold">2,57/5</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Offre sportive</span>
              <span className="text-green-600 font-semibold">3,05/5</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Enseignement du français</span>
              <span className="text-green-600 font-semibold">3,11/5</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Maths & sciences</span>
              <span className="text-green-600 font-semibold">3,34/5</span>
            </div>
          </div>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default OffreScolaire;
