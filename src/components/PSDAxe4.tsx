
import React, { useState } from 'react';
import pageDataFile from '@/content/pageData.json';
import { psdTimelineData } from '@/data/psdTimelineData';
import { defaultPsdAxesData, type PsdAxesData } from '@/data/psdAxesData';
import { useContentDraft } from '@/lib/contentDraft';
import { usePublishedPageData } from '@/lib/publishedDataSync';
import { ChevronDown, Compass, HeartHandshake, Medal, PiggyBank, RefreshCcw, Sparkles, UsersRound, Target } from 'lucide-react';
import PSDAxeLayout from './PSDAxeLayout';
import { PsdAxisIndicatorsSection } from './PsdAxisIndicatorsSection';

const timelineDraftFallback = {
  ...pageDataFile,
  psdTimelines: (pageDataFile as { psdTimelines?: typeof psdTimelineData }).psdTimelines || psdTimelineData,
  psdAxesData: (pageDataFile as { psdAxesData?: PsdAxesData }).psdAxesData || defaultPsdAxesData,
};

const PSDAxe4 = () => {
  const [isTimelineExpanded, setTimelineExpanded] = useState(false);
  const publishedData = usePublishedPageData(timelineDraftFallback);
  const pageData = useContentDraft('lfjp-admin-page-data-draft', publishedData);
  const timeline = pageData?.psdTimelines?.axe4 || psdTimelineData.axe4;
  const axisOverview = pageData?.psdAxesData?.axe4 || defaultPsdAxesData.axe4;
  const timelineYears = Array.from({ length: Math.max(1, timeline.endYear - timeline.startYear + 1) }, (_, index) => timeline.startYear + index);
  const startYear = timelineYears[0];
  const totalYears = timelineYears[timelineYears.length - 1] - startYear + 1;

  const timelineContent = (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 mb-6">
        <h4 className="text-lg font-semibold text-slate-900">Frise temporelle des actions structurantes ({timeline.startYear}-{timeline.endYear})</h4>
        <p className="text-sm text-slate-600">
          Visualisation synthétique des jalons clés pour l&apos;axe 4 : la barre colorée indique la période estimée de
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
              {(timeline.actions || []).length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-center text-xs text-slate-500 italic">
                  Aucune action programmée sur cette frise.
                </div>
              ) : (
                (timeline.actions || []).map((item) => {
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
                            width: `${width}%`,
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
            {!isTimelineExpanded && (timeline.actions || []).length > 3 && (
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
      content: (
        <>Maintenir le <strong>niveau d'excellence</strong> et poursuivre la montée en puissance de la{' '}
        <strong>réussite aux examens</strong></>
      )
    },
    {
      content: (
        <>
          Développer les <strong>compétences psychosociales et humaines</strong> des élèves (<strong>soft skills</strong>) :
          prise de parole, coopération, gestion de l'échec, résilience, esprit critique, engagement citoyen
        </>
      )
    },
    {
      content: (
        <>Encourager l'<strong>autonomie</strong>, la <strong>persévérance</strong> et la capacité à s'orienter de manière éclairée</>
      )
    },
    {
      content: (
        <>Valoriser toutes les formes de <strong>réussite</strong> : scolaire, artistique, humaine, citoyenne, collective</>
      )
    },
    {
      content: (
        <>Faire du <strong>LFJP une école de la confiance et du rebond</strong> : apprendre à apprendre, à s'adapter, à se relever</>
      )
    },
    {
      content: (
        <>
          Renforcer les liens avec les <strong>anciens élèves (alumni)</strong> et créer une{' '}
          <strong>communauté intergénérationnelle</strong> inspirante
        </>
      )
    },
    {
      content: (
        <>Impliquer pleinement les <strong>familles</strong> dans les parcours de réussite des élèves</>
      )
    }
  ];
  
  const actionSections = [
    {
      title: 'Personnaliser les parcours',
      items: [
        {
          content: "Implication des familles",
          link: '/implication-des-familles',
          linkAriaLabel: "Découvrir la page Implication des familles",
          linkIcon: HeartHandshake,
        },
        {
          content: <strong>Parcours Avenir</strong>,
          link: '/parcours-avenir',
          linkAriaLabel: 'Découvrir la page Parcours Avenir',
          linkIcon: Compass,
        },
        {
          content: <strong>Parcours de la Réussite citoyenne</strong>,
          link: '/plan-strategique/reussite-citoyenne',
          linkAriaLabel: 'Découvrir le parcours Réussite citoyenne',
          linkIcon: Medal,
        },
        {
          content: <strong>Éducation financière et à la vie autonome</strong>,
          link: '/education-financiere-vie-autonome',
          linkAriaLabel: "En savoir plus sur l'éducation financière et la vie autonome",
          linkIcon: PiggyBank,
        },
      ],
    },
    {
      title: 'Exigence académique et approche d\'évaluation pour valoriser tous les talents',
      items: [
        {
          content: "Niveau d'excellence, réussite aux examens",
          link: '/niveau-excellence-reussite-examens',
          linkAriaLabel: "Découvrir la feuille de route Niveau d'excellence, réussite aux examens",
          linkIcon: Medal,
        },
        {
          content: (
            <>
              <strong>Compétences psychosociales et humaines</strong> (soft skills)
            </>
          ),
          link: '/curriculum-soft-skills',
          linkAriaLabel: 'Découvrir le curriculum Soft Skills & Éloquence',
          linkIcon: Sparkles,
        },
        {
          content: (
            <>
              <strong>Autonomie</strong> et <strong>persévérance</strong>
            </>
          ),
          link: '/autonomie-perseverance',
          linkAriaLabel: "Découvrir la feuille de route Autonomie et persévérance",
          linkIcon: Target,
        },
        {
          content: (
            <>
              <strong>Confiance et savoir rebondir</strong>
            </>
          ),
          link: '/valorisation-erreur-perseverance',
          linkAriaLabel:
            "Découvrir la feuille de route du programme Valorisation de l'erreur et de la persévérance",
          linkIcon: RefreshCcw,
        },
      ],
    },
    {
      title: 'Ouverture sur les possibles et célébrations',
      items: [
        {
          content: (
            <>
              <strong>Réseau des anciens élèves (alumni)</strong>
            </>
          ),
          link: '/reseau-alumni-mentorat',
          linkAriaLabel: "Découvrir le projet Réseau d'alumni et mentorat",
          linkIcon: UsersRound,
        },
        {
          content: "Toutes les formes de réussite",
          link: '/toutes-les-reussites',
          linkAriaLabel: "Découvrir la page Toutes les réussites au LFJP",
          linkIcon: Sparkles,
        },
        {
          content: "Célébration des réussites et des diplômes",
          link: '/celebration-reussites-diplomes',
          linkAriaLabel: "Découvrir la page Célébration des réussites et des diplômes",
          linkIcon: Medal,
        },
      ],
    },
  ];
  
  const indicators = [
    {
      content: (
        <>
          <strong>% des élèves participant</strong> à un <strong>club citoyen, débat, théâtre, journal</strong> (≥{' '}
          <strong>80 % collège/lycée</strong>)
        </>
      )
    },
    {
      content: (
        <>
          <strong>% d'élèves déclarant</strong> « <strong>savoir rebondir après un échec</strong> » (via enquête climat) ({' '}
          <strong>+15 pts</strong> par rapport à 2024)
        </>
      )
    },
    {
      content: (
        <>
          <strong>% d'élèves impliqués</strong> dans un <strong>projet citoyen ou solidaire</strong> ({' '}
          <strong>100 % cycle 4 et lycée</strong>)
        </>
      )
    },
    {
      content: (
        <>
          <strong>Nombre d'alumni mobilisés</strong> par an (≥ <strong>30 dès 2027</strong>)
        </>
      )
    },
    {
      content: (
        <>
          <strong>Taux de satisfaction</strong> sur l'accompagnement à la réussite (enquêtes) (≥{' '}
          <strong>90 %</strong>)
        </>
      )
    }
  ];

  return (
    <PSDAxeLayout
      axeId={4}
      title={axisOverview.title}
      subtitle={axisOverview.subtitle}
      timeline={
        <div className="space-y-8">
          <PsdAxisIndicatorsSection axis={axisOverview} />
          {timelineContent}
        </div>
      }
      objectifs={objectifs}
      actionSections={actionSections}
      indicators={indicators}
    />
  );
};

export default PSDAxe4;
