
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiagnosticElcsContent from '../components/diagnostic/DiagnosticElcsContent';
import DiagnosticPsdContent from '../components/diagnostic/DiagnosticPsdContent';
import DiagnosticRestaurantContent from '../components/diagnostic/DiagnosticRestaurantContent';
import { ElcsDataProvider } from '../components/diagnostic/ElcsDataContext';

const Diagnostic = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      
      <div className="bg-gradient-to-r from-french-blue to-blue-700 text-white py-24 md:py-28">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4 opacity-0 animate-fade-in">
            Diagnostic
          </h1>
          <p className="text-xl md:text-2xl font-raleway font-light max-w-3xl opacity-0 animate-fade-in-delay-1">
            Analyse de la situation actuelle pour orienter le développement
          </p>
        </div>
      </div>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="psd" className="w-full">
            <TabsList className="mb-8 w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 h-auto p-2 bg-white shadow-lg rounded-xl">
              <TabsTrigger
                value="psd"
                className="text-base md:text-lg font-semibold py-4 px-6 rounded-lg data-[state=active]:bg-french-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-50"
              >
                Diagnostic PSD
              </TabsTrigger>
              <TabsTrigger
                value="restaurant"
                className="text-base md:text-lg font-semibold py-4 px-6 rounded-lg data-[state=active]:bg-french-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-50"
              >
                Restauration Scolaire
              </TabsTrigger>
              <TabsTrigger
                value="elcs"
                className="text-base md:text-lg font-semibold py-4 px-6 rounded-lg data-[state=active]:bg-french-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-50"
              >
                Diagnostic ELCS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="psd">
              <DiagnosticPsdContent />
            </TabsContent>

            <TabsContent value="restaurant">
              <DiagnosticRestaurantContent />
            </TabsContent>

            <TabsContent value="elcs">
              <ElcsDataProvider>
                <DiagnosticElcsContent />
              </ElcsDataProvider>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Diagnostic;
