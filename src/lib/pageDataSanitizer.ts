const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

/**
 * Strictly parses French/international decimal inputs (e.g. "17,2", " 17.2 ", "1 500")
 * into a finite JS number, or returns null when unparseable.
 */
export const parseLocaleNumber = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/\u00A0/g, ' ').replace(/\s+/g, '').replace(/,/g, '.');
    if (cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.') {
      return null;
    }
    if (!/^[-+]?\d*(\.\d+)?$/.test(cleaned)) {
      return null;
    }
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export const sanitizeNumberOrFallback = (value: unknown, fallback = 0): number => {
  const parsed = parseLocaleNumber(value);
  return parsed !== null ? parsed : fallback;
};

export const sanitizeRestaurantDataset = (raw: unknown): Record<string, unknown> => {
  const rest = isRecord(raw) ? { ...raw } : {};

  const normalizeChartRows = (rows: unknown, hasPercentage: boolean) => {
    if (!Array.isArray(rows)) return [];
    return rows
      .filter((row) => isRecord(row))
      .map((row) => {
        const cleanVal = Math.max(0, sanitizeNumberOrFallback(row.value, 0));
        const nextRow: Record<string, unknown> = {
          name: typeof row.name === 'string' && row.name.trim() !== '' ? row.name : String(row.name ?? 'Élément'),
          value: cleanVal,
        };
        if (hasPercentage) {
          nextRow.percentage = Math.max(0, sanitizeNumberOrFallback(row.percentage, 0));
        }
        return nextRow;
      });
  };

  const normalizeMetricRows = (rows: unknown) => {
    if (!Array.isArray(rows)) return [];
    return rows
      .filter((row) => isRecord(row))
      .map((row) => {
        const parsedNum = parseLocaleNumber(row.value);
        const value =
          parsedNum !== null
            ? parsedNum
            : typeof row.value === 'string'
              ? row.value
              : String(row.value ?? '');

        const nextRow: Record<string, unknown> = {
          name: typeof row.name === 'string' && row.name.trim() !== '' ? row.name : String(row.name ?? 'Indicateur'),
          value,
          label: typeof row.label === 'string' ? row.label : String(row.label ?? ''),
          trend: row.trend === 'down' ? 'down' : 'up',
        };
        if (row.average !== undefined && row.average !== null && String(row.average).trim() !== '') {
          const avg = parseLocaleNumber(row.average);
          if (avg !== null) {
            nextRow.average = avg;
          }
        }
        return nextRow;
      });
  };

  return {
    studentDistributionData: normalizeChartRows(rest.studentDistributionData, true),
    restaurationInterestData: normalizeChartRows(rest.restaurationInterestData, false),
    currentLunchData: normalizeChartRows(rest.currentLunchData, true),
    serviceInterestByDayData: normalizeChartRows(rest.serviceInterestByDayData, true),
    mealTypePreferenceData: normalizeChartRows(rest.mealTypePreferenceData, true),
    priceForDishData: normalizeChartRows(rest.priceForDishData, false),
    priceForMenuData: normalizeChartRows(rest.priceForMenuData, false),
    keyMetrics: normalizeMetricRows(rest.keyMetrics),
    alertPoints: normalizeMetricRows(rest.alertPoints),
  };
};

export const sanitizeElcsDataset = (raw: unknown): Record<string, unknown> => {
  const src = isRecord(raw) ? raw : {};
  const keys = ['satisfaction', 'relations', 'travail', 'securite'] as const;

  const sanitizeMetricList = (list: unknown, allowAverage: boolean) => {
    if (!Array.isArray(list)) return [];
    return list
      .filter((m) => isRecord(m))
      .map((m) => {
        const parsedNum = parseLocaleNumber(m.value);
        const value =
          parsedNum !== null
            ? parsedNum
            : typeof m.value === 'string' && m.value.trim() !== ''
              ? m.value
              : 0;

        const out: Record<string, unknown> = {
          name: typeof m.name === 'string' && m.name.trim() !== '' ? m.name : String(m.name ?? 'Indicateur'),
          value,
          label: typeof m.label === 'string' ? m.label : String(m.label ?? ''),
          trend: m.trend === 'down' ? 'down' : 'up',
        };

        if (allowAverage && m.average !== undefined && m.average !== null && String(m.average).trim() !== '') {
          const avg = parseLocaleNumber(m.average);
          if (avg !== null) {
            out.average = avg;
          }
        }

        return out;
      });
  };

  const result: Record<string, unknown> = {};
  keys.forEach((key) => {
    const cat = isRecord(src[key]) ? src[key] : {};
    result[key] = {
      title: typeof cat.title === 'string' && cat.title.trim() !== '' ? cat.title : key,
      primary: sanitizeMetricList(cat.primary, true),
      secondary: sanitizeMetricList(cat.secondary, false),
    };
  });
  return result;
};

