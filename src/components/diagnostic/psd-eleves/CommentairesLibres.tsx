
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';

const CommentairesLibres = () => {
  return (
    <DiagnosticCard title="Analyse des commentaires libres" className="border-amber-200">
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">Thèmes récurrents dans les verbatims :</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h5 className="font-medium text-red-800 mb-2">Chaleur / climatisation (≈ 30 mentions)</h5>
              <div className="text-sm text-red-700 space-y-1">
                <p>• "Il fait trop chaud l'après-midi"</p>
                <p>• "Mettre des climatiseurs"</p>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <h5 className="font-medium text-amber-800 mb-2">Manque de sorties / voyages</h5>
              <div className="text-sm text-amber-700">
                <p>• "Plus de voyages, surtout en 3ᵉ"</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <h5 className="font-medium text-amber-800 mb-2">Emploi du temps très chargé</h5>
              <div className="text-sm text-amber-700">
                <p>• Journées jusqu'à 18h</p>
                <p>• Longues permanences</p>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h5 className="font-medium text-red-800 mb-2">Sanitaires & hygiène</h5>
              <div className="text-sm text-red-700">
                <p>• Absence de miroirs, savon manquant</p>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <h5 className="font-medium text-amber-800 mb-2">Équipements sportifs</h5>
              <div className="text-sm text-amber-700">
                <p>• Terrain, vestiaires, propreté des chasubles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default CommentairesLibres;
