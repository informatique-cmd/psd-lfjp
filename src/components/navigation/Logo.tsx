
import React from 'react';
import siteContent from '@/content/siteContent.json';

interface LogoProps {
  showLogo: boolean;
}

const Logo = ({ showLogo }: LogoProps) => {
  return (
    <div className="flex items-center space-x-4">
      {showLogo && (
        <img 
          src={siteContent.site.logoUrl}
          alt={siteContent.site.logoAlt}
          className="h-14 w-auto transition-transform duration-300 hover:scale-105" 
        />
      )}
      <div className="flex flex-col items-start">
        <h1 className="text-xl font-playfair font-bold text-french-blue">{siteContent.site.name}</h1>
        <p className="text-xs text-gray-600">{siteContent.site.tagline}</p>
      </div>
    </div>
  );
};

export default Logo;
