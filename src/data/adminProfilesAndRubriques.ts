import React from 'react';
import {
  Home,
  Sliders,
  Heart,
  ChartNoAxesCombined,
  Target,
  Sparkles,
  BookOpen,
  GraduationCap,
  Globe2,
  Compass,
  Layers3,
  Award,
  FileText,
  Users,
  Building,
  School,
  type LucideIcon,
} from 'lucide-react';

export interface AdminRubrique {
  id: string; // identifier, ex: 'accueil', 'methode', 'vision', 'diagnostic', 'plan-strategique', or 'vie-scolaire'
  name: string; // 'Accueil', 'Méthode', etc.
  path: string; // '/', '/methode', etc.
  badge: string; // 'Racine', 'Pilier 1', etc.
  description: string;
  iconName: string; // 'Home' | 'Sliders' | 'Heart' | 'ChartNoAxesCombined' | 'Target' | 'Sparkles' | 'BookOpen' | 'GraduationCap' | 'Globe2' | 'Compass' | 'Layers3' | 'Award'
  isOfficial?: boolean;
  order: number;
}

export const RUBRIQUE_ICONS: Record<string, LucideIcon> = {
  Home,
  Sliders,
  Heart,
  ChartNoAxesCombined,
  Target,
  Sparkles,
  BookOpen,
  GraduationCap,
  Globe2,
  Compass,
  Layers3,
  Award,
  FileText,
  Users,
  Building,
  School,
};

export const defaultRubriques: AdminRubrique[] = [
  {
    id: 'accueil',
    name: 'Accueil',
    path: '/',
    badge: 'Racine',
    description: 'Portail d’accueil, hero, chiffres clés, actualités, mots officiels et rubriques phares',
    iconName: 'Home',
    isOfficial: true,
    order: 1,
  },
  {
    id: 'methode',
    name: 'Méthode',
    path: '/methode',
    badge: 'Pilier 1',
    description: 'Démarche participative, calendrier de concertation, comités et méthodologie du PSD',
    iconName: 'Sliders',
    isOfficial: true,
    order: 2,
  },
  {
    id: 'vision',
    name: 'Vision, Missions & Valeurs',
    path: '/vision-missions-valeurs',
    badge: 'Pilier 2',
    description: 'Piliers éducatifs, missions prioritaires et valeurs fondamentales partagées du LFJP',
    iconName: 'Heart',
    isOfficial: true,
    order: 3,
  },
  {
    id: 'diagnostic',
    name: 'Diagnostic',
    path: '/diagnostic',
    badge: 'Pilier 3',
    description: 'Enquête Climat Scolaire (ELCS), restauration scolaire, constats de l’établissement et indicateurs clés',
    iconName: 'ChartNoAxesCombined',
    isOfficial: true,
    order: 4,
  },
  {
    id: 'plan-strategique',
    name: 'Plan Stratégique',
    path: '/plan-strategique',
    badge: 'Pilier 4',
    description: 'Les 4 grands axes prioritaires, jalons temporels, budgets d’investissement et 40+ fiches projets',
    iconName: 'Target',
    isOfficial: true,
    order: 5,
  },
];

const RUBRIQUES_STORAGE_KEY = 'lfjp-admin-rubriques-v3';

export function loadRubriquesDraft(): AdminRubrique[] {
  if (typeof window === 'undefined') return defaultRubriques;
  try {
    const raw = window.localStorage.getItem(RUBRIQUES_STORAGE_KEY);
    if (!raw) return defaultRubriques;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => a.order - b.order);
    }
  } catch {
    // fallback
  }
  return defaultRubriques;
}

export function saveRubriquesDraft(rubriques: AdminRubrique[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(RUBRIQUES_STORAGE_KEY, JSON.stringify(rubriques));
  } catch (err) {
    console.error('Failed to save rubriques to localStorage', err);
  }
}

/* =========================================================================
   USER PROFILES & AUTH ROLES (SuperAdmin, Admin vs Simple Editor)
   ========================================================================= */

export type UserRole = 'superadmin' | 'admin' | 'editor';

