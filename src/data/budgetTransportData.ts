export interface BudgetProject {
  id: string;
  title: string;
  description: string;
  period: string;
  budget: number;
  color: string;
  link?: string;
}

export interface CashFlowYear {
  year: number;
  capacite: number;
  leviers: number;
  recettesTotales: number;
  depenses: number;
}

export interface TuitionSimulation {
  year: number;
  increase: number;
  revenue: number;
}

export interface ProjectScheduleItem {
  project: string;
  start: number;
  end: number;
  annualSpend: Record<string, number>;
}

export interface BudgetData {
  summaryCards: {
    totalInvestment: number;
    fundingGap: number;
    estimatedCapacity: number;
  };
  projects: BudgetProject[];
  financialTimeline: CashFlowYear[];
  tuitionSimulations: TuitionSimulation[];
  projectSchedule: ProjectScheduleItem[];
  tuitionBaseRevenue: number;
  cumulativeTuition: number;
}

export interface TransportCommune {
  ville: string;
  total: number;
  part: string;
}

export interface TransportCircuit {
  name: string;
  eleves: number;
  arrets: string;
  horaireDepart: string;
}

export interface TransportData {
  communes: TransportCommune[];
  stats: {
    totalEleves: number;
    partSaly: string;
    partPeripherie: string;
    partEloignee: string;
  };
  circuits: TransportCircuit[];
  tarifs: {
    zone: string;
    description: string;
    mensuel: number;
    annuel: number;
  }[];
  pointsCles: string[];
}

export const defaultBudgetData: BudgetData = {
  summaryCards: {
    totalInvestment: 775000000,
    fundingGap: 89860582,
    estimatedCapacity: 685139418,
  },
  projects: [
    {
      id: 'proj-clim',
      title: 'Climatisation (phases 2 & 3)',
      description: 'Déploiement progressif sur les bâtiments restants',
      period: '2026 – 2027',
      budget: 60000009,
      color: 'from-sky-100 to-sky-50',
      link: '/climatisation-durable',
    },
    {
      id: 'proj-sport-couv',
      title: 'Couverture terrain de sport',
      description: 'Protection solaire et confort thermique pour les cours d’EPS et compétitions',
      period: '2026',
      budget: 75000000,
      color: 'from-amber-100 to-orange-50',
      link: '/couverture-terrain-sport',
    },
    {
      id: 'proj-solaire',
      title: 'Solaire terrain de sport',
      description: 'Installation photovoltaïque complémentaire pour l’autoconsommation énergétique',
      period: '2028 – 2029',
      budget: 55000000,
      color: 'from-emerald-100 to-emerald-50',
    },
    {
      id: 'proj-piscine',
      title: 'Piscine',
      description: 'Réhabilitation et sécurisation du bassin pour le parcours Savoir-nager',
      period: '2028 – 2029',
      budget: 125000000,
      color: 'from-sky-100 to-blue-50',
    },
    {
      id: 'proj-cantine',
      title: 'Restauration scolaire & Cantine',
      description: 'Montée en charge cuisine, réfectoire & self-service pour 450 repas/jour',
      period: '2027 – 2029',
      budget: 20000000,
      color: 'from-orange-100 to-amber-50',
      link: '/construction-cantine',
    },
    {
      id: 'proj-foncier',
      title: 'Acquisition terrain & réserve foncière',
      description: 'Réserve foncière pour extensions futures et aménagements extérieurs',
      period: '2026 – 2027',
      budget: 60000000,
      color: 'from-lime-100 to-emerald-50',
    },
    {
      id: 'proj-extension',
      title: 'Projet d’extension phase 1',
      description: 'Création de nouvelles surfaces pédagogiques, salles de cours et laboratoires',
      period: '2030',
      budget: 20000000,
      color: 'from-indigo-100 to-indigo-50',
    },
  ],
  financialTimeline: [
    { year: 2026, capacite: 43000000, leviers: 64969911, recettesTotales: 107969911, depenses: 135000000 },
    { year: 2027, capacite: 37000000, leviers: 70042377, recettesTotales: 107042377, depenses: 126666667 },
    { year: 2028, capacite: 62000000, leviers: 70042377, recettesTotales: 132042377, depenses: 156666667 },
    { year: 2029, capacite: 54000001, leviers: 70042377, recettesTotales: 124042378, depenses: 156666667 },
    { year: 2030, capacite: 54000000, leviers: 70042377, recettesTotales: 124042377, depenses: 200000000 },
  ],
  tuitionSimulations: [
    { year: 2026, increase: 5.4, revenue: 64969911 },
    { year: 2027, increase: 0.4, revenue: 70042377 },
    { year: 2028, increase: 0, revenue: 70042377 },
    { year: 2029, increase: 0, revenue: 70042377 },
    { year: 2030, increase: 0, revenue: 70042377 },
  ],
  projectSchedule: [
    { project: 'Climatisation (phases 2 & 3)', start: 2026, end: 2027, annualSpend: { '2026': 30000000, '2027': 30000000 } },
    { project: 'Couverture terrain de sport', start: 2026, end: 2026, annualSpend: { '2026': 75000000 } },
    { project: 'Solaire terrain de sport', start: 2028, end: 2029, annualSpend: { '2028': 27500000, '2029': 27500000 } },
    { project: 'Piscine', start: 2028, end: 2029, annualSpend: { '2028': 62500000, '2029': 62500000 } },
    { project: 'Restauration scolaire & Cantine', start: 2027, end: 2029, annualSpend: { '2027': 66666667, '2028': 66666667, '2029': 66666666 } },
    { project: 'Acquisition terrain & réserve foncière', start: 2026, end: 2027, annualSpend: { '2026': 30000000, '2027': 30000000 } },
    { project: 'Projet d’extension phase 1', start: 2030, end: 2030, annualSpend: { '2030': 200000000 } },
  ],
  tuitionBaseRevenue: 1203146500,
  cumulativeTuition: 345139418,
};

