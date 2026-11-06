
import React from 'react';

const RestaurantConclusions: React.FC = () => {
  return (
    <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-french-blue/10">
      <h3 className="text-lg font-medium text-french-blue mb-2">Conclusions principales</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>Forte demande pour un service de restauration scolaire (92% des parents intéressés)</li>
        <li>Préférence marquée pour les lundis, mardis et jeudis (plus de 80% d'intérêt)</li>
        <li>Demande nette pour des plats chauds (81.3%) et des repas complets (60%)</li>
        <li>Budget moyen accepté : 1500-2000 FCFA pour un plat, 2000-3000 FCFA pour un menu complet</li>
        <li>Besoin d'options alimentaires spécifiques, notamment végétariennes (33.3%)</li>
      </ul>
    </div>
  );
};

export default RestaurantConclusions;
