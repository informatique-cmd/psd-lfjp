export interface BudgetProject {
  id: string;
  title: string;
  name?: string;
  description: string;
  period: string;
  budget: number;
  totalCost?: number;
  color: string;
  link?: string;
  category?: 'equipment' | 'infra' | 'land';
  isActive?: boolean;
  isVariable?: boolean;
  variableMin?: number;
  variableMax?: number;
  startYear?: number;
  durationYears?: number;
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
  studentCount?: number;
  baseCapacityAnnual?: number;
  extraCapacityFrom2028?: number;
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
  studentCount: 630,
  baseCapacityAnnual: 70000000,
  extraCapacityFrom2028: 30000000,
  summaryCards: {
    totalInvestment: 675000000,
    fundingGap: 89860582,
    estimatedCapacity: 685139418,
  },
  projects: [
    {
      id: 'clim',
      title: 'Climatisation (Phases 2 & 3)',
      name: 'Climatisation (Phases 2 & 3)',
      category: 'equipment',
      description: 'Salles restantes (Min) ou Bureaux + Solaire (Max)',
      period: '2026 – 2027',
      budget: 60000000,
      totalCost: 60000000,
      startYear: 2026,
      durationYears: 2,
      isActive: true,
      isVariable: true,
      variableMin: 30000000,
      variableMax: 90000000,
      color: 'from-sky-100 to-sky-50',
      link: '/climatisation-durable',
    },
    {
      id: 'sport_cover',
      title: 'Couverture Terrain Sport',
      name: 'Couverture Terrain Sport',
      category: 'infra',
      description: 'Structure de couverture pour le terrain pour les cours d’EPS et compétitions',
      period: '2026 – 2028',
      budget: 75000000,
      totalCost: 75000000,
      startYear: 2026,
      durationYears: 3,
      isActive: true,
      isVariable: true,
      variableMin: 60000000,
      variableMax: 90000000,
      color: 'from-amber-100 to-orange-50',
      link: '/couverture-terrain-sport',
    },
    {
      id: 'solar_sport',
      title: 'Solaire Terrain Sport',
      name: 'Solaire Terrain Sport',
      category: 'equipment',
      description: 'Centrale photovoltaïque pour le terrain et autoconsommation',
      period: '2026',
      budget: 55000000,
      totalCost: 55000000,
      startYear: 2026,
      durationYears: 1,
      isActive: true,
      isVariable: true,
      variableMin: 45000000,
      variableMax: 65000000,
      color: 'from-emerald-100 to-emerald-50',
    },
    {
      id: 'pool',
      title: 'Piscine',
      name: 'Piscine',
      category: 'infra',
      description: 'Rénovation et aménagements piscine pour le parcours Savoir-nager',
      period: '2027 – 2028',
      budget: 125000000,
      totalCost: 125000000,
      startYear: 2027,
      durationYears: 2,
      isActive: true,
      isVariable: true,
      variableMin: 100000000,
      variableMax: 150000000,
      color: 'from-sky-100 to-blue-50',
    },
    {
      id: 'restauration',
      title: 'Restauration Scolaire',
      name: 'Restauration Scolaire',
      category: 'infra',
      description: 'Construction et équipement du réfectoire & cuisine (450 repas/jour)',
      period: '2027 – 2029',
      budget: 300000000,
      totalCost: 300000000,
      startYear: 2027,
      durationYears: 3,
      isActive: true,
      isVariable: true,
      variableMin: 250000000,
      variableMax: 350000000,
      color: 'from-orange-100 to-amber-50',
      link: '/construction-cantine',
    },
    {
      id: 'terrain',
      title: 'Acquisition Terrain',
      name: 'Acquisition Terrain',
      category: 'land',
      description: 'Extension et réserve foncière pour futurs aménagements',
      period: '2028',
      budget: 60000000,
      totalCost: 60000000,
      startYear: 2028,
      durationYears: 1,
      isActive: true,
      isVariable: true,
      variableMin: 50000000,
      variableMax: 80000000,
      color: 'from-lime-100 to-emerald-50',
    },
  ],
  financialTimeline: [
    { year: 2026, capacite: 70000000, leviers: 64969911, recettesTotales: 134969911, depenses: 110000000 },
    { year: 2027, capacite: 70000000, leviers: 70042377, recettesTotales: 140042377, depenses: 217500000 },
    { year: 2028, capacite: 100000000, leviers: 70042377, recettesTotales: 170042377, depenses: 247500000 },
    { year: 2029, capacite: 100000000, leviers: 70042377, recettesTotales: 170042377, depenses: 100000000 },
    { year: 2030, capacite: 100000000, leviers: 70042377, recettesTotales: 170042377, depenses: 0 },
  ],
  tuitionSimulations: [
    { year: 2026, increase: 5.4, revenue: 64969911 },
    { year: 2027, increase: 0.4, revenue: 70042377 },
    { year: 2028, increase: 0, revenue: 70042377 },
    { year: 2029, increase: 0, revenue: 70042377 },
    { year: 2030, increase: 0, revenue: 70042377 },
  ],
  projectSchedule: [
    { project: 'Climatisation (Phases 2 & 3)', start: 2026, end: 2027, annualSpend: { '2026': 30000000, '2027': 30000000 } },
    { project: 'Couverture Terrain Sport', start: 2026, end: 2028, annualSpend: { '2026': 25000000, '2027': 25000000, '2028': 25000000 } },
    { project: 'Solaire Terrain Sport', start: 2026, end: 2026, annualSpend: { '2026': 55000000 } },
    { project: 'Piscine', start: 2027, end: 2028, annualSpend: { '2027': 62500000, '2028': 62500000 } },
    { project: 'Restauration Scolaire', start: 2027, end: 2029, annualSpend: { '2027': 100000000, '2028': 100000000, '2029': 100000000 } },
    { project: 'Acquisition Terrain', start: 2028, end: 2028, annualSpend: { '2028': 60000000 } },
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
