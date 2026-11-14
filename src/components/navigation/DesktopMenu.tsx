import React from 'react';
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import DesktopNavItem from './DesktopNavItem';
import { normalizePageSlug, type ManagedPage } from '@/content/pageTypes';
import pagesFile from '@/content/pages.json';
import siteContent from '@/content/siteContent.json';
import { useContentDraft } from '@/lib/contentDraft';
import { usePublishedPages, usePublishedSiteContent } from '@/lib/publishedDataSync';
import { normalizeNavPath, resolveNavRubriques } from '@/data/navRubriques';
import type { HomeSectionContent } from '@/components/AdminHomeEditor';

interface DesktopMenuProps {
  isActive: (path: string) => boolean;
}

const DesktopMenu = ({ isActive }: DesktopMenuProps) => {
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
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="space-x-2">
        {navItems.map((item) => {
          const path = normalizeNavPath(item.path);
          return (
            <DesktopNavItem key={`${item.id}-${path}`} to={path} isActive={isActive(path)}>
              {item.label}
            </DesktopNavItem>
          );
        })}

        {managedNavigation.map((page) => (
          <DesktopNavItem key={page.slug} to={page.slug} isActive={isActive(page.slug)}>
            {page.menuLabel || page.title}
          </DesktopNavItem>
        ))}
        {childNavigation.map((page) => (
          <DesktopNavItem key={page.slug} to={page.slug} isActive={isActive(page.slug)}>
            <span className="text-xs">↳ {page.menuLabel || page.title}</span>
          </DesktopNavItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopMenu;
