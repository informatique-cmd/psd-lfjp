
import React, { useState } from 'react';
import pageDataFile from '@/content/pageData.json';
import { psdTimelineData } from '@/data/psdTimelineData';
import { defaultPsdAxesData, type PsdAxesData } from '@/data/psdAxesData';
import { useContentDraft } from '@/lib/contentDraft';
import { usePublishedPageData } from '@/lib/publishedDataSync';
import { GraduationCap, HandCoins, Laptop, Wifi, ChevronDown } from 'lucide-react';
import PSDAxeLayout from './PSDAxeLayout';

const timelineDraftFallback = {
  ...pageDataFile,
  psdTimelines: (pageDataFile as { psdTimelines?: typeof psdTimelineData }).psdTimelines || psdTimelineData,
  psdAxesData: (pageDataFile as { psdAxesData?: PsdAxesData }).psdAxesData || defaultPsdAxesData,
};

const PSDAxe3 = () => {
  const [isTimelineExpanded, setTimelineExpanded] = useState(false);
  const publishedData = usePublishedPageData(timelineDraftFallback);
  const pageData = useContentDraft('lfjp-admin-page-data-draft', publishedData);
  const timeline = pageData?.psdTimelines?.axe3 || psdTimelineData.axe3;
  const axisOverview = pageData?.psdAxesData?.axe3 || defaultPsdAxesData.axe3;

  const timelineYears = Array.from({ length: Math.max(1, timeline.endYear - timeline.startYear + 1) }, (_, index) => timeline.startYear + index);
  const startYear = timelineYears[0];
  const totalYears = timelineYears[timelineYears.length - 1] - startYear + 1;

  const timelineActions = Array.isArray(timeline.actions) ? timeline.actions : [];

  const timelineContent = (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 mb-6">
        <h4 className="text-lg font-semibold text-slate-900">Frise temporelle des actions structurantes ({timeline.startYear}-{timeline.endYear})</h4>
        <p className="text-sm text-slate-600">
          Visualisation synthétique des jalons clés pour l&apos;axe 3 : la barre colorée indique la période estimée de
          préparation, de déploiement ou de suivi pour chaque action.
        </p>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[720px] space-y-4">
          <div className="grid grid-cols-[200px_1fr] items-center gap-4 text-sm font-semibold text-slate-500 uppercase tracking-wide">
            <span>Périmètre</span>
            <div className="grid text-center" style={{ gridTemplateColumns: `repeat(${timelineYears.length}, minmax(0, 1fr))` }}>
              {timelineYears.map((year) => (
                <span key={year}>{year}</span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div
              className={`space-y-3 pr-1 transition-all duration-300 ${
                isTimelineExpanded ? 'max-h-none' : 'max-h-[320px] overflow-hidden'
              }`}
            >
              {timelineActions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-center text-xs text-slate-500 italic">
                  Aucune action programmée sur cette frise.
                </div>
              ) : (
                timelineActions.map((item) => {
                  const offset = ((item.start - startYear) / totalYears) * 100;
                  const width = ((item.end - item.start + 1) / totalYears) * 100;

                  return (
                    <div
                      key={item.title}
                      className="grid grid-cols-[200px_1fr] items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-600">{item.description}</p>
                      </div>
                      <div className="relative h-10 rounded-full bg-white/80">
                        <div
                          className={`absolute inset-y-1 rounded-full bg-gradient-to-r ${item.color} shadow-sm`}
                          style={{
                            left: `${offset}%`,
                            width: `${width}%`
                          }}
                        />
                        <div className="absolute inset-0 grid text-[10px] text-slate-400" style={{ gridTemplateColumns: `repeat(${timelineYears.length}, minmax(0, 1fr))` }}>
                          {timelineYears.map((year) => (
                            <div key={year} className="border-l border-dashed border-slate-200 first:border-l-0" />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {!isTimelineExpanded && timelineActions.length > 3 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent" />
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setTimelineExpanded((previous) => !previous)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-french-blue transition hover:text-french-blue/80"
      >
        {isTimelineExpanded ? 'Réduire la frise' : 'Afficher la frise complète'}
        <ChevronDown className={`h-4 w-4 transition-transform ${isTimelineExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
    </div>
  );

  const objectifs = [
    {
      content: <>Structurer un parcours numérique continu et équitable, de l’élémentaire à la terminale.</>
    },
    {
      content: (
        <>Développer l’esprit critique, la créativité et la responsabilité citoyenne dans l’usage du numérique et de l’intelligence artificielle.</>
      )
    },
    {
      content: (
        <>Favoriser l’innovation, l’entrepreneuriat et les projets numériques connectés au monde professionnel et aux enjeux locaux.</>
      )
    }
  ];
  
  const actionSections = [
    {
      title: 'Infrastructures et équipements',
      items: [
        {
          content: (
            <>
              <strong>La classe numérique mobile</strong>
            </>
          ),
          link: '/classe-numerique',
          linkAriaLabel: 'Consulter la fiche classe numérique mobile',
          linkIcon: Laptop
        },
        {
          content: (
            <>
              <strong>Plan de renouvellement pluriannuel du matériel informatique</strong>
            </>
          ),
          link: '/plan-maintenance-strategique#informatique',
          linkAriaLabel: 'Découvrir le plan de renouvellement du matériel informatique',
          linkIcon: Laptop
        },
        {
          content: (
            <>
              <strong>Plan 1 PC par lycéen</strong>
            </>
          ),
          link: '/pc-par-lyceen',
          linkAriaLabel: 'En savoir plus – Un PC par lycéen',
          linkIcon: Laptop
        }
      ]
    },
    {
      title: 'Pédagogie et compétences',
      items: [
        {
          content: (
            <>
              <strong>Curriculum numérique spiralaire</strong>
            </>
          ),
          link: '/curriculum-numerique-spiralaire',
          linkAriaLabel: 'Consulter la page Curriculum numérique spiralaire',
          linkIcon: GraduationCap
        },
        {
          content: <>Introduction au code</>,
          link: '/introduction-au-code',
          linkAriaLabel: 'Découvrir l\'introduction au code',
          linkIcon: GraduationCap
        },
        {
          content: <>Module IA</>,
          link: '/module-ia',
          linkAriaLabel: 'Consulter le module IA',
          linkIcon: GraduationCap
        },
        {
          content: <>Éducation au numérique citoyen</>,
          link: '/education-numerique-citoyen',
          linkAriaLabel: 'Découvrir l\'éducation au numérique citoyen',
          linkIcon: GraduationCap
        }
      ]
    },
    {
      title: 'Établissement digitalisé et partenariats',
      items: [
        {
          content: (
            <>
              <strong>Connectivité 2.0</strong>
            </>
          ),
          link: '/connectivite-2-0',
          linkAriaLabel: 'Consulter la fiche Connectivité 2.0',
          linkIcon: Wifi
        },
        {
          content: <>Profil digital du LFJP</>,
          link: '/profil-digital-lfjp',
          linkAriaLabel: 'Découvrir le profil digital du LFJP',
          linkIcon: Laptop
        },
        {
          content: <>Laboratoire numérique</>,
          link: '/laboratoire-numerique',
          linkAriaLabel: 'Découvrir le Laboratoire numérique',
          linkIcon: Laptop
        },
        {
          content: (
            <>
              <strong>Mécénat numérique</strong>
            </>
          ),
          link: '/mecenat-numerique',
          linkAriaLabel: 'Consulter la fiche-action Mécénat numérique',
          linkIcon: HandCoins
        }
      ]
    }
  ];
  
  const indicators = [
    {
      content: (
        <>Taux d'élèves <strong>certifiés PIX</strong> par cycle (<em>cycle 4, lycée</em>)</>
      )
    },
    {
      content: <>Nombre de <strong>projets numériques interdisciplinaires</strong> par an</>
    },
    {
      content: (
        <>Taux d'élèves ayant participé à un projet <strong>IA, coding</strong> ou <strong>cybersécurité</strong></>
      )
    },
    {
      content: (
        <>Taux de <strong>lycéens équipés en matériel personnel</strong> (<em>objectif 1 PC par lycéen</em>)</>
      )
    },
    {
      content: (
        <>Taux de <strong>couverture WiFi / vitesse de connectivité</strong> par zone du lycée</>
      )
    },
    {
      content: <>Taux de <strong>satisfaction numérique</strong> dans les enquêtes</>
    },
    {
      content: (
        <>Nombre de <strong>partenariats/mécénats</strong> liés au <strong>numérique éducatif</strong></>
      )
    }
  ];

  const indicatorsModified =
    JSON.stringify(axisOverview.indicators || []) !==
    JSON.stringify(defaultPsdAxesData.axe3.indicators);

  const objectivesModified =
    axisOverview.objectives !== undefined &&
    JSON.stringify(axisOverview.objectives) !==
      JSON.stringify(defaultPsdAxesData.axe3.objectives);

  const actionsModified =
    axisOverview.actionSections !== undefined &&
    JSON.stringify(axisOverview.actionSections) !==
      JSON.stringify(defaultPsdAxesData.axe3.actionSections);

  const iconByLink: Record<string, typeof Laptop> = {
    '/classe-numerique': Laptop,
    '/plan-maintenance-strategique#informatique': Laptop,
    '/pc-par-lyceen': Laptop,
    '/curriculum-numerique-spiralaire': GraduationCap,
    '/introduction-au-code': GraduationCap,
    '/module-ia': GraduationCap,
    '/education-numerique-citoyen': GraduationCap,
    '/connectivite-2-0': Wifi,
    '/profil-digital-lfjp': Laptop,
    '/laboratoire-numerique': Laptop,
    '/mecenat-numerique': HandCoins,
  };

  const effectiveObjectifs = !objectivesModified
    ? objectifs
    : (axisOverview.objectives || []).length === 0
      ? [{ content: <span className="italic text-slate-500">Aucun objectif défini pour cet axe.</span> }]
      : (axisOverview.objectives || []).map((obj) => ({
          content: obj.title ? (
            <>
              <strong>{obj.title}</strong> : {obj.description}
            </>
          ) : (
            <>{obj.description}</>
          ),
        }));

  const effectiveActionSections = !actionsModified
    ? actionSections
    : (axisOverview.actionSections || []).map((sec) => ({
        title: sec.title,
        items: (sec.items || []).map((it) => ({
          content: <strong>{it.label}</strong>,
          link: it.link || undefined,
          linkAriaLabel: `En savoir plus – ${it.label}`,
          linkIcon: (it.link && iconByLink[it.link]) || GraduationCap,
        })),
      }));

  const effectiveIndicators = !indicatorsModified
    ? indicators
    : (axisOverview.indicators || []).length === 0
      ? [{ content: <span className="italic text-slate-500">Aucun indicateur défini pour cet axe.</span> }]
      : (axisOverview.indicators || []).map((ind) => ({
          content: (
            <>
              <strong>{ind.name}</strong> ({ind.currentRate}
              {ind.unit} / cible {ind.targetRate}
              {ind.unit} — {ind.status})
            </>
          ),
        }));

  return (
    <PSDAxeLayout
      title={axisOverview.title}
      subtitle={axisOverview.subtitle}
      timeline={timelineContent}
      objectifs={effectiveObjectifs}
      actionSections={effectiveActionSections}
      indicators={effectiveIndicators}
    />
  );
};

export default PSDAxe3;