/**
 * Normalizes all Diagnostic sections (Diagnostic PSD, Restauration Scolaire, Diagnostic ELCS)
 * before draft storage, runtime display, or JSON validation/publication.
 */
export const sanitizeDiagnosticData = (raw: unknown): Record<string, unknown> => {
  if (!isRecord(raw)) return {};
  const out: Record<string, unknown> = {};
  if (raw.restaurant !== undefined) {
    out.restaurant = sanitizeRestaurantDataset(raw.restaurant);
  }
  if (raw.elcsData !== undefined) {
    out.elcsData = sanitizeElcsDataset(raw.elcsData);
  }
  if (raw.psdSurveyData !== undefined) {
    out.psdSurveyData = sanitizePsdSurveyData(raw.psdSurveyData);
  }
  return out;
};

export const sanitizePsdTimelines = (raw: unknown): Record<string, unknown> => {
  if (!isRecord(raw)) return {};
  const out: Record<string, unknown> = {};
  Object.entries(raw).forEach(([key, timeline]) => {
    if (!isRecord(timeline)) return;
    const rawStartYear = Math.round(sanitizeNumberOrFallback(timeline.startYear, 2026));
    const rawEndYear = Math.round(sanitizeNumberOrFallback(timeline.endYear, Math.max(2030, rawStartYear)));
    const startYear = rawStartYear;
    const endYear = Math.max(startYear, rawEndYear);

    const actions = Array.isArray(timeline.actions)
      ? timeline.actions
          .filter((a) => isRecord(a))
          .map((action) => {
            const rawStart = Math.round(sanitizeNumberOrFallback(action.start, startYear));
            const rawEnd = Math.round(sanitizeNumberOrFallback(action.end, endYear));
            const clampedStart = Math.min(endYear, Math.max(startYear, rawStart));
            const clampedEnd = Math.min(endYear, Math.max(clampedStart, rawEnd));
            return {
              title: typeof action.title === 'string' ? action.title : String(action.title ?? 'Action'),
              description: typeof action.description === 'string' ? action.description : String(action.description ?? ''),
              start: clampedStart,
              end: clampedEnd,
              color: typeof action.color === 'string' && action.color ? action.color : 'from-french-blue/70 to-french-blue',
            };
          })
      : [];

    out[key] = {
      ...(typeof timeline.title === 'string' ? { title: timeline.title } : {}),
      startYear,
      endYear,
      actions,
    };
  });
  return out;
};

export const sanitizePsdAxesData = (raw: unknown): Record<string, unknown> | undefined => {
  if (raw === undefined) return undefined;
  if (!isRecord(raw)) return {};
  const out: Record<string, unknown> = {};
  (['axe1', 'axe2', 'axe3', 'axe4'] as const).forEach((axisKey) => {
    const axis = isRecord(raw[axisKey]) ? raw[axisKey] : null;
    if (!axis) return;
    const indicators = Array.isArray(axis.indicators)
      ? axis.indicators
          .filter((ind) => isRecord(ind))
          .map((ind) => ({
            name: typeof ind.name === 'string' ? ind.name : String(ind.name ?? 'Indicateur'),
            currentRate: Math.max(0, sanitizeNumberOrFallback(ind.currentRate, 0)),
            targetRate: Math.max(1, sanitizeNumberOrFallback(ind.targetRate, 100)),
            unit: typeof ind.unit === 'string' && ind.unit ? ind.unit : '%',
            status: typeof ind.status === 'string' && ind.status ? ind.status : 'En cours',
          }))
      : [];
    out[axisKey] = {
      id: axisKey,
      shortTitle: typeof axis.shortTitle === 'string' ? axis.shortTitle : axisKey.toUpperCase(),
      title: typeof axis.title === 'string' ? axis.title : axisKey.toUpperCase(),
      subtitle: typeof axis.subtitle === 'string' ? axis.subtitle : '',
      budgetMillions: Math.max(0, sanitizeNumberOrFallback(axis.budgetMillions, 0)),
      indicators,
    };
  });
  return out;
};

