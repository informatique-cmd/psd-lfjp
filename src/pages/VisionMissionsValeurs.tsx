
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Vision from '../components/Vision';
import Missions from '../components/Missions';
import Valeurs from '../components/Valeurs';
import Footer from '../components/Footer';

const VisionMissionsValeurs = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      <Hero 
        title="NOTRE VISION, NOS MISSIONS, NOS VALEURS" 
        subtitle="Lycée Français Jacques Prévert - Sénégal" 
      />
      <Vision />
      <Missions />
      <Valeurs />
      <Footer />
    </div>
  );
};

export default VisionMissionsValeurs;
