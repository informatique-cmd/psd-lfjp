import type { Metric } from './restaurantData';
import type { RestaurantPageData } from '@/data/restaurantPageData';
import { parseLocaleNumber, sanitizeNumberOrFallback } from '@/lib/pageDataSanitizer';

export interface DistributionRow {
  name: string;
  value: number;
  percentage: number;
}

export interface ChartValueRow {
  name: string;
  value: number;
  percentage?: number;
}

export const toSafeString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

export const safeRound = (num: number, decimals = 1): number => {
  if (!Number.isFinite(num)) return 0;
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
};

/**
 * Division-by-zero safe percentage computation.
 */
export const safePercent = (part: number, total: number, decimals = 1): number => {
  if (!Number.isFinite(part) || !Number.isFinite(total) || total <= 0) return 0;
  const ratio = (Math.max(0, part) / total) * 100;
  return safeRound(ratio, decimals);
};

/**
 * Recalculates student distribution percentages cleanly from student counts (`value`),
 * guarding against division by zero and preserving clean totals.
 */
export const recalculateStudentDistribution = (rows: unknown): DistributionRow[] => {
  if (!Array.isArray(rows)) return [];
  const cleanRows = rows
    .filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null)
    .map((row) => ({
      name: toSafeString(row.name, 'Niveau') || 'Niveau',
      value: Math.max(0, sanitizeNumberOrFallback(row.value, 0)),
      percentage: Math.max(0, sanitizeNumberOrFallback(row.percentage, 0)),
    }));

  const total = cleanRows.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) {
    return cleanRows.map((item) => ({ ...item, percentage: 0 }));
  }

  return cleanRows.map((item) => ({
    ...item,
    percentage: safePercent(item.value, total, 1),
  }));
};

/**
 * Normalizes pie chart rows to sum cleanly to 100% when total > 0.
 */
export const rebalancePieDistribution = (rows: unknown): ChartValueRow[] => {
  if (!Array.isArray(rows)) return [];
  const cleanRows = rows
    .filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null)
    .map((row) => ({
      name: toSafeString(row.name, 'Catégorie') || 'Catégorie',
      value: Math.max(0, sanitizeNumberOrFallback(row.value, 0)),
    }));

  const total = cleanRows.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) {
    return cleanRows.map((item) => ({ ...item, value: 0 }));
  }

  const updated = cleanRows.map((item) => ({
    ...item,
    value: safePercent(item.value, total, 1),
  }));

  const sumVal = updated.reduce((s, it) => s + it.value, 0);
  const diff = safeRound(100 - sumVal, 1);
  if (diff !== 0 && updated.length > 0) {
    updated[0].value = Math.max(0, safeRound(updated[0].value + diff, 1));
  }
  return updated;
};

export interface ComputedRestaurantAnalytics {
  totalResponses: number;
  interestOuiPct: number;
  platsChaudsPct: number;
  repasCompletsPct: number;
  majorityDishName: string;
  majorityDishPct: number;
  weakestDayName: string;
  weakestDayPct: number;
  mercrediPct: number;
  strongDaysLabel: string;
  otherDaysSummaryLabel: string;
  menuTariffName: string;
  menuTariffPct: number;
  vegetarienValue: string;
  computedKeyMetrics: Metric[];
  computedAlertPoints: Metric[];
}

