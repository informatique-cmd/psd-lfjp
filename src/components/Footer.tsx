
import React from 'react';
import siteContent from '@/content/siteContent.json';
import { readContentDraft } from '@/lib/contentDraft';

const Footer = () => {
  const content = readContentDraft('lfjp-admin-draft', siteContent);
  return (
    <footer className="bg-french-blue text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-playfair font-bold">{content.site.name}</h3>
            <p className="text-sm mt-1 font-raleway text-gray-200">{content.site.tagline}</p>
          </div>
          
          <div className="text-sm font-raleway text-center md:text-right">
            <p>{content.site.footerCopyrightPrefix} {content.site.footerYear} {content.site.footerCopyright}</p>
            <p className="mt-1">{content.site.footerPlan}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
