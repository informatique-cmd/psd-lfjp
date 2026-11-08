import { useEffect, useState } from 'react';
import { APP_BUILD_VERSION } from '@/config/buildVersion';

export const isContentDraftPreview = () =>
  typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('draft') === '1' ||
    new URLSearchParams(window.location.search).get('edit') === '1' ||
    window.location.pathname.startsWith('/espace-direction') ||
    window.sessionStorage.getItem('lfjp-preview-mode') === '1' ||
    window.sessionStorage.getItem('lfjp_preview_active') === '1'
  );

export const clearAllDraftStorage = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem('lfjp-admin-draft');
    window.localStorage.removeItem('lfjp-admin-pages-draft');
    window.localStorage.removeItem('lfjp-admin-page-data-draft');
    window.localStorage.removeItem('lfjp-admin-page-text-draft');
    window.localStorage.removeItem('lfjp-admin-rubriques-v3');
    window.localStorage.removeItem('lfjp-admin-rubriques-v4');
    window.localStorage.removeItem('lfjp-admin-rubriques-v5');
    window.localStorage.removeItem('lfjp_preview_active');
    window.sessionStorage.removeItem('lfjp-preview-mode');
    window.sessionStorage.removeItem('lfjp_preview_active');
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('lfjp_draft_cleared'));
  } catch {
    // ignore
  }
};

export const readContentDraft = <T,>(key: string, fallback: T): T => {
  if (!isContentDraftPreview()) return fallback;
  try {
    const storedVersion = window.localStorage.getItem('lfjp_app_build_version');
    if (storedVersion !== APP_BUILD_VERSION) {
      // Discard outdated drafts on version bump
      clearAllDraftStorage();
      window.localStorage.setItem('lfjp_app_build_version', APP_BUILD_VERSION);
      return fallback;
    }
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