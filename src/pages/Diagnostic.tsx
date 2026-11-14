
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiagnosticElcsContent from '../components/diagnostic/DiagnosticElcsContent';
import DiagnosticPsdContent from '../components/diagnostic/DiagnosticPsdContent';
import DiagnosticRestaurantContent from '../components/diagnostic/DiagnosticRestaurantContent';
import { ElcsDataProvider } from '../components/diagnostic/ElcsDataContext';

const clearSectionDraftKey = (sectionKey: 'psdSurveyData' | 'restaurant' | 'elcsData', recoverEvent: string) => {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem('lfjp-admin-page-data-draft');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          delete parsed[sectionKey];
          window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(parsed));
        }
      }
    } catch {
      window.localStorage.removeItem('lfjp-admin-page-data-draft');
    }
    window.dispatchEvent(new Event(recoverEvent));
    window.dispatchEvent(new Event('storage'));
  }
};

const Diagnostic = () => {
  const queryTab = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tab') : null;
  const initialTab = queryTab === 'restaurant' || queryTab === 'elcs' ? queryTab : 'psd';

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      
      <div className="bg-gradient-to-r from-french-blue to-blue-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-3 opacity-0 animate-fade-in">
            Diagnostic
          </h1>
          <p className="text-lg md:text-xl font-raleway font-light max-w-3xl opacity-0 animate-fade-in-delay-1">
            Analyse de la situation actuelle pour orienter le développement
          </p>
        </div>
      </div>

      <section className="py-8 md:py-10 bg-gray-50 flex-grow">
        <div className="container mx-auto px-6">
          <Tabs defaultValue={initialTab} className="w-full">
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
              <ErrorBoundary
                compact
                sectionName="Diagnostic PSD"
                onRecoverDefault={() => clearSectionDraftKey('psdSurveyData', 'lfjp_section_recovered_psd')}
              >
                <DiagnosticPsdContent />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="restaurant">
              <ErrorBoundary
                compact
                sectionName="Restauration Scolaire"
                onRecoverDefault={() => clearSectionDraftKey('restaurant', 'lfjp_section_recovered_restaurant')}
              >
                <DiagnosticRestaurantContent />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="elcs">
              <ErrorBoundary
                compact
                sectionName="Diagnostic ELCS"
                onRecoverDefault={() => clearSectionDraftKey('elcsData', 'lfjp_section_recovered_elcs')}
              >
                <ElcsDataProvider>
                  <DiagnosticElcsContent />
                </ElcsDataProvider>
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Diagnostic;
