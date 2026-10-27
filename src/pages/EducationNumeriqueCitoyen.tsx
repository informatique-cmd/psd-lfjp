import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  Link as LinkIcon,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

const nationalPoints = [
  'Compréhension critique des environnements numériques et de leurs logiques.',
  'Vérification, analyse et contextualisation rigoureuse des informations.',
  'Conscience des risques : données personnelles, vie privée, cyberharcèlement, exposition aux contenus illicites.',
  'Maîtrise des règles de civilité numérique (EMI, EMC, parcours éducatifs).',
];

const aefePoints = [
  'Usage responsable, éthique et sécurisé du numérique dans un réseau international.',
  'Apprentissage de la civilité et du respect en ligne dans des environnements multiculturels.',
  'Lutte contre les violences numériques : cyberharcèlement, manipulation, discriminations.',
  'Formations des enseignants et personnels pour accompagner les élèves sur ces enjeux.',
];

const pixThemes = [
  'Sécurité : mots de passe, données personnelles, protection contre les attaques.',
  'Communication et collaboration : civilité en ligne, règles de communication numérique, usages collectifs.',
  'Environnement numérique : gestion des traces, identité numérique, confidentialité.',
  'Information et données : recherche fiable, vérification des sources, lutte contre la désinformation.',
];

const lfjpCitizenship = [
  'Comprendre ses droits et devoirs en ligne.',
  'Adopter une posture éthique dans l’utilisation des outils numériques.',
  'Développer l’esprit critique face aux informations et aux images.',
  'Identifier les risques : cyberharcèlement, manipulation, usurpation, rumeurs.',
];

const lfjpSensibilisation = [
  'Interventions, semaines thématiques et ateliers en EMI, EMC et vie scolaire.',
  'Travail spécifique sur les réseaux sociaux, l’usage du téléphone et les comportements responsables.',
  'Actions coordonnées avec les CVC, CVL, délégués et éco-délégués.',
];

const lfjpParcours = [
  'Articulation avec les parcours citoyen, artistique et culturel, Avenir.',
  'Approche interdisciplinaire : français, histoire-géographie, SNT, langues, sciences.',
  'Progression spiralaire du primaire au lycée en lien avec le curriculum numérique.',
];

const formationPoints = [
  'Formations majoritairement suivies à l’Institut Régional de Formation (IRF).',
  'Modules centrés sur la citoyenneté numérique, l’EMI, l’éthique du numérique et la cybersécurité.',
  'Accompagnement des élèves face aux usages numériques pour développer une culture commune responsable.',
];

