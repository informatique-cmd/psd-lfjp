import React, { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from 'recharts';

const TOTAL_ECOLAGES = 1_266_470_000;
const BUROTIC_UNIT_COST = 458_477;
const ARC_UNIT_COST = 505_000;
const MIN_PC = 10;
const MAX_PC = 120;
const MIN_YEARS = 1;
const MAX_YEARS = 10;
const MIN_SHARE = 0;
const MAX_SHARE = 5;

const scenarioChartData = [
  { scenario: 'Scénario 0', burotic: 2.17, arc: 2.39 },
  { scenario: 'Scénario 1', burotic: 0.22, arc: 0.2 },
  { scenario: 'Scénario 2', burotic: 0.36, arc: 0.36 },
  { scenario: 'Scénario 3', burotic: 0.54, arc: 0.6 },
];

const scenarioChartConfig = {
  burotic: { label: 'Burotic', theme: { light: '#2563eb', dark: '#60a5fa' } },
  arc: { label: 'ARC Informatique', theme: { light: '#f97316', dark: '#fb923c' } },
};

const percentFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currencyFormatter = new Intl.NumberFormat('fr-FR');

const formatFCFA = (value: number) => `${currencyFormatter.format(Math.round(value))} FCFA`;

const formatPercent = (value: number) => `${percentFormatter.format(value)} %`;

const chartTooltipFormatter: React.ComponentProps<typeof Tooltip>['formatter'] = (value, name) => [
  `${percentFormatter.format(value as number)} %`,
  scenarioChartConfig[name as 'burotic' | 'arc']?.label ?? String(name),
];

const tableCell = 'border border-slate-200 px-4 py-2 text-sm text-slate-700';

const RenouvellementInformatiqueTabs: React.FC = () => {
  const [nbPc, setNbPc] = useState(60);
  const [annees, setAnnees] = useState(4);
  const [partEcolage, setPartEcolage] = useState(0.5);

  const simulation = useMemo(() => {
    const totalBurotic = nbPc * BUROTIC_UNIT_COST;
    const totalArc = nbPc * ARC_UNIT_COST;
    const safeYears = Math.max(annees, 1);
    const annualBurotic = totalBurotic / safeYears;
    const annualArc = totalArc / safeYears;
    const percentageBurotic = (annualBurotic / TOTAL_ECOLAGES) * 100;
    const percentageArc = (annualArc / TOTAL_ECOLAGES) * 100;
    const availableBudget = (partEcolage / 100) * TOTAL_ECOLAGES;
    const machinesPerYear = Math.max(1, Math.ceil(nbPc / safeYears));

    return {
      totals: {
        burotic: totalBurotic,
        arc: totalArc,
      },
      annual: {
        burotic: annualBurotic,
        arc: annualArc,
      },
      percentages: {
        burotic: percentageBurotic,
        arc: percentageArc,
      },
      availableBudget,
      machinesPerYear,
      coverage: {
        burotic: availableBudget - annualBurotic,
        arc: availableBudget - annualArc,
      },
    };
  }, [annees, nbPc, partEcolage]);

  const handlePcChange = (value: number) => {
    const clampedValue = Math.min(Math.max(value, MIN_PC), MAX_PC);
    setNbPc(clampedValue);
  };

  const handleYearsChange = (value: number) => {
    const clampedValue = Math.min(Math.max(value, MIN_YEARS), MAX_YEARS);
    setAnnees(clampedValue);
  };

  const handleShareChange = (value: number) => {
    const clampedValue = Math.min(Math.max(value, MIN_SHARE), MAX_SHARE);
    setPartEcolage(clampedValue);
  };

  return (
    <Tabs defaultValue="pc" className="w-full" aria-label="Plan de renouvellement informatique">
      <TabsList
        aria-label="Catégories de renouvellement"
        className="mb-6 flex w-full flex-wrap gap-2 rounded-lg bg-french-blue/5 p-2"
      >
        <TabsTrigger
          value="pc"
          aria-label="Renouvellement des ordinateurs"
          className="flex-1 rounded-md text-sm font-semibold uppercase text-french-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-french-blue data-[state=active]:bg-white data-[state=active]:text-french-blue"
        >
          PC
        </TabsTrigger>
        <TabsTrigger
          value="video-projecteurs"
          aria-label="Renouvellement des vidéo-projecteurs"
          className="flex-1 rounded-md text-sm font-semibold uppercase text-french-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-french-blue data-[state=active]:bg-white data-[state=active]:text-french-blue"
        >
          Vidéoprojecteurs
        </TabsTrigger>
        <TabsTrigger
          value="personnels"
          aria-label="Renouvellement PC des personnels"
          className="flex-1 rounded-md text-sm font-semibold uppercase text-french-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-french-blue data-[state=active]:bg-white data-[state=active]:text-french-blue"
        >
          PC personnels
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pc">
        <div className="space-y-12 px-4 pb-12 pt-6 text-slate-900">
          <header className="space-y-4 rounded-lg bg-french-blue/5 p-6">
            <h1 className="text-3xl font-bold text-french-blue">
              Plan de renouvellement du parc informatique
            </h1>
            <div className="space-y-3 text-base leading-relaxed">
              <p>
                Le parc informatique du Lycée Français Jacques Prévert constitue un outil essentiel pour
                l&apos;enseignement, l&apos;administration et la vie scolaire. Un diagnostic mené en 2025 a mis en
                évidence le vieillissement rapide d&apos;une partie importante des ordinateurs fixes. Leur
                obsolescence engendre des lenteurs, des incompatibilités avec les logiciels récents et des
                difficultés d&apos;usage dans certaines classes et espaces pédagogiques. Afin de garantir un
                environnement numérique fiable et performant, il est nécessaire de planifier un
                renouvellement progressif et maîtrisé du parc.
              </p>
              <p>
                Le présent document propose différents scénarios de renouvellement, basés sur deux devis de
                référence (Burotic et ARC Informatique), et adaptés à trois logiques budgétaires distinctes :
                un budget annuel de 3 000 000 FCFA, un budget annuel de 5 000 000 FCFA, une projection
                courte de quatre ans pour un renouvellement intégral, ainsi qu&apos;un scénario de renouvellement
                complet en une seule année. Chaque scénario est comparé au budget annuel des écolages
                (1&nbsp;266&nbsp;470&nbsp;000 FCFA), afin d&apos;éclairer la décision stratégique à prendre.
              </p>
              <p className="text-sm font-medium">
                Détail du plan :
                <a
                  href="https://docs.google.com/document/d/1RfON8oACUVurB2ctBl_SzNNar_8rV-0x9yz-W5sjTtE/edit?tab=t.4r55qrg36osq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-french-blue underline underline-offset-2 hover:text-french-blue/80"
                >
                  Consulter le Google Docs
                </a>
              </p>
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-french-blue">
              Référentiels de coûts (devis du 22 mai 2025, hors onduleurs)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse rounded-lg border border-slate-200 bg-white shadow-sm">
                <thead className="bg-french-blue/10">
                  <tr>
                    <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide text-slate-700">
                      Offre
                    </th>
                    <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide text-slate-700">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={tableCell}>Offre Burotic</td>
                    <td className={tableCell}>458 477 FCFA / PC</td>
                  </tr>
                  <tr>
                    <td className={tableCell}>Offre ARC Informatique</td>
                    <td className={tableCell}>505 000 FCFA / PC</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-french-blue">Hypothèses</h3>
              <p className="mt-2 text-sm text-slate-700">
                Sélectionnez le nombre de PC à renouveler, la durée du plan (en années) et la part du budget
                des écolages à allouer annuellement.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-french-blue">Budget annuel de référence</h3>
              <p className="mt-2 text-sm text-slate-700">
                Les simulations comparent l&apos;effort financier à l&apos;enveloppe annuelle des écolages
                (1&nbsp;266&nbsp;470&nbsp;000 FCFA) afin de valider la faisabilité budgétaire.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-french-blue">Objectif</h3>
              <p className="mt-2 text-sm text-slate-700">
                Proposer un plan de renouvellement progressif tenant compte des contraintes financières et
                opérationnelles du lycée.
              </p>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <label className="flex flex-col space-y-2 rounded-lg bg-white p-6 shadow-sm">
              <span className="text-sm font-semibold text-french-blue">Nombre de PC à renouveler</span>
              <input
                type="number"
                value={nbPc}
                onChange={(event) => handlePcChange(Number(event.target.value))}
                min={MIN_PC}
                max={MAX_PC}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:border-french-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-french-blue/60"
              />
              <span className="text-xs text-slate-500">
                {`Entre ${MIN_PC} et ${MAX_PC} PC`}
              </span>
            </label>

            <label className="flex flex-col space-y-2 rounded-lg bg-white p-6 shadow-sm">
              <span className="text-sm font-semibold text-french-blue">Durée du plan (années)</span>
              <input
                type="number"
                value={annees}
                onChange={(event) => handleYearsChange(Number(event.target.value))}
                min={MIN_YEARS}
                max={MAX_YEARS}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:border-french-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-french-blue/60"
              />
              <span className="text-xs text-slate-500">{`Entre ${MIN_YEARS} et ${MAX_YEARS} ans`}</span>
            </label>

            <label className="flex flex-col space-y-2 rounded-lg bg-white p-6 shadow-sm">
              <span className="text-sm font-semibold text-french-blue">Part des écolages allouée (%)</span>
              <input
                type="number"
                value={partEcolage}
                onChange={(event) => handleShareChange(Number(event.target.value))}
                min={MIN_SHARE}
                max={MAX_SHARE}
                step="0.1"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:border-french-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-french-blue/60"
              />
              <span className="text-xs text-slate-500">{`Entre ${MIN_SHARE} % et ${MAX_SHARE} %`}</span>
            </label>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-french-blue">Synthèse budgétaire</h3>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-700">
                <div>
                  <dt className="font-semibold text-french-blue">Coût total (Burotic)</dt>
                  <dd>{formatFCFA(simulation.totals.burotic)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-french-blue">Coût total (ARC)</dt>
                  <dd>{formatFCFA(simulation.totals.arc)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-french-blue">Coût annuel (Burotic)</dt>
                  <dd>{formatFCFA(simulation.annual.burotic)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-french-blue">Coût annuel (ARC)</dt>
                  <dd>{formatFCFA(simulation.annual.arc)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-french-blue">Part écolages (Burotic)</dt>
                  <dd>{formatPercent(simulation.percentages.burotic)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-french-blue">Part écolages (ARC)</dt>
                  <dd>{formatPercent(simulation.percentages.arc)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-french-blue">Budget disponible</dt>
                  <dd>{formatFCFA(simulation.availableBudget)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-french-blue">Machines à déployer/an</dt>
                  <dd>{simulation.machinesPerYear}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-french-blue">Capacité de couverture</h3>
              <p className="mt-2 text-sm text-slate-700">
                Différence entre le budget disponible (part d&apos;écolages sélectionnée) et le coût annuel.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-700">
                <div className="rounded-md bg-french-blue/5 p-3">
                  <p className="font-semibold text-french-blue">Burotic</p>
                  <p>{formatFCFA(simulation.coverage.burotic)}</p>
                </div>
                <div className="rounded-md bg-french-blue/5 p-3">
                  <p className="font-semibold text-french-blue">ARC Informatique</p>
                  <p>{formatFCFA(simulation.coverage.arc)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-french-blue">Visualisation des scénarios</h3>
              <p className="mt-2 text-sm text-slate-700">
                Comparaison des quatre scénarios en pourcentage du budget annuel des écolages.
              </p>
              <ChartContainer className="mt-6 h-[320px]" config={scenarioChartConfig}>
                <BarChart data={scenarioChartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="scenario" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickFormatter={percentFormatter.format} axisLine={false} tickLine={false} width={80} />
                  <ChartTooltip
                    cursor={{ fill: 'rgba(148, 163, 184, 0.2)' }}
                    content={<ChartTooltipContent indicator="dot" />}
                    formatter={chartTooltipFormatter}
                  />
                  <Bar dataKey="burotic" fill="var(--color-burotic)" radius={[8, 8, 0, 0]}>
                    <LabelList
                      dataKey="burotic"
                      position="top"
                      formatter={(value: number) => `${percentFormatter.format(value)} %`}
                      className="fill-slate-700 text-xs"
                    />
                  </Bar>
                  <Bar dataKey="arc" fill="var(--color-arc)" radius={[8, 8, 0, 0]}>
                    <LabelList
                      dataKey="arc"
                      position="top"
                      formatter={(value: number) => `${percentFormatter.format(value)} %`}
                      className="fill-slate-700 text-xs"
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-french-blue">Interprétation des scénarios</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>
                  <span className="font-semibold text-french-blue">Scénario 0 :</span> renouvellement complet en une seule
                  année (investissement exceptionnel).
                </li>
                <li>
                  <span className="font-semibold text-french-blue">Scénario 1 :</span> budget annuel de 3 000 000 FCFA alloué
                  exclusivement au renouvellement.
                </li>
                <li>
                  <span className="font-semibold text-french-blue">Scénario 2 :</span> budget annuel de 5 000 000 FCFA
                  permettant une montée en charge plus rapide.
                </li>
                <li>
                  <span className="font-semibold text-french-blue">Scénario 3 :</span> planification sur quatre ans pour un
                  renouvellement intégral.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </TabsContent>

      <TabsContent value="video-projecteurs">
        <div className="space-y-12 px-4 pb-12 pt-6 text-slate-900">
          <header className="space-y-4 rounded-lg bg-french-blue/5 p-6">
            <h1 className="text-3xl font-bold text-french-blue">
              Plan de renouvellement des vidéoprojecteurs (2026-2031)
            </h1>
            <div className="space-y-3 text-base leading-relaxed">
              <p>
                Les vidéoprojecteurs du Lycée Français Jacques Prévert sont fortement sollicités. Leur durée de vie,
                comprise entre 6 et 8 ans, est affectée par la chaleur, l&apos;humidité et la poussière du climat sénégalais.
              </p>
              <p>
                Un plan de remplacement progressif sur six ans garantit une qualité de projection homogène dans toutes les
                classes tout en maîtrisant l&apos;effort budgétaire annuel.
              </p>
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-french-blue">Principes directeurs</h2>
            <div className="rounded-lg bg-white p-6 shadow-sm text-sm text-slate-700">
              <p>
                Le plan retenu repose sur un parc cible de <strong>34 vidéoprojecteurs</strong> :
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>32 Epson EB-W51</strong> (WXGA, 4 000 lumens) destinés aux salles de classe.
                </li>
                <li>
                  <strong>2 Epson EB-FH06</strong> (Full HD, 3 500 lumens) pour les besoins spécifiques : bureau du proviseur
                  et salle polyvalente.
                </li>
              </ul>
              <p className="mt-3">
                Cette répartition assure une homogénéisation du parc et une réponse adaptée aux usages les plus exigeants.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-french-blue">Calendrier de remplacement</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse rounded-lg border border-slate-200 bg-white shadow-sm">
                <caption className="caption-bottom px-4 py-2 text-sm text-slate-600">
                  Répartition annuelle du renouvellement des vidéoprojecteurs (2026-2031)
                </caption>
                <thead className="bg-french-blue/10">
                  <tr>
                    <th className={tableCell}>Année</th>
                    <th className={tableCell}>Epson EB-W51</th>
                    <th className={tableCell}>Epson EB-FH06</th>
                    <th className={tableCell}>Affectation spécifique</th>
                    <th className={tableCell}>Montant estimé (FCFA)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={tableCell}>2026</td>
                    <td className={tableCell}>4</td>
                    <td className={tableCell}>1</td>
                    <td className={tableCell}>Bureau du proviseur</td>
                    <td className={tableCell}>2 230 000</td>
                  </tr>
                  <tr>
                    <td className={tableCell}>2027</td>
                    <td className={tableCell}>6</td>
                    <td className={tableCell}>0</td>
                    <td className={tableCell}>-</td>
                    <td className={tableCell}>2 520 000</td>
                  </tr>
                  <tr>
                    <td className={tableCell}>2028</td>
                    <td className={tableCell}>6</td>
                    <td className={tableCell}>0</td>
                    <td className={tableCell}>-</td>
                    <td className={tableCell}>2 520 000</td>
                  </tr>
                  <tr>
                    <td className={tableCell}>2029</td>
                    <td className={tableCell}>6</td>
                    <td className={tableCell}>0</td>
                    <td className={tableCell}>-</td>
                    <td className={tableCell}>2 520 000</td>
                  </tr>
                  <tr>
                    <td className={tableCell}>2030</td>
                    <td className={tableCell}>6</td>
                    <td className={tableCell}>0</td>
                    <td className={tableCell}>-</td>
                    <td className={tableCell}>2 520 000</td>
                  </tr>
                  <tr>
                    <td className={tableCell}>2031</td>
                    <td className={tableCell}>4</td>
                    <td className={tableCell}>1</td>
                    <td className={tableCell}>Salle polyvalente</td>
                    <td className={tableCell}>2 230 000</td>
                  </tr>
                  <tr className="bg-french-blue/5 font-semibold">
                    <td className={tableCell}>Total</td>
                    <td className={tableCell}>32</td>
                    <td className={tableCell}>2</td>
                    <td className={tableCell}>-</td>
                    <td className={tableCell}>14 540 000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-french-blue">Gestion des anciens équipements</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-french-blue">Réserve stratégique</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Conservation de quelques appareils fonctionnels pour assurer une continuité de service en cas de panne.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-french-blue">Flotte mobile</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Réaffectation en matériel mobile pour les conférences, événements et projections ponctuelles.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-french-blue">Don ou recyclage</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Les matériels en fin de vie seront orientés vers des filières de dons solidaires ou de recyclage responsable.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-french-blue">14 540 000</p>
              <p className="mt-2 text-sm text-slate-600">FCFA sur six ans</p>
            </div>
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-french-blue">≈ 2 423 000</p>
              <p className="mt-2 text-sm text-slate-600">FCFA de moyenne annuelle</p>
            </div>
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-french-blue">≈ 0,2 %</p>
              <p className="mt-2 text-sm text-slate-600">des recettes annuelles d&apos;écolages</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-french-blue">Conclusion</h2>
            <div className="rounded-lg bg-soft-purple p-6 text-sm text-slate-800">
              <p>
                En lissant les investissements sur six ans, le lycée maintient un parc homogène, réduit les ruptures de service
                et anticipe l&apos;usure accélérée liée au climat. Ce programme instaure une dynamique de renouvellement continu et
                prévisible, favorable aux apprentissages et aux usages pédagogiques quotidiens.
              </p>
              <p className="mt-3">
                Au terme du cycle 2031, il sera pertinent de relancer une rotation similaire afin de prolonger la performance du
                parc installé en 2026.
              </p>
            </div>
          </section>
        </div>
      </TabsContent>

      <TabsContent value="personnels">
        <div className="space-y-12 px-4 pb-12 pt-6 text-slate-900">
          <header className="space-y-4 rounded-lg bg-french-blue/5 p-6">
            <h1 className="text-3xl font-bold text-french-blue">Plan pluriannuel de renouvellement des PC personnels</h1>
            <div className="space-y-3 text-base leading-relaxed">
              <p>
                Notre établissement dispose actuellement d&apos;un parc de 43 ordinateurs portables attribués au personnel.
                L&apos;intégralité de ce parc a aujourd&apos;hui atteint l&apos;âge de trois ans. Afin d&apos;éviter une obsolescence globale
                et une charge financière brutale, un plan de renouvellement glissant sur cinq ans est proposé.
              </p>
              <p>
                Ce dispositif vise à garantir la continuité du service, prioriser les postes stratégiques et lisser
                durablement les dépenses d&apos;équipement.
              </p>
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-french-blue">Hypothèses financières</h2>
            <div className="rounded-lg bg-white p-6 shadow-sm text-sm text-slate-700">
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Poste Proviseur :</strong> 800 000 FCFA</li>
                <li><strong>Poste Informaticien :</strong> 700 000 FCFA</li>
                <li><strong>Poste Standard :</strong> 350 000 FCFA (41 unités)</li>
                <li><strong>Inflation annuelle :</strong> 3 %</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-french-blue">Impact budgétaire prévisionnel (plan sur 5 ans)</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse rounded-lg border border-slate-200 bg-white shadow-sm">
                <thead className="bg-french-blue/10">
                  <tr>
                    <th className={tableCell}>Exercice budgétaire</th>
                    <th className={tableCell}>Volume de renouvellement</th>
                    <th className={tableCell}>Détail des dotations</th>
                    <th className={tableCell}>Budget estimatif</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={tableCell}>Année 1</td>
                    <td className={tableCell}>9 matériels</td>
                    <td className={tableCell}>1 PC Proviseur + 1 PC Informaticien + 7 PC standards</td>
                    <td className={tableCell}>3 950 000 FCFA</td>
                  </tr>
                  <tr>
                    <td className={tableCell}>Année 2</td>
                    <td className={tableCell}>9 matériels</td>
                    <td className={tableCell}>9 PC standards</td>
                    <td className={tableCell}>3 244 500 FCFA</td>
                  </tr>
                  <tr>
                    <td className={tableCell}>Année 3</td>
                    <td className={tableCell}>9 matériels</td>
                    <td className={tableCell}>9 PC standards</td>
                    <td className={tableCell}>3 341 835 FCFA</td>
                  </tr>
                  <tr>
                    <td className={tableCell}>Année 4</td>
                    <td className={tableCell}>8 matériels</td>
                    <td className={tableCell}>8 PC standards</td>
                    <td className={tableCell}>3 059 632 FCFA</td>
                  </tr>
                  <tr>
                    <td className={tableCell}>Année 5</td>
                    <td className={tableCell}>8 matériels</td>
                    <td className={tableCell}>8 PC standards</td>
                    <td className={tableCell}>3 151 424 FCFA</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-slate-700">
              Note : à l&apos;issue de l&apos;année 5, le cycle reprend de manière identique avec le renouvellement des
              équipements acquis lors de l&apos;année 1.
            </p>
          </section>

        </div>
      </TabsContent>
    </Tabs>
  );
};

export default RenouvellementInformatiqueTabs;
