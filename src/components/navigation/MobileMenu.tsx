import React from 'react';
import { cn } from '@/lib/utils';
import MobileNavItem from './MobileNavItem';
import { normalizePageSlug, type ManagedPage } from '@/content/pageTypes';
import pagesFile from '@/content/pages.json';
import siteContent from '@/content/siteContent.json';
import { useContentDraft } from '@/lib/contentDraft';
import { usePublishedPages, usePublishedSiteContent } from '@/lib/publishedDataSync';
import { normalizeNavPath, resolveNavRubriques } from '@/data/navRubriques';
import type { HomeSectionContent } from '@/components/AdminHomeEditor';

interface MobileMenuProps {
  id?: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isActive: (path: string) => boolean;
}

const MobileMenu = ({ id, mobileMenuOpen, setMobileMenuOpen, isActive }: MobileMenuProps) => {
  const publishedSiteContent = usePublishedSiteContent(siteContent as unknown as Record<string, unknown>);
  const currentContent = useContentDraft('lfjp-admin-draft', publishedSiteContent) as typeof siteContent & {
    home?: HomeSectionContent;
  };
  const navItems = resolveNavRubriques(currentContent?.home?.navItems);
  const navPathSet = new Set(navItems.map((item) => normalizeNavPath(item.path)));

  const publishedPages = usePublishedPages((pagesFile.pages || []) as ManagedPage[]);
  const draftPagesBundle = useContentDraft('lfjp-admin-pages-draft', {
    pages: publishedPages,
  }) as { pages?: ManagedPage[] };
  const draftPages = Array.isArray(draftPagesBundle?.pages) ? draftPagesBundle.pages : publishedPages;

  const managedNavigation = draftPages
    .filter(
      (page) =>
        page.showInNavigation !== false &&
        !page.parent &&
        !navPathSet.has(normalizePageSlug(page.slug))
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const childNavigation = draftPages
    .filter(
      (page) =>
        page.showInNavigation !== false &&
        Boolean(page.parent) &&
        !navPathSet.has(normalizePageSlug(page.slug))
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div
      id={id}
      aria-hidden={!mobileMenuOpen}
      className={cn(
        "fixed inset-y-0 right-0 transform w-64 bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out md:hidden",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col h-full pt-16 px-4">
        <button 
          className="absolute top-4 right-4 p-2 rounded-full text-french-blue hover:bg-blue-50"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Fermer menu"
        >
          &times;
        </button>
        
        {navItems.map((item) => {
          const path = normalizeNavPath(item.path);
          return (
            <MobileNavItem
              key={`${item.id}-${path}`}
              to={path}
              isActive={isActive(path)}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </MobileNavItem>
          );
        })}

        {managedNavigation.map((page) => (
          <MobileNavItem
            key={page.slug}
            to={page.slug}
            isActive={isActive(page.slug)}
            onClick={() => setMobileMenuOpen(false)}
          >
            {page.menuLabel || page.title}
          </MobileNavItem>
        ))}
        {childNavigation.map((page) => (
          <MobileNavItem
            key={page.slug}
            to={page.slug}
            isActive={isActive(page.slug)}
            onClick={() => setMobileMenuOpen(false)}
            className="ml-4 border-l-2 border-french-blue/20 pl-6 text-sm"
          >
            {page.menuLabel || page.title}
          </MobileNavItem>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
