
import React from 'react';
import { Heart, Award, Users, Sparkles, Check } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import siteContent from '@/content/siteContent.json';

const Valeurs = () => {
  const icons = [Heart, Award, Users, Sparkles, Check];
  const values = siteContent.visionMissionsValeurs.values.map((value, index) => ({ ...value, Icon: icons[index] || Check }));

  return (
    <section id="valeurs" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-playfair font-bold text-french-blue mb-10 flex items-center">
          <span className="mr-2">3.</span>
          NOS VALEURS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card 
              key={index} 
              className="border-none shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="rounded-full bg-french-blue bg-opacity-10 p-4 mb-4">
                  <value.Icon className="h-8 w-8 mb-4 text-french-red" />
                </div>
                <h3 className="text-xl font-playfair font-bold mb-3 text-french-blue">{value.name}</h3>
                <p className="text-gray-600 font-raleway">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Valeurs;