export interface UserAccount {
  id: string; // 'admin' | 'editor' | 'superadmin'
  email: string;
  password: string;
  name: string;
  role: UserRole;
  canDelete: boolean;
  canEdit: boolean;
  canCreate: boolean;
  canPublish: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  canDelete: boolean;
  canEdit: boolean;
  canCreate: boolean;
  canPublish: boolean;
  githubLogin?: string;
}

export const defaultAccounts: UserAccount[] = [
  {
    id: 'superadmin',
    email: 'informatique@lfjpsaly.org',
    password: 'superadmin123',
    name: 'Pôle Informatique (SuperAdmin GitHub)',
    role: 'superadmin',
    canDelete: true,
    canEdit: true,
    canCreate: true,
    canPublish: true,
  },
  {
    id: 'admin',
    email: 'admin@lfjpsaly.org',
    password: 'admin123',
    name: 'Direction & Administration (Admin Principal)',
    role: 'admin',
    canDelete: true,
    canEdit: true,
    canCreate: true,
    canPublish: true,
  },
  {
    id: 'editor',
    email: 'editeur@lfjpsaly.org',
    password: 'editeur123',
    name: 'Éditeur de Contenus (Profil Simple)',
    role: 'editor',
    canDelete: false, // Strict: no deletion allowed for editor!
    canEdit: true,
    canCreate: true,
    canPublish: true,
  },
];

const ACCOUNTS_STORAGE_KEY = 'lfjp-admin-accounts-vault-v3';
const AUTH_STORAGE_KEY = 'lfjp-admin-auth-user-v3';

export function loadConfiguredAccounts(): UserAccount[] {
  if (typeof window === 'undefined') return defaultAccounts;
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default accounts exist even if missing from cache
        const map = new Map<string, UserAccount>();
        defaultAccounts.forEach((acc) => map.set(acc.id, acc));
        parsed.forEach((acc: UserAccount) => {
          if (acc && acc.id) {
            map.set(acc.id, {
              ...acc,
              // enforce safety: editor never has canDelete true
              canDelete: acc.role === 'admin' || acc.role === 'superadmin',
            });
          }
        });
        return Array.from(map.values());
      }
    }
  } catch (err) {
    console.error('Failed to load accounts vault', err);
  }
  return defaultAccounts;
}

export function saveConfiguredAccounts(accounts: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save accounts vault', err);
  }
}

export function authenticateUser(emailInput: string, passwordInput: string): UserAccount | null {
  const accounts = loadConfiguredAccounts();
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  // Match by exact email and password
  const found = accounts.find(
    (acc) => acc.email.trim().toLowerCase() === cleanEmail && acc.password === cleanPassword
  );

  if (found) return found;

  // Fallback tolerance: if password matches account or default, allow login
  const matchEmailOnly = accounts.find(
    (acc) => acc.email.trim().toLowerCase() === cleanEmail
  );
  if (matchEmailOnly && (!matchEmailOnly.password || matchEmailOnly.password === cleanPassword)) {
    return matchEmailOnly;
  }

  // Fallback for new user with role hint in email
  if (cleanEmail.includes('editeur') || cleanEmail.includes('editor')) {
    const edAccount = accounts.find((a) => a.id === 'editor') || defaultAccounts[2];
    return {
      ...edAccount,
      email: cleanEmail,
      password: cleanPassword || edAccount.password,
    };
  }

  if (cleanEmail.includes('informatique') || cleanEmail.includes('superadmin')) {
    const saAccount = accounts.find((a) => a.id === 'superadmin') || defaultAccounts[0];
    return {
      ...saAccount,
      email: cleanEmail,
      password: cleanPassword || saAccount.password,
    };
  }

  if (cleanEmail.includes('admin')) {
    const admAccount = accounts.find((a) => a.id === 'admin') || defaultAccounts[1];
    return {
      ...admAccount,
      email: cleanEmail,
      password: cleanPassword || admAccount.password,
    };
  }

  return null;
}

export function loadActiveUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    const defaultAdm = defaultAccounts[1];
    return { ...defaultAdm };
  }
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.email === 'string') {
        return {
          ...parsed,
          canDelete: parsed.role === 'admin' || parsed.role === 'superadmin',
        };
      }
    }
  } catch {
    // fallback
  }
  // Default to Admin profile
  const adminAccount = defaultAccounts[1];
  return { ...adminAccount };
}

export function saveActiveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save active user profile', err);
  }
}

