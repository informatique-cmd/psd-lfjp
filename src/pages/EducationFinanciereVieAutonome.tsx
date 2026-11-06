import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, GraduationCap, PiggyBank, Compass } from 'lucide-react';

const PAGE_TITLE = 'Éducation financière et à la vie autonome | PSD LFJP';

const programmePiliers = [
  {
    title: 'Mise en place d’EDUCFI',
    description:
      "Déploiement du référentiel Éducation Économique, Budgétaire et Financière (EDUCFI) en partenariat avec des acteurs locaux et l'Ambassade de France.",
    icon: GraduationCap,
  },
  {
    title: 'Compétences de vie autonome',
    description:
      "Modules pratiques pour préparer les lycéens à la vie quotidienne étudiante : logement, alimentation, santé et accès aux services publics.",
    icon: Compass,
  },
  {
    title: 'Gestion budgétaire étudiante',
    description:
      "Ateliers interactifs pour apprendre à planifier un budget annuel, anticiper les dépenses et maîtriser les outils numériques de suivi.",
    icon: PiggyBank,
  },
];

const parcoursEtudiants = [
  {
    title: 'Avant le départ',
    points: [
      'Séances EDUCFI intégrées au parcours avenir dès la quatrième.',
      'Rencontres avec des parents et professionnels installés en France pour partager expériences et conseils.',
      "Création d'un kit numérique avec modèles de budget, glossaire bancaire et check-lists administratives.",
    ],
  },
  {
    title: 'Pendant l’installation',
    points: [
      'Ateliers en visioconférence sur l’ouverture d’un compte bancaire, les assurances obligatoires et la gestion des aides.',
      'Accompagnement à la compréhension des contrats de logement, bourses CROUS et mutuelles étudiantes.',
      'Tutorat entre alumni et nouveaux étudiants pour un suivi personnalisé les trois premiers mois.',
    ],
  },
  {
    title: 'Suivi à distance',
    points: [
      'Webinaires trimestriels pour ajuster le budget et gérer les imprévus.',
      'Plateforme de ressources avec fiches pratiques, podcasts et vidéos de témoignages.',
      'Temps d’échanges réguliers avec le service orientation pour évaluer l’autonomie acquise.',
    ],
  },
];

const ressources = [
  {
    title: 'Ateliers pratiques',
    description:
      "Simulations de budget, jeux de rôle sur les démarches administratives et analyse de factures réelles pour développer des réflexes responsables.",
  },
  {
    title: 'Communauté éducative mobilisée',
    description:
      "Implication des familles, d'entrepreneurs, de banquiers et d'alumni pour animer les séances et témoigner de parcours inspirants.",
  },
  {
    title: 'Outils numériques',
    description:
      "Utilisation d'applications de gestion budgétaire, d'un tableau de bord partagé et de ressources AEFE dédiées à la vie étudiante en France.",
  },
];

const EducationFinanciereVieAutonome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-raleway text-slate-900">
      <Navbar showLogo />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-french-blue via-blue-700 to-blue-900 py-16 text-white md:py-24">
          <div className="container mx-auto px-6">
            <p className="text-sm uppercase tracking-widest text-white">Axe 4 · Réussites personnelles et citoyennes</p>
            <h1 className="mt-4 text-3xl font-playfair font-bold leading-tight md:text-5xl">
              Éducation financière et à la vie autonome
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/80 md:text-lg">
              Nous accompagnons nos lycéens dans la mise en place du programme EDUCFI et dans l’appropriation des codes de la vie étudiante en France afin de sécuriser leur réussite post-bac.
            </p>
          </div>
        </section>

        <div className="container mx-auto flex gap-2 px-6 py-4">
          <Button variant="outline" onClick={() => navigate('/plan-strategique')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </div>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {programmePiliers.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="flex h-full flex-col rounded-2xl border border-blue-100 bg-blue-50/40 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg"
                  >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-french-blue/10 text-white">
                      <Icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <h2 className="text-xl font-semibold text-french-blue">{item.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700 md:text-base">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-blue-100">
              <h2 className="text-2xl font-playfair font-bold text-french-blue">
                Un parcours guidé pour les élèves poursuivant leurs études en France
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-700">
                De la classe de seconde à l’entrée dans l’enseignement supérieur, chaque étape consolide l’autonomie et la maîtrise budgétaire des élèves.
              </p>

              <div className="mt-10 grid gap-8 lg:grid-cols-3">
                {parcoursEtudiants.map((block) => (
                  <article key={block.title} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-lg font-semibold text-french-blue">{block.title}</h3>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">
                      {block.points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-french-blue/10 text-sm font-semibold text-french-blue">
                            •
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <h2 className="text-2xl font-playfair font-bold text-french-blue">Des ressources concrètes pour agir</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-700">
                  Chaque séance associe mise en situation, outils numériques et retours d’expérience afin de permettre aux futurs étudiants de se projeter sereinement dans leur nouvelle vie.
                </p>

                <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700 md:text-base">
                  {ressources.map((item) => (
                    <li key={item.title} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                      <p className="text-sm font-semibold uppercase tracking-wide text-french-blue">{item.title}</p>
                      <p className="mt-2 text-slate-700">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </article>

              <aside className="flex flex-col justify-between gap-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-8 text-blue-900">
                <div>
                  <h2 className="text-lg font-semibold text-french-blue">Réseau d’accompagnement</h2>
                  <p className="mt-3 text-sm leading-relaxed md:text-base">
                    Le dispositif mobilise le service orientation, les associations de parents d’élèves et un collectif d’alumni bénévoles pour répondre aux questions pratiques et budgétaires.
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-5 text-sm text-slate-800 shadow-sm">
                  <p className="font-semibold uppercase tracking-wide text-french-blue">Objectif</p>
                  <p className="mt-2">
                    Garantir que 100 % des élèves quittant le lycée disposent d’un plan budgétaire réaliste et des ressources nécessaires pour gagner en autonomie dès leur arrivée en France.
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-5 text-sm text-slate-800 shadow-sm">
                  <p className="font-semibold uppercase tracking-wide text-french-blue">Acteurs mobilisés</p>
                  <p className="mt-2">
                    Conseillers d’orientation, parents volontaires, partenaires bancaires et représentants d’organismes sociaux accompagnent la montée en compétence des élèves.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EducationFinanciereVieAutonome;
