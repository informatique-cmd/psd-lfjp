import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  ArrowLeft,
  BookOpen,
  ChartBar,
  CheckCircle2,
  Cpu,
  Layers,
  Network,
  Sparkles,
  Telescope,
  Users,
} from 'lucide-react';

const experimentationPoints = [
  "Intégration raisonnée de l'intelligence artificielle dans les apprentissages.",
  'Usages créatifs et collaboratifs des outils numériques (capsules vidéo, réalité augmentée, tablettes, classe mobile, codage, simulations interactives).',
  'Développement de projets interdisciplinaires (SNT, NSI, sciences, EMI, langues, arts, histoire-géographie).',
  'Expérimentation de dispositifs pédagogiques : classe inversée, pédagogie par projet, portfolios numériques, évaluations alternatives.',
];

const productionPoints = [
  'Création de tutoriels, fiches-outils, guides d’usages et supports de formation.',
  'Conception de ressources pédagogiques mutualisées (Canva Éducation, Google Workspace, Pronote, EDUKA).',
  'Mise en commun des pratiques via des espaces collaboratifs.',
  'Harmonisation progressive des compétences numériques via le Curriculum numérique spiralaire 2026-2030, en cohérence avec le CRCN et PIX.',
];

const researchPoints = [
  "Suivi des avancées en IA éducative, robotique, outils de simulation et narration numérique.",
  "Analyse de l’impact des pratiques numériques sur les apprentissages.",
  'Participation à des projets pilotes et dispositifs innovants du réseau AEFE.',
  'Diffusion des résultats de recherche-action au sein des équipes éducatives.',
];

const educationNationalePoints = [
  'Cadre de Référence des Compétences Numériques (CRCN).',
  'Certification PIX et attestation numérique en 6e.',
  'Éducation aux médias et à l’information (EMI) : esprit critique, lutte contre la désinformation, citoyenneté numérique.',
  'Stratégie ministérielle pour le numérique éducatif et doctrine nationale sur les usages de l’IA en contexte scolaire.',
];

const aefePoints = [
  'CAP 2030 : développement du numérique éducatif et accompagnement des pratiques innovantes.',
  'Promotion du plurilinguisme et des pédagogies actives appuyées sur le numérique.',
  'Formation continue des personnels, notamment via l’Institut Régional de Formation (IRF), avec un focus numérique et IA.',
  'Structuration des compétences citoyennes et médiatiques dans les établissements français à l’étranger.',
];

const communityBenefits = [
  'Renforcer la culture numérique de tous les élèves, du cycle 2 à la Terminale.',
  'Accompagner les personnels dans la transformation de leurs pratiques.',
  'Installer une culture commune de l’usage responsable, citoyen et sécurisé du numérique.',
  'Valoriser les projets, innovations et expérimentations portées par les équipes.',
];

const indicators = [
  'Taux de personnels formés au numérique et à l’IA.',
  'Progression des élèves dans les compétences du CRCN et PIX.',
  'Nombre de projets ou expérimentations numériques menés chaque année.',
  'Volume de productions et ressources mutualisées.',
  'Participation aux dispositifs de formation AEFE/IRF.',
  'Retours d’usage et analyses issues des projets de recherche-action.',
];

const LaboratoireNumerique: React.FC = () => {
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
            Laboratoire numérique
          </h1>
          <p className="mt-4 text-gray-700 max-w-4xl text-base sm:text-lg">
            Le Laboratoire numérique du LFJP est un espace dédié à l’innovation pédagogique, à l’accompagnement des équipes et
            au développement des pratiques numériques éducatives. Il répond aux orientations de l’Éducation nationale et de
            l’AEFE en matière de transformation numérique et s’inscrit dans l’Axe 3 du Plan Stratégique de Développement
            2026-2030.
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
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {experimentationPoints.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl bg-white border border-cyan-100 shadow-sm px-4 py-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-700 mt-1" />
                <p className="text-sm sm:text-base text-gray-700">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm sm:text-base text-gray-700 max-w-5xl">
            Le Laboratoire numérique accompagne les enseignants dans la conception, l’adaptation et l’analyse de séquences
            intégrant le numérique.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-sm border border-cyan-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BookOpen className="w-5 h-5 text-cyan-700" />
                  Production de ressources et mutualisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700 text-sm sm:text-base">
                <p>
                  Le Laboratoire numérique constitue un pôle de production interne qui structure les usages numériques de
                  l’établissement.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  {productionPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-cyan-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Telescope className="w-5 h-5 text-cyan-700" />
                  Recherche-action et prospective
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700 text-sm sm:text-base">
                <p>
                  Une veille active et l’étude des usages permettent d’anticiper les évolutions éducatives et d’alimenter les
                  pratiques.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  {researchPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-sm border border-cyan-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Network className="w-5 h-5 text-cyan-700" />
                  Références institutionnelles – Éducation nationale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700 text-sm sm:text-base">
                <ul className="space-y-2 list-disc list-inside">
                  {educationNationalePoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-cyan-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Layers className="w-5 h-5 text-cyan-700" />
                  Références institutionnelles – AEFE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700 text-sm sm:text-base">
                <ul className="space-y-2 list-disc list-inside">
                  {aefePoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
          <Card className="shadow-sm border border-cyan-100 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="w-5 h-5 text-cyan-700" />
                Le Laboratoire numérique au service de la communauté éducative
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 text-gray-700 text-sm sm:text-base">
              {communityBenefits.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg bg-cyan-50/60 border border-cyan-100 px-4 py-3">
                  <Sparkles className="w-5 h-5 text-cyan-700 mt-1" />
                  <p>{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16">
          <Card className="shadow-sm border border-cyan-100 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <ChartBar className="w-5 h-5 text-cyan-700" />
                Indicateurs de suivi
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 text-gray-700 text-sm sm:text-base">
              {indicators.map((indicator) => (
                <div key={indicator} className="flex items-start gap-3 rounded-lg bg-white border border-cyan-100 px-4 py-3 shadow-sm">
                  <Activity className="w-5 h-5 text-cyan-700 mt-1" />
                  <p>{indicator}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LaboratoireNumerique;
