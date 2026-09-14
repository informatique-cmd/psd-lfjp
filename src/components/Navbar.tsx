
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, Search } from 'lucide-react';
import Logo from './navigation/Logo';
import MobileMenu from './navigation/MobileMenu';
import DesktopMenu from './navigation/DesktopMenu';
import SearchDialog from './SearchDialog';

interface NavbarProps {
  showLogo?: boolean;
}

const Navbar = ({ showLogo = false }: NavbarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [modifierKey, setModifierKey] = useState<'Ctrl' | '⌘'>('Ctrl');
  
  // Ajout d'un effet pour détecter le défilement de la page
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    if (typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)) {
      setModifierKey('⌘');
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Fonction pour déterminer si un lien est actif
  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === path;
    }

    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  // Fonction pour ouvrir/fermer le menu mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const mobileMenuId = 'mobile-menu';

  return (
    <header
      className={cn(
        "bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "shadow-md py-2" : ""
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Logo showLogo={showLogo} />

        <div className="flex items-center gap-2">
          {/* Bouton recherche desktop */}
          <button
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-french-blue/30 hover:bg-blue-50 hover:text-french-blue"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Ouvrir la recherche"
          >
            <Search size={16} />
            <span>Recherche</span>
            <span className="hidden lg:inline-flex items-center rounded bg-white/60 px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
              {modifierKey} + K
            </span>
          </button>

          {/* Bouton recherche mobile */}
          <button
            className="md:hidden p-2 rounded-md text-french-blue hover:bg-blue-50"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Ouvrir la recherche"
          >
            <Search size={22} />
          </button>

          {/* Menu hamburger pour mobile */}
          <button
            className="md:hidden p-2 rounded-md text-french-blue hover:bg-blue-50"
            onClick={toggleMobileMenu}
            aria-label="Menu Navigation"
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Menu mobile */}
        <MobileMenu
          id={mobileMenuId}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          isActive={isActive}
        />
        
        {/* Menu desktop */}
        <DesktopMenu isActive={isActive} />
      </div>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
};

export default Navbar;
