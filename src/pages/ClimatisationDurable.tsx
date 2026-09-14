import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Home,
  Sun,
  Leaf,
  Users,
  ClipboardList,
  BarChart4,
  Building2,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Scale,
} from 'lucide-react';

const surveyHighlights = [
  {
    title: 'Priorité parents',
    value: '4,33 / 5',
    description: 'La climatisation des salles ressort comme la deuxième priorité absolue.',
    icon: Users,
    tone: 'from-blue-500/10 via-blue-500/5 to-transparent',
  },
  {
    title: 'Attente élèves',
    value: '3,92 / 5',
    description:
      'Les élèves classent la climatisation comme leur deuxième attente majeure derrière les voyages.',
    icon: ClipboardList,
    tone: 'from-violet-500/10 via-violet-500/5 to-transparent',
  },
  {
    title: 'Enjeux PSD',
    value: 'Confort & sobriété',
    description:
      'Le déploiement progressif vise à concilier bien-être thermique et trajectoire énergétique durable.',
    icon: Leaf,
    tone: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  },
];

// Correction: remplacement des montants approximatifs par les devis exacts et ajout des données techniques issues du comparatif Excel.
const offers = [
  {
    supplier: 'Entreprise A',
    tech: '12 multi-splits muraux 27K BTU et 4 multi-splits 18K BTU + 56 panneaux 615 W (Jinko Solar Tiger Neo)',
    scope: 'Salles de cours prioritaires, salles spécialisées et administration',
    specificities: 'Injection directe via panneaux solaires (ni batterie – ni onduleur). Marque Deye.',
    cost: '27 732 000 FCFA',
    afterSales: [
      'Pièces détachées tenues en stock localement.',
      'Garantie de 3 ans sur les splits solaires et 10 ans sur les panneaux.',
    ],
    technicalComment:
      'Prix compétitif avec disponibilité locale et équipements calibrés pour le climat sénégalais.',
  },
  {
    supplier: 'Entreprise B',
    tech: '14 multi-splits muraux 36K & 27K BTU + 96 panneaux 550 W',
    scope: 'Couverture totale des ailes pédagogiques climatisées',
    specificities:
      'Injection directe via panneaux solaires (ni batterie – ni onduleur). Marque ClimSol.',
    cost: '66 745 508 FCFA',
    afterSales: [
      'Service après-vente non détaillé dans l’offre.',
      'Garantie globale 2 ans sur le système et 10 ans sur les panneaux solaires.',
    ],
    technicalComment:
      'Investissement le plus élevé avec des équipements puissants mais une marque difficile à vérifier et un SAV flou.',
  },
  {
    supplier: 'Entreprise C',
    tech: '13 multi-splits muraux 27K & 18K BTU + 84 panneaux 500 W',
    scope: 'Climatisation + éclairage basse consommation sur un bloc complet',
    specificities:
      'Onduleur hybride fourni avec batterie de stockage intégrée. Marque Énergie Solaire Sénégal.',
    cost: '33 521 020 FCFA',
    afterSales: [
      'Service après-vente non mentionné malgré la présence du stockage.',
      'Garantie d’un an seulement sur l’ensemble.',
    ],
    technicalComment:
      'Équipements d’origine chinoise avec adaptation incertaine et risques de maintenance complexe sans SAV identifié.',
  },
  {
    supplier: 'Entreprise D',
    tech: '12 multi-splits muraux 27K BTU + 126 panneaux 400 W',
    scope: '16 unités ciblant salles et locaux administratifs',
    specificities: 'Injection directe via panneaux solaires (ni batterie – ni onduleur). Marque Blular.',
    cost: '31 664 356 FCFA',
    afterSales: [
      'Service après-vente non disponible sur place (prestataire basé en France).',
      'Garantie non précisée, remplacement des pièces rendu difficile par la logistique.',
    ],
    technicalComment:
      'Offre internationale sans SAV local, logistique lourde (transport et douane non inclus).',
  },
];

// Correction: ajustement du classement pour refléter les forces/faiblesses techniques et SAV de chaque devis.
const ranking = [
  {
    position: '1',
    supplier: 'Entreprise A',
    rationale:
      'Meilleur rapport coût/garanties, SAV local avec pièces disponibles et seul devis multi-splits complet, tout en restant l’offre la plus compétitive.',
  },
  {
    position: '2',
    supplier: 'Entreprise C',
    rationale:
      'Budget maîtrisé et stockage complet, mais adaptation des équipements chinois incertaine et garantie limitée à un an.',
  },
  {
    position: '3',
    supplier: 'Entreprise D',
    rationale:
      'Devis attractif mais absence totale de SAV sur place et coûts logistiques additionnels (transport/douanes) à prévoir.',
  },
  {
    position: '4',
    supplier: 'Entreprise B',
    rationale:
      'Montant le plus élevé, marque non référencée et service après-vente non clarifié malgré des puissances supérieures.',
  },
];