export const sanitizePsdSurveyData = (raw: unknown): Record<string, unknown> | undefined => {
  if (raw === undefined) return undefined;
  if (!isRecord(raw)) return undefined;

  const sanitizeScoreItems = (items: unknown) => {
    if (!Array.isArray(items)) return [];
    return items
      .filter((item) => isRecord(item))
      .map((item) => {
        const res: Record<string, unknown> = {
          name: typeof item.name === 'string' ? item.name : String(item.name ?? ''),
          score: Math.min(5, Math.max(0, sanitizeNumberOrFallback(item.score, 0))),
        };
        if (typeof item.note === 'string' && item.note.trim() !== '') {
          res.note = item.note;
        }
        if (typeof item.tone === 'string' && item.tone.trim() !== '') {
          res.tone = item.tone;
        }
        return res;
      });
  };

  const out: Record<string, unknown> = {};

  if (isRecord(raw.eleves)) {
    const el = raw.eleves;
    out.eleves = {
      totalResponses: Math.max(0, Math.round(sanitizeNumberOrFallback(el.totalResponses, 98))),
      recommendationRate: Math.min(100, Math.max(0, sanitizeNumberOrFallback(el.recommendationRate, 59))),
      recommendationNote: typeof el.recommendationNote === 'string' ? el.recommendationNote : '',
      topClasses: Array.isArray(el.topClasses)
        ? el.topClasses
            .filter((c) => isRecord(c))
            .map((c) => ({
              name: typeof c.name === 'string' ? c.name : '',
              percentage: Math.min(100, Math.max(0, sanitizeNumberOrFallback(c.percentage, 0))),
            }))
        : [],
      qualiteInformation: sanitizeScoreItems(el.qualiteInformation),
      qualiteInformationConstat: typeof el.qualiteInformationConstat === 'string' ? el.qualiteInformationConstat : '',
      installations: sanitizeScoreItems(el.installations),
      installationsKeywords: isStringArray(el.installationsKeywords) ? el.installationsKeywords : [],
      offreScolaire: sanitizeScoreItems(el.offreScolaire),
      accompagnement: sanitizeScoreItems(el.accompagnement),
      pointsForts: sanitizeScoreItems(el.pointsForts),
      pointsFortsConstat: typeof el.pointsFortsConstat === 'string' ? el.pointsFortsConstat : '',
      priorites: sanitizeScoreItems(el.priorites),
      prioritesSecondaryNote: typeof el.prioritesSecondaryNote === 'string' ? el.prioritesSecondaryNote : '',
    };
  }

  if (isRecord(raw.parents)) {
    const pa = raw.parents;
    out.parents = {
      totalResponses: Math.max(0, Math.round(sanitizeNumberOrFallback(pa.totalResponses, 107))),
      singleChildRate: Math.min(100, Math.max(0, sanitizeNumberOrFallback(pa.singleChildRate, 51))),
      recommendationRate: Math.min(100, Math.max(0, sanitizeNumberOrFallback(pa.recommendationRate, 93))),
      recommendationNote: typeof pa.recommendationNote === 'string' ? pa.recommendationNote : '',
      motifChoix: sanitizeScoreItems(pa.motifChoix),
      qualiteInformation: sanitizeScoreItems(pa.qualiteInformation),
      qualiteInformationConstat: typeof pa.qualiteInformationConstat === 'string' ? pa.qualiteInformationConstat : '',
      installations: sanitizeScoreItems(pa.installations),
      installationsConstat: typeof pa.installationsConstat === 'string' ? pa.installationsConstat : '',
      offreScolaire: sanitizeScoreItems(pa.offreScolaire),
      offreScolaireConstat: typeof pa.offreScolaireConstat === 'string' ? pa.offreScolaireConstat : '',
      accompagnement: sanitizeScoreItems(pa.accompagnement),
      accompagnementConstat: typeof pa.accompagnementConstat === 'string' ? pa.accompagnementConstat : '',
      pointsForts: sanitizeScoreItems(pa.pointsForts),
      pointsFortsConstat: typeof pa.pointsFortsConstat === 'string' ? pa.pointsFortsConstat : '',
      priorites: sanitizeScoreItems(pa.priorites),
      prioritesSecondaires: sanitizeScoreItems(pa.prioritesSecondaires),
    };
  }

  return out;
};

