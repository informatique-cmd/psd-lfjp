import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge, badgeVariants } from '../components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import { cn } from '../lib/utils';
import {
  Activity,
  ArrowLeft,
  Ban,
  Droplets,
  HeartHandshake,
  HeartPulse,
  Home,
  ArrowRight,
  ShieldCheck,
  Utensils,
} from 'lucide-react';

const PAGE_TITLE = 'Parcours Santé | PSD LFJP';

type DomainKey = 'addictions' | 'alimentation' | 'physique' | 'affectif' | 'protection' | 'hygiene';

type TimelineEntry = {
  level: string;
  focus: string;
  details: string[];
};

type Reference = {
  label: string;
  href?: string;
};

type Domain = {
  key: DomainKey;
  title: string;
  icon: React.ElementType;
  tone: string;
  description: string;
  timeline: TimelineEntry[];
  references: Reference[];
};

const domains: Domain[] = [
  {
    key: 'addictions',
    title: 'Prévention des conduites addictives',
    icon: Ban,
    tone: 'from-emerald-500/20 via-emerald-500/10 to-emerald-500/0',
    description:
      "Sensibiliser progressivement aux risques liés aux écrans, au tabac, à l'alcool ou aux substances, en associant les familles et les partenaires de prévention.",
    timeline: [
      {
        level: 'Cycle 2 (CP–CE2)',
        focus: 'Usage raisonné du numérique',
        details: [
          "Sensibilisation aux dangers de l'utilisation excessive des écrans (mallette École Territoires Numériques éducatifs).",
          'Organisation de la semaine sans écran avec les familles (CESCE) pour ancrer les bonnes pratiques.',
        ],
      },
      {
        level: 'Cycle 3 (CM1–6e)',
        focus: 'Prévenir les dépendances',
        details: [
          "Sensibilisation prolongée aux usages numériques (RS, jeux vidéo) et semaine sans écran avec les familles (CESCE).",
          'Appui sur la mallette École Territoires Numériques éducatifs pour travailler les bonnes pratiques.',
        ],
      },
      {
        level: 'Cycle 4 (5e–3e)',
        focus: 'Usages numériques responsables et prévention tabac/alcool',
        details: [
          'Utilisation des écrans, réseaux sociaux et jeux vidéo : mallette Collège TNE, module « Dangers des écrans et des réseaux sociaux », fiche Eduscol 47567, ressource CRIPS.',
          "Sensibilisation aux dangers du tabac (APS youth harms) et de l'alcool (binge drinking, comas éthyliques) avec intervention de l'infirmière.",
        ],
      },
      {
        level: 'Lycée',
        focus: 'Prévenir les conduites à risques',
        details: [
          'Sensibilisation aux dangers des substances stupéfiantes et rappel des risques juridiques et sanitaires.',
          'Intervention du commissariat de police pour contextualiser les enjeux et les recours.',
        ],
      },
    ],
    references: [
      {
        label: 'Mallette École et Collège Territoires Numériques éducatifs (TNE).',
        href: 'https://tne.trousseaprojets.fr/professionnel-education-nationale',
      },
      {
        label: 'Fiche Eduscol – Dangers des écrans et des réseaux sociaux (47567).',
        href: 'https://eduscol.education.fr/document/47567/download',
      },
      {
        label: 'Ressource CRIPS – Prévention des usages numériques.',
        href: 'https://www.lecrips-idf.net/prevention-ecrans-des-solutions-pour-accompagner-et-sensibiliser-les-jeunes-aux-bonnes-pratiques/',
      },
      {
        label: 'Documentation tabac/alcool – APS youth harms.',
        href: 'https://assets.tobaccofreekids.org/global/pdfs/fr/APS_youth_harms_fr.pdf',
      },
    ],
  },
  {
    key: 'alimentation',
    title: "Éducation à l'alimentation et au goût",
    icon: Utensils,
    tone: 'from-amber-500/20 via-amber-500/10 to-amber-500/0',
    description:
      "Découvrir le goût, promouvoir l'équilibre alimentaire et relier nutrition, santé et activité physique à chaque étape de la scolarité.",
    timeline: [
      {
        level: 'Cycle 1 (PS–GS)',
        focus: 'Découvrir et goûter',
        details: [
          'Semaine du goût et participation aux commissions restauration.',
          "Sensibilisation à l'importance du petit-déjeuner.",
          'Ressources : outils éducatifs du ministère de l’agriculture.',
        ],
      },
      {
        level: 'Cycles 2–3 (CP–6e)',
        focus: 'Équilibre alimentaire et goût',
        details: [
          'Sensibilisation à l’équilibre alimentaire en lien avec les programmes de découverte du monde.',
          'Travail autour de la consommation excessive d’aliments sucrés, salés et gras.',
          'Équilibre entre alimentation et activité physique et goûter matinal sain (travail du CVE).',
          'Participation à la semaine du goût.',
          'Ressources possibles : “Manger, Bouger pour ma santé”.',
          'Education à l’alimentation et au goût (Eduscol).',
        ],
      },
      {
        level: 'Cycle 4 & Lycée (5e–Tle)',
        focus: 'Prévention et bonnes pratiques',
        details: [
          'Sensibilisation aux dangers des troubles alimentaires (anorexie, boulimie, orthorexie).',
          'Éducation aux bonnes pratiques : programme “J’aime manger, j’aime bouger”.',
        ],
      },
    ],
    references: [
      {
        label: 'Outils éducatifs du ministère de l’Agriculture pour le programme Éducation à l’alimentation.',
        href: 'https://agriculture.gouv.fr/education-lalimentation-les-outils-educatifs-sur-le-programme',
      },
      {
        label: 'Ressources “Manger, Bouger pour ma santé” – Fondation La main à la pâte.',
        href: 'https://fondation-lamap.org/projet/manger-bouger-pour-ma-sante',
      },
      {
        label: 'Programme “J’aime manger, j’aime bouger” – guide ado.',
        href: 'https://sante.gouv.fr/IMG/pdf/guide_ado.pdf',
      },
      {
        label: 'Vademecum Eduscol – éducation à l’alimentation et au goût.',
        href: 'https://drive.google.com/file/d/189HIdAqo4osht4bT5U9k_66mvZyIIGgZ/view?usp=sharing',
      },
    ],
  },
  {
    key: 'physique',
    title: "Promotion de l'activité physique",
    icon: Activity,
    tone: 'from-sky-500/20 via-sky-500/10 to-sky-500/0',
    description:
      'Encourager le mouvement quotidien, relier EPS et santé et valoriser les projets sportifs collectifs du LFJP.',
    timeline: [
      {
        level: 'Cycle 1 (PS–GS)',
        focus: 'Bouger pour grandir',
        details: [
          "Comprendre ce qu'est l'activité physique et ses bénéfices.",
          'Ressource : projet “Manger, Bouger pour ma santé”.',
        ],
      },
      {
        level: 'Cycle 2 (CP–CE2)',
        focus: 'Habitudes actives',
        details: [
          "CP : promotion de l'activité physique (liée aux découvertes du monde).",
          'Mise en place des 30 minutes d’APQ avec les fiches d’activités dédiées.',
          'Ressource : projet “Manger, Bouger pour ma santé”.',
        ],
      },
      {
        level: 'Cycle 3 (CM1–6e)',
        focus: 'Sciences du corps et pratiques régulières',
        details: [
          "CM1–CM2 : promotion de l'activité physique en lien avec les programmes de Sciences (respiration, digestion, circulation sanguine).",
          'Mise en place des 30 minutes d’APQ : fiches d’activités et ressources ministérielles.',
          'Participation au cross du LFJP.',
          '6° : déploiement de tests d’aptitude physique dans le cadre de la stratégie sport-santé 2025-2030.',
        ],
      },
      {
        level: 'Cycle 4 (5e–3e)',
        focus: 'Projets et sections sportives',
        details: [
          'Participation aux JOJ de Dakar (octobre 2026).',
          'Développement de sections sportives et associations sportives (football, boxe, judo).',
          'Participation aux événements sportifs de l’AEFE.',
        ],
      },
      {
        level: 'Lycée',
        focus: 'Perspectives sport-santé',
        details: [
          'Développement de sections sportives et associations sportives (football, boxe, judo).',
          'Participation aux événements sportifs de l’AEFE.',
          'Accompagnement des lycéens vers un rythme sportif autonome.',
        ],
      },
    ],
    references: [
      {
        label: 'Projet “Manger, Bouger pour ma santé” – Fondation La main à la pâte.',
        href: 'https://fondation-lamap.org/projet/manger-bouger-pour-ma-sante',
      },
      {
        label: 'APQ – fiches d’activités (AEFE).',
        href: 'https://aefe.gouv.fr/fr/ressources-documentaires/30-minutes-dactivites-physiques-quotidiennes-apq-fiches-dactivites',
      },
      {
        label: '30 minutes d’activité physique quotidienne – ressources ministérielles.',
        href: 'https://www.education.gouv.fr/30-minutes-d-activite-physique-quotidienne-dans-toutes-les-ecoles-344379',
      },
    ],
  },
  {
    key: 'affectif',
    title: 'Éducation à la vie affective, relationnelle et sexuelle',
    icon: HeartHandshake,
    tone: 'from-rose-500/20 via-rose-500/10 to-rose-500/0',
    description:
      'Construire l’estime de soi, le respect de l’autre et des relations égalitaires ; aborder la sexualité dans une approche globale et respectueuse.',
    timeline: [
      {
        level: 'Cycle 1 (PS–GS)',
        focus: 'Grandir avec son corps et les autres',
        details: [
          'Se connaître, vivre et grandir avec son corps ; rencontrer les autres et construire des relations.',
          'Découvrir les conditions élémentaires du respect de soi et des autres (programme ministériel EVAS maternelle).',
        ],
      },
      {
        level: 'Cycle 2 (CP–CE2)',
        focus: 'Émotions, intimité et relations',
        details: [
          "CP : connaître son corps et comprendre ce qu'est l'intime ; diversité des sentiments et émotions ; appartenir à une famille et comprendre la nature et la fonction des liens familiaux.",
          "CE1 : grandir et développer l'estime de soi ; protéger son intimité ; comprendre les dimensions affectives, éthiques, sociales et légales des relations ; promotion des relations égalitaires et repérage des discriminations issues des stéréotypes (genre).",
          'CE2 : se sentir bien dans son corps et en prendre soin ; comprendre le consentement et les différentes manières de le solliciter ou de l’exprimer ; accepter et respecter un refus.',
        ],
      },
      {
        level: 'Cycle 3 (CM1–6e)',
        focus: 'Relations respectueuses',
        details: [
          "CM1 : connaître les changements de son corps ; apprendre à développer des relations constructives et à repérer les situations de harcèlement ; promouvoir des relations égalitaires et positives, comprendre les stéréotypes pour lutter contre les discriminations.",
          'CM2 : se sentir bien dans son corps et en prendre soin ; promouvoir des relations positives ; apprendre à repérer et se protéger des violences sexistes et sexuelles ; prévenir les risques liés à l’usage du numérique et d’internet.',
          '6e : comprendre et apprendre à vivre les changements de son corps ; entrer en relation avec les autres et comprendre que les relations peuvent changer ; trouver sa place au sein d’un groupe sans renier ses propres émotions, respecter les autres et être respecté.',
        ],
      },
      {
        level: 'Cycle 4 (5e–3e)',
        focus: 'Choix responsables et égalité',
        details: [
          "5e : développer librement sa personnalité sans se sentir obligé ou contraint ; choisir ses relations, connaître et assumer ses préférences, comprendre qu’elles peuvent évoluer ; distinguer vie publique et vie privée et réfléchir à la notion de liberté individuelle, notamment sur les réseaux sociaux.",
          '4e : aborder la sexualité comme une réalité complexe pouvant faire intervenir le plaisir, l’amour, la reproduction ; développer une compréhension critique et respectueuse des relations interpersonnelles et des enjeux associés à la sexualité ; favoriser des choix responsables et protecteurs en matière de santé sexuelle et relationnelle ; étudier des représentations de la sexualité dans l’espace public et interroger leur dimension égalitaire ou inégalitaire.',
          '3e : interroger les liens entre bonheur, émotions et sexualité ; construire une relation réciproque et égalitaire ; savoir reconnaître et caractériser des contextes de danger et de vulnérabilité ; inscrire la sexualité dans la définition et le respect des droits humains.',
        ],
      },
      {
        level: 'Lycée',
        focus: 'Autonomie et respect',
        details: [
          '2nde : prendre soin de son corps et développer une image positive de soi ; reconnaître et comprendre ses émotions, ses sentiments et ceux des autres ; se protéger et protéger les autres, en particulier sur l’intimité à l’ère des réseaux sociaux.',
          '1ère : faire des choix en restant maître de soi et attentif à sa santé ; désirer et vouloir, donner ou refuser son consentement ; savoir être libre et respecter les autres et leurs propres libertés ; être soi, entre acceptation et déni.',
          'Terminale : reconnaître ses émotions et ses désirs pour mieux se connaître ; s’épanouir dans une relation équilibrée à l’autre ; être libre d’être soi parmi les autres et réfléchir aux conditions sociales garantissant cette liberté.',
        ],
      },
    ],
    references: [
      {
        label: 'Programme EVAR/EVARS',
        href: 'https://eduscol.education.fr/2083/mettre-en-oeuvre-le-programme-evarevars',
      },
      { label: 'Séances réglementaires de prévention et d’écoute infirmière.' },
    ],
  },
  {
    key: 'protection',
    title: "Protection de l'enfance",
    icon: ShieldCheck,
    tone: 'from-indigo-500/20 via-indigo-500/10 to-indigo-500/0',
    description:
      "Garantir la sécurité des élèves, détecter et signaler les situations préoccupantes et rappeler les droits de l'enfant.",
    timeline: [
      {
        level: 'Cycle 1 (PS–GS)',
        focus: 'Information et sensibilisation (1 séance minimum par an)',
        details: [
          "Dans les classes, des séances sur la protection de l’enfance et les violences intrafamiliales, notamment sexuelles, sont prévues par l’article L542-3 du Code de l’éducation.",
          "La circulaire du 7 février 2022 impose au moins une séance annuelle d'information et de sensibilisation sur l'enfance maltraitée, notamment sur les violences intrafamiliales à caractère sexuel, dans les écoles, collèges et lycées.",
          "Détection et signalement aux autorités de tous les cas pouvant laisser craindre que la santé d'un élève, sa sécurité ou sa moralité sont en danger ou en risque de l'être ou que les conditions de son éducation ou de son développement physique, affectif, intellectuel et social sont gravement compromises ou en risque de l'être.",
          "Participation à la journée mondiale des droits de l'enfant du 20 novembre.",
        ],
      },
      {
        level: 'Cycle 2 (CP–CE2)',
        focus: 'Information et sensibilisation (1 séance minimum par an)',
        details: [
          "Dans les classes, des séances sur la protection de l’enfance et les violences intrafamiliales, notamment sexuelles, sont prévues par l’article L542-3 du Code de l’éducation.",
          "La circulaire du 7 février 2022 impose au moins une séance annuelle d'information et de sensibilisation sur l'enfance maltraitée, notamment sur les violences intrafamiliales à caractère sexuel, dans les écoles, collèges et lycées.",
          "Détection et signalement aux autorités de tous les cas pouvant laisser craindre que la santé d'un élève, sa sécurité ou sa moralité sont en danger ou en risque de l'être ou que les conditions de son éducation ou de son développement physique, affectif, intellectuel et social sont gravement compromises ou en risque de l'être.",
          "Participation à la journée mondiale des droits de l'enfant du 20 novembre.",
        ],
      },
      {
        level: 'Cycle 3 (CM1–6e)',
        focus: 'Information et sensibilisation (1 séance minimum par an)',
        details: [
          "Dans les classes, des séances sur la protection de l’enfance et les violences intrafamiliales, notamment sexuelles, sont prévues par l’article L542-3 du Code de l’éducation.",
          "La circulaire du 7 février 2022 impose au moins une séance annuelle d'information et de sensibilisation sur l'enfance maltraitée, notamment sur les violences intrafamiliales à caractère sexuel, dans les écoles, collèges et lycées.",
          "Détection et signalement aux autorités de tous les cas pouvant laisser craindre que la santé d'un élève, sa sécurité ou sa moralité sont en danger ou en risque de l'être ou que les conditions de son éducation ou de son développement physique, affectif, intellectuel et social sont gravement compromises ou en risque de l'être.",
          "Participation à la journée mondiale des droits de l'enfant du 20 novembre.",
        ],
      },
      {
        level: 'Cycle 4 (5e–3e)',
        focus: 'Information et sensibilisation (1 séance minimum par an)',
        details: [
          "Dans les classes, des séances sur la protection de l’enfance et les violences intrafamiliales, notamment sexuelles, sont prévues par l’article L542-3 du Code de l’éducation.",
          "La circulaire du 7 février 2022 impose au moins une séance annuelle d'information et de sensibilisation sur l'enfance maltraitée, notamment sur les violences intrafamiliales à caractère sexuel, dans les écoles, collèges et lycées.",
          "Détection et signalement aux autorités de tous les cas pouvant laisser craindre que la santé d'un élève, sa sécurité ou sa moralité sont en danger ou en risque de l'être ou que les conditions de son éducation ou de son développement physique, affectif, intellectuel et social sont gravement compromises ou en risque de l'être.",
          "Participation à la journée mondiale des droits de l'enfant du 20 novembre.",
        ],
      },
      {
        level: 'Lycée',
        focus: 'Information et sensibilisation (1 séance minimum par an)',
        details: [
          "Dans les classes, des séances sur la protection de l’enfance et les violences intrafamiliales, notamment sexuelles, sont prévues par l’article L542-3 du Code de l’éducation.",
          "La circulaire du 7 février 2022 impose au moins une séance annuelle d'information et de sensibilisation sur l'enfance maltraitée, notamment sur les violences intrafamiliales à caractère sexuel, dans les écoles, collèges et lycées.",
          "Détection et signalement aux autorités de tous les cas pouvant laisser craindre que la santé d'un élève, sa sécurité ou sa moralité sont en danger ou en risque de l'être ou que les conditions de son éducation ou de son développement physique, affectif, intellectuel et social sont gravement compromises ou en risque de l'être.",
          "Participation à la journée mondiale des droits de l'enfant du 20 novembre.",
        ],
      },
    ],
    references: [
      {
        label: 'Circulaire du 7 février 2022 – protection de l’enfance.',
        href: 'https://www.education.gouv.fr/bo/22/Hebdo6/MENE2201659C.htm',
      },
      {
        label: 'Journée mondiale des droits de l’enfant.',
        href: 'https://www.unicef.org/fr/journee-mondiale-enfance',
      },
    ],
  },
  {
    key: 'hygiene',
    title: 'Vaccination · Environnement · Hygiène',
    icon: Droplets,
    tone: 'from-cyan-500/20 via-cyan-500/10 to-cyan-500/0',
    description:
      "Développer les réflexes d'hygiène, le suivi vaccinal et la vigilance environnementale pour protéger la santé au quotidien.",
    timeline: [
      {
        level: 'Cycle 1 (PS–GS)',
        focus: 'Gestes essentiels',
        details: [
          'Éducation au lavage des mains, au brossage des dents et à la protection contre le soleil (ressource “Vivre avec le soleil”).',
          'Contrôle infirmier des 6 ans.',
        ],
      },
      {
        level: 'Cycle 2 (CP–CE2)',
        focus: 'Hygiène corporelle et bucco-dentaire',
        details: [
          "Éducation à l'hygiène corporelle et à l'hygiène bucco-dentaire (perte des dents de lait).",
          "Intervention de l'infirmière ou d'un dentiste et poursuite de la protection contre le soleil.",
          'Ressource possible : “Vivre avec le soleil”.',
        ],
      },
      {
        level: 'Cycle 3 (CM1–6e)',
        focus: 'Hygiène corporelle renforcée',
        details: [
          "Hygiène corporelle et bucco-dentaire (perte des dents de lait) avec intervention de l'infirmière ou d'un dentiste.",
          'Protection contre le soleil ; ressource “Vivre avec le soleil”.',
          'Contrôle infirmier des 11 ans.',
        ],
      },
      {
        level: 'Cycle 4 (5e–3e)',
        focus: 'Sommeil et santé mentale',
        details: [
          "Sensibilisation à l'importance du sommeil dans les processus de croissance, de mémorisation et de facultés d'attention.",
          'Contrôle infirmier des 15 ans.',
          "Déploiement de cellules d'écoute infirmière pour travailler sur la santé mentale des adolescents.",
        ],
      },
      {
        level: 'Lycée',
        focus: 'Prévention ciblée',
        details: [
          'Sensibilisation aux dangers des IST : participation à la journée mondiale de lutte contre le SIDA du 1er décembre.',
          "Déploiement de cellules d'écoute infirmière pour travailler sur la santé mentale des adolescents.",
        ],
      },
    ],
    references: [
      { label: 'Programmes vaccination / hygiène AEFE.' },
      {
        label: 'Ressource “Vivre avec le soleil”.',
        href: 'https://fondation-lamap.org/projet/vivre-avec-le-soleil',
      },
    ],
  },
];

