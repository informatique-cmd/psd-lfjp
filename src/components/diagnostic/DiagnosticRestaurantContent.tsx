import React from 'react';
import DiagnosticCard from './DiagnosticCard';
import MetricCard from './MetricCard';
import StudentDistributionChart from './restaurant/StudentDistributionChart';
import RestaurantPieChart from './restaurant/RestaurantPieChart';
import HorizontalBarChart from './restaurant/HorizontalBarChart';
import VerticalBarChart from './restaurant/VerticalBarChart';
import RestaurantConclusions from './restaurant/RestaurantConclusions';
import { restaurantPageData, type RestaurantPageData } from '@/data/restaurantPageData';
import pageDataFile from '@/content/pageData.json';
import { CHART_COLORS } from './restaurant/restaurantData';
import AdminRestaurantSurveyEditor from './restaurant/AdminRestaurantSurveyEditor';
import { computeRestaurantAnalytics } from './restaurant/restaurantCorrelations';
import { sanitizeRestaurantDataset } from '@/lib/pageDataSanitizer';
import { usePublishedPageData } from '@/lib/publishedDataSync';
import { usePrivilegedAccess, isPrivilegedUser, shouldShowEditorControls } from '@/lib/authAccess';

const restaurantDraftFallback = {
  ...pageDataFile,
  restaurant: (pageDataFile as { restaurant?: RestaurantPageData }).restaurant || restaurantPageData,
};

const sanitizeRestaurantState = (raw: unknown): RestaurantPageData => {
  const sanitized = sanitizeRestaurantDataset(raw) as Partial<RestaurantPageData>;
  return {
    studentDistributionData: Array.isArray(sanitized.studentDistributionData)
      ? sanitized.studentDistributionData
      : restaurantDraftFallback.restaurant.studentDistributionData,
    restaurationInterestData: Array.isArray(sanitized.restaurationInterestData)
      ? sanitized.restaurationInterestData
      : restaurantDraftFallback.restaurant.restaurationInterestData,
    currentLunchData: Array.isArray(sanitized.currentLunchData)
      ? sanitized.currentLunchData
      : restaurantDraftFallback.restaurant.currentLunchData,
    serviceInterestByDayData: Array.isArray(sanitized.serviceInterestByDayData)
      ? sanitized.serviceInterestByDayData
      : restaurantDraftFallback.restaurant.serviceInterestByDayData,
    mealTypePreferenceData: Array.isArray(sanitized.mealTypePreferenceData)
      ? sanitized.mealTypePreferenceData
      : restaurantDraftFallback.restaurant.mealTypePreferenceData,
    priceForDishData: Array.isArray(sanitized.priceForDishData)
      ? sanitized.priceForDishData
      : restaurantDraftFallback.restaurant.priceForDishData,
    priceForMenuData: Array.isArray(sanitized.priceForMenuData)
      ? sanitized.priceForMenuData
      : restaurantDraftFallback.restaurant.priceForMenuData,
    keyMetrics: Array.isArray(sanitized.keyMetrics)
      ? sanitized.keyMetrics
      : restaurantDraftFallback.restaurant.keyMetrics,
    alertPoints: Array.isArray(sanitized.alertPoints)
      ? sanitized.alertPoints
      : restaurantDraftFallback.restaurant.alertPoints,
  };
};

const getInitialRestaurant = (publishedBase: RestaurantPageData): RestaurantPageData => {
  if (typeof window !== 'undefined' && isPrivilegedUser() && shouldShowEditorControls()) {
    try {
      const saved = window.localStorage.getItem('lfjp-admin-page-data-draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.restaurant && typeof parsed.restaurant === 'object') {
          return sanitizeRestaurantState({
            ...publishedBase,
            ...parsed.restaurant,
          });
        }
      }
    } catch {
      // fallback
    }
  }
  return sanitizeRestaurantState(publishedBase);
};

const DiagnosticRestaurantContent = () => {
  const publishedPageData = usePublishedPageData(restaurantDraftFallback);
  const publishedRestaurant = React.useMemo(
    () => sanitizeRestaurantState(publishedPageData?.restaurant || restaurantDraftFallback.restaurant),
    [publishedPageData]
  );

  const [restaurant, setRestaurant] = React.useState<RestaurantPageData>(() =>
    getInitialRestaurant(publishedRestaurant)
  );
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();

  // Keep public view synchronized when fresh published JSON arrives
  React.useEffect(() => {
    if (!isPrivileged || !showEditorControls) {
      setRestaurant(publishedRestaurant);
    }
  }, [publishedRestaurant, isPrivileged, showEditorControls]);

  React.useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ restaurant?: unknown; source?: string }>;
      if (customEvent.detail?.source === 'restaurant_survey_editor') return;
      if (customEvent.detail?.restaurant) {
        setRestaurant(sanitizeRestaurantState(customEvent.detail.restaurant));
      }
    };
    const handleStorage = () => {
      setRestaurant(getInitialRestaurant(publishedRestaurant));
    };
    const handleRecover = () => {
      setRestaurant(sanitizeRestaurantState(restaurantPageData));
    };
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'lfjp-page-data-update' && e.data?.data?.restaurant) {
        setRestaurant(sanitizeRestaurantState(e.data.data.restaurant));
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('message', handleMessage);
    window.addEventListener('lfjp_page_data_changed', handleSync);
    window.addEventListener('lfjp_draft_cleared', handleStorage);
    window.addEventListener('lfjp_section_recovered_restaurant', handleRecover);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('lfjp_page_data_changed', handleSync);
      window.removeEventListener('lfjp_draft_cleared', handleStorage);
      window.removeEventListener('lfjp_section_recovered_restaurant', handleRecover);
    };
  }, [publishedRestaurant]);

  const handleRestaurantChange = (updatedRestaurant: RestaurantPageData) => {
    if (!isPrivileged || !showEditorControls) {
      console.warn('Action de modification ignorée : utilisateur non autorisé ou vue publique.');
      return;
    }
    const cleanRestaurant = sanitizeRestaurantState(updatedRestaurant);
    setRestaurant(cleanRestaurant);
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
          restaurant: cleanRestaurant,
        };
        window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(merged));
        window.dispatchEvent(
          new CustomEvent('lfjp_page_data_changed', {
            detail: { restaurant: cleanRestaurant, source: 'restaurant_survey_editor' },
          })
        );
        window.dispatchEvent(new Event('storage'));

        if (window.parent && window.parent !== window) {
          try {
            window.parent.postMessage(
              { type: 'lfjp_restaurant_data_updated', restaurant: cleanRestaurant, source: 'restaurant_survey_editor' },
              '*'
            );
            window.parent.dispatchEvent(
              new CustomEvent('lfjp_page_data_changed', {
                detail: { restaurant: cleanRestaurant, source: 'restaurant_survey_editor' },
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

  const analytics = React.useMemo(() => computeRestaurantAnalytics(restaurant), [restaurant]);

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
        description={`Analyse basée sur le sondage auprès des parents d'élèves – ${analytics.totalResponses} réponses`}
        className="mb-8"
      >
        {/* Metrics and Student Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard 
            title="Statistiques clés" 
            primary={analytics.computedKeyMetrics}
            secondary={analytics.computedAlertPoints}
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
        <RestaurantConclusions analytics={analytics} />
      </DiagnosticCard>
    </div>
  );
};

export default DiagnosticRestaurantContent;
