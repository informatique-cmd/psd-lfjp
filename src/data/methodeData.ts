export interface MethodeStep {
  title: string;
  description: string;
}

export interface MethodeHighlight {
  title: string;
  description: string;
}

export interface PageKeyMetric {
  label: string;
  value: string;
  note?: string;
}

export interface PageChartItem {
  name: string;
  value: number;
  target?: number;
}

export interface MethodeData {
  heroTitle: string;
  heroSubtitle: string;
  stepsEyebrow: string;
  stepsTitle: string;
  stepsSubtitle: string;
  steps: MethodeStep[];
  commissionCard: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    roleBoxTitle: string;
    roleItems: string[];
    validationBoxTitle: string;
    validationItems: string[];
  };
  validationCard: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    highlights: MethodeHighlight[];
  };
  showMetricsOnPage?: boolean;
  metricsSectionTitle?: string;
  keyMetrics?: PageKeyMetric[];
  chartTitle?: string;
  chartItems?: PageChartItem[];
}

export const defaultMethodeData: MethodeData = {
  heroTitle: 'Démarche de réalisation du PSD',
  heroSubtitle: 'Une méthode éprouvée et participative pour le Lycée Français Jacques Prévert',
  stepsEyebrow: 'Démarche',
  stepsTitle: '6 étapes structurées sur 12 à 18 mois',
  stepsSubtitle:
    "Nous proposons d'emprunter une démarche éprouvée de réalisation de plan stratégique, organisée en étapes successives pour sécuriser les résultats.",
  steps: [
    {
      title: 'Vérification des enjeux',
      description:
        'Clarifier le périmètre du plan stratégique, ses objectifs et le calendrier global (12 à 18 mois).',
    },
    {
      title: 'Réalisation du diagnostic',
      description: 'Recueillir données et perceptions pour dresser un état des lieux partagé.',
    },
    {
      title: 'Analyse des résultats',
      description:
        "Identifier les points d'appui et les besoins prioritaires mis en lumière par le diagnostic.",
    },
    {
      title: 'Identification des axes & options',
      description: 'Structurer les grandes orientations qui guideront le plan stratégique.',
    },
    {
      title: "Plan d'action détaillé",
      description: 'Construire les actions, jalons et indicateurs rattachés à chaque axe.',
    },
    {
      title: 'Mise en œuvre, suivi & pilotage continu',
      description:
        "Déployer les actions, en suivre l'avancement et ajuster en continu grâce aux retours du terrain et aux instances de gouvernance.",
    },
  ],
  commissionCard: {
    eyebrow: 'Approche participative & inclusive',
    title: "Une commission PSD mobilisée avec l'APE",
    paragraphs: [
      "La commission PSD agit au service de l'APE. Un facteur clé de succès est la collaboration de l'ensemble des parties prenantes : parents, élèves, corps enseignants et partenaires. À chaque étape, l'APE intervient pour valider les orientations et les livrables.",
      "Cette mobilisation collective garantit l'adéquation des propositions aux besoins du terrain et inscrit la démarche dans une logique de co-construction.",
    ],
    roleBoxTitle: 'Rôle de la commission',
    roleItems: [
      "Coordonner l'avancement du plan.",
      "Garantir l'inclusivité des échanges.",
      "S'assurer de la cohérence avec les enjeux identifiés.",
    ],
    validationBoxTitle: 'Validation APE',
    validationItems: [
      'Propositions à partir des idées et sondages.',
      'Validation itérative des axes et actions.',
      "Sollicitation régulière pour maintenir l'alignement.",
    ],
  },
  validationCard: {
    eyebrow: 'Cycle de validation',
    title: 'Des boucles de validation régulières',
    paragraphs: [
      "Chaque étape de la démarche est soumise à validation : la commission PSD s'appuie sur les idées issues des sondages et des groupes de travail pour formuler des propositions, présentées ensuite à l'APE.",
      "En cas de besoin d'ajustement, un nouveau cycle d'aller-retour est enclenché jusqu'à validation. Cette boucle garantit que la feuille de route finale soit partagée et réaliste.",
    ],
    highlights: [
      {
        title: 'Feuille de route validée',
        description: 'Une fois validée, la mise en œuvre démarre immédiatement.',
      },
      {
        title: "Plan d'actions mis en œuvre",
        description: "Le suivi continu garantit l'impact et la pertinence des actions.",
      },
    ],
  },
  showMetricsOnPage: false,
  metricsSectionTitle: 'Indicateurs clés de la démarche',
  keyMetrics: [
    { label: 'Durée globale', value: '12 à 18 mois', note: 'De la concertation à la feuille de route' },
    { label: 'Étapes structurées', value: '6 phases', note: 'Validation itérative APE' },
    { label: 'Instances impliquées', value: '4 collèges', note: 'Parents, élèves, personnels, direction' },
  ],
  chartTitle: 'Avancement des phases méthodologiques (%)',
  chartItems: [
    { name: 'Vérification des enjeux', value: 100, target: 100 },
    { name: 'Diagnostic partagé', value: 100, target: 100 },
    { name: 'Analyse des résultats', value: 100, target: 100 },
    { name: 'Axes & options', value: 100, target: 100 },
    { name: "Plan d'action", value: 90, target: 100 },
    { name: 'Pilotage continu', value: 45, target: 100 },
  ],
};
