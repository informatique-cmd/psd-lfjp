
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Star } from 'lucide-react';

const MotifChoix = () => {
  return (
    <DiagnosticCard title="Pourquoi les familles choisissent-elles le LFJP ?" className="border-blue-200">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Continuité du cursus en France</span>
          </div>
          <div className="text-right">
            <span className="text-blue-600 font-semibold">4,40/5</span>
            <p className="text-xs text-blue-500">Première raison invoquée</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="font-medium">Partenariat AEFE</span>
          <span className="text-blue-600 font-semibold">4,07/5</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="font-medium">Langue & culture françaises</span>
          <span className="text-blue-600 font-semibold">4,04/5</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="font-medium">Excellence & qualité de l'enseignement</span>
          <span className="text-blue-600 font-semibold">3,71/5</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="font-medium">Aide apportée à l'enfant</span>
          <span className="text-blue-600 font-semibold">3,52/5</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
          <span className="font-medium">Frais de scolarité</span>
          <div className="text-right">
            <span className="text-orange-600 font-semibold">2,67/5</span>
            <p className="text-xs text-orange-500">Coût jugé élevé</p>
          </div>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default MotifChoix;
