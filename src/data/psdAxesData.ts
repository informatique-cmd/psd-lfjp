export type PsdAxisKey = 'axe1' | 'axe2' | 'axe3' | 'axe4';

export interface PsdAxisIndicator {
  name: string;
  currentRate: number;
  targetRate: number;
  unit: string;
  status: 'En cours' | 'Planifié' | 'Avancé' | 'Objectif atteint';
}

export interface PsdAxisOverview {
  id: PsdAxisKey;
  shortTitle: string;
  title: string;
  subtitle: string;
  budgetMillions: number;
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
