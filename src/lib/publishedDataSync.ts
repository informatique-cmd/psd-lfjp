import { useEffect, useState } from 'react';
import { sanitizePageData } from '@/lib/pageDataSanitizer';

let cachedPublishedPageData: Record<string, unknown> | null = null;
let inFlightPromise: Promise<Record<string, unknown> | null> | null = null;

export const invalidatePublishedPageDataCache = () => {
  cachedPublishedPageData = null;
  inFlightPromise = null;
};

export const setPublishedPageDataCache = (raw: unknown) => {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    cachedPublishedPageData = sanitizePageData(raw);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('lfjp_published_data_loaded', { detail: cachedPublishedPageData })
      );
    }
  }
};

export const fetchLatestPublishedPageData = async (
  force = false
): Promise<Record<string, unknown> | null> => {
  if (!force && cachedPublishedPageData) {
    return cachedPublishedPageData;
  }
  if (!force && inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`/api/content/published?t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) return null;
      const json = (await res.json()) as { pageData?: unknown };
      if (json?.pageData && typeof json.pageData === 'object' && !Array.isArray(json.pageData)) {
        const sanitized = sanitizePageData(json.pageData);
        cachedPublishedPageData = sanitized;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('lfjp_published_data_loaded', { detail: sanitized })
          );
        }
        return sanitized;
      }
      return null;
    } catch {
      return null;
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
};

export const usePublishedPageData = <T extends Record<string, unknown>>(fallback: T): T => {
  const [published, setPublished] = useState<Record<string, unknown> | null>(
    () => cachedPublishedPageData
  );

  useEffect(() => {
    let active = true;
    const handleLoaded = (e: Event) => {
      const detail = (e as CustomEvent<Record<string, unknown>>).detail;
      if (active && detail && typeof detail === 'object') {
        setPublished(detail);
      }
    };
    window.addEventListener('lfjp_published_data_loaded', handleLoaded);
    fetchLatestPublishedPageData().then((data) => {
      if (active && data) {
        setPublished(data);
      }
    });
    return () => {
      active = false;
      window.removeEventListener('lfjp_published_data_loaded', handleLoaded);
    };
  }, []);

  if (!published) return fallback;
  return { ...fallback, ...published } as T;
};
