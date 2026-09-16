
import React from 'react';
import { List } from 'lucide-react';
import siteContent from '@/content/siteContent.json';

const Missions = () => {
  const missions = siteContent.visionMissionsValeurs.missions;

  return (
    <section id="missions" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/3 flex md:flex-col items-start md:items-center gap-4 text-left md:text-center">
            <div className="w-24 h-24 rounded-full bg-french-blue bg-opacity-10 flex items-center justify-center mx-auto">
              <List size={48} className="text-french-blue" />
            </div>

            <h2 className="text-3xl font-playfair font-bold text-french-blue flex items-center">
              <span className="mr-2">2.</span>
              NOS MISSIONS
            </h2>
          </div>
          
          <div className="w-full md:w-2/3">
            <ul className="space-y-4">
              {missions.map((mission, index) => (
                <li key={index} className="flex items-start font-raleway opacity-0 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <span className="inline-flex items-center justify-center rounded-full bg-french-blue h-6 w-6 text-white text-sm shrink-0 mt-0.5 mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{mission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Missions;
