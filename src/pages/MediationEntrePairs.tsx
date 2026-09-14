import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Home,
  Users,
  Target,
  MessageCircleHeart,
  BookOpen,
  CalendarDays,
  BarChart3,
  LifeBuoy
} from 'lucide-react';

const tocItems = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'contexte', label: 'Contexte et justification' },
  { id: 'objectifs', label: 'Objectifs du projet' },
  { id: 'public-cible', label: 'Public cible' },
  { id: 'methodologie', label: 'Méthodologie' },
  { id: 'contenu-formation', label: 'Contenu de la formation' },
  { id: 'calendrier', label: 'Calendrier prévisionnel' },
  { id: 'evaluation', label: 'Évaluation et perspectives' },
  { id: 'ressources', label: 'Ressources' }
];

const sectionCardClasses =
  'relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl';

const titleClasses = 'text-2xl font-playfair font-semibold text-french-blue mb-4 flex items-center gap-3';
const textClasses = 'text-[clamp(1rem,1.6vw,1.125rem)] leading-relaxed text-slate-700';

const MediationEntrePairs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-white">
      <Navbar showLogo={true} />

      <section className="relative isolate overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80"
            alt="Élèves en discussion dans une salle de classe"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true"></div>
        </div>
        <div className="relative container mx-auto px-6 py-24 md:py-32 text-center text-white">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-balance mb-6">
            Médiation entre pairs à l’école élémentaire
          </h1>
          <p className="mx-auto max-w-3xl text-lg md:text-xl font-light text-white/90">
            Dispositif éducatif visant à apprendre aux élèves à gérer pacifiquement leurs différends et à améliorer le climat scolaire.
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
              <section id="introduction" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-french-blue/5 via-transparent to-french-blue/10" aria-hidden="true"></div>
                <div className="relative">
                  <h2 className={titleClasses}>
                    <MessageCircleHeart className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Introduction
                  </h2>
                  <p className={textClasses}>
                    Dispositif éducatif visant à apprendre aux élèves à gérer pacifiquement leurs différends et à améliorer le climat scolaire.
                  </p>
                </div>
              </section>

              <section id="contexte" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100/60 via-white to-white" aria-hidden="true"></div>
                <div className="relative">
                  <h2 className={titleClasses}>
                    <Users className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Contexte et justification
                  </h2>
                  <ul className="space-y-3 text-left">
                    <li className={textClasses}>
                      La vie scolaire au primaire est aussi un espace de socialisation, propice à des conflits mineurs.
                    </li>
                    <li className={textClasses}>
                      Mettre en place la médiation par les pairs permet d’apprendre à gérer les désaccords, de responsabiliser les élèves et d’améliorer le climat.
                    </li>
                    <li className={textClasses}>
                      Contribution à la prévention du harcèlement et de l’exclusion.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="objectifs" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative">
                  <h2 className={titleClasses}>
                    <Target className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Objectifs du projet
                  </h2>
                  <ul className="space-y-3 text-left">
                    <li className={textClasses}>
                      Former un groupe d’élèves volontaires et responsables au rôle de médiateur.
                    </li>
                    <li className={textClasses}>
                      Donner des outils de communication pour résoudre les conflits pacifiquement (écoute active, reformulation, respect de la parole).
                    </li>
                    <li className={textClasses}>
                      Renforcer les compétences psychosociales: empathie, responsabilité, coopération.
                    </li>
                    <li className={textClasses}>
                      Promouvoir une culture de paix et de respect mutuel au sein de l’école.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="public-cible" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative">
                  <h2 className={titleClasses}>
                    <Users className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Public cible
                  </h2>
                  <ul className="space-y-3 text-left">
                    <li className={textClasses}>
                      Élèves de CE2 à CM2 volontaires et en capacité d’assumer ce rôle.
                    </li>
                    <li className={textClasses}>
                      Enseignants et personnels éducatifs accompagnateurs.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="methodologie" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative">
                  <h2 className={titleClasses}>
                    <BookOpen className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Méthodologie
                  </h2>
                  <ol className="space-y-3 text-left list-decimal list-inside">
                    <li className={textClasses}>
                      Sensibilisation des équipes, élèves et parents.
                    </li>
                    <li className={textClasses}>
                      Sélection des futurs médiateurs (volontariat, validation par l’équipe pédagogique).
                    </li>
                    <li className={textClasses}>
                      Formation initiale des médiateurs (4 à 5 h, en ateliers).
                    </li>
                    <li className={textClasses}>
                      Mise en place du dispositif (temps et lieux de médiation, récréations).
                    </li>
                    <li className={textClasses}>
                      Suivi et accompagnement réguliers avec un adulte référent.
                    </li>
                  </ol>
                </div>
              </section>

              <section id="contenu-formation" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative">
                  <h2 className={titleClasses}>
                    <MessageCircleHeart className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Contenu de la formation
                  </h2>
                  <ul className="space-y-3 text-left">
                    <li className={textClasses}>
                      Comprendre le conflit et ses formes.
                    </li>
                    <li className={textClasses}>
                      Principes de médiation: neutralité, confidentialité, respect.
                    </li>
                    <li className={textClasses}>
                      Compétences de communication: écoute active, reformulation, langage non-violent.
                    </li>
                    <li className={textClasses}>
                      Jeux de rôle et mises en situation.
                    </li>
                    <li className={textClasses}>
                      Éthique et limites: alerter un adulte en cas de situation grave.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="calendrier" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative">
                  <h2 className={titleClasses}>
                    <CalendarDays className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Calendrier prévisionnel
                  </h2>
                  <ul className="space-y-3 text-left">
                    <li className={textClasses}>
                      Septembre: présentation, sensibilisation, sélection des élèves.
                    </li>
                    <li className={textClasses}>
                      Octobre–Novembre: formation initiale.
                    </li>
                    <li className={textClasses}>
                      Décembre–Juin: lancement, suivi, ateliers de renforcement, bilan intermédiaire.
                    </li>
                    <li className={textClasses}>
                      Fin d’année: évaluation et perspectives.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="evaluation" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative">
                  <h2 className={titleClasses}>
                    <BarChart3 className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Évaluation et perspectives
                  </h2>
                  <ul className="space-y-3 text-left">
                    <li className={textClasses}>
                      Nombre de médiations réalisées et issues.
                    </li>
                    <li className={textClasses}>
                      Amélioration du climat scolaire (observations).
                    </li>
                    <li className={textClasses}>
                      Retours des médiateurs et des camarades.
                    </li>
                    <li className={textClasses}>
                      Diminution des conflits rapportés aux adultes.
                    </li>
                    <li className={textClasses}>
                      Pérenniser le dispositif, élargir à d’autres classes, former chaque promotion.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="ressources" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100/70 via-white to-white" aria-hidden="true"></div>
                <div className="relative">
                  <h2 className={titleClasses}>
                    <LifeBuoy className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Ressources
                  </h2>
                  <div className="space-y-3">
                    <p className={textClasses}>
                      <strong>Contact référent :</strong>{' '}
                      <a
                        href="mailto:secretariat@lfjpsaly.org"
                        className="text-french-blue hover:text-french-blue/80 underline decoration-2"
                      >
                        secretariat@lfjpsaly.org
                      </a>
                    </p>
                    <p className="text-sm md:text-base leading-relaxed text-slate-600">
                      Document téléchargeable (si fourni plus tard).
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="lg:w-80 xl:w-96 flex-shrink-0">
              <nav
                aria-labelledby="page-summary-title"
                className="sticky top-28 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur"
              >
                <p id="page-summary-title" className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">
                  Sur cette page
                </p>
                <ul className="space-y-2">
                  {tocItems.map(item => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-french-blue/10 hover:text-french-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-french-blue"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MediationEntrePairs;
