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

interface RouteMap {
  [key: string]: {
    name: string;
    parent?: string;
  };
}

const routes: RouteMap = routesData;

const BreadcrumbNav = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Si nous sommes sur la page d'accueil, ne pas afficher le fil d'Ariane
  if (pathnames.length === 0) return null;
  
  const currentPath = '/' + pathnames.join('/');
  const currentRoute = routes[currentPath];

  if (!currentRoute) return null;

  // Si la route a un parent, on l'affiche dans le breadcrumb
  const ancestors: { path: string; name: string }[] = [];
  const visitedPaths = new Set<string>();
  let parentPath = currentRoute.parent;

  while (parentPath && !visitedPaths.has(parentPath)) {
    visitedPaths.add(parentPath);
    const parentRoute = routes[parentPath];

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
