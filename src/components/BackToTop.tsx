
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Vérifier si le défilement est assez bas pour afficher le bouton
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={cn(
        'fixed bottom-6 right-6 p-3 rounded-full bg-french-blue text-white shadow-lg transition-all duration-300 z-40',
        'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      )}
      onClick={scrollToTop}
      aria-label="Retour en haut"
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default BackToTop;
