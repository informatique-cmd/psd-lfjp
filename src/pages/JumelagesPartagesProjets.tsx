import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Home,
  Target,
  Handshake,
  Globe2,
  Lightbulb,
  Users,
  MapPin,
  Rocket,
  ShieldCheck,
} from 'lucide-react';

const PAGE_TITLE =
  'Jumelages, partages, projets collaboratifs locaux et internationaux | PSD LFJP';

const nationalReferences = [
  {
    title: 'Parcours citoyen',
    points: [
      'Ouverture au monde, interculturalité et actions solidaires ou mémorielles.',
      'Formation du citoyen libre, responsable et ouvert, conformément à la circulaire dédiée.',
    ],
  },
  {
    title: 'Parcours Avenir',
    points: [
      'Découverte de milieux professionnels variés et de formations à l’international.',
      'Élargissement du réseau scolaire et professionnel des élèves grâce aux partenariats.',
    ],
  },
  {
    title: 'PEAC – Parcours d’Éducation Artistique et Culturelle',
    points: [
      'Rencontres avec la création et le patrimoine locaux et internationaux.',
      'Enrichissement des pratiques artistiques via des apports extérieurs et des médiations.',
    ],
  },
  {
    title: 'Parcours éducatif de santé',
    points: [
      'Coopération, bien-être et climat scolaire apaisé dans les projets sportifs et citoyens.',
      'Meilleure connaissance de soi et des autres grâce aux échanges et actions communes.',
    ],
  },
];

const aefeOrientations = [
  'Rayonnement de la langue française et diplomatie éducative.',
  'Mobilité des élèves et personnels dans le réseau AEFE et hors réseau.',
  'Jumelages, partenariats culturels, sportifs et scientifiques, rallyes et concours.',
  'Coopérations locales pour ancrer l’établissement dans son territoire.',
];

const currentDynamics = [
  {
    title: 'Jumelages et voyages récents',
    items: [
      'Rencontre humanitaire et parcours « Saly Express » avec le lycée Jacques Ellul (Bordeaux).',
      'Voyages 2023-2024 : New York (lycée), Madrid (collège), Paris (collège/lycée), JIJ à Athènes.',
      'Projets 2025-2026 : séjour à Paris confirmé ; autres voyages annulés en 2024-2025 faute d’inscriptions.',
    ],
  },
  {
    title: 'Partenariats locaux sur la Petite Côte',
    items: [
      'Pompiers, police, santé, environnement, artisans, artistes et centres culturels.',
      'Associations sportives (judo, Teranga Bike) et acteurs éducatifs ou sociaux locaux.',
      'Section sportive basket-ball en collaboration avec les clubs de la Petite Côte.',
    ],
  },
  {
    title: 'Contribution aux valeurs du LFJP',
    items: [
      'Former des citoyens du monde ancrés localement et développer le multilinguisme.',
      'Favoriser excellence, respect, civisme, persévérance et épanouissement pour tous.',
    ],
  },
];

const strategicOrientations = [
  {
    title: 'Structurer un programme de jumelages internationaux',
    icon: Globe2,
    actions: [
      'Nouer 2 à 4 partenariats durables permettant mobilités d’élèves et d’enseignants.',
      'Aligner chaque projet avec les quatre parcours éducatifs.',
      'Cibler en priorité l’Europe (France, Espagne, Portugal, Allemagne), l’Afrique (Sénégal, Côte d’Ivoire, Maroc, Rwanda) et les Amériques (Canada, États-Unis).',
    ],
  },
  {
    title: 'Renforcer les collaborations locales',
    icon: MapPin,
    actions: [
      'Multiplier les projets de terrain en arts, sport, science et citoyenneté sur la Petite Côte.',
      'Organiser des rencontres inter-établissements et des actions écoresponsables communes.',
    ],
  },
  {
    title: 'Articuler les parcours éducatifs',
    icon: Target,
    actions: [
      'Associer chaque projet à un objectif du PEAC, du parcours citoyen, du Parcours Avenir et du parcours santé.',
      'Documenter les retombées pédagogiques pour chaque niveau.',
    ],
  },
  {
    title: 'Assurer l’équité d’accès',
    icon: ShieldCheck,
    actions: [
      'Développer des échanges à distance et des formats locaux ou régionaux à coûts réduits.',
      'Mettre en place bourses internes, partenariats ou sponsors pour limiter les renoncements.',
    ],
  },
  {
    title: 'Valoriser et communiquer',
    icon: Rocket,
    actions: [
      'Intégrer les projets au calendrier annuel et aux sites PSD/Parcours.',
      'Publier dans la newsletter “Le Petit Prévert”, sur le site internet, les réseaux sociaux et présenter en Conseil d’établissement.',
    ],
  },
];

