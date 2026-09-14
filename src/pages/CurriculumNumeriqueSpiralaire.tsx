import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Network,
  ShieldCheck,
  Cpu,
  BookOpenCheck,
  Globe2,
  LineChart,
  Layers3,
  Workflow,
  Link as LinkIcon,
  ArrowLeft,
  Home,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="opacity-0 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-sm sm:text-base text-gray-600">{subtitle}</p>}
      </div>
      <div className="mt-6 sm:mt-8">{children}</div>
    </section>
  );
}

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6">{children}</div>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{children}</span>
);

type Domaine = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
  exemples: string[];
};

type Module = {
  title: string;
  points: string[];
};

type Ressource = {
  label: string;
  href: string;
};

const CurriculumNumeriqueSpiralaire: React.FC = () => {
  const domaines = useMemo<Domaine[]>(
    () => [
      {
        icon: BookOpenCheck,
        title: 'Information et données',
        desc: "Rechercher, analyser et vérifier l'information ; exploiter et représenter des données.",
        exemples: ['Recherche documentaire', 'Fact-checking', 'Datavis'],
      },
      {
        icon: Network,
        title: 'Communication et collaboration',
        desc: 'Interagir, coopérer et publier dans des environnements numériques.',
        exemples: ['Projets partagés', 'ENT / Workspace', 'Échanges AEFE'],
      },
      {
        icon: Layers3,
        title: 'Création de contenus',
        desc: 'Produire des documents, médias et programmes.',
        exemples: ['Podcasts', 'Vidéos / Web', 'Code'],
      },
      {
        icon: ShieldCheck,
        title: 'Protection et sécurité',
        desc: 'Cybersécurité, identité et données personnelles, RGPD.',
        exemples: ['Hygiène numérique', 'Paramétrages', 'Sensibilisation'],
      },
      {
        icon: Cpu,
        title: 'Environnement numérique',
        desc: "Prendre en main outils, services et infrastructures de l’établissement.",
        exemples: ['PC lycéen', 'Classe mobile', 'ENT'],
      },
    ],
    []
  );

  const modules: Module[] = [
    {
      title: 'Introduction au code',
      points: [
        'Blocs (Cycle 3-4), puis Python au lycée',
        'Projets interdisciplinaires (sciences, arts, langues)',
      ],
    },
    {
      title: 'Module IA',
      points: [
        'Fonctionnement, usages et limites',
        'Éthique, données et biais, usages responsables',
      ],
    },
    {
      title: 'Numérique citoyen',
      points: [
        'Identité numérique et réseaux sociaux',
        'Droits, devoirs et sobriété numérique',
      ],
    },
    {
      title: 'Projets & sorties',
      points: [
        'Concours, hackathons, ateliers robotiques',
        "Visites d'acteurs du numérique au Sénégal",
      ],
    },
  ];

  const ressources: Ressource[] = [
    { label: 'CRCN – Eduscol', href: 'https://eduscol.education.fr/721/evaluer-developper-et-certifier-les-competences-numeriques' },
    { label: 'PIX – Certification', href: 'https://pix.fr' },
    { label: 'Édubase – Scénarios', href: 'https://edubase.eduscol.education.fr/' },
    { label: 'AEFE – Stratégie e‑nov', href: 'https://www.aefe.fr/' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="opacity-0 animate-fade-in" style={{ animationDuration: '0.6s' }}>
              <div className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                <GraduationCap className="w-4 h-4" />
                <span>Curriculum numérique • LFJP Saly</span>
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                Comprendre, créer et collaborer dans un monde numérique
              </h1>
              <p className="mt-4 text-gray-600 max-w-3xl">
                Parcours progressif de compétences du primaire à la terminale, adossé au Cadre de Référence des Compétences Numériques (CRCN)
                et à la stratégie e‑nov de l’AEFE.
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap gap-3">
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

        <Section
          id="domaines"
          title="Les cinq domaines du curriculum"
          subtitle="Adaptation locale du CRCN aux pratiques pédagogiques du LFJP."
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {domaines.map((domaine, index) => {
              const Icon = domaine.icon;

              return (
                <div
                  key={domaine.title}
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{domaine.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{domaine.desc}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {domaine.exemples.map((exemple) => (
                            <Pill key={exemple}>{exemple}</Pill>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="progression" title="Progression spiralaire" subtitle="Consolider et approfondir les compétences à chaque cycle.">
          <div className="grid md:grid-cols-3 gap-5">
            <Card>
              <h3 className="text-base font-semibold">Cycle 3 · CM2–6e</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Découverte des usages et des règles</li>
                <li>Programmation par blocs, pensée informatique</li>
                <li>Premiers projets médias</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-base font-semibold">Cycle 4 · 5e–3e</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Recherche d’information et vérification</li>
                <li>Création multimédia et gestion de données</li>
                <li>Collaboration et publication en ligne</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-base font-semibold">Lycée · 2de–Terminale</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Python, projets interdisciplinaires</li>
                <li>Certification PIX et usages responsables</li>
                <li>Module IA et éthique du numérique</li>
              </ul>
            </Card>
          </div>
        </Section>

        <Section
          id="modules"
          title="Modules spécifiques du LFJP"
          subtitle="Adaptés au contexte sénégalais et à l’ouverture internationale de l’établissement."
        >
          <div className="grid sm:grid-cols-2 gap-5">
            {modules.map((module) => (
              <Card key={module.title}>
                <h3 className="text-base font-semibold">{module.title}</h3>
                <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                  {module.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          id="infrastructure"
          title="Infrastructure et accompagnement"
          subtitle="Équipement, accès et formation pour des usages pédagogiques exigeants."
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <div className="flex items-start gap-3">
                <Globe2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-semibold">Accès équitable</h3>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>
                      Plan <strong>1 PC par lycéen</strong>
                    </li>
                    <li>Classes numériques mobiles</li>
                    <li>Connectivité et ENT</li>
                  </ul>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-3">
                <Workflow className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-base font-semibold">Pilotage &amp; formation</h3>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Plan de renouvellement pluriannuel</li>
                    <li>Formations AEFE / Canopé</li>
                    <li>Suivi par PIX et référentiel CRCN</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        <Section id="aefe" title="Ancrage AEFE – stratégie e‑nov" subtitle="Butiner • Transformer • Essaimer">
          <Card>
            <div className="grid md:grid-cols-3 gap-5 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold">Butiner</h3>
                <p className="mt-1">Veille et inspiration dans le réseau AEFE ; repérage des pratiques innovantes.</p>
              </div>
              <div>
                <h3 className="font-semibold">Transformer</h3>
                <p className="mt-1">Expérimentations locales, contextualisation au Sénégal, évaluation d’impact.</p>
              </div>
              <div>
                <h3 className="font-semibold">Essaimer</h3>
                <p className="mt-1">Partage des scénarios et ressources, accompagnement inter‑établissements.</p>
              </div>
            </div>
          </Card>
        </Section>

        <Section id="objectifs" title="Objectifs et indicateurs" subtitle="Finalités éducatives et critères de réussite.">
          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <h3 className="text-base font-semibold">Objectifs</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Citoyenneté et éthique numériques</li>
                <li>Créativité, collaboration, pensée critique</li>
                <li>Sobriété numérique et durabilité</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-base font-semibold">Indicateurs</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Niveaux et certifications PIX</li>
                <li>Nombre et qualité des projets numériques</li>
                <li>Équipement, disponibilité et taux d’usage</li>
              </ul>
            </Card>
          </div>
        </Section>

        <Section id="ressources" title="Ressources utiles">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ressources.map((ressource) => (
              <a
                key={ressource.href}
                href={ressource.href}
                target="_blank"
                rel="noreferrer"
                className="group"
              >
                <Card>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium group-hover:underline">{ressource.label}</span>
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </Card>
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Liens fournis à titre indicatif ; se référer aux versions les plus récentes des textes officiels.
          </p>
        </Section>

        <footer className="py-10 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <LineChart className="w-4 h-4" />
              <span>Curriculum numérique • LFJP Saly</span>
            </div>
            <nav className="flex flex-wrap gap-3 text-sm">
              <a href="#domaines" className="text-gray-600 hover:text-gray-900">
                Domaines
              </a>
              <a href="#progression" className="text-gray-600 hover:text-gray-900">
                Progression
              </a>
              <a href="#modules" className="text-gray-600 hover:text-gray-900">
                Modules
              </a>
              <a href="#infrastructure" className="text-gray-600 hover:text-gray-900">
                Infrastructure
              </a>
              <a href="#aefe" className="text-gray-600 hover:text-gray-900">
                AEFE
              </a>
              <a href="#objectifs" className="text-gray-600 hover:text-gray-900">
                Objectifs
              </a>
              <a href="#ressources" className="text-gray-600 hover:text-gray-900">
                Ressources
              </a>
            </nav>
          </div>
        </footer>
      </main>
      <Footer />
    </div>
  );
};

export default CurriculumNumeriqueSpiralaire;
