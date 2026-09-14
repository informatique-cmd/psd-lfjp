import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
const SyntheseActions = () => {
  return <DiagnosticCard title="Synthèse et pistes d'action" className="bg-french-blue/5 border-french-blue/20">
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-french-blue mb-4">Trois urgences identifiées par les élèves :</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h5 className="font-medium text-red-800 mb-2">1. Confort & Sécurité</h5>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Confort thermique (clim/ventilation)</li>
                <li>• Rénovation des sanitaires</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
              <h5 className="font-medium text-amber-800 mb-2">2. Ouverture & Expérience</h5>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Relance des voyages scolaires</li>
                <li>• Sorties pédagogiques</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-medium text-blue-800 mb-2">3. Restauration</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Offre équilibrée</li>
                <li>• Tarifs abordables</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-french-blue mb-3">Communication à améliorer :</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Clarifier régulièrement les décisions budgétaires de l'AP</li>
              <li>• Informer en amont sur les activités et options</li>
              <li>• Communiquer l'avancement des projets</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-french-blue mb-3">Points forts à valoriser :</h4>
          <div className="bg-green-50 p-4 rounded-lg">
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Le "capital sport" (bon encadrement, dynamisme)</li>
              <li>• Le CDI comme vitrine</li>
              <li>• Réussites en mathématiques-sciences</li>
              <li>• Qualité de l'accompagnement personnalisé</li>
            </ul>
          </div>
        </div>

        
      </div>
    </DiagnosticCard>;
};
export default SyntheseActions;