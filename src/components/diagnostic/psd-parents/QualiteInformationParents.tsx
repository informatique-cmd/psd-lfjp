
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const QualiteInformationParents = () => {
  return (
    <DiagnosticCard title="Qualité de l'information fournie aux parents" className="border-purple-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Satisfaction globalement élevée :</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Pronote</span>
            </div>
            <div className="text-right">
              <span className="text-green-600 font-semibold">4,32/5</span>
              <p className="text-xs text-green-500">Outil plébiscité</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Inscriptions</span>
            <span className="text-green-600 font-semibold">4,13/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Actualité de l'APE-LFJP</span>
            <span className="text-green-600 font-semibold">4,02/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Paiement des écolages</span>
            <span className="text-blue-600 font-semibold">3,80/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Projets & activités</span>
            <span className="text-blue-600 font-semibold">3,79/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Sorties & voyages</span>
            </div>
            <div className="text-right">
              <span className="text-orange-600 font-semibold">3,58/5</span>
              <p className="text-xs text-orange-500">Préavis trop court</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium">Options & sections</span>
            <span className="text-orange-600 font-semibold">3,39/5</span>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Demande récurrente :</strong> Information papier ou multi-canal pour toucher 
            ceux qui lisent peu les mails.
          </p>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default QualiteInformationParents;
