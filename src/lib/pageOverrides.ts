import publishedOverrides from '@/content/pageText.json';
import { isContentDraftPreview } from '@/lib/contentDraft';

export interface PageElementOverride {
  text?: string;
  src?: string;
  alt?: string;
  href?: string;
}

export type PageTextOverrides = Record<string, Record<string, PageElementOverride>>;

export const pageTextDraftStorageKey = 'lfjp-admin-page-text-draft';

export const loadPageTextOverrides = (): PageTextOverrides => {
  const fallback = publishedOverrides as PageTextOverrides;
  if (!isContentDraftPreview()) return fallback;
  try {
    const saved = window.localStorage.getItem(pageTextDraftStorageKey);
    if (!saved) return fallback;
    const parsed: unknown = JSON.parse(saved);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? { ...fallback, ...parsed as PageTextOverrides }
      : fallback;
  } catch {
    return fallback;
  }
};

export const getNodePath = (root: Node, node: Node): string | null => {
  const indexes: number[] = [];
  let current: Node | null = node;
  while (current && current !== root) {
    const parent: Node | null = current.parentNode;
    if (!parent) return null;
    indexes.unshift(Array.prototype.indexOf.call(parent.childNodes, current) as number);
    current = parent;
  }
  return current === root ? indexes.join('.') : null;
};

export const resolveNodePath = (root: Node, path: string): Node | null => {
  if (!path) return root;
  return path.split('.').reduce<Node | null>((node, index) => node?.childNodes[Number(index)] || null, root);
};

export const applyPageTextOverrides = (root: HTMLElement, pathname: string, overrides: PageTextOverrides) => {
  Object.entries(overrides[pathname] || {}).forEach(([path, override]) => {
    const node = resolveNodePath(root, path);
    if (!node) return;
    if (override.text !== undefined && node.nodeType === Node.TEXT_NODE && node.textContent !== override.text) {
      node.textContent = override.text;
    }
    if (node instanceof HTMLImageElement) {
      if (override.src !== undefined && node.getAttribute('src') !== override.src) node.setAttribute('src', override.src);
      if (override.alt !== undefined && node.alt !== override.alt) node.alt = override.alt;
    }
    if (node instanceof HTMLAnchorElement && override.href !== undefined && node.getAttribute('href') !== override.href) {
      node.setAttribute('href', override.href);
    }
  });
};