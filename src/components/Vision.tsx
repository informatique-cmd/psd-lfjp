
import React from 'react';
import { Target } from 'lucide-react';
import siteContent from '@/content/siteContent.json';

const Vision = () => {
  return (
    <section id="vision" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/3 flex md:flex-col items-start md:items-center gap-4 text-left md:text-center">
            <div className="w-24 h-24 rounded-full bg-french-blue bg-opacity-10 flex items-center justify-center">
              <Target size={48} className="text-french-blue" />
            </div>

            <h2 className="text-3xl font-playfair font-bold text-french-blue flex items-center">
              <span className="mr-2">1.</span>
              NOTRE VISION
            </h2>
          </div>

          <div className="w-full md:w-2/3">
            
            <div className="space-y-4 font-raleway">
              {siteContent.visionMissionsValeurs.vision.map((paragraph) => <p key={paragraph} className="text-gray-700 leading-relaxed">{paragraph}</p>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
