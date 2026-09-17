
import React from 'react';
import siteContent from '@/content/siteContent.json';

const Footer = () => {
  return (
    <footer className="bg-french-blue text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-playfair font-bold">{siteContent.site.name}</h3>
            <p className="text-sm mt-1 font-raleway text-gray-200">{siteContent.site.tagline}</p>
          </div>
          
          <div className="text-sm font-raleway text-center md:text-right">
            <p>{siteContent.site.footerCopyrightPrefix} {siteContent.site.footerYear} {siteContent.site.footerCopyright}</p>
            <p className="mt-1">{siteContent.site.footerPlan}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
