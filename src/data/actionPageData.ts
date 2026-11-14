import type { PsdAxesData, PsdAxisKey } from './psdAxesData';

export interface ActionPageKpi {
  label: string;
  value: string;
  subtitle: string;
}

export interface ActionPageIndicator {
  name: string;
  currentRate: number;
  targetRate: number;
  unit: string;
  status: 'Planifié' | 'En cours' | 'Avancé' | 'Objectif atteint';
}

export interface ActionPageTimelineStep {
  period: string;
  phase: string;
  description: string;
}

export interface ActionDetailPageData {
  slug: string;
  axisKey: PsdAxisKey;
  rubriqueTitle: string;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  budgetMillions: number;
  period: string;
  kpis: ActionPageKpi[];
  objectives: string[];
  highlights: string[];
  steps: ActionPageTimelineStep[];
  indicators: ActionPageIndicator[];
}

export type ActionPagesMap = Record<string, ActionDetailPageData>;

const AXIS_LABELS: Record<PsdAxisKey, string> = {
  axe1: 'Axe 1 · Bien-être et expérience de la communauté',
  axe2: 'Axe 2 · Plurilinguisme & ouverture internationale',
  axe3: 'Axe 3 · Digital, numérique & innovation',
  axe4: 'Axe 4 · Façonner les réussites',
};

export const slugifyActionSegment = (label: string): string => {
  const normalized = (label || 'nouvelle-action')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || 'nouvelle-action';
};

export const normalizeActionSlug = (rawSlug: string): string => {
  const trimmed = (rawSlug || '').trim().split('#')[0].split('?')[0];
  if (!trimmed) return '/actions/nouvelle-action';
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, '') || '/actions/nouvelle-action';
};

export const collectExistingActionLinks = (
  psdAxesData: PsdAxesData,
  actionPages?: ActionPagesMap
): Set<string> => {
  const links = new Set<string>();
  (['axe1', 'axe2', 'axe3', 'axe4'] as const).forEach((k) => {
    const sections = psdAxesData[k]?.actionSections || [];
    sections.forEach((sec) => {
      sec.items.forEach((it) => {
        if (it.link && it.link.trim()) {
          links.add(normalizeActionSlug(it.link));
        }
      });
    });
  });
  if (actionPages) {
    Object.keys(actionPages).forEach((k) => {
      links.add(normalizeActionSlug(k));
    });
  }
  return links;
};

export const generateUniqueActionLink = (
  label: string,
  existingLinks: Set<string>
): string => {
  const baseSlug = slugifyActionSegment(label);
  let candidate = `/actions/${baseSlug}`;
  let counter = 2;
  while (existingLinks.has(candidate)) {
    candidate = `/actions/${baseSlug}-${counter}`;
    counter += 1;
  }
  existingLinks.add(candidate);
  return candidate;
};

