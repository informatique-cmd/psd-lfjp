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
import { CHART_COLORS } from './restaurant/restaurantData';
import AdminRestaurantSurveyEditor from './restaurant/AdminRestaurantSurveyEditor';

const restaurantDraftFallback = {
  ...pageDataFile,
  restaurant: (pageDataFile as { restaurant?: typeof restaurantPageData }).restaurant || restaurantPageData,
};

const getInitialRestaurant = (): typeof restaurantPageData => {
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem('lfjp-admin-page-data-draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.restaurant) {
          return {
            ...restaurantDraftFallback.restaurant,
            ...parsed.restaurant,
          };
        }
      }
    } catch {
      // fallback
    }
  }
  return restaurantDraftFallback.restaurant;
};

const DiagnosticRestaurantContent = () => {
  const [restaurant, setRestaurant] = React.useState<typeof restaurantPageData>(getInitialRestaurant);

  React.useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ restaurant?: typeof restaurantPageData; source?: string }>;
      if (customEvent.detail?.source === 'restaurant_survey_editor') return;
      if (customEvent.detail?.restaurant) {
        setRestaurant(customEvent.detail.restaurant);
      }
    };
    const handleStorage = () => {
      setRestaurant(getInitialRestaurant());
    };
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'lfjp-page-data-update' && e.data?.data?.restaurant) {
        setRestaurant(e.data.data.restaurant);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('message', handleMessage);
    window.addEventListener('lfjp_page_data_changed', handleSync);
    window.addEventListener('lfjp_draft_cleared', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('lfjp_page_data_changed', handleSync);
      window.removeEventListener('lfjp_draft_cleared', handleStorage);
    };
  }, []);

  const isEmbeddedInAdmin = typeof window !== 'undefined' && (
    window.location.search.includes('embedded=1') ||
    (window.self !== window.top)
  );
  const isEditRequested = typeof window !== 'undefined' && (
    window.location.search.includes('edit=1') ||
    window.location.search.includes('draft=1') ||
    window.location.search.includes('mode=editor') ||
    window.location.search.includes('admin=1')
  );
  const hasActiveSession = typeof window !== 'undefined' && (
    window.localStorage.getItem('lfjp_admin_active_session') === '1' ||
    window.sessionStorage.getItem('lfjp_admin_local_session') === '1'
  );
  const showEditorControls = isEmbeddedInAdmin || isEditRequested || hasActiveSession;

  const handleRestaurantChange = (updatedRestaurant: typeof restaurantPageData) => {
    setRestaurant(updatedRestaurant);
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('lfjp-admin-page-data-draft');
        let currentDraft: Record<string, unknown> = {};
        if (raw) {
          try {
            currentDraft = JSON.parse(raw) || {};
          } catch {
            currentDraft = {};
          }
        }
        const merged = {
          ...currentDraft,
          restaurant: updatedRestaurant,
        };
        window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(merged));
        window.dispatchEvent(
          new CustomEvent('lfjp_page_data_changed', {
            detail: { restaurant: updatedRestaurant, source: 'restaurant_survey_editor' },
          })
        );
        window.dispatchEvent(new Event('storage'));

        if (window.parent && window.parent !== window) {
          try {
            window.parent.postMessage(
              { type: 'lfjp_restaurant_data_updated', restaurant: updatedRestaurant, source: 'restaurant_survey_editor' },
              '*'
            );
            window.parent.dispatchEvent(
              new CustomEvent('lfjp_page_data_changed', {
                detail: { restaurant: updatedRestaurant, source: 'restaurant_survey_editor' },
              })
            );
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to save restaurant draft', err);
      }
    }
  };

  // 1. Calcul dynamique du nombre total de réponses (reflète l'ensemble des effectifs)
  const totalResponses = React.useMemo(() => {
    const studentList = restaurant.studentDistributionData || [];
    const totalEffectif = studentList.reduce((sum, item) => sum + (Math.max(0, Number(item.value)) || 0), 0);
    if (totalEffectif > 0) return totalEffectif;
    const lunchList = restaurant.currentLunchData || [];
    const totalLunch = lunchList.reduce((sum, item) => sum + (Math.max(0, Number(item.value)) || 0), 0);
    if (totalLunch > 0) return totalLunch;
    return 87;
  }, [restaurant.studentDistributionData, restaurant.currentLunchData]);

  // 2. Calcul dynamique des Statistiques Clés (Strictement synchronisées avec les graphiques)
  const computedKeyMetrics = React.useMemo(() => {
    // 2.1 Intérêt global pour la restauration scolaire = STRICTEMENT égal à la valeur "Oui" du PieChart
    const interestData = restaurant.restaurationInterestData || [];
    const ouiItem = interestData.find((d) => d.name.trim().toLowerCase() === 'oui') || interestData[0];
    const interestVal = ouiItem ? (Math.round((Number(ouiItem.value) || 0) * 10) / 10) : 92;

    // 2.2 Plats chauds = STRICTEMENT égal à la barre "Des plats chauds" du BarChart Types de repas
    const mealsData = restaurant.mealTypePreferenceData || [];
    const platsChaudsItem = mealsData.find((d) => d.name.toLowerCase().includes('chaud')) || mealsData[0];
    const platsChaudsPct = platsChaudsItem 
      ? (typeof platsChaudsItem.percentage === 'number' 
          ? platsChaudsItem.percentage 
          : (typeof platsChaudsItem.value === 'number' ? platsChaudsItem.value : 81.3))
      : 81.3;

    // 2.3 Budget moyen par plat = reflète dynamiquement la tranche majoritaire issue des données "Budget pour un plat"
    const dishes = restaurant.priceForDishData || [];
    let majorityDish = dishes[0];
    if (dishes.length > 0) {
      majorityDish = dishes.reduce((prev, curr) => 
        (Number(curr.value) || 0) > (Number(prev.value) || 0) ? curr : prev
      , dishes[0]);
    }
    const budgetName = majorityDish?.name ? majorityDish.name.replace(/^Entre\s+/i, '').trim() : '1500-2000 FCFA';
    const budgetPct = majorityDish ? (Math.round((Number(majorityDish.value) || 0) * 10) / 10) : 55;

    return [
      {
        name: restaurant.keyMetrics?.[0]?.name || "Intérêt global pour la restauration scolaire",
        value: interestVal,
        label: restaurant.keyMetrics?.[0]?.label || "des parents intéressés",
        trend: (interestVal >= 50 ? "up" : "down") as "up" | "down",
      },
      {
        name: restaurant.keyMetrics?.[1]?.name || "Plats chauds",
        value: platsChaudsPct,
        label: restaurant.keyMetrics?.[1]?.label || "des parents souhaitent des plats chauds",
        trend: (platsChaudsPct >= 50 ? "up" : "down") as "up" | "down",
      },
      {
        name: restaurant.keyMetrics?.[2]?.name || "Budget moyen par plat",
        value: budgetName,
        label: `pour ${budgetPct}% des parents`,
        trend: "up" as "up" | "down",
      },
    ];
  }, [restaurant.restaurationInterestData, restaurant.mealTypePreferenceData, restaurant.priceForDishData, restaurant.keyMetrics]);

  // 3. Calcul dynamique des Points d'attention (alertes dynamiques)
  const computedAlertPoints = React.useMemo(() => {
    // 3.1 Mercredi = vrai pourcentage saisi dans "Intérêt par jour de la semaine"
    const daysData = restaurant.serviceInterestByDayData || [];
    const mercrediItem = daysData.find((d) => d.name.toLowerCase().includes('mercredi')) || daysData[2];
    const mercrediPct = mercrediItem 
      ? (typeof mercrediItem.percentage === 'number' 
          ? mercrediItem.percentage 
          : (typeof mercrediItem.value === 'number' ? mercrediItem.value : 36.3))
      : 36.3;

    // 3.2 Options alimentaires spécifiques
    const optionVegetarienne = restaurant.alertPoints?.[1]?.value || "33.3%";

    // 3.3 Tarification = vrai pourcentage saisi pour la tranche 2000-3000 FCFA dans "Budget pour un menu complet"
    const menuData = restaurant.priceForMenuData || [];
    const tarifItem = menuData.find((d) => d.name.includes('2 000') || d.name.includes('2000')) || menuData[2];
    const tarifPct = tarifItem ? (Math.round((Number(tarifItem.value) || 0) * 10) / 10) : 58.8;

    return [
      {
        name: restaurant.alertPoints?.[0]?.name || "Mercredi",
        value: `${mercrediPct}%`,
        label: "d'intérêt seulement (vs +80% autres jours)",
        trend: "down" as "up" | "down",
      },
      {
        name: restaurant.alertPoints?.[1]?.name || "Options alimentaires spécifiques",
        value: optionVegetarienne,
        label: restaurant.alertPoints?.[1]?.label || "demandent l'option végétarienne",
        trend: "down" as "up" | "down",
      },
      {
        name: restaurant.alertPoints?.[2]?.name || "Tarification",
        value: `${tarifPct}%`,
        label: "acceptent 2000-3000 FCFA pour un menu complet",
        trend: "down" as "up" | "down",
      },
    ];
  }, [restaurant.serviceInterestByDayData, restaurant.priceForMenuData, restaurant.alertPoints]);

  return (
    <div className="max-w-5xl mx-auto">
      {showEditorControls && (
        <AdminRestaurantSurveyEditor
          restaurant={restaurant}
          onChange={handleRestaurantChange}
        />
      )}
      <DiagnosticCard
        title="Synthèse du sondage sur la restauration scolaire – 1er trimestre 2025"
        description={`Analyse basée sur le sondage auprès des parents d'élèves – ${totalResponses} réponses`}
        className="mb-8"
      >
        {/* Metrics and Student Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard 
            title="Statistiques clés" 
            primary={computedKeyMetrics}
            secondary={computedAlertPoints}
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
