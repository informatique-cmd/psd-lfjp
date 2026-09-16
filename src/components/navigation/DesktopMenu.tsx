import React from 'react';
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import DesktopNavItem from './DesktopNavItem';
import pagesFile from '@/content/pages.json';
import { isValidManagedPage, type ManagedPage } from '@/content/pageTypes';

const draftPages = new URLSearchParams(window.location.search).get('draft') === '1'
  ? (() => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem('lfjp-admin-pages-draft') || '{}') as { pages?: unknown };
        return Array.isArray(parsed.pages) ? parsed.pages.filter(isValidManagedPage) : pagesFile.pages;
      } catch {
        return pagesFile.pages;
      }
    })()
  : pagesFile.pages;
const managedNavigation = (draftPages as ManagedPage[])
  .filter((page) => page.showInNavigation !== false && !page.parent)
  .sort((a, b) => (a.order || 0) - (b.order || 0));
const childNavigation = (draftPages as ManagedPage[])
  .filter((page) => page.showInNavigation !== false && page.parent)
  .sort((a, b) => (a.order || 0) - (b.order || 0));

interface DesktopMenuProps {
  isActive: (path: string) => boolean;
}

const DesktopMenu = ({ isActive }: DesktopMenuProps) => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="space-x-2">
        <DesktopNavItem to="/" isActive={isActive('/')}> 
          Accueil
        </DesktopNavItem>

        <DesktopNavItem to="/methode" isActive={isActive('/methode')}>
          Méthode
        </DesktopNavItem>

        <DesktopNavItem to="/vision-missions-valeurs" isActive={isActive('/vision-missions-valeurs')}>
          Vision & Valeurs
        </DesktopNavItem>

        <DesktopNavItem to="/diagnostic" isActive={isActive('/diagnostic')}>
          Diagnostic
        </DesktopNavItem>

        <DesktopNavItem to="/plan-strategique" isActive={isActive('/plan-strategique')}>
          Plan Stratégique
        </DesktopNavItem>

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
