export type ContentBlock =
  | { type: 'heading'; text: string; level?: 2 | 3 }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'gallery'; images: { src: string; alt: string }[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'list'; items: string[] }
  | { type: 'button'; label: string; href: string }
  | { type: 'divider' };

export interface ManagedPage {
  slug: string;
  title: string;
  parent?: string;
  description?: string;
  blocks: ContentBlock[];
}

export interface ManagedPagesFile {
  pages: ManagedPage[];
}