export const defaultTransportData: TransportData = {
  communes: [
    { ville: 'Saly', total: 291, part: '49 %' },
    { ville: 'Ngaparou', total: 120, part: '20 %' },
    { ville: 'Mbour', total: 99, part: '17 %' },
    { ville: 'Somone', total: 30, part: '5 %' },
    { ville: 'Malicounda', total: 23, part: '4 %' },
    { ville: 'Nguerigne', total: 14, part: '2 %' },
    { ville: 'Autres (> 30 km)', total: 16, part: '3 %' },
  ],
  stats: {
    totalEleves: 593,
    partSaly: '49 %',
    partPeripherie: '42 %',
    partEloignee: '9 %',
  },
  circuits: [
    {
      name: 'Ligne 1 : Mbour Centre → Saly → LFJP',
      eleves: 99,
      arrets: 'Rond-Point Total Mbour, Stade Caroline Faye, Croisement Saly, Lycée',
      horaireDepart: '07h10',
    },
    {
      name: 'Ligne 2 : Somone → Ngaparou → Nguerigne → LFJP',
      eleves: 164,
      arrets: 'Somone Plage, Mairie Ngaparou, Nguerigne Bambara, Route du Lycée',
      horaireDepart: '07h15',
    },
    {
      name: 'Ligne 3 : Saly Port & Résidences → Malicounda → LFJP',
      eleves: 65,
      arrets: 'Saly Port, Golf Club, Saly Joseph, Malicounda Échangeur, Lycée',
      horaireDepart: '07h25',
    },
  ],
  tarifs: [
    {
      zone: 'Zone 1 (Saly & proximité immédiate)',
      description: 'Trajets inférieurs à 5 km',
      mensuel: 28000,
      annuel: 280000,
    },
    {
      zone: 'Zone 2 (Ngaparou / Mbour centre)',
      description: 'Trajets entre 5 et 12 km',
      mensuel: 38000,
      annuel: 380000,
    },
    {
      zone: 'Zone 3 (Somone / Malicounda / Nguerigne)',
      description: 'Trajets supérieurs à 12 km',
      mensuel: 48000,
      annuel: 480000,
    },
  ],
  pointsCles: [
    'Forte concentration : 91 % des élèves résident à moins de 15 km de l’établissement.',
    'Sujet secondaire pour 68 % des familles qui privilégient le co-voiturage ou les déplacements individuels.',
    'Levier d’attractivité ciblé pour les communes de Ngaparou, Somone et la périphérie de Mbour.',
    'Scénario préconisé : service mutualisé avec bus scolaires sécurisés et accompagnateurs formés.',
  ],
};
