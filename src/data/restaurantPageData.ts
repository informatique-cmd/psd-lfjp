import {
  alertPoints,
  currentLunchData,
  keyMetrics,
  mealTypePreferenceData,
  priceForDishData,
  priceForMenuData,
  restaurationInterestData,
  serviceInterestByDayData,
  studentDistributionData,
} from '@/components/diagnostic/restaurant/restaurantData';

export const restaurantPageData = {
  studentDistributionData,
  restaurationInterestData,
  currentLunchData,
  serviceInterestByDayData,
  mealTypePreferenceData,
  priceForDishData,
  priceForMenuData,
  keyMetrics,
  alertPoints,
};

export type RestaurantPageData = typeof restaurantPageData;