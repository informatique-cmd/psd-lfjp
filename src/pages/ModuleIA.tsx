import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  FileCheck,
  GraduationCap,
  Link as LinkIcon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const highlights = [
  'Culture générale de l’IA et compréhension des modèles.',
  'Approche éthique : données, biais, usages responsables.',
  'Parcours PIX pour les élèves et les personnels.',
  'Accompagnement des enseignants via l’IRF et le réseau AEFE.',
];

const aefePoints = [
  'Innovation pédagogique nourrie par les outils et scénarios IA.',
  'Pratiques d’enseignement enrichies par des appuis numériques.',
  'Formations ciblées sur la maîtrise raisonnée des outils génératifs.',
];

const pixCompetences = [
  'Traitement et analyse des données.',
  'Compréhension des modèles automatiques et de leurs limites.',
  'Sécurité, protection et gouvernance des données.',
  'Esprit critique face aux productions générées par IA.',
  'Création numérique assistée par IA.',
];

const pillars = [
  {
    title: 'Comprendre l’IA',
    description:
      'Notions fondamentales, fonctionnement des modèles, limites et biais, avec des études de cas interdisciplinaire.',
    icon: BrainCircuit,
  },
  {
    title: 'Développer un usage critique et citoyen',
    description:
      'Ateliers d’analyse critique, EMI et EMC, réflexion éthique sur les algorithmes, comparaison productions humaines / IA.',
    icon: ShieldCheck,
  },
  {
    title: 'Utiliser l’IA comme outil pédagogique',
    description:
      'Aide à l’écriture, analyse de texte, langues, projets numériques et accompagnement des enseignants dans des usages raisonnés.',
    icon: Sparkles,
  },
];

const formationPoints = [
  'Formations majoritairement suivies via l’IRF, en cohérence avec la stratégie AEFE.',
  'Priorité donnée aux modules numérique, innovation et IA éducative.',
  'Développement d’une culture commune et sécurisation des usages auprès des élèves.',
];

