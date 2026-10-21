import { useEffect, useState } from 'react';

export const isContentDraftPreview = () =>
  typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('draft') === '1' ||
    new URLSearchParams(window.location.search).get('edit') === '1' ||
    window.sessionStorage.getItem('lfjp-preview-mode') === '1' ||
    window.localStorage.getItem('lfjp_preview_active') === '1' ||
    Boolean(window.localStorage.getItem('lfjp-admin-draft'))
  );

export const readContentDraft = <T,>(key: string, fallback: T): T => {
  if (!isContentDraftPreview()) return fallback;
  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed: unknown = JSON.parse(saved);
    if (typeof fallback === 'object' && fallback !== null && typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...fallback, ...parsed } as T;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
};

export const useContentDraft = <T,>(key: string, fallback: T): T => {
  const [value, setValue] = useState(() => readContentDraft(key, fallback));
  useEffect(() => {
    const refresh = (event: StorageEvent) => {
      if (event.key === key || event.key === null) setValue(readContentDraft(key, fallback));
    };
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [fallback, key]);
  return value;
};