const testInsights = [
  'Période d’observation : 8 au 12 septembre 2025, alternance soleil/nuages avec épisodes pluvieux.',
  'Consommation totale de la semaine (3 évaporateurs) : ~93 kWh, dont 27 kWh en alimentation mixte et 65,5 kWh en solaire.',
  'Apports solaires : production moyenne 7,8 kWh/jour, pointe 9,8 kWh/jour lors des journées ensoleillées par split.',
  'Conditions ambiantes : températures extérieures de 26 à 31 °C pour un ressenti de 30 à 37 °C ; la climatisation solaire maintient une température intérieure de 24 à 25 °C.',
  'Gain constaté : optimisation des kWh solaires consommés et réduction mécanique de l’absorption électrique par évaporateur.',
];

const ClimatisationDurable = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <Navbar showLogo />

      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm tracking-wide uppercase">
                <Sun className="h-4 w-4" aria-hidden="true" />
                <span>Cadre de vie & infrastructures</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold">Climatisation durable</h1>
              <p className="text-base md:text-lg text-slate-200">
                Synthèse des études techniques, des retours d’usage et des préférences communautaires pour guider le
                déploiement de solutions de climatisation solaire au sein du lycée.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
                onClick={() => navigate('/plan-strategique')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Retour au plan stratégique
              </Button>
              <Button
                variant="outline"
                className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
                onClick={() => navigate('/')}
              >
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Accueil PSD
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-6 -mt-12 md:-mt-16">
          <div className="grid gap-6 md:grid-cols-3">
            {surveyHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-none shadow-lg bg-white/90 backdrop-blur">
                  <CardHeader className={`bg-gradient-to-br ${item.tone} rounded-t-2xl p-6`}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-slate-900">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <CardTitle className="text-lg text-slate-900">{item.title}</CardTitle>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <Tabs defaultValue="perceptions" className="space-y-10" aria-label="Navigation des synthèses climatisation durable">
            <TabsList className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 h-auto bg-transparent p-0">
              <TabsTrigger
                value="perceptions"
                className="group flex w-full flex-col items-start gap-1 rounded-2xl border border-slate-200 bg-white/80 p-5 text-left text-sm font-semibold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-french-blue/50 hover:shadow-md focus-visible:ring-french-blue data-[state=active]:border-transparent data-[state=active]:bg-gradient-to-br data-[state=active]:from-french-blue data-[state=active]:to-sky-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <span className="text-base font-semibold">Perceptions communautaires</span>
                <span className="text-sm font-normal text-slate-500 transition-colors group-data-[state=active]:text-white/80">
                  Synthèse des retours parents & élèves
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="prototype"
                className="group flex w-full flex-col items-start gap-1 rounded-2xl border border-slate-200 bg-white/80 p-5 text-left text-sm font-semibold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-french-blue/50 hover:shadow-md focus-visible:ring-french-blue data-[state=active]:border-transparent data-[state=active]:bg-gradient-to-br data-[state=active]:from-french-blue data-[state=active]:to-sky-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <span className="text-base font-semibold">Prototype installé</span>
                <span className="text-sm font-normal text-slate-500 transition-colors group-data-[state=active]:text-white/80">
                  Détails du pilote en cours de test
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="comparatif"
                className="group flex w-full flex-col items-start gap-1 rounded-2xl border border-slate-200 bg-white/80 p-5 text-left text-sm font-semibold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-french-blue/50 hover:shadow-md focus-visible:ring-french-blue data-[state=active]:border-transparent data-[state=active]:bg-gradient-to-br data-[state=active]:from-french-blue data-[state=active]:to-sky-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <span className="text-base font-semibold">Analyse des offres</span>
                <span className="text-sm font-normal text-slate-500 transition-colors group-data-[state=active]:text-white/80">
                  Comparaison budgétaire & technique
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="perceptions" className="space-y-8">
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    <CardTitle className="text-xl">Ce que disent les sondages PSD</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <Badge variant="outline" className="border-french-blue text-french-blue bg-french-blue/5">
                      Parents (PSD 2024)
                    </Badge>
                    <ul className="space-y-2 text-slate-700 leading-relaxed">
                      <li>
                        <strong>Priorité absolue n°2</strong> avec une moyenne de <strong>4,33/5</strong> sur les priorités très
                        élevées.
                      </li>
                      <li>
                        Les parents acceptent davantage l'idée d'une <strong>augmentation des écolages</strong> pour
                        climatiser durablement l'établissement.
                      </li>
                      <li>
                        La climatisation durable est citée juste après la restauration scolaire (4,40/5), confirmant
                        l’attente d’un confort thermique rapide.
                      </li>
                      <li>
                        Les familles expriment une attente de <strong>stabilisation énergétique</strong> pour sécuriser les temps d’apprentissage.
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <Badge variant="outline" className="border-violet-600 text-violet-600 bg-violet-600/5">
                      Élèves (PSD 2024)
                    </Badge>
                    <ul className="space-y-2 text-slate-700 leading-relaxed">
                      <li>
                        <strong>Deuxième priorité</strong> avec une moyenne de <strong>3,92/5</strong>, derrière le développement des voyages scolaires (4,02/5).
                      </li>
                      <li>
                        Les élèves associent la climatisation à une <strong>meilleure concentration</strong> en cours et à la qualité de vie quotidienne.
                      </li>
                      <li>
                        Les autres priorités (restauration, équipements sportifs, numérique) arrivent juste derrière,
                        soulignant la place centrale du confort thermique.
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prototype" className="space-y-8">
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                    <CardTitle className="text-xl">Modèle installé en salle de technologie</CardTitle>
                  </div>
                  <p className="text-sm text-slate-600">
                    Prototype solaire hybride observé pendant la semaine test de septembre 2025.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 text-slate-700">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Sun className="h-5 w-5 text-amber-500" aria-hidden="true" />
                        Conditions et production
                      </h3>
                      <p>
                        Fonctionnement continu sur cinq jours, avec un apport solaire couvrant jusqu’à <strong>9,8 kWh/jour</strong>{' '}
                        par évaporateur lors des épisodes ensoleillés. Avec trois évaporateurs installés, la production totale
                        grimpe ainsi jusqu’à <strong>29,4 kWh/jour</strong> et se situe en moyenne à <strong>23,4 kWh/jour</strong>.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <BarChart4 className="h-5 w-5 text-sky-500" aria-hidden="true" />
                        Consommations relevées
                      </h3>
                      <p>
                        Le bloc compresseur + <strong>3 splits (27 000 BTU)</strong> a consommé <strong>~93 kWh</strong> sur la
                        période, soit environ <strong>279 kWh</strong> pour l’ensemble des trois unités. Du mardi au vendredi,
                        <strong>65,5 kWh</strong> ont été produits <strong>exclusivement par le solaire</strong>, malgré un faible
                        ensoleillement sénégalais en pleine saison d’hivernage. Les compléments réseau sont restés limités à{' '}
                        <strong>27 kWh</strong> lors des journées couvertes.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-slate-600" aria-hidden="true" />
                        Confort thermique
                      </h3>
                      <p>
                        Malgré des températures extérieures de <strong>26 à 31 °C</strong> et un ressenti jusqu’à <strong>37 °C</strong>, la salle est restée
                        stable entre <strong>24 et 25 °C</strong>. Le système s’est également montré très efficace pour faire baisser le taux
                        d’humidité de plus de <strong>80&nbsp;%</strong> à environ <strong>50&nbsp;%</strong>.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                        Enseignements clés
                      </h3>
                      <p>
                        Le test confirme l’intérêt d’un <strong>pilotage solaire prioritaire</strong>, donne <strong>pleinement satisfaction</strong>
                        aux utilisateurs et souligne la nécessité de calibrer la maintenance préventive pour prolonger la performance en période humide.
                      </p>
                    </div>
                  </div>
                  <Card className="bg-slate-50 border-dashed border-slate-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
                        <CardTitle className="text-base">Points de vigilance pour la phase de généralisation</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm md:text-base">
                        {testInsights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparatif" className="space-y-8">
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-6 w-6 text-slate-700" aria-hidden="true" />
                    <CardTitle className="text-xl">Synthèse comparative des offres reçues</CardTitle>
                  </div>
                  <p className="text-sm text-slate-600">
                    Analyse consolidée des devis et grille technico-économique produite par le vice-trésorier.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Fournisseur</th>
                          <th className="px-4 py-3 text-left font-semibold">Technologie proposée</th>
                          <th className="px-4 py-3 text-left font-semibold">Capacité couverte</th>
                          <th className="px-4 py-3 text-left font-semibold">Particularités</th>
                          <th className="px-4 py-3 text-left font-semibold">Montant du devis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {offers.map((offer) => (
                          <tr key={offer.supplier} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-semibold text-slate-900">{offer.supplier}</td>
                            <td className="px-4 py-3 text-slate-700">{offer.tech}</td>
                            <td className="px-4 py-3 text-slate-700">{offer.scope}</td>
                            <td className="px-4 py-3 text-slate-700">{offer.specificities}</td>
                            <td className="px-4 py-3 text-slate-700">{offer.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-sm text-slate-600 italic">
                    {/* Correction: mention explicite de l'absence d'offre Afrety demandée par le commanditaire. */}
                    Aucune proposition n'a été reçue de la part d'Afrety au moment de cette comparaison, ce qui limite la vision
                    exhaustive du marché local.
                  </p>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-slate-600" aria-hidden="true" />
                        Détails techniques complémentaires
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm md:text-base">
                        {/* Correction: rappel des constantes techniques communes issues du comparatif (puissances, onduleur, panneaux). */}
                        <li>Seule l’offre C intègre un onduleur avec batterie, les autres restent en injection directe.</li>
                        <li>Les configurations couvrent de 12 à 14 splits muraux entre 18K et 36K BTU selon les entreprises.</li>
                        <li>Les panneaux solaires varient de 56 à 126 modules (400 à 615 W) principalement en Jinko Solar Tiger Neo.</li>
                        <li>Les marques associées par offre sont : Deye, ClimSol, Énergie Solaire Sénégal et Blular.</li>
                      </ul>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {offers.map((offer) => (
                        <Card key={`${offer.supplier}-details`} className="border-slate-200">
                          <CardHeader>
                            <CardTitle className="text-base">{offer.supplier}</CardTitle>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Maintenance, garanties & lecture technique</p>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm text-slate-700">
                            <div>
                              <p className="font-semibold text-slate-900">Maintenance & garanties</p>
                              <ul className="list-disc pl-5 space-y-1">
                                {offer.afterSales.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">Commentaire technique</p>
                              <p>{offer.technicalComment}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <BarChart4 className="h-5 w-5 text-french-blue" aria-hidden="true" />
                          Lecture technique consolidée
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm md:text-base">
                          {/* Correction: harmonisation des enseignements techniques avec les nouvelles données détaillées. */}
                          <li>Les devis locaux (A, B, C) reposent sur des équipes implantées sur place, mais seuls A et C documentent leur SAV.</li>
                          <li>Les puissances froid proposées oscillent entre 27K et 36K BTU pour couvrir les salles de cours.</li>
                          <li>Les écarts de prix sont principalement liés au nombre de splits et de panneaux mobilisés (56 à 126 modules).</li>
                          <li>
                            Avec le tarif le plus bas du comparatif, le ratio coût/service place l’Entreprise A en tête
                            grâce à ses garanties étendues et à son SAV local.
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Scale className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                          Classement proposé
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {ranking.map((item) => (
                          <div key={item.position} className="flex items-start gap-3">
                            <Badge className="mt-1">{item.position}</Badge>
                            <div>
                              <p className="font-semibold text-slate-900">{item.supplier}</p>
                              <p className="text-sm text-slate-700">{item.rationale}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-l-4 border-emerald-500 bg-emerald-50">
                    <CardContent className="space-y-3 py-6">
                      <h3 className="text-lg font-semibold text-emerald-800">Recommandation stratégique</h3>
                      <p className="text-slate-700">
                        Engager une première phase avec <strong>l’Entreprise A</strong> sur les salles prioritaires, puis étendre
                        graduellement les installations selon le calendrier du Plan Stratégique.
                      </p>
                      <ul className="list-disc pl-5 text-slate-700 text-sm md:text-base space-y-2">
                        <li>Amélioration immédiate du confort sans impact sur la consommation électrique.</li>
                        <li>Capacité à lisser l’investissement dans le temps en fonction des enveloppes budgétaires.</li>
                        <li>Alignement avec la feuille de route E³D et la trajectoire énergétique durable de l’établissement.</li>
                      </ul>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ClimatisationDurable;
