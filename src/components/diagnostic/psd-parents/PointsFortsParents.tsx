
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Star } from 'lucide-react';

const PointsFortsParents = () => {
  return (
    <DiagnosticCard title="Points forts perçus par les parents" className="border-emerald-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Hiérarchie des atouts :</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">Culture française</span>
            </div>
            <span className="text-emerald-600 font-semibold">3,79/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
            <span className="font-medium">Ouverture culturelle</span>
            <span className="text-emerald-600 font-semibold">3,73/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Inclusion</span>
            <span className="text-blue-600 font-semibold">3,41/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">International</span>
            <span className="text-blue-600 font-semibold">3,36/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Sciences</span>
            <span className="text-blue-600 font-semibold">3,22/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium">Numérique</span>
            <span className="text-orange-600 font-semibold">3,18/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium">Sport</span>
            <span className="text-orange-600 font-semibold">3,15/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium">Plurilinguisme</span>
            <span className="text-orange-600 font-semibold">3,01/5</span>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
          <p className="text-sm text-emerald-800">
            <strong>Reconnaissance particulière :</strong> richesse des événements culturels 
            et taux de réussite aux examens.
          </p>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default PointsFortsParents;
