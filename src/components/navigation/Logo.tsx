
import React from 'react';
import siteContent from '@/content/siteContent.json';
import { normalizeMediaUrl } from '@/lib/media';
import { readContentDraft } from '@/lib/contentDraft';

interface LogoProps {
  showLogo: boolean;
}

const Logo = ({ showLogo }: LogoProps) => {
  const content = readContentDraft('lfjp-admin-draft', siteContent);
  return (
    <div className="flex items-center space-x-4">
      {showLogo && (
        <img 
          src={normalizeMediaUrl(content.site.logoUrl)}
          alt={content.site.logoAlt}
          className="h-14 w-auto transition-transform duration-300 hover:scale-105" 
        />
      )}
      <div className="flex flex-col items-start">
        <h1 className="text-xl font-playfair font-bold text-french-blue">{content.site.name}</h1>
        <p className="text-xs text-gray-600">{content.site.tagline}</p>
      </div>
    </div>
  );
};

export default Logo;
