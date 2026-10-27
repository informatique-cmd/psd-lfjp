import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';
import RenouvellementInformatiqueTabs from '../components/RenouvellementInformatiqueTabs';
import RenouvellementMobilierScolaire from '../components/RenouvellementMobilierScolaire';
import { cn } from '@/lib/utils';

const TAB_VALUES = ['peintures', 'informatique', 'acoustique', 'mobilier'] as const;
type TabValue = typeof TAB_VALUES[number];

const PlanMaintenanceStrategique = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabsListRef = useRef<HTMLDivElement | null>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>('peintures');

  useEffect(() => {
    const list = tabsListRef.current;
    if (!list) return;

    const updateEdges = () => {
      const { scrollLeft, scrollWidth, clientWidth } = list;
      setIsAtStart(scrollLeft <= 1);
      setIsAtEnd(scrollWidth - clientWidth - scrollLeft <= 1);
    };

    updateEdges();
    list.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);

    return () => {
      list.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, []);

  useEffect(() => {
    const hash = location.hash.replace('#', '') as TabValue | '';

    if (hash && (TAB_VALUES as readonly string[]).includes(hash)) {
      setActiveTab(hash as TabValue);
      return;
    }

    if (!hash) {
      setActiveTab('peintures');
    }
  }, [location.hash]);

  const handleTabChange = (value: string) => {
    if (!(TAB_VALUES as readonly string[]).includes(value)) return;

    const nextValue = value as TabValue;
    setActiveTab(nextValue);
    navigate(`${location.pathname}#${nextValue}`, { replace: true });
  };

  const tabTriggerClasses = cn(
    "group relative flex min-w-[clamp(180px,55vw,280px)] flex-shrink-0 items-center justify-center gap-2",
    "rounded-xl border border-[#e5ecf5] bg-white px-4 py-3 font-medium text-[#1f3b5b]",
    "text-[clamp(14px,1.6vw,18px)] whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-200 ease-out",
    "hover:scale-[1.06] hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] focus-visible:scale-[1.06]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005BAC] focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:shadow-[0_6px_18px_rgba(0,0,0,0.08)]",
    "data-[state=active]:border-[#cfe2ff] data-[state=active]:text-[#005BAC]",
    "lg:min-w-0 lg:flex-1 lg:px-6 lg:py-4 lg:text-[clamp(14px,1vw,18px)]",
    "max-[600px]:min-w-[clamp(200px,68vw,260px)] max-[600px]:px-[clamp(16px,5vw,24px)] max-[600px]:py-[clamp(12px,4.5vw,18px)] max-[600px]:text-[clamp(14px,4vw,18px)] max-[600px]:min-h-[44px]",
    "snap-start"
  );

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-french-blue to-blue-700 text-white py-24 md:py-32">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6 opacity-0 animate-fade-in">
            PLAN DE MAINTENANCE STRATÉGIQUE
          </h1>
          <p className="text-xl md:text-2xl font-raleway font-light max-w-3xl opacity-0 animate-fade-in-delay-1">
            Préservation et amélioration du patrimoine immobilier et technologique
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-4 flex gap-2">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Retour
        </Button>
        <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
          <Home size={16} />
          Accueil
        </Button>
      </div>

      {/* Content Section */}
      <div className="flex-1 bg-white py-16">
        <div className="container mx-auto px-6">
          
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl font-playfair font-bold text-french-blue mb-8">
              Qu'est-ce que le Plan de Maintenance Stratégique ?
            </h2>
            <div className="prose prose-lg text-gray-700 space-y-6">
              <p>
                Le Plan de Maintenance Stratégique du Lycée Français Jacques Prévert constitue un outil de pilotage 
                essentiel pour préserver et améliorer notre patrimoine immobilier et technologique sur la période 2025-2030.
              </p>
              <p>
                Ce plan s'articule autour de trois axes majeurs qui garantissent un environnement d'apprentissage 
                optimal et pérenne pour notre communauté éducative :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>La préservation esthétique et structurelle</strong> des bâtiments</li>
                <li><strong>La modernisation technologique</strong> des équipements pédagogiques</li>
                <li><strong>L'amélioration du confort acoustique</strong> des espaces d'apprentissage</li>
              </ul>
              <p>
                Chaque volet fait l'objet d'une planification rigoureuse, d'un budget dédié et d'indicateurs 
                de suivi permettant d'assurer une mise en œuvre efficace et mesurable.
              </p>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="max-w-6xl mx-auto">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
              aria-label="Sections du plan de maintenance stratégique"
            >
              <TabsList
                ref={tabsListRef}
                className={cn(
                  "relative mb-8 flex h-auto w-full flex-nowrap items-center gap-3 rounded-2xl bg-[#f3f7fb] p-2",
                  "overflow-x-auto overflow-y-hidden scroll-px-4 scroll-smooth snap-x snap-mandatory",
                  "before:pointer-events-none before:absolute before:top-0 before:left-0 before:h-full before:w-6 before:rounded-2xl before:bg-gradient-to-r before:from-[#f3f7fb] before:to-transparent before:transition-opacity",
                  "after:pointer-events-none after:absolute after:top-0 after:right-0 after:h-full after:w-6 after:rounded-2xl after:bg-gradient-to-l after:from-[#f3f7fb] after:to-transparent after:transition-opacity",
                  isAtStart ? "before:opacity-0" : "before:opacity-100",
                  isAtEnd ? "after:opacity-0" : "after:opacity-100",
                  "lg:overflow-visible lg:scroll-px-0 lg:snap-none lg:before:hidden lg:after:hidden lg:gap-4"
                )}
              >
                <TabsTrigger
                  value="peintures"
                  className={tabTriggerClasses}
                >
                  Peintures & Ravalement
                </TabsTrigger>
                <TabsTrigger
                  value="informatique"
                  className={tabTriggerClasses}
                >
                  Renouvellement Informatique
                </TabsTrigger>
                <TabsTrigger
                  value="mobilier"
                  className={tabTriggerClasses}
                >
                  Mobilier scolaire
                </TabsTrigger>
                <TabsTrigger
                  value="acoustique"
                  className={tabTriggerClasses}
                >
                  Plafonds Acoustiques
                </TabsTrigger>
              </TabsList>

              <TabsContent value="peintures">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-playfair text-french-blue">
                      Plan Pluriannuel de Peinture et Ravalement (2025-2030)
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Préservation et embellissement du patrimoine bâti
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-french-blue mb-3">Introduction</h3>
                      <p className="text-gray-700 mb-4">
                        Afin de garantir un cadre de travail et d'apprentissage soigné, sécurisant, motivant et propice au bien-être de tous les usagers, un plan pluriannuel de rénovation a été établi pour la période 2025-2030. Ce plan vise à maintenir et valoriser le patrimoine immobilier de l'établissement. Il prend spécifiquement en compte la réalité climatique du Sénégal (air salin, chaleur, humidité) et les usages intensifs des locaux scolaires.
                      </p>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">PEINTURE MURS UNIQUEMENT (AVEC POSE DE FAUX-PLAFONDS ACOUSTIQUES)</h4>
                        <p className="text-yellow-700">
                          Ce scénario part du principe que les plafonds des salles, bureaux et de la salle polyvalente seront équipés de faux-plafonds acoustiques. La pose de ces faux-plafonds constitue un lot de travaux et un budget distincts, non inclus dans la présente note. Par conséquent, ce scénario ne budgétise que la peinture des murs.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-french-blue mb-3">Périmètre Concerné et Détail des Surfaces</h3>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Surfaces Intérieures à Peindre (Murs UNIQUEMENT)</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          <li>
                            <strong>Espaces Pédagogiques:</strong> 36 salles
                            <ul className="list-disc list-inside ml-4 mt-1">
                              <li>Surface Murs à peindre par salle type (60m² au sol): 70 m²</li>
                            </ul>
                          </li>
                          <li>
                            <strong>Espaces Administratifs:</strong> 8 bureaux
                            <ul className="list-disc list-inside ml-4 mt-1">
                              <li>Surface Murs à peindre par bureau type (20m² au sol): 50 m²</li>
                            </ul>
                          </li>
                          <li>
                            <strong>Espace Commun:</strong> 1 salle polyvalente (100 m² au sol)
                            <ul className="list-disc list-inside ml-4 mt-1">
                              <li>Surface Murs à peindre: estimée à 120 m²</li>
                            </ul>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Surfaces Extérieures à Ravaler (Façades)</h4>
                        <p className="text-gray-700">Total : 2 334 m²</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-french-blue mb-3">Spécifications Techniques</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Peinture Intérieure:</strong> Inclut la préparation des supports (lessivage, rebouchage, ponçage, sous-couche) et l'application de deux couches de peinture sur les murs uniquement. Les plafonds ne sont pas peints.</li>
                        <li><strong>Ravalement de Façade:</strong> Traitement complet des façades extérieures adaptées au climat local.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-french-blue mb-3">Cadence et Critères de Priorisation</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Peinture Intérieure (Murs uniquement):</strong> Roulement intégral sur 5 ans.</li>
                        <li><strong>Ravalement de Façade:</strong> Fractionné en 5 zones/bâtiments, environ 467 m² traités chaque année.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-french-blue mb-3">Hypothèses Budgétaires</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Coût unitaire peinture intérieure (murs uniquement): 3 500 FCFA/m²</li>
                        <li>Coût unitaire ravalement de façade: 5 000 FCFA/m²</li>
                        <li>Provision pour Imprévus et Ajustements: Marge de 10% ajoutée au budget annuel.</li>
                        <li>Recette Annuelle Écolages (Référence): 1 231 445 000 FCFA</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-french-blue mb-3">Synthèse Budgétaire sur 5 ans</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-2 py-2">Année</th>
                              <th className="border border-gray-300 px-2 py-2">Surface peinte (m²)</th>
                              <th className="border border-gray-300 px-2 py-2">Surface ravalée (m²)</th>
                              <th className="border border-gray-300 px-2 py-2">Coût total avec 10% imprévus (FCFA)</th>
                              <th className="border border-gray-300 px-2 py-2">% des écolages</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-2 py-2">Année 1</td>
                              <td className="border border-gray-300 px-2 py-2">710</td>
                              <td className="border border-gray-300 px-2 py-2">467</td>
                              <td className="border border-gray-300 px-2 py-2">5 336 100</td>
                              <td className="border border-gray-300 px-2 py-2 font-medium text-french-blue">0,43 %</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-2 py-2">Année 2</td>
                              <td className="border border-gray-300 px-2 py-2">540</td>
                              <td className="border border-gray-300 px-2 py-2">467</td>
                              <td className="border border-gray-300 px-2 py-2">4 647 500</td>
                              <td className="border border-gray-300 px-2 py-2 font-medium text-french-blue">0,38 %</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-2 py-2">Année 3</td>
                              <td className="border border-gray-300 px-2 py-2">590</td>
                              <td className="border border-gray-300 px-2 py-2">467</td>
                              <td className="border border-gray-300 px-2 py-2">4 840 000</td>
                              <td className="border border-gray-300 px-2 py-2 font-medium text-french-blue">0,39 %</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-2 py-2">Année 4</td>
                              <td className="border border-gray-300 px-2 py-2">590</td>
                              <td className="border border-gray-300 px-2 py-2">467</td>
                              <td className="border border-gray-300 px-2 py-2">4 840 000</td>
                              <td className="border border-gray-300 px-2 py-2 font-medium text-french-blue">0,39 %</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-2 py-2">Année 5</td>
                              <td className="border border-gray-300 px-2 py-2">660</td>
                              <td className="border border-gray-300 px-2 py-2">466</td>
                              <td className="border border-gray-300 px-2 py-2">5 627 600</td>
                              <td className="border border-gray-300 px-2 py-2 font-medium text-french-blue">0,46 %</td>
                            </tr>
                            <tr className="bg-gray-100 font-bold">
                              <td className="border border-gray-300 px-2 py-2">TOTAL</td>
                              <td className="border border-gray-300 px-2 py-2">3 090</td>
                              <td className="border border-gray-300 px-2 py-2">2 334</td>
                              <td className="border border-gray-300 px-2 py-2">25 291 200</td>
                              <td className="border border-gray-300 px-2 py-2 font-medium text-french-blue">2,05 %</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-french-blue mb-3">Planification et Contrôle Qualité</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Planification Annuelle</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>Interventions programmées pendant les congés scolaires (avril, juillet-août, décembre)</li>
                            <li>Coordination avec les autres travaux d'entretien et maintenance</li>
                            <li>Planning détaillé communiqué en début d'année scolaire</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Contrôle Qualité</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>Sélection rigoureuse des prestataires (minimum 3 devis)</li>
                            <li>Cahier des charges précis avec spécifications techniques</li>
                            <li>Contrôle qualité systématique en fin de travaux</li>
                            <li>Garantie décennale exigée pour les travaux de façade</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-french-blue/10 to-blue-100 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3 text-french-blue">Conclusion</h4>
                      <p className="text-gray-700 mb-4">
                        Ce plan pluriannuel de peinture et ravalement représente un investissement total de 25,3 millions de FCFA sur 5 ans, soit en moyenne 5,1 millions de FCFA par an, correspondant à environ 0,41 % des recettes d’écolage annuelles.
                      </p>
                      <p className="text-gray-700 mb-4">
                        À l’issue de ce cycle, il conviendra probablement de relancer un plan similaire afin de maintenir une logique de roulement permanent, garantissant la pérennité et la performance du patrimoine immobilier.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="informatique">
                <RenouvellementInformatiqueTabs />
              </TabsContent>

              <TabsContent value="mobilier">
                <RenouvellementMobilierScolaire />
              </TabsContent>

              <TabsContent value="acoustique">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-playfair text-french-blue">
                      Amélioration des Plafonds Acoustiques
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Optimisation du confort sonore des espaces d'apprentissage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-10">
                    <div>
                      <p className="text-gray-700">
                        Les salles actuelles présentent des résonances importantes. Elles rendent les cours plus fatigants
                        pour les élèves et leurs enseignants et réduisent l'intelligibilité de la parole. Ce plan vise à
                        améliorer nettement le confort d'écoute et la concentration.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-2xl font-playfair font-bold text-french-blue">Pourquoi agir maintenant</h2>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Limiter la fatigue vocale des enseignants au quotidien.</li>
                        <li>Renforcer l'attention et la compréhension des élèves.</li>
                        <li>Préserver un climat de classe serein, propice aux apprentissages.</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-french-blue">Diagnostic et objectifs</h3>
                      <p className="text-gray-700">
                        Un audit détaillé a révélé que 25 salles pédagogiques, la salle polyvalente et plusieurs espaces
                        communs souffrent d'un temps de réverbération trop élevé, nuisant à la compréhension orale et à la
                        concentration. L'objectif est de ramener le niveau de réverbération à un standard confortable pour la
                        parole en classe, avec une baisse nette des résonances et une meilleure intelligibilité, tout en
                        améliorant la qualité architecturale des espaces.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-french-blue/10 border border-french-blue/20 p-4 rounded-lg">
                          <p className="text-sm uppercase tracking-wide text-french-blue font-semibold mb-1">Périmètre</p>
                          <p className="text-2xl font-bold text-french-blue">25 salles</p>
                          <p className="text-sm text-gray-600">Interventions prioritaires sur les salles de classe du 1er et 2e étage</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                          <p className="text-sm uppercase tracking-wide text-emerald-700 font-semibold mb-1">Coût total</p>
                          <p className="text-2xl font-bold text-emerald-700">30 M FCFA</p>
                          <p className="text-sm text-gray-600">1 200 000 FCFA par salle, matériaux et pose inclus</p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                          <p className="text-sm uppercase tracking-wide text-purple-700 font-semibold mb-1">Impact attendu</p>
                          <p className="text-2xl font-bold text-purple-700">Confort renforcé</p>
                          <p className="text-sm text-gray-600">Baisse nette des résonances et meilleure intelligibilité</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-french-blue">Analyse budgétaire</h3>
                      <p className="text-gray-700">
                        Sur la base des effectifs prévisionnels 2025-2026 (614 élèves) et des recettes d'écolage estimées à
                        <strong> 1&nbsp;231&nbsp;445&nbsp;000 FCFA</strong>, l'investissement représente une charge maîtrisée
                        pour l'établissement. Deux scénarios d'amortissement sont proposés pour garantir la soutenabilité du
                        projet.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 border border-gray-200 text-left">Scénario</th>
                              <th className="px-4 py-2 border border-gray-200 text-left">Coût annuel</th>
                              <th className="px-4 py-2 border border-gray-200 text-left">Impact sur les recettes</th>
                              <th className="px-4 py-2 border border-gray-200 text-left">Effort par élève/mois</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-4 py-3 border border-gray-200 font-medium">Amortissement 1 an</td>
                              <td className="px-4 py-3 border border-gray-200">30&nbsp;000&nbsp;000 FCFA</td>
                              <td className="px-4 py-3 border border-gray-200">2,44&nbsp;% des recettes annuelles</td>
                              <td className="px-4 py-3 border border-gray-200">4&nbsp;887 FCFA</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-4 py-3 border border-gray-200 font-medium">Amortissement 5 ans</td>
                              <td className="px-4 py-3 border border-gray-200">6&nbsp;000&nbsp;000 FCFA</td>
                              <td className="px-4 py-3 border border-gray-200">0,49&nbsp;% des recettes annuelles</td>
                              <td className="px-4 py-3 border border-gray-200">977 FCFA</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-french-blue">Plan d'étalement recommandé</h3>
                      <p className="text-gray-700">
                        La stratégie privilégiée consiste à répartir l'investissement sur la durée du plan 2026-2030 afin de
                        minimiser l'impact financier sur les familles et d'assurer une montée en gamme progressive des salles
                        d'apprentissage.
                      </p>
                      <p className="text-sm text-gray-600">
                        Priorité aux salles des 1er et 2e étages et à la salle polyvalente.
                      </p>
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm text-center">
                        <p className="text-sm uppercase tracking-wide text-gray-500">Plan d'étalement 2026-2030</p>
                        <p className="text-lg font-semibold text-french-blue">
                          Réalisation de 5 classes par an durant 5 ans
                        </p>
                        <p className="text-sm text-gray-600">Suivi acoustique post-travaux &amp; ajustements</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-2xl font-playfair font-bold text-french-blue">Priorités d'intervention</h2>
                      <p className="text-gray-700">
                        Le plan ne projette que l'installation de doubles plafonds acoustiques dans les espaces suivants.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 border border-gray-200 text-left">Salle</th>
                              <th className="px-4 py-2 border border-gray-200 text-left">Étage</th>
                              <th className="px-4 py-2 border border-gray-200 text-left">Année</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-4 py-3 border border-gray-200 font-semibold text-french-blue">
                                Priorité 1 – Côté « collège »
                              </td>
                              <td className="px-4 py-3 border border-gray-200">1er et 2e étages</td>
                              <td className="px-4 py-3 border border-gray-200">2026-2027</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-4 py-3 border border-gray-200 font-semibold text-french-blue">
                                Priorité 2 – Côté « lycée »
                              </td>
                              <td className="px-4 py-3 border border-gray-200">Rez-de-chaussée et niveaux supérieurs</td>
                              <td className="px-4 py-3 border border-gray-200">2028</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 border border-gray-200 font-semibold text-french-blue">
                                Priorité 3 – Sciences & primaire
                              </td>
                              <td className="px-4 py-3 border border-gray-200">Laboratoires & salles RDC</td>
                              <td className="px-4 py-3 border border-gray-200">2029-2030</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlanMaintenanceStrategique;
