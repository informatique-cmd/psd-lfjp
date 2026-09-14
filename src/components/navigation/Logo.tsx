
import React from 'react';

interface LogoProps {
  showLogo: boolean;
}

const Logo = ({ showLogo }: LogoProps) => {
  return (
    <div className="flex items-center space-x-4">
      {showLogo && (
        <img 
          src="https://i.imgur.com/0YmGlXO.png" 
          alt="LFJP Logo" 
          className="h-14 w-auto transition-transform duration-300 hover:scale-105" 
        />
      )}
      <div className="flex flex-col items-start">
        <h1 className="text-xl font-playfair font-bold text-french-blue">Lycée Français Jacques Prévert</h1>
        <p className="text-xs text-gray-600">Sénégal - Petite Côte - Saly</p>
      </div>
    </div>
  );
};

export default Logo;