const EducationNumeriqueCitoyen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway bg-gradient-to-b from-slate-50 to-white">
      <Navbar showLogo={true} />

      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_-20%,rgba(14,116,144,0.12),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 text-sm text-cyan-900 bg-cyan-50 border border-cyan-200 rounded-full px-3 py-1">
            <Lock className="w-4 h-4" />
            <span>Citoyenneté numérique et sécurité</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            Éducation au numérique citoyen
          </h1>
          <p className="mt-4 text-gray-700 max-w-3xl text-base sm:text-lg">
            Une page structurée en cohérence avec le Module IA pour affirmer la responsabilité numérique au LFJP :
            cadre national, orientations AEFE, référentiel PIX et actions locales portées par la communauté éducative.
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
              className="bg-french-blue hover:bg-french-blue/90 text-white shadow-lg"
              asChild
            >
              <a href="https://pix.fr" target="_blank" rel="noreferrer">
                <BookOpenCheck className="mr-2 h-4 w-4" />
                En savoir plus
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {nationalPoints.map((item) => (
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
          <div className="grid gap-6 lg:grid-cols-2 items-start">
            <Card className="shadow-sm border border-cyan-100 bg-white h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <ShieldCheck className="w-5 h-5 text-cyan-700" />
                  Cadre national : une priorité de l’Éducation nationale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 text-sm sm:text-base">
                <p>
                  L’éducation au numérique citoyen constitue un axe majeur de la politique éducative française. La feuille de
                  route du numérique éducatif et les programmes officiels affirment la nécessité de former chaque élève à une
                  citoyenneté numérique complète :
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  {nationalPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p>
                  Le ministère insiste également sur l’identité numérique, les droits et devoirs en ligne, la responsabilité
                  individuelle et collective.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-cyan-100 bg-white h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Users className="w-5 h-5 text-cyan-700" />
                  Approche AEFE : une compétence essentielle dans un réseau international
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 text-sm sm:text-base">
                <p>
                  L’AEFE fait de la citoyenneté numérique un pilier de la formation des élèves, afin de sécuriser et d’éclairer
                  les usages dans un contexte mondialisé.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  {aefePoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p>
                  Les IRF jouent un rôle clé en proposant des formations dédiées : EMI, éthique numérique, cybersécurité,
                  pratiques enseignantes responsables et accompagnement des élèves face aux risques en ligne.
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
                PIX : référentiel structurant pour la citoyenneté numérique
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[1.15fr_1fr] items-start text-sm sm:text-base text-gray-700">
              <div className="space-y-4">
                <p>
                  PIX constitue la référence nationale pour mesurer et développer les compétences numériques des élèves et des
                  personnels. Le référentiel intègre directement les thématiques liées à la citoyenneté numérique.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pixThemes.map((theme) => (
                    <div key={theme} className="rounded-lg border border-cyan-100 bg-cyan-50/60 px-4 py-3">
                      <p className="text-sm font-medium text-cyan-900">{theme}</p>
                    </div>
                  ))}
                </div>
                <p>
                  Les parcours proposés permettent une progression spiralaire du primaire au lycée, en lien direct avec les
                  objectifs du LFJP pour une responsabilité numérique partagée.
                </p>
              </div>
              <div className="rounded-xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-white p-5 shadow-inner">
                <div className="inline-flex items-center gap-2 text-sm text-cyan-800 bg-white border border-cyan-100 rounded-full px-3 py-1">
                  <BookOpenCheck className="w-4 h-4" />
                  PIX – référentiel national
                </div>
                <p className="mt-3 text-sm leading-relaxed">
                  Objectif : certifier des compétences numériques citoyennes solides, renforcer la maîtrise des données,
                  sécuriser les usages et développer l’esprit critique face aux contenus en ligne.
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
                  <Sparkles className="w-5 h-5 text-cyan-700" />
                  L’éducation au numérique citoyen au LFJP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm sm:text-base text-gray-700">
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Former des citoyens numériques responsables</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    {lfjpCitizenship.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Sensibilisation et prévention</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    {lfjpSensibilisation.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Intégration au parcours éducatif</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    {lfjpParcours.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-cyan-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <ShieldCheck className="w-5 h-5 text-cyan-700" />
                  Formation des personnels au LFJP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm sm:text-base text-gray-700">
                <p>
                  La montée en compétence des personnels est un levier essentiel pour garantir un accompagnement cohérent et
                  exemplaire auprès des élèves.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  {formationPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p>
                  Objectif : développer une culture commune au service d’un usage raisonné et exemplaire du numérique dans
                  l’établissement.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-cyan-50 p-6 sm:p-8 shadow-sm text-center">
            <div className="inline-flex items-center gap-2 text-sm text-cyan-900 bg-white border border-cyan-100 rounded-full px-3 py-1">
              <ShieldCheck className="w-4 h-4" />
              Citoyenneté numérique – ressources et accompagnement
            </div>
            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">Envie d’aller plus loin ?</h2>
            <p className="mt-3 text-gray-700 max-w-3xl mx-auto text-sm sm:text-base">
              Explorez les ressources PIX et les actions locales pour renforcer la culture numérique citoyenne, préparer les
              certifications et sécuriser les usages quotidiens des élèves et des personnels.
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
                <Link to="/module-ia">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour au module IA
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

export default EducationNumeriqueCitoyen;
