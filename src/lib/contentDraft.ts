export const isContentDraftPreview = () =>
  typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('draft') === '1' ||
    new URLSearchParams(window.location.search).get('edit') === '1'
  );

export const readContentDraft = <T,>(key: string, fallback: T): T => {
  if (!isContentDraftPreview()) return fallback;
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) as T : fallback;
  } catch {
    return fallback;
  }
};