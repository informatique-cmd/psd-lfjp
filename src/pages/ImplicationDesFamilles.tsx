import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Activity,
  ArrowLeft,
  BookHeart,
  CalendarClock,
  ClipboardList,
  Flag,
  HeartHandshake,
  Home,
  Lightbulb,
  ShieldCheck,
  Target,
  Users2,
} from 'lucide-react';

const PAGE_TITLE = 'Implication des familles | PSD LFJP';

const associatedRoles = [
  'la compréhension des attendus scolaires et des parcours d’orientation ;',
  'l’accompagnement des élèves tout au long de leur scolarité ;',
  'la vie et les orientations stratégiques de l’établissement.',
];

const meetingPrinciples = [
  'Dialogue institutionnel continu et suivi partagé des enjeux éducatifs.',
  'Association réelle des familles aux projets de l’établissement.',
  'Espaces d’échanges complémentaires pour prévenir et accompagner les situations.',
];

const operationalObjectives = [
  'Mettre en place un suivi collectif et régulier des élèves, en dehors des conseils de classe.',
  'Favoriser une lecture globale des situations scolaires, éducatives et relationnelles.',
  'Identifier précocement les fragilités, signaux faibles ou besoins d’accompagnement.',
  'Renforcer la coopération entre élèves, familles et équipes éducatives.',
  'Dédramatiser le suivi scolaire en le dissociant des enjeux de notes, moyennes ou mentions.',
];

const publicConcernes = [
  'Élèves du secondaire (collège et lycée).',
  'Représentants des parents d’élèves.',
  'Équipes éducatives.',
];

const meetingComposition = [
  'les délégués des élèves,',
  'les délégués des parents d’élèves,',
  'le professeur principal,',
  'la CPE.',
];

const temporalite = [
  'Une réunion par période scolaire, selon le calendrier de l’établissement.',
  'Positionnée à distance des conseils de classe.',
];

const cadrePrinciples = [
  'Pas de discussion sur les moyennes, classements ou mentions.',
  'Approche qualitative et éducative des situations.',
  'Confidentialité et respect des personnes.',
  'Logique d’anticipation, de prévention et de soutien.',
  'Complémentarité avec les conseils de classe, sans s’y substituer.',
];

const thematiques = [
  'Engagement et posture scolaire des élèves.',
  'Climat de classe et dynamique collective.',
  'Organisation du travail et méthodes.',
  'Bien-être, motivation, persévérance.',
  'Repérage des situations nécessitant un accompagnement individualisé.',
];

const indicateurs = [
  'Nombre de situations repérées et accompagnées en amont.',
  'Évolution du climat de classe.',
  'Diminution des situations de crise traitées en urgence.',
  'Satisfaction des élèves, familles et équipes.',
];

const parcoursArticulation = [
  {
    title: 'Parcours citoyen',
    points: [
      'Responsabilisation des délégués élèves et parents.',
      'Apprentissage du dialogue, de l’écoute et de la co-construction.',
      'Développement d’une citoyenneté scolaire active.',
    ],
  },
  {
    title: 'Parcours avenir',
    points: [
      'Anticipation des difficultés susceptibles d’entraver les projets d’orientation.',
      'Accompagnement des élèves dans la construction de parcours cohérents et réalistes.',
      'Implication des familles dans les choix d’orientation, hors pression évaluative.',
    ],
  },
  {
    title: 'Parcours éducatif de santé',
    points: [
      'Repérage précoce des situations de mal-être, de décrochage ou de surcharge.',
      'Prise en compte du bien-être émotionnel et psychologique.',
      'Coordination avec les dispositifs d’accompagnement existants.',
    ],
  },
  {
    title: 'Parcours d’éducation artistique et culturelle (PEAC)',
    points: [
      'Valorisation des réussites non exclusivement scolaires.',
      'Reconnaissance des compétences artistiques, culturelles et créatives.',
      'Dialogue autour de l’engagement des élèves dans les projets collectifs.',
    ],
  },
];

