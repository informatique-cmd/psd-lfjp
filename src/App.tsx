
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Methode from "./pages/Methode";
import VisionMissionsValeurs from "./pages/VisionMissionsValeurs";
import Diagnostic from "./pages/Diagnostic";
import PlanStrategique from "./pages/PlanStrategique";
import PlanMaintenanceStrategique from "./pages/PlanMaintenanceStrategique";
import PCParLyceen from "./pages/PCParLyceen";
import ConstructionCantine from "./pages/ConstructionCantine";
import ProtocolePHARE from "./pages/ProtocolePHARE";
import ElcsAnalyseComplete from "./pages/ElcsAnalyseComplete";
import CurriculumSoftSkills from "./pages/CurriculumSoftSkills";
import CurriculumNumeriqueSpiralaire from "./pages/CurriculumNumeriqueSpiralaire";
import SectionInternationaleBFI from "./pages/SectionInternationaleBFI";
import BFI from "./pages/BFI";
import DNBi from "./pages/DNBi";
import MediationEntrePairs from "./pages/MediationEntrePairs";
import PolitiqueE3D from "./pages/PolitiqueE3D";
import MecenatNumerique from "./pages/MecenatNumerique";
import ValorisationErreur from "./pages/ValorisationErreur";
import ReussiteCitoyenne from "./pages/plan-strategique/reussite-citoyenne";
import EducationFinanciereVieAutonome from "./pages/EducationFinanciereVieAutonome";
import ReseauAlumniMentorat from "./pages/ReseauAlumniMentorat";
import ParcoursAvenir from "./pages/ParcoursAvenir";
import FilmAnnuelLevel from "./pages/film-annuel/FilmAnnuelLevel";
import ParcoursEducationArtistiqueCulturelle from "./pages/ParcoursEducationArtistiqueCulturelle";
import SemaineDesCultures from "./pages/SemaineDesCultures";
import CouvertureTerrainSport from "./pages/CouvertureTerrainSport";
import TransportScolaire from "./pages/TransportScolaire";
import ClasseNumerique from "./pages/ClasseNumerique";
import SavoirRouler from "./pages/SavoirRouler";
import SavoirNager from "./pages/SavoirNager";
import ClimatisationDurable from "./pages/ClimatisationDurable";
import ParentaliteCoeEducation from "./pages/ParentaliteCoeEducation";
import ExpressionParticipation from "./pages/ExpressionParticipation";
import VoyagesScolairesInternationaux from "./pages/VoyagesScolairesInternationaux";
import JumelagesPartagesProjets from "./pages/JumelagesPartagesProjets";
import EchangesScolairesADNAEFE from "./pages/EchangesScolairesADNAEFE";
import IntroductionAuCode from "./pages/IntroductionAuCode";
import ModuleIA from "./pages/ModuleIA";
import EducationNumeriqueCitoyen from "./pages/EducationNumeriqueCitoyen";
import BudgetCadreVieInfrastructuresPage from "./pages/BudgetCadreVieInfrastructures";
import Connectivite20 from "./pages/Connectivite20";
import ProfilDigitalLFJP from "./pages/ProfilDigitalLFJP";
import LaboratoireNumerique from "./pages/LaboratoireNumerique";
import BreadcrumbNav from "./components/Breadcrumb";
import BackToTop from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";
import PlanificationBacBlanc from "./pages/PlanificationBacBlanc";
import ParcoursSante from "./pages/ParcoursSante";
import ProjetEPS from "./pages/ProjetEPS";
import ImplicationDesFamilles from "./pages/ImplicationDesFamilles";
import NiveauExcellenceReussiteExamens from "./pages/NiveauExcellenceReussiteExamens";
import AutonomiePerseverance from "./pages/AutonomiePerseverance";
import ToutesLesReussites from "./pages/ToutesLesReussites";
import CelebrationReussitesDiplomes from "./pages/CelebrationReussitesDiplomes";

