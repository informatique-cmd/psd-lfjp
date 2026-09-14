
import React from 'react';
import DiagnosticCard from './DiagnosticCard';
import MetricCard from './MetricCard';
import StudentDistributionChart from './restaurant/StudentDistributionChart';
import RestaurantPieChart from './restaurant/RestaurantPieChart';
import HorizontalBarChart from './restaurant/HorizontalBarChart';
import VerticalBarChart from './restaurant/VerticalBarChart';
import RestaurantConclusions from './restaurant/RestaurantConclusions';
import { 
  studentDistributionData,
  restaurationInterestData,
  currentLunchData,
  serviceInterestByDayData,
  mealTypePreferenceData,
  priceForDishData,
  priceForMenuData,
  CHART_COLORS,
  keyMetrics,
  alertPoints
} from './restaurant/restaurantData';

const DiagnosticRestaurantContent = () => {
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
            primary={keyMetrics}
            secondary={alertPoints}
          />
          <StudentDistributionChart data={studentDistributionData} />
        </div>

        {/* Restaurant Interest and Current Lunch Situation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <RestaurantPieChart 
            title="Intérêt pour la restauration scolaire" 
            data={restaurationInterestData}
            colors={CHART_COLORS}
          />
          <HorizontalBarChart 
            title="Situation actuelle des repas"
            data={currentLunchData}
          />
        </div>

        {/* Interest by Day and Meal Type Preference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <VerticalBarChart 
            title="Intérêt par jour de la semaine"
            data={serviceInterestByDayData}
          />
          <VerticalBarChart 
            title="Types de repas souhaités"
            data={mealTypePreferenceData}
          />
        </div>

        {/* Price Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RestaurantPieChart 
            title="Budget pour un plat" 
            data={priceForDishData}
            colors={CHART_COLORS}
          />
          <RestaurantPieChart 
            title="Budget pour un menu complet" 
            data={priceForMenuData}
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