export const computeRestaurantAnalytics = (
  restaurantRaw: Partial<RestaurantPageData> | Record<string, unknown> | null | undefined
): ComputedRestaurantAnalytics => {
  const rest = (restaurantRaw && typeof restaurantRaw === 'object' ? restaurantRaw : {}) as Partial<RestaurantPageData>;

  const studentList = Array.isArray(rest.studentDistributionData) ? rest.studentDistributionData : [];
  const lunchList = Array.isArray(rest.currentLunchData) ? rest.currentLunchData : [];
  const interestList = Array.isArray(rest.restaurationInterestData) ? rest.restaurationInterestData : [];
  const mealsList = Array.isArray(rest.mealTypePreferenceData) ? rest.mealTypePreferenceData : [];
  const daysList = Array.isArray(rest.serviceInterestByDayData) ? rest.serviceInterestByDayData : [];
  const dishList = Array.isArray(rest.priceForDishData) ? rest.priceForDishData : [];
  const menuList = Array.isArray(rest.priceForMenuData) ? rest.priceForMenuData : [];
  const rawKeyMetrics = Array.isArray(rest.keyMetrics) ? rest.keyMetrics : [];
  const rawAlertPoints = Array.isArray(rest.alertPoints) ? rest.alertPoints : [];

  // 1. Total réponses (effectifs cumulatifs élèves, fallback déjeuners)
  const totalStudents = studentList.reduce(
    (sum, item) => sum + Math.max(0, sanitizeNumberOrFallback(item?.value, 0)),
    0
  );
  const totalLunch = lunchList.reduce(
    (sum, item) => sum + Math.max(0, sanitizeNumberOrFallback(item?.value, 0)),
    0
  );
  const totalResponses = totalStudents > 0 ? Math.round(totalStudents) : totalLunch > 0 ? Math.round(totalLunch) : 0;

  // 2. Intérêt global pour la restauration ("Oui")
  const ouiItem =
    interestList.find((d) => toSafeString(d?.name).trim().toLowerCase() === 'oui') || interestList[0];
  const interestOuiPct = ouiItem ? safeRound(Math.min(100, Math.max(0, sanitizeNumberOrFallback(ouiItem.value, 0))), 1) : 0;

  // 3. Types de repas souhaités ("Des plats chauds" & "Des repas complets")
  const getRowPct = (row: { percentage?: unknown; value?: unknown } | undefined): number => {
    if (!row) return 0;
    const pct = parseLocaleNumber(row.percentage);
    if (pct !== null) return safeRound(Math.min(100, Math.max(0, pct)), 1);
    const val = parseLocaleNumber(row.value);
    return val !== null ? safeRound(Math.min(100, Math.max(0, val)), 1) : 0;
  };

  const platsChaudsItem =
    mealsList.find((d) => toSafeString(d?.name).toLowerCase().includes('chaud')) || mealsList[0];
  const platsChaudsPct = getRowPct(platsChaudsItem);

  const repasCompletsItem =
    mealsList.find((d) => {
      const n = toSafeString(d?.name).toLowerCase();
      return n.includes('complet') || n.includes('menu');
    }) || mealsList[mealsList.length - 1];
  const repasCompletsPct = getRowPct(repasCompletsItem);

  // 4. Budget moyen par plat (tranche majoritaire)
  let majorityDish = dishList[0];
  if (dishList.length > 0) {
    majorityDish = dishList.reduce(
      (prev, curr) =>
        sanitizeNumberOrFallback(curr?.value, 0) > sanitizeNumberOrFallback(prev?.value, 0) ? curr : prev,
      dishList[0]
    );
  }
  const majorityDishName = majorityDish?.name
    ? toSafeString(majorityDish.name).replace(/^Entre\s+/i, '').trim() || 'Non renseigné'
    : 'Non renseigné';
  const majorityDishPct = majorityDish ? safeRound(Math.max(0, sanitizeNumberOrFallback(majorityDish.value, 0)), 1) : 0;

  // 5. Intérêt par jour de la semaine -> Mercredi & identification automatique du jour le plus faible
  const normalizedDays = daysList
    .filter((d) => d && typeof d === 'object')
    .map((d) => ({
      name: toSafeString(d.name, 'Jour').trim() || 'Jour',
      pct: getRowPct(d),
    }));

  const hasDays = normalizedDays.length > 0;
  let weakestDay = normalizedDays[0];
  if (hasDays) {
    weakestDay = normalizedDays.reduce((min, cur) => (cur.pct < min.pct ? cur : min), normalizedDays[0]);
  }
  const weakestDayName = hasDays ? weakestDay.name : 'Aucun jour';
  const weakestDayPct = hasDays ? weakestDay.pct : 0;

  const mercrediEntry = normalizedDays.find((d) => d.name.toLowerCase().includes('mercredi'));
  const mercrediPct = mercrediEntry ? mercrediEntry.pct : weakestDayPct;

  const otherDays = normalizedDays.filter((d) => d.name !== weakestDayName);
  const otherMinPct = otherDays.length > 0 ? Math.min(...otherDays.map((d) => d.pct)) : 0;
  const otherAvgPct =
    otherDays.length > 0 ? safeRound(otherDays.reduce((s, d) => s + d.pct, 0) / otherDays.length, 1) : 0;

  const otherDaysSummaryLabel = !hasDays
    ? 'aucune donnée saisie'
    : otherDays.length === 0
      ? "d'intérêt exprimé"
      : otherMinPct >= 80
        ? "d'intérêt seulement (vs +80% autres jours)"
        : `d'intérêt seulement (moy. ${otherAvgPct}% autres jours)`;

  const strongDays = normalizedDays.filter((d) => d.pct >= 75);
  const formatDayList = (names: string[]): string => {
    if (names.length === 0) return 'principaux jours scolaires';
    const lower = names.map((n) => `${n.toLowerCase()}s`);
    if (lower.length === 1) return lower[0];
    return `${lower.slice(0, -1).join(', ')} et ${lower[lower.length - 1]}`;
  };
  const strongDaysLabel = !hasDays
    ? 'jours configurés'
    : strongDays.length > 0
      ? formatDayList(strongDays.slice(0, 3).map((d) => d.name))
      : formatDayList(normalizedDays.slice(0, 3).map((d) => d.name));

  // 6. Budget menu complet (tranche 2000-3000 FCFA ou majoritaire)
  let menuTarget = menuList.find((d) => {
    const n = toSafeString(d?.name);
    return n.includes('2 000') || n.includes('2000');
  });
  if (!menuTarget && menuList.length > 0) {
    menuTarget = menuList.reduce(
      (prev, curr) =>
        sanitizeNumberOrFallback(curr?.value, 0) > sanitizeNumberOrFallback(prev?.value, 0) ? curr : prev,
      menuList[0]
    );
  }
  const menuTariffName = menuTarget?.name
    ? toSafeString(menuTarget.name).replace(/^Entre\s+/i, '').trim() || '2000-3000 FCFA'
    : '2000-3000 FCFA';
  const menuTariffPct = menuTarget ? safeRound(Math.max(0, sanitizeNumberOrFallback(menuTarget.value, 0)), 1) : 0;

  // 7. Options alimentaires spécifiques
  const vegetarienValue = toSafeString(rawAlertPoints[1]?.value, '33.3%') || '33.3%';

  // 8. Build correlated keyMetrics + preserve extra custom metrics (>= index 3)
  const extraKeyMetrics: Metric[] = rawKeyMetrics.slice(3).map((m) => ({
    name: toSafeString(m?.name, 'Indicateur'),
    value: typeof m?.value === 'number' && Number.isFinite(m.value) ? m.value : toSafeString(m?.value, '0'),
    label: toSafeString(m?.label, ''),
    trend: m?.trend === 'down' ? 'down' : 'up',
  }));

  const computedKeyMetrics: Metric[] = [
    {
      name: toSafeString(rawKeyMetrics[0]?.name, 'Intérêt global pour la restauration scolaire') || 'Intérêt global pour la restauration scolaire',
      value: interestOuiPct,
      label: toSafeString(rawKeyMetrics[0]?.label, 'des parents intéressés') || 'des parents intéressés',
      trend: interestOuiPct >= 50 ? 'up' : 'down',
    },
    {
      name: toSafeString(rawKeyMetrics[1]?.name, 'Plats chauds') || 'Plats chauds',
      value: platsChaudsPct,
      label: toSafeString(rawKeyMetrics[1]?.label, 'des parents souhaitent des plats chauds') || 'des parents souhaitent des plats chauds',
      trend: platsChaudsPct >= 50 ? 'up' : 'down',
    },
    {
      name: toSafeString(rawKeyMetrics[2]?.name, 'Budget moyen par plat') || 'Budget moyen par plat',
      value: majorityDishName,
      label: `pour ${majorityDishPct}% des parents`,
      trend: 'up',
    },
    ...extraKeyMetrics,
  ];

  // 9. Build correlated alertPoints + preserve extra custom alerts (>= index 3)
  const extraAlertPoints: Metric[] = rawAlertPoints.slice(3).map((m) => ({
    name: toSafeString(m?.name, "Point d'attention"),
    value: typeof m?.value === 'number' && Number.isFinite(m.value) ? `${m.value}%` : toSafeString(m?.value, ''),
    label: toSafeString(m?.label, ''),
    trend: 'down',
  }));

  const computedAlertPoints: Metric[] = [
    {
      name: weakestDayName,
      value: `${weakestDayPct}%`,
      label: otherDaysSummaryLabel,
      trend: 'down',
    },
    {
      name: toSafeString(rawAlertPoints[1]?.name, 'Options alimentaires spécifiques') || 'Options alimentaires spécifiques',
      value: vegetarienValue,
      label: toSafeString(rawAlertPoints[1]?.label, "demandent l'option végétarienne") || "demandent l'option végétarienne",
      trend: 'down',
    },
    {
      name: toSafeString(rawAlertPoints[2]?.name, 'Tarification') || 'Tarification',
      value: `${menuTariffPct}%`,
      label: `acceptent ${menuTariffName} pour un menu complet`,
      trend: 'down',
    },
    ...extraAlertPoints,
  ];

  return {
    totalResponses,
    interestOuiPct,
    platsChaudsPct,
    repasCompletsPct,
    majorityDishName,
    majorityDishPct,
    weakestDayName,
    weakestDayPct,
    mercrediPct,
    strongDaysLabel,
    otherDaysSummaryLabel,
    menuTariffName,
    menuTariffPct,
    vegetarienValue,
    computedKeyMetrics,
    computedAlertPoints,
  };
};
