import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Leaf,
  Award,
  Users,
  Sun,
  Recycle,
  Utensils,
  BookOpen,
  HandHeart,
  Globe2,
  Network,
  ArrowLeft,
  Home
} from 'lucide-react';

type Pillar = {
  title: string;
  icon: React.ElementType;
  accent: string;
  highlights: string[];
};

const PolitiqueE3D = () => {
  const navigate = useNavigate();

  const pillars: Pillar[] = [
    {
      title: 'Gouvernance et pilotage',
      icon: Users,
      accent: 'text-emerald-600',
      highlights: [
        'Comité E3D dynamique réunissant élèves, personnels, parents et partenaires locaux.',
        "Intégration systématique de l'éducation au développement durable dans le projet d'établissement, le règlement intérieur, les parcours éducatifs et la communication.",
        'Formation des personnels et animation du réseau des éco-délégués sur tous les niveaux.'
      ]
    },
    {
      title: 'Gestion durable des ressources et infrastructures',
      icon: Sun,
      accent: 'text-amber-600',
      highlights: [
        'Plan pluriannuel de climatisation solaire et d’efficacité énergétique pour des bâtiments résilients.',
        'Déploiement d’espaces verts : cours oasis, ombrage, végétalisation favorisant la biodiversité locale.',
        'Réduction, tri, recyclage et valorisation des déchets (cantine, papier, plastique, compost).',
        'Transition numérique responsable : prolonger la durée de vie des équipements et programmer un renouvellement raisonné.'
      ]
    },
    {
      title: 'Alimentation et santé',
      icon: Utensils,
      accent: 'text-orange-600',
      highlights: [
        'Restauration scolaire améliorée avec des menus équilibrés intégrant des produits locaux et de saison.',
        'Sensibilisation de toute la communauté à la nutrition durable et aux circuits courts.',
        'Dispositifs pour mesurer et réduire le gaspillage alimentaire.'
      ]
    },
    {
      title: 'Pédagogie et parcours éducatifs',
      icon: BookOpen,
      accent: 'text-blue-600',
      highlights: [
        "Intégration de l'EDD dans toutes les disciplines et les projets interdisciplinaires.",
        'Lien renforcé avec les quatre parcours éducatifs : santé, citoyen, avenir et PEAC (projets artistiques sur l’écologie).',
        'Partenariats avec associations et collectivités de la Petite Côte pour ancrer les apprentissages dans le territoire.'
      ]
    },
    {
      title: 'Vie scolaire et climat éducatif',
      icon: HandHeart,
      accent: 'text-rose-600',
      highlights: [
        'Éco-délégués formés et impliqués dans les conseils et actions collectives.',
        'Campagnes régulières de sensibilisation sur l’eau, l’énergie, la biodiversité et le climat.',
        'Actions visibles et engageantes : journées sans plastique, collectes solidaires, mobilité douce vers le lycée.'
      ]
    },
    {
      title: 'Rayonnement et coopération',
      icon: Globe2,
      accent: 'text-sky-600',
      highlights: [
        'Participation active aux réseaux EFE3D et AEFE dédiés au développement durable.',
        'Valorisation des projets dans les médias scolaires et locaux pour inspirer la communauté.',
        'Partenariats avec ONG, institutions sénégalaises et acteurs de la Petite Côte.'
      ]
    }
  ];

  const strategicLevers = [
    {
      label: 'Axe 1',
      description: 'Bien-être et climat scolaire',
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      label: 'Axe 2',
      description: 'Plurilinguisme et ouverture',
      color: 'bg-sky-100 text-sky-800'
    },
    {
      label: 'Axe 3',
      description: 'Innovation numérique responsable',
      color: 'bg-amber-100 text-amber-800'
    },
    {
      label: 'Axe 4',
      description: 'Réussites citoyennes et environnementales',
      color: 'bg-emerald-200 text-emerald-900'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />

      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Leaf className="h-14 w-14" />
            <div>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold">Politique E3D du LFJP</h1>
              <p className="text-lg md:text-2xl text-emerald-100 mt-2">
                Une stratégie d’expertise pour l’éducation au développement durable
              </p>
            </div>
          </div>
          <p className="max-w-3xl text-base md:text-lg text-emerald-50">
            En 2025, le Lycée Français Jacques Prévert de Saly a obtenu le label EFE3D niveau 3 (Expertise),
            reconnaissant une démarche cohérente, transversale et pérenne en matière d’EDD. Cette page
            présente les priorités intégrées au Plan Stratégique de Développement 2026-2030.
          </p>
          <div className="mt-10 flex justify-center">
            <img
              src="https://i.imgur.com/6qHXL3T.png"
              alt="Logo du label EFE3D niveau 3 obtenu par le LFJP en 2025"
              className="w-full max-w-md rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-4 flex gap-2">
        <Button variant="outline" onClick={() => navigate('/plan-strategique')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" />
          Accueil
        </Button>
      </div>

      <div className="flex-1 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 py-12 space-y-10">
          <Card className="border-emerald-200 shadow-sm">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-amber-500" />
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  Label EFE3D niveau 3 — Expertise
                </CardTitle>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                2025
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Ce niveau distingue les établissements capables de relier innovation pédagogique, ancrage local
                et ouverture internationale. Il confirme la maturité de la gouvernance E3D du LFJP et son rôle de
                référence au sein du réseau AEFE.
              </p>
              <p>
                L’ambition : faire de l’E3D un levier transversal qui irrigue l’ensemble des actions du PSD et
                mobilise toute la communauté éducative autour d’objectifs mesurables et partagés.
              </p>
            </CardContent>
          </Card>

          <section className="grid gap-6 md:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card key={pillar.title} className="border-t-4 border-emerald-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full bg-emerald-50 p-2 ${pillar.accent}`}>
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <CardTitle className="text-xl text-slate-900">{pillar.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-2 pl-5 text-gray-700">
                      {pillar.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <Card className="border-emerald-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Recycle className="h-7 w-7 text-emerald-600" />
                <CardTitle className="text-2xl text-slate-900">Une dynamique collective et visible</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-700">
              <p>
                Le comité E3D coordonne un calendrier d’actions concrètes et fédératrices. Chaque cycle scolaire
                s’approprie les enjeux du développement durable grâce à des projets vécus et évalués.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                    Engagement des élèves
                  </h3>
                  <p className="mt-2 text-sm">
                    Éco-délégués accompagnés, budgets participatifs verts, médiation et actions solidaires.
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                    Communauté mobilisée
                  </h3>
                  <p className="mt-2 text-sm">
                    Formations des personnels, ateliers familles, communication régulière (site, Petit Prévert,
                    événements).
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                    Territoire partenaire
                  </h3>
                  <p className="mt-2 text-sm">
                    Coopérations avec les collectivités, ONG et acteurs économiques de la Petite Côte.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Network className="h-7 w-7 text-sky-600" />
                <CardTitle className="text-2xl text-slate-900">
                  Rayonnement et alliances pour la transition
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Le LFJP partage ses réussites au sein des réseaux EFE3D et AEFE, tout en capitalisant les bonnes
                pratiques des établissements partenaires. Les projets menés sont valorisés dans les médias scolaires
                et locaux pour inspirer d’autres communautés éducatives.
              </p>
              <p>
                Ces collaborations renforcent la visibilité des initiatives locales : protection du littoral, économie
                circulaire, agriculture durable et innovations pédagogiques portées avec les acteurs de la Petite Côte.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Leaf className="h-7 w-7 text-emerald-600" />
                <CardTitle className="text-2xl text-slate-900">Impact stratégique 2026-2030</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-700">
              <p>
                L’E3D devient un levier transversal des quatre axes du Plan Stratégique de Développement 2026-2030.
                Il garantit la cohérence entre bien-être, ouverture internationale, innovation numérique responsable
                et engagement citoyen.
              </p>
              <div className="grid gap-4 md:grid-cols-4">
                {strategicLevers.map((lever) => (
                  <div
                    key={lever.label}
                    className={`rounded-xl border border-emerald-100 p-4 text-center shadow-sm ${lever.color}`}
                  >
                    <p className="text-sm font-semibold">{lever.label}</p>
                    <p className="mt-1 text-xs font-medium">{lever.description}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Le maintien du label EFE3D niveau 3 est suivi par des indicateurs : satisfaction des usagers,
                climat scolaire, progrès environnementaux et ancrage territorial des projets.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PolitiqueE3D;
