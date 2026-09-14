
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-french-blue text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-playfair font-bold">Lycée Français Jacques Prévert</h3>
            <p className="text-sm mt-1 font-raleway text-gray-200">Sénégal - Petite Côte - Saly</p>
          </div>
          
          <div className="text-sm font-raleway text-center md:text-right">
            <p>© {currentYear} Lycée Français Jacques Prévert</p>
            <p className="mt-1">Plan Stratégique de Développement (2026-2030)</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
