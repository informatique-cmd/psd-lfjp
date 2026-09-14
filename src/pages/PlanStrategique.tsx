
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PSD from '../components/PSD';

const PlanStrategique = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      <div className="bg-gradient-to-r from-french-blue to-blue-700 text-white py-24 md:py-32">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6 opacity-0 animate-fade-in">
            PLAN STRATÉGIQUE DE DÉVELOPPEMENT
          </h1>
          <p className="text-xl md:text-2xl font-raleway font-light max-w-3xl opacity-0 animate-fade-in-delay-1">
            Lycée Français Jacques Prévert (2026-2030)
          </p>
        </div>
      </div>
      <PSD />
      <Footer />
    </div>
  );
};

export default PlanStrategique;
