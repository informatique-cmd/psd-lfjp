export type PsdAxisKey = 'axe1' | 'axe2' | 'axe3' | 'axe4';

export interface PsdAxisIndicator {
  name: string;
  currentRate: number;
  targetRate: number;
  unit: string;
  status: 'En cours' | 'Planifié' | 'Avancé' | 'Objectif atteint';
}

export interface PsdAxisObjective {
  title?: string;
  description: string;
}

export interface PsdAxisActionItem {
  label: string;
  link?: string;
  highlight?: boolean;
}

export interface PsdAxisActionSection {
  title: string;
  items: PsdAxisActionItem[];
}

export interface PsdAxisOverview {
  id: PsdAxisKey;
  shortTitle: string;
  title: string;
  subtitle: string;
  budgetMillions: number;
  objectives?: PsdAxisObjective[];
  actionSections?: PsdAxisActionSection[];
  indicators: PsdAxisIndicator[];
}

export type PsdAxesData = Record<PsdAxisKey, PsdAxisOverview>;

export const defaultPsdAxesData: PsdAxesData = {
  axe1: {
    id: 'axe1',
    shortTitle: 'Axe 1 · Bien-être',
    title: 'AXE 1 – BIEN-ÊTRE ET EXPÉRIENCE DE LA COMMUNAUTÉ ÉDUCATIVE',
    subtitle: "Renforcer un cadre scolaire propice à l'épanouissement, à l'inclusion et à la cohésion",
    budgetMillions: 775,
    objectives: [
      {
        title: 'Bien-être et accompagnement des élèves',
        description:
          'Garantir un environnement scolaire sain, climatisé et agréable, développer une culture du bien-être physique, mental, social et environnemental et répondre aux besoins particuliers des élèves.',
      },
      {
        title: 'Climat scolaire et coopération éducative',
        description:
          "Renforcer la confiance et la coopération entre élèves, familles et personnels, responsabiliser les élèves dans la vie de l'établissement et consolider un climat scolaire fondé sur des règles et des valeurs partagées.",
      },
      {
        title: 'Qualité et durabilité des services',
        description:
          "Améliorer la qualité des services (restauration, transport, hygiène) et pérenniser l'engagement du LFJP en matière de développement durable dans la dynamique E³D.",
      },
    ],
    actionSections: [
      {
        title: 'Cadre de vie & infrastructures',
        items: [
          { label: 'Climatisation durable', link: '/climatisation-durable' },
          { label: 'Restauration scolaire', link: '/construction-cantine' },
          { label: 'Maintenance stratégique', link: '/plan-maintenance-strategique' },
          { label: 'Politique E³D', link: '/politique-e3d' },
          { label: 'Couverture terrain de sport', link: '/couverture-terrain-sport' },
          { label: 'Transport scolaire', link: '/transport-scolaire' },
          { label: 'Budget d’amélioration', link: '/budget-cadre-vie-infrastructures', highlight: true },
        ],
      },
      {
        title: 'Cadre scolaire & santé',
        items: [
          { label: 'Parcours Santé', link: '/parcours-sante' },
          { label: 'Prévention du harcèlement', link: '/protocole-phare' },
          { label: 'Médiation entre pairs', link: '/mediation-entre-pairs' },
          { label: 'Projet EPS', link: '/projet-eps' },
          { label: 'Savoir rouler', link: '/savoir-rouler' },
          { label: 'Savoir nager', link: '/savoir-nager' },
        ],
      },
      {
        title: 'Dialogue & implication',
        items: [
          { label: 'Parentalité & coéducation', link: '/parentalite-coeducation' },
          { label: 'Expression & participation', link: '/expression-participation' },
        ],
      },
    ],
    indicators: [
      {
        name: 'Climatisation durable des salles',
        currentRate: 35,
        targetRate: 100,
        unit: '%',
        status: 'En cours',
      },
      {
        name: 'Satisfaction globale du climat scolaire',
        currentRate: 78,
        targetRate: 90,
        unit: '%',
        status: 'En cours',
      },
      {
        name: 'Déploiement restauration & hygiène',
        currentRate: 25,
        targetRate: 100,
        unit: '%',
        status: 'Planifié',
      },
      {
        name: 'Projets intégrant la politique E3D',
        currentRate: 60,
        targetRate: 100,
        unit: '%',
        status: 'Avancé',
      },
    ],
  },
  axe2: {
    id: 'axe2',
    shortTitle: 'Axe 2 · Ouverture',
    title: 'AXE 2 – PLURILINGUISME, MULTICULTURALITÉ, OUVERTURE INTERNATIONALE ET LOCALE',
    subtitle: "Cultiver la diversité linguistique et culturelle comme levier d'apprentissage et d'ouverture au monde",
    budgetMillions: 45,
    objectives: [
      {
        title: 'Plurilinguisme et diversité',
        description: "Faire de la diversité linguistique et culturelle un levier d'apprentissage et de citoyenneté.",
      },
      {
        title: 'Citoyenneté et ouverture',
        description: 'Former des élèves ouverts, tolérants et responsables dans un monde multipolaire.',
      },
      {
        title: 'Parcours et expériences',
        description: 'Enrichir les parcours éducatifs par des projets et coopérations interculturels et internationaux.',
      },
    ],
    actionSections: [
      {
        title: 'Pédagogie des langues',
        items: [
          { label: 'SI primaire', link: '/section-internationale-bfi' },
          { label: 'DNBi – SIA collège', link: '/dnbi' },
          { label: 'BFI – Lycée', link: '/bfi' },
        ],
      },
      {
        title: 'Éducation interculturelle',
        items: [
          { label: 'Médiation interculturelle', link: 'https://psd-lfjp.netlify.app/mediation-entre-pairs' },
          { label: "Parcours d'Éducation Artistique et Culturelle", link: '/parcours-education-artistique-culturelle' },
          { label: 'Semaine des cultures', link: '/semaine-des-cultures' },
        ],
      },
      {
        title: 'Ouverture internationale et locale',
        items: [
          { label: 'Voyages scolaires internationaux et séjours locaux', link: '/voyages-scolaires-internationaux-sejours-locaux' },
          { label: 'Jumelages, partages, projets collaboratifs locaux et internationaux', link: '/jumelages-partages-projets-collaboratifs' },
          { label: 'Échanges scolaires ADN AEFE', link: '/echanges-scolaires-adn-aefe' },
        ],
      },
    ],
    indicators: [
      {
        name: 'Élèves en sections internationales (SI / DNBi / BFI)',
        currentRate: 28,
        targetRate: 50,
        unit: '%',
        status: 'En cours',
      },
      {
        name: 'Satisfaction ouverture culturelle & linguistique',
        currentRate: 74,
        targetRate: 90,
        unit: '%',
        status: 'Avancé',
      },
      {
        name: 'Participation Semaine des cultures & PEAC',
        currentRate: 85,
        targetRate: 100,
        unit: '%',
        status: 'Avancé',
      },
      {
        name: 'Mobilités ADN-AEFE & jumelages actifs',
        currentRate: 45,
        targetRate: 100,
        unit: '%',
        status: 'En cours',
      },
    ],
  },
  axe3: {
    id: 'axe3',
    shortTitle: 'Axe 3 · Innovation',
    title: 'AXE 3 – DIGITAL, NUMÉRIQUE, INNOVATION TECHNOLOGIQUE',
    subtitle: "Cultiver la sensibilité, la créativité, la citoyenneté et l'agilité numérique",
    budgetMillions: 120,
    objectives: [
      {
        description: 'Structurer un parcours numérique continu et équitable, de l’élémentaire à la terminale.',
      },
      {
        description: 'Développer l’esprit critique, la créativité et la responsabilité citoyenne dans l’usage du numérique et de l’intelligence artificielle.',
      },
      {
        description: 'Favoriser l’innovation, l’entrepreneuriat et les projets numériques connectés au monde professionnel et aux enjeux locaux.',
      },
    ],
    actionSections: [
      {
        title: 'Infrastructures et équipements',
        items: [
          { label: 'La classe numérique mobile', link: '/classe-numerique' },
          { label: 'Plan de renouvellement pluriannuel du matériel informatique', link: '/plan-maintenance-strategique#informatique' },
          { label: 'Plan 1 PC par lycéen', link: '/pc-par-lyceen' },
        ],
      },
      {
        title: 'Pédagogie et compétences',
        items: [
          { label: 'Curriculum numérique spiralaire', link: '/curriculum-numerique-spiralaire' },
          { label: 'Introduction au code', link: '/introduction-au-code' },
          { label: 'Module IA', link: '/module-ia' },
          { label: 'Éducation au numérique citoyen', link: '/education-numerique-citoyen' },
        ],
      },
      {
        title: 'Établissement digitalisé et partenariats',
        items: [
          { label: 'Connectivité 2.0', link: '/connectivite-2-0' },
          { label: 'Profil digital du LFJP', link: '/profil-digital-lfjp' },
          { label: 'Laboratoire numérique', link: '/laboratoire-numerique' },
          { label: 'Mécénat numérique', link: '/mecenat-numerique' },
        ],
      },
    ],
    indicators: [
      {
        name: 'Élèves certifiés PIX (cycle 4 & lycée)',
        currentRate: 52,
        targetRate: 95,
        unit: '%',
        status: 'En cours',
      },
      {
        name: 'Équipement 1 PC par lycéen',
        currentRate: 30,
        targetRate: 100,
        unit: '%',
        status: 'Planifié',
      },
      {
        name: 'Couverture WiFi & Connectivité 2.0',
        currentRate: 68,
        targetRate: 100,
        unit: '%',
        status: 'Avancé',
      },
      {
        name: 'Participation modules IA, coding & cybersécurité',
        currentRate: 40,
        targetRate: 90,
        unit: '%',
        status: 'En cours',
      },
    ],
  },
  axe4: {
    id: 'axe4',
    shortTitle: 'Axe 4 · Réussite',
    title: 'AXE 4 – FAÇONNER LES RÉUSSITES',
    subtitle: 'Accompagner chaque élève dans son développement personnel, scolaire et citoyen, pour une réussite complète, durable et équilibrée',
    budgetMillions: 35,
    objectives: [
      {
        description: "Maintenir le niveau d'excellence et poursuivre la montée en puissance de la réussite aux examens",
      },
      {
        description: "Développer les compétences psychosociales et humaines des élèves (soft skills) : prise de parole, coopération, gestion de l'échec, résilience, esprit critique, engagement citoyen",
      },
      {
        description: "Encourager l'autonomie, la persévérance et la capacité à s'orienter de manière éclairée",
      },
      {
        description: 'Valoriser toutes les formes de réussite : scolaire, artistique, humaine, citoyenne, collective',
      },
      {
        description: "Faire du LFJP une école de la confiance et du rebond : apprendre à apprendre, à s'adapter, à se relever",
      },
      {
        description: 'Renforcer les liens avec les anciens élèves (alumni) et créer une communauté intergénérationnelle inspirante',
      },
      {
        description: 'Impliquer pleinement les familles dans les parcours de réussite des élèves',
      },
    ],
    actionSections: [
      {
        title: 'Personnaliser les parcours',
        items: [
          { label: 'Implication des familles', link: '/implication-des-familles' },
          { label: 'Parcours Avenir', link: '/parcours-avenir' },
          { label: 'Parcours de la Réussite citoyenne', link: '/plan-strategique/reussite-citoyenne' },
          { label: 'Éducation financière et à la vie autonome', link: '/education-financiere-vie-autonome' },
        ],
      },
      {
        title: "Exigence académique et approche d'évaluation pour valoriser tous les talents",
        items: [
          { label: "Niveau d'excellence, réussite aux examens", link: '/niveau-excellence-reussite-examens' },
          { label: 'Compétences psychosociales et humaines (soft skills)', link: '/curriculum-soft-skills' },
          { label: 'Autonomie et persévérance', link: '/autonomie-perseverance' },
          { label: 'Confiance et savoir rebondir', link: '/valorisation-erreur-perseverance' },
        ],
      },
      {
        title: 'Ouverture sur les possibles et célébrations',
        items: [
          { label: 'Réseau des anciens élèves (alumni)', link: '/reseau-alumni-mentorat' },
          { label: 'Toutes les formes de réussite', link: '/toutes-les-reussites' },
          { label: 'Célébration des réussites et des diplômes', link: '/celebration-reussites-diplomes' },
        ],
      },
    ],
    indicators: [
      {
        name: 'Participation clubs citoyens, débat & théâtre',
        currentRate: 55,
        targetRate: 80,
        unit: '%',
        status: 'En cours',
      },
      {
        name: 'Implication projets citoyens (cycle 4 & lycée)',
        currentRate: 65,
        targetRate: 100,
        unit: '%',
        status: 'Avancé',
      },
      {
        name: 'Mobilisation du réseau Alumni & mentorat',
        currentRate: 35,
        targetRate: 100,
        unit: '%',
        status: 'En cours',
      },
      {
        name: 'Satisfaction accompagnement à la réussite',
        currentRate: 82,
        targetRate: 90,
        unit: '%',
        status: 'Avancé',
      },
    ],
  },
};

export function computeAxisProgressRate(axis: PsdAxisOverview): number {
  const list = axis?.indicators || [];
  if (list.length === 0) return 0;
  const totalRatio = list.reduce((sum, item) => {
    const target = Number(item.targetRate) > 0 ? Number(item.targetRate) : 100;
    const current = Math.max(0, Number(item.currentRate) || 0);
    return sum + Math.min(100, (current / target) * 100);
  }, 0);
  return Math.round((totalRatio / list.length) * 10) / 10;
}
