import React, { useMemo, useState } from 'react';
import { ChevronDown, Globe2, Handshake, Palette } from 'lucide-react';
import PSDAxeLayout from './PSDAxeLayout';

const PSDAxe2 = () => {
  const [isTimelineExpanded, setTimelineExpanded] = useState(false);
  const objectifs = [
    {
      content: (
        <>
          <strong>Plurilinguisme et diversité</strong> : Faire de la{' '}
          <strong>diversité linguistique et culturelle</strong> un levier d'apprentissage et de citoyenneté.
        </>
      ),
    },
    {
      content: (
        <>
          <strong>Citoyenneté et ouverture</strong> : Former des élèves{' '}
          <strong>ouverts, tolérants et responsables</strong> dans un{' '}
          <strong>monde multipolaire</strong>.
        </>
      ),
    },
    {
      content: (
        <>
          <strong>Parcours et expériences</strong> : Enrichir les{' '}
          <strong>parcours éducatifs</strong> par des projets et coopérations{' '}
          <strong>interculturels et internationaux</strong>.
        </>
      ),
    },
  ];

  const timelineYears = useMemo(() => Array.from({ length: 5 }, (_, index) => 2026 + index), []);
  const startYear = timelineYears[0];
  const totalYears = timelineYears[timelineYears.length - 1] - startYear + 1;

  const timelineActions = [
    {
      title: 'Continuité DNBi / SIA (collège)',
      description:
        'Déploiement de la Section Internationale Américaine sur tout le collège et articulation avec la SI primaire',
      start: 2026,
      end: 2028,
      color: 'from-sky-400/80 to-sky-500'
    },
    {
      title: 'Ouverture et montée en puissance du BFI (lycée)',
      description: 'Ouverture simultanée de la Seconde SIA et du cycle BFI en 2028-2029, suivi et ajustements',
      start: 2028,
      end: 2030,
      color: 'from-indigo-400/80 to-indigo-600'
    },
    {
      title: 'Mobilités scolaires ADN-AEFE',
      description: 'Stabiliser 10 à 12 mobilités par an, diversifier les destinations et systématiser la préparation/retour',
      start: 2026,
      end: 2030,
      color: 'from-emerald-300/80 to-emerald-500'
    },
    {
      title: 'Voyages internationaux & séjours locaux',
      description: 'Équilibrer 1 à 2 voyages internationaux et 3 à 5 séjours locaux/régionaux par an, avec fonds de solidarité',
      start: 2026,
      end: 2030,
      color: 'from-orange-300/80 to-orange-500'
    },
    {
      title: 'Semaine des cultures & PEAC',
      description:
        'Thématiques annuelles, inventaire PEAC, valorisation des projets artistiques et coordination primaire-collège-lycée',
      start: 2026,
      end: 2030,
      color: 'from-pink-300/80 to-pink-500'
    },
    {
      title: 'Médiation entre pairs & médiation interculturelle',
      description: 'Formation, suivi et extension du dispositif du primaire vers le collège pour améliorer le climat scolaire',
      start: 2026,
      end: 2030,
      color: 'from-amber-200/80 to-amber-400'
    },
    {
      title: 'Jumelages et projets collaboratifs',
      description: 'Diplomatie éducative, ancrage territorial et coopérations internationales à consolider chaque année',
      start: 2027,
      end: 2030,
      color: 'from-french-blue/70 to-french-blue'
    }
  ];

  const timelineContent = (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 mb-6">
        <h4 className="text-lg font-semibold text-slate-900">Frise temporelle des actions structurantes (2026-2030)</h4>
        <p className="text-sm text-slate-600">
          Visualisation synthétique des jalons clés pour l&apos;axe 2 : la barre colorée indique la période estimée de
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

  const actionSections = [
    {
      title: 'Pédagogie des langues',
      items: [
        {
          content: (
            <span>
              <strong>SI primaire</strong>
            </span>
          ),
          link: '/section-internationale-bfi',
          linkAriaLabel: 'Découvrir la section internationale primaire',
          linkIcon: Globe2,
        },
        {
          content: (
            <span>
              <strong>DNBi – SIA collège</strong>
            </span>
          ),
          link: '/dnbi',
          linkAriaLabel: 'Découvrir l\'extension DNBi au collège',
          linkIcon: Globe2,
        },
        {
          content: (
            <span>
              <strong>BFI – Lycée</strong>
            </span>
          ),
          link: '/bfi',
          linkAriaLabel: "Découvrir le déploiement du parcours BFI",
          linkIcon: Globe2,
        },
      ],
    },
    {
      title: 'Éducation interculturelle',
      items: [
        {
          content: (
            <span>
              <strong>Médiation interculturelle</strong>
            </span>
          ),
          link: 'https://psd-lfjp.netlify.app/mediation-entre-pairs',
          linkAriaLabel: 'Découvrir la médiation interculturelle',
          linkIcon: Handshake,
        },
        {
          content: (
            <span>
              <strong>Parcours d'Éducation Artistique et Culturelle</strong>
            </span>
          ),
          link: '/parcours-education-artistique-culturelle',
          linkAriaLabel: 'Explorer le Parcours d\'Éducation Artistique et Culturelle',
          linkIcon: Palette,
        },
        {
          content: (
            <span>
              <strong>Semaine des cultures</strong>
            </span>
          ),
          link: '/semaine-des-cultures',
          linkAriaLabel: 'Découvrir la Semaine des cultures',
          linkIcon: Palette,
        },
      ],
    },
    {
      title: 'Ouverture internationale et locale',
      items: [
        {
          content: <span>Voyages scolaires internationaux et séjours locaux</span>,
          link: '/voyages-scolaires-internationaux-sejours-locaux',
          linkAriaLabel: 'Découvrir les orientations voyages scolaires et séjours locaux',
          linkIcon: Globe2,
        },
        {
          content: (
            <span>
              Jumelages, partages, projets collaboratifs locaux et internationaux
            </span>
          ),
          link: '/jumelages-partages-projets-collaboratifs',
          linkAriaLabel: "Découvrir la page jumelages et projets collaboratifs",
          linkIcon: Handshake,
        },
        {
          content: <span>Échanges scolaires ADN AEFE</span>,
          link: '/echanges-scolaires-adn-aefe',
          linkAriaLabel: "Découvrir les échanges scolaires ADN-AEFE",
          linkIcon: Globe2,
        },
      ],
    },
  ];

  const indicators = [
    {
      content: (
        <>Taux d'élèves engagés dans des <strong>sections et certifications internationales</strong> (SI, BFI).</>
      ),
    },
    {
      content: (
        <>Nombre de <strong>partenariats locaux et internationaux</strong> actifs.</>
      ),
    },
    {
      content: (
        <>Taux de satisfaction des élèves et familles concernant l'<strong>ouverture culturelle et linguistique</strong> (enquêtes climats scolaires).</>
      ),
    },
    {
      content: (
        <>Participation annuelle des élèves aux projets de la « <strong>Semaine des cultures</strong> » et aux <strong>jumelages</strong>.</>
      ),
    },
    {
      content: (
        <>Nombre d'élèves en <strong>échange ADN-AEFE</strong>.</>
      ),
    },
  ];

  return (
    <PSDAxeLayout
      axeId={2}
      title="AXE 2 – PLURILINGUISME, MULTICULTURALITÉ, OUVERTURE INTERNATIONALE ET LOCALE"
      subtitle="Cultiver la diversité linguistique et culturelle comme levier d'apprentissage et d'ouverture au monde"
      timeline={timelineContent}
      objectifs={objectifs}
      actionSections={actionSections}
      indicators={indicators}
    />
  );
};

export default PSDAxe2;