const impact2030 = [
  'Chaque élève, de la maternelle à la terminale, vit une expérience d’échange ou de projet collaboratif significatif.',
  'Le LFJP est reconnu pour la qualité de ses coopérations locales et internationales et son ancrage dans la Petite Côte.',
  'L’établissement incarne la vision 2030 : innovant, inclusif, tourné vers l’avenir et profondément ouvert au monde.',
];

const JumelagesPartagesProjets = () => {
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
            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80"
            alt="Élèves collaborant autour d’un projet international"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="relative container mx-auto px-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">PSD 2026-2030 · Axe 2</p>
          <h1 className="mt-6 max-w-4xl text-3xl font-playfair font-bold leading-tight md:text-5xl">
            Jumelages, partages, projets collaboratifs locaux et internationaux
          </h1>
          <p className="mt-6 max-w-3xl text-base text-white/85 md:text-lg">
            Consolider la diplomatie éducative et l’ancrage territorial du LFJP en faisant vivre à chaque élève des expériences
            de coopération authentiques, accessibles et porteuses de sens.
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
        <div className="container mx-auto space-y-10 px-6">
          <section className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                <Target className="h-6 w-6" aria-hidden="true" />
                1. Cadre institutionnel – Éducation nationale
              </h2>
              <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-700">
                {nationalReferences.map((ref) => (
                  <div key={ref.title} className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">{ref.title}</h3>
                    <ul className="mt-3 space-y-2">
                      {ref.points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-french-blue">
                            •
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                <Handshake className="h-6 w-6" aria-hidden="true" />
                2. Cadre AEFE – Coopérations éducatives
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-700">
                La mission AEFE favorise le rayonnement de la langue française, la mobilité et le sentiment d’appartenance à une
                communauté scolaire mondiale.
              </p>
              <ul className="mt-6 space-y-3 text-base leading-relaxed text-slate-700">
                {aefeOrientations.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
              <Users className="h-6 w-6" aria-hidden="true" />
              3. Dynamiques du LFJP
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentDynamics.map((block) => (
                <div key={block.title} className="rounded-2xl bg-slate-50 p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
                  <ul className="mt-4 space-y-3 text-base leading-relaxed text-slate-700">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-french-blue">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                <Lightbulb className="h-6 w-6" aria-hidden="true" />
                4. Orientations stratégiques 2026-2030
              </h2>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Ouverture · Coopération · Accessibilité</p>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {strategicOrientations.map((item) => (
                <div key={item.title} className="flex h-full flex-col rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-french-blue">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  </div>
                  <ul className="mt-4 space-y-3 text-base leading-relaxed text-slate-700">
                    {item.actions.map((action) => (
                      <li key={action} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                          •
                        </span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
              <Rocket className="h-6 w-6" aria-hidden="true" />
              5. Engagement 2030
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3 text-base leading-relaxed text-slate-700">
              {impact2030.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-5">
                  <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-french-blue">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-2xl bg-blue-50 p-6 text-base leading-relaxed text-blue-900">
              « Former des citoyens du monde avec un ancrage local profond, dans un établissement innovant, inclusif et tourné
              vers l’avenir » : les jumelages et projets collaboratifs sont un levier majeur pour rendre cette vision tangible.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JumelagesPartagesProjets;