// Créer l'instance QueryClient en dehors du composant pour éviter les recréations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/methode" element={
                  <>
                    <BreadcrumbNav />
                    <Methode />
                    <BackToTop />
                  </>
                } />
                <Route path="/vision-missions-valeurs" element={
                  <>
                    <BreadcrumbNav />
                    <VisionMissionsValeurs />
                    <BackToTop />
                  </>
                } />
                <Route path="/diagnostic" element={
                  <>
                    <BreadcrumbNav />
                    <Diagnostic />
                    <BackToTop />
                  </>
                } />
                <Route path="/elcs-analyse-complete" element={
                  <>
                    <BreadcrumbNav />
                    <ElcsAnalyseComplete />
                    <BackToTop />
                  </>
                } />
                <Route path="/plan-strategique" element={
                  <>
                    <BreadcrumbNav />
                    <PlanStrategique />
                    <BackToTop />
                  </>
                } />
                <Route path="/planification-bac-blanc" element={
                  <>
                    <BreadcrumbNav />
                    <PlanificationBacBlanc />
                    <BackToTop />
                  </>
                } />
                <Route path="/plan-maintenance-strategique" element={
                  <>
                    <BreadcrumbNav />
                    <PlanMaintenanceStrategique />
                    <BackToTop />
                  </>
                } />
                <Route path="/implication-des-familles" element={
                  <>
                    <BreadcrumbNav />
                    <ImplicationDesFamilles />
                    <BackToTop />
                  </>
                } />
                <Route path="/niveau-excellence-reussite-examens" element={
                  <>
                    <BreadcrumbNav />
                    <NiveauExcellenceReussiteExamens />
                    <BackToTop />
                  </>
                } />
                <Route path="/autonomie-perseverance" element={
                  <>
                    <BreadcrumbNav />
                    <AutonomiePerseverance />
                    <BackToTop />
                  </>
                } />
                <Route path="/toutes-les-reussites" element={
                  <>
                    <BreadcrumbNav />
                    <ToutesLesReussites />
                    <BackToTop />
                  </>
                } />
                <Route path="/celebration-reussites-diplomes" element={
                  <>
                    <BreadcrumbNav />
                    <CelebrationReussitesDiplomes />
                    <BackToTop />
                  </>
                } />
                <Route path="/plan-strategique/reussite-citoyenne" element={
                  <>
                    <BreadcrumbNav />
                    <ReussiteCitoyenne />
                    <BackToTop />
                  </>
                } />
                <Route path="/curriculum-soft-skills" element={
                  <>
                    <BreadcrumbNav />
                    <CurriculumSoftSkills />
                    <BackToTop />
                  </>
                } />
                <Route path="/curriculum-numerique-spiralaire" element={
                  <>
                    <BreadcrumbNav />
                    <CurriculumNumeriqueSpiralaire />
                    <BackToTop />
                  </>
                } />
                <Route path="/introduction-au-code" element={
                  <>
                    <BreadcrumbNav />
                    <IntroductionAuCode />
                    <BackToTop />
                  </>
                } />
                <Route path="/module-ia" element={
                  <>
                    <BreadcrumbNav />
                    <ModuleIA />
                    <BackToTop />
                  </>
                } />
                <Route path="/education-numerique-citoyen" element={
                  <>
                    <BreadcrumbNav />
                    <EducationNumeriqueCitoyen />
                    <BackToTop />
                  </>
                } />
                <Route path="/connectivite-2-0" element={
                  <>
                    <BreadcrumbNav />
                    <Connectivite20 />
                    <BackToTop />
                  </>
                } />
                <Route path="/laboratoire-numerique" element={
                  <>
                    <BreadcrumbNav />
                    <LaboratoireNumerique />
                    <BackToTop />
                  </>
                } />
                <Route path="/profil-digital-lfjp" element={
                  <>
                    <BreadcrumbNav />
                    <ProfilDigitalLFJP />
                    <BackToTop />
                  </>
                } />
                <Route path="/parcours-avenir" element={
                  <>
                    <BreadcrumbNav />
                    <ParcoursAvenir />
                    <BackToTop />
                  </>
                } />
                <Route path="/parcours-education-artistique-culturelle" element={
                  <>
                    <BreadcrumbNav />
                    <ParcoursEducationArtistiqueCulturelle />
                    <BackToTop />
                  </>
                } />
                <Route path="/parcours-sante" element={
                  <>
                    <BreadcrumbNav />
                    <ParcoursSante />
                    <BackToTop />
                  </>
                } />
                <Route path="/projet-eps" element={
                  <>
                    <BreadcrumbNav />
                    <ProjetEPS />
                    <BackToTop />
                  </>
                } />
                <Route path="/semaine-des-cultures" element={
                  <>
                    <BreadcrumbNav />
                    <SemaineDesCultures />
                    <BackToTop />
                  </>
                } />
                <Route path="/film-annuel/:niveau" element={
                  <>
                    <BreadcrumbNav />
                    <FilmAnnuelLevel />
                    <BackToTop />
                  </>
                } />
                <Route path="/section-internationale-bfi" element={
                  <>
                    <BreadcrumbNav />
                    <SectionInternationaleBFI />
                    <BackToTop />
                  </>
                } />
                <Route path="/bfi" element={
                  <>
                    <BreadcrumbNav />
                    <BFI />
                    <BackToTop />
                  </>
                } />
                <Route path="/dnbi" element={
                  <>
                    <BreadcrumbNav />
                    <DNBi />
                    <BackToTop />
                  </>
                } />
                <Route path="/classe-numerique" element={
                  <>
                    <BreadcrumbNav />
                    <ClasseNumerique />
                    <BackToTop />
                  </>
                } />
                <Route path="/pc-par-lyceen" element={
                  <>
                    <BreadcrumbNav />
                    <PCParLyceen />
                    <BackToTop />
                  </>
                } />
                <Route path="/mecenat-numerique" element={
                  <>
                    <BreadcrumbNav />
                    <MecenatNumerique />
                    <BackToTop />
                  </>
                } />
                <Route path="/construction-cantine" element={
                  <>
                    <BreadcrumbNav />
                    <ConstructionCantine />
                    <BackToTop />
                  </>
                } />
                <Route path="/protocole-phare" element={
                  <>
                    <BreadcrumbNav />
                    <ProtocolePHARE />
                    <BackToTop />
                  </>
                 } />
                <Route path="/valorisation-erreur-perseverance" element={
                  <>
                    <BreadcrumbNav />
                    <ValorisationErreur />
                    <BackToTop />
                  </>
                } />
                <Route path="/education-financiere-vie-autonome" element={
                  <>
                    <BreadcrumbNav />
                    <EducationFinanciereVieAutonome />
                    <BackToTop />
                  </>
                } />
                <Route path="/reseau-alumni-mentorat" element={
                  <>
                    <BreadcrumbNav />
                    <ReseauAlumniMentorat />
                    <BackToTop />
                  </>
                } />
                <Route path="/mediation-entre-pairs" element={
                  <>
                    <BreadcrumbNav />
                    <MediationEntrePairs />
                    <BackToTop />
                  </>
                } />
                <Route path="/politique-e3d" element={
                  <>
                    <BreadcrumbNav />
                    <PolitiqueE3D />
                    <BackToTop />
                  </>
                } />
                <Route path="/couverture-terrain-sport" element={
                  <>
                    <BreadcrumbNav />
                    <CouvertureTerrainSport />
                    <BackToTop />
                  </>
                } />
                <Route path="/climatisation-durable" element={
                  <>
                    <BreadcrumbNav />
                    <ClimatisationDurable />
                    <BackToTop />
                  </>
                } />
                <Route path="/transport-scolaire" element={
                  <>
                    <BreadcrumbNav />
                    <TransportScolaire />
                    <BackToTop />
                  </>
                } />
                <Route path="/savoir-rouler" element={
                  <>
                    <BreadcrumbNav />
                    <SavoirRouler />
                    <BackToTop />
                  </>
                } />
                <Route path="/savoir-nager" element={
                  <>
                    <BreadcrumbNav />
                    <SavoirNager />
                    <BackToTop />
                  </>
                } />
                <Route path="/parentalite-coeducation" element={
                  <>
                    <BreadcrumbNav />
                    <ParentaliteCoeEducation />
                    <BackToTop />
                  </>
                } />
                <Route path="/expression-participation" element={
                  <>
                    <BreadcrumbNav />
                    <ExpressionParticipation />
                    <BackToTop />
                  </>
                } />
                <Route path="/jumelages-partages-projets-collaboratifs" element={
                  <>
                    <BreadcrumbNav />
                    <JumelagesPartagesProjets />
                    <BackToTop />
                  </>
                } />
                <Route path="/echanges-scolaires-adn-aefe" element={
                  <>
                    <BreadcrumbNav />
                    <EchangesScolairesADNAEFE />
                    <BackToTop />
                  </>
                } />
                <Route path="/voyages-scolaires-internationaux-sejours-locaux" element={
                  <>
                    <BreadcrumbNav />
                    <VoyagesScolairesInternationaux />
                    <BackToTop />
                  </>
                } />
                <Route path="/budget-cadre-vie-infrastructures" element={
                  <>
                    <BreadcrumbNav />
                    <BudgetCadreVieInfrastructuresPage />
                    <BackToTop />
                  </>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
