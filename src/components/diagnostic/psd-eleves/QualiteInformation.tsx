
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const QualiteInformation = () => {
  return (
    <DiagnosticCard title="Qualité de l'information fournie aux élèves" className="border-red-200">
      <div className="space-y-6">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Communication perçue comme insuffisante :</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium">Sorties & voyages</span>
            </div>
            <div className="text-right">
              <span className="text-red-600 font-semibold">2,05/5</span>
              <p className="text-xs text-red-500">Maillon le plus faible</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <span className="font-medium">Décisions budgétaires de l'AP</span>
            <span className="text-red-600 font-semibold">2,16/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
            <span className="font-medium">Projets & activités pédagogiques</span>
            <span className="text-amber-600 font-semibold">2,41/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
            <span className="font-medium">Paiement des écolages</span>
            <span className="text-amber-600 font-semibold">2,45/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Pronote</span>
            </div>
            <div className="text-right">
              <span className="text-green-600 font-semibold">3,18/5</span>
              <p className="text-xs text-green-500">Seul canal satisfaisant</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <h5 className="font-medium text-amber-800 mb-2">Constat :</h5>
          <p className="text-sm text-amber-700">
            Besoin de communication proactive et régulière sur les projets, voyages et gestion financière.
          </p>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default QualiteInformation;
