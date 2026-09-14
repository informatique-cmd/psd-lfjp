
import React from 'react';
import { Target } from 'lucide-react';

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
              <p className="text-gray-700 leading-relaxed">
                Devenir un acteur incontournable de l'éducation francophone en Afrique de l'Ouest, conventionné AEFE, 
                reconnu pour son innovation pédagogique et son engagement éthique qui forge des citoyens du monde avec 
                un profond ancrage local propre à la Petite Côte sénégalaise.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                D'ici 2030, le Lycée français Jacques Prévert (LFJP) sera une référence en matière d'acquisition de 
                connaissances, de valeurs inclusives et de développement de compétences, qu'elles soient humaines, 
                citoyennes ou environnementales, afin de s'adapter à un monde en perpétuelle évolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
