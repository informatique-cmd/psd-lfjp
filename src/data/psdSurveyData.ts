export interface PsdScoreItem {
  name: string;
  score: number;
  note?: string;
  tone?: 'red' | 'amber' | 'orange' | 'blue' | 'green' | 'emerald' | 'purple';
}

export interface PsdClassShare {
  name: string;
  percentage: number;
}

export interface PsdSurveyData {
  eleves: {
    totalResponses: number;
    recommendationRate: number;
    recommendationNote: string;
    topClasses: PsdClassShare[];
    qualiteInformation: PsdScoreItem[];
    qualiteInformationConstat: string;
    installations: PsdScoreItem[];
    installationsKeywords: string[];
    offreScolaire: PsdScoreItem[];
    accompagnement: PsdScoreItem[];
    pointsForts: PsdScoreItem[];
    pointsFortsConstat: string;
    priorites: PsdScoreItem[];
    prioritesSecondaryNote: string;
  };
  parents: {
    totalResponses: number;
    singleChildRate: number;
    recommendationRate: number;
    recommendationNote: string;
    motifChoix: PsdScoreItem[];
    qualiteInformation: PsdScoreItem[];
    qualiteInformationConstat: string;
    installations: PsdScoreItem[];
    installationsConstat: string;
    offreScolaire: PsdScoreItem[];
    offreScolaireConstat: string;
    accompagnement: PsdScoreItem[];
    accompagnementConstat: string;
    pointsForts: PsdScoreItem[];
    pointsFortsConstat: string;
    priorites: PsdScoreItem[];
    prioritesSecondaires: PsdScoreItem[];
  };
}

