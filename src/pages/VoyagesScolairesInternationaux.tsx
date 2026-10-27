import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Home,
  Globe2,
  MapPin,
  Target,
  Compass,
  ShieldCheck,
  Lightbulb,
  CheckCircle2,
  PlaneTakeoff,
} from 'lucide-react';

const PAGE_TITLE = 'Voyages scolaires internationaux et séjours locaux | PSD LFJP';

const enjeux = [
  "Ouverture internationale et multilingue en cohérence avec les missions du LFJP et les orientations AEFE.",
  "Formation du citoyen : autonomie, vivre-ensemble et responsabilité dans des contextes nouveaux.",
  "Enrichissement des parcours éducatifs (citoyen, avenir, EAC, santé).",
  "Rayonnement de la culture française et diplomatie éducative, au cœur de la stratégie AEFE.",
  "Ancrage local grâce aux séjours de proximité favorisant une connaissance fine du territoire sénégalais et de ses enjeux environnementaux.",
];

const diagnostics = [
  {
    year: '2023-2024',
    title: 'Une dynamique forte de mobilité',
    points: [
      'Voyage pédagogique à New York.',
      'Voyage linguistique et culturel à Madrid.',
      'Séjour parisien (parcours citoyen et culturel).',
      'Participation aux Jeux Internationaux de la Jeunesse (JIJ) à Athènes.',
    ],
    conclusion:
      'Ces projets ont généré une visibilité internationale, valorisé les filières sportives et linguistiques et renforcé la pédagogie par l’expérience.',
  },
  {
    year: '2024-2025',
    title: 'Interruption des mobilités',
    points: [
      'Crise de gouvernance à la rentrée 2024.',
      'Aucune possibilité d’organiser un séjour scolaire durant cette période.',
      'Relance des mobilités internationales type ADN-AEFE malgré la fermeture d’AGORA : 11 élèves de 2NDE sont partis en échange avec un correspondant d’un autre lycée de l’AEFE.',
    ],
    conclusion:
      'L’absence totale de projets cette année résulte directement de la crise de gouvernance.',
  },
  {
    year: '2025-2026',
    title: 'Reprise partielle mais freinée',
    points: [
      'Séjour Paris réussi mais à capacité limitée.',
      'Trois voyages annulés faute d’inscriptions : Madrid (linguistique), Tunisie (séjour Judo), Rabat (séjour solidaire).',
      "Création de séjours locaux pour le premier degré : classe verte dans l’éco-lieu Djarama Dialaw (CP-CE2 & CE2) et classe verte à Popenguine (CM1A&B).",
      'Séjours locaux pour le secondaire : À la découverte des trésors de Lompoul (Terminale) et séjour Popenguine pour les Sections Sportives Scolaires.',
    ],
    conclusion:
      'L’annulation de voyages pédagogiquement pertinents confirme l’enjeu majeur de l’accessibilité financière et le risque de fracture sociale.',
  },
];

const forces = [
  'Expertise organisationnelle du LFJP et capacité à monter des projets complexes.',
  'Appétence forte des élèves pour les mobilités (enquêtes de climat scolaire).',
  "Alignement naturel avec l’axe 2 (plurilinguisme / ouverture internationale) et l’axe 4 (réussites) du PSD.",
];

const weaknesses = [
  'Sensibilité des projets aux coûts logistiques élevés.',
  'Fracture entre l’ambition éducative et la capacité financière réelle des familles.',
  'Absence de fonds spécifiques dédiés à la mobilité.',
];

const opportunities = [
  'Développer des séjours locaux et régionaux à coûts réduits pour favoriser l’égalité d’accès.',
  'Nouer des partenariats avec des institutions sénégalaises, francophones et sportives.',
  'Mobiliser un fonds de solidarité dédié aux mobilités en cohérence avec les priorités sociales du système éducatif français.',
];

const threats = [
  'Risque d’inégalités accrues si seuls quelques élèves peuvent participer.',
  'Perte de visibilité internationale si les voyages deviennent trop ponctuels.',
  'Démotivation des équipes enseignantes en cas d’annulations répétées.',
];

const orientations = [
  {
    title: 'Repenser un modèle de mobilité soutenable',
    details: [
      'Équilibrer chaque année 1 à 2 voyages internationaux avec 3 à 5 séjours locaux ou régionaux.',
      'Prioriser des destinations pédagogiquement riches mais économiquement soutenables (Afrique de l’Ouest, pays voisins, partenariats francophones).',
    ],
    icon: Compass,
  },
  {
    title: 'Accessibilité financière et équité',
    details: [
      'Créer un fonds mobilité (solidarité, mécénat, partenariats).',
      'Construire des budgets anticipés, plafonner les coûts et proposer des paiements mensualisés.',
    ],
    icon: ShieldCheck,
  },
  {
    title: 'Ancrage local et coopération sénégalaise',
    details: [
      'Développer les séjours de proximité : Sine-Saloum, Dakar, île de Gorée, réserves naturelles, villages partenaires, institutions culturelles et mémorielles.',
      'Collaborer avec l’Institut français, les Alliances françaises, les musées nationaux, les parcs naturels et les associations citoyennes du Sénégal.',
    ],
    icon: MapPin,
  },
  {
    title: 'Développement des mobilités internationales structurées',
    details: [
      'Participer à chaque édition des Jeux Internationaux de la Jeunesse (JIJ).',
      'Relancer les échanges scolaires (ADN-AEFE) et organiser des voyages thématiques (sciences, citoyenneté, langues, arts et cultures, mémoire, histoire).',
    ],
    icon: PlaneTakeoff,
  },
  {
    title: 'Structuration et sécurisation des pratiques',
    details: [
      'Mettre en place un référentiel LFJP des voyages scolaires conforme aux exigences françaises et AEFE (sécurité, pédagogie, assurances, AST, Ariane).',
      'Former les équipes (sécurité, gestion de groupe, premiers secours).',
    ],
    icon: ShieldCheck,
  },
];

