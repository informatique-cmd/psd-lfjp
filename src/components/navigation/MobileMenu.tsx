
import React from 'react';
import { cn } from '@/lib/utils';
import MobileNavItem from './MobileNavItem';

interface MobileMenuProps {
  id?: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isActive: (path: string) => boolean;
}

const MobileMenu = ({ id, mobileMenuOpen, setMobileMenuOpen, isActive }: MobileMenuProps) => {
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
        
        <MobileNavItem
          to="/"
          isActive={isActive('/')}
          onClick={() => setMobileMenuOpen(false)}
        >
          Accueil
        </MobileNavItem>

        <MobileNavItem
          to="/methode"
          isActive={isActive('/methode')}
          onClick={() => setMobileMenuOpen(false)}
        >
          Méthode
        </MobileNavItem>

        <MobileNavItem
          to="/vision-missions-valeurs"
          isActive={isActive('/vision-missions-valeurs')}
          onClick={() => setMobileMenuOpen(false)}
        >
          Vision & Valeurs
        </MobileNavItem>
        
        <MobileNavItem 
          to="/diagnostic" 
          isActive={isActive('/diagnostic')} 
          onClick={() => setMobileMenuOpen(false)}
        >
          Diagnostic
        </MobileNavItem>
        
        <MobileNavItem
          to="/plan-strategique"
          isActive={isActive('/plan-strategique')}
          onClick={() => setMobileMenuOpen(false)}
        >
          Plan Stratégique
        </MobileNavItem>

      </div>
    </div>
  );
};

export default MobileMenu;
