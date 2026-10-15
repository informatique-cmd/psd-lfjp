export interface PsdTimelineAction {
  title: string;
  description: string;
  start: number;
  end: number;
  color: string;
}

export interface PsdTimeline {
  startYear: number;
  endYear: number;
  actions: PsdTimelineAction[];
}

export const psdTimelineData: Record<string, PsdTimeline> = {
  axe1: {
    startYear: 2025,
    endYear: 2031,
    actions: [
      { title: 'Programmes bien-être & participation', description: 'Médiation entre pairs, Savoir nager / Savoir rouler, expression & participation, parentalité-coéducation', start: 2025, end: 2031, color: 'from-purple-400/80 to-purple-500' },
      { title: 'Climatisation durable', description: 'Prototype 2025, étude des offres et déploiement progressif à partir de 2026', start: 2025, end: 2027, color: 'from-sky-400/80 to-sky-500' },
      { title: 'Cantine scolaire', description: 'Études, consultation des prestataires, mise en service en 2027 puis montée en charge jusqu’en 2029', start: 2027, end: 2029, color: 'from-orange-300/80 to-orange-500' },
      { title: 'Plan peinture & ravalement', description: 'Programme de maintenance intérieure/extérieure sur 5 années', start: 2026, end: 2030, color: 'from-amber-300/80 to-amber-500' },
      { title: 'Plafonds acoustiques', description: 'Priorités collège (2026-2027), lycée (2028) et laboratoires/primaires (2029-2030)', start: 2026, end: 2030, color: 'from-emerald-300/80 to-emerald-500' },
      { title: 'Renouvellement vidéoprojecteurs', description: 'Phases annuelles de 2026 à 2031 pour homogénéiser le parc', start: 2026, end: 2031, color: 'from-french-blue/70 to-french-blue' },
    ],
  },
  axe2: {
    startYear: 2026,
    endYear: 2030,
    actions: [
      { title: 'Continuité DNBi / SIA (collège)', description: 'Déploiement de la Section Internationale Américaine sur tout le collège et articulation avec la SI primaire', start: 2026, end: 2028, color: 'from-sky-400/80 to-sky-500' },
      { title: 'Ouverture et montée en puissance du BFI (lycée)', description: 'Ouverture simultanée de la Seconde SIA et du cycle BFI en 2028-2029, suivi et ajustements', start: 2028, end: 2030, color: 'from-indigo-400/80 to-indigo-600' },
      { title: 'Mobilités scolaires ADN-AEFE', description: 'Stabiliser 10 à 12 mobilités par an, diversifier les destinations et systématiser la préparation/retour', start: 2026, end: 2030, color: 'from-emerald-300/80 to-emerald-500' },
      { title: 'Voyages internationaux & séjours locaux', description: 'Équilibrer 1 à 2 voyages internationaux et 3 à 5 séjours locaux/régionaux par an, avec fonds de solidarité', start: 2026, end: 2030, color: 'from-orange-300/80 to-orange-500' },
      { title: 'Semaine des cultures & PEAC', description: 'Thématiques annuelles, inventaire PEAC, valorisation des projets artistiques et coordination primaire-collège-lycée', start: 2026, end: 2030, color: 'from-pink-300/80 to-pink-500' },
      { title: 'Médiation entre pairs & médiation interculturelle', description: 'Formation, suivi et extension du dispositif du primaire vers le collège pour améliorer le climat scolaire', start: 2026, end: 2030, color: 'from-amber-200/80 to-amber-400' },
      { title: 'Jumelages et projets collaboratifs', description: 'Diplomatie éducative, ancrage territorial et coopérations internationales à consolider chaque année', start: 2027, end: 2030, color: 'from-french-blue/70 to-french-blue' },
    ],
  },
  axe3: {
    startYear: 2026,
    endYear: 2030,
    actions: [
      { title: 'Classe numérique mobile', description: 'Phase 2 (2026) puis finalisation de la phase 3 et homogénéité du parc en 2027.', start: 2026, end: 2027, color: 'from-indigo-300/80 to-indigo-500' },
      { title: 'Renouvellement du matériel informatique', description: 'Plan pluriannuel de remplacement des PC et vidéoprojecteurs (2026-2030).', start: 2026, end: 2030, color: 'from-emerald-300/80 to-emerald-500' },
      { title: 'Curriculum numérique & introduction au code', description: 'Déploiement du curriculum spiralaire, algorithmique visuelle et Python collège/lycée.', start: 2026, end: 2030, color: 'from-sky-300/80 to-sky-500' },
      { title: 'Module IA & citoyenneté numérique', description: 'Sensibilisation IA, PIX IA et ateliers éthiques/cybersécurité sur toute la période.', start: 2026, end: 2030, color: 'from-amber-200/80 to-amber-400' },
      { title: 'Connectivité 2.0', description: 'Nouvelles bornes Wi-Fi, administration réseau, extension et éventuelle ligne pro THD.', start: 2026, end: 2030, color: 'from-purple-300/80 to-purple-500' },
      { title: 'Mécénat numérique', description: 'Création du fonds, appels à projets puis financements et pérennisation (2026-2030).', start: 2026, end: 2030, color: 'from-rose-300/80 to-rose-500' },
      { title: '1 PC par lycéen', description: 'Distribution progressive aux cohortes de Seconde (2028-2030) jusqu’à couverture complète.', start: 2028, end: 2030, color: 'from-orange-300/80 to-orange-500' },
    ],
  },
};
