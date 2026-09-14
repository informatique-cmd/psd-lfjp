
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const InstallationsEquipementsParents = () => {
  return (
    <DiagnosticCard title="Installations & équipements" className="border-red-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Plusieurs points critiques identifiés :</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium">Zones circulation externes</span>
            </div>
            <div className="text-right">
              <span className="text-red-600 font-semibold">2,41/5</span>
              <p className="text-xs text-red-500">Parking et sécurité critiqués</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium">Équipements sportifs & vestiaires</span>
            <span className="text-orange-600 font-semibold">2,73/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium">Sécurité abords</span>
            <span className="text-orange-600 font-semibold">2,94/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium">Salles de classe</span>
            <span className="text-orange-600 font-semibold">2,96/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium">Sanitaires</span>
            <span className="text-orange-600 font-semibold">2,98/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Espaces verts & cour</span>
            <span className="text-blue-600 font-semibold">3,20/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">CDI/BCD</span>
            </div>
            <span className="text-green-600 font-semibold">3,50/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Circulations internes</span>
            <span className="text-green-600 font-semibold">3,59/5</span>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Verbatims récurrents :</strong> climatisation, parking, chaleur, sanitaires, circulation externe.
          </p>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default InstallationsEquipementsParents;
