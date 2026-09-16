export type ContentBlock =
  | { type: 'heading'; text: string; level?: 2 | 3 }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'gallery'; images: { src: string; alt: string }[] }
  | { type: 'video'; src: string; title?: string }
  | { type: 'embed'; src: string; title: string; height?: number }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; title: string; text: string; tone?: 'blue' | 'gold' | 'green' }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'chart'; title?: string; labels: string[]; values: number[] }
  | { type: 'button'; label: string; href: string }
  | { type: 'divider' };

export interface ManagedPage {
  slug: string;
  title: string;
  parent?: string;
  description?: string;
  menuLabel?: string;
  showInNavigation?: boolean;
  order?: number;
  blocks: ContentBlock[];
}

export interface ManagedPagesFile {
  pages: ManagedPage[];
}

export const normalizePageSlug = (slug: string) => {
  const trimmed = slug.trim();
  if (!trimmed) return '/';
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}`;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string');
const isNumberArray = (value: unknown): value is number[] => Array.isArray(value) && value.every((item) => typeof item === 'number' && Number.isFinite(item));

export const isValidContentBlock = (value: unknown): value is ContentBlock => {
  if (!isRecord(value) || typeof value.type !== 'string') return false;
  switch (value.type) {
    case 'heading':
      return typeof value.text === 'string' && (value.level === undefined || value.level === 2 || value.level === 3);
    case 'paragraph':
      return typeof value.text === 'string';
    case 'image':
      return typeof value.src === 'string' && typeof value.alt === 'string' && (value.caption === undefined || typeof value.caption === 'string');
    case 'gallery':
      return Array.isArray(value.images) && value.images.every((image) => isRecord(image) && typeof image.src === 'string' && typeof image.alt === 'string');
    case 'video':
      return typeof value.src === 'string' && (value.title === undefined || typeof value.title === 'string');
    case 'embed':
      return typeof value.src === 'string' && typeof value.title === 'string' && (value.height === undefined || typeof value.height === 'number');
    case 'quote':
      return typeof value.text === 'string' && (value.author === undefined || typeof value.author === 'string');
    case 'list':
      return isStringArray(value.items);
    case 'callout':
      return typeof value.title === 'string' && typeof value.text === 'string' && (value.tone === undefined || value.tone === 'blue' || value.tone === 'gold' || value.tone === 'green');
    case 'table':
      return isStringArray(value.headers) && Array.isArray(value.rows) && value.rows.every(isStringArray);
    case 'chart':
      return isStringArray(value.labels) && isNumberArray(value.values) && (value.title === undefined || typeof value.title === 'string');
    case 'button':
      return typeof value.label === 'string' && typeof value.href === 'string';
    case 'divider':
      return true;
    default:
      return false;
  }
};

export const isValidManagedPage = (value: unknown): value is ManagedPage =>
  isRecord(value) &&
  typeof value.slug === 'string' &&
  typeof value.title === 'string' &&
  Array.isArray(value.blocks) &&
  value.blocks.every(isValidContentBlock);

export const validateManagedPages = (pages: ManagedPage[]) => {
  const errors: string[] = [];
  const slugs = new Set<string>();
  pages.forEach((page, index) => {
    const label = page.title.trim() || `Page ${index + 1}`;
    const slug = normalizePageSlug(page.slug);
    if (!isValidManagedPage(page)) {
      errors.push(`${label} : la structure de la page ou d’un bloc est invalide.`);
      return;
    }
    if (slug === '/') errors.push(`${label} : le chemin URL ne peut pas être la page d’accueil.`);
    if (slugs.has(slug)) errors.push(`${label} : le chemin URL "${slug}" est utilisé plusieurs fois.`);
    slugs.add(slug);
    if (!page.title.trim()) errors.push(`Page ${index + 1} : le titre est obligatoire.`);
    if (page.parent && !slugs.has(normalizePageSlug(page.parent)) && !pages.some((candidate) => normalizePageSlug(candidate.slug) === normalizePageSlug(page.parent))) {
      errors.push(`${label} : la page parente "${page.parent}" n’existe pas.`);
    }
    if (!page.blocks.length) errors.push(`${label} : ajoutez au moins un bloc de contenu.`);
    page.blocks.forEach((block, blockIndex) => {
      const urls = [
        ...('src' in block ? [block.src] : []),
        ...('href' in block ? [block.href] : []),
        ...(block.type === 'gallery' ? block.images.map((image) => image.src) : []),
      ];
      if (urls.some((url) => url && !/^https?:\/\//i.test(url) && !url.startsWith('/'))) {
        errors.push(`${label}, bloc ${blockIndex + 1} : utilisez une URL http(s) ou un chemin interne.`);
      }
      if (block.type === 'image' && !block.alt.trim()) errors.push(`${label}, bloc ${blockIndex + 1} : le texte alternatif de l’image est obligatoire.`);
      if (block.type === 'chart' && block.labels.length !== block.values.length) errors.push(`${label}, bloc ${blockIndex + 1} : le graphique doit avoir autant de valeurs que de libellés.`);
    });
  });
  pages.forEach((page) => {
    const visited = new Set<string>([normalizePageSlug(page.slug)]);
    let parent = page.parent ? normalizePageSlug(page.parent) : undefined;
    while (parent) {
      if (visited.has(parent)) {
        errors.push(`${page.title || page.slug} : la hiérarchie des pages contient une boucle.`);
        break;
      }
      visited.add(parent);
      parent = pages.find((candidate) => normalizePageSlug(candidate.slug) === parent)?.parent;
      parent = parent ? normalizePageSlug(parent) : undefined;
    }
  });
  return errors;
};
