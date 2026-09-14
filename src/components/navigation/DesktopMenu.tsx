import React from 'react';
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import DesktopNavItem from './DesktopNavItem';

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

      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopMenu;
