import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Home,
  Target,
  Sparkles,
  CalendarDays,
  Landmark,
  Users,
  NotebookPen,
  Megaphone
} from 'lucide-react';

const tocItems = [
  { id: 'finalite', label: 'Finalité' },
  { id: 'theme-annuel', label: 'Thème annuel' },
  { id: 'programmation', label: 'Programmation type' },
  { id: 'dispositifs', label: 'Dispositifs à mobiliser' },
  { id: 'organisation', label: 'Organisation & suivi' }
];

const sectionCardClass =
  'relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl';
const textClass = 'text-[clamp(1rem,1.6vw,1.125rem)] leading-relaxed text-slate-700';

const schedule = [
  {
    day: 'Lundi – Lancement',
    focus: 'Rayonnement & francophonie',
    activities: [
      'Ouverture officielle avec hymne bilingue et présentation du thème annuel.',
      'Exposition inaugurale des œuvres d’élèves et rencontre avec un artiste local ou un ancien élève.'
    ]
  },
  {
    day: 'Mardi – Arts du spectacle',
    focus: 'Pratique & inclusion',
    activities: [
      'Ateliers théâtre, danse, musique, slam et scène ouverte « 1 min pour dire ».',
      'Participation ciblée des élèves allophones ou à besoins particuliers pour favoriser l’inclusion.'
    ]
  },
  {
    day: 'Mercredi – Sciences et culture',
    focus: 'Culture scientifique et technique',
    activities: [
      'Ateliers « Art et robotique », « Mathématiques et motifs », « Lumière et couleur » en lien avec le PEAC.',
      'Mise en avant des projets croisant sciences, arts et numérique.'
    ]
  },
  {
    day: 'Jeudi – Citoyenneté et mémoire',
    focus: 'Parcours citoyen',
    activities: [
      'Ciné-débat autour d’un film francophone ou africain et expositions thématiques (« Femmes de culture », « Art et droits humains »).',
      'Temps d’échanges animés par les élèves du CVL et les ambassadeurs égalité.'
    ]
  },
  {
    day: 'Vendredi – Restitutions & partage',
    focus: 'Communauté éducative',
    activities: [
      'Grande soirée culturelle avec spectacles, défilé de créations et remise des prix « Coup de cœur du LFJP ».',
      'Invitations croisées avec les partenaires culturels et les familles.'
    ]
  }
];

const dispositifs = [
  'JACES – Journées des arts et de la culture à l’école comme cadre de référence.',
  'Pass Culture, Label E3D et LabelFrancÉducation pour soutenir les projets et les médiations.',
  'Partenariats avec l’Institut Français du Sénégal, l’Alliance Française, les musées et écoles francophones de la Petite Côte.',
  'Synergies avec le réseau AEFE Afrique de l’Ouest : échanges vidéo, concours communs, invitations croisées.'
];

const organisation = {
  committee: [
    'Comité culture LFJP réunissant coordonnateur EAC, professeurs d’arts, documentaliste, CPE, vie scolaire et élèves du CVL.',
    'Répartition claire des rôles : pilotage logistique, programmation, médiation, communication.'
  ],
  portfolio: [
    'Portfolio PEAC numérique : chaque élève consigne découvertes, productions et ressentis.',
    'Capitalisation des traces pour alimenter le bilan culturel annuel et les dossiers de labellisation.'
  ],
  evaluation: [
    'Indicateurs : nombre de participants, variété des domaines artistiques, implication des familles et partenaires.',
    'Recueil de retours via formulaires et capsules vidéo produites par les élèves reporters.'
  ],
  communication: [
    'Valorisation dans Le Petit Prévert, sur le site du lycée et les réseaux AEFE.',
    'Création d’une médiathèque numérique pour partager photos, podcasts et interviews.'
  ]
};

const SemaineDesCultures = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-white">
      <Navbar showLogo={true} />

      <section className="relative isolate overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521337580396-0259d88bf71b?auto=format&fit=crop&w=1600&q=80"
            alt="Élèves lors d'une performance artistique"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true"></div>
        </div>
        <div className="relative container mx-auto px-6 py-24 md:py-32 text-center text-white">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-balance mb-6">
            Semaine des cultures du LFJP
          </h1>
          <p className="mx-auto max-w-3xl text-lg md:text-xl font-light text-white/90">
            Un temps fort pour renforcer l’identité culturelle du lycée et le rayonnement francophone en Petite Côte.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('/plan-strategique')}
          className="flex items-center gap-2 min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au PSD
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 min-h-[44px]"
        >
          <Home className="h-4 w-4" />
          Accueil
        </Button>
      </div>

      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col-reverse lg:flex-row gap-12">
            <div className="flex-1 space-y-10">
              <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-8 shadow-sm">
                <p className="text-center text-[clamp(1rem,1.6vw,1.125rem)] font-semibold leading-relaxed">
                  La Semaine des cultures sera portée par les parents d'élèves de l'APE, sous l'impulsion de la commission événementielle des statuts rénovés.
                </p>
              </div>

              <section id="finalite" className={sectionCardClass}>
                <div className="absolute inset-0 bg-gradient-to-br from-french-blue/5 via-transparent to-french-blue/10" aria-hidden="true"></div>
                <div className="relative space-y-4">
                  <h2 className="text-2xl font-playfair font-semibold text-french-blue flex items-center gap-3">
                    <Target className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Finalité
                  </h2>
                  <p className={textClass}>
                    Mobiliser toute la communauté éducative pour incarner la mission AEFE : former des citoyens du monde,
                    cultivés, ouverts et créatifs.
                  </p>
                  <ul className="space-y-3 text-left">
                    <li className={textClass}>
                      Valoriser les parcours éducatifs (PEAC, citoyen, Avenir, santé) à travers des réalisations concrètes.
                    </li>
                    <li className={textClass}>
                      Faire rayonner les talents du LFJP auprès des familles, des partenaires locaux et du réseau AEFE.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="theme-annuel" className={sectionCardClass}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-4">
                  <h2 className="text-2xl font-playfair font-semibold text-french-blue flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Thème annuel fédérateur
                  </h2>
                  <p className={textClass}>
                    Chaque édition s’organise autour d’un fil conducteur à la manière des JACES ou de la Semaine des lycées
                    français du monde.
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {['Arts et durabilité', 'Langues, cultures et identités', 'Corps en mouvement', 'Jeunes citoyens, jeunes créateurs'].map(
                      (theme) => (
                        <div
                          key={theme}
                          className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-center text-[clamp(0.95rem,1.4vw,1.05rem)] font-medium text-amber-900"
                        >
                          {theme}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </section>

              <section id="programmation" className={sectionCardClass}>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100/60 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-6">
                  <h2 className="text-2xl font-playfair font-semibold text-french-blue flex items-center gap-3">
                    <CalendarDays className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Programmation type sur cinq jours
                  </h2>
                  <div className="space-y-6">
                    {schedule.map((day) => (
                      <div
                        key={day.day}
                        className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm"
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">{day.day}</h3>
                            <p className="text-sm font-medium uppercase tracking-wide text-french-blue">
                              {day.focus}
                            </p>
                          </div>
                        </div>
                        <ul className="mt-4 space-y-3 text-left">
                          {day.activities.map((activity) => (
                            <li key={activity} className={textClass}>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="dispositifs" className={sectionCardClass}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/60 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-4">
                  <h2 className="text-2xl font-playfair font-semibold text-french-blue flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Dispositifs AEFE à mobiliser
                  </h2>
                  <ul className="space-y-3 text-left">
                    {dispositifs.map((item) => (
                      <li key={item} className={textClass}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section id="organisation" className={sectionCardClass}>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/60 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-6">
                  <h2 className="text-2xl font-playfair font-semibold text-french-blue flex items-center gap-3">
                    <Users className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Organisation & suivi
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 shadow-sm">
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-rose-900">
                        <Users className="h-5 w-5" aria-hidden="true" />
                        Comité culture
                      </h3>
                      <ul className="space-y-2 text-left">
                        {organisation.committee.map((item) => (
                          <li key={item} className={textClass}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 shadow-sm">
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-rose-900">
                        <NotebookPen className="h-5 w-5" aria-hidden="true" />
                        Portfolio & traces
                      </h3>
                      <ul className="space-y-2 text-left">
                        {organisation.portfolio.map((item) => (
                          <li key={item} className={textClass}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 shadow-sm">
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-rose-900">
                        <Target className="h-5 w-5" aria-hidden="true" />
                        Évaluation
                      </h3>
                      <ul className="space-y-2 text-left">
                        {organisation.evaluation.map((item) => (
                          <li key={item} className={textClass}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 shadow-sm">
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-rose-900">
                        <Megaphone className="h-5 w-5" aria-hidden="true" />
                        Communication
                      </h3>
                      <ul className="space-y-2 text-left">
                        {organisation.communication.map((item) => (
                          <li key={item} className={textClass}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="lg:w-80 lg:flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Sommaire</h2>
                  <nav className="mt-4">
                    <ul className="space-y-3 text-sm font-medium text-slate-600">
                      {tocItems.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="flex items-center gap-2 rounded-full px-4 py-2 transition-colors duration-200 hover:bg-french-blue/10 hover:text-french-blue"
                          >
                            <span className="block h-2 w-2 rounded-full bg-french-blue" aria-hidden="true"></span>
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SemaineDesCultures;