export const sanitizeBudgetData = (raw: unknown): Record<string, unknown> | undefined => {
  if (raw === undefined) return undefined;
  if (!isRecord(raw)) return {};
  const next: Record<string, unknown> = { ...raw };

  if (Array.isArray(raw.projects)) {
    next.projects = raw.projects
      .filter((p) => isRecord(p))
      .map((p, idx) => {
        const startYear = Math.max(2020, Math.min(2040, Math.round(sanitizeNumberOrFallback(p.startYear, 2026))));
        const durationYears = Math.max(1, Math.min(15, Math.round(sanitizeNumberOrFallback(p.durationYears, 1))));
        const totalCost = Math.max(0, sanitizeNumberOrFallback(p.totalCost ?? p.budget, 0));
        const budget = Math.max(0, sanitizeNumberOrFallback(p.budget ?? p.totalCost, totalCost));
        const title = typeof p.title === 'string' && p.title.trim() ? p.title : typeof p.name === 'string' && p.name.trim() ? p.name : `Projet ${idx + 1}`;
        return {
          ...p,
          id: typeof p.id === 'string' && p.id ? p.id : `proj-${idx + 1}`,
          title,
          name: typeof p.name === 'string' && p.name.trim() ? p.name : title,
          category: p.category === 'equipment' || p.category === 'land' ? p.category : 'infra',
          startYear,
          durationYears,
          totalCost,
          budget,
          variableMin: Math.max(0, sanitizeNumberOrFallback(p.variableMin, Math.round(budget * 0.5))),
          variableMax: Math.max(0, sanitizeNumberOrFallback(p.variableMax, Math.max(budget + 20_000_000, Math.round(budget * 1.5)))),
          isActive: p.isActive !== false,
          isVariable: p.isVariable !== false,
          showLink: p.showLink !== false,
          description: typeof p.description === 'string' ? p.description : '',
          period: typeof p.period === 'string' && p.period ? p.period : `${startYear}${durationYears > 1 ? ` – ${startYear + durationYears - 1}` : ''}`,
          link: typeof p.link === 'string' ? p.link : '',
        };
      });
  }

  if (Array.isArray(raw.tuitionSimulations)) {
    next.tuitionSimulations = raw.tuitionSimulations
      .filter((s) => isRecord(s))
      .map((s) => ({
        year: Math.round(sanitizeNumberOrFallback(s.year, 2026)),
        increase: sanitizeNumberOrFallback(s.increase, 0),
        revenue: Math.round(sanitizeNumberOrFallback(s.revenue, 0)),
      }));
  }

  if (raw.tuitionBaseRevenue !== undefined) {
    next.tuitionBaseRevenue = Math.max(0, sanitizeNumberOrFallback(raw.tuitionBaseRevenue, 1_203_146_500));
  }
  if (raw.cumulativeTuition !== undefined) {
    next.cumulativeTuition = sanitizeNumberOrFallback(raw.cumulativeTuition, 0);
  }

  if (isRecord(raw.summaryCards)) {
    next.summaryCards = {
      totalInvestment: Math.max(0, sanitizeNumberOrFallback(raw.summaryCards.totalInvestment, 0)),
      fundingGap: Math.max(0, sanitizeNumberOrFallback(raw.summaryCards.fundingGap, 0)),
      estimatedCapacity: Math.max(0, sanitizeNumberOrFallback(raw.summaryCards.estimatedCapacity, 0)),
    };
  }

  return next;
};

