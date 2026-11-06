import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  BadgeCheck,
  BookCheck,
  CheckCircle2,
  Flag,
  GraduationCap,
  Home,
  LineChart,
  Medal,
  Scale,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';

const PAGE_TITLE = "Niveau d'excellence, réussite aux examens | PSD LFJP";

const dnbTrends = [
  {
    label: 'Taux de réussite',
    values: '92,86 % (2021) ; 90,00 % (2022) ; 90,74 % (2023) ; 93,75 % (2024) ; 91,67 % (2025)',
  },
  {
    label: 'Mentions',
    values: '39,29 % → 66,67 % → 72,22 % → 87,50 % → 81,25 % (2021-2025)',
  },
  {
    label: 'Moyenne générale',
    values: '13,64 → 12,83 → 13,62 → 14,57 → 14,60 (2021-2025)',
  },
  {
    label: 'Marqueur 2025',
    values: '12,50 % « Très bien avec félicitations du jury »',
  },
];

const bacTrends = [
  {
    label: 'Taux de réussite',
    values: '94,44 % (2022) ; 87,50 % (2023) ; 100 % (2024) ; 100 % (2025)',
  },
  {
    label: 'Mentions',
    values: '22,22 % → 50,00 % → 75,00 % → 61,54 % (2022-2025)',
  },
  {
    label: 'Moyenne générale',
    values: '11,40 → 11,66 → 12,771 → 13,14 (2022-2025)',
  },
];

const bacTargets = [
  'Réussite globale : 100 % chaque année (stabilité 2024-2025).',
  'Taux de mentions : ≥ 65 % en 2026, ≥ 70 % en 2028, ≥ 75 % en 2030 (cap réaliste vs 82,6 % réseau AEFE 2025).',
  'Moyenne générale : ≥ 13,2 en 2026, ≥ 13,4 en 2028, ≥ 13,6 en 2030.',
  'Part TB (dont félicitations) : progression graduelle (ex. ≥ 10 % TB à horizon 2030), sans « course à la mention » (priorité maîtrise).',
];

const dnbTargets = [
  'Réussite globale : ≥ 93 % en 2026, ≥ 95 % en 2028, ≥ 96-97 % en 2030 (confortablement au-dessus du national 85,5 %).',
  'Taux de mentions : ≥ 80 % chaque année ; cap 85 % à horizon 2030.',
  'Moyenne générale : ≥ 14,6 (maintien) puis ≥ 14,8 à horizon 2030.',
  'Réduction des refusés : < 5 % grâce à la prévention, aux entraînements et à la méthodologie.',
];

type ChartDataset = { data: (number | null)[]; label?: string };
type ChartMetaElement = { getProps: (props: string[], final: boolean) => { x: number; y: number; base: number } };
type ChartMeta = { data: ChartMetaElement[] };

type ChartPluginContext = {
  ctx: CanvasRenderingContext2D;
  options?: {
    indexAxis?: 'x' | 'y';
    plugins?: Record<string, unknown>;
    [key: string]: unknown;
  };
  data: { datasets: ChartDataset[] };
  chartArea: { top: number; bottom: number; left: number; right: number };
  scales: { y: { getPixelForValue: (value: number) => number } };
  getDatasetMeta: (datasetIndex: number) => ChartMeta;
  destroy: () => void;
};

type ChartConstructor = new (
  context: HTMLCanvasElement,
  config: Record<string, unknown>,
) => ChartPluginContext;

type ChartGlobal = ChartConstructor & {
  register: (...extensions: unknown[]) => void;
};

type TooltipContext = {
  dataset: { label: string };
  parsed: { y?: number } | number;
};

const objectifBarres = [
  {
    label: 'Taux de réussite Bac',
    cible: '≥ 98 %',
    progression: 98,
  },
  {
    label: 'Mentions Bac',
    cible: '≈ 70 %',
    progression: 70,
  },
  {
    label: 'Moyenne Bac',
    cible: '≥ 13,5',
    progression: 77, // 13,5 / 17,5 ≈ 77 % pour visualiser la cible sur 20
  },
];

