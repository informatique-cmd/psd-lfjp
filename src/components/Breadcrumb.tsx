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
import { getManagedPages } from '@/content/pageTypes';
import pageDataFile from '@/content/pageData.json';
import { defaultPsdAxesData, type PsdAxesData } from '@/data/psdAxesData';
import { resolveActionPage, type ActionPagesMap } from '@/data/actionPageData';
import { usePublishedPageData } from '@/lib/publishedDataSync';
import { useContentDraft } from '@/lib/contentDraft';

const breadcrumbFallback = {
  ...pageDataFile,
  psdAxesData: (pageDataFile as { psdAxesData?: PsdAxesData }).psdAxesData || defaultPsdAxesData,
  actionPages: (pageDataFile as { actionPages?: ActionPagesMap }).actionPages || {},
};

interface RouteMap {
  [key: string]: {
    name: string;
    parent?: string;
  };
}

const routes: RouteMap = routesData;

const BreadcrumbNav = () => {
  const managedPages = getManagedPages();
  const publishedData = usePublishedPageData(breadcrumbFallback);
  const pageData = useContentDraft('lfjp-admin-page-data-draft', publishedData);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Si nous sommes sur la page d'accueil, ne pas afficher le fil d'Ariane
  if (pathnames.length === 0) return null;
  
  const currentPath = '/' + pathnames.join('/');
  const managedPage = managedPages.find((page) => page.slug === currentPath);
  let currentRoute = routes[currentPath] || (managedPage ? {
    name: managedPage.title,
    parent: managedPage.parent,
  } : undefined);

  if (!currentRoute && (pathnames[0] === 'projets' || pathnames[0] === 'fiche-projet')) {
    currentRoute = {
      name: 'Fiche détaillée du projet',
      parent: '/budget-cadre-vie-infrastructures',
    };
  }

  if (!currentRoute) {
    const resolvedAction = resolveActionPage(
      (pageData?.actionPages as ActionPagesMap) || {},
      (pageData?.psdAxesData as PsdAxesData) || defaultPsdAxesData,
      currentPath
    );
    if (resolvedAction) {
      currentRoute = {
        name: resolvedAction.title,
        parent: '/plan-strategique',
      };
    }
  }

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
          
          {ancestors.flatMap(({ path, name }) => [
            <BreadcrumbSeparator key={`sep-${path}`} />,
            <BreadcrumbItem key={`item-${path}`}>
              <BreadcrumbLink asChild>
                <Link to={path} className="text-french-blue hover:underline">
                  {name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>,
          ])}
          
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