export const sanitizeTransportData = (raw: unknown): Record<string, unknown> | undefined => {
  if (raw === undefined) return undefined;
  if (!isRecord(raw)) return {};
  const next: Record<string, unknown> = { ...raw };

  if (Array.isArray(raw.communes)) {
    next.communes = raw.communes
      .filter((c) => isRecord(c))
      .map((c) => ({
        ville: typeof c.ville === 'string' ? c.ville : 'Commune',
        total: Math.max(0, Math.round(sanitizeNumberOrFallback(c.total, 0))),
        part: typeof c.part === 'string' ? c.part : `${sanitizeNumberOrFallback(c.part, 0)} %`,
      }));
  }

  if (Array.isArray(raw.circuits)) {
    next.circuits = raw.circuits
      .filter((c) => isRecord(c))
      .map((c) => ({
        name: typeof c.name === 'string' ? c.name : 'Ligne',
        arrets: typeof c.arrets === 'string' ? c.arrets : '',
        horaireDepart: typeof c.horaireDepart === 'string' ? c.horaireDepart : '',
        eleves: Math.max(0, Math.round(sanitizeNumberOrFallback(c.eleves, 0))),
      }));
  }

  if (Array.isArray(raw.tarifs)) {
    next.tarifs = raw.tarifs
      .filter((t) => isRecord(t))
      .map((t) => ({
        zone: typeof t.zone === 'string' ? t.zone : 'Zone',
        description: typeof t.description === 'string' ? t.description : '',
        mensuel: Math.max(0, Math.round(sanitizeNumberOrFallback(t.mensuel, 0))),
        annuel: Math.max(0, Math.round(sanitizeNumberOrFallback(t.annuel, 0))),
      }));
  }

  if (isRecord(raw.stats)) {
    next.stats = {
      totalEleves: Math.max(0, Math.round(sanitizeNumberOrFallback(raw.stats.totalEleves, 0))),
      partSaly: typeof raw.stats.partSaly === 'string' ? raw.stats.partSaly : '0 %',
      partPeripherie: typeof raw.stats.partPeripherie === 'string' ? raw.stats.partPeripherie : '0 %',
      partEloignee: typeof raw.stats.partEloignee === 'string' ? raw.stats.partEloignee : '0 %',
    };
  }

  return next;
};

/**
 * Normalizes an entire pageData object before JSON validation & serialization:
 * - Converts French decimal commas ("17,2") to valid JS numbers (17.2)
 * - Removes undefined, null, NaN in numeric fields
 * - Clamps timeline start/end years within their axis range
 */
export const sanitizePageData = (raw: unknown): Record<string, unknown> => {
  if (!isRecord(raw)) return {};
  const next: Record<string, unknown> = { ...raw };

  if (next.restaurant !== undefined) {
    next.restaurant = sanitizeRestaurantDataset(next.restaurant);
  }
  if (next.elcsData !== undefined) {
    next.elcsData = sanitizeElcsDataset(next.elcsData);
  }
  if (next.psdTimelines !== undefined) {
    next.psdTimelines = sanitizePsdTimelines(next.psdTimelines);
  }
  if (next.psdAxesData !== undefined) {
    next.psdAxesData = sanitizePsdAxesData(next.psdAxesData);
  }
  if (next.psdSurveyData !== undefined) {
    next.psdSurveyData = sanitizePsdSurveyData(next.psdSurveyData);
  }
  if (next.budgetData !== undefined) {
    next.budgetData = sanitizeBudgetData(next.budgetData);
  }
  if (next.transportData !== undefined) {
    next.transportData = sanitizeTransportData(next.transportData);
  }
  if (isRecord(next.planStrategique)) {
    next.planStrategique = {
      title: typeof next.planStrategique.title === 'string' ? next.planStrategique.title : 'PLAN STRATÉGIQUE DE DÉVELOPPEMENT',
      subtitle: typeof next.planStrategique.subtitle === 'string' ? next.planStrategique.subtitle : 'Lycée Français Jacques Prévert (2026-2030)',
    };
  }
  if (isRecord(next.planificationBacBlanc)) {
    next.planificationBacBlanc = {
      badge: typeof next.planificationBacBlanc.badge === 'string' ? next.planificationBacBlanc.badge : '',
      title: typeof next.planificationBacBlanc.title === 'string' ? next.planificationBacBlanc.title : '',
      description: typeof next.planificationBacBlanc.description === 'string' ? next.planificationBacBlanc.description : '',
    };
  }

  return next;
};

/**
 * Validates pageData and returns exact key-level diagnostics on failure.
 */