const dispositifs = [
  {
    title: 'Pilotage pédagogique « exigence + accompagnement »',
    icon: <Target className="h-6 w-6" aria-hidden="true" />,
    points: [
      'Tableau de bord examens (DNB/Bac) : suivi par cohorte, notes, compétences, fragilités, trajectoires.',
      'Harmonisation des évaluations (barèmes, attendus, progressions) pour sécuriser les apprentissages.',
      'Culture de l’évaluation constructive : feedback explicite, entraînement guidé, droit à l’erreur comme levier d’exigence.',
    ],
  },
  {
    title: 'Dispositifs « examens » au collège (DNB)',
    icon: <BookCheck className="h-6 w-6" aria-hidden="true" />,
    points: [
      'Parcours méthodologique DNB (4e-3e) : entraînement régulier à l’écrit, raisonnement, gestion du temps, lecture de consignes.',
      'Deux DNB blancs par an : format, correction fine et reprise des erreurs.',
      'Groupes de besoins ciblés en français/maths pour les élèves « à risque » ; oral DNB structuré (banque de sujets, répétitions, grilles communes).',
    ],
  },
  {
    title: 'Dispositifs « bac » au lycée (exigence, mentions, orientation)',
    icon: <GraduationCap className="h-6 w-6" aria-hidden="true" />,
    points: [
      'Bacs blancs structurés + retours méthodologiques (copies modèles, critères explicites, réécritures).',
      'Accompagnement personnalisé et tutorat : ciblage « passage à la mention » sans dégrader le soutien aux élèves fragiles.',
      'Préparation aux épreuves orales : entraînements filmés, coaching posture, argumentation, gestion du stress.',
      'Politique de devoirs d’entraînement : calibrage « type bac », progressivité, correction utile.',
    ],
  },
  {
    title: 'Focus philosophie : un marqueur d’excellence',
    icon: <Sparkles className="h-6 w-6" aria-hidden="true" />,
    points: [
      'Seconde : 1h/semaine ; Première : 2h/semaine ; Terminale : 5h/semaine.',
      'Continuum méthodes → problématisation → excellence : banque de copies distinguées et rituels de réécriture guidée.',
      'Faire de la philosophie un marqueur identitaire du LFJP : exigence intellectuelle + réussite mesurable.',
    ],
  },
  {
    title: 'Valoriser tous les talents et sécuriser les parcours',
    icon: <Flag className="h-6 w-6" aria-hidden="true" />,
    points: [
      'Reconnaissance des compétences transversales (oral, projet, coopération, créativité) sans renoncer aux attendus académiques.',
      'Renforcement de l’orientation (Parcours Avenir) comme levier de mobilisation et de réussite.',
    ],
  },
];

const bulletIconClass = 'mt-0.5 h-4 w-4 flex-none text-blue-700';

