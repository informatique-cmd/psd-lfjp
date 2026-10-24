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

const XOF_TO_EUR_RATE = 655.957;

const parseCurrencyText = (text: string): { amount: number; currency: 'XOF' | 'EUR' } | null => {
  const trimmed = text.trim();
  const hasXof = /F\s*CFA|FCFA|CFA|XOF/i.test(trimmed);
  const hasEuro = /[€]|EUR/i.test(trimmed);
  if (!hasXof && !hasEuro) return null;

  const digits = trimmed.replace(/[^0-9]/g, '');
  if (!digits) return null;
  const num = parseInt(digits, 10);
  if (isNaN(num) || num <= 0) return null;

  return {
    amount: num,
    currency: hasEuro ? 'EUR' : 'XOF',
  };
};

const detectTargetCurrency = (node: Node): 'XOF' | 'EUR' => {
  const el = node instanceof Element ? node : node.parentElement;
  if (!el) return 'XOF';
  const currencyContainer = el.closest('[data-currency]');
  if (currencyContainer) {
    const val = currencyContainer.getAttribute('data-currency');
    if (val === 'EUR' || val === 'XOF') return val;
  }
  const eurBtn = document.querySelector('button[aria-pressed="true"]');
  if (eurBtn && /EUR|Euro/i.test(eurBtn.textContent || '')) {
    return 'EUR';
  }
  if (node.textContent && /[€]/.test(node.textContent)) {
    return 'EUR';
  }
  return 'XOF';
};

const formatConvertedCurrency = (amount: number, fromCurrency: 'XOF' | 'EUR', targetCurrency: 'XOF' | 'EUR'): string => {
  let valueInTarget: number;
  if (fromCurrency === targetCurrency) {
    valueInTarget = amount;
  } else if (fromCurrency === 'XOF' && targetCurrency === 'EUR') {
    valueInTarget = Math.round(amount / XOF_TO_EUR_RATE);
  } else {
    valueInTarget = Math.round(amount * XOF_TO_EUR_RATE);
  }

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: targetCurrency,
    maximumFractionDigits: 0,
  }).format(valueInTarget);
};

export const applyPageTextOverrides = (root: HTMLElement, pathname: string, overrides: PageTextOverrides) => {
  Object.entries(overrides[pathname] || {}).forEach(([path, override]) => {
    let node = resolveNodePath(root, path);
    if (!node && override.text) {
      // Fallback: If node not found at index path (e.g. slight cross-browser DOM variation),
      // look for matching element by data-cms-key or data-currency-amount
      const parsed = parseCurrencyText(override.text);
      if (parsed) {
        const el = root.querySelector('[data-cms-key="project-budget-proj-clim"], [data-currency-amount]');
        if (el) {
          const textChild = Array.from(el.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
          if (textChild) node = textChild;
        }
      }
    }
    if (!node) return;
    if (override.text !== undefined && node.nodeType === Node.TEXT_NODE) {
      let nextText = override.text;
      const parsed = parseCurrencyText(override.text);
      if (parsed) {
        const targetCurrency = detectTargetCurrency(node);
        nextText = formatConvertedCurrency(parsed.amount, parsed.currency, targetCurrency);
      } else {
        const parentEl = node.parentElement;
        const currencyAttr = parentEl?.getAttribute('data-currency-amount');
        if (currencyAttr) {
          const baseAmount = parseInt(currencyAttr, 10);
          if (!isNaN(baseAmount) && baseAmount > 0) {
            const userNum = parseInt(override.text.replace(/[^0-9]/g, ''), 10);
            const amountToUse = !isNaN(userNum) && userNum > 0 ? userNum : baseAmount;
            const targetCurrency = detectTargetCurrency(node);
            nextText = formatConvertedCurrency(amountToUse, 'XOF', targetCurrency);
          }
        }
      }

      if (node.textContent !== nextText) {
        node.textContent = nextText;
      }
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