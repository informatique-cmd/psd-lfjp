
import React, { useMemo, useState } from 'react';
import { GraduationCap, HandCoins, Laptop, Wifi, ChevronDown } from 'lucide-react';
import PSDAxeLayout from './PSDAxeLayout';

const PSDAxe3 = () => {
  const [isTimelineExpanded, setTimelineExpanded] = useState(false);

  const timelineYears = useMemo(() => Array.from({ length: 5 }, (_, index) => 2026 + index), []);
  const startYear = timelineYears[0];
  const totalYears = timelineYears[timelineYears.length - 1] - startYear + 1;

  const timelineActions = [
    {
      title: 'Classe numérique mobile',
      description: 'Phase 2 (2026) puis finalisation de la phase 3 et homogénéité du parc en 2027.',
      start: 2026,
      end: 2027,
      color: 'from-indigo-300/80 to-indigo-500'
    },
    {
      title: 'Renouvellement du matériel informatique',
      description: 'Plan pluriannuel de remplacement des PC et vidéoprojecteurs (2026-2030).',
      start: 2026,
      end: 2030,
      color: 'from-emerald-300/80 to-emerald-500'
    },
    {
      title: 'Curriculum numérique & introduction au code',
      description: 'Déploiement du curriculum spiralaire, algorithmique visuelle et Python collège/lycée.',
      start: 2026,
      end: 2030,
      color: 'from-sky-300/80 to-sky-500'
    },
    {
      title: 'Module IA & citoyenneté numérique',
      description: 'Sensibilisation IA, PIX IA et ateliers éthiques/cybersécurité sur toute la période.',
      start: 2026,
      end: 2030,
      color: 'from-amber-200/80 to-amber-400'
    },
    {
      title: 'Connectivité 2.0',
      description: 'Nouvelles bornes Wi-Fi, administration réseau, extension et éventuelle ligne pro THD.',
      start: 2026,
      end: 2030,
      color: 'from-purple-300/80 to-purple-500'
    },
    {
      title: 'Mécénat numérique',
      description: 'Création du fonds, appels à projets puis financements et pérennisation (2026-2030).',
      start: 2026,
      end: 2030,
      color: 'from-rose-300/80 to-rose-500'
    },
    {
      title: '1 PC par lycéen',
      description: 'Distribution progressive aux cohortes de Seconde (2028-2030) jusqu’à couverture complète.',
      start: 2028,
      end: 2030,
      color: 'from-orange-300/80 to-orange-500'
    }
  ];

  const timelineContent = (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 mb-6">
        <h4 className="text-lg font-semibold text-slate-900">Frise temporelle des actions structurantes (2026-2030)</h4>
        <p className="text-sm text-slate-600">
          Visualisation synthétique des jalons clés pour l&apos;axe 3 : la barre colorée indique la période estimée de
          préparation, de déploiement ou de suivi pour chaque action.
        </p>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[720px] space-y-4">
          <div className="grid grid-cols-[200px_1fr] items-center gap-4 text-sm font-semibold text-slate-500 uppercase tracking-wide">
            <span>Périmètre</span>
            <div className="grid grid-cols-5 text-center">
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
              {timelineActions.map((item) => {
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
                      <div className="absolute inset-0 grid grid-cols-5 text-[10px] text-slate-400">
                        {timelineYears.map((year) => (
                          <div key={year} className="border-l border-dashed border-slate-200 first:border-l-0" />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {!isTimelineExpanded && (
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

  return (
    <PSDAxeLayout
      title="AXE 3 – DIGITAL, NUMÉRIQUE, INNOVATION TECHNOLOGIQUE"
      subtitle="Cultiver la sensibilité, la créativité, la citoyenneté et l'agilité numérique"
      timeline={timelineContent}
      objectifs={objectifs}
      actionSections={actionSections}
      indicators={indicators}
    />
  );
};

export default PSDAxe3;
