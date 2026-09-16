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