const indicators = [
  '70 % des élèves participent à un séjour local ou international sur le cycle 2026-2030.',
  'Au moins un voyage international par an organisé au secondaire.',
  'Zéro annulation liée au manque d’inscriptions à partir de 2027 grâce au nouveau modèle financier.',
  '100 % des séjours adossés à un parcours (Avenir, Citoyen, Santé, EAC).',
  'Satisfaction famille/élève > 90 % dans les évaluations post-séjour.',
];

const VoyagesScolairesInternationaux = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-raleway text-slate-900">
      <Navbar showLogo />

      <header className="relative isolate overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-french-blue py-24 text-white md:py-28">
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80"
            alt="Élèves en voyage scolaire"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="relative container mx-auto px-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">PSD 2026-2030 · Axe 2</p>
          <h1 className="mt-6 max-w-4xl text-3xl font-playfair font-bold leading-tight md:text-5xl">
            Voyages scolaires internationaux et séjours locaux
          </h1>
          <p className="mt-6 max-w-3xl text-base text-white/85 md:text-lg">
            Articuler mobilité internationale et ancrage territorial pour former des citoyens ouverts, plurilingues et responsables, tout en garantissant l’accessibilité pour toutes les familles.
          </p>
        </div>
      </header>

      <div className="container mx-auto flex flex-wrap gap-3 px-6 py-6">
        <Button variant="outline" onClick={() => navigate('/plan-strategique')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour au PSD
        </Button>
        <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Accueil
        </Button>
      </div>

      <main className="flex-1 space-y-12 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10 md:py-16">
        <div className="container mx-auto px-6 space-y-12">
          <section className="grid gap-8">
            <article className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                <Target className="h-6 w-6" aria-hidden="true" />
                1. Enjeux éducatifs et institutionnels
              </h2>
              <ul className="mt-6 space-y-4 text-base leading-relaxed text-slate-700">
                {enjeux.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-french-blue">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
                La place des voyages scolaires dans le PSD s’inscrit pleinement dans la vision d’un établissement « ouvert sur le monde et solidement ancré dans son environnement local ».
              </div>
            </article>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                  <Globe2 className="h-6 w-6" aria-hidden="true" />
                  2. Diagnostic 2023-2026
                </h2>
                <p className="mt-2 text-base text-slate-700">
                  Une analyse en trois temps pour objectiver les dynamiques, les ruptures et les enseignements des dernières années.
                </p>
              </div>
              <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-french-blue">
                Continuité pédagogique & équité
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {diagnostics.map((diag) => (
                <article key={diag.year} className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.25em] text-blue-700/70">{diag.year}</span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-french-blue">{diag.title}</span>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                    {diag.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-french-blue">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">{diag.conclusion}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                <Lightbulb className="h-6 w-6" aria-hidden="true" />
                3. Analyse stratégique (SWOT)
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-green-100 bg-green-50/70 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-green-700">Forces</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-green-900">
                    {forces.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden="true"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-700">Faiblesses</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-900">
                    {weaknesses.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-amber-500" aria-hidden="true"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Opportunités</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-blue-900">
                    {opportunities.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500" aria-hidden="true"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-700">Menaces</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-rose-900">
                    {threats.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-rose-500" aria-hidden="true"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                <Compass className="h-6 w-6" aria-hidden="true" />
                4. Orientations stratégiques 2026-2030
              </h2>
              <div className="mt-6 space-y-5">
                {orientations.map((orientation) => (
                  <div key={orientation.title} className="flex gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                    <div className="mt-1 rounded-full bg-blue-100 p-2 text-french-blue">
                      <orientation.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{orientation.title}</h3>
                      <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700">
                        {orientation.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2">
                            <span
                              className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-french-blue"
                              aria-hidden="true"
                            >
                              •
                            </span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                5. Indicateurs de réussite
              </h2>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Suivi annuel et bilan PSD</div>
            </div>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Les indicateurs suivants permettront de mesurer l’impact du modèle de mobilité soutenable sur la période 2026-2030.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {indicators.map((indicator) => (
                <div key={indicator} className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                  <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center text-french-blue">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-sm leading-relaxed text-slate-800">{indicator}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
              <Target className="h-6 w-6" aria-hidden="true" />
              6. Conclusion
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Les voyages scolaires, internationaux comme locaux, demeurent un pilier du projet éducatif du LFJP. L’ambition du PSD 2026-2030 est double : favoriser l’ouverture internationale des élèves et garantir une accessibilité réelle pour toutes les familles dans un cadre soutenable et sécurisé. En articulant mobilité globale et ancrage territorial, le LFJP incarne une éducation française innovante, exigeante et profondément connectée à son environnement.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VoyagesScolairesInternationaux;