export const buildDefaultActionPage = (opts: {
  slug: string;
  axisKey: PsdAxisKey;
  rubriqueTitle: string;
  title: string;
}): ActionDetailPageData => {
  const normalizedSlug = normalizeActionSlug(opts.slug);
  const title = opts.title.trim() || 'Nouvelle action';
  const rubriqueTitle = opts.rubriqueTitle.trim() || 'Rubrique du Plan Stratégique';
  return {
    slug: normalizedSlug,
    axisKey: opts.axisKey,
    rubriqueTitle,
    title,
    badge: rubriqueTitle,
    subtitle: `Feuille de route opérationnelle · ${AXIS_LABELS[opts.axisKey] || 'Plan Stratégique LFJP'}`,
    description:
      `Cette action s'inscrit dans la rubrique « ${rubriqueTitle} » du Plan Stratégique de Développement 2026–2030 du Lycée Français Jacques Prévert de Saly. Elle vise à structurer des réalisations concrètes, mesurables et concertées avec l'ensemble de la communauté éducative.`,
    budgetMillions: 0,
    period: '2026 – 2030',
    kpis: [
      {
        label: 'Avancement global',
        value: '20 %',
        subtitle: 'Phase de cadrage et lancement',
      },
      {
        label: 'Public concerné',
        value: 'Communauté LFJP',
        subtitle: 'Élèves, équipes & familles',
      },
      {
        label: 'Pilotage',
        value: 'Commission PSD & APE',
        subtitle: 'Suivi annuel et indicateurs dédiés',
      },
    ],
    objectives: [
      `Déployer l'action « ${title} » en cohérence avec les priorités du Plan Stratégique 2026–2030.`,
      'Impliquer les équipes pédagogiques, les élèves et les représentants des familles à chaque étape.',
      'Suivre l’impact concret grâce à des indicateurs chiffrés révisés chaque année scolaire.',
    ],
    highlights: [
      'Amélioration mesurable de l’expérience et du quotidien des élèves au LFJP.',
      'Transparence budgétaire et calendrier partagé avec la communauté éducative.',
      'Alignement avec les standards du réseau AEFE et le projet d’établissement.',
    ],
    steps: [
      {
        period: '2026',
        phase: 'Cadrage & concertation',
        description: 'Définition du périmètre, recueil des besoins et validation des jalons.',
      },
      {
        period: '2027 – 2028',
        phase: 'Déploiement progressif',
        description: 'Mise en œuvre opérationnelle et premiers retours d’expérience.',
      },
      {
        period: '2029 – 2030',
        phase: 'Pérennisation & bilan',
        description: 'Généralisation, évaluation d’impact et ajustements continus.',
      },
    ],
    indicators: [
      {
        name: 'Taux de mise en œuvre des jalons',
        currentRate: 20,
        targetRate: 100,
        unit: '%',
        status: 'En cours',
      },
      {
        name: 'Satisfaction de la communauté éducative',
        currentRate: 75,
        targetRate: 90,
        unit: '%',
        status: 'Planifié',
      },
    ],
  };
};

export const resolveActionPage = (
  actionPages: ActionPagesMap | undefined,
  psdAxesData: PsdAxesData,
  pathnameOrSlug: string
): ActionDetailPageData | null => {
  const normalizedPath = normalizeActionSlug(
    pathnameOrSlug.startsWith('/') ? pathnameOrSlug : `/actions/${pathnameOrSlug}`
  );
  const pagesMap = actionPages || {};

  if (pagesMap[normalizedPath]) {
    return pagesMap[normalizedPath];
  }

  // Case-insensitive or trailing-slug match in actionPages
  const directMatch = Object.values(pagesMap).find(
    (entry) => normalizeActionSlug(entry.slug) === normalizedPath
  );
  if (directMatch) return directMatch;

  // Match against any action item inside psdAxesData
  for (const axisKey of ['axe1', 'axe2', 'axe3', 'axe4'] as const) {
    const sections = psdAxesData[axisKey]?.actionSections || [];
    for (const sec of sections) {
      for (const item of sec.items || []) {
        const itemLink = item.link
          ? normalizeActionSlug(item.link)
          : `/actions/${slugifyActionSegment(item.label)}`;
        if (
          itemLink === normalizedPath ||
          `/actions/${slugifyActionSegment(item.label)}` === normalizedPath
        ) {
          return buildDefaultActionPage({
            slug: itemLink,
            axisKey,
            rubriqueTitle: sec.title,
            title: item.label,
          });
        }
      }
    }
  }

  // If explicitly under /actions/:slug, return a clean synthesized fallback so dynamic links never 404
  if (normalizedPath.startsWith('/actions/')) {
    const rawTitle = normalizedPath
      .replace(/^\/actions\//, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return buildDefaultActionPage({
      slug: normalizedPath,
      axisKey: 'axe1',
      rubriqueTitle: 'Action du Plan Stratégique',
      title: rawTitle || 'Nouvelle action',
    });
  }

  return null;
};
