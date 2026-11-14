import type { ManagedPage } from '@/content/pageTypes';

export interface NavRubriqueItem {
  id: string;
  label: string;
  path: string;
  isProtected?: boolean;
}

export const defaultNavRubriques: NavRubriqueItem[] = [
  { id: 'accueil', label: 'Accueil', path: '/', isProtected: true },
  { id: 'methode', label: 'Méthode', path: '/methode' },
  { id: 'vision', label: 'Vision & Valeurs', path: '/vision-missions-valeurs' },
  { id: 'diagnostic', label: 'Diagnostic', path: '/diagnostic' },
  { id: 'plan-strategique', label: 'Plan Stratégique', path: '/plan-strategique' },
];

export const normalizeNavPath = (path: string): string => {
  const trimmed = String(path || '').trim();
  if (!trimmed || trimmed === '/') return '/';
  const cleaned = trimmed.replace(/^\/+|\/+$/g, '');
  return cleaned ? `/${cleaned}` : '/';
};

export const slugifyNavSegment = (text: string): string => {
  const normalized = String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || 'rubrique';
};

export const generateUniqueNavPath = (
  label: string,
  existingItems: NavRubriqueItem[],
  existingPages: ManagedPage[] = []
): string => {
  const used = new Set<string>([
    '/',
    '/methode',
    '/vision-missions-valeurs',
    '/diagnostic',
    '/plan-strategique',
    '/espace-direction',
    '/admin',
    ...existingItems.map((it) => normalizeNavPath(it.path)),
    ...existingPages.map((p) => normalizeNavPath(p.slug)),
  ]);
  const base = slugifyNavSegment(label);
  let candidate = `/${base}`;
  let idx = 2;
  while (used.has(candidate)) {
    candidate = `/${base}-${idx}`;
    idx += 1;
  }
  return candidate;
};

export const resolveNavRubriques = (rawNavItems: unknown): NavRubriqueItem[] => {
  if (!Array.isArray(rawNavItems) || rawNavItems.length === 0) {
    return defaultNavRubriques.map((item) => ({ ...item }));
  }
  const seenPaths = new Set<string>();
  const cleaned: NavRubriqueItem[] = [];
  rawNavItems.forEach((raw, idx) => {
    if (!raw || typeof raw !== 'object') return;
    const item = raw as Partial<NavRubriqueItem>;
    const path = normalizeNavPath(typeof item.path === 'string' ? item.path : '/');
    if (seenPaths.has(path)) return;
    seenPaths.add(path);
    cleaned.push({
      id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : `nav-${idx + 1}`,
      label: typeof item.label === 'string' && item.label.trim() ? item.label : 'Rubrique',
      path,
      isProtected: path === '/' || item.isProtected === true,
    });
  });

  if (!seenPaths.has('/')) {
    cleaned.unshift({ ...defaultNavRubriques[0] });
  }
  return cleaned;
};

export const buildDefaultRubriquePage = (
  label: string,
  path: string,
  order = 10
): ManagedPage => ({
  slug: normalizeNavPath(path),
  title: label,
  menuLabel: label,
  description: `Présentation et contenus détaillés de la rubrique ${label}.`,
  showInNavigation: true,
  order,
  blocks: [
    { type: 'heading', level: 2, text: `Présentation · ${label}` },
    {
      type: 'paragraph',
      text: `Cette page dédiée à « ${label} » est prête à être complétée depuis son Espace Éditeur. Ajoutez des sections, des paragraphes, des listes ou des encadrés selon vos besoins.`,
    },
    {
      type: 'callout',
      title: 'Points clés de la rubrique',
      text: 'Utilisez l’Espace Éditeur en haut de la page pour personnaliser le titre, ajouter de nouvelles sections ou modifier les blocs existants.',
      tone: 'blue',
    },
  ],
});
