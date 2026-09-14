
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { TrendingUp } from 'lucide-react';

const PointsForts = () => {
  return (
    <DiagnosticCard title="Points forts perçus" className="border-green-200">
      <div className="space-y-6">
        <p className="text-gray-700 mb-4">Classement de 1 (faible) à 5 (fort) :</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium">Sport</span>
            </div>
            <div className="text-right">
              <span className="text-green-600 font-semibold">3,31/5</span>
              <p className="text-xs text-green-500">Dynamisme et implication</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Sciences</span>
            <span className="text-green-600 font-semibold">2,97/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Inclusion & ouverture culturelle</span>
            <span className="text-green-600 font-semibold">~2,8/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
            <span className="font-medium">Numérique</span>
            <span className="text-amber-600 font-semibold">2,44/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
            <span className="font-medium">Plurilinguisme</span>
            <span className="text-amber-600 font-semibold">2,36/5</span>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-sm text-amber-700">
            Le plurilinguisme et le numérique ne sont pas encore identifiés comme de véritables atouts.
          </p>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default PointsForts;
