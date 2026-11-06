import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Users2, Lightbulb, Target, ClipboardList } from 'lucide-react';

const PAGE_TITLE = 'Parentalité et co-éducation | PSD LFJP';

const operationalObjectives = [
  'Structurer un cadre de co-éducation fondé sur la confiance et la transparence.',
  'Développer la participation parentale dans les dispositifs éducatifs et culturels.',
  'Soutenir les familles dans le suivi du parcours de leurs enfants.',
  'Évaluer régulièrement la qualité du dialogue école-familles.',
];

const keyActions = [
  {
    volet: 'Communication et dialogue',
    actions: [
      'Créer une charte école-familles précisant droits, devoirs et modalités de dialogue.',
      'Harmoniser les supports de communication (mails, site, réunions, carnets numériques).',
      'Publier un calendrier annuel des temps d’échanges (rencontres parents-professeurs, cafés-parents, réunions pédagogiques ouvertes).',
    ],
    periodicite: 'Annuel',
    responsables: 'Proviseur, Directrice du primaire, Référente vie scolaire',
  },
  {
    volet: 'Accompagnement parental',
    actions: [
      'Mettre en place des ateliers “Comprendre les apprentissages” (lecture, orientation, numérique).',
      'Former les enseignants à la communication bienveillante avec les familles (via IRF).',
    ],
    periodicite: '2 sessions/an',
    responsables: 'Direction + équipes pédagogiques',
  },
  {
    volet: 'Participation aux projets éducatifs',
    actions: [
      'Intégrer des parents-ressources dans le PEAC et le Parcours Avenir (témoignages métiers, accompagnement de sorties).',
      'Créer un comité co-éducation rattaché au CESCE.',
    ],
    periodicite: 'Trimestriel',
    responsables: 'Direction + représentants des parents',
  },
  {
    volet: 'Évaluation et amélioration continue',
    actions: [
      'Intégrer un baromètre de satisfaction familles (questionnaire semestriel).',
      'Analyser la corrélation entre participation parentale et indicateurs de réussite ou climat scolaire.',
    ],
    periodicite: 'Semestriel',
    responsables: 'Équipe direction + CPE + enseignants référents',
  },
];

const deliverables = [
  'Charte école-familles validée en CESCE.',
  'Guide pratique “Co-éducation au LFJP”.',
  'Base de données des actions familles-école (via tableau de bord PSD).',
  'Rapport annuel co-éducation intégré au bilan d’établissement.',
];

const budgetItems = [
  {
    poste: 'Formations et ateliers',
    detail: 'Intervenants, supports, communication',
    montant: '0',
    financement: "Intégré dans la facturation AEFE des établissements partenaires",
  },
  {
    poste: 'Enquêtes familles (baromètre)',
    detail: 'Conception + traitement des données',
    montant: '100 000',
    financement: 'Budget communication',
  },
  {
    poste: 'Actions parents-ressources',
    detail: 'Logistique, transport, collations',
    montant: '200 000',
    financement: 'Budget projet / partenaires',
  },
  {
    poste: 'Communication visuelle',
    detail: 'Charte, affichage, supports numériques',
    montant: '100 000',
    financement: 'Budget établissement',
  },
];

const risks = [
  {
    risque: 'Faible participation parentale',
    mesure: 'Planification anticipée, horaires flexibles, communication ciblée',
  },
  {
    risque: 'Confusion des rôles école/parents',
    mesure: 'Diffusion claire de la charte école-familles',
  },
  {
    risque: 'Inégalité de participation selon les cycles',
    mesure: 'Coordination école-collège-lycée via comité co-éducation',
  },
  {
    risque: 'Essoufflement des initiatives',
    mesure: 'Rotation annuelle des parents-ressources, valorisation publique',
  },
];

const indicators = [
  'Taux de participation des familles aux réunions et projets.',
  'Pourcentage de retours aux enquêtes de satisfaction.',
  'Nombre d’ateliers et d’actions familles-école réalisés.',
  'Évolution de l’indice de climat scolaire.',
  'Taux d’assiduité et de réussite corrélé à l’implication parentale.',
];

const ParentaliteCoeEducation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const totalBudget = budgetItems.reduce((acc, item) => acc + Number(item.montant.replace(/\s/g, '')), 0);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-raleway text-slate-900">
      <Navbar showLogo />

      <header className="relative isolate overflow-hidden bg-gradient-to-br from-french-blue via-blue-700 to-blue-900 py-24 text-white md:py-32">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[url('https://i.imgur.com/u9AjgA4.jpeg')] bg-cover bg-top opacity-20 lg:block" aria-hidden="true"></div>
        <div className="container relative mx-auto px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Axe 1 · Dialogue & implication</p>
          <h1 className="mt-6 max-w-3xl text-3xl font-playfair font-bold leading-tight md:text-5xl">
            Parentalité et co-éducation
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            Renforcer la coopération école-familles pour soutenir la réussite des élèves, améliorer le climat scolaire et favoriser la cohésion communautaire.
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
                <p className="mt-4 text-base leading-relaxed text-slate-700">
                  Renforcer la coopération école-familles pour soutenir la réussite, le climat scolaire et la cohésion communautaire, conformément aux orientations du MEN, de l’AEFE et des principes de gestion parentale.
                </p>
              </div>
              <div className="md:w-2/5 rounded-2xl bg-blue-50 p-6 text-blue-900">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-french-blue">Focus</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  L’action Parentalité et co-éducation constitue un levier majeur pour impliquer les familles dans la dynamique éducative, sécuriser les parcours et valoriser la communauté du LFJP.
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
            <h2 className="text-2xl font-playfair font-semibold text-french-blue">3. Actions clés</h2>
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
                      <td className="px-4 py-4 text-slate-600">{item.montant}</td>
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
              <h2 className="text-2xl font-playfair font-semibold text-french-blue">7. Indicateurs de suivi</h2>
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
                <h2 className="text-2xl font-playfair font-semibold text-french-blue">Une communauté éducative engagée</h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700">
                  En fédérant les familles autour d’objectifs partagés, le LFJP renforce l’accompagnement des élèves, dynamise les projets éducatifs et consolide un climat scolaire serein et inclusif.
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

export default ParentaliteCoeEducation;
