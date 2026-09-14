
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Badge } from "@/components/ui/badge";

const Priorites = () => {
  return (
    <DiagnosticCard title="Priorités pour les prochaines années" className="border-blue-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Priorités hautes (notes supérieures à 3/5) selon les élèves :</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-blue-600">1</Badge>
              <span className="font-medium">Développer les voyages scolaires</span>
            </div>
            <span className="text-blue-600 font-semibold">4,02/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-blue-600">2</Badge>
              <span className="font-medium">Climatisation des salles</span>
            </div>
            <span className="text-blue-600 font-semibold">3,92/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-blue-600">3</Badge>
              <span className="font-medium">Restauration scolaire</span>
            </div>
            <span className="text-blue-600 font-semibold">3,81/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-blue-600">4</Badge>
              <span className="font-medium">Équipements sportifs</span>
            </div>
            <span className="text-blue-600 font-semibold">3,47/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-blue-600">5</Badge>
              <span className="font-medium">Développement du plurilinguisme</span>
            </div>
            <span className="text-blue-600 font-semibold">3,40/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-blue-600">6</Badge>
              <span className="font-medium">Numérique éducatif</span>
            </div>
            <span className="text-blue-600 font-semibold">3,29/5</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Transport scolaire et garderie matinale restent secondaires (≤ 2,9/5)
          </p>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default Priorites;