const ModuleIA: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway bg-gradient-to-b from-slate-50 to-white">
      <Navbar showLogo={true} />

      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_-20%,rgba(14,116,144,0.12),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 text-sm text-cyan-900 bg-cyan-50 border border-cyan-200 rounded-full px-3 py-1">
            <Cpu className="w-4 h-4" />
            <span>Axe 3 – Digital, numérique, innovation technologique</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            Module IA
          </h1>
          <p className="mt-4 text-gray-700 max-w-3xl text-base sm:text-lg">
            Une page dédiée pour structurer la culture de l’intelligence artificielle au LFJP,
            articulée entre cadre national, stratégie AEFE et parcours PIX, avec un module local centré sur
            la compréhension, l’éthique et les usages pédagogiques.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
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
              <a href="https://pix.fr" target="_blank" rel="noreferrer">
                <BookOpenCheck className="mr-2 h-4 w-4" />
                En savoir plus sur PIX
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl bg-white border border-cyan-100 shadow-sm px-4 py-3"
              >
                <CheckCircle2 className="w-5 h-5 text-cyan-700 mt-1" />
                <p className="text-sm sm:text-base text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-sm border border-cyan-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileCheck className="w-5 h-5 text-cyan-700" />
                  Cadre national : orientations de l’Éducation nationale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 text-sm sm:text-base">
                <p>
                  L’intelligence artificielle est devenue un axe central du numérique éducatif en France. Les textes officiels
                  – stratégie « IA et Éducation », circulaires de rentrée, feuille de route du numérique éducatif – insistent
                  sur plusieurs priorités.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Développer une culture générale de l’IA : fonctionnement, données, modèles, limites, enjeux éthiques et biais algorithmiques.</li>
                  <li>Intégrer l’IA dans les enseignements : mathématiques, EMI, EMC.</li>
                  <li>Éduquer au numérique responsable : protection des données, esprit critique, usages raisonnés des outils génératifs.</li>
                  <li>Former les enseignants, en formation initiale et continue, pour des usages raisonné et éthiques de l’IA.</li>
                </ul>
                <p>
                  Cette dynamique sert les objectifs de citoyenneté numérique, de maîtrise critique des outils et d’innovation pédagogique.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-cyan-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <LinkIcon className="w-5 h-5 text-cyan-700" />
                  Cadre AEFE : stratégie du réseau
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 text-sm sm:text-base">
                <p>
                  L’AEFE accompagne la transformation numérique en intégrant l’IA dans l’innovation pédagogique, les pratiques
                  d’enseignement et les formations aux compétences numériques.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  {aefePoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p>
                  Les Instituts Régionaux de Formation (IRF) constituent un levier essentiel en proposant des modules sur les usages
                  éducatifs de l’IA, les enjeux éthiques et la maîtrise des outils numériques.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <Card className="shadow-sm border border-cyan-100 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <GraduationCap className="w-5 h-5 text-cyan-700" />
                Place de PIX dans le module IA
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-start text-sm sm:text-base text-gray-700">
              <div className="space-y-4">
                <p>
                  Les parcours PIX constituent le référentiel national des compétences numériques. Ils intègrent désormais des
                  compétences liées à l’intelligence artificielle et concernent à la fois les élèves et les personnels, ce qui
                  harmonise la culture numérique au sein du LFJP.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pixCompetences.map((item) => (
                    <div key={item} className="rounded-lg border border-cyan-100 bg-cyan-50/60 px-4 py-3">
                      <p className="text-sm font-medium text-cyan-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-white p-5 shadow-inner">
                <div className="inline-flex items-center gap-2 text-sm text-cyan-800 bg-white border border-cyan-100 rounded-full px-3 py-1">
                  <BookOpenCheck className="w-4 h-4" />
                  PIX – référentiel national
                </div>
                <p className="mt-3 text-sm leading-relaxed">
                  Objectif : une certification partagée qui renforce la maîtrise des données, la compréhension des modèles et
                  l’esprit critique face aux contenus générés par l’IA.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full sm:w-auto bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
                  asChild
                >
                  <a href="https://pix.fr/competences" target="_blank" rel="noreferrer">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Découvrir les parcours
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] items-stretch">
            <Card className="shadow-sm border border-cyan-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BrainCircuit className="w-5 h-5 text-cyan-700" />
                  Le Module IA au LFJP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm sm:text-base text-gray-700">
                <p>Un module structuré autour de trois piliers complémentaires :</p>
                <div className="grid gap-4 md:grid-cols-3">
                  {pillars.map((pillar) => (
                    <div key={pillar.title} className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-4 h-full">
                      <div className="flex items-center gap-2 text-cyan-900 font-semibold">
                        <pillar.icon className="w-5 h-5" />
                        <span>{pillar.title}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-cyan-900/80">{pillar.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-cyan-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Sparkles className="w-5 h-5 text-cyan-700" />
                  Formation des personnels au LFJP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm sm:text-base text-gray-700">
                <p>
                  La politique de formation du LFJP s’inscrit pleinement dans la dynamique AEFE pour diffuser les usages
                  responsables et innovants de l’IA.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  {formationPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p>
                  Cette stratégie renforce la cohérence pédagogique et sécurise l’usage de l’IA auprès des élèves.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-cyan-50 p-6 sm:p-8 shadow-sm text-center">
            <div className="inline-flex items-center gap-2 text-sm text-cyan-900 bg-white border border-cyan-100 rounded-full px-3 py-1">
              <Cpu className="w-4 h-4" />
              Module IA – ressources et accompagnement
            </div>
            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">Envie d’aller plus loin ?</h2>
            <p className="mt-3 text-gray-700 max-w-3xl mx-auto text-sm sm:text-base">
              Retrouvez les parcours PIX et les ressources numériques pour prolonger le module en classe, préparer les
              certifications et nourrir vos projets pédagogiques.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                className="bg-french-blue hover:bg-french-blue/90 text-white shadow-lg"
                asChild
              >
                <a href="https://pix.fr" target="_blank" rel="noreferrer">
                  <BookOpenCheck className="mr-2 h-4 w-4" />
                  En savoir plus
                </a>
              </Button>
              <Button
                variant="outline"
                className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
                asChild
              >
                <Link to="/curriculum-numerique-spiralaire">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour au curriculum numérique
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ModuleIA;
