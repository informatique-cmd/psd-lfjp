
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiagnosticPsdElevesContent from './DiagnosticPsdElevesContent';
import DiagnosticPsdParentsContent from './DiagnosticPsdParentsContent';

const DiagnosticPsdContent = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <Tabs defaultValue="eleves" className="w-full">
        <TabsList className="mb-8 w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="eleves" className="text-sm md:text-base font-medium">
            Sondage Élèves
          </TabsTrigger>
          <TabsTrigger value="parents" className="text-sm md:text-base font-medium">
            Sondage Parents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="eleves">
          <DiagnosticPsdElevesContent />
        </TabsContent>
        
        <TabsContent value="parents">
          <DiagnosticPsdParentsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagnosticPsdContent;
