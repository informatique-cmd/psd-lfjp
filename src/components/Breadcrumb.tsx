import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import routesData from "@/data/breadcrumbRoutes.json";
import { Home } from 'lucide-react';
import pagesFile from '@/content/pages.json';
import { isValidManagedPage, type ManagedPage } from '@/content/pageTypes';

interface RouteMap {
  [key: string]: {
    name: string;
    parent?: string;
  };
}

const routes: RouteMap = routesData;
const managedPages: ManagedPage[] = (() => {
  if (new URLSearchParams(window.location.search).get('draft') !== '1') return pagesFile.pages as ManagedPage[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem('lfjp-admin-pages-draft') || '{}') as { pages?: unknown };
    return Array.isArray(parsed.pages) ? parsed.pages.filter(isValidManagedPage) : pagesFile.pages as ManagedPage[];
  } catch {
    return pagesFile.pages as ManagedPage[];
  }
})();

const BreadcrumbNav = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Si nous sommes sur la page d'accueil, ne pas afficher le fil d'Ariane
  if (pathnames.length === 0) return null;
  
  const currentPath = '/' + pathnames.join('/');
  const managedPage = managedPages.find((page) => page.slug === currentPath);
  const currentRoute = routes[currentPath] || (managedPage ? {
    name: managedPage.title,
    parent: managedPage.parent,
  } : undefined);

  if (!currentRoute) return null;

  // Si la route a un parent, on l'affiche dans le breadcrumb
  const ancestors: { path: string; name: string }[] = [];
  const visitedPaths = new Set<string>();
  let parentPath = currentRoute.parent;

  while (parentPath && !visitedPaths.has(parentPath)) {
    visitedPaths.add(parentPath);
    const managedParent = managedPages.find((page) => page.slug === parentPath);
    const parentRoute = routes[parentPath] || (managedParent ? {
      name: managedParent.title,
      parent: managedParent.parent,
    } : undefined);

    if (!parentRoute) break;

    if (parentPath !== "/") {
      ancestors.unshift({ path: parentPath, name: parentRoute.name });
    }

    parentPath = parentRoute.parent;
  }

  return (
    <div className="bg-gray-50 py-2 px-6 border-b animate-fade-in">
      <Breadcrumb className="max-w-screen-xl mx-auto">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center text-french-blue hover:underline">
                <Home className="h-4 w-4 mr-1" />
                Accueil
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {ancestors.map(({ path, name }) => (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={path} className="text-french-blue hover:underline">
                    {name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
          
          <BreadcrumbSeparator />
          
          <BreadcrumbItem>
            <BreadcrumbPage>{currentRoute.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbNav;
