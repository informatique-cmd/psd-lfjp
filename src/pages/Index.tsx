
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      <Hero title="Lycée Français Jacques Prévert" subtitle="Excellence, Respect, Créativité, Persévérance, Civisme" />

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-playfair font-bold text-french-blue mb-12 text-center animate-fade-in">
            Plan stratégique de développement du Lycée Français Jacques Prévert
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card className="border-none shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:-rotate-[0.35deg] transition-all duration-300 animate-fade-in bg-white h-full">
              <CardContent className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-playfair font-bold mb-4 text-french-blue">Méthode</h3>
                <p className="text-gray-600 mb-6">
                  Parcourez la démarche en 7 étapes et la gouvernance participative qui cadrent l'élaboration du
                  plan stratégique du LFJP.
                </p>
                <Link to="/methode" className="inline-flex items-center text-french-blue font-medium hover:underline group mt-auto pt-4">
                  Comprendre
                  <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:-rotate-[0.35deg] transition-all duration-300 animate-fade-in-delay-1 bg-white h-full">
              <CardContent className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-playfair font-bold mb-4 text-french-blue">Vision, Missions et Valeurs</h3>
                <p className="text-gray-600 mb-6">
                  Découvrez notre vision, nos missions éducatives et les valeurs qui guident quotidiennement notre
                  établissement dans la formation des citoyens du monde.
                </p>
                <Link to="/vision-missions-valeurs" className="inline-flex items-center text-french-blue font-medium hover:underline group mt-auto pt-4">
                  Découvrir
                  <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:-rotate-[0.35deg] transition-all duration-300 animate-fade-in-delay-2 bg-white h-full">
              <CardContent className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-playfair font-bold mb-4 text-french-blue">Diagnostic</h3>
                <p className="text-gray-600 mb-6">
                  Analysez la situation actuelle de notre établissement à travers les données des enquêtes
                  et l'évaluation des besoins qui orientent notre développement.
                </p>
                <Link to="/diagnostic" className="inline-flex items-center text-french-blue font-medium hover:underline group mt-auto pt-4">
                  Analyser
                  <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:-rotate-[0.35deg] transition-all duration-300 animate-fade-in-delay-3 bg-white h-full">
              <CardContent className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-playfair font-bold mb-4 text-french-blue">Plan Stratégique de Développement</h3>
                <p className="text-gray-600 mb-6">
                  Consultez notre Plan Stratégique de Développement 2026-2030 qui détaille nos objectifs,
                  actions et indicateurs pour les années à venir.
                </p>
                <Link to="/plan-strategique" className="inline-flex items-center text-french-blue font-medium hover:underline group mt-auto pt-4">
                  Consulter
                  <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-french-blue/5">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in lg:col-span-2">
            <CardContent className="p-8 space-y-6">
              <div className="flex">
                <div className="w-full h-[240px] bg-gradient-to-br from-french-blue/10 via-white to-french-blue/10 border border-french-blue/20 rounded-lg flex items-center justify-center p-6">
                  <img
                    src="https://i.imgur.com/OjzrXjM.png"
                    alt="Service de Coopération et d’Action Culturelle"
                    className="max-h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-french-blue font-semibold">Mot du poste diplomatique</p>
                <h3 className="text-2xl font-playfair font-bold text-french-blue">Service de Coopération et d’Action Culturelle</h3>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
                <p>
                  Le service de coopération et d’action culturelle salue l’élaboration du Plan Stratégique de Développement du
                  lycée Jacques Prévert, résultat d’un travail approfondi et concerté avec le comité de gestion, l’équipe de
                  direction et l’ensemble de la communauté éducative.
                </p>
                <p>
                  Ce document s’inscrit dans la continuité des orientations du réseau d’enseignement français à l’étranger et
                  constitue une feuille de route précieuse pour accompagner le développement de l’établissement pour les prochaines
                  années dans une direction clairement établie : celle de consolider un environnement d’apprentissage dans un climat
                  scolaire favorable mais exigeant, ouvert et inclusif.
                </p>
                <p>
                  Le service de coopération et d’action culturelle, à travers l’action du conseiller de coopération et d’action
                  culturelle et de l’attaché de coopération éducative, continuera d’accompagner l’établissement dans la mise en
                  œuvre des objectifs définis, en lien avec l'AEFE et l'ensemble des acteurs de la communauté éducative.
                </p>
                <div className="pt-2 space-y-2">
                  <div>
                    <p className="font-semibold text-gray-900">Laurent Viguié</p>
                    <p className="text-gray-700">Conseiller de coopération et d’action culturelle</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Carole Blaszczyk</p>
                    <p className="text-gray-700">Attachée régionale de coopération éducative</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
            <CardContent className="p-8 space-y-6">
              <div className="flex">
                <img
                  src="https://i.imgur.com/su3En9d.jpeg"
                  alt="Vignette du président du Comité de Gestion"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-french-blue font-semibold">Mot du président</p>
                <h3 className="text-2xl font-playfair font-bold text-french-blue">Comité de gestion</h3>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
                <p>
                  « Ensemble pour nos enfants » résonne avec une force particulière dans un établissement comme le
                  nôtre, où la gestion parentale et l’implication de toutes et tous sont au cœur de notre modèle. Il
                  souligne combien notre responsabilité est partagée, et combien la collaboration entre les familles,
                  les équipes pédagogiques et nos partenaires est essentielle pour offrir à chaque élève un cadre
                  propice à son développement intellectuel, humain et citoyen.
                </p>
                <p>
                  Dans un monde en constante évolution, il est crucial de ne jamais perdre de vue cette mission
                  fondamentale. La large consultation que nous avons conduite – auprès des parents, des personnels,
                  des élèves et de nos partenaires sénégalais – nous a permis de réaffirmer nos valeurs et de bâtir,
                  main dans la main, une vision ambitieuse et fédératrice pour les années à venir.
                </p>
                <p>
                  Notre lycée est une belle somme d’énergies, de compétences et de regards complémentaires. Les
                  nombreux échanges que nous avons eus ont fait émerger une intelligence collective précieuse, dont ce
                  plan stratégique est le fruit. C’est en unissant nos forces, en écoutant chacune des voix, que nous
                  parviendrons à toujours mieux accompagner nos enfants, à les faire grandir et à leur donner les clés
                  pour construire un avenir serein et prometteur.
                </p>
                <p>
                  Le Plan Stratégique 2026-2031 est donc le reflet de votre parole, de vos aspirations et de votre
                  engagement. Nous espérons que vous vous y reconnaîtrez, car il a été conçu avec vous… et pour eux,
                  pour nos enfants.
                </p>
                <p>
                  C’est avec une grande fierté que nous continuons à écrire, ensemble, les belles pages du Lycée
                  Français Jacques Prévert. Merci à toutes et à tous de votre confiance et de votre dynamisme.
                </p>
                <p>Le plus beau reste à venir… ensemble pour nos enfants !</p>
                <div className="pt-2">
                  <p className="font-semibold text-gray-900">Le Président du Comité de Gestion,</p>
                  <p className="font-semibold text-gray-900">Omar V. Benson</p>
                  <p className="text-gray-700">Au nom de toute la communauté éducative du LFJP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-delay-1">
            <CardContent className="p-8 space-y-6">
              <div className="flex">
                <img
                  src="https://i.imgur.com/kIXNjzR.jpeg"
                  alt="Vignette de la direction pédagogique"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-french-blue font-semibold">Mot de la direction pédagogique</p>
                <h3 className="text-2xl font-playfair font-bold text-french-blue">Proviseur et directrice du primaire</h3>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
                <p>
                  Le Lycée Français Jacques Prévert a connu un essor remarquable, marqué par son installation en 2022
                  dans un établissement neuf et des espaces élargis. Si la préservation et la valorisation de ces
                  actifs immobiliers constituent une priorité absolue pour le Comité de Gestion, notre ambition
                  commune allait plus loin.
                </p>
                <p>
                  En tant que membres du Comité de Gestion, la Directrice et le Proviseur ont porté, avec les
                  représentants des parents, une volonté forte : celle de s'engager dans l'élaboration d'un document
                  unique. Ce document fusionne désormais le Plan Stratégique de Développement — intégrant les
                  investissements à moyen et long terme — et le Projet d'Établissement incluant le Projet d’Ecole.
                  Vous trouverez ainsi dans ces pages une vision globale. Les informations relevant du cap pédagogique
                  que nous donnons à l'établissement y sont aussi prépondérantes, sinon plus, que les projets
                  d'investissement.
                </p>
                <p>
                  S'il est théoriquement admis que les investissements doivent servir la pédagogie et l'accueil des
                  élèves, la réalité d'un établissement en gestion parentale rend parfois complexe l'alignement du
                  temps financier et du temps éducatif. C'est pourtant le pari que nous faisons aujourd'hui
                  collectivement : parents, enseignants et élèves.
                </p>
                <p>
                  Si le concept de communauté éducative demeure bien souvent une utopie, ce Plan Stratégique de
                  Développement est la preuve que nous parvenons à le concrétiser. Il témoigne qu'au prix d'efforts
                  inlassables, cet idéal devient ici quelque chose de très concret, imbriquant enfin la gestion et la
                  pédagogie.
                </p>
                <p>
                  Finalement, cette mobilisation collective ne doit avoir qu’une seule boussole. Au-delà des stratégies
                  et
                  des structures, ce sont les élèves qui constituent le cœur battant de notre établissement. C’est pour
                  leur épanouissement et leur réussite future que nous déployons toute cette énergie, en veillant à
                  replacer invariablement leurs intérêts au centre de chacune de nos intentions, de nos discussions et
                  de nos actions.
                </p>
                <div className="pt-2">
                  <p className="font-semibold text-gray-900">Bastien Capel - Proviseur</p>
                  <p className="font-semibold text-gray-900">Nathalie Maginot-France - Directrice du primaire</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
