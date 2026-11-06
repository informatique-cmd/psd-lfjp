import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Home,
  Waves,
  LifeBuoy,
  ClipboardCheck,
  Users,
  CalendarCheck,
  Target,
  BookOpen,
  ShieldCheck,
  Droplet,
  Sparkles
} from 'lucide-react';

const tocItems = [
  { id: 'enjeux', label: 'Un enjeu de sécurité pour tous' },
  { id: 'cadre-officiel', label: 'Cadre officiel Éducation nationale & AEFE' },
  { id: 'organisation', label: 'Organisation du dispositif au LFJP' },
  { id: 'progression', label: 'Progression des 10 séances' },
  { id: 'evaluation', label: 'Évaluation et validation' },
  { id: 'logistique', label: 'Encadrement et partenariats' },
  { id: 'impact', label: 'Effets attendus pour la communauté' }
];

const sectionCardClasses =
  'relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl';

const headingClasses = 'text-2xl font-playfair font-semibold text-french-blue mb-4 flex items-center gap-3';
const textClasses = 'text-[clamp(1rem,1.6vw,1.125rem)] leading-relaxed text-slate-700';

const tableCellClasses = 'border border-slate-200 px-4 py-3 align-top text-left';

const progressionData = [
  {
    seances: 'Séances 1-2',
    focus: 'Remise à l’eau, aisance respiratoire et flottabilité',
    contenus: [
      'Entrées variées (assis, sauté) et retour au bord en autonomie',
      'Immersions complètes, bulles et apnée contrôlée',
      'Flottabilité ventrale et dorsale avec et sans appuis matériels'
    ]
  },
  {
    seances: 'Séances 3-4',
    focus: 'Propulsions ventrales et dorsales',
    contenus: [
      'Battements jambes, coordination bras/jambes avec planche',
      'Glissées ventrales et retournements sur le dos',
      'Gestion de la respiration sur déplacements courts'
    ]
  },
  {
    seances: 'Séances 5-6',
    focus: 'Endurance aquatique et changements d’orientation',
    contenus: [
      'Enchaînements ventral/dorsal sur 25 mètres',
      'Exploration en grande profondeur, remontées contrôlées',
      'Parcours aménagés avec franchissement d’anneaux'
    ]
  },
  {
    seances: 'Séances 7-8',
    focus: 'Préparation au parcours officiel ASNS',
    contenus: [
      'Saut en grande profondeur sans reprise d’appuis',
      'Maintien en surface 10 secondes, redressements contrôlés',
      'Enchaînement de 50 mètres (25 m ventral + 25 m dorsal)'
    ]
  },
  {
    seances: 'Séances 9-10',
    focus: 'Simulation du test, autonomie et sécurité',
    contenus: [
      'Parcours complet chronométré et feedback individualisé',
      'Remorquage d’un camarade et consignes de sécurité',
      'Préparation à l’attestation et formalisation des progrès'
    ]
  }
];

const evaluationItems = [
  {
    critere: 'Attestation du savoir-nager en sécurité (ASNS)',
    exigences: [
      'Plongeon ou saut vers l’avant depuis le bord sans appui matériel',
      'Revenir à la surface, se maintenir 10 secondes et se retourner',
      'Parcourir 25 mètres en position ventrale puis 25 mètres en position dorsale',
      'Franchir une ligne d’eau immergée ou passer sous un obstacle flottant',
      'Sortir du bassin sans aide'
    ]
  },
  {
    critere: 'Compétences du Socle commun & EPS cycle 3/4',
    exigences: [
      'Adapter ses déplacements à différents environnements',
      'Respecter les règles de sécurité individuelle et collective',
      'Mobiliser ses ressources pour produire la meilleure performance possible',
      'Partager des repères communs et assumer des rôles sociaux dans l’activité'
    ]
  }
];

const impactItems = [
  'Sécuriser la pratique de toutes les activités aquatiques organisées par le LFJP (voyages, sorties, ASSR).',
  'Contribuer au Parcours éducatif de santé et au Parcours citoyen pilotés par l’AEFE.',
  'Renforcer la coopération familles–établissement autour d’un enjeu majeur de prévention des risques.',
  'Développer confiance en soi, persévérance et entraide au sein des classes de CM2 et 6e.',
  'Valoriser les installations locales (clinique Senghor) et l’expertise des enseignants d’EPS du LFJP.'
];

