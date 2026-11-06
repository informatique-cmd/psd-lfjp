import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Users2, Lightbulb, Target, ClipboardList, Megaphone, BarChart3 } from 'lucide-react';

const PAGE_TITLE = "Expression et participation | PSD LFJP";

const strategicObjective =
  "Consolider et valoriser les espaces d’expression déjà en place au LFJP (CVEP, CVC, CVL), afin de renforcer l’impact éducatif de la participation des élèves sur le climat scolaire, la citoyenneté et la cohésion de la communauté.";

const operationalObjectives = [
  "Donner une visibilité accrue aux actions et décisions des conseils d’élèves.",
  "Encourager la continuité école-collège-lycée dans la culture de l’engagement.",
  "Structurer l’évaluation et la valorisation des projets menés par les élèves.",
  "Développer la formation à la prise de parole, à la médiation et à la gestion de projets.",
];

const keyActions = [
  {
    volet: 'Consolidation des instances',
    actions: [
      'Poursuivre le fonctionnement du CVEP (premier degré) et renforcer les liens avec le CVC et le CVL via un comité inter-degrés de la vie collégienne et lycéenne.',
      'Formaliser les mandats et les calendriers de réunions dans un document unique publié sur le site du PSD.',
    ],
    periodicite: 'Annuel / continu',
    responsables: 'Vie scolaire, Direction',
  },
  {
    volet: 'Communication et visibilité',
    actions: [
      'Créer une rubrique “Voix des élèves” sur le site du LFJP et le Petit Prévert : comptes rendus, interviews, présentations de projets.',
      'Mettre en place un mur d’expression physique et numérique (QR code, affichage, boîte à idées).',
      'Créer une rubrique dans le petit Prévert dédiée aux élèves avec un comité de rédaction hebdomadaire.',
    ],
    periodicite: 'Continu',
    responsables: 'CPE, responsables communication, délégués',
  },
  {
    volet: 'Valorisation de l’engagement',
    actions: [
      'Instituer un Label “Engagement LFJP” pour récompenser les projets menés par les élèves (bals, journées à thème, actions solidaires, etc.).',
      'Présenter ces initiatives lors de la journée de la vie lycéenne et collégienne.',
    ],
    periodicite: 'Annuel',
    responsables: 'CVL, CVC, CVEP, Direction',
  },
  {
    volet: 'Formation et accompagnement',
    actions: [
      'Mettre en place un parcours de formation des élus (prise de parole, médiation, organisation d’événements).',
      'Intégrer des modules courts dans la formation continue des personnels pour l’accompagnement à la participation.',
    ],
    periodicite: '2 sessions/an',
    responsables: 'Vie scolaire, Direction',
  },
  {
    volet: 'Évaluation de l’impact',
    actions: [
      'Créer un tableau de bord de la participation dans le cadre du PSD : nombre d’élèves impliqués, type de projets, impact perçu sur le climat scolaire.',
      'Intégrer ces données au rapport annuel du CESCE.',
    ],
    periodicite: 'Semestriel',
    responsables: 'Direction, Vie scolaire',
  },
];

const deliverables = [
  'Calendrier consolidé des instances d’élèves.',
  'Page “Voix des élèves” en ligne.',
  'Label “Engagement LFJP” délivré chaque année.',
  'Tableau de bord PSD sur la participation.',
  'Rapport de synthèse annuel présenté en CESCE et au conseil d’établissement.',
];

const budgetItems = [
  {
    poste: 'Communication (supports, site, affiches)',
    detail: 'Charte graphique, maintenance, diffusion — supervisé par la responsable communication',
    montant: '',
    financement: 'Budget communication',
  },
  {
    poste: 'Budget participatif élèves (petits projets)',
    detail: 'Financement symbolique d’initiatives portées par les conseils',
    montant: '400 000',
    financement: 'Budget projet / vie scolaire',
  },
  {
    poste: 'Formation délégués',
    detail: 'Intervenants, supports, ateliers pratiques',
    montant: '250 000',
    financement: 'Budget projets pédagogiques',
  },
  {
    poste: 'Événement annuel “Vie lycéenne et collégienne”',
    detail: 'Logistique, supports, valorisation',
    montant: '250 000',
    financement: 'Budget établissement',
  },
];

const risks = [
  {
    risque: 'Essoufflement de l’implication',
    mesure: 'Reconnaissance officielle par le Label Engagement LFJP et diffusion dans la communication institutionnelle',
  },
  {
    risque: 'Disparité d’engagement entre cycles',
    mesure: 'Comité inter-degrés et accompagnement des enseignants référents',
  },
  {
    risque: 'Invisibilité des réalisations',
    mesure: 'Publication régulière sur les supports numériques et affichages',
  },
  {
    risque: 'Confusion entre vie scolaire et animation',
    mesure: 'Formation ciblée des personnels accompagnateurs',
  },
];

const indicators = [
  'Nombre de réunions et taux de participation aux conseils.',
  'Nombre de projets initiés et menés à terme par les élèves.',
  'Taux de satisfaction des élèves sur leur possibilité d’expression (baromètre climat scolaire).',
  'Pourcentage d’élèves engagés dans un projet collectif.',
  'Indice de visibilité des actions élèves (mentions sur site, réseaux, affichages).',
];

