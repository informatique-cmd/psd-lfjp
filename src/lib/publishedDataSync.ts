import { useEffect, useState } from 'react';
import { sanitizePageData } from '@/lib/pageDataSanitizer';

let cachedPublishedPageData: Record<string, unknown> | null = null;
let cachedPublishedSiteContent: Record<string, unknown> | null = null;
let inFlightPromise: Promise<{
  pageData: Record<string, unknown> | null;
  siteContent: Record<string, unknown> | null;
}> | null = null;

export const invalidatePublishedPageDataCache = () => {
  cachedPublishedPageData = null;
  cachedPublishedSiteContent = null;
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

export const setPublishedSiteContentCache = (raw: unknown) => {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    cachedPublishedSiteContent = raw as Record<string, unknown>;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('lfjp_published_site_content_loaded', { detail: cachedPublishedSiteContent })
      );
    }
  }
};

const fetchAllPublishedBundle = async (
  force = false
): Promise<{
  pageData: Record<string, unknown> | null;
  siteContent: Record<string, unknown> | null;
}> => {
  if (!force && (cachedPublishedPageData || cachedPublishedSiteContent)) {
    return {
      pageData: cachedPublishedPageData,
      siteContent: cachedPublishedSiteContent,
    };
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
      if (!res.ok) return { pageData: null, siteContent: null };
      const json = (await res.json()) as { pageData?: unknown; siteContent?: unknown };

      let nextPageData: Record<string, unknown> | null = null;
      let nextSiteContent: Record<string, unknown> | null = null;

      if (json?.pageData && typeof json.pageData === 'object' && !Array.isArray(json.pageData)) {
        nextPageData = sanitizePageData(json.pageData);
        cachedPublishedPageData = nextPageData;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('lfjp_published_data_loaded', { detail: nextPageData })
          );
        }
      }

      if (json?.siteContent && typeof json.siteContent === 'object' && !Array.isArray(json.siteContent)) {
        nextSiteContent = json.siteContent as Record<string, unknown>;
        cachedPublishedSiteContent = nextSiteContent;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('lfjp_published_site_content_loaded', { detail: nextSiteContent })
          );
        }
      }

      return { pageData: nextPageData, siteContent: nextSiteContent };
    } catch {
      return { pageData: null, siteContent: null };
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
};

export const fetchLatestPublishedPageData = async (
  force = false
): Promise<Record<string, unknown> | null> => {
  const bundle = await fetchAllPublishedBundle(force);
  return bundle.pageData;
};

export const fetchLatestPublishedSiteContent = async (
  force = false
): Promise<Record<string, unknown> | null> => {
  const bundle = await fetchAllPublishedBundle(force);
  return bundle.siteContent;
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

export const usePublishedSiteContent = <T extends Record<string, unknown>>(fallback: T): T => {
  const [published, setPublished] = useState<Record<string, unknown> | null>(
    () => cachedPublishedSiteContent
  );

  useEffect(() => {
    let active = true;
    const handleLoaded = (e: Event) => {
      const detail = (e as CustomEvent<Record<string, unknown>>).detail;
      if (active && detail && typeof detail === 'object') {
        setPublished(detail);
      }
    };
    window.addEventListener('lfjp_published_site_content_loaded', handleLoaded);
    fetchLatestPublishedSiteContent().then((data) => {
      if (active && data) {
        setPublished(data);
      }
    });
    return () => {
      active = false;
      window.removeEventListener('lfjp_published_site_content_loaded', handleLoaded);
    };
  }, []);

  if (!published) return fallback;
  return { ...fallback, ...published } as T;
};
