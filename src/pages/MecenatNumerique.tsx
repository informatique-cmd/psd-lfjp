import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ArrowLeft,
  Home,
  Lightbulb,
  CalendarRange,
  Users,
  Sparkles,
  LineChart,
  ShieldCheck,
  Network
} from 'lucide-react';

const responsables = [
  'Proviseur (pilotage global)',
  'RAF (gestion du fonds et suivi budgétaire)',
  'Référents numériques enseignants (besoins pédagogiques et formations)',
  'Comité de pilotage numérique (représentants élèves/parents/partenaires)'
];

const calendrier = [
  '2026 : Création du fonds et élaboration de la charte d’utilisation.',
  '2026-2027 : Lancement des premiers appels à mécénat et partenariats locaux/internationaux.',
  '2027-2028 : Premiers financements d’équipements et modules de formation.',
  '2029-2030 : Extension et consolidation du fonds, bilan et pérennisation dans le budget LFJP.'
];

const moyensMobilises = [
  'Partenariats entreprises (télécoms, banques, énergie, tech).',
  'Appels à projets (AEFE, UE, SCAC, coopérations franco-sénégalaises).',
  'Contributions volontaires des familles et des anciens élèves.',
  'Gestion comptable dédiée avec fonds fléché et transparence.'
];

const actionsPrevues = [
  "Renouvellement et extension du parc numérique (classes mobiles, tablettes, vidéoprojecteurs, logiciels).",
  "Formations régulières pour enseignants et élèves (IA, usages responsables, cybersécurité, création numérique).",
  "Dispositifs adaptés pour élèves à besoins particuliers.",
  "Appui budgétaire et portefeuille de projets 'prêts à financer' (salle de codage, fablab, studios numériques, etc.).",
  "Organisation d'événements de lancement : un temps interne (café ou soirée) et un temps externe multimédia en lien avec les membres de l'APE.",
  "Financement de projets innovants interdisciplinaires (laboratoire numérique, PEAC numérique, projets IA éducative)."
];

const parcoursEducatifs = [
  {
    title: 'Parcours Avenir',
    description: 'Découverte des métiers du numérique et de l’innovation.'
  },
  {
    title: 'Parcours Citoyen',
    description: 'Éducation aux médias et citoyenneté numérique.'
  },
  {
    title: 'Parcours Santé',
    description: 'Prévention des usages excessifs et équilibre numérique.'
  },
  {
    title: 'PEAC',
    description: 'Développement de projets artistiques et créatifs numériques.'
  }
];

const indicateurs = [
  '% d’élèves équipés par niveau.',
  'Nombre d’enseignants et d’élèves formés chaque année.',
  'Montant annuel levé par mécénat et partenariats.',
  'Nombre de projets pédagogiques numériques financés.',
  'Taux de satisfaction enseignants/élèves (enquêtes annuelles).'
];

const perennisation = [
  'Inscription du fonds dans le budget prévisionnel du LFJP.',
  'Gestion rigoureuse et fidélisation des mécènes au sein d’un réseau durable.',
  'Valorisation annuelle auprès de la communauté éducative et des partenaires.'
];

