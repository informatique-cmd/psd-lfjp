
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { CheckCircle } from 'lucide-react';

const AccompagnementElevesParents = () => {
  return (
    <DiagnosticCard title="Accompagnement des élèves" className="border-green-200">
      <div className="space-y-6">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Satisfaction élevée globalement :</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">ASEM (maternelle)</span>
            </div>
            <div className="text-right">
              <span className="text-green-600 font-semibold">4,24/5</span>
              <p className="text-xs text-green-500">Point fort reconnu</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Professeur des écoles</span>
            <span className="text-green-600 font-semibold">3,81/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Professeur principal (secondaire)</span>
            <span className="text-green-600 font-semibold">3,72/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Vie scolaire</span>
            <span className="text-green-600 font-semibold">3,71/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Professeurs du secondaire</span>
            <span className="text-blue-600 font-semibold">3,54/5</span>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demandes :</strong> davantage de soutien en langues et meilleure répartition des évaluations.
          </p>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default AccompagnementElevesParents;
