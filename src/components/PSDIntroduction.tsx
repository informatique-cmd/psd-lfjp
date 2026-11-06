import React from 'react';
import { ArrowDownCircle } from 'lucide-react';

const PSDIntroduction = () => {
  return (
    <div className="mb-12 space-y-6">
      <div className="space-y-4 font-raleway text-gray-700">
        <p>
          Ce plan stratégique s'inscrit dans la vision de l'établissement : former des citoyens du monde avec un profond
          ancrage local, dans un cadre de vie épanouissant et équitable.
        </p>
        <p>
          Il s'appuie sur les résultats des enquêtes de climat scolaire menées au LFJP en 2024-2025 et répond aux grandes
          orientations de l'Éducation nationale française et de l'AEFE, tout en s'inscrivant pleinement dans les quatre
          parcours éducatifs obligatoires.
        </p>
      </div>

      <div className="rounded-xl bg-french-blue text-white shadow-lg p-4 md:p-6 border border-white/10 w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 md:max-w-3xl">
            <span className="text-xs uppercase tracking-[0.2em] text-white/80">Découvrir les axes</span>
            <h3 className="text-xl md:text-2xl font-playfair font-semibold leading-snug">
              Cliquez sur un axe pour explorer les actions
            </h3>
            <p className="text-white/80 text-sm md:text-base">
              Utilisez les quatre onglets ci-dessous (Bien-être, Ouverture, Innovation, Réussite) pour consulter les objectifs
              et actions rattachés à chaque axe du plan stratégique.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm md:text-base font-semibold">
            <ArrowDownCircle className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
            <span>Choisissez un axe ci-dessous pour afficher le détail des actions.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSDIntroduction;