export const validatePageDataDetailed = (value: unknown): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { valid: false, errors: ['pageData : objet racine invalide.'] };
  }

  // 1. bacBlancSchedule
  if (!Array.isArray(value.bacBlancSchedule)) {
    errors.push('bacBlancSchedule : tableau attendu.');
  } else {
    value.bacBlancSchedule.forEach((day, dIdx) => {
      if (!isRecord(day)) {
        errors.push(`bacBlancSchedule[${dIdx}] : objet attendu.`);
        return;
      }
      if (typeof day.date !== 'string') errors.push(`bacBlancSchedule[${dIdx}].date : chaîne attendue.`);
      if (typeof day.label !== 'string') errors.push(`bacBlancSchedule[${dIdx}].label : chaîne attendue.`);
      if (typeof day.focus !== 'string') errors.push(`bacBlancSchedule[${dIdx}].focus : chaîne attendue.`);
      if (!Array.isArray(day.rooms)) {
        errors.push(`bacBlancSchedule[${dIdx}].rooms : tableau attendu.`);
      } else {
        day.rooms.forEach((room, rIdx) => {
          if (!isRecord(room)) {
            errors.push(`bacBlancSchedule[${dIdx}].rooms[${rIdx}] : objet attendu.`);
            return;
          }
          if (typeof room.room !== 'string') errors.push(`bacBlancSchedule[${dIdx}].rooms[${rIdx}].room : chaîne attendue.`);
          if (typeof room.examTitle !== 'string') errors.push(`bacBlancSchedule[${dIdx}].rooms[${rIdx}].examTitle : chaîne attendue.`);
          if (typeof room.examTime !== 'string') errors.push(`bacBlancSchedule[${dIdx}].rooms[${rIdx}].examTime : chaîne attendue.`);
          if (typeof room.leadExaminer !== 'string') errors.push(`bacBlancSchedule[${dIdx}].rooms[${rIdx}].leadExaminer : chaîne attendue.`);
          if (!isStringArray(room.surveillanceTeam)) {
            errors.push(`bacBlancSchedule[${dIdx}].rooms[${rIdx}].surveillanceTeam : tableau de chaînes attendu.`);
          }
        });
      }
    });
  }

  // 2. filmAnnuelData
  if (!isRecord(value.filmAnnuelData)) {
    errors.push('filmAnnuelData : objet attendu.');
  } else {
    Object.entries(value.filmAnnuelData).forEach(([lvlKey, level]) => {
      if (!isRecord(level)) {
        errors.push(`filmAnnuelData.${lvlKey} : objet attendu.`);
        return;
      }
      if (typeof level.level !== 'string') errors.push(`filmAnnuelData.${lvlKey}.level : chaîne attendue.`);
      if (typeof level.subtitle !== 'string') errors.push(`filmAnnuelData.${lvlKey}.subtitle : chaîne attendue.`);
      if (!Array.isArray(level.actions)) {
        errors.push(`filmAnnuelData.${lvlKey}.actions : tableau attendu.`);
      } else {
        level.actions.forEach((action, aIdx) => {
          if (!isRecord(action)) {
            errors.push(`filmAnnuelData.${lvlKey}.actions[${aIdx}] : objet attendu.`);
            return;
          }
          if (!['Mieux se connaître', 'Plonger dans le monde professionnel', 'Finaliser les projets'].includes(String(action.phase))) {
            errors.push(`filmAnnuelData.${lvlKey}.actions[${aIdx}].phase : phase invalide (${String(action.phase)}).`);
          }
        });
      }
    });
  }

  // 3. planStrategique & planificationBacBlanc
  if (!isRecord(value.planStrategique) || typeof value.planStrategique.title !== 'string' || typeof value.planStrategique.subtitle !== 'string') {
    errors.push('planStrategique : title et subtitle requis.');
  }
  if (
    !isRecord(value.planificationBacBlanc) ||
    typeof value.planificationBacBlanc.badge !== 'string' ||
    typeof value.planificationBacBlanc.title !== 'string' ||
    typeof value.planificationBacBlanc.description !== 'string'
  ) {
    errors.push('planificationBacBlanc : badge, title et description requis.');
  }

  // 4. restaurant
  if (!isRecord(value.restaurant)) {
    errors.push('restaurant : objet attendu.');
  } else {
    const restKeys = [
      'studentDistributionData',
      'restaurationInterestData',
      'currentLunchData',
      'serviceInterestByDayData',
      'mealTypePreferenceData',
      'priceForDishData',
      'priceForMenuData',
      'keyMetrics',
      'alertPoints',
    ];
    restKeys.forEach((key) => {
      const arr = value.restaurant && (value.restaurant as Record<string, unknown>)[key];
      if (!Array.isArray(arr)) {
        errors.push(`restaurant.${key} : tableau attendu.`);
        return;
      }
      arr.forEach((row, idx) => {
        if (!isRecord(row)) {
          errors.push(`restaurant.${key}[${idx}] : objet attendu.`);
          return;
        }
        if (typeof row.name !== 'string') {
          errors.push(`restaurant.${key}[${idx}].name : chaîne attendue.`);
        }
        const valOk =
          (typeof row.value === 'number' && Number.isFinite(row.value)) ||
          typeof row.value === 'string';
        if (!valOk) {
          errors.push(`restaurant.${key}[${idx}].value : nombre ou chaîne valide attendu (reçu ${String(row.value)}).`);
        }
        if ('percentage' in row && row.percentage !== undefined) {
          if (typeof row.percentage !== 'number' || !Number.isFinite(row.percentage)) {
            errors.push(`restaurant.${key}[${idx}].percentage : nombre fini attendu (reçu ${String(row.percentage)}).`);
          }
        }
      });
    });
  }

  // 5. psdTimelines
  if (!isRecord(value.psdTimelines)) {
    errors.push('psdTimelines : objet attendu.');
  } else {
    Object.entries(value.psdTimelines).forEach(([key, timeline]) => {
      if (!isRecord(timeline)) {
        errors.push(`psdTimelines.${key} : objet attendu.`);
        return;
      }
      if (!Number.isInteger(timeline.startYear) || !Number.isInteger(timeline.endYear) || Number(timeline.endYear) < Number(timeline.startYear)) {
        errors.push(`psdTimelines.${key} : startYear (${String(timeline.startYear)}) / endYear (${String(timeline.endYear)}) invalides.`);
      }
      if (!Array.isArray(timeline.actions)) {
        errors.push(`psdTimelines.${key}.actions : tableau attendu.`);
      } else {
        timeline.actions.forEach((action, aIdx) => {
          if (!isRecord(action)) {
            errors.push(`psdTimelines.${key}.actions[${aIdx}] : objet attendu.`);
            return;
          }
          if (typeof action.title !== 'string') errors.push(`psdTimelines.${key}.actions[${aIdx}].title : chaîne attendue.`);
          if (typeof action.description !== 'string') errors.push(`psdTimelines.${key}.actions[${aIdx}].description : chaîne attendue.`);
          if (
            !Number.isInteger(action.start) ||
            !Number.isInteger(action.end) ||
            Number(action.start) < Number(timeline.startYear) ||
            Number(action.end) > Number(timeline.endYear) ||
            Number(action.end) < Number(action.start)
          ) {
            errors.push(`psdTimelines.${key}.actions[${aIdx}] : période ${String(action.start)}-${String(action.end)} hors plage (${String(timeline.startYear)}-${String(timeline.endYear)}).`);
          }
        });
      }
    });
  }

  // 6. elcsData
  if (!isRecord(value.elcsData)) {
    errors.push('elcsData : objet attendu.');
  } else {
    ['satisfaction', 'relations', 'travail', 'securite'].forEach((catKey) => {
      const cat = (value.elcsData as Record<string, unknown>)[catKey];
      if (!isRecord(cat) || typeof cat.title !== 'string') {
        errors.push(`elcsData.${catKey} : titre manquant ou invalide.`);
        return;
      }
      ['primary', 'secondary'].forEach((group) => {
        const list = cat[group];
        if (!Array.isArray(list)) {
          errors.push(`elcsData.${catKey}.${group} : tableau attendu.`);
          return;
        }
        list.forEach((metric, mIdx) => {
          if (!isRecord(metric) || typeof metric.name !== 'string') {
            errors.push(`elcsData.${catKey}.${group}[${mIdx}] : name requis.`);
            return;
          }
          const valOk =
            (typeof metric.value === 'number' && Number.isFinite(metric.value)) ||
            typeof metric.value === 'string';
          if (!valOk) {
            errors.push(`elcsData.${catKey}.${group}[${mIdx}].value : valeur invalide (${String(metric.value)}).`);
          }
          if (metric.average !== undefined && (typeof metric.average !== 'number' || !Number.isFinite(metric.average))) {
            errors.push(`elcsData.${catKey}.${group}[${mIdx}].average : nombre fini attendu (reçu ${String(metric.average)}).`);
          }
        });
      });
    });
  }

  // 7. optional budgetData, transportData, psdAxesData, psdSurveyData
  if (value.budgetData !== undefined && !isRecord(value.budgetData)) {
    errors.push('budgetData : objet attendu.');
  }
  if (value.transportData !== undefined && !isRecord(value.transportData)) {
    errors.push('transportData : objet attendu.');
  }
  if (value.psdAxesData !== undefined && !isRecord(value.psdAxesData)) {
    errors.push('psdAxesData : objet attendu.');
  }
  if (value.psdSurveyData !== undefined && !isRecord(value.psdSurveyData)) {
    errors.push('psdSurveyData : objet attendu.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
