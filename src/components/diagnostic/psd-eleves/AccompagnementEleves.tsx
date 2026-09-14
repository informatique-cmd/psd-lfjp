
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { CheckCircle } from 'lucide-react';

const AccompagnementEleves = () => {
  return (
    <DiagnosticCard title="Accompagnement des élèves" className="border-green-200">
      <div className="space-y-6">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Satisfaction globalement positive :</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Professeur principal</span>
            </div>
            <div className="text-right">
              <span className="text-green-600 font-semibold">3,83/5</span>
              <p className="text-xs text-green-500">Relation très favorable</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Surveillants</span>
            <span className="text-green-600 font-semibold">3,28/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Vie scolaire</span>
            <span className="text-green-600 font-semibold">3,22/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Professeurs du secondaire</span>
            <span className="text-green-600 font-semibold">3,08/5</span>
          </div>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default AccompagnementEleves;