const ExpressionParticipation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const totalBudget = budgetItems.reduce(
    (acc, item) => acc + (item.montant ? Number(item.montant.replace(/\s/g, '')) : 0),
    0,
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-raleway text-slate-900">
      <Navbar showLogo />

      <header className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-900 py-24 text-white md:py-32">
        <div
          className="absolute inset-y-0 right-0 hidden w-1/2 bg-[url('https://i.imgur.com/i4ola7z.jpeg')] bg-cover bg-[position:center_40%] opacity-20 lg:block"
          aria-hidden="true"
        ></div>
        <div className="container relative mx-auto px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Axe 1 · Dialogue & implication</p>
          <h1 className="mt-6 max-w-3xl text-3xl font-playfair font-bold leading-tight md:text-5xl">
            Expression & participation des élèves
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            Développer une culture de la parole et de l’engagement en donnant aux élèves les moyens d’agir, de se former et de valoriser leurs initiatives au cœur du LFJP.
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

      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 md:py-16">
        <div className="container mx-auto space-y-12 px-6">
          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="md:w-3/5">
                <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                  <Target className="h-6 w-6" aria-hidden="true" />
                  1. Objectif stratégique
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-700">{strategicObjective}</p>
              </div>
              <div className="md:w-2/5 rounded-2xl bg-blue-50 p-6 text-blue-900">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-french-blue">Focus</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  Cette action consolide une dynamique d’établissement où chaque élève peut prendre la parole, proposer, débattre et voir ses initiatives reconnues.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[3fr,2fr]">
            <article className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                <Lightbulb className="h-6 w-6" aria-hidden="true" />
                2. Objectifs opérationnels
              </h2>
              <ul className="mt-6 space-y-4 text-base leading-relaxed text-slate-700">
                {operationalObjectives.map((objective) => (
                  <li key={objective} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-french-blue">
                      •
                    </span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                <ClipboardList className="h-6 w-6" aria-hidden="true" />
                4. Livrables attendus
              </h2>
              <ul className="mt-6 space-y-3 text-base leading-relaxed text-slate-700">
                {deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-french-blue">
                      ✓
                    </span>
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
              <Megaphone className="h-6 w-6" aria-hidden="true" />
              3. Actions clés
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100 text-left text-sm text-slate-700 md:text-base">
                <thead className="bg-blue-50/60 text-sm uppercase tracking-wide text-blue-900">
                  <tr>
                    <th scope="col" className="px-4 py-3 align-top">Volet</th>
                    <th scope="col" className="px-4 py-3 align-top">Actions principales</th>
                    <th scope="col" className="px-4 py-3 align-top">Périodicité</th>
                    <th scope="col" className="px-4 py-3 align-top">Responsables</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50/80">
                  {keyActions.map((item) => (
                    <tr key={item.volet} className="bg-white">
                      <td className="px-4 py-4 font-semibold text-french-blue">{item.volet}</td>
                      <td className="px-4 py-4">
                        <ul className="list-disc space-y-2 pl-5">
                          {item.actions.map((action) => (
                            <li key={action}>{action}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{item.periodicite}</td>
                      <td className="px-4 py-4 text-slate-600">{item.responsables}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-playfair font-semibold text-french-blue">5. Moyens et budget indicatif</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100 text-left text-sm text-slate-700 md:text-base">
                <thead className="bg-blue-50/60 text-sm uppercase tracking-wide text-blue-900">
                  <tr>
                    <th scope="col" className="px-4 py-3 align-top">Poste</th>
                    <th scope="col" className="px-4 py-3 align-top">Détail</th>
                    <th scope="col" className="px-4 py-3 align-top">Montant estimé (FCFA)</th>
                    <th scope="col" className="px-4 py-3 align-top">Financement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50/80">
                  {budgetItems.map((item) => (
                    <tr key={item.poste}>
                      <td className="px-4 py-4 font-semibold text-french-blue">{item.poste}</td>
                      <td className="px-4 py-4">{item.detail}</td>
                      <td className="px-4 py-4 text-slate-600">{item.montant || '—'}</td>
                      <td className="px-4 py-4 text-slate-600">{item.financement}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50/40 font-semibold text-blue-900">
                    <td className="px-4 py-4" colSpan={2}>
                      Total estimé
                    </td>
                    <td className="px-4 py-4">{totalBudget.toLocaleString('fr-FR')} FCFA/an</td>
                    <td className="px-4 py-4 text-slate-600">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-playfair font-semibold text-french-blue">6. Risques identifiés et leviers</h2>
              <ul className="mt-6 space-y-4 text-base leading-relaxed text-slate-700">
                {risks.map((risk) => (
                  <li key={risk.risque} className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                    <p className="font-semibold text-french-blue">{risk.risque}</p>
                    <p className="mt-2 text-slate-700">{risk.mesure}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-2xl font-playfair font-semibold text-french-blue">
                <BarChart3 className="h-6 w-6" aria-hidden="true" />
                7. Indicateurs de suivi
              </h2>
              <ul className="mt-6 space-y-3 text-base leading-relaxed text-slate-700">
                {indicators.map((indicator) => (
                  <li key={indicator} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-french-blue">
                      •
                    </span>
                    <span>{indicator}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-playfair font-semibold text-french-blue">Faire résonner la voix des élèves</h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700">
                  La participation active des élèves nourrit un climat scolaire apaisé, développe la citoyenneté et renforce le sentiment d’appartenance à la communauté éducative du LFJP.
                </p>
              </div>
              <Button onClick={() => navigate('/plan-strategique')} className="flex items-center gap-2 bg-french-blue hover:bg-blue-800">
                <Users2 className="h-4 w-4" />
                Découvrir les autres actions de l’axe 1
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExpressionParticipation;