export const defaultPsdSurveyData: PsdSurveyData = {
  eleves: {
    totalResponses: 98,
    recommendationRate: 59,
    recommendationNote: "Taux modéré - Marge d'amélioration",
    topClasses: [
      { name: '1ʳᵉ', percentage: 24 },
      { name: '2ⁿᵈᵉ', percentage: 21 },
      { name: '6ᵉ', percentage: 19 },
    ],
    qualiteInformation: [
      { name: 'Sorties & voyages', score: 2.05, note: 'Maillon le plus faible', tone: 'red' },
      { name: "Décisions budgétaires de l'AP", score: 2.16, tone: 'red' },
      { name: 'Projets & activités pédagogiques', score: 2.41, tone: 'amber' },
      { name: 'Paiement des écolages', score: 2.45, tone: 'amber' },
      { name: 'Pronote', score: 3.18, note: 'Seul canal satisfaisant', tone: 'green' },
    ],
    qualiteInformationConstat: 'Besoin de communication proactive et régulière sur les projets, voyages et gestion financière.',
    installations: [
      { name: 'Sanitaires', score: 1.98, note: 'Sujet le plus critique', tone: 'red' },
      { name: 'Salles de classe', score: 2.17, tone: 'red' },
      { name: 'Vestiaires & équipements sportifs', score: 2.26, tone: 'red' },
      { name: 'CDI-BCD', score: 3.49, note: 'Point fort reconnu', tone: 'green' },
    ],
    installationsKeywords: [
      'clim/climatisation (25 occurrences)',
      'chaud (13)',
      'sanitaires (réparations)',
      'foot (espaces de jeu)',
    ],
    offreScolaire: [
      { name: 'Offre linguistique', score: 2.6, tone: 'red' },
      { name: 'Options payantes / périscolaire', score: 2.66, tone: 'red' },
      { name: 'Ouverture culturelle', score: 2.57, tone: 'red' },
      { name: 'Offre sportive', score: 3.05, tone: 'green' },
      { name: 'Enseignement du français', score: 3.11, tone: 'green' },
      { name: 'Maths & sciences', score: 3.34, tone: 'green' },
    ],
    accompagnement: [
      { name: 'Professeur principal', score: 3.83, note: 'Relation très favorable', tone: 'green' },
      { name: 'Surveillants', score: 3.28, tone: 'green' },
      { name: 'Vie scolaire', score: 3.22, tone: 'green' },
      { name: 'Professeurs du secondaire', score: 3.08, tone: 'green' },
    ],
    pointsForts: [
      { name: 'Sport', score: 3.31, note: 'Dynamisme et implication', tone: 'green' },
      { name: 'Sciences', score: 2.97, tone: 'green' },
      { name: 'Inclusion & ouverture culturelle', score: 2.8, tone: 'green' },
      { name: 'Numérique', score: 2.44, tone: 'amber' },
      { name: 'Plurilinguisme', score: 2.36, tone: 'amber' },
    ],
    pointsFortsConstat: 'Le plurilinguisme et le numérique ne sont pas encore identifiés comme de véritables atouts.',
    priorites: [
      { name: 'Développer les voyages scolaires', score: 4.02, tone: 'blue' },
      { name: 'Climatisation des salles', score: 3.92, tone: 'blue' },
      { name: 'Restauration scolaire', score: 3.81, tone: 'blue' },
      { name: 'Équipements sportifs', score: 3.47, tone: 'blue' },
      { name: 'Développement du plurilinguisme', score: 3.4, tone: 'blue' },
      { name: 'Numérique éducatif', score: 3.29, tone: 'blue' },
    ],
    prioritesSecondaryNote: 'Transport scolaire et garderie matinale restent secondaires (≤ 2,9/5)',
  },
  parents: {
    totalResponses: 107,
    singleChildRate: 51,
    recommendationRate: 93,
    recommendationNote: 'Capital de confiance solide à préserver',
    motifChoix: [
      { name: 'Continuité du cursus en France', score: 4.4, note: 'Première raison invoquée', tone: 'blue' },
      { name: 'Partenariat AEFE', score: 4.07, tone: 'blue' },
      { name: 'Langue & culture françaises', score: 4.04, tone: 'blue' },
      { name: "Excellence & qualité de l'enseignement", score: 3.71, tone: 'blue' },
      { name: "Aide apportée à l'enfant", score: 3.52, tone: 'blue' },
      { name: 'Frais de scolarité', score: 2.67, note: 'Coût jugé élevé', tone: 'orange' },
    ],
    qualiteInformation: [
      { name: 'Pronote', score: 4.32, note: 'Outil plébiscité', tone: 'green' },
      { name: 'Inscriptions', score: 4.13, tone: 'green' },
      { name: "Actualité de l'APE-LFJP", score: 4.02, tone: 'green' },
      { name: 'Paiement des écolages', score: 3.8, tone: 'blue' },
      { name: 'Projets & activités', score: 3.79, tone: 'blue' },
      { name: 'Sorties & voyages', score: 3.58, note: 'Préavis trop court', tone: 'orange' },
      { name: 'Options & sections', score: 3.39, tone: 'orange' },
    ],
    qualiteInformationConstat: 'Information papier ou multi-canal pour toucher ceux qui lisent peu les mails.',
    installations: [
      { name: 'Zones circulation externes', score: 2.41, note: 'Parking et sécurité critiqués', tone: 'red' },
      { name: 'Équipements sportifs & vestiaires', score: 2.73, tone: 'orange' },
      { name: 'Sécurité abords', score: 2.94, tone: 'orange' },
      { name: 'Salles de classe', score: 2.96, tone: 'orange' },
      { name: 'Sanitaires', score: 2.98, tone: 'orange' },
      { name: 'Espaces verts & cour', score: 3.2, tone: 'blue' },
      { name: 'CDI/BCD', score: 3.5, tone: 'green' },
      { name: 'Circulations internes', score: 3.59, tone: 'green' },
    ],
    installationsConstat: 'climatisation, parking, chaleur, sanitaires, circulation externe.',
    offreScolaire: [
      { name: 'Citoyenneté & valeurs', score: 3.85, tone: 'green' },
      { name: 'Enseignement du français', score: 3.77, tone: 'green' },
      { name: 'Ouverture culturelle', score: 3.73, tone: 'green' },
      { name: 'Maths & sciences', score: 3.56, tone: 'blue' },
      { name: 'Offre sportive', score: 3.34, tone: 'blue' },
      { name: 'Offre linguistique (global)', score: 3.22, tone: 'orange' },
      { name: 'Anglais / espagnol', score: 3.13, tone: 'orange' },
      { name: 'Options payantes', score: 3.04, tone: 'orange' },
    ],
    offreScolaireConstat: "renforcer l'anglais, besoin de \"native speakers\", optimiser le rapport coût/choix des options.",
    accompagnement: [
      { name: 'ASEM (maternelle)', score: 4.24, note: 'Point fort reconnu', tone: 'green' },
      { name: 'Professeur des écoles', score: 3.81, tone: 'green' },
      { name: 'Professeur principal (secondaire)', score: 3.72, tone: 'green' },
      { name: 'Vie scolaire', score: 3.71, tone: 'green' },
      { name: 'Professeurs du secondaire', score: 3.54, tone: 'blue' },
    ],
    accompagnementConstat: 'davantage de soutien en langues et meilleure répartition des évaluations.',
    pointsForts: [
      { name: 'Culture française', score: 3.79, tone: 'emerald' },
      { name: 'Ouverture culturelle', score: 3.73, tone: 'emerald' },
      { name: 'Inclusion', score: 3.41, tone: 'blue' },
      { name: 'International', score: 3.36, tone: 'blue' },
      { name: 'Sciences', score: 3.22, tone: 'blue' },
      { name: 'Numérique', score: 3.18, tone: 'orange' },
      { name: 'Sport', score: 3.15, tone: 'orange' },
      { name: 'Plurilinguisme', score: 3.01, tone: 'orange' },
    ],
    pointsFortsConstat: 'richesse des événements culturels et taux de réussite aux examens.',
    priorites: [
      { name: 'Restauration scolaire', score: 4.4, note: 'Priorité absolue', tone: 'purple' },
      { name: 'Climatisation des salles', score: 4.33, tone: 'purple' },
      { name: 'Développement du plurilinguisme', score: 4.24, tone: 'purple' },
      { name: 'Équipements sportifs', score: 3.93, tone: 'blue' },
      { name: 'Numérique éducatif', score: 3.92, tone: 'blue' },
      { name: 'Transport scolaire', score: 3.48, tone: 'blue' },
    ],
    prioritesSecondaires: [
      { name: 'Garderie matinale', score: 2.49 },
      { name: 'Augmentation des effectifs', score: 2.68 },
    ],
  },
};
