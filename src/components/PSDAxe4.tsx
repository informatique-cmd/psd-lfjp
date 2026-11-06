
import React from 'react';
import { Compass, HeartHandshake, Medal, PiggyBank, RefreshCcw, Sparkles, UsersRound, Target } from 'lucide-react';
import PSDAxeLayout from './PSDAxeLayout';

const PSDAxe4 = () => {
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
      title="AXE 4 – FAÇONNER LES RÉUSSITES"
      subtitle="Accompagner chaque élève dans son développement personnel, scolaire et citoyen, pour une réussite complète, durable et équilibrée"
      objectifs={objectifs}
      actionSections={actionSections}
      indicators={indicators}
    />
  );
};

export default PSDAxe4;