const domainLookup = domains.reduce<Record<DomainKey, Domain>>((acc, domain) => {
  acc[domain.key] = domain;
  return acc;
}, {} as Record<DomainKey, Domain>);

const levelCycleMap: Record<string, string> = {
  PS: 'Cycle 1',
  MS: 'Cycle 1',
  GS: 'Cycle 1',
  CP: 'Cycle 2',
  CE1: 'Cycle 2',
  CE2: 'Cycle 2',
  CM1: 'Cycle 3',
  CM2: 'Cycle 3',
  '6e': 'Cycle 3',
  '5e': 'Cycle 4',
  '4e': 'Cycle 4',
  '3e': 'Cycle 4',
  '2nde': 'Lycée',
  "1ère": 'Lycée',
  Tle: 'Lycée',
};

const getTimelineEntry = (domain: Domain, level: string) => {
  const normalizedLevel = level.toLowerCase();
  const directMatch = domain.timeline.find((entry) => entry.level.toLowerCase().includes(normalizedLevel));
  if (directMatch) return directMatch;

  const cycle = levelCycleMap[level];
  if (!cycle) return undefined;

  const normalizedCycle = cycle.toLowerCase();
  const cycleVariants = [
    normalizedCycle,
    normalizedCycle.replace('cycle', 'cycles'),
    normalizedCycle.replace('cycles ', 'cycle '),
    normalizedCycle.replace('cycle ', 'cycles '),
  ];

  return domain.timeline.find((entry) =>
    cycleVariants.some((variant) => entry.level.toLowerCase().includes(variant))
  );
};

