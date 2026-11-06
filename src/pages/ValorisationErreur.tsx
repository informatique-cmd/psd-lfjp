import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Target, BookOpen, Users } from 'lucide-react';

type Milestone = {
  id: string;
  period: string;
  title: string;
  items: string[];
};

type Highlight = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const phases: Milestone[] = [
  {
    id: '2026-2027',
    period: '2026–2027',
    title: 'Phase 1 – Lancement et sensibilisation',
    items: [
      'Formation interne des enseignants aux pédagogies explicites sur l’erreur constructive.',
      'Mise en place d’ateliers pilotes dans quelques classes (primaire, collège, lycée).',
      'Première série de témoignages d’anciens élèves lors d’événements phares (fête de l’école, semaine de l’orientation).'
    ]
  },
  {
    id: '2027-2028',
    period: '2027–2028',
    title: 'Phase 2 – Diffusion et structuration',
    items: [
      'Extension des pratiques à l’ensemble des cycles (de la maternelle à la terminale).',
      'Élaboration de supports communs (« guide de l’erreur constructive » pour élèves et enseignants).',
      'Lancement officiel du programme « Cultiver l’audace » avec un concours annuel de projets étudiants.'
    ]
  },
  {
    id: '2028-2029',
    period: '2028–2029',
    title: 'Phase 3 – Consolidation et ouverture',
    items: [
      'Mise en réseau avec d’autres établissements AEFE pour partager les pratiques.',
      'Développement de partenariats avec associations et universités locales pour renforcer la place de la persévérance dans l’orientation.',
      'Généralisation des interventions d’anciens élèves dans chaque niveau (cycle 3, 4, lycée).'
    ]
  },
  {
    id: '2029-2030',
    period: '2029–2030',
    title: 'Phase 4 – Pérennisation et évaluation',
    items: [
      'Intégration systématique de la valorisation de l’erreur dans le projet d’établissement et dans les parcours éducatifs (Avenir, Citoyen, Santé, EAC).',
      'Évaluation par indicateurs (climat scolaire, taux de participation aux projets, taux de décrochage, retours des élèves).',
      'Publication d’un livret « Cultiver l’audace » rassemblant bonnes pratiques, témoignages et productions étudiantes.'
    ]
  }
];

const highlights: Highlight[] = [
  {
    title: 'Pédagogies explicites sur l’erreur',
    description:
      'Verbaliser, analyser et corriger les erreurs : équiper élèves et enseignants avec des stratégies de progrès, des grilles de lecture partagées et des rituels de feedback bienveillants.',
    icon: <BookOpen className="h-5 w-5 text-french-blue" aria-hidden />
  },
  {
    title: 'Interventions d’anciens élèves',
    description:
      'Témoignages sur les détours, les rebonds et les parcours inspirants. Organisation de conférences, tables rondes et dispositifs de mentoring par niveau.',
    icon: <Users className="h-5 w-5 text-french-blue" aria-hidden />
  },
  {
    title: 'Programme « Cultiver l’audace »',
    description:
      'Concours et projets valorisant l’initiative et le droit à l’essai. Les élèves sont accompagnés par des référents et des partenaires externes pour porter des projets ambitieux.',
    icon: <Target className="h-5 w-5 text-french-blue" aria-hidden />
  }
];

const evaluationAxes = [
  'Climat scolaire apaisé et confiant mesuré par les enquêtes annuelles.',
  'Taux de participation élevé aux projets « Cultiver l’audace » et aux concours étudiants.',
  'Baisse du décrochage et augmentation du sentiment de compétence exprimé par les élèves.',
  'Feedbacks qualitatifs des enseignants, familles et partenaires sur la culture du rebond.'
];

