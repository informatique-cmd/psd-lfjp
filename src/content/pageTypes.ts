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

export const validateManagedPages = (pages: ManagedPage[]) => {
  const errors: string[] = [];
  const slugs = new Set<string>();
  pages.forEach((page, index) => {
    const label = page.title.trim() || `Page ${index + 1}`;
    const slug = normalizePageSlug(page.slug);
    if (slug === '/') errors.push(`${label} : le chemin URL ne peut pas être la page d’accueil.`);
    if (slugs.has(slug)) errors.push(`${label} : le chemin URL "${slug}" est utilisé plusieurs fois.`);
    slugs.add(slug);
    if (!page.title.trim()) errors.push(`Page ${index + 1} : le titre est obligatoire.`);
    if (page.parent && !slugs.has(normalizePageSlug(page.parent)) && !pages.some((candidate) => normalizePageSlug(candidate.slug) === normalizePageSlug(page.parent))) {
      errors.push(`${label} : la page parente "${page.parent}" n’existe pas.`);
    }
    if (!page.blocks.length) errors.push(`${label} : ajoutez au moins un bloc de contenu.`);
    page.blocks.forEach((block, blockIndex) => {
      if (('src' in block && block.src && !/^https?:\/\//i.test(block.src) && !block.src.startsWith('/')) || ('href' in block && block.href && !/^https?:\/\//i.test(block.href) && !block.href.startsWith('/'))) {
        errors.push(`${label}, bloc ${blockIndex + 1} : utilisez une URL http(s) ou un chemin interne.`);
      }
      if (block.type === 'image' && !block.alt.trim()) errors.push(`${label}, bloc ${blockIndex + 1} : le texte alternatif de l’image est obligatoire.`);
      if (block.type === 'chart' && block.labels.length !== block.values.length) errors.push(`${label}, bloc ${blockIndex + 1} : le graphique doit avoir autant de valeurs que de libellés.`);
    });
  });
  return errors;
};
