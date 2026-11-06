export interface AdminRubricItem {
  id: string; // e.g. 'rubrique-accueil', 'rubrique-methode', etc.
  title: string;
  slug: string;
  description: string;
  badge: string;
  iconName: string;
  isCore?: boolean;
}

export const defaultRubricsList: AdminRubricItem[] = [
  {
    id: 'rubrique-accueil',
    title: '1. Rubrique Accueil',
    slug: '/',
    description: 'Hero, cartes rubriques, mots officiels & sous-pages',
    badge: '/',
    iconName: 'Sparkles',
    isCore: true,
  },
  {
    id: 'rubrique-methode',
    title: '2. Rubrique Méthode',
    slug: '/methode',
    description: 'Démarche, calendrier de concertation & comités',
    badge: '/methode',
    iconName: 'Sliders',
    isCore: true,
  },
  {
    id: 'rubrique-vision',
    title: '3. Vision, Missions & Valeurs',
    slug: '/vision-missions-valeurs',
    description: 'Vision directrice, missions prioritaires & valeurs',
    badge: '/vision',
    iconName: 'Heart',
    isCore: true,
  },
  {
    id: 'rubrique-diagnostic',
    title: '4. Rubrique Diagnostic',
    slug: '/diagnostic',
    description: 'Rapports ELCS, cantine, données & graphiques',
    badge: '/diagnostic',
    iconName: 'ChartNoAxesCombined',
    isCore: true,
  },
  {
    id: 'rubrique-plan-strategique',
    title: '5. Plan Stratégique (4 Axes)',
    slug: '/plan-strategique',
    description: 'Axes 1 à 4, jalons, Bac Blanc, Film Annuel, budgets & transports',
    badge: '/plan',
    iconName: 'Target',
    isCore: true,
  },
];

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editeur';
  password: string; // Mot de passe simple pour le profil
  notes?: string;
}

export const defaultUserAccounts: UserAccount[] = [
  {
    id: 'acc-admin-1',
    email: 'direction@lfjpsaly.org',
    name: 'Direction Générale LFJP',
    role: 'admin',
    password: 'admin-lfjp',
    notes: 'Super-administrateur : tous droits (création, modification, suppression, publication)',
  },
  {
    id: 'acc-admin-2',
    email: 'informatique@lfjpsaly.org',
    name: 'Service Informatique LFJP',
    role: 'admin',
    password: 'admin-lfjp',
    notes: 'Super-administrateur technique : tous droits',
  },
  {
    id: 'acc-editor-1',
    email: 'editeur@lfjpsaly.org',
    name: 'Éditeur & Contributeur Contenus',
    role: 'editeur',
    password: 'editeur-lfjp',
    notes: 'Profil Éditeur simple : modification de tous les textes/photos/données autorisée, suppression désactivée',
  },
];
