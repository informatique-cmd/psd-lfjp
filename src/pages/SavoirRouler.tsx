import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Bike,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Home,
  Leaf,
  Shield,
  Users,
  Sparkles
} from 'lucide-react';

const tocItems = [
  { id: 'vision', label: 'Former des citoyens responsables et mobiles' },
  { id: 'pedagogie', label: 'Une pédagogie active et progressive' },
  { id: 'programme', label: 'Déroulement du programme' },
  { id: 'logistique', label: 'Encadrement et logistique' },
  { id: 'competences', label: 'Compétences et validation' },
  { id: 'impact', label: 'Impact pour la communauté éducative' }
];

const sectionCardClasses =
  'relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl';

const headingClasses = 'text-2xl font-playfair font-semibold text-french-blue mb-4 flex items-center gap-3';
const textClasses = 'text-[clamp(1rem,1.6vw,1.125rem)] leading-relaxed text-slate-700';

const tableCellClasses = 'border border-slate-200 px-4 py-3 align-top text-left';

const blockData = [
  {
    bloc: '1. Savoir pédaler',
    intitule:
      'Maîtriser les fondamentaux du vélo : équilibre, freinage, trajectoire, équipement et sécurité individuelle.',
    objectif: 'Installer la confiance et les réflexes indispensables pour piloter un vélo en toute sécurité.'
  },
  {
    bloc: '2. Savoir circuler',
    intitule:
      'Découvrir la mobilité à vélo en milieu sécurisé, comprendre les panneaux, communiquer avec les autres usagers.',
    objectif: 'Apprendre à évoluer en groupe et à partager l’espace avec les autres usagers dans un cadre protégé.'
  },
  {
    bloc: '3. Savoir rouler',
    intitule:
      'Se déplacer en situation réelle, en groupe, sur la voie publique, en appliquant les règles du code de la route.',
    objectif: 'Valider l’autonomie des élèves en milieu réel et préparer leurs déplacements quotidiens en sécurité.'
  }
];

const competences = [
  {
    domaine: 'Santé et sécurité',
    competences: 'Vérifier son vélo, régler son casque, circuler sans danger.'
  },
  {
    domaine: 'Citoyenneté',
    competences: 'Respect du code de la route, courtoisie, responsabilité partagée.'
  },
  {
    domaine: 'Autonomie',
    competences: 'Se déplacer seul en sécurité, anticiper les risques.'
  },
  {
    domaine: 'Environnement',
    competences: 'Promouvoir les mobilités douces et la réduction de l’empreinte carbone.'
  }
];

