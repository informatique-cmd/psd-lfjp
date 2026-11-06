
// Survey data for restaurant diagnostic
export const studentDistributionData = [
  { name: 'Maternelle', value: 15, percentage: 17.2 },
  { name: 'Élémentaire', value: 53, percentage: 60.9 },
  { name: 'Collège', value: 45, percentage: 51.7 },
  { name: 'Lycée', value: 23, percentage: 26.4 }
];

export const restaurationInterestData = [
  { name: 'Oui', value: 92 },
  { name: 'Non', value: 8 }
];

export const periscolaireData = [
  { name: 'Oui', value: 29.9 },
  { name: 'Non', value: 70.1 }
];

export const currentLunchData = [
  { name: 'À la maison ou chez un proche', value: 28, percentage: 35 },
  { name: 'Un repas préparé à la maison (lunch-box)', value: 35, percentage: 43.8 },
  { name: 'Un plat ou repas livré', value: 25, percentage: 31.3 },
  { name: 'Un repas acheté à proximité de l’établissement', value: 36, percentage: 45 },
  { name: 'À la maison et un repas préparé', value: 1, percentage: 1.3 }
];

export const serviceInterestByDayData = [
  { name: 'Lundi', value: 75, percentage: 93.8 },
  { name: 'Mardi', value: 66, percentage: 82.5 },
  { name: 'Mercredi', value: 29, percentage: 36.3 },
  { name: 'Jeudi', value: 75, percentage: 93.8 },
  { name: 'Vendredi', value: 60, percentage: 75 }
];

export const mealTypePreferenceData = [
  { name: 'Des plats chauds', value: 65, percentage: 81.3 },
  { name: 'Des plats froids', value: 39, percentage: 48.8 },
  { name: 'Des sandwichs ou du fast-food', value: 21, percentage: 26.3 },
  { name: 'Des repas complets (menu)', value: 48, percentage: 60 }
];

export const priceForDishData = [
  { name: 'Moins de 1 500 FCFA', value: 22.5 },
  { name: 'Entre 1 500 FCFA et 2 000 FCFA', value: 55 },
  { name: 'Entre 2 000 FCFA et 3 000 FCFA', value: 20 },
  { name: 'Plus de 3 000 FCFA', value: 2.5 }
];

export const priceForMenuData = [
  { name: 'Moins de 1 500 FCFA', value: 2.5 },
  { name: 'Entre 1 500 FCFA et 2 000 FCFA', value: 23.8 },
  { name: 'Entre 2 000 FCFA et 3 000 FCFA', value: 58.8 },
  { name: 'Plus de 3 000 FCFA', value: 13.8 },
  { name: 'Dépend du menu', value: 1.1 }
];

export const CHART_COLORS = ['#0055A4', '#EF4135', '#FFCD00', '#38b000', '#9381ff'];

export interface Metric {
  name: string;
  value: number | string;
  label?: string;
  average?: number;
  trend: "up" | "down";
}

export const keyMetrics: Metric[] = [
  { name: "Intérêt global pour la restauration scolaire", value: 92, label: "des parents intéressés", trend: "up" },
  { name: "Plats chauds", value: 81.3, label: "des parents souhaitent des plats chauds", trend: "up" },
  { name: "Budget moyen par plat", value: "1500-2000 FCFA", label: "pour 55% des parents", trend: "up" }
];

export const alertPoints: Metric[] = [
  { name: "Mercredi", value: "36.3%", label: "d'intérêt seulement (vs +80% autres jours)", trend: "down" },
  { name: "Options alimentaires spécifiques", value: "33.3%", label: "demandent l'option végétarienne", trend: "down" },
  { name: "Tarification", value: "58.8%", label: "acceptent 2000-3000 FCFA pour un menu complet", trend: "down" }
];
