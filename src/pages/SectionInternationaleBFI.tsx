import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { Button } from '../components/ui/button';

const PAGE_TITLE = 'Section Internationale Américaine – Rentrée 2026 | PSD LFJP';

const timeline = [
  {
    year: '2026',
    level: 'École primaire',
    focus: 'CP à CM2',
    description:
      'Ouverture de la Section Internationale Américaine pour tous les élèves du primaire, avec des enseignements intégrés en anglais et des projets culturels immersifs.',
  },
  {
    year: '2027',
    level: 'Collège',
    focus: '6e à 3e',
    description:
      'Poursuite du parcours bilingue au collège pour consolider les compétences linguistiques, interculturelles et méthodologiques des élèves.',
  },
  {
    year: '2028',
    level: 'Lycée',
    focus: 'Seconde à Terminale',
    description:
      'Préparation au Baccalauréat Français International (BFI) – section américaine, avec des enseignements spécifiques en littérature, histoire-géographie et DNL.',
  },
];

const pedagogie = [
  'Apprentissage par projets mobilisant les arts, les sciences, le sport, l’environnement, le numérique et le théâtre.',
  'Méthode EMILE (enseignement d’une matière intégrée à une langue étrangère) pour lier contenus disciplinaires et pratique de l’anglais.',
  'Évaluation continue des compétences linguistiques et interculturelles, favorisant l’autonomie et la confiance des élèves.',
];

const partenariats = [
  'Ambassade des États-Unis et services culturels pour l’expertise pédagogique et l’animation culturelle.',
  'British Council et écoles internationales de Dakar pour le partage de ressources et la formation continue.',
  'NBA Academy, ONG locales et acteurs économiques de Saly pour des projets ancrés dans le territoire et ouverts sur le monde.',
];

const axesStrategiques = [
  {
    title: 'Axe 2 – Plurilinguisme, multiculturalité et ouverture internationale',
    description:
      'Offrir un parcours bilingue ambitieux qui valorise la diversité linguistique et prépare les élèves à évoluer dans des environnements internationaux.',
  },
  {
    title: 'Axe 4 – Façonner les réussites',
    description:
      'Accompagner chaque élève dans un parcours exigeant, inclusif et équilibré qui conjugue réussite scolaire, personnelle et citoyenne.',
  },
];

const SectionInternationaleBFI: React.FC = () => {
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
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Rentrée 2026</p>
            <h1 className="mt-4 text-3xl font-playfair font-bold leading-tight md:text-5xl">
              Ouverture de la Section Internationale Américaine
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/80 md:text-lg">
              Le Lycée Français Jacques Prévert de Saly ouvre un parcours bilingue et interculturel accessible à tous les élèves du primaire, première étape d’un continuum jusqu’au Baccalauréat Français International – section américaine.
            </p>
          </div>
        </section>

        <div className="container mx-auto flex gap-2 px-6 py-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </div>

        <section className="-mt-10 pb-8 md:pb-12">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-blue-100 md:p-10">
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">Établissement</p>
                  <p className="mt-2 text-2xl font-playfair font-bold text-french-blue">
                    +640 élèves accompagnés de la maternelle à la terminale
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">Accessibilité</p>
                  <p className="mt-2 text-base text-slate-700">
                    La SIA est proposée sans surcoût pour les familles, dans une logique d’inclusion et d’égalité des chances.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">Ambition</p>
                  <p className="mt-2 text-base text-slate-700">
                    Construire un environnement bilingue d’excellence au service du rayonnement de l’enseignement français en Afrique de l’Ouest.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="mb-10 max-w-3xl">
              <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">
                Un parcours bilingue progressif et structuré
              </h2>
              <p className="mt-4 text-base text-slate-700">
                La Section Internationale Américaine accompagne chaque élève dans le développement de compétences linguistiques, culturelles et académiques solides. Elle s’inscrit dans un continuum qui sécurise les apprentissages de l’école primaire au Baccalauréat Français International.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {timeline.map((step) => (
                <div key={step.year} className="flex h-full flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">{step.year}</p>
                  <h3 className="mt-2 text-xl font-playfair font-bold text-french-blue">{step.level}</h3>
                  <p className="text-sm font-semibold text-blue-700">{step.focus}</p>
                  <p className="mt-4 text-sm text-slate-700 md:text-base">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">
                  Une pédagogie immersive et inclusive
                </h2>
                <p className="mt-4 text-base text-slate-700">
                  Les enseignements conjuguent maîtrise de la langue et ouverture culturelle. Les élèves bénéficient d’intervenants anglophones expérimentés, d’une différenciation adaptée à tous les profils et d’outils numériques favorisant l’engagement.
                </p>
                <ul className="mt-6 space-y-3">
                  {pedagogie.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700 md:text-base">
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-french-blue" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-blue-50 p-8 text-blue-900">
                <h3 className="text-xl font-playfair font-bold">Un environnement international stimulant</h3>
                <p className="mt-4 text-base text-blue-900/80">
                  Saly accueille un écosystème dynamique d’entreprises, d’ONG et de familles anglophones. Cet environnement offre des opportunités d’immersion, de stages d’observation et de projets citoyens qui donnent du sens aux apprentissages.
                </p>
                <p className="mt-4 text-base text-blue-900/80">
                  Le LFJP s’appuie sur une équipe pédagogique déjà formée et sur des partenaires solides pour accompagner la montée en puissance du dispositif.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">Des partenariats stratégiques</h2>
                <p className="mt-4 text-base text-slate-700">
                  Le réseau partenarial soutient les actions pédagogiques, l’équipement des classes et l’organisation de projets interculturels.
                </p>
                <ul className="mt-6 space-y-3">
                  {partenariats.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700 md:text-base">
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-french-blue" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">Un projet aligné sur le PSD 2026-2030</h2>
                <p className="mt-4 text-base text-slate-700">
                  L’ouverture de la SIA concrétise les ambitions du Plan Stratégique de Développement et renforce le rôle du LFJP comme pôle éducatif de référence en Afrique de l’Ouest.
                </p>
                <div className="mt-6 space-y-4">
                  {axesStrategiques.map((axe) => (
                    <div key={axe.title} className="rounded-2xl bg-blue-50 p-4 text-blue-900">
                      <h3 className="text-sm font-semibold uppercase tracking-wide">{axe.title}</h3>
                      <p className="mt-2 text-sm text-blue-900/80 md:text-base">{axe.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
              <div>
                <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">
                  Accompagner chaque élève et chaque famille
                </h2>
                <p className="mt-4 text-base text-slate-700">
                  Le LFJP propose un parcours de suivi individualisé, des ateliers pour les familles et des rencontres régulières afin d’assurer une communication transparente et de co-construire les étapes clés du projet bilingue.
                </p>
                <p className="mt-4 text-base text-slate-700">
                  Des évaluations diagnostiques, des dispositifs de remédiation et un accompagnement méthodologique permettent de répondre aux besoins spécifiques tout en maintenant un haut niveau d’exigence.
                </p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-blue-900 p-8 text-white">
                <h3 className="text-xl font-playfair font-bold">Un projet collectif</h3>
                <p className="mt-4 text-sm text-white/80 md:text-base">
                  La Section Internationale Américaine fédère l’ensemble de la communauté éducative : enseignants, personnels, élèves, familles et partenaires institutionnels. Elle participe pleinement au rayonnement de l’enseignement français et à la diplomatie éducative dans la région.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default SectionInternationaleBFI;