const SavoirRouler = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-white">
      <Navbar showLogo={true} />

      <section className="relative isolate overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542293787938-4d2226c4dc4a?auto=format&fit=crop&w=1600&q=80"
            alt="Enfants circulant à vélo dans un parc"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-slate-900/65" aria-hidden="true"></div>
        </div>
        <div className="relative container mx-auto px-6 py-24 md:py-32 text-center text-white">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-balance mb-6">
            Savoir Rouler à Vélo – Lycée Français Jacques Prévert
          </h1>
          <p className="mx-auto max-w-3xl text-lg md:text-xl font-light text-white/90">
            Former des cyclistes autonomes, responsables et engagés en faveur d’une mobilité durable sur la Petite Côte.
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
        <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2 min-h-[44px]">
          <Home className="h-4 w-4" />
          Accueil
        </Button>
      </div>

      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col-reverse lg:flex-row gap-12">
            <div className="flex-1 space-y-10">
              <section id="vision" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-french-blue/5 via-transparent to-french-blue/10" aria-hidden="true"></div>
                <div className="relative space-y-4">
                  <h2 className={headingClasses}>
                    <Bike className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Former des citoyens responsables et mobiles
                  </h2>
                  <p className={textClasses}>
                    Le programme <strong>Savoir Rouler à Vélo (SRAV)</strong> du <strong>Lycée Français Jacques Prévert</strong>{' '}
                    s’inscrit dans les <strong>axes 1 et 4 du Plan Stratégique de Développement 2026‑2030</strong> pour offrir aux élèves
                    une expérience éducative complète et sécurisée. En partenariat avec <strong>Téranga Bike Adventure Kids (Mazela SARL)</strong>,
                    il développe l’autonomie, la sécurité et le respect des autres usagers.
                  </p>
                  <ul className="space-y-3 text-left">
                    {[
                      'Bien-être et expérience de la communauté éducative',
                      'Façonner les réussites'
                    ].map(item => (
                      <li key={item} className={textClasses}>
                        <span className="inline-flex items-center gap-2 font-medium text-french-blue">
                          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section id="pedagogie" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100/60 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-6">
                  <h2 className={headingClasses}>
                    <BookOpen className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Une pédagogie active et progressive
                  </h2>
                  <p className={textClasses}>
                    La démarche repose sur <strong>trois blocs complémentaires</strong> définis par le ministère français de l’Éducation nationale.
                    Chaque étape consolide les acquis précédents et intègre des évaluations régulières.
                  </p>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                    <table className="min-w-full divide-y divide-slate-200 text-sm md:text-base">
                      <thead className="bg-slate-100/80">
                        <tr className="text-slate-700">
                          <th scope="col" className={tableCellClasses}>
                            Bloc
                          </th>
                          <th scope="col" className={tableCellClasses}>
                            Intitulé
                          </th>
                          <th scope="col" className={tableCellClasses}>
                            Objectif principal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {blockData.map(item => (
                          <tr key={item.bloc} className="odd:bg-white even:bg-slate-50/60">
                            <td className={`${tableCellClasses} font-semibold text-french-blue`}>{item.bloc}</td>
                            <td className={tableCellClasses}>{item.intitule}</td>
                            <td className={tableCellClasses}>{item.objectif}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className={textClasses}>
                    Le SRAV associe <strong>apprentissage technique</strong>, <strong>éducation à la citoyenneté</strong> et
                    <strong> évaluation des compétences</strong> pour les élèves de <strong>CM1, CM2 et 6ème</strong>.
                  </p>
                </div>
              </section>

              <section id="programme" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-6">
                  <h2 className={headingClasses}>
                    <CalendarCheck className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Déroulement du programme
                  </h2>
                  <p className={textClasses}>
                    Une formation immersive de <strong>20 heures sur cinq jours</strong> à <strong>Popenguine</strong>, alternant
                    préparation, pratique et évaluation pour garantir la progression de chaque élève.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      {
                        title: 'Jour 1–2',
                        description:
                          'Diagnostic des niveaux, apprentissage technique, entretien du vélo et premiers ateliers de sécurité.'
                      },
                      {
                        title: 'Jour 3–4',
                        description:
                          'Circulation en milieu sécurisé, maîtrise des règles de déplacement et communication gestuelle en groupe.'
                      },
                      {
                        title: 'Jour 5',
                        description:
                          'Mise en situation réelle sur la voie publique et validation du bloc 3 avec les éducateurs référents.'
                      }
                    ].map(item => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur"
                      >
                        <h3 className="text-lg font-semibold text-french-blue mb-2">{item.title}</h3>
                        <p className="text-sm md:text-base leading-relaxed text-slate-700">{item.description}</p>
                      </div>
                    ))}
                  </div>
                  <p className={textClasses}>
                    Les groupes <strong>débutants</strong> et <strong>confirmés</strong> alternent activités à vélo, sorties nature et
                    veillées éducatives : reboisement avec l’<strong>ONG Nebeday</strong> et découverte de la
                    <strong> réserve naturelle et de la ferme de Popenguine</strong>.
                  </p>
                </div>
              </section>

              <section id="logistique" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-6">
                  <h2 className={headingClasses}>
                    <Users className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Encadrement et logistique
                  </h2>
                  <ul className="space-y-3 text-left">
                    {[
                      {
                        label: 'Site',
                        value:
                          'Centre Téranga Bike à Popenguine (8 000 m², dortoirs, sanitaires, restauration, gardiennage).'
                      },
                      {
                        label: 'Matériel',
                        value: 'Vélos, casques, gilets réfléchissants et atelier de maintenance.'
                      },
                      {
                        label: 'Encadrement',
                        value: 'Éducateurs qualifiés Téranga Bike et enseignants du LFJP, ratio ≈ 1 adulte pour 8 élèves.'
                      },
                      {
                        label: 'Transport',
                        value: 'Bus climatisé Saly ↔ Popenguine.'
                      },
                      {
                        label: 'Tarif 2025',
                        value:
                          '100 000 CFA/enfant (sans transport) ou 110 000 CFA/enfant (avec transport). Gratuité pour les enseignants accompagnateurs.'
                      }
                    ].map(item => (
                      <li key={item.label} className={textClasses}>
                        <span className="font-semibold text-french-blue">{item.label} :</span> {item.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section id="competences" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-lime-100/60 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-6">
                  <h2 className={headingClasses}>
                    <Shield className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Compétences et validation
                  </h2>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                    <table className="min-w-full divide-y divide-slate-200 text-sm md:text-base">
                      <thead className="bg-slate-100/80">
                        <tr>
                          <th scope="col" className={tableCellClasses}>
                            Domaine
                          </th>
                          <th scope="col" className={tableCellClasses}>
                            Compétences clés
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {competences.map(item => (
                          <tr key={item.domaine} className="odd:bg-white even:bg-slate-50/60">
                            <td className={`${tableCellClasses} font-semibold text-french-blue`}>{item.domaine}</td>
                            <td className={tableCellClasses}>{item.competences}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className={textClasses}>
                    Chaque élève reçoit une <strong>attestation « Savoir Rouler LFJP »</strong>, intégrée au
                    <strong> Parcours Citoyen</strong> et au <strong>Parcours Éducation à la Santé</strong>.
                  </p>
                </div>
              </section>

              <section id="impact" className={sectionCardClasses}>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/60 via-white to-white" aria-hidden="true"></div>
                <div className="relative space-y-6">
                  <h2 className={headingClasses}>
                    <Leaf className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    Impact pour la communauté éducative
                  </h2>
                  <ul className="space-y-3 text-left">
                    {[
                      'Favorise le bien-être, la confiance et l’autonomie des élèves.',
                      'Renforce la citoyenneté active et la prévention des risques routiers.',
                      'Soutient les valeurs de respect, civisme, persévérance et excellence du projet d’établissement.',
                      'Valorise les partenariats locaux (Téranga Bike, ONG Nebeday, Réserve de Popenguine, Mairie).',
                      'Inscrit la communauté dans une démarche éco-responsable et inclusive de la Petite Côte.'
                    ].map(item => (
                      <li key={item} className={textClasses}>
                        <span className="inline-flex items-start gap-2">
                          <Sparkles className="mt-1 h-5 w-5 text-french-blue" aria-hidden="true" />
                          <span>{item}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className={textClasses}>
                    <strong>Savoir Rouler au LFJP</strong>, c’est apprendre à se déplacer librement, en sécurité et à devenir acteur
                    d’une mobilité durable et citoyenne.
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

export default SavoirRouler;