const progressionGrid: { level: string; domains: Partial<Record<DomainKey, boolean>> }[] = [
  { level: 'PS', domains: { addictions: false, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: 'MS', domains: { addictions: false, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: 'GS', domains: { addictions: false, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: 'CP', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: 'CE1', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: 'CE2', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: 'CM1', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: 'CM2', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: '6e', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: '5e', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: '4e', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: '3e', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: '2nde', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: '1ère', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
  { level: 'Tle', domains: { addictions: true, alimentation: true, physique: true, affectif: true, protection: true, hygiene: true } },
];

const ParcoursSante = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-raleway text-slate-900">
      <Navbar showLogo={true} />

      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-teal-700 to-sky-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(45,212,191,0.2),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.18),transparent_30%)]" />
        <div className="absolute inset-0 opacity-35 blur-3xl" style={{ background: 'radial-gradient(circle at 30% 40%, rgba(16,185,129,0.45), transparent 40%), radial-gradient(circle at 80% 30%, rgba(56,189,248,0.4), transparent 35%)' }} />
        <div className="relative container mx-auto px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr,0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-50 shadow-sm ring-1 ring-white/20 backdrop-blur">
                <HeartPulse className="h-4 w-4" /> Cadre scolaire & santé
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-playfair font-bold leading-tight drop-shadow-sm">Parcours Santé</h1>
                <p className="text-lg md:text-2xl text-emerald-50/90 max-w-3xl">
                  Bien-être, prévention et accompagnement des élèves du LFJP, orchestrés autour de six domaines complémentaires.
                </p>
              </div>
              <div className="grid gap-2 text-sm md:text-base text-white/85 md:grid-cols-2">
                <div className="flex items-start gap-2 rounded-2xl bg-white/10 px-4 py-3 shadow-sm ring-1 ring-white/15 backdrop-blur">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>Une vision progressive, du cycle 1 à la Terminale, alignée avec les attendus Éducation nationale / AEFE.</p>
                </div>
                <div className="flex items-start gap-2 rounded-2xl bg-white/10 px-4 py-3 shadow-sm ring-1 ring-white/15 backdrop-blur">
                  <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>Navigation fluide pour accéder aux actions phares, ressources clés et partenaires.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => scrollToSection('introduction')}
                  className="bg-white text-emerald-900 hover:bg-emerald-50 shadow-lg shadow-emerald-900/10"
                >
                  Découvrir la vision
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection('frise')}
                  className="border-white/60 bg-white/10 text-white hover:bg-white/20"
                >
                  Voir la frise PS → Terminale
                </Button>
                <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-emerald-50/90 ring-1 ring-white/15 backdrop-blur">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-300 animate-pulse" />
                  6 domaines, 4 cycles, un parcours harmonisé
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-50/70">Domaines clés</p>
                  <p className="text-lg font-semibold text-white">Choisir un axe prioritaire</p>
                </div>
                <Badge className="bg-white/20 text-white ring-1 ring-inset ring-white/25">PS → Terminale</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {domains.map((domain) => (
                  <button
                    key={domain.key}
                    onClick={() => scrollToSection(domain.key)}
                    className="group flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 text-left text-sm text-white/90 shadow-sm ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-white/15 hover:ring-white/25"
                  >
                    <span className="flex items-center gap-2">
                      <domain.icon className="h-4 w-4" />
                      <span className="font-semibold">{domain.title}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/80">
                <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">Outils & ressources</span>
                <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">Familles & partenaires</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex flex-wrap gap-3 px-6 py-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Accueil
        </Button>
      </div>

      <main className="flex-1 pb-16">
        <div className="container mx-auto space-y-10 px-6">
          <section
            id="introduction"
            className="rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-playfair font-semibold text-emerald-700">Vision structurée du Parcours Santé</h2>
                <p className="mt-3 max-w-4xl text-base text-slate-700">
                  Six champs complémentaires, alignés avec les attendus Éducation nationale / AEFE, présentés dans un format
                  clair et immédiatement lisible. Chaque domaine dispose d’une description brève, d’un parcours PS → Terminale
                  en accordéon et d’un accès rapide aux ressources institutionnelles.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {domains.map((domain) => (
                <Card
                  key={domain.key}
                  onClick={() => scrollToSection(domain.key)}
                  className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <domain.icon className="h-5 w-5" />
                      <p className="text-xs font-semibold uppercase tracking-[0.2em]">{domain.title}</p>
                    </div>
                    <CardDescription className="text-slate-700">{domain.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-emerald-800/90">
                    Accéder directement à la rubrique et aux outils dédiés pour chaque cycle.
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {domains.map((domain) => (
            <section
              key={domain.key}
              id={domain.key}
              className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
            >
              <div className={`bg-gradient-to-r ${domain.tone} px-6 py-5`}></div>
              <div className="-mt-10 px-6 pb-8">
                <Card className="-mt-16 border-emerald-100 shadow-lg">
                  <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-emerald-700">
                        <domain.icon className="h-7 w-7" />
                        <CardTitle className="text-3xl font-playfair text-emerald-700">{domain.title}</CardTitle>
                      </div>
                      <CardDescription className="text-slate-700">{domain.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <Accordion type="single" collapsible className="space-y-3">
                      {domain.timeline.map((entry) => (
                        <AccordionItem
                          value={`${domain.key}-${entry.level}`}
                          key={`${domain.key}-${entry.level}`}
                          className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4"
                        >
                          <AccordionTrigger className="text-left text-base font-semibold text-emerald-800">
                            <div>
                              <p>{entry.level}</p>
                              <p className="text-xs font-normal text-emerald-700/80">{entry.focus}</p>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
                              {entry.details.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span
                                    className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500"
                                    aria-hidden
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    <div className="flex flex-wrap gap-2 text-xs text-emerald-700">
                      {domain.references.map((ref) =>
                        ref.href ? (
                          <a
                            key={ref.label}
                            href={ref.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={cn(
                              badgeVariants({ variant: 'outline' }),
                              'border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                            )}
                          >
                            {ref.label}
                          </a>
                        ) : (
                          <Badge key={ref.label} variant="outline" className="border-emerald-200 text-emerald-800">
                            {ref.label}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          ))}

          <section id="frise" className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Synthèse visuelle</p>
                <h3 className="text-2xl font-playfair font-semibold text-emerald-800">Frise PS → Terminale</h3>
                <p className="text-sm text-slate-700">
                  Les six axes en un coup d’œil : chaque pastille indique une action identifiée par niveau. Les cases claires
                  signalent les points à renforcer.
                </p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-800">15 niveaux / 6 axes</Badge>
            </div>

            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[720px] space-y-2">
                <div className="grid grid-cols-[100px_repeat(6,1fr)] items-center gap-2 text-xs font-semibold text-emerald-800">
                  <div>Niveau</div>
                  <div className="flex items-center gap-2"><Ban className="h-4 w-4" /> Addictions</div>
                  <div className="flex items-center gap-2"><Utensils className="h-4 w-4" /> Alimentation</div>
                  <div className="flex items-center gap-2"><Activity className="h-4 w-4" /> Activité</div>
                  <div className="flex items-center gap-2"><HeartHandshake className="h-4 w-4" /> Vie affective</div>
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Protection</div>
                  <div className="flex items-center gap-2"><Droplets className="h-4 w-4" /> Hygiène</div>
                </div>
                {progressionGrid.map((row, index) => (
                  <div
                    key={`${row.level}-${index}`}
                    className="grid grid-cols-[100px_repeat(6,1fr)] items-center gap-2 rounded-xl border border-emerald-50 bg-emerald-50/40 px-3 py-2"
                  >
                    <div className="text-sm font-semibold text-slate-800">{row.level}</div>
                    {(['addictions', 'alimentation', 'physique', 'affectif', 'protection', 'hygiene'] as DomainKey[]).map((key) => {
                      const domain = domainLookup[key];
                      const timelineEntry = getTimelineEntry(domain, row.level);
                      const details = timelineEntry?.details || ['Pas de détail fourni'];

                      return (
                        <div key={`${row.level}-${key}`} className="flex justify-center">
                          {row.domains[key] ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"
                                  aria-label="Action identifiée"
                                />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs space-y-1">
                                <p className="text-[11px] font-semibold text-emerald-700">
                                  {domain.title} — {row.level}
                                </p>
                                {timelineEntry?.level && (
                                  <p className="text-[11px] font-medium text-emerald-800">{timelineEntry.level}</p>
                                )}
                                {timelineEntry?.focus && (
                                  <p className="text-[11px] font-semibold text-slate-900">{timelineEntry.focus}</p>
                                )}
                                <ul className="list-disc space-y-1 pl-4 text-[11px] leading-snug text-slate-700">
                                  {details.map((detail) => (
                                    <li key={detail}>{detail}</li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="h-3 w-3 rounded-full bg-slate-200" aria-label="À compléter" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ParcoursSante;