const NiveauExcellenceReussiteExamens = () => {
  const navigate = useNavigate();

  const successRef = useRef<HTMLCanvasElement | null>(null);
  const comparisonRef = useRef<HTMLCanvasElement | null>(null);
  const mentionsRef = useRef<HTMLCanvasElement | null>(null);
  const averageRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const charts: ChartPluginContext[] = [];
    let scriptEl: HTMLScriptElement | null = null;

    const valueLabelPlugin = {
      id: 'valueLabelPlugin',
      afterDatasetsDraw(chart: ChartPluginContext) {
        const pluginOptions = (chart.options?.plugins as { valueLabels?: { display?: boolean } } | undefined)?.valueLabels;
        if (!pluginOptions?.display) return;

        const { ctx } = chart;
        ctx.save();
        ctx.font = '12px "Inter", system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#0f172a';
        chart.data.datasets.forEach((dataset: ChartDataset, datasetIndex: number) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          meta.data.forEach((element: ChartMetaElement, index: number) => {
            const value = dataset.data[index];
            if (value === null || value === undefined) return;

            const { x: barX, y: barY, base } = element.getProps(['x', 'y', 'base'], true);
            const textX = chart.options?.indexAxis === 'y' ? Math.max(barX, base) + 8 : barX;
            const textY = chart.options?.indexAxis === 'y' ? barY + 4 : Math.min(barY, base) - 6;
            ctx.fillText(`${value}%`, textX, textY);
          });
        });
        ctx.restore();
      },
    };

    const targetBandPlugin = {
      id: 'targetBand',
      beforeDatasetsDraw(chart: ChartPluginContext) {
        const band = (chart.options?.plugins as
          | { targetBand?: { display?: boolean; min: number; max: number; color?: string } }
          | undefined)?.targetBand;
        if (!band?.display) return;

        const {
          ctx,
          chartArea: { top, bottom, left, right },
          scales: { y },
        } = chart;
        const yMax = y.getPixelForValue(band.max);
        const yMin = y.getPixelForValue(band.min);
        ctx.save();
        ctx.fillStyle = band.color || 'rgba(148, 163, 184, 0.2)';
        ctx.fillRect(left, yMax, right - left, yMin - yMax);
        ctx.restore();
      },
    };

    const loadChartJs = () =>
      new Promise<ChartGlobal>((resolve, reject) => {
        if ((window as { Chart?: ChartGlobal }).Chart) {
          resolve((window as { Chart: ChartGlobal }).Chart);
          return;
        }

        scriptEl = document.createElement('script');
        scriptEl.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        scriptEl.async = true;
        scriptEl.onload = () => resolve((window as { Chart: ChartGlobal }).Chart);
        scriptEl.onerror = () => reject(new Error('Impossible de charger Chart.js'));
        document.body.appendChild(scriptEl);
      });

    loadChartJs()
      .then((Chart) => {
        if (!isMounted || !Chart) return;

        Chart.register(valueLabelPlugin, targetBandPlugin);

        if (successRef.current) {
          charts.push(
            new Chart(successRef.current, {
              type: 'line',
              data: {
                labels: ['2021', '2022', '2023', '2024', '2025'],
                datasets: [
                  {
                    label: 'DNB',
                    data: [92.86, 90.0, 90.74, 93.75, 91.67],
                    borderColor: '#1f4fd8',
                    backgroundColor: 'rgba(31, 79, 216, 0.12)',
                    pointBackgroundColor: '#1f4fd8',
                    tension: 0.3,
                    fill: true,
                  },
                  {
                    label: 'Baccalauréat',
                    data: [null, 94.44, 87.5, 100, 100],
                    borderColor: '#2fa36b',
                    backgroundColor: 'rgba(47, 163, 107, 0.12)',
                    pointBackgroundColor: '#2fa36b',
                    spanGaps: true,
                    tension: 0.3,
                    fill: true,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'nearest', intersect: false },
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: { enabled: true },
                },
                scales: {
                  y: {
                    suggestedMin: 80,
                    suggestedMax: 100,
                    ticks: {
                      callback: (value: number | string) => `${value}%`,
                    },
                  },
                  x: {
                    grid: { display: false },
                  },
                },
              },
            }),
          );
        }

        if (comparisonRef.current) {
          charts.push(
            new Chart(comparisonRef.current, {
              type: 'bar',
              data: {
                labels: ['DNB', 'Baccalauréat'],
                datasets: [
                  {
                    label: 'LFJP',
                    data: [91.7, 100],
                    backgroundColor: '#1d3b8b',
                  },
                  {
                    label: 'France',
                    data: [85.5, 91.8],
                    backgroundColor: '#d9dde5',
                  },
                  {
                    label: 'AEFE',
                    data: [null, 98.3],
                    backgroundColor: '#7c8cae',
                  },
                ],
              },
              options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: { right: 32 } },
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: { enabled: true },
                  valueLabels: { display: true },
                },
                scales: {
                  x: {
                    suggestedMax: 110,
                    grid: { display: false },
                    ticks: {
                      callback: (value: number | string) => `${value}%`,
                    },
                  },
                  y: {
                    grid: { display: false },
                  },
                },
              },
            }),
          );
        }

        if (mentionsRef.current) {
          charts.push(
            new Chart(mentionsRef.current, {
              type: 'bar',
              data: {
                labels: ['DNB', 'Baccalauréat'],
                datasets: [
                  {
                    label: 'Très bien',
                    data: [12.5, 10],
                    backgroundColor: '#d4af37',
                    stack: 'mentions',
                  },
                  {
                    label: 'Bien',
                    data: [30, 30],
                    backgroundColor: '#2fa36b',
                    stack: 'mentions',
                  },
                  {
                    label: 'Assez bien',
                    data: [38.75, 21.54],
                    backgroundColor: '#60a5fa',
                    stack: 'mentions',
                  },
                  {
                    label: 'Sans mention',
                    data: [18.75, 38.46],
                    backgroundColor: '#cbd5e1',
                    stack: 'mentions',
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: (context: TooltipContext) => {
                        const value = typeof (context.parsed as { y?: number }).y === 'number'
                          ? (context.parsed as { y?: number }).y
                          : (context.parsed as number);
                        return `${context.dataset.label}: ${value}%`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    stacked: true,
                    grid: { display: false },
                  },
                  y: {
                    stacked: true,
                    max: 100,
                    ticks: {
                      callback: (value: number | string) => `${value}%`,
                    },
                  },
                },
              },
            }),
          );
        }

        if (averageRef.current) {
          charts.push(
            new Chart(averageRef.current, {
              type: 'line',
              data: {
                labels: ['2022', '2023', '2024', '2025'],
                datasets: [
                  {
                    label: 'Moyenne générale bac',
                    data: [11.4, 11.66, 12.77, 13.14],
                    borderColor: '#1f4fd8',
                    backgroundColor: 'rgba(31, 79, 216, 0.14)',
                    pointBackgroundColor: '#1f4fd8',
                    fill: true,
                    tension: 0.25,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                  targetBand: {
                    display: true,
                    min: 12.5,
                    max: 14.5,
                    color: 'rgba(148, 163, 184, 0.25)',
                  },
                },
                scales: {
                  y: {
                    suggestedMin: 10,
                    suggestedMax: 15,
                    ticks: {
                      callback: (value: number | string) => value,
                    },
                  },
                  x: {
                    grid: { display: false },
                  },
                },
              },
            }),
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isMounted = false;
      charts.forEach((chart) => chart?.destroy());
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-raleway text-slate-900">
      <Navbar showLogo />

      <header className="relative isolate overflow-hidden bg-gradient-to-br from-french-blue via-blue-700 to-blue-900 py-24 text-white md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_42%)]" />
        <div className="container relative mx-auto px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Exigence académique · Axe 4</p>
          <h1 className="mt-6 max-w-4xl text-3xl font-playfair font-bold leading-tight md:text-5xl">
            Niveau d’excellence, réussite aux examens
          </h1>
          <p className="mt-6 max-w-3xl text-base text-white/80 md:text-lg">
            Une trajectoire solide pour le DNB et le baccalauréat : consolider les réussites, stabiliser les mentions et
            piloter l’exigence sans renoncer à l’équité.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => navigate('/plan-strategique')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Plan stratégique
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2 text-white">
              <Home className="h-4 w-4" />
              Accueil
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-16 pt-10 md:pt-14">
        <div className="container mx-auto space-y-12 px-6">
          <section className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-sm backdrop-blur">
            <div className="flex items-start gap-3">
              <Trophy className="h-6 w-6 text-french-blue" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-800">Diagnostic LFJP</p>
                <h2 className="mt-2 text-2xl font-playfair font-semibold text-slate-900">Réussites déjà là (2021-2025)</h2>
              </div>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-blue-50 bg-gradient-to-br from-blue-50 to-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Diplôme national du brevet</h3>
                  <BadgeCheck className="h-5 w-5 text-blue-700" aria-hidden="true" />
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {dnbTrends.map((item) => (
                    <li key={item.label} className="flex gap-2">
                      <CheckCircle2 className={bulletIconClass} aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-slate-900">{item.label}</p>
                        <p>{item.values}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-blue-50 bg-gradient-to-br from-blue-50 to-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Baccalauréat</h3>
                  <Medal className="h-5 w-5 text-blue-700" aria-hidden="true" />
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {bacTrends.map((item) => (
                    <li key={item.label} className="flex gap-2">
                      <CheckCircle2 className={bulletIconClass} aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-slate-900">{item.label}</p>
                        <p>{item.values}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/80 p-5 text-sm leading-relaxed text-blue-900">
              <p className="font-semibold">Lecture stratégique.</p>
              <p>
                Le LFJP est déjà solide sur la réussite aux examens. L’enjeu 2026-2030 : stabiliser les meilleurs niveaux,
                éviter l’effet « accordéon » sur les mentions et structurer la hausse tout en restant cohérent avec une
                évaluation exigeante et juste (« Excellence : encourager et valoriser le meilleur de chacun »).
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-3">
              <Scale className="h-6 w-6 text-french-blue" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-800">Repères de comparaison</p>
                <h2 className="mt-2 text-2xl font-playfair font-semibold text-slate-900">France / AEFE</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">France (repères nationaux)</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2">
                    <CheckCircle2 className={bulletIconClass} aria-hidden="true" />
                    <span>DNB : 85,6 % (2024) ; 85,5 % (2025).</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className={bulletIconClass} aria-hidden="true" />
                    <span>Baccalauréat : 91,2 % (2024) ; 91,8 % (2025).</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Réseau AEFE</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2">
                    <CheckCircle2 className={bulletIconClass} aria-hidden="true" />
                    <span>Résultats bac « approchant les 100 % » (environ 97 à 98,5 %) ; taux de mentions autour de 80 %.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className={bulletIconClass} aria-hidden="true" />
                    <span>Bac 2025 – réseau AEFE : 98,3 % de réussite et 82,6 % de mentions.</span>
                  </li>
                  <li className="mt-3 text-slate-600">
                    Remarque : les repères agrégés DNB sont moins consolidés ; pilotage DNB par ambition interne et benchmark
                    d’établissements comparables.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section
            id="graphiques-examens"
            className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <LineChart className="h-6 w-6 text-french-blue" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-800">Niveau d'excellence</p>
                <h2 className="mt-2 text-2xl font-playfair font-semibold text-slate-900">
                  Réussite aux examens – tendances visuelles
                </h2>
                <p className="mt-3 text-sm text-slate-700">
                  Visualisation synthétique des performances du LFJP au DNB et au baccalauréat, ainsi que des objectifs 2030.
                  Les graphiques sont lisibles, sobres et responsives pour accompagner le pilotage pédagogique.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <article className="chart-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Taux de réussite – évolution</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">2021-2025</span>
                </div>
                <div className="mt-4 h-72" role="img" aria-label="Évolution des taux de réussite DNB et bac">
                  <canvas ref={successRef} />
                </div>
              </article>

              <article className="chart-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Comparaison LFJP / France / AEFE (2025)</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">Horizontal</span>
                </div>
                <div className="mt-4 h-72" role="img" aria-label="Comparaison des taux de réussite 2025">
                  <canvas ref={comparisonRef} />
                </div>
              </article>

              <article className="chart-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Répartition des mentions (2025)</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">100 % empilé</span>
                </div>
                <div className="mt-4 h-72" role="img" aria-label="Répartition des mentions DNB et bac en 2025">
                  <canvas ref={mentionsRef} />
                </div>
              </article>

              <article className="chart-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Moyenne générale – évolution</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">Zone cible</span>
                </div>
                <div className="mt-4 h-72" role="img" aria-label="Évolution de la moyenne générale au bac">
                  <canvas ref={averageRef} />
                </div>
              </article>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-800" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-slate-900">Objectifs 2026 – 2030</h3>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Barres de progression simulant des jauges horizontales pour suivre la trajectoire vers les cibles 2030.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {objectifBarres.map((objectif) => (
                  <div key={objectif.label} className="space-y-2 rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{objectif.label}</span>
                      <span className="text-blue-800">{objectif.cible}</span>
                    </div>
                    <div className="gauge-track" aria-hidden="true">
                      <div
                        className="gauge-value"
                        style={{ width: `${objectif.progression}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-xs text-slate-600" aria-live="polite">
                      Projection : {objectif.progression}% de l'objectif 2030.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-3">
              <Target className="h-6 w-6 text-french-blue" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-800">Ambition 2026-2030</p>
                <h2 className="mt-2 text-2xl font-playfair font-semibold text-slate-900">Objectifs accessibles et pilotables</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-blue-50 bg-gradient-to-br from-white to-blue-50 p-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-700" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-slate-900">Baccalauréat</h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {bacTargets.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className={bulletIconClass} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-blue-50 bg-gradient-to-br from-white to-blue-50 p-6">
                <div className="flex items-center gap-2">
                  <BookCheck className="h-5 w-5 text-blue-700" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-slate-900">Diplôme national du brevet</h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {dnbTargets.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className={bulletIconClass} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-3">
              <LineChart className="h-6 w-6 text-french-blue" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-800">Dispositifs 2026-2030</p>
                <h2 className="mt-2 text-2xl font-playfair font-semibold text-slate-900">Atteindre les objectifs</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {dispositifs.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white p-2 text-french-blue shadow-sm">{item.icon}</div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-slate-700">
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <CheckCircle2 className={bulletIconClass} aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-blue-50/80 p-8 shadow-sm">
            <div className="flex items-start gap-3">
              <Medal className="h-6 w-6 text-blue-800" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-900">Cap 2030</p>
                <h2 className="mt-2 text-2xl font-playfair font-semibold text-blue-900">Exigence, équité, ambition</h2>
              </div>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-blue-900">
              Stabiliser l’excellence LFJP, sécuriser les mentions et valoriser chaque talent : un pilotage fin des examens,
              une culture d’évaluation constructive et l’accompagnement méthodologique pour que chaque élève atteigne son
              meilleur niveau, dans la maîtrise et la justesse.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NiveauExcellenceReussiteExamens;
