import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Home,
  Wifi,
  Network,
  ShieldCheck,
  Laptop,
  Cable,
  CalendarRange,
  RadioTower,
  Users,
} from 'lucide-react';

const timeline = [
  {
    year: '2026',
    title: 'Nouvelles bornes Wi-Fi + informaticien',
    description: 'Renforcement de la couverture et prise de fonction de l’administrateur réseau.',
    icon: RadioTower,
  },
  {
    year: '2027',
    title: 'Couverture des zones périphériques',
    description: 'Extension aux nouvelles salles et espaces collaboratifs.',
    icon: Wifi,
  },
  {
    year: '2028',
    title: 'Étude ligne professionnelle',
    description: 'Analyse technique et budgétaire du passage à un débit professionnel.',
    icon: Cable,
  },
  {
    year: '2029',
    title: 'Décision de déploiement',
    description: 'Arbitrage budgétaire et contractualisation éventuelle.',
    icon: CalendarRange,
  },
  {
    year: '2030',
    title: 'Établissement totalement interconnecté',
    description: 'Connectivité sécurisée et performante sur l’ensemble du campus.',
    icon: Network,
  },
];

const Connectivite20 = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo />

      <section className="bg-gradient-to-r from-french-blue via-blue-700 to-blue-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-6 space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] font-semibold text-blue-100">Établissement digitalisé et partenariats</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold">Connectivité 2.0</h1>
          <p className="text-lg md:text-xl max-w-3xl font-light">
            Une infrastructure réseau modernisée pour soutenir les usages pédagogiques, la communication et l’administration numérique du LFJP.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
          asChild
        >
          <Link to="/plan-strategique" state={{ axe: 'axe3' }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au plan stratégique
          </Link>
        </Button>
        <Button
          variant="outline"
          className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
          asChild
        >
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Link>
        </Button>
      </div>

      <main className="container mx-auto px-6 pb-16 space-y-10">
        <section className="grid gap-6 lg:grid-cols-[1.5fr,1fr] items-stretch">
          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl text-french-blue">
                <Wifi className="h-6 w-6" aria-hidden="true" />
                1. Contexte : un établissement désormais connecté (2023-2025)
              </CardTitle>
              <CardDescription>Modernisation continue et stabilisation des usages quotidiens.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Depuis 2023, le LFJP a modernisé l’ensemble de son infrastructure numérique : déploiement complet du Wi-Fi, renforcements successifs, stabilisation de la bande passante, amélioration des salles technologiques.
              </p>
              <p>
                La connectivité permet aujourd’hui le fonctionnement des outils institutionnels (Pronote, Google Workspace, certifications PIX, continuité pédagogique, administration numérique).
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-l-4 border-french-blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-french-blue" aria-hidden="true" />
                Principes de qualité réseau
              </CardTitle>
              <CardDescription>Fiabilité, sécurité et support aux usages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>Couverture homogène et bande passante stabilisée pour les flux pédagogiques et administratifs.</li>
                <li>Supervision renforcée des équipements et mises à jour régulières.</li>
                <li>Priorisation des services critiques : Pronote, Google Workspace, évaluations et certifications.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 items-stretch">
          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl text-french-blue">
                <Network className="h-6 w-6" aria-hidden="true" />
                2. Nouveaux besoins (2025-2027)
              </CardTitle>
              <CardDescription>Extension et adaptation pour les usages avancés.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Déploiement de la connectivité dans les nouvelles salles de classe et la nouvelle salle des professeurs, amélioration des salles 1 et 8, adaptation du réseau pour les usages pédagogiques avancés (IA, PIX, multimédias, projets collaboratifs, Laboratoire numérique).
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="text-sm font-semibold text-french-blue mb-1">Pédagogie & innovation</p>
                  <p className="text-sm text-gray-700">Support des séquences IA, projets multimédia et certifications PIX en simultané.</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="text-sm font-semibold text-french-blue mb-1">Espaces en expansion</p>
                  <p className="text-sm text-gray-700">Nouvelles classes, salle des professeurs et salles 1 et 8 alignées sur les standards de connectivité.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl text-french-blue">
                <Laptop className="h-6 w-6" aria-hidden="true" />
                3. Connectivité et communication
              </CardTitle>
              <CardDescription>Infrastructure essentielle aux échanges internes et externes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Présentation de la connectivité comme infrastructure essentielle de la communication interne/externe : site, Petit Prévert, coordination pédagogique, vie scolaire, gestion administrative.
              </p>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-french-blue font-semibold">
                <span className="bg-blue-50 border border-blue-100 rounded-full px-3 py-1">Site & newsletter</span>
                <span className="bg-blue-50 border border-blue-100 rounded-full px-3 py-1">Coordination pédagogique</span>
                <span className="bg-blue-50 border border-blue-100 rounded-full px-3 py-1">Vie scolaire</span>
                <span className="bg-blue-50 border border-blue-100 rounded-full px-3 py-1">Administration</span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr] items-stretch">
          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl text-french-blue">
                <Users className="h-6 w-6" aria-hidden="true" />
                4. Recrutement d’un informaticien en 2026
              </CardTitle>
              <CardDescription>Renforcer l’expertise interne et la cybersécurité.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                - recrutement d’un informaticien-administrateur réseau à partir de 2026.
              </p>
              <p>
                Rôle : gestion du réseau, maintenance informatique, développement des outils numériques internes, accompagnement pédagogique, cybersécurité, pilotage des projets numériques.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-l-4 border-french-blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-french-blue" aria-hidden="true" />
                Gouvernance & support
              </CardTitle>
              <CardDescription>Un pilotage aligné sur les priorités pédagogiques.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>Animation du Laboratoire numérique et accompagnement des équipes.</li>
                <li>Planification des maintenances et sécurisation des données.</li>
                <li>Suivi des indicateurs de performance réseau et des usages pédagogiques.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr] items-stretch">
          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl text-french-blue">
                <Cable className="h-6 w-6" aria-hidden="true" />
                5. Perspectives : étude d’une ligne professionnelle
              </CardTitle>
              <CardDescription>Projection budgétaire et montée en débit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Étudier le passage à une ligne professionnelle haut débit (coût estimé : 400 000 FCFA mensuels) et son intégration dans la projection budgétaire pluriannuelle.
              </p>
              <Separator />
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-french-blue">Étude de faisabilité 2028</span>
                <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-french-blue">Budget récurrent estimé : 400 000 FCFA/mois</span>
                <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-french-blue">Intégration au plan pluriannuel</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl text-french-blue">
                <CalendarRange className="h-6 w-6" aria-hidden="true" />
                6. Frise 2026-2030
              </CardTitle>
              <CardDescription>Les jalons d’un établissement totalement interconnecté.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {timeline.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.year} className="relative pl-10">
                      {index !== timeline.length - 1 && (
                        <span className="absolute left-[11px] top-6 h-full w-px bg-blue-100" aria-hidden="true" />
                      )}
                      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-french-blue border border-blue-100">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="bg-white/60 border border-slate-200 rounded-lg p-3 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-french-blue">{step.year}</p>
                        <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                        <p className="text-sm text-gray-700">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Connectivite20;
