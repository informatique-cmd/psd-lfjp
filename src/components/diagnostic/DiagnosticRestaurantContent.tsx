
import React from 'react';
import DiagnosticCard from './DiagnosticCard';
import MetricCard from './MetricCard';
import StudentDistributionChart from './restaurant/StudentDistributionChart';
import RestaurantPieChart from './restaurant/RestaurantPieChart';
import HorizontalBarChart from './restaurant/HorizontalBarChart';
import VerticalBarChart from './restaurant/VerticalBarChart';
import RestaurantConclusions from './restaurant/RestaurantConclusions';
import { restaurantPageData } from '@/data/restaurantPageData';
import pageDataFile from '@/content/pageData.json';
import { useContentDraft } from '@/lib/contentDraft';
import { CHART_COLORS } from './restaurant/restaurantData';

const restaurantDraftFallback = {
  ...pageDataFile,
  restaurant: (pageDataFile as { restaurant?: typeof restaurantPageData }).restaurant || restaurantPageData,
};

const DiagnosticRestaurantContent = () => {
  const pageData = useContentDraft('lfjp-admin-page-data-draft', restaurantDraftFallback);
  const restaurant = pageData.restaurant;
  return (
    <div className="max-w-5xl mx-auto">
      <DiagnosticCard
        title="Synthèse du sondage sur la restauration scolaire – 1er trimestre 2025"
        description="Analyse basée sur le sondage auprès des parents d'élèves – 87 réponses"
        className="mb-8"
      >
        {/* Metrics and Student Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard 
            title="Statistiques clés" 
            primary={restaurant.keyMetrics}
            secondary={restaurant.alertPoints}
          />
          <StudentDistributionChart data={restaurant.studentDistributionData} />
        </div>

        {/* Restaurant Interest and Current Lunch Situation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <RestaurantPieChart 
            title="Intérêt pour la restauration scolaire" 
            data={restaurant.restaurationInterestData}
            colors={CHART_COLORS}
          />
          <HorizontalBarChart 
            title="Situation actuelle des repas"
            data={restaurant.currentLunchData}
          />
        </div>

        {/* Interest by Day and Meal Type Preference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <VerticalBarChart 
            title="Intérêt par jour de la semaine"
            data={restaurant.serviceInterestByDayData}
          />
          <VerticalBarChart 
            title="Types de repas souhaités"
            data={restaurant.mealTypePreferenceData}
          />
        </div>

        {/* Price Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RestaurantPieChart 
            title="Budget pour un plat" 
            data={restaurant.priceForDishData}
            colors={CHART_COLORS}
          />
          <RestaurantPieChart 
            title="Budget pour un menu complet" 
            data={restaurant.priceForMenuData}
            colors={CHART_COLORS}
          />
        </div>

        {/* Conclusions */}
        <RestaurantConclusions />
      </DiagnosticCard>
    </div>
  );
};

export default DiagnosticRestaurantContent;
