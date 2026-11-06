
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Users, Sparkles, GraduationCap } from 'lucide-react';
import PSDAxe1 from './PSDAxe1';
import PSDAxe2 from './PSDAxe2';
import PSDAxe3 from './PSDAxe3';
import PSDAxe4 from './PSDAxe4';
import { useLocation, useSearchParams } from 'react-router-dom';

const AXE_VALUES = ['axe1', 'axe2', 'axe3', 'axe4'] as const;
type AxeValue = (typeof AXE_VALUES)[number];

const isValidAxe = (value: string | null | undefined): value is AxeValue =>
  typeof value === 'string' && (AXE_VALUES as readonly string[]).includes(value);

const PSDTabs = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const forcedAxe = useMemo(() => {
    const stateAxe = (location.state as { axe?: string } | null)?.axe;
    const queryAxe = searchParams.get('axe');

    if (isValidAxe(stateAxe)) {
      return stateAxe;
    }

    if (isValidAxe(queryAxe)) {
      return queryAxe;
    }

    return undefined;
  }, [location.state, searchParams]);

  const persistedAxe = useMemo(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    try {
      const storedValue = window.sessionStorage.getItem('psd-active-axe');
      return isValidAxe(storedValue) ? storedValue : undefined;
    } catch (error) {
      console.warn('Impossible de lire la valeur persistée de l\'onglet PSD.', error);
      return undefined;
    }
  }, []);

  const [activeAxe, setActiveAxe] = useState<AxeValue>(() => forcedAxe ?? persistedAxe ?? 'axe1');
  const lastForcedAxe = useRef<AxeValue | undefined>(forcedAxe ?? undefined);

  useEffect(() => {
    if (forcedAxe) {
      if (forcedAxe !== lastForcedAxe.current) {
        lastForcedAxe.current = forcedAxe;
        setActiveAxe(forcedAxe);
      }
    } else {
      lastForcedAxe.current = undefined;
    }
  }, [forcedAxe]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem('psd-active-axe', activeAxe);
      } catch (error) {
        console.warn('Impossible d\'enregistrer l\'onglet actif du PSD.', error);
      }
    }
  }, [activeAxe]);

  const handleTabChange = (value: string) => {
    if (isValidAxe(value)) {
      setActiveAxe(value);
    }
  };

  return (
    <Tabs value={activeAxe} onValueChange={handleTabChange} className="w-full">
      <TabsList className="flex flex-wrap md:flex-nowrap justify-center gap-2 mb-8 h-auto w-full">
        <TabsTrigger
          value="axe1"
          className="group flex flex-col items-center justify-center basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 px-3 py-3 text-center text-[#333333] transition duration-200 data-[state=active]:text-[#005BAC]"
        >
          <Target className="mb-1 h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 transition duration-200 group-hover:scale-[1.15] group-hover:text-[#005BAC]" />
          <div className="mt-1 flex flex-col items-center gap-0.5 text-center">
            <span className="block text-xs sm:text-sm md:text-lg transition duration-200 group-hover:scale-[1.15] group-hover:text-[#005BAC]">Axe 1</span>
            <span className="text-xs text-muted-foreground">Bien-être</span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="axe2"
          className="group flex flex-col items-center justify-center basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 px-3 py-3 text-center text-[#333333] transition duration-200 data-[state=active]:text-[#005BAC]"
        >
          <Users className="mb-1 h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 transition duration-200 group-hover:scale-[1.15] group-hover:text-[#005BAC]" />
          <div className="mt-1 flex flex-col items-center gap-0.5 text-center">
            <span className="block text-xs sm:text-sm md:text-lg transition duration-200 group-hover:scale-[1.15] group-hover:text-[#005BAC]">Axe 2</span>
            <span className="text-xs text-muted-foreground">Ouverture</span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="axe3"
          className="group flex flex-col items-center justify-center basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 px-3 py-3 text-center text-[#333333] transition duration-200 data-[state=active]:text-[#005BAC]"
        >
          <Sparkles className="mb-1 h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 transition duration-200 group-hover:scale-[1.15] group-hover:text-[#005BAC]" />
          <div className="mt-1 flex flex-col items-center gap-0.5 text-center">
            <span className="block text-xs sm:text-sm md:text-lg transition duration-200 group-hover:scale-[1.15] group-hover:text-[#005BAC]">Axe 3</span>
            <span className="text-xs text-muted-foreground">Innovation</span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="axe4"
          className="group flex flex-col items-center justify-center basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 px-3 py-3 text-center text-[#333333] transition duration-200 data-[state=active]:text-[#005BAC]"
        >
          <GraduationCap className="mb-1 h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 transition duration-200 group-hover:scale-[1.15] group-hover:text-[#005BAC]" />
          <div className="mt-1 flex flex-col items-center gap-0.5 text-center">
            <span className="block text-xs sm:text-sm md:text-lg transition duration-200 group-hover:scale-[1.15] group-hover:text-[#005BAC]">Axe 4</span>
            <span className="text-xs text-muted-foreground">Réussite</span>
          </div>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="axe1" className="border-2 border-french-blue/10 rounded-lg p-6 bg-white">
        <PSDAxe1 />
      </TabsContent>
      
      <TabsContent value="axe2" className="border-2 border-french-blue/10 rounded-lg p-6 bg-white">
        <PSDAxe2 />
      </TabsContent>
      
      <TabsContent value="axe3" className="border-2 border-french-blue/10 rounded-lg p-6 bg-white">
        <PSDAxe3 />
      </TabsContent>
      
      <TabsContent value="axe4" className="border-2 border-french-blue/10 rounded-lg p-6 bg-white">
        <PSDAxe4 />
      </TabsContent>
      
    </Tabs>
  );
};

export default PSDTabs;
