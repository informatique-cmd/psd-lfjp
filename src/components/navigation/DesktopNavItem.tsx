
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

interface DesktopNavItemProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const DesktopNavItem = ({ to, isActive, children }: DesktopNavItemProps) => {
  return (
    <NavigationMenuItem>
      <Link to={to}>
        <NavigationMenuLink 
          className={cn(
            navigationMenuTriggerStyle(),
            "font-raleway transition-colors duration-200 relative",
            isActive ? "bg-french-blue text-white" : "hover:bg-blue-50 hover:text-french-blue",
            isActive ? "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-white" : ""
          )}
        >
          {children}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
};

export default DesktopNavItem;