const ImplicationDesFamilles = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-raleway text-slate-900">
      <Navbar showLogo />

      <header className="relative isolate overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 py-24 text-white md:py-32">
        <div
          className="absolute inset-y-0 right-0 hidden w-1/2 bg-[url('https://i.imgur.com/XVwBlZs.jpeg')] bg-cover bg-center opacity-20 lg:block"
          aria-hidden="true"
        ></div>
        <div className="container relative mx-auto px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Axe 4 · Coéducation & réussite partagée</p>
          <h1 className="mt-6 max-w-3xl text-3xl font-playfair font-bold leading-tight md:text-5xl">
            Implication des familles : une coéducation au service des réussites
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            Au Lycée français Jacques Prévert, la réussite repose sur une alliance éducative forte entre l’école et les familles,
            fondée sur le dialogue, la confiance et la co-construction.
          </p>
        </div>
      </header>

      <div className="container mx-auto flex flex-wrap gap-3 px-6 py-6">
        <Button variant="outline" onClick={() => navigate('/plan-strategique')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Plan stratégique
        </Button>
        <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Accueil
        </Button>
      </div>

      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 md:py-16">
        <div className="container mx-auto space-y-12 px-6">
          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-4 text-base leading-relaxed text-slate-700">
                <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                  <HeartHandshake className="h-6 w-6" aria-hidden="true" />
                  Une coéducation structurée
                </h2>
                <p>
                  Conformément aux principes portés par l’Éducation nationale et l’AEFE, les parents sont reconnus comme des partenaires à part entière des parcours de réussite, au service du développement scolaire, personnel et citoyen de chaque élève.
                </p>
                <p>
                  L’établissement inscrit l’implication des familles dans une logique de coéducation structurée, régulière et transparente, fondée sur le dialogue, la confiance et la co-construction.
                </p>
                <h3 className="text-lg font-semibold text-slate-900">Les familles sont associées :</h3>
                <ul className="space-y-2 pl-1">
                  {associatedRoles.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-french-blue">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-blue-50 p-6 text-blue-900">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-french-blue">Dialogue régulier</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  La direction du LFJP reçoit mensuellement ou bimensuellement les représentants élus des parents d’élèves, afin de garantir un dialogue institutionnel continu et un suivi partagé des enjeux éducatifs.
                </p>
                <div className="mt-4 space-y-2 text-sm leading-relaxed">
                  {meetingPrinciples.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <Flag className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-800" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
            <article className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                  <Target className="h-6 w-6" aria-hidden="true" />
                  Fiche-dispositif · Réunions de suivi par période – Secondaire
                </h2>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-900">
                  Intitulé : Réunions de suivi éducatif par période – Secondaire
                </span>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-2xl bg-slate-50 p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Lightbulb className="h-5 w-5 text-french-blue" aria-hidden="true" />
                    Objectifs
                  </h3>
                  <ul className="space-y-3 text-base leading-relaxed text-slate-700">
                    {operationalObjectives.map((objective) => (
                      <li key={objective} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-french-blue">
                          •
                        </span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 rounded-2xl bg-slate-50 p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Users2 className="h-5 w-5 text-french-blue" aria-hidden="true" />
                    Public concerné
                  </h3>
                  <ul className="space-y-3 text-base leading-relaxed text-slate-700">
                    {publicConcernes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-french-blue">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="space-y-3 rounded-2xl border border-blue-50 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(30,64,175,0.35)]">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <ClipboardList className="h-5 w-5 text-french-blue" aria-hidden="true" />
                    Composition des réunions
                  </h3>
                  <ul className="space-y-2 text-base leading-relaxed text-slate-700">
                    {meetingComposition.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 rounded-2xl border border-blue-50 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(30,64,175,0.35)]">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <CalendarClock className="h-5 w-5 text-french-blue" aria-hidden="true" />
                    Temporalité
                  </h3>
                  <ul className="space-y-2 text-base leading-relaxed text-slate-700">
                    {temporalite.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 rounded-2xl border border-blue-50 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(30,64,175,0.35)]">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <ShieldCheck className="h-5 w-5 text-french-blue" aria-hidden="true" />
                    Cadre et principes
                  </h3>
                  <ul className="space-y-2 text-base leading-relaxed text-slate-700">
                    {cadrePrinciples.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="space-y-3 rounded-2xl border border-blue-50 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(30,64,175,0.35)]">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Lightbulb className="h-5 w-5 text-french-blue" aria-hidden="true" />
                    Thématiques abordées
                  </h3>
                  <ul className="space-y-2 text-base leading-relaxed text-slate-700">
                    {thematiques.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 rounded-2xl border border-blue-50 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(30,64,175,0.35)]">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Activity className="h-5 w-5 text-french-blue" aria-hidden="true" />
                    Indicateurs de suivi
                  </h3>
                  <ul className="space-y-2 text-base leading-relaxed text-slate-700">
                    {indicateurs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            <aside className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-french-blue">
                <BookHeart className="h-6 w-6" aria-hidden="true" />
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-french-blue/80">Coéducation</p>
                  <h3 className="text-xl font-playfair font-semibold text-slate-900">Dialogue, confiance, transparence</h3>
                </div>
              </div>
              <p className="mt-4 text-base leading-relaxed text-slate-700">
                Les réunions de suivi par période renforcent la coopération entre élèves, familles et équipes, dans une logique d’anticipation, de prévention et d’accompagnement des parcours.
              </p>
              <div className="mt-6 space-y-3 rounded-2xl bg-blue-50 p-6 text-blue-900">
                <p className="text-sm font-semibold uppercase tracking-widest text-french-blue">En pratique</p>
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li className="flex items-start gap-2">
                    <Flag className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span>Réunions positionnées à distance des conseils de classe pour privilégier l’échange qualitatif.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Flag className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span>Suivi partagé des situations pour déclencher rapidement les accompagnements individualisés.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Flag className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span>Complémentarité avec les conseils de classe et les dispositifs existants.</span>
                  </li>
                </ul>
              </div>
            </aside>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                <HeartHandshake className="h-6 w-6" aria-hidden="true" />
                Articulation avec les quatre parcours éducatifs
              </h2>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {parcoursArticulation.map((parcours) => (
                <div
                  key={parcours.title}
                  className="rounded-2xl border border-blue-50 bg-slate-50 p-6 shadow-[0_10px_40px_-20px_rgba(30,64,175,0.35)]"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{parcours.title}</h3>
                  <ul className="mt-4 space-y-2 text-base leading-relaxed text-slate-700">
                    {parcours.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-french-blue">
                          •
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImplicationDesFamilles;