const SavoirNager = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-white">
      <Navbar showLogo={true} />

      <section className="relative isolate overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1505842514293-229520e7f87e?auto=format&fit=crop&w=1600&q=80"
            alt="Élèves pratiquant la natation dans une piscine"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-slate-900/65" aria-hidden="true"></div>
        </div>
        <div className="relative container mx-auto px-6 py-24 md:py-32 text-center text-white">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-balance mb-6">
            Dispositif « Savoir nager » – Lycée Français Jacques Prévert
          </h1>
          <p className="mx-auto max-w-3xl text-lg md:text-xl font-light text-white/90">
            Garantir à chaque élève de CM2 et de 6<sup>e</sup> une autonomie aquatique sécurisée, conforme aux exigences de
            l’Éducation nationale et de l’AEFE.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => navigate('/plan-strategique')} className="flex items-center gap-2 min-h-[44px]">
          <ArrowLeft className="h-4 w-4" />
          Retour au PSD
        </Button>
        <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2 min-h-[44px]">
          <Home className="h-4 w-4" />
          Accueil
        </Button>
      </div>

      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col-reverse lg:flex-row gap-12">
            <div className="flex-1 space-y-10">
              <section id="enjeux" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100/60 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-4">
                  <h2 className={headingClasses}>
                    <Waves className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Un enjeu de sécurité pour tous
                  </h2>
                  <p className={textClasses}>
                    Depuis septembre 2024, le <strong>LFJP</strong> déploie une stratégie ambitieuse pour que chaque élève de
                    <strong> CM2 et de 6<sup>e</sup></strong> maîtrise les compétences du <strong>savoir-nager en sécurité</strong>.
                    Cette priorité répond aux objectifs du <strong>Plan Stratégique de Développement 2026-2030</strong> : bien-être,
                    prévention des risques et égalité des chances.
                  </p>
                  <ul className="space-y-3 text-left">
                    {[
                      'Test diagnostic en début d’année pour l’ensemble des CM2 et les nouveaux élèves de 6e.',
                      'Intégration dans l’emploi du temps d’EPS avec des séances spécifiques pour les élèves non-validés.',
                      'Lien renforcé avec les familles pour accompagner la progression et encourager la persévérance.'
                    ].map(item => (
                      <li key={item} className={textClasses}>
                        <span className="inline-flex items-start gap-2">
                          <Droplet className="mt-1 h-5 w-5 text-french-blue" aria-hidden="true" />
                          <span>{item}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section id="cadre-officiel" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-4">
                  <h2 className={headingClasses}>
                    <BookOpen className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Cadre officiel Éducation nationale & AEFE
                  </h2>
                  <p className={textClasses}>
                    Le dispositif s’aligne sur la <strong>circulaire n° 2017-127 du 22 août 2017</strong> et sur la{' '}
                    <strong>note AEFE « Apprendre à nager partout dans le réseau »</strong>. L’<strong>Attestation du Savoir-Nager en
                    Sécurité (ASNS)</strong> constitue l’objectif prioritaire du cycle 3, préalable à l’accès aux activités aquatiques
                    et nautiques du collège.
                  </p>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white/95">
                    <table className="min-w-full divide-y divide-slate-200 text-sm md:text-base">
                      <thead className="bg-slate-100/80">
                        <tr className="text-slate-700">
                          <th scope="col" className={tableCellClasses}>
                            Références
                          </th>
                          <th scope="col" className={tableCellClasses}>
                            Exigences clés
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[{
                          reference: 'Programme EPS cycle 3',
                          exigences: 'Savoir nager 50 mètres en grande profondeur, passer sous un obstacle, flotter et se déplacer sans assistance.'
                        },
                        {
                          reference: 'Circulaire ASNS',
                          exigences: 'Départ depuis le bord, immersion, maintien de 10 s, déplacement ventral et dorsal, sortie de l’eau sans appui.'
                        },
                        {
                          reference: 'Orientation AEFE EPS',
                          exigences: 'Intégrer le savoir-nager dans le Parcours éducatif de santé et la prévention des risques majeurs.'
                        }].map(item => (
                          <tr key={item.reference} className="odd:bg-white even:bg-slate-50/60">
                            <td className={`${tableCellClasses} font-semibold text-french-blue`}>{item.reference}</td>
                            <td className={tableCellClasses}>{item.exigences}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="organisation" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100/60 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-4">
                  <h2 className={headingClasses}>
                    <CalendarCheck className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Organisation du dispositif au LFJP
                  </h2>
                  <p className={textClasses}>
                    Chaque rentrée, <strong>tous les CM2</strong> et les <strong>élèves entrants de 6<sup>e</sup></strong> passent un
                    <strong> test de positionnement</strong> à la <strong>piscine de la clinique Senghor</strong>. Les élèves
                    validant l’ASNS poursuivent le cursus EPS habituel. Les autres rejoignent un <strong>parcours de 10 séances</strong>
                    animées par <strong>Madame Dramé</strong>, enseignante certifiée d’EPS.
                  </p>
                  <ul className="space-y-3 text-left">
                    {[{
                      label: 'Public concerné',
                      value: 'CM2 (promotion 2024-2025) et élèves de 6e non-validés ou nouvellement inscrits.'
                    },
                    {
                      label: 'Périodicité',
                      value: 'Deux séances hebdomadaires de 45 minutes d’octobre à décembre ou de janvier à mars selon les groupes.'
                    },
                    {
                      label: 'Différenciation',
                      value: 'Groupes de besoin (débutants, apprenants, consolidants) avec suivis individualisés et carnet de bord.'
                    }].map(item => (
                      <li key={item.label} className={textClasses}>
                        <span className="font-semibold text-french-blue">{item.label} : </span>
                        {item.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section id="progression" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-6">
                  <h2 className={headingClasses}>
                    <Target className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Progression des 10 séances
                  </h2>
                  <p className={textClasses}>
                    La progression respecte les étapes recommandées par l’AEFE : <strong>se familiariser avec le milieu aquatique</strong>,
                    <strong> se déplacer</strong>, <strong>respirer et flotter</strong>, puis <strong>se sauver et porter secours</strong>.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {progressionData.map(item => (
                      <div
                        key={item.seances}
                        className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur"
                      >
                        <h3 className="text-lg font-semibold text-french-blue mb-1">{item.seances}</h3>
                        <p className="text-sm md:text-base font-medium text-slate-700 mb-3">{item.focus}</p>
                        <ul className="space-y-2 text-left">
                          {item.contenus.map(contenu => (
                            <li key={contenu} className="text-sm md:text-base leading-relaxed text-slate-700">
                              • {contenu}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="evaluation" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-6">
                  <h2 className={headingClasses}>
                    <ClipboardCheck className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Évaluation et validation
                  </h2>
                  <p className={textClasses}>
                    Les évaluations formatives rythment chaque séance (auto-observation, tutorat, retours vidéo). Deux
                    <strong> bilans certificatifs</strong> sont organisés : en <strong>séance 5</strong> et lors du <strong>test final</strong>.
                  </p>
                  <div className="space-y-6">
                    {evaluationItems.map(item => (
                      <div key={item.critere} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-french-blue mb-3">{item.critere}</h3>
                        <ul className="space-y-2 text-left">
                          {item.exigences.map(exigence => (
                            <li key={exigence} className="text-sm md:text-base leading-relaxed text-slate-700">
                              <span className="inline-flex items-start gap-2">
                                <ShieldCheck className="mt-1 h-5 w-5 text-french-blue" aria-hidden="true" />
                                <span>{exigence}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className={textClasses}>
                    La délivrance de l’<strong>attestation officielle</strong>, signée par l’équipe EPS, est transmise aux familles et
                    enregistrée dans les dossiers élèves pour la poursuite de la scolarité au collège.
                  </p>
                </div>
              </section>

              <section id="logistique" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-lime-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-6">
                  <h2 className={headingClasses}>
                    <Users className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Encadrement et partenariats
                  </h2>
                  <ul className="space-y-3 text-left">
                    {[{
                      label: 'Enseignement',
                      value: 'Madame Dramé, enseignante certifiée d’EPS, référente natation du LFJP.'
                    },
                    {
                      label: 'Site d’apprentissage',
                      value: 'Piscine couverte de la clinique Senghor, profondeur modulable de 0,90 m à 2,20 m.'
                    },
                    {
                      label: 'Sécurité',
                      value: 'Présence du personnel de secours de la clinique et respect du protocole d’encadrement AEFE (ratio 1 adulte / 8 élèves en grande profondeur).'
                    },
                    {
                      label: 'Matériel',
                      value: 'Ceintures, planches, frites, anneaux lestés, caméra étanche pour feedback différé.'
                    }].map(item => (
                      <li key={item.label} className={textClasses}>
                        <span className="font-semibold text-french-blue">{item.label} : </span>
                        {item.value}
                      </li>
                    ))}
                  </ul>
                  <p className={textClasses}>
                    Le dispositif est financé sur le budget EPS et bénéficie de l’appui logistique de l’<strong>Association sportive du LFJP</strong> pour les transports.
                  </p>
                </div>
              </section>

              <section id="impact" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/60 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-6">
                  <h2 className={headingClasses}>
                    <LifeBuoy className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Effets attendus pour la communauté
                  </h2>
                  <ul className="space-y-3 text-left">
                    {impactItems.map(item => (
                      <li key={item} className={textClasses}>
                        <span className="inline-flex items-start gap-2">
                          <Sparkles className="mt-1 h-5 w-5 text-french-blue" aria-hidden="true" />
                          <span>{item}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className={textClasses}>
                    Reconduit en <strong>2025</strong>, le programme « savoir nager » du LFJP garantit une continuité éducative et une
                    acculturation durable aux enjeux de sécurité aquatique pour tous les élèves.
                  </p>
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

export default SavoirNager;
