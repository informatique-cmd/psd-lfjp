
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Target, Users, MessageSquare, Lightbulb } from 'lucide-react';

const SyntheseActionsParents = () => {
  return (
    <DiagnosticCard title="Synthèse et plan d'action proposé" className="border-indigo-200">
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
            <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Trois urgences partagées par les familles
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <span><strong>Confort thermique :</strong> climatisation couplée à isolation et solutions solaires</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <span><strong>Restauration scolaire :</strong> offre saine, abordable, et infrastructure adaptée</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <span><strong>Mobilité & sécurité :</strong> réaménagement du parking et des abords</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Maintenir le haut niveau sur Pronote, anticiper les annonces</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Poursuivre la transparence budgétaire de l'APE</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Privilégier des supports diversifiés (papier + numérique)</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Renforcer les atouts
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Valoriser l'ouverture culturelle et les projets internationaux</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Amplifier le plurilinguisme (anglais intensif dès la maternelle)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Continuer la dynamique numérique</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
            <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Plan d'action proposé (à présenter au conseil d'établissement)
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-purple-700 mb-2">Axe 1 – Bien-être & infrastructures</h5>
                <p className="text-purple-600">Climatisation, sanitaires, espaces verts, sécurité externe</p>
              </div>
              <div>
                <h5 className="font-medium text-purple-700 mb-2">Axe 2 – Expérience élève & famille</h5>
                <p className="text-purple-600">Restauration, plurilinguisme, périscolaire, projets & voyages</p>
              </div>
              <div>
                <h5 className="font-medium text-purple-700 mb-2">Axe 3 – Communication & gouvernance</h5>
                <p className="text-purple-600">Calendrier d'information, tableau de bord financier, consultations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default SyntheseActionsParents;