const ficheTable = [
  {
    label: 'Intitulé de l’action',
    value: 'Fonds de mécénat numérique pour l’équipement et la formation'
  },
  {
    label: 'Objectif stratégique',
    value:
      'Garantir l’équité d’accès aux outils numériques, soutenir l’innovation pédagogique et renforcer les compétences numériques des élèves et personnels, dans le respect de la neutralité commerciale.'
  },
  {
    label: 'Responsables',
    value:
      'Proviseur (pilotage global) • RAF (gestion et suivi budgétaire) • Référents numériques enseignants (besoins pédagogiques, formations) • Comité de pilotage numérique (parents/élèves/partenaires).'
  },
  {
    label: 'Calendrier',
    value:
      '2026 : création du fonds et charte d’utilisation • 2026-2027 : lancement des appels à mécénat et partenariats • 2027-2028 : premiers financements (équipements, formations) • 2029-2030 : extension, consolidation et bilan.'
  },
  {
    label: 'Moyens mobilisés',
    value:
      'Partenariats entreprises (télécoms, banques, énergie, tech) • Appels à projets (AEFE, UE, SCAC, coopérations) • Contributions volontaires familles et anciens élèves • Gestion comptable dédiée et transparente.'
  },
  {
    label: 'Actions prévues',
    value:
      "Renouvellement et extension du parc numérique (classes mobiles, tablettes, vidéoprojecteurs, logiciels) • Formations régulières enseignants/élèves (IA, cybersécurité, usage responsable, création numérique) • Dispositifs adaptés pour élèves à besoins particuliers • Appui budgétaire et projets 'prêts à financer' (salle de codage, fablab, studios numériques...) • Événements de lancement internes et externes (café/soirée, rendez-vous multimédia avec l'APE) • Projets innovants interdisciplinaires (laboratoire numérique, PEAC numérique, projets IA éducative)."
  },
  {
    label: 'Articulation parcours éducatifs',
    value:
      'Parcours Avenir : métiers du numérique et de l’innovation • Parcours Citoyen : éducation aux médias, citoyenneté numérique • Parcours Santé : prévention des usages excessifs, équilibre numérique • PEAC : projets artistiques et créatifs numériques.'
  },
  {
    label: 'Indicateurs de suivi',
    value:
      '% d’élèves équipés • Nombre d’enseignants et d’élèves formés/an • Montant levé par mécénat et partenariats • Nombre de projets pédagogiques numériques financés • Taux de satisfaction enseignants/élèves (enquêtes annuelles).'
  },
  {
    label: 'Perspectives de pérennisation',
    value:
      'Inscription du fonds dans le budget LFJP • Gestion rigoureuse et fidélisation des mécènes au sein d’un réseau durable • Valorisation annuelle auprès de la communauté éducative et partenaires.'
  }
];

const MecenatNumerique = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />

      <section className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">
            Mécénat numérique
          </h1>
          <p className="text-lg md:text-xl max-w-3xl font-light">
            Un fonds dédié pour garantir l’équité d’accès aux outils numériques, soutenir l’innovation
            pédagogique et développer les compétences de toute la communauté éducative.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
          asChild
        >
          <Link to="/plan-strategique" state={{ axe: 'axe4' }}>
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
        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Lightbulb className="h-6 w-6 text-amber-500" aria-hidden="true" />
              <div>
                <CardTitle>Objectif stratégique</CardTitle>
                <CardDescription>Cap vers l’innovation et l’équité numérique</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-gray-700">
                Garantir l’équité d’accès aux outils numériques, soutenir l’innovation pédagogique et renforcer
                les compétences numériques des élèves et des personnels, en mobilisant des financements
                complémentaires aux écolages et dans le respect de la neutralité commerciale.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" aria-hidden="true" />
              <div>
                <CardTitle>Responsables</CardTitle>
                <CardDescription>Une gouvernance partagée</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                {responsables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <CalendarRange className="h-6 w-6 text-emerald-600" aria-hidden="true" />
              <div>
                <CardTitle>Calendrier</CardTitle>
                <CardDescription>Une montée en puissance 2026-2030</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                {calendrier.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Network className="h-6 w-6 text-purple-600" aria-hidden="true" />
              <div>
                <CardTitle>Moyens mobilisés</CardTitle>
                <CardDescription>Une dynamique partenariale</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                {moyensMobilises.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Sparkles className="h-6 w-6 text-fuchsia-600" aria-hidden="true" />
              <div>
                <CardTitle>Actions prévues</CardTitle>
                <CardDescription>Des leviers concrets au service du numérique</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                {actionsPrevues.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-sky-600" aria-hidden="true" />
              <div>
                <CardTitle>Articulation avec les parcours éducatifs</CardTitle>
                <CardDescription>Un ancrage dans les parcours de l'élève</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                {parcoursEducatifs.map((item) => (
                  <li key={item.title}>
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <LineChart className="h-6 w-6 text-teal-600" aria-hidden="true" />
              <div>
                <CardTitle>Indicateurs de suivi</CardTitle>
                <CardDescription>Mesurer l'impact chaque année</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                {indicateurs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-green-600" aria-hidden="true" />
              <div>
                <CardTitle>Perspectives de pérennisation</CardTitle>
                <CardDescription>Installer durablement le fonds</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                {perennisation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Fiche-action récapitulative</CardTitle>
              <CardDescription>Version tableau pour intégration au canevas PSD</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rubrique</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ficheTable.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="font-semibold text-slate-800">{row.label}</TableCell>
                      <TableCell className="text-gray-700">{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MecenatNumerique;
