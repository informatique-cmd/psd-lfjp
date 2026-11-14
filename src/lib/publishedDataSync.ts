import { useEffect, useState } from 'react';
import { sanitizePageData } from '@/lib/pageDataSanitizer';
import type { ManagedPage } from '@/content/pageTypes';

let cachedPublishedPageData: Record<string, unknown> | null = null;
let cachedPublishedSiteContent: Record<string, unknown> | null = null;
let cachedPublishedPages: ManagedPage[] | null = null;
let inFlightPromise: Promise<{
  pageData: Record<string, unknown> | null;
  siteContent: Record<string, unknown> | null;
  pages: ManagedPage[] | null;
}> | null = null;

export const invalidatePublishedPageDataCache = () => {
  cachedPublishedPageData = null;
  cachedPublishedSiteContent = null;
  cachedPublishedPages = null;
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

export const setPublishedPagesCache = (raw: unknown) => {
  if (Array.isArray(raw)) {
    cachedPublishedPages = raw as ManagedPage[];
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('lfjp_published_pages_loaded', { detail: cachedPublishedPages })
      );
    }
  }
};

const fetchAllPublishedBundle = async (
  force = false
): Promise<{
  pageData: Record<string, unknown> | null;
  siteContent: Record<string, unknown> | null;
  pages: ManagedPage[] | null;
}> => {
  if (!force && (cachedPublishedPageData || cachedPublishedSiteContent || cachedPublishedPages)) {
    return {
      pageData: cachedPublishedPageData,
      siteContent: cachedPublishedSiteContent,
      pages: cachedPublishedPages,
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
      if (!res.ok) return { pageData: null, siteContent: null, pages: null };
      const json = (await res.json()) as {
        pageData?: unknown;
        siteContent?: unknown;
        pages?: unknown;
      };

      let nextPageData: Record<string, unknown> | null = null;
      let nextSiteContent: Record<string, unknown> | null = null;
      let nextPages: ManagedPage[] | null = null;

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

      if (Array.isArray(json?.pages)) {
        nextPages = json.pages as ManagedPage[];
        cachedPublishedPages = nextPages;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('lfjp_published_pages_loaded', { detail: nextPages })
          );
        }
      }

      return { pageData: nextPageData, siteContent: nextSiteContent, pages: nextPages };
    } catch {
      return { pageData: null, siteContent: null, pages: null };
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

export const fetchLatestPublishedPages = async (
  force = false
): Promise<ManagedPage[] | null> => {
  const bundle = await fetchAllPublishedBundle(force);
  return bundle.pages;
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

export const usePublishedPages = (fallback: ManagedPage[]): ManagedPage[] => {
  const [published, setPublished] = useState<ManagedPage[] | null>(() => cachedPublishedPages);

  useEffect(() => {
    let active = true;
    const handleLoaded = (e: Event) => {
      const detail = (e as CustomEvent<ManagedPage[]>).detail;
      if (active && Array.isArray(detail)) {
        setPublished(detail);
      }
    };
    window.addEventListener('lfjp_published_pages_loaded', handleLoaded);
    fetchLatestPublishedPages().then((data) => {
      if (active && Array.isArray(data)) {
        setPublished(data);
      }
    });
    return () => {
      active = false;
      window.removeEventListener('lfjp_published_pages_loaded', handleLoaded);
    };
  }, []);

  return published || fallback;
};