const ValorisationErreur = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-50">
      <Navbar showLogo={true} />

      <div className="bg-gradient-to-br from-french-blue via-blue-700 to-indigo-800 text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-white/80">Plan stratégique 2026-2030 · Axe 4</p>
          <h1 className="mt-4 text-3xl md:text-5xl font-playfair font-bold max-w-4xl">
            Valorisation de l’erreur et de la persévérance
          </h1>
          <p className="mt-4 max-w-3xl text-base md:text-lg text-white/80">
            Doter chaque élève de la capacité d’analyser ses erreurs, d’oser de nouvelles initiatives et de cultiver la persévérance comme compétence clé pour ses études supérieures et sa vie citoyenne.
          </p>
        </div>
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-6 py-10 md:py-14 space-y-14">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild className="bg-white/80">
              <Link to="/plan-strategique">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden /> Retour au Plan stratégique
              </Link>
            </Button>
            <Button variant="outline" asChild className="bg-white/80">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" aria-hidden /> Accueil
              </Link>
            </Button>
          </div>

          <section aria-labelledby="timeline-title" className="space-y-6">
            <div className="max-w-3xl">
              <h2 id="timeline-title" className="text-2xl md:text-3xl font-playfair font-bold text-slate-900">
                Horizon 2030 – Étapes clés du projet
              </h2>
              <p className="mt-3 text-slate-600">
                Un calendrier progressif pour faire grandir la culture de l’erreur constructive dans tout l’établissement, du lancement expérimental à la pérennisation institutionnelle.
              </p>
            </div>

            <ol className="relative border-s border-slate-200 pl-8">
              {phases.map((phase, index) => (
                <li key={phase.id} className="mb-12 ms-4">
                  <div
                    className="absolute -left-1.5 mt-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-french-blue shadow"
                    aria-hidden
                  />
                  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-slate-500">
                      <span className="font-semibold text-french-blue">{phase.period}</span>
                      <a href={`#${phase.id}`} id={phase.id} className="text-xs text-slate-400 hover:text-french-blue">
                        #{phase.id}
                      </a>
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{phase.title}</h3>
                    <ul className="mt-4 space-y-2 text-slate-700">
                      {phase.items.map((item, itemIndex) => (
                        <li key={`${phase.id}-${itemIndex}`} className="flex gap-2">
                          <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-french-blue" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                  {index !== phases.length - 1 && (
                    <div className="absolute left-[-0.1rem] top-full h-8 border-l border-dashed border-slate-200" aria-hidden />
                  )}
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="pillars-title">
            <div className="grid gap-6 md:grid-cols-3">
              {highlights.map((highlight) => (
                <article
                  key={highlight.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                      {highlight.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{highlight.title}</h3>
                  </div>
                  <p className="mt-3 text-sm md:text-base text-slate-700">{highlight.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="audace-title" className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 id="audace-title" className="text-xl font-semibold text-slate-900">
                Focus sur le programme « Cultiver l’audace »
              </h2>
              <p className="mt-4 text-slate-700">
                Le concours annuel mobilise des équipes pluridisciplinaires d’élèves autour de défis sociétaux, scientifiques ou
                artistiques. Chaque projet passe par des itérations documentées : journal de bord des erreurs rencontrées,
                retours d’experts partenaires, auto-évaluation de la persévérance mobilisée.
              </p>
              <p className="mt-4 text-slate-700">
                Les meilleurs projets sont présentés lors d’une soirée « audace » ouverte aux familles, alumni et partenaires
                locaux. Les lauréats bénéficient d’un accompagnement personnalisé pour poursuivre leur initiative (incubation,
                diffusion dans d’autres établissements, participation à des concours internationaux).
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Objectif final 2030</h3>
              <p className="mt-3 text-slate-700">
                Un lycée où chaque élève ose prendre des initiatives, sait analyser ses erreurs et cultive la persévérance comme
                compétence clé pour ses études supérieures et sa vie citoyenne.
              </p>
            </div>
          </section>

          <section aria-labelledby="evaluation-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 id="evaluation-title" className="text-xl font-semibold text-slate-900">
              Pérennisation et évaluation continue (2029-2030)
            </h2>
            <p className="mt-3 text-slate-700">
              Les indicateurs sont suivis par le comité de pilotage stratégique et partagés chaque année avec la communauté
              éducative pour ajuster les actions.
            </p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {evaluationAxes.map((axis) => (
                <li key={axis} className="flex items-start gap-3 rounded-xl bg-blue-50/60 p-4 text-sm md:text-base text-slate-700">
                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-french-blue" aria-hidden />
                  <span>{axis}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="resources-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 id="resources-title" className="text-xl font-semibold text-slate-900">Ressources et livrables</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <article>
                <h3 className="text-base font-semibold text-slate-900">Supports communs</h3>
                <p className="mt-2 text-slate-700">
                  Publication du « guide de l’erreur constructive » co-construit par les équipes, fiches réflexes pour les
                  conseils de classe, outils d’auto-évaluation élèves et capsules vidéo pédagogiques.
                </p>
              </article>
              <article>
                <h3 className="text-base font-semibold text-slate-900">Communauté élargie</h3>
                <p className="mt-2 text-slate-700">
                  Plateforme des alumni volontaires, convention de partenariats universitaires et associatifs, livret annuel
                  « Cultiver l’audace » valorisant les réussites et les témoignages de persévérance.
                </p>
              </article>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ValorisationErreur;
