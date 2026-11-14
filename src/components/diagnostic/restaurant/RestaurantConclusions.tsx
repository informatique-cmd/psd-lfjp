
import React from 'react';
import type { ComputedRestaurantAnalytics } from './restaurantCorrelations';

interface RestaurantConclusionsProps {
  analytics?: ComputedRestaurantAnalytics;
}

const RestaurantConclusions: React.FC<RestaurantConclusionsProps> = ({ analytics }) => {
  const interestPct = analytics?.interestOuiPct ?? 92;
  const strongDays = analytics?.strongDaysLabel || 'lundis, mardis et jeudis';
  const platsChaudsPct = analytics?.platsChaudsPct ?? 81.3;
  const repasCompletsPct = analytics?.repasCompletsPct ?? 60;
  const dishBudget = analytics?.majorityDishName || '1500-2000 FCFA';
  const menuBudget = analytics?.menuTariffName || '2000-3000 FCFA';
  const vegetarienVal = analytics?.vegetarienValue || '33.3%';
  const weakestDay = analytics?.weakestDayName || 'Mercredi';
  const weakestDayPct = analytics?.weakestDayPct ?? 36.3;

  return (
    <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-french-blue/10">
      <h3 className="text-lg font-medium text-french-blue mb-2">Conclusions principales</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>Forte demande pour un service de restauration scolaire ({interestPct}% des parents intéressés)</li>
        <li>
          Préférence marquée pour les {strongDays} ({weakestDay} : {weakestDayPct}% d&apos;intérêt seulement)
        </li>
        <li>Demande nette pour des plats chauds ({platsChaudsPct}%) et des repas complets ({repasCompletsPct}%)</li>
        <li>Budget moyen accepté : {dishBudget} pour un plat, {menuBudget} pour un menu complet</li>
        <li>Besoin d&apos;options alimentaires spécifiques, notamment végétariennes ({vegetarienVal})</li>
      </ul>
    </div>
  );
};

export default RestaurantConclusions;
