
import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
}

const Hero = ({ title, subtitle }: HeroProps) => {
  return (
    <section className="bg-gradient-to-r from-french-blue to-blue-700 text-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-start gap-8 md:gap-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6 opacity-0 animate-fade-in">
              {title}
            </h1>
            <p className="text-xl md:text-2xl font-raleway font-light opacity-0 animate-fade-in-delay-1">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
