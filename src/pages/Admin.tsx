import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle, AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowDown, ArrowLeft, ArrowUp, ArrowUpDown,
  BarChart3, Bell, Bold, BookOpen, BusFront, Calculator, Check, CheckCircle2, ChevronDown, ChevronRight, ChartNoAxesCombined, Coins, Copy, CornerDownRight, Database, Download, ExternalLink, Eye, FileDown, FilePlus, FileText, FileUp, FolderPlus, FolderTree,
  Github, Globe2, GraduationCap, Heart, Home as HomeIcon, Image, Italic, Key, Layers3, ListPlus, Lock, LogOut, Mail, MapPin, Maximize2,
  Menu, MessageSquareText, Minimize2, Monitor, PanelLeftClose, PanelLeftOpen, PanelRightClose,
  PanelRightOpen, Pencil, Plus, RefreshCw, Rocket, Save, Search, Send, Settings2, ShieldCheck, Sliders, Smartphone, Sparkles, Tablet,
  Target, Trash2, TrendingUp, Underline, Unlock, Upload, User, UsersRound, Wallet, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import siteContent from '@/content/siteContent.json';
import pagesFile from '@/content/pages.json';
import pageDataFile from '@/content/pageData.json';
import breadcrumbRoutes from '@/data/breadcrumbRoutes.json';
import { bacBlancSchedule } from '@/data/bacBlancSchedule';
import { filmAnnuelData } from '@/data/filmAnnuelData';
import { restaurantPageData } from '@/data/restaurantPageData';
import { psdTimelineData } from '@/data/psdTimelineData';
import { elcsData } from '@/components/diagnostic/ElcsDataContext';
import { defaultBudgetData, defaultTransportData, type BudgetData, type TransportData, type BudgetProject, type TransportCommune, type TransportCircuit, type CashFlowYear, type TuitionSimulation } from '@/data/budgetTransportData';
import { isValidManagedPage, isValidPageData, normalizePageSlug, validateManagedPages, type ContentBlock, type ManagedPage, type TextStyle } from '@/content/pageTypes';
import { normalizeMediaUrl } from '@/lib/media';
import publishedPageText from '@/content/pageText.json';
import { pageTextDraftStorageKey } from '@/lib/pageOverrides';
import { clearAllDraftStorage } from '@/lib/contentDraft';
import { SITE_PILLARS, type HierarchyPillar, type HierarchySubpage, type HierarchyAxis } from '@/data/siteHierarchy';
import {
  loadRubriquesDraft,
  saveRubriquesDraft,
  loadActiveUserProfile,
  saveActiveUserProfile,
  loadConfiguredAccounts,
  saveConfiguredAccounts,
  authenticateUser,
  defaultAccounts,
  RUBRIQUE_ICONS,
  type AdminRubrique,
  type UserProfile,
  type UserAccount,
} from '@/data/adminProfilesAndRubriques';
import {
  loadPendingDeploymentRequest,
  savePendingDeploymentRequest,
  submitEditorDraft,
  approveDeploymentRequest,
  rejectDeploymentRequest,
  fetchPendingDeploymentFromServer,
  type PendingDeploymentRequest,
} from '@/data/deploymentWorkflow';

type Content = typeof siteContent;

export const adminNavigationGroups = [
  {
    group: 'TABLEAU DE BORD',
    items: [
      { id: 'dashboard', label: 'Vue d’ensemble', description: 'Arborescence & accès direct aux 5 rubriques', Icon: HomeIcon },
    ],
  },
  {
    group: 'LES 5 GRANDES RUBRIQUES DU SITE',
    items: [
      { id: 'rubrique-accueil', label: '1. Rubrique Accueil', description: 'Hero, cartes rubriques, mots officiels & sous-pages', Icon: Sparkles, badge: '/' },
      { id: 'rubrique-methode', label: '2. Rubrique Méthode', description: 'Démarche, calendrier de concertation & comités', Icon: Sliders, badge: '/methode' },
      { id: 'rubrique-vision', label: '3. Vision, Missions & Valeurs', description: 'Vision directrice, missions prioritaires & valeurs', Icon: Heart, badge: '/vision' },
      { id: 'rubrique-diagnostic', label: '4. Rubrique Diagnostic', description: 'Rapports ELCS, cantine, données & graphiques', Icon: ChartNoAxesCombined, badge: '/diagnostic' },
      { id: 'rubrique-plan-strategique', label: '5. Plan Stratégique (4 Axes)', description: 'Axes 1 à 4, jalons, Bac Blanc, Film Annuel & fiches', Icon: Target, badge: '/plan' },
    ],
  },
  {
    group: 'GESTION AVANCÉE DES PAGES',
    items: [
      { id: 'pages', label: 'Constructeur de Pages & Blocs', description: 'Arborescence libre, hiérarchie et blocs riches', Icon: FileText },
      { id: 'edition-visuelle', label: 'Édition In-Situ (Aperçu)', description: 'Modifier directement sur la prévisualisation', Icon: Pencil },
    ],
  },
  {
    group: 'PARAMÈTRES & DÉPLOIEMENT',
    items: [
      { id: 'identite', label: 'Identité & Pied de page', description: 'Logo, nom, contacts et copyright', Icon: Globe2 },
      { id: 'publication', label: 'Publication GitHub & Vercel', description: 'Brouillon, sauvegarde & mise en ligne', Icon: Send },
      { id: 'acces', label: 'Comptes Administrateurs', description: 'Administrateurs autorisés', Icon: UsersRound },
    ],
  },
] as const;

const adminTabs = adminNavigationGroups.flatMap((group) => group.items);
const draftStorageKey = 'lfjp-admin-draft';
const pagesDraftStorageKey = 'lfjp-admin-pages-draft';
const pageDataDraftStorageKey = 'lfjp-admin-page-data-draft';
const defaultPageData = {
  bacBlancSchedule: (pageDataFile as { bacBlancSchedule?: typeof bacBlancSchedule }).bacBlancSchedule || bacBlancSchedule,
  filmAnnuelData: (pageDataFile as { filmAnnuelData?: typeof filmAnnuelData }).filmAnnuelData || filmAnnuelData,
  planStrategique: { title: 'PLAN STRATÉGIQUE DE DÉVELOPPEMENT', subtitle: 'Lycée Français Jacques Prévert (2026-2030)' },
  planificationBacBlanc: {
    badge: 'Planification des épreuves',
    title: 'Organisation du bac blanc – session de décembre',
    description: 'Vue synthétique de l’organisation de la journée du 10 décembre. Chaque carte détaille la surveillance principale, le support dédié et les consignes logistiques pour garantir une couverture complète des salles.',
  },
  restaurant: restaurantPageData,
  psdTimelines: {
    ...psdTimelineData,
    axe4: psdTimelineData.axe4 || {
      startYear: 2026,
      endYear: 2030,
      actions: [
        { title: 'Infrastructures sportives & couverture', description: 'Aménagement du terrain de sport et couverture.', start: 2026, end: 2028, color: 'from-emerald-300/80 to-emerald-500' },
        { title: 'Cadre de vie & développement durable', description: 'Végétalisation, confort thermique et isolation acoustique.', start: 2026, end: 2030, color: 'from-sky-400/80 to-sky-500' },
      ],
    },
  },
  elcsData,
  budgetData: (pageDataFile as { budgetData?: BudgetData }).budgetData || defaultBudgetData,
  transportData: (pageDataFile as { transportData?: TransportData }).transportData || defaultTransportData,
};
const restaurantEditorGroups: { title: string; datasets: { key: keyof typeof restaurantPageData; label: string; fields: { key: string; label: string; type?: 'number' | 'text' }[] }[] }[] = [
  { title: 'Répartition et réponses', datasets: [
    { key: 'studentDistributionData', label: 'Répartition des élèves', fields: [{ key: 'name', label: 'Niveau' }, { key: 'value', label: 'Effectif', type: 'number' }, { key: 'percentage', label: 'Pourcentage', type: 'number' }] },
    { key: 'restaurationInterestData', label: 'Intérêt pour la restauration', fields: [{ key: 'name', label: 'Réponse' }, { key: 'value', label: 'Pourcentage', type: 'number' }] },
    { key: 'currentLunchData', label: 'Repas actuels', fields: [{ key: 'name', label: 'Situation' }, { key: 'value', label: 'Réponses', type: 'number' }, { key: 'percentage', label: 'Pourcentage', type: 'number' }] },
  ] },
  { title: 'Préférences et budgets', datasets: [
    { key: 'serviceInterestByDayData', label: 'Intérêt par jour', fields: [{ key: 'name', label: 'Jour' }, { key: 'value', label: 'Réponses', type: 'number' }, { key: 'percentage', label: 'Pourcentage', type: 'number' }] },
    { key: 'mealTypePreferenceData', label: 'Types de repas', fields: [{ key: 'name', label: 'Type' }, { key: 'value', label: 'Réponses', type: 'number' }, { key: 'percentage', label: 'Pourcentage', type: 'number' }] },
    { key: 'priceForDishData', label: 'Budget par plat', fields: [{ key: 'name', label: 'Tranche' }, { key: 'value', label: 'Pourcentage', type: 'number' }] },
    { key: 'priceForMenuData', label: 'Budget par menu', fields: [{ key: 'name', label: 'Tranche' }, { key: 'value', label: 'Pourcentage', type: 'number' }] },
  ] },
  { title: 'Indicateurs de synthèse', datasets: [
    { key: 'keyMetrics', label: 'Statistiques clés', fields: [{ key: 'name', label: 'Indicateur' }, { key: 'value', label: 'Valeur' }, { key: 'label', label: 'Précision' }] },
    { key: 'alertPoints', label: 'Points d’attention', fields: [{ key: 'name', label: 'Indicateur' }, { key: 'value', label: 'Valeur' }, { key: 'label', label: 'Précision' }] },
  ] },
];

const loadPageDataDraft = () => {
  const savedData = window.localStorage.getItem(pageDataDraftStorageKey);
  if (!savedData) return { ...defaultPageData, ...pageDataFile };
  try {
    const parsed: unknown = JSON.parse(savedData);
    if (!isRecord(parsed)) {
      throw new Error('Structure des données de pages invalide.');
    }
    const merged = { ...defaultPageData, ...pageDataFile, ...parsed };
    if (!isValidPageData(merged)) throw new Error('Structure des données de pages invalide.');
    return merged;
  } catch {
    window.localStorage.removeItem(pageDataDraftStorageKey);
    return { ...defaultPageData, ...pageDataFile };
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isValidPageTextOverrides = (value: unknown) => isRecord(value) &&
  Object.values(value).every((page) => isRecord(page) &&
    Object.values(page).every((entry) => isRecord(entry) &&
      Object.entries(entry).every(([field, item]) => ['text', 'src', 'alt', 'href'].includes(field) && typeof item === 'string')));

const loadContentDraft = (): Content => {
  const savedDraft = window.localStorage.getItem(draftStorageKey);
  if (!savedDraft) return siteContent;
  try {
    const parsed: unknown = JSON.parse(savedDraft);
    if (!isRecord(parsed) || !isRecord(parsed.site) || typeof parsed.site.name !== 'string' || typeof parsed.site.tagline !== 'string' || typeof parsed.site.logoUrl !== 'string' || typeof parsed.site.logoAlt !== 'string' || typeof parsed.site.footerPlan !== 'string' || typeof parsed.site.footerCopyright !== 'string' || typeof parsed.site.footerCopyrightPrefix !== 'string' || typeof parsed.site.footerYear !== 'number' || !isRecord(parsed.visionMissionsValeurs) || !Array.isArray(parsed.visionMissionsValeurs.vision) || !Array.isArray(parsed.visionMissionsValeurs.missions) || !Array.isArray(parsed.visionMissionsValeurs.values) || !isRecord(parsed.home) || !Array.isArray(parsed.home.cards) || !Array.isArray(parsed.home.messages)) {
      throw new Error('Structure de brouillon invalide.');
    }
    return parsed as Content;
  } catch {
    window.localStorage.removeItem(draftStorageKey);
    return siteContent;
  }
};

const loadPagesDraft = (): ManagedPage[] => {
  const savedPages = window.localStorage.getItem(pagesDraftStorageKey);
  if (!savedPages) return pagesFile.pages as ManagedPage[];
  try {
    const parsed: unknown = JSON.parse(savedPages);
    if (!isRecord(parsed) || !Array.isArray(parsed.pages) || !parsed.pages.every(isValidManagedPage)) {
      throw new Error('Structure de pages invalide.');
    }
    return parsed.pages as ManagedPage[];
  } catch {
    window.localStorage.removeItem(pagesDraftStorageKey);
    return pagesFile.pages as ManagedPage[];
  }
};

const MediaPreview = ({ src, type = 'image' }: { src: string; type?: 'image' | 'video' }) => {
  const [failed, setFailed] = useState(false);
  const normalized = normalizeMediaUrl(src, type);
  if (!normalized) return null;
  if (failed) return <p className="text-xs text-red-600">Aperçu impossible. Vérifiez que le fichier est public et que le lien est accessible sans connexion.</p>;
  return type === 'video'
    ? <video className="max-h-40 w-full rounded-md border bg-slate-100 object-contain" controls src={normalized} onError={() => setFailed(true)} />
    : <img className="max-h-40 w-full rounded-md border bg-slate-100 object-contain" src={normalized} alt="Aperçu du média" onError={() => setFailed(true)} />;
};

const TextStyleToolbar = ({ style = {}, onChange }: { style?: TextStyle; onChange: (patch: Partial<TextStyle>) => void }) => {
  const toggle = (field: 'bold' | 'italic' | 'underline') => onChange({ [field]: !style[field] });
  const alignments = [
    ['left', AlignLeft],
    ['center', AlignCenter],
    ['right', AlignRight],
    ['justify', AlignJustify],
  ] as const;
  return (
    <div className="rounded-xl border bg-slate-50 p-3 shadow-inner">
      <div className="mb-3 flex flex-wrap items-center gap-1">
        <span className="mr-2 text-xs font-bold uppercase tracking-wide text-slate-500">Mise en forme</span>
        {([['bold', Bold, 'Gras'], ['italic', Italic, 'Italique'], ['underline', Underline, 'Souligné']] as const).map(([field, Icon, label]) => (
          <Button key={field} type="button" size="sm" variant={style[field] ? 'default' : 'outline'} title={label} aria-label={label} onClick={() => toggle(field)}><Icon size={15} /></Button>
        ))}
        {alignments.map(([value, Icon]) => <Button key={value} type="button" size="sm" variant={style.align === value ? 'default' : 'outline'} title={`Aligner à ${value}`} aria-label={`Aligner à ${value}`} onClick={() => onChange({ align: value })}><Icon size={15} /></Button>)}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <select className="h-9 rounded-md border bg-white px-2 text-sm" value={style.fontFamily || 'default'} onChange={(event) => onChange({ fontFamily: event.target.value as TextStyle['fontFamily'] })} aria-label="Police">
          <option value="default">Police du site</option><option value="raleway">Raleway</option><option value="playfair">Playfair Display</option><option value="serif">Serif classique</option><option value="mono">Monospace</option>
        </select>
        <select className="h-9 rounded-md border bg-white px-2 text-sm" value={style.fontSize || 'normal'} onChange={(event) => onChange({ fontSize: event.target.value as TextStyle['fontSize'] })} aria-label="Taille du texte">
          <option value="small">Petit</option><option value="normal">Normal</option><option value="large">Grand</option><option value="xlarge">Très grand</option>
        </select>
        <select className="h-9 rounded-md border bg-white px-2 text-sm" value={style.lineHeight || 'relaxed'} onChange={(event) => onChange({ lineHeight: event.target.value as TextStyle['lineHeight'] })} aria-label="Interligne">
          <option value="normal">Interligne normal</option><option value="relaxed">Interligne confortable</option><option value="loose">Interligne large</option>
        </select>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-xs text-slate-600">Couleur du texte <input className="h-8 w-full cursor-pointer rounded border" type="color" value={style.color || '#334155'} onChange={(event) => onChange({ color: event.target.value })} /></label>
        <label className="flex items-center gap-2 text-xs text-slate-600">Fond du texte <input className="h-8 w-full cursor-pointer rounded border" type="color" value={style.backgroundColor || '#ffffff'} onChange={(event) => onChange({ backgroundColor: event.target.value })} /></label>
      </div>
    </div>
  );
};

const Admin = () => {
  const [content, setContent] = useState<Content>(loadContentDraft);
  const [pages, setPages] = useState<ManagedPage[]>(loadPagesDraft);
  const [pageDataJson, setPageDataJson] = useState(() => JSON.stringify(loadPageDataDraft(), null, 2));
  const [pageTextJson, setPageTextJson] = useState(() => {
    try {
      return window.localStorage.getItem(pageTextDraftStorageKey) || JSON.stringify(publishedPageText, null, 2);
    } catch {
      return JSON.stringify(publishedPageText, null, 2);
    }
  });
  const [visualRoute, setVisualRoute] = useState('/');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [donneesSubTab, setDonneesSubTab] = useState<'restaurant' | 'elcs' | 'bac-blanc' | 'film-annuel'>('restaurant');
  const [pageSubTab, setPageSubTab] = useState<'list' | 'editor'>('list');
  const [activeRubriqueReturn, setActiveRubriqueReturn] = useState<string | null>(null);
  const [accueilSubTab, setAccueilSubTab] = useState<'cards' | 'messages' | 'hero' | 'subpages'>('cards');
  const [methodeSubTab, setMethodeSubTab] = useState<'content' | 'calendrier' | 'subpages'>('content');
  const [visionSubTab, setVisionSubTab] = useState<'vision' | 'missions' | 'valeurs' | 'subpages'>('vision');
  const [diagnosticSubTab, setDiagnosticSubTab] = useState<'elcs' | 'restaurant' | 'rapports' | 'subpages'>('elcs');
  const [planStrategiqueSubTab, setPlanStrategiqueSubTab] = useState<'axes' | 'budgets' | 'transports' | 'bac-blanc' | 'film-annuel' | 'subpages'>('axes');
  const [customRubriqueSubTab, setCustomRubriqueSubTab] = useState<'content' | 'subpages'>('content');
  const [selectedVisualElement, setSelectedVisualElement] = useState<{ path: string; linkPath?: string; kind: 'text' | 'image' | 'link'; text?: string; src?: string; alt?: string; href?: string; rect?: { left: number; top: number; width: number; height: number } } | null>(null);
  const previewFrame = useRef<HTMLIFrameElement>(null);
  const [visualExpanded, setVisualExpanded] = useState(false);
  const [treeCollapsed, setTreeCollapsed] = useState(false);
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const [editorModeActive, setEditorModeActive] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [focusInspector, setFocusInspector] = useState(false);
  const previewCanvas = useRef<HTMLDivElement>(null);
  const [selectedPage, setSelectedPage] = useState(0);
  const [pageSearchQuery, setPageSearchQuery] = useState('');
  const [pageTabMode, setPageTabMode] = useState<'pillars' | 'cms' | 'all-routes'>('pillars');
  const [expandedPillars, setExpandedPillars] = useState<Record<string, boolean>>({
    accueil: true,
    methode: true,
    vision: true,
    diagnostic: true,
    'plan-strategique': true,
    'axe-1': true,
    'axe-2': true,
    'axe-3': true,
    'axe-4': true,
  });
  const togglePillar = (id: string) => {
    setExpandedPillars((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const [selectedPsdAxis, setSelectedPsdAxis] = useState<'axe1' | 'axe2' | 'axe3' | 'axe4'>('axe1');
  const [user, setUser] = useState<{ login: string; avatar_url?: string } | null>(() => {
    if (typeof window !== 'undefined') {
      if (
        window.sessionStorage.getItem('lfjp_admin_local_session') === '1' ||
        window.location.hostname.includes('run.app') ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      ) {
        return { login: 'direction-lfjp', avatar_url: 'https://i.imgur.com/0YmGlXO.png' };
      }
    }
    return null;
  });
  const [authorizedUsers, setAuthorizedUsers] = useState<string[]>(['direction-lfjp', 'informatique-cmd']);
  const [authChecked, setAuthChecked] = useState(() => {
    return typeof window !== 'undefined' && (
      window.sessionStorage.getItem('lfjp_admin_local_session') === '1' ||
      window.location.hostname.includes('run.app') ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
  });
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pullRequest, setPullRequest] = useState<{ number: number; url: string } | null>(null);

  // =========================================================================
  // USER PROFILES & AUTH ROLES (SuperAdmin, Admin vs Simple Editor)
  // =========================================================================
  const [configuredAccounts, setConfiguredAccounts] = useState<UserAccount[]>(loadConfiguredAccounts);
  const [userProfile, setUserProfile] = useState<UserProfile>(loadActiveUserProfile);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'login' | 'manage'>('login');
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editFormEmail, setEditFormEmail] = useState('');
  const [editFormPassword, setEditFormPassword] = useState('');
  const [editFormName, setEditFormName] = useState('');

  const superAdminAccount = configuredAccounts.find((a) => a.id === 'superadmin') || defaultAccounts[0];
  const editorAccount = configuredAccounts.find((a) => a.id === 'editor') || defaultAccounts[1];
  const adminAccount = superAdminAccount;

  const [loginEmail, setLoginEmail] = useState(editorAccount.email);
  const [loginPassword, setLoginPassword] = useState(editorAccount.password);

  const [gateTab, setGateTab] = useState<'editor' | 'superadmin'>('editor');
  const [gateEmail, setGateEmail] = useState(editorAccount.email);
  const [gatePassword, setGatePassword] = useState(editorAccount.password);
  const [gateError, setGateError] = useState('');
  const [showGatePassword, setShowGatePassword] = useState(false);

  const canDelete = userProfile.canDelete && (userProfile.role === 'admin' || userProfile.role === 'superadmin');
  const canPublish = Boolean(userProfile.canPublish) || userProfile.role === 'admin' || userProfile.role === 'superadmin';

  const assertCanDelete = (actionName = 'cette action'): boolean => {
    if (!canDelete) {
      setStatus(`⚠️ Action bloquée : Le profil « ${userProfile.name} » (${userProfile.email}) permet de consulter et modifier les données, mais la suppression est strictement désactivée. Connectez-vous avec le profil Administrateur (${adminAccount.email}) pour supprimer.`);
      return false;
    }
    return true;
  };

  const switchUserProfile = (targetProfile: UserProfile) => {
    setUserProfile(targetProfile);
    saveActiveUserProfile(targetProfile);
    setIsProfileModalOpen(false);
    setStatus(`Profil actif : ${targetProfile.name} (${targetProfile.role === 'admin' || targetProfile.role === 'superadmin' ? 'Administrateur – Tous droits' : 'Éditeur Simple – Modification sans suppression'}).`);
  };

  const handleUpdateAccountCredentials = (accountId: string, newEmail: string, newPassword: string, newName?: string) => {
    if (!newEmail.trim()) {
      setStatus('⚠️ Veuillez spécifier une adresse email valide.');
      return;
    }
    const updated = configuredAccounts.map((acc) => {
      if (acc.id === accountId) {
        return {
          ...acc,
          email: newEmail.trim(),
          password: newPassword.trim() || acc.password,
          name: newName?.trim() || acc.name,
        };
      }
      return acc;
    });
    setConfiguredAccounts(updated);
    saveConfiguredAccounts(updated);

    // If current profile was the one edited, synchronize active profile immediately
    if (userProfile.id === accountId || (accountId === 'admin' && userProfile.role === 'admin') || (accountId === 'editor' && userProfile.role === 'editor')) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        email: newEmail.trim(),
        name: newName?.trim() || userProfile.name,
      };
      setUserProfile(updatedProfile);
      saveActiveUserProfile(updatedProfile);
    }

    setEditingAccountId(null);
    setStatus(`✅ Identifiants mis à jour : Nouveau email « ${newEmail.trim()} ». Ce profil peut désormais se connecter avec ce nouvel identifiant.`);
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const userFound = authenticateUser(loginEmail, loginPassword);
    if (userFound) {
      const newProfile: UserProfile = {
        id: userFound.id,
        email: userFound.email,
        name: userFound.name,
        role: userFound.role,
        canDelete: userFound.canDelete,
        canEdit: userFound.canEdit,
        canCreate: userFound.canCreate,
        canPublish: userFound.canPublish,
      };
      switchUserProfile(newProfile);
      setStatus(`Connexion réussie : Bienvenue ${newProfile.name} (${newProfile.email}).`);
    } else {
      setStatus(`⚠️ Identifiants incorrects pour « ${loginEmail} ». Vérifiez l'adresse email ou le mot de passe.`);
    }
  };

  // =========================================================================
  // VERCEL WORKFLOW: ÉDITEUR DRAFT & SUPERADMIN VALIDATION
  // =========================================================================
  const [pendingDeployment, setPendingDeployment] = useState<PendingDeploymentRequest | null>(loadPendingDeploymentRequest);
  const [isEditorDeployModalOpen, setIsEditorDeployModalOpen] = useState(false);
  const [editorDeployNotes, setEditorDeployNotes] = useState('');
  const [isSuperAdminDeployModalOpen, setIsSuperAdminDeployModalOpen] = useState(false);
  const [superAdminDeployNotes, setSuperAdminDeployNotes] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [dismissedBannerId, setDismissedBannerId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage.getItem('lfjp_dismissed_deployment_banner');
  });

  useEffect(() => {
    const handler = (e?: Event) => {
      const custom = e as CustomEvent<PendingDeploymentRequest | null>;
      if (custom && 'detail' in custom) {
        setPendingDeployment(custom.detail);
      } else {
        setPendingDeployment(loadPendingDeploymentRequest());
      }
    };
    window.addEventListener('lfjp_deployment_workflow_changed', handler);
    window.addEventListener('storage', handler);

    // Initial server fetch and recurring 3.5s polling for cross-browser synchronization
    const syncServer = () => {
      fetchPendingDeploymentFromServer().then((req) => {
        setPendingDeployment(req);
      });
    };
    syncServer();
    const pollInterval = window.setInterval(syncServer, 3500);

    return () => {
      window.removeEventListener('lfjp_deployment_workflow_changed', handler);
      window.removeEventListener('storage', handler);
      window.clearInterval(pollInterval);
    };
  }, []);

  const handleEditorSubmitForDeploy = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveDraft();
    const currentDraftText = window.localStorage.getItem(pageTextDraftStorageKey) || pageTextJson;
    const currentDraftData = window.localStorage.getItem(pageDataDraftStorageKey) || pageDataJson;
    const currentDraftContent = window.localStorage.getItem(draftStorageKey) || serializedContent;
    const currentDraftPages = window.localStorage.getItem(pagesDraftStorageKey) || serializedPages;

    const req = submitEditorDraft(
      userProfile.email,
      userProfile.name,
      editorDeployNotes,
      {
        siteContent: currentDraftContent,
        pages: currentDraftPages,
        pageData: currentDraftData,
        pageText: currentDraftText,
      }
    );
    setPendingDeployment(req);
    setDismissedBannerId(null);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('lfjp_dismissed_deployment_banner');
    }
    setIsEditorDeployModalOpen(false);
    setEditorDeployNotes('');
    setStatus('✅ Modifications transmises pour déploiement Vercel ! En attente de validation par le SuperAdmin.');
  };

  const handleAdminApproveAndDeploy = async () => {
    if (!pendingDeployment) return;
    setIsSaving(true);
    setStatus('⏳ Validation des modifications et déploiement vers Vercel (branche principale)...');
    try {
      await createPullRequest(true, pendingDeployment.draftFiles);
      approveDeploymentRequest(pendingDeployment.id, userProfile.email);
      setPendingDeployment(loadPendingDeploymentRequest());
      clearAllDraftStorage();
      setStatus('🚀 Modifications publiées et déploiement Vercel lancé avec succès ! Un commit unique a été envoyé sur main. Le site en direct est actualisé pour tous les navigateurs.');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Échec du déploiement GitHub / Vercel.';
      setStatus(`❌ Échec du déploiement : ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdminReject = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pendingDeployment) return;
    rejectDeploymentRequest(pendingDeployment.id, rejectFeedback, userProfile.email);
    setPendingDeployment(loadPendingDeploymentRequest());
    setIsRejectModalOpen(false);
    setRejectFeedback('');
    setStatus('Demande de déploiement rejetée. Les remarques ont été enregistrées pour l’éditeur.');
  };

  const handleSuperAdminDirectDeploy = async () => {
    setIsSaving(true);
    setStatus('⏳ Publication directe et déploiement vers Vercel (branche principale)...');
    try {
      saveDraft();
      const payloadFiles = {
        siteContent: serializedContent,
        pages: serializedPages,
        pageData: pageDataJson,
        pageText: pageTextJson,
      };
      await createPullRequest(true, payloadFiles);
      if (pendingDeployment) {
        approveDeploymentRequest(pendingDeployment.id, userProfile.email);
        setPendingDeployment(loadPendingDeploymentRequest());
      }
      setIsSuperAdminDeployModalOpen(false);
      setSuperAdminDeployNotes('');
      setStatus('🚀 Déploiement Vercel réussi ! Toutes vos modifications (rubriques, pages, données) ont été publiées sur la branche main. Vercel met à jour le site psd-lfjp.vercel.app.');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Échec du déploiement GitHub / Vercel.';
      setStatus(`❌ Échec du déploiement : ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================================
  // DYNAMIC RUBRIQUES MANAGEMENT (Ajouter, Modifier, Supprimer, Copier, Classer)
  // =========================================================================
  const [rubriques, setRubriques] = useState<AdminRubrique[]>(loadRubriquesDraft);
  const [isRubriqueModalOpen, setIsRubriqueModalOpen] = useState(false);
  const [rubriqueModalMode, setRubriqueModalMode] = useState<'create' | 'edit' | 'order'>('create');
  const [editingRubriqueId, setEditingRubriqueId] = useState<string | null>(null);
  const [rubriquePlacement, setRubriquePlacement] = useState<string>('last');
  const [rubriqueForm, setRubriqueForm] = useState<Partial<AdminRubrique>>({
    name: '',
    path: '',
    badge: '',
    description: '',
    iconName: 'Sparkles',
  });

  const saveAndSetRubriques = (updater: (prev: AdminRubrique[]) => AdminRubrique[]) => {
    setRubriques((prev) => {
      const updated = updater(prev).map((r, i) => ({ ...r, order: i + 1 }));
      saveRubriquesDraft(updated);
      return updated;
    });
  };

  const openCreateRubriqueModal = (suggestedPlacement = 'last') => {
    setRubriqueModalMode('create');
    setEditingRubriqueId(null);
    setRubriquePlacement(suggestedPlacement);
    const count = rubriques.length + 1;
    setRubriqueForm({
      name: '',
      path: `/rubrique-${count}`,
      badge: `Rubrique ${count}`,
      description: 'Présentation et fiches de cette rubrique.',
      iconName: 'Sparkles',
    });
    setIsRubriqueModalOpen(true);
  };

  const openEditRubriqueModal = (rubrique: AdminRubrique) => {
    setRubriqueModalMode('edit');
    setEditingRubriqueId(rubrique.id);
    setRubriqueForm({
      name: rubrique.name,
      path: rubrique.path,
      badge: rubrique.badge,
      description: rubrique.description,
      iconName: rubrique.iconName,
    });
    setIsRubriqueModalOpen(true);
  };

  const handleSaveRubrique = () => {
    if (!rubriqueForm.name?.trim()) {
      setStatus('Veuillez renseigner un nom pour la rubrique.');
      return;
    }

    if (rubriqueModalMode === 'edit' && editingRubriqueId) {
      saveAndSetRubriques((prev) =>
        prev.map((r) => (r.id === editingRubriqueId ? { ...r, ...rubriqueForm } : r))
      );
      setIsRubriqueModalOpen(false);
      setStatus(`Rubrique « ${rubriqueForm.name} » mise à jour.`);
      return;
    }

    // Creating new rubrique
    const baseId = (rubriqueForm.name || 'rubrique')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `rubrique-${Date.now()}`;

    let id = baseId;
    let suffix = 2;
    while (rubriques.some((r) => r.id === id)) {
      id = `${baseId}-${suffix++}`;
    }

    const rawPath = rubriqueForm.path?.trim() || `/${id}`;
    const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;

    const newRubrique: AdminRubrique = {
      id,
      name: rubriqueForm.name.trim(),
      path: cleanPath,
      badge: rubriqueForm.badge?.trim() || `Rubrique ${rubriques.length + 1}`,
      description: rubriqueForm.description?.trim() || 'Contenus et sous-pages rattachés.',
      iconName: rubriqueForm.iconName || 'Sparkles',
      isOfficial: false,
      order: rubriques.length + 1,
    };

    saveAndSetRubriques((prev) => {
      const list = [...prev];
      if (rubriquePlacement === 'first') {
        list.unshift(newRubrique);
      } else if (rubriquePlacement === 'last') {
        list.push(newRubrique);
      } else if (rubriquePlacement.startsWith('after:')) {
        const targetId = rubriquePlacement.replace('after:', '');
        const targetIdx = list.findIndex((r) => r.id === targetId);
        if (targetIdx !== -1) {
          list.splice(targetIdx + 1, 0, newRubrique);
        } else {
          list.push(newRubrique);
        }
      } else {
        list.push(newRubrique);
      }
      return list;
    });

    if (!pages.some((p) => normalizePageSlug(p.slug) === normalizePageSlug(cleanPath))) {
      const newPage: ManagedPage = {
        slug: cleanPath,
        title: newRubrique.name,
        description: newRubrique.description,
        showInNavigation: true,
        order: pages.length + 1,
        blocks: [
          { type: 'heading', level: 2, text: newRubrique.name },
          { type: 'paragraph', text: newRubrique.description },
          { type: 'callout', title: 'Points clés', text: 'Présentation des enjeux et objectifs de cette rubrique.', tone: 'blue' },
        ],
      };
      setPages((curr) => [...curr, newPage]);
    }

    setIsRubriqueModalOpen(false);
    setStatus(`Rubrique « ${newRubrique.name} » créée avec succès.`);
    setActiveSection(`rubrique-${newRubrique.id}`);
  };

  const duplicateRubrique = (id: string) => {
    const source = rubriques.find((r) => r.id === id);
    if (!source) return;
    const copyId = `${source.id}-copie-${Date.now().toString().slice(-4)}`;
    const copyName = `${source.name} (Copie)`;
    const copyPath = `${source.path === '/' ? '/accueil' : source.path}-copie`;

    const copyItem: AdminRubrique = {
      ...source,
      id: copyId,
      name: copyName,
      path: copyPath,
      badge: `${source.badge} (Copie)`,
      isOfficial: false,
      order: source.order + 1,
    };

    saveAndSetRubriques((prev) => {
      const list = [...prev];
      const idx = list.findIndex((r) => r.id === id);
      if (idx !== -1) {
        list.splice(idx + 1, 0, copyItem);
      } else {
        list.push(copyItem);
      }
      return list;
    });

    const sourcePage = pages.find((p) => normalizePageSlug(p.slug) === normalizePageSlug(source.path));
    if (sourcePage) {
      const newPage: ManagedPage = {
        ...sourcePage,
        slug: copyPath,
        title: copyName,
        order: pages.length + 1,
        blocks: sourcePage.blocks.map((b) => ({ ...b })),
      };
      setPages((curr) => [...curr, newPage]);
    }

    setStatus(`Rubrique « ${source.name} » dupliquée avec succès.`);
    setActiveSection(`rubrique-${copyId}`);
  };

  const deleteRubrique = (id: string) => {
    if (!assertCanDelete('la suppression d’une rubrique')) return;
    const target = rubriques.find((r) => r.id === id);
    if (!target) return;
    if (!window.confirm(`Supprimer définitivement la rubrique « ${target.name} » (${target.path}) ?`)) return;

    saveAndSetRubriques((prev) => prev.filter((r) => r.id !== id));
    setStatus(`Rubrique « ${target.name} » supprimée.`);
    setActiveSection('dashboard');
  };

  const moveRubrique = (id: string, direction: -1 | 1) => {
    saveAndSetRubriques((prev) => {
      const list = [...prev];
      const idx = list.findIndex((r) => r.id === id);
      if (idx === -1) return list;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= list.length) return list;
      const [item] = list.splice(idx, 1);
      list.splice(targetIdx, 0, item);
      return list;
    });
    setStatus('Ordre des rubriques mis à jour.');
  };

  const moveRubriqueAfter = (sourceId: string, afterTarget: string) => {
    saveAndSetRubriques((prev) => {
      const list = [...prev];
      const srcIdx = list.findIndex((r) => r.id === sourceId);
      if (srcIdx === -1) return list;
      const [item] = list.splice(srcIdx, 1);
      if (afterTarget === 'first') {
        list.unshift(item);
      } else if (afterTarget === 'last') {
        list.push(item);
      } else {
        const destIdx = list.findIndex((r) => r.id === afterTarget);
        if (destIdx !== -1) {
          list.splice(destIdx + 1, 0, item);
        } else {
          list.push(item);
        }
      }
      return list;
    });
    setStatus('Rubrique repositionnée.');
  };

  const dynamicNavigationGroups = useMemo(() => [
    {
      group: 'TABLEAU DE BORD',
      items: [
        { id: 'dashboard', label: 'Vue d’ensemble', description: 'Arborescence & accès direct à toutes les rubriques', Icon: HomeIcon },
      ],
    },
    {
      group: `LES RUBRIQUES DU SITE (${rubriques.length})`,
      items: rubriques.map((r, i) => {
        const IconComp = RUBRIQUE_ICONS[r.iconName] || Sparkles;
        return {
          id: `rubrique-${r.id}`,
          label: `${i + 1}. ${r.name}`,
          description: r.description,
          Icon: IconComp,
          badge: r.path,
        };
      }),
    },
    {
      group: 'GESTION AVANCÉE DES PAGES',
      items: [
        { id: 'pages', label: 'Constructeur de Pages & Blocs', description: 'Arborescence libre, hiérarchie et blocs riches', Icon: FileText },
        { id: 'edition-visuelle', label: 'Édition In-Situ (Aperçu)', description: 'Modifier directement sur la prévisualisation', Icon: Pencil },
      ],
    },
    {
      group: 'PARAMÈTRES & DÉPLOIEMENT',
      items: [
        { id: 'identite', label: 'Identité & Pied de page', description: 'Logo, nom, contacts et copyright', Icon: Globe2 },
        { id: 'publication', label: 'Publication GitHub & Vercel', description: 'Brouillon, sauvegarde & mise en ligne', Icon: Send },
        { id: 'acces', label: 'Profils & Comptes Administrateurs', description: 'Gérer les profils Admin et Éditeur Simple', Icon: UsersRound },
      ],
    },
  ], [rubriques]);

  const enterLocalAdminSession = (specificRole?: 'admin' | 'editor' | 'superadmin') => {
    const role = specificRole || 'admin';
    const matchingAccount = configuredAccounts.find((a) => a.role === role) || (role === 'editor' ? defaultAccounts[2] : defaultAccounts[1]);
    const targetProfile: UserProfile = {
      id: matchingAccount.id,
      email: matchingAccount.email,
      name: matchingAccount.name,
      role: matchingAccount.role,
      canDelete: matchingAccount.canDelete,
      canEdit: matchingAccount.canEdit,
      canCreate: matchingAccount.canCreate,
      canPublish: matchingAccount.canPublish,
    };
    setUserProfile(targetProfile);
    saveActiveUserProfile(targetProfile);
    const sessionUser = { login: matchingAccount.email, avatar_url: 'https://i.imgur.com/0YmGlXO.png' };
    setUser(sessionUser);
    setAuthorizedUsers(['direction-lfjp', 'informatique-cmd', matchingAccount.email]);
    window.sessionStorage.setItem('lfjp_admin_local_session', '1');
    window.localStorage.setItem('lfjp_admin_active_session', '1');
    window.localStorage.setItem('lfjp_preview_active', '1');
    setAuthChecked(true);
    setStatus(`Session active en tant que ${targetProfile.name} (${targetProfile.email}).`);
    window.dispatchEvent(new Event('lfjp_auth_changed'));
  };

  const handleGateLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGateError('');
    const userFound = authenticateUser(gateEmail, gatePassword);
    if (userFound) {
      const isSuper = userFound.role === 'superadmin' || userFound.id === 'superadmin' || userFound.email === 'informatique@lfjpsaly.org';
      const newProfile: UserProfile = {
        id: userFound.id,
        email: userFound.email,
        name: userFound.name,
        role: isSuper ? 'superadmin' : userFound.role,
        canDelete: isSuper ? true : userFound.canDelete,
        canEdit: true,
        canCreate: true,
        canPublish: true,
      };
      setUserProfile(newProfile);
      saveActiveUserProfile(newProfile);
      setUser({ login: newProfile.email, avatar_url: 'https://i.imgur.com/0YmGlXO.png' });
      setAuthorizedUsers(['direction-lfjp', 'informatique-cmd', newProfile.email]);
      window.sessionStorage.setItem('lfjp_admin_local_session', '1');
      window.localStorage.setItem('lfjp_admin_active_session', '1');
      setGateError('');
      setVisualRoute('/');
      setEditorModeActive(false);
      setStatus(`Connexion réussie : Bienvenue ${newProfile.name} (${newProfile.email}).`);
      window.dispatchEvent(new Event('lfjp_auth_changed'));
    } else {
      setGateError(`Identifiant ou mot de passe incorrect pour « ${gateEmail} ». Vérifiez l'adresse ou le mot de passe.`);
    }
  };

  const logout = async () => {
    window.sessionStorage.removeItem('lfjp_admin_local_session');
    window.localStorage.removeItem('lfjp_admin_active_session');
    window.localStorage.removeItem('lfjp_preview_active');
    window.localStorage.removeItem('lfjp-admin-auth-user-v4');
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      void err;
    }
    setUser(null);
    setUserProfile(defaultAccounts[0]);
    setVisualRoute('/');
    setEditorModeActive(false);
    setStatus('Vous êtes déconnecté de l’espace d’administration.');
    window.dispatchEvent(new Event('lfjp_auth_changed'));
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setAuthorizedUsers(Array.isArray(data?.authorizedUsers) ? data.authorizedUsers : []);
          const superAdminProfile: UserProfile = {
            id: 'superadmin',
            email: 'informatique@lfjpsaly.org',
            name: `SuperAdmin (${data.user.login})`,
            role: 'superadmin',
            canDelete: true,
            canEdit: true,
            canCreate: true,
            canPublish: true,
            githubLogin: data.user.login,
          };
          setUserProfile(superAdminProfile);
          saveActiveUserProfile(superAdminProfile);
          setVisualRoute('/');
          setEditorModeActive(false);
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    const receiveSelection = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== previewFrame.current?.contentWindow) return;
      if (event.data?.type === 'lfjp-route-change' && typeof event.data.path === 'string') {
        setVisualRoute(event.data.path);
        setSelectedVisualElement(null);
        return;
      }
      if (event.data?.type !== 'lfjp-cms-select' || event.data.page !== visualRoute || !isRecord(event.data.selection)) return;
      const selection = event.data.selection;
      if (typeof selection.path !== 'string' || !['text', 'image', 'link'].includes(String(selection.kind))) return;
      const rect = selection.rect as { left: number; top: number; width: number; height: number } | undefined;
      const frameRect = previewFrame.current?.getBoundingClientRect();
      const canvasRect = previewCanvas.current?.getBoundingClientRect();
      const relativeRect = rect && frameRect && canvasRect ? {
        ...rect,
        left: rect.left + frameRect.left - canvasRect.left,
        top: rect.top + frameRect.top - canvasRect.top,
      } : rect;
      setSelectedVisualElement({ ...selection, rect: relativeRect } as { path: string; linkPath?: string; kind: 'text' | 'image' | 'link'; text?: string; src?: string; alt?: string; href?: string; rect?: { left: number; top: number; width: number; height: number } });
    };
    window.addEventListener('message', receiveSelection);
    return () => window.removeEventListener('message', receiveSelection);
  }, [visualRoute]);

  useEffect(() => {
    const syncVisualDraft = (event: StorageEvent) => {
      if (event.key === pageTextDraftStorageKey && event.newValue) setPageTextJson(event.newValue);
    };
    window.addEventListener('storage', syncVisualDraft);
    return () => window.removeEventListener('storage', syncVisualDraft);
  }, []);

  useEffect(() => {
    const knownPaths = new Set(Object.keys(breadcrumbRoutes));
    setPages((current) => {
      const existingPaths = new Set(current.map((page) => normalizePageSlug(page.slug)));
      const recoveredPages = content.home.cards
        .map((card) => ({ ...card, path: normalizePageSlug(card.path) }))
        .filter((card) => card.path !== '/' && !knownPaths.has(card.path) && !existingPaths.has(card.path))
        .map((card): ManagedPage => ({
          slug: card.path,
          title: card.title,
          description: card.description,
          showInNavigation: true,
          blocks: [{ type: 'paragraph', text: card.description }],
        }));
      return recoveredPages.length ? [...current, ...recoveredPages] : current;
    });
  }, [content.home.cards]);

  const serializedContent = useMemo(() => JSON.stringify(content, null, 2), [content]);
  const serializedPages = useMemo(() => JSON.stringify({ pages }, null, 2), [pages]);
  const persistPageData = (next: Record<string, unknown>) => {
    const serialized = JSON.stringify(next, null, 2);
    setPageDataJson(serialized);
    window.localStorage.setItem(pageDataDraftStorageKey, serialized);
  };

  const updateHome = (field: keyof Content['home'], value: string) => {
    setContent((current) => ({ ...current, home: { ...current.home, [field]: value } }));
  };

  const updateSite = (field: keyof Content['site'], value: string | number) => {
    setContent((current) => ({ ...current, site: { ...current.site, [field]: field === 'logoUrl' && typeof value === 'string' ? normalizeMediaUrl(value) : value } }));
  };

  const updateVisionParagraph = (index: number, value: string) => {
    setContent((current) => ({
      ...current,
      visionMissionsValeurs: {
        ...current.visionMissionsValeurs,
        vision: current.visionMissionsValeurs.vision.map((item, itemIndex) => itemIndex === index ? value : item),
      },
    }));
  };

  const updateMission = (index: number, value: string) => {
    setContent((current) => ({
      ...current,
      visionMissionsValeurs: {
        ...current.visionMissionsValeurs,
        missions: current.visionMissionsValeurs.missions.map((item, itemIndex) => itemIndex === index ? value : item),
      },
    }));
  };

  const updateValue = (index: number, field: 'name' | 'description', value: string) => {
    setContent((current) => ({
      ...current,
      visionMissionsValeurs: {
        ...current.visionMissionsValeurs,
        values: current.visionMissionsValeurs.values.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
      },
    }));
  };

  const moveVisionParagraph = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= content.visionMissionsValeurs.vision.length) return;
    setContent((c) => {
      const arr = [...c.visionMissionsValeurs.vision];
      const [item] = arr.splice(index, 1);
      arr.splice(target, 0, item);
      return { ...c, visionMissionsValeurs: { ...c.visionMissionsValeurs, vision: arr } };
    });
    setStatus('Ordre des paragraphes de vision mis à jour.');
  };

  const moveMission = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= content.visionMissionsValeurs.missions.length) return;
    setContent((c) => {
      const arr = [...c.visionMissionsValeurs.missions];
      const [item] = arr.splice(index, 1);
      arr.splice(target, 0, item);
      return { ...c, visionMissionsValeurs: { ...c.visionMissionsValeurs, missions: arr } };
    });
    setStatus('Ordre des missions mis à jour.');
  };

  const duplicateMission = (index: number) => {
    const source = content.visionMissionsValeurs.missions[index];
    if (!source) return;
    setContent((c) => {
      const arr = [...c.visionMissionsValeurs.missions];
      arr.splice(index + 1, 0, `${source} (copie)`);
      return { ...c, visionMissionsValeurs: { ...c.visionMissionsValeurs, missions: arr } };
    });
    setStatus('Mission dupliquée.');
  };

  const moveValue = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= content.visionMissionsValeurs.values.length) return;
    setContent((c) => {
      const arr = [...c.visionMissionsValeurs.values];
      const [item] = arr.splice(index, 1);
      arr.splice(target, 0, item);
      return { ...c, visionMissionsValeurs: { ...c.visionMissionsValeurs, values: arr } };
    });
    setStatus('Ordre des valeurs mis à jour.');
  };

  const duplicateValue = (index: number) => {
    const source = content.visionMissionsValeurs.values[index];
    if (!source) return;
    setContent((c) => {
      const arr = [...c.visionMissionsValeurs.values];
      arr.splice(index + 1, 0, {
        ...source,
        name: `${source.name} (copie)`,
      });
      return { ...c, visionMissionsValeurs: { ...c.visionMissionsValeurs, values: arr } };
    });
    setStatus('Valeur dupliquée.');
  };

  const updateCard = (index: number, field: keyof Content['home']['cards'][number], value: string) => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        cards: current.home.cards.map((card, cardIndex) => cardIndex === index ? { ...card, [field]: field === 'image' ? normalizeMediaUrl(value) : value } : card),
      },
    }));
  };

  const updateCardStyle = (index: number, patch: Partial<TextStyle>) => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        cards: current.home.cards.map((card, cardIndex) => cardIndex === index ? { ...card, style: { ...card.style, ...patch } } : card),
      },
    }));
  };

  const addCard = () => {
    const baseSlug = '/nouvelle-rubrique';
    let slug = baseSlug;
    let suffix = 2;
    while (pages.some((page) => normalizePageSlug(page.slug) === slug)) slug = `${baseSlug}-${suffix++}`;
    const page: ManagedPage = {
      slug,
      title: 'Nouvelle rubrique',
      description: 'Décrivez cette rubrique.',
      showInNavigation: true,
      blocks: [{ type: 'paragraph', text: 'Écrivez votre contenu ici.' }],
    };
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        cards: [...current.home.cards, {
          title: 'Nouvelle rubrique',
          description: 'Décrivez cette rubrique.',
          linkLabel: 'Découvrir',
          path: slug,
          image: '',
        }],
      },
    }));
    setPages((current) => [...current, page]);
    setSelectedPage(pages.length);
    setStatus(`Rubrique et page créées : ${slug}. Modifiez la page dans la section Pages personnalisées.`);
  };

  const removeCard = (index: number) => {
    if (!assertCanDelete('la suppression d’une carte d’accueil')) return;
    setContent((current) => ({
      ...current,
      home: { ...current.home, cards: current.home.cards.filter((_, cardIndex) => cardIndex !== index) },
    }));
  };

  const updateMessage = (index: number, field: 'title' | 'eyebrow' | 'image' | 'imageAlt' | 'wide', value: string | boolean) => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        messages: current.home.messages.map((message, messageIndex) =>
          messageIndex === index ? { ...message, [field]: field === 'image' && typeof value === 'string' ? normalizeMediaUrl(value) : value } : message
        ),
      },
    }));
  };

  const updateMessageArray = (index: number, field: 'paragraphs' | 'signature', itemIndex: number, value: string) => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        messages: current.home.messages.map((message, messageIndex) => (
          messageIndex === index
            ? { ...message, [field]: message[field].map((item, currentIndex) => currentIndex === itemIndex ? value : item) }
            : message
        )),
      },
    }));
  };

  const addMessageArrayItem = (index: number, field: 'paragraphs' | 'signature') => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        messages: current.home.messages.map((message, messageIndex) => (
          messageIndex === index ? { ...message, [field]: [...message[field], ''] } : message
        )),
      },
    }));
  };

  const removeMessageArrayItem = (index: number, field: 'paragraphs' | 'signature', itemIndex: number) => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        messages: current.home.messages.map((message, messageIndex) => (
          messageIndex === index
            ? { ...message, [field]: message[field].filter((_, currentIndex) => currentIndex !== itemIndex) }
            : message
        )),
      },
    }));
  };

  const moveCard = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= content.home.cards.length) return;
    setContent((c) => {
      const arr = [...c.home.cards];
      const [item] = arr.splice(index, 1);
      arr.splice(target, 0, item);
      return { ...c, home: { ...c.home, cards: arr } };
    });
    setStatus('Ordre des rubriques modifié.');
  };

  const duplicateCard = (index: number) => {
    const source = content.home.cards[index];
    if (!source) return;
    setContent((c) => {
      const arr = [...c.home.cards];
      arr.splice(index + 1, 0, {
        ...source,
        title: `${source.title} (copie)`,
        path: `${source.path}-copie`,
      });
      return { ...c, home: { ...c.home, cards: arr } };
    });
    setStatus('Rubrique dupliquée.');
  };

  const addMessage = () => {
    setContent((c) => ({
      ...c,
      home: {
        ...c.home,
        messages: [
          ...c.home.messages,
          {
            eyebrow: 'Nouvelle communication',
            title: 'Titre du mot ou message',
            image: '',
            imageAlt: 'Image de présentation',
            paragraphs: ['Écrivez le contenu du message ici.'],
            signature: ['L’équipe de direction', 'LFJP Saly'],
            wide: false,
          },
        ],
      },
    }));
    setStatus('Nouveau message ajouté.');
  };

  const removeMessage = (index: number) => {
    if (!assertCanDelete('la suppression d’un message')) return;
    if (!window.confirm(`Supprimer le message « ${content.home.messages[index]?.title || 'Message'} » ?`)) return;
    setContent((c) => ({
      ...c,
      home: {
        ...c.home,
        messages: c.home.messages.filter((_, i) => i !== index),
      },
    }));
    setStatus('Message supprimé.');
  };

  const moveMessage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= content.home.messages.length) return;
    setContent((c) => {
      const arr = [...c.home.messages];
      const [item] = arr.splice(index, 1);
      arr.splice(target, 0, item);
      return { ...c, home: { ...c.home, messages: arr } };
    });
    setStatus('Ordre des messages modifié.');
  };

  const duplicateMessage = (index: number) => {
    const source = content.home.messages[index];
    if (!source) return;
    setContent((c) => {
      const arr = [...c.home.messages];
      arr.splice(index + 1, 0, {
        ...source,
        title: `${source.title} (copie)`,
        paragraphs: [...source.paragraphs],
        signature: [...source.signature],
      });
      return { ...c, home: { ...c.home, messages: arr } };
    });
    setStatus('Message dupliqué.');
  };

  const moveTimelineAction = (axis: string, actionIndex: number, direction: -1 | 1) => updateEditablePageData((data) => {
    const timelines = data.psdTimelines as Record<string, Record<string, unknown>>;
    const timeline = timelines[axis];
    if (!timeline) return data;
    const actions = [...(timeline.actions as Record<string, unknown>[])];
    const target = actionIndex + direction;
    if (target < 0 || target >= actions.length) return data;
    const [item] = actions.splice(actionIndex, 1);
    actions.splice(target, 0, item);
    return { ...data, psdTimelines: { ...timelines, [axis]: { ...timeline, actions } } };
  });

  const duplicateTimelineAction = (axis: string, actionIndex: number) => updateEditablePageData((data) => {
    const timelines = data.psdTimelines as Record<string, Record<string, unknown>>;
    const timeline = timelines[axis];
    if (!timeline) return data;
    const actions = [...(timeline.actions as Record<string, unknown>[])];
    const source = actions[actionIndex];
    if (!source) return data;
    actions.splice(actionIndex + 1, 0, {
      ...source,
      title: `${source.title} (copie)`,
    });
    return { ...data, psdTimelines: { ...timelines, [axis]: { ...timeline, actions } } };
  });

  const exportJsonFiles = () => {
    try {
      const files: Record<string, string> = {
        'siteContent.json': serializedContent,
        'pages.json': serializedPages,
        'pageData.json': pageDataJson,
        'pageText.json': pageTextJson,
      };
      Object.entries(files).forEach(([filename, jsonString]) => {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
      setStatus('Fichiers JSON téléchargés pour sauvegarde locale.');
    } catch {
      setStatus('Impossible de préparer le téléchargement.');
    }
  };

  const importJsonBackup = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result);
        const parsed = JSON.parse(text);
        if (file.name.includes('siteContent') || (parsed.site && parsed.home)) {
          setContent(parsed);
          window.localStorage.setItem(draftStorageKey, JSON.stringify(parsed, null, 2));
          setStatus('Fichier siteContent.json restauré avec succès dans le brouillon !');
        } else if (file.name.includes('pages') || Array.isArray(parsed.pages)) {
          setPages(parsed.pages);
          window.localStorage.setItem(pagesDraftStorageKey, JSON.stringify(parsed, null, 2));
          setStatus('Fichier pages.json restauré avec succès dans le brouillon !');
        } else if (file.name.includes('pageData') || parsed.bacBlancSchedule) {
          setPageDataJson(JSON.stringify(parsed, null, 2));
          window.localStorage.setItem(pageDataDraftStorageKey, JSON.stringify(parsed, null, 2));
          setStatus('Fichier pageData.json restauré avec succès dans le brouillon !');
        } else if (file.name.includes('pageText')) {
          setPageTextJson(JSON.stringify(parsed, null, 2));
          window.localStorage.setItem(pageTextDraftStorageKey, JSON.stringify(parsed, null, 2));
          setStatus('Fichier pageText.json restauré avec succès dans le brouillon !');
        } else {
          setStatus('Format de fichier JSON non reconnu.');
        }
      } catch {
        setStatus('Erreur lors de la lecture du fichier JSON.');
      }
    };
    reader.readAsText(file);
  };

  const createPullRequest = async (
    directDeploy: boolean = false,
    customFiles?: { siteContent?: string; pages?: string; pageData?: string; pageText?: string }
  ) => {
    setIsSaving(true);
    setStatus('');
    try {
      const currentPagesList = [...pages];
      const managedPaths = new Set(currentPagesList.map((page) => normalizePageSlug(page.slug)));
      const knownPaths = new Set(Object.keys(breadcrumbRoutes));

      // Auto-ensure any card or rubrique path has a corresponding ManagedPage
      content.home.cards.forEach((card) => {
        const path = normalizePageSlug(card.path);
        if (path !== '/' && !managedPaths.has(path) && !knownPaths.has(path)) {
          currentPagesList.push({
            slug: path,
            title: card.title || 'Rubrique',
            description: card.description || 'Description de la rubrique',
            showInNavigation: true,
            order: currentPagesList.length + 1,
            blocks: [
              { type: 'heading', level: 2, text: card.title || 'Rubrique' },
              { type: 'paragraph', text: card.description || 'Contenu de la rubrique' },
            ],
          });
          managedPaths.add(path);
        }
      });

      const validationErrors = validateManagedPages(currentPagesList);
      if (validationErrors.length) throw new Error(`Corrigez les erreurs CMS :\n${validationErrors.join('\n')}`);

      const pageDataStr = customFiles?.pageData || pageDataJson || window.localStorage.getItem(pageDataDraftStorageKey) || '{}';
      const parsedPageData: unknown = JSON.parse(pageDataStr);
      if (!isValidPageData(parsedPageData)) {
        throw new Error('Les données de planning ou de film annuel sont invalides. Vérifiez leur JSON avant de déployer.');
      }

      const pageTextStr = customFiles?.pageText || pageTextJson || window.localStorage.getItem(pageTextDraftStorageKey) || '{}';
      const parsedPageText: unknown = JSON.parse(pageTextStr);
      if (!isValidPageTextOverrides(parsedPageText)) {
        throw new Error('Les modifications visuelles des pages sont invalides. Vérifiez leur JSON avant de déployer.');
      }

      const contentStr = customFiles?.siteContent || serializedContent || window.localStorage.getItem(draftStorageKey) || '{}';
      const pagesStr = customFiles?.pages || JSON.stringify({ pages: currentPagesList }, null, 2);

      const response = await fetch('/api/github/pull-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directDeploy,
          files: {
            'src/content/siteContent.json': contentStr,
            'src/content/pages.json': pagesStr,
            'src/content/pageData.json': JSON.stringify(parsedPageData, null, 2),
            'src/content/pageText.json': JSON.stringify(parsedPageText, null, 2),
          },
        }),
      });
      const responseText = await response.text();
      let result: { error?: string; url?: string; number?: number; message?: string };
      try {
        result = responseText ? JSON.parse(responseText) as { error?: string; url?: string; number?: number; message?: string } : {};
      } catch {
        throw new Error(
          `L’API a renvoyé une réponse non JSON (HTTP ${response.status}). Vérifiez vos configurations.`
        );
      }
      if (!response.ok) throw new Error(result.error || 'La requête vers GitHub a échoué.');
      if (result.url && result.number) setPullRequest({ url: result.url, number: result.number });

      if (directDeploy) {
        setStatus(result.message || '🚀 Déploiement Vercel réussi ! Les modifications sont publiées sur la branche principale.');
      } else {
        setStatus(`Preview demandée : ${result.url || 'Pull Request créée'}`);
      }
      return result;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
      setStatus(msg);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const publishPullRequest = async () => {
    if (!pullRequest || !window.confirm('Publier cette Preview en production en fusionnant la Pull Request ?')) return;
    setIsSaving(true);
    setStatus('');
    try {
      const response = await fetch('/api/github/merge-pull-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pullNumber: pullRequest.number }),
      });
      const text = await response.text();
      const result = text ? JSON.parse(text) as { error?: string; message?: string } : {};
      if (!response.ok) throw new Error(result.error || 'La publication a échoué.');
      setStatus(result.message || 'Publication effectuée.');
      setPullRequest(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Une erreur inattendue est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveDraft = () => {
    try {
      const parsed: unknown = JSON.parse(pageDataJson);
      if (!isValidPageData(parsed)) {
        throw new Error('Les données de planning ou de film annuel sont invalides.');
      }
      const visualOverrides: unknown = JSON.parse(pageTextJson);
      if (!isValidPageTextOverrides(visualOverrides)) {
        throw new Error('Les modifications visuelles des pages sont invalides.');
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Le JSON des données de pages est invalide.');
      return false;
    }
    window.localStorage.setItem(draftStorageKey, serializedContent);
    window.localStorage.setItem(pagesDraftStorageKey, serializedPages);
    window.localStorage.setItem(pageDataDraftStorageKey, pageDataJson);
    window.localStorage.setItem(pageTextDraftStorageKey, pageTextJson);
    setStatus('Brouillon enregistré dans ce navigateur. Il n’est pas encore public.');
    return true;
  };

  const previewDraft = () => {
    if (saveDraft()) window.open('/?draft=1', '_blank', 'noopener,noreferrer');
  };

  const openVisualEditor = () => {
    if (!saveDraft()) return;
    setSelectedVisualElement(null);
  };

  const editorGridClass = `grid min-h-0 flex-1 grid-cols-1 gap-0 p-0 ${treeCollapsed
    ? inspectorCollapsed ? 'xl:grid-cols-[42px_minmax(0,1fr)_42px]' : 'xl:grid-cols-[42px_minmax(0,1fr)_320px]'
    : inspectorCollapsed ? 'xl:grid-cols-[270px_minmax(0,1fr)_42px]' : 'xl:grid-cols-[270px_minmax(0,1fr)_320px]'}`;

  const updateVisualElement = (field: 'text' | 'src' | 'alt' | 'href', value: string) => {
    if (!selectedVisualElement) return;
    if (field === 'href' && value && !value.startsWith('/') && !/^https?:\/\//i.test(value)) {
      setStatus('Le lien doit être une adresse http(s) ou un chemin interne commençant par /.');
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(pageTextJson);
    } catch {
      parsed = {};
    }
    const current = isRecord(parsed) ? parsed : {};
    const pageOverrides = isRecord(current[visualRoute]) ? current[visualRoute] : {};
    const targetPath = field === 'href' ? selectedVisualElement.linkPath || selectedVisualElement.path : selectedVisualElement.path;
    const existing = isRecord(pageOverrides[targetPath]) ? pageOverrides[targetPath] : {};
    const next = {
      ...current,
      [visualRoute]: {
        ...pageOverrides,
        [targetPath]: { ...existing, [field]: value },
      },
    };
    const serialized = JSON.stringify(next);
    setPageTextJson(serialized);
    window.localStorage.setItem(pageTextDraftStorageKey, serialized);
    setSelectedVisualElement((selection) => selection ? { ...selection, [field]: value } : selection);

    // Bidirectional sync: if editing a budget page figure, keep pageDataJson in sync
    if (visualRoute.includes('budget') && field === 'text') {
      const digits = value.replace(/[^0-9]/g, '');
      const num = parseInt(digits, 10);
      if (!isNaN(num) && num > 0) {
        try {
          const currentPD = JSON.parse(pageDataJson);
          if (currentPD?.budgetData?.projects && Array.isArray(currentPD.budgetData.projects)) {
            const climProj = currentPD.budgetData.projects.find((p: { id?: string; title?: string }) => p.id === 'proj-clim' || p.title?.includes('Climatisation'));
            if (climProj && (value.includes('60') || selectedVisualElement.text?.includes('Climatisation') || selectedVisualElement.path.includes('0.2.0'))) {
              climProj.budget = num;
              const nextPDStr = JSON.stringify(currentPD, null, 2);
              setPageDataJson(nextPDStr);
              window.localStorage.setItem(pageDataDraftStorageKey, nextPDStr);
            }
          }
        } catch {
          // ignore
        }
      }
    }

    setStatus('Brouillon modifié. L’aperçu se met à jour automatiquement.');
  };

  const resetDraft = () => {
    window.localStorage.removeItem(draftStorageKey);
    window.localStorage.removeItem(pagesDraftStorageKey);
    window.localStorage.removeItem(pageDataDraftStorageKey);
    window.localStorage.removeItem(pageTextDraftStorageKey);
    setContent(siteContent);
    setPages(pagesFile.pages as ManagedPage[]);
    setPageDataJson(JSON.stringify({ ...defaultPageData, ...pageDataFile }, null, 2));
    setPageTextJson(JSON.stringify(publishedPageText, null, 2));
    setStatus('Brouillon réinitialisé avec le contenu versionné.');
  };

  const addPage = (template: 'default' | 'project' | 'gallery' | 'data' = 'default') => {
    const pageNumber = pages.length + 1;
    let starterBlocks: ContentBlock[] = [{ type: 'paragraph', text: 'Écrivez votre texte ici.' }];
    if (template === 'project') {
      starterBlocks = [
        { type: 'heading', level: 2, text: 'Présentation du projet' },
        { type: 'paragraph', text: 'Décrivez les objectifs et les enjeux pour le lycée.' },
        { type: 'callout', title: 'Points clés', text: 'Périmètre, public cible et calendrier de déploiement.', tone: 'blue' },
        { type: 'heading', level: 3, text: 'Étapes de réalisation' },
        { type: 'list', items: ['Phase 1 : Cadrage et concertation', 'Phase 2 : Lancement opérationnel', 'Phase 3 : Évaluation'] },
      ];
    } else if (template === 'gallery') {
      starterBlocks = [
        { type: 'heading', level: 2, text: 'Galerie d’images' },
        { type: 'paragraph', text: 'Découvrez les clichés des événements et activités de nos élèves.' },
        { type: 'gallery', images: [{ src: '', alt: 'Image 1' }, { src: '', alt: 'Image 2' }] },
      ];
    } else if (template === 'data') {
      starterBlocks = [
        { type: 'heading', level: 2, text: 'Indicateurs clés' },
        { type: 'paragraph', text: 'Données statistiques et suivi d’objectifs.' },
        { type: 'chart', title: 'Taux de satisfaction et réussite', labels: ['Climat scolaire', 'Satisfaction cantine', 'Réussite aux examens'], values: [92, 85, 99] },
        { type: 'table', headers: ['Indicateur', 'Cible', 'Résultat'], rows: [['Participation', '80%', '88%'], ['Accompagnement', '90%', '94%']] },
      ];
    }

    const page: ManagedPage = {
      slug: `/nouvelle-page-${pageNumber}`,
      title: `Nouvelle page ${pageNumber}`,
      description: 'Description de la page.',
      showInNavigation: true,
      order: pageNumber,
      blocks: starterBlocks,
    };

    setPages((current) => [...current, page]);
    setSelectedPage(pages.length);
    setStatus(`Page créée : ${page.slug}. Vous pouvez ajouter, modifier ou supprimer des sections.`);
  };

  const movePage = (pageIndex: number, direction: -1 | 1) => {
    const target = pageIndex + direction;
    if (target < 0 || target >= pages.length) return;
    setPages((current) => {
      const copy = [...current];
      const [item] = copy.splice(pageIndex, 1);
      copy.splice(target, 0, item);
      return copy.map((p, idx) => ({ ...p, order: idx + 1 }));
    });
    setSelectedPage(target);
    setStatus('Ordre des pages mis à jour.');
  };

  const deletePage = (pageIndex?: number) => {
    if (!assertCanDelete('la suppression d’une page')) return;
    const targetIndex = typeof pageIndex === 'number' ? pageIndex : selectedPage;
    const page = pages[targetIndex];
    if (!page || !window.confirm(`Supprimer la page « ${page.title} » et son contenu ?`)) return;
    const nextPages = pages.filter((_, index) => index !== targetIndex);
    setPages(nextPages);
    setSelectedPage(Math.max(0, Math.min(targetIndex, nextPages.length - 1)));
    setStatus('Page supprimée du brouillon. Enregistrez puis créez une Preview pour la publier.');
  };

  const duplicatePage = (pageIndex?: number) => {
    const targetIndex = typeof pageIndex === 'number' ? pageIndex : selectedPage;
    const source = pages[targetIndex];
    if (!source) return;
    const copyIndex = pages.length + 1;
    const copy: ManagedPage = {
      ...source,
      slug: `${normalizePageSlug(source.slug)}-copie-${copyIndex}`,
      title: `${source.title} (copie)`,
      menuLabel: source.menuLabel ? `${source.menuLabel} (copie)` : undefined,
      order: copyIndex,
      blocks: source.blocks.map((block) => ({ ...block })),
    };
    setPages((current) => [...current, copy]);
    setSelectedPage(pages.length);
    setStatus('Page dupliquée dans le brouillon.');
  };

  const addSubPage = (parentSlug?: string, returnRubrique?: string) => {
    if (returnRubrique) setActiveRubriqueReturn(returnRubrique);
    const parent = parentSlug || (pages[selectedPage] ? pages[selectedPage].slug : '');
    const parentPage = pages.find((p) => normalizePageSlug(p.slug) === normalizePageSlug(parent));
    const parentPath = parent ? normalizePageSlug(parent) : '';
    const pageNumber = pages.length + 1;
    const baseSlug = parentPath ? `${parentPath}/sous-page-${pageNumber}` : `/sous-page-${pageNumber}`;
    const page: ManagedPage = {
      slug: baseSlug,
      title: `Nouvelle sous-page ${pageNumber}`,
      parent: parentPath || undefined,
      description: `Sous-rubrique rattachée à ${parentPage?.title || 'la section parente'}.`,
      menuLabel: `Sous-page ${pageNumber}`,
      showInNavigation: true,
      order: pageNumber,
      blocks: [
        { type: 'heading', level: 2, text: 'Titre de la sous-page' },
        { type: 'paragraph', text: 'Rédigez le contenu détaillé de cette sous-section ici.' },
        { type: 'callout', title: 'Points importants', text: 'Détails et consignes pour cette sous-rubrique.', tone: 'blue' },
      ],
    };
    setPages((current) => [...current, page]);
    setSelectedPage(pages.length);
    setPageTabMode('cms');
    setPageSubTab('editor');
    setActiveSection('pages');
    setStatus(`Sous-page créée : ${page.slug} rattachée à ${parentPath || 'la racine'}.`);
  };

  const openRubriqueEditor = (path: string, name: string, parentPath?: string, returnRubrique?: string) => {
    setActiveRubriqueReturn(returnRubrique || null);
    const slug = normalizePageSlug(path);
    let pageIndex = pages.findIndex((p) => normalizePageSlug(p.slug) === slug);
    if (pageIndex === -1) {
      const parent = parentPath ? normalizePageSlug(parentPath) : undefined;
      const newPage: ManagedPage = {
        slug,
        title: name,
        parent,
        description: `Contenu de la rubrique ${name}.`,
        showInNavigation: true,
        order: pages.length + 1,
        blocks: [
          { type: 'heading', level: 2, text: name },
          { type: 'paragraph', text: 'Rédigez et structurez le contenu de cette rubrique avec des sections, paragraphes et blocs multimédias.' },
          { type: 'callout', title: 'Points clés', text: 'Présentez ici les objectifs et points essentiels de cette rubrique.', tone: 'blue' },
        ],
      };
      setPages((current) => [...current, newPage]);
      pageIndex = pages.length;
    }
    setSelectedPage(pageIndex);
    setPageTabMode('cms');
    setPageSubTab('editor');
    setActiveSection('pages');
    setStatus(`Édition de la rubrique « ${name} » ouverte.`);
  };

  const deleteRubriqueBySlug = (slug: string, name: string) => {
    if (!assertCanDelete('la suppression d’une rubrique')) return;
    if (!window.confirm(`Supprimer la rubrique « ${name} » (${slug}) et ses contenus ?`)) return;
    setPages((current) => current.filter((p) => normalizePageSlug(p.slug) !== normalizePageSlug(slug)));
    setStatus(`Rubrique « ${name} » supprimée.`);
  };

  const addSection = (level: 2 | 3 = 2) => {
    const block: ContentBlock = {
      type: 'heading',
      level,
      text: level === 2 ? 'Nouvelle section principale (H2)' : 'Nouvelle sous-section (H3)',
    };
    setPages((current) => current.map((page, index) => index === selectedPage ? { ...page, blocks: [...page.blocks, block] } : page));
    setStatus(level === 2 ? 'Section H2 ajoutée.' : 'Sous-section H3 ajoutée.');
  };

  const updatePage = (field: keyof ManagedPage, value: string) => {
    setPages((current) => current.map((page, index) => index === selectedPage ? { ...page, [field]: value } : page));
  };

  const updateBlock = (blockIndex: number, patch: Partial<ContentBlock>) => {
    setPages((current) => current.map((page, pageIndex) => pageIndex === selectedPage
      ? { ...page, blocks: page.blocks.map((block, index) => index === blockIndex ? { ...block, ...patch } as ContentBlock : block) }
      : page));
  };

  const addBlock = (type: ContentBlock['type']) => {
    const defaults: Record<ContentBlock['type'], ContentBlock> = {
      heading: { type: 'heading', level: 2, text: 'Nouveau titre' },
      paragraph: { type: 'paragraph', text: 'Écrivez votre texte ici.' },
      image: { type: 'image', src: '', alt: '', caption: '' },
      gallery: { type: 'gallery', images: [{ src: '', alt: '' }] },
      video: { type: 'video', src: '', title: '' },
      embed: { type: 'embed', src: '', title: 'Contenu intégré', height: 420 },
      quote: { type: 'quote', text: 'Citation', author: '' },
      list: { type: 'list', items: ['Élément de liste'] },
      callout: { type: 'callout', title: 'À retenir', text: '', tone: 'blue' },
      table: { type: 'table', headers: ['Colonne 1', 'Colonne 2'], rows: [['', '']] },
      chart: { type: 'chart', title: 'Graphique', labels: ['Valeur'], values: [50] },
      button: { type: 'button', label: 'En savoir plus', href: '/' },
      divider: { type: 'divider' },
    };
    setPages((current) => current.map((page, index) => index === selectedPage ? { ...page, blocks: [...page.blocks, defaults[type]] } : page));
  };

  const removeBlock = (blockIndex: number) => {
    if (!assertCanDelete('la suppression d’un bloc de contenu')) return;
    setPages((current) => current.map((page, index) => index === selectedPage ? { ...page, blocks: page.blocks.filter((_, blockIndexValue) => blockIndexValue !== blockIndex) } : page));
  };

  const duplicateBlock = (blockIndex: number) => {
    setPages((current) => current.map((page, index) => {
      if (index !== selectedPage) return page;
      const targetBlock = page.blocks[blockIndex];
      if (!targetBlock) return page;
      const cloned = JSON.parse(JSON.stringify(targetBlock)) as ContentBlock;
      const blocks = [...page.blocks];
      blocks.splice(blockIndex + 1, 0, cloned);
      return { ...page, blocks };
    }));
    setStatus('Bloc dupliqué.');
  };

  const moveBlock = (blockIndex: number, direction: -1 | 1) => {
    setPages((current) => current.map((page, index) => {
      if (index !== selectedPage) return page;
      const target = blockIndex + direction;
      if (target < 0 || target >= page.blocks.length) return page;
      const blocks = [...page.blocks];
      [blocks[blockIndex], blocks[target]] = [blocks[target], blocks[blockIndex]];
      return { ...page, blocks };
    }));
  };

  const updateBlockText = (blockIndex: number, field: 'text' | 'title' | 'src' | 'alt' | 'caption' | 'author' | 'label' | 'href' | 'tone', value: string) => {
    const block = pages[selectedPage]?.blocks[blockIndex];
    const mediaField = field === 'src' && (block?.type === 'image' || block?.type === 'video');
    updateBlock(blockIndex, { [field]: mediaField ? normalizeMediaUrl(value, block.type) : value });
  };

  const updateBlockStyle = (blockIndex: number, patch: Partial<TextStyle>) => {
    updateBlock(blockIndex, { style: { ...(pages[selectedPage]?.blocks[blockIndex] as ContentBlock & { style?: TextStyle }).style, ...patch } });
  };

  const updateRestaurantRow = (dataset: keyof typeof restaurantPageData, rowIndex: number, field: string, value: string) => {
    try {
      const parsed = JSON.parse(pageDataJson) as Record<string, unknown>;
      const restaurant = parsed.restaurant as Record<string, unknown>;
      const rows = restaurant[dataset] as Record<string, unknown>[];
      const currentRow = rows[rowIndex];
      const currentValue = currentRow[field];
      const nextValue = typeof currentValue === 'number' ? (value.trim() === '' ? 0 : Number(value)) : value;
      if (typeof nextValue === 'number' && !Number.isFinite(nextValue)) return;
      const nextRows = rows.map((row, index) => index === rowIndex ? { ...row, [field]: nextValue } : row);
      persistPageData({ ...parsed, restaurant: { ...restaurant, [dataset]: nextRows } });
    } catch {
      setStatus('Impossible de mettre à jour cette donnée. Réinitialisez le brouillon de données.');
    }
  };

  const addRestaurantRow = (dataset: keyof typeof restaurantPageData) => {
    const parsed = JSON.parse(pageDataJson) as Record<string, unknown>;
    const restaurant = parsed.restaurant as Record<string, unknown>;
    const rows = restaurant[dataset] as Record<string, unknown>[];
    const template = rows[0] || { name: '', value: 0 };
    const row = Object.fromEntries(Object.entries(template).map(([field, value]) => [field, field === 'name' ? 'Nouvel élément' : field === 'value' || field === 'percentage' || field === 'average' ? 0 : value]));
    persistPageData({ ...parsed, restaurant: { ...restaurant, [dataset]: [...rows, row] } });
  };

  const removeRestaurantRow = (dataset: keyof typeof restaurantPageData, rowIndex: number) => {
    const parsed = JSON.parse(pageDataJson) as Record<string, unknown>;
    const restaurant = parsed.restaurant as Record<string, unknown>;
    const rows = restaurant[dataset] as Record<string, unknown>[];
    persistPageData({ ...parsed, restaurant: { ...restaurant, [dataset]: rows.filter((_, index) => index !== rowIndex) } });
  };

  const getRestaurantRows = (dataset: keyof typeof restaurantPageData): Record<string, unknown>[] => {
    try {
      const parsed = JSON.parse(pageDataJson) as { restaurant?: Record<string, unknown> };
      const rows = parsed.restaurant?.[dataset];
      return Array.isArray(rows) ? rows as Record<string, unknown>[] : [];
    } catch {
      return [];
    }
  };

  const getEditablePageData = (): Record<string, unknown> => {
    try {
      const parsed: unknown = JSON.parse(pageDataJson);
      return isRecord(parsed) ? parsed : defaultPageData;
    } catch {
      return defaultPageData;
    }
  };

  const updateEditablePageData = (update: (data: Record<string, unknown>) => Record<string, unknown>) => {
    persistPageData(update(getEditablePageData()));
  };

  const updateScheduleDay = (dayIndex: number, field: string, value: string) => {
    updateEditablePageData((data) => {
      const days = data.bacBlancSchedule as Record<string, unknown>[];
      return { ...data, bacBlancSchedule: days.map((day, index) => index === dayIndex ? { ...day, [field]: value } : day) };
    });
  };

  const updateScheduleRoom = (dayIndex: number, roomIndex: number, field: string, value: string) => {
    updateEditablePageData((data) => {
      const days = data.bacBlancSchedule as Record<string, unknown>[];
      const nextDays = days.map((day, currentDay) => {
        if (currentDay !== dayIndex) return day;
        const rooms = day.rooms as Record<string, unknown>[];
        return { ...day, rooms: rooms.map((room, currentRoom) => {
          if (currentRoom !== roomIndex) return room;
          if (field === 'surveillanceTeam') return { ...room, surveillanceTeam: value.split(',').map((name) => name.trim()).filter(Boolean) };
          if (field === 'supportNames') {
            const support = isRecord(room.supportTeam) ? room.supportTeam : {};
            return { ...room, supportTeam: { ...support, names: value.split(',').map((name) => name.trim()).filter(Boolean) } };
          }
          if (field === 'supportMission' || field === 'supportPresence') {
            const support = isRecord(room.supportTeam) ? room.supportTeam : { names: [] };
            return { ...room, supportTeam: { ...support, [field === 'supportMission' ? 'mission' : 'presence']: value } };
          }
          return { ...room, [field]: value };
        }) };
      });
      return { ...data, bacBlancSchedule: nextDays };
    });
  };

  const addScheduleDay = () => updateEditablePageData((data) => ({
    ...data,
    bacBlancSchedule: [...data.bacBlancSchedule as Record<string, unknown>[], { date: new Date().toISOString().slice(0, 10), label: 'Nouvelle journée', focus: 'Nouvelle épreuve', rooms: [] }],
  }));

  const removeScheduleDay = (dayIndex: number) => updateEditablePageData((data) => ({
    ...data,
    bacBlancSchedule: (data.bacBlancSchedule as Record<string, unknown>[]).filter((_, index) => index !== dayIndex),
  }));

  const addScheduleRoom = (dayIndex: number) => updateEditablePageData((data) => {
    const days = data.bacBlancSchedule as Record<string, unknown>[];
    return { ...data, bacBlancSchedule: days.map((day, index) => index === dayIndex ? { ...day, rooms: [...day.rooms as Record<string, unknown>[], { room: 'Nouvelle salle', examTitle: 'Nouvelle épreuve', examTime: '', leadExaminer: '', surveillanceTeam: [] }] } : day) };
  });

  const removeScheduleRoom = (dayIndex: number, roomIndex: number) => updateEditablePageData((data) => {
    const days = data.bacBlancSchedule as Record<string, unknown>[];
    return { ...data, bacBlancSchedule: days.map((day, index) => index === dayIndex ? { ...day, rooms: (day.rooms as Record<string, unknown>[]).filter((_, itemIndex) => itemIndex !== roomIndex) } : day) };
  });

  const updateFilmLevel = (levelKey: string, field: 'level' | 'subtitle', value: string) => {
    updateEditablePageData((data) => {
      const film = data.filmAnnuelData as Record<string, Record<string, unknown>>;
      return { ...data, filmAnnuelData: { ...film, [levelKey]: { ...film[levelKey], [field]: value } } };
    });
  };

  const updateFilmAction = (levelKey: string, actionIndex: number, field: string, value: string) => {
    updateEditablePageData((data) => {
      const film = data.filmAnnuelData as Record<string, Record<string, unknown>>;
      const level = film[levelKey];
      const actions = level.actions as Record<string, unknown>[];
      return { ...data, filmAnnuelData: { ...film, [levelKey]: { ...level, actions: actions.map((action, index) => index === actionIndex ? { ...action, [field]: value } : action) } } };
    });
  };

  const addFilmAction = (levelKey: string) => updateEditablePageData((data) => {
    const film = data.filmAnnuelData as Record<string, Record<string, unknown>>;
    const level = film[levelKey];
    const actions = level.actions as Record<string, unknown>[];
    return { ...data, filmAnnuelData: { ...film, [levelKey]: { ...level, actions: [...actions, { title: 'Nouvelle action', period: '', description: '', actors: '', phase: 'Mieux se connaître' }] } } };
  });

  const removeFilmAction = (levelKey: string, actionIndex: number) => updateEditablePageData((data) => {
    const film = data.filmAnnuelData as Record<string, Record<string, unknown>>;
    const level = film[levelKey];
    return { ...data, filmAnnuelData: { ...film, [levelKey]: { ...level, actions: (level.actions as Record<string, unknown>[]).filter((_, index) => index !== actionIndex) } } };
  });

  const removeFilmLevel = (levelKey: string) => updateEditablePageData((data) => {
    const film = { ...(data.filmAnnuelData as Record<string, unknown>) };
    delete film[levelKey];
    return { ...data, filmAnnuelData: film };
  });

  const updatePlanStrategiqueGeneral = (field: 'title' | 'subtitle', value: string) => {
    updateEditablePageData((data) => {
      const ps = (data.planStrategique as Record<string, string>) || { title: '', subtitle: '' };
      return { ...data, planStrategique: { ...ps, [field]: value } };
    });
  };

  const updateTimelineRange = (axis: string, field: 'startYear' | 'endYear', value: number) => updateEditablePageData((data) => {
    const timelines = data.psdTimelines as Record<string, Record<string, unknown>>;
    const current = timelines[axis];
    const startYear = field === 'startYear' ? value : Math.min(Number(current.startYear), value);
    const endYear = field === 'endYear' ? value : Math.max(Number(current.endYear), value);
    const actions = (current.actions as Record<string, unknown>[]).map((action) => {
      const start = Math.min(endYear, Math.max(startYear, Number(action.start)));
      const end = Math.max(start, Math.min(endYear, Math.max(startYear, Number(action.end))));
      return { ...action, start, end };
    });
    return { ...data, psdTimelines: { ...timelines, [axis]: { ...current, startYear, endYear, actions } } };
  });

  const updateTimelineAction = (axis: string, actionIndex: number, field: string, value: string | number) => updateEditablePageData((data) => {
    const timelines = data.psdTimelines as Record<string, Record<string, unknown>>;
    const timeline = timelines[axis];
    const actions = timeline.actions as Record<string, unknown>[];
    return { ...data, psdTimelines: { ...timelines, [axis]: { ...timeline, actions: actions.map((action, index) => index === actionIndex ? { ...action, [field]: value } : action) } } };
  });

  const addTimelineAction = (axis: string) => updateEditablePageData((data) => {
    const timelines = data.psdTimelines as Record<string, Record<string, unknown>>;
    const timeline = timelines[axis];
    const actions = timeline.actions as Record<string, unknown>[];
    const startYear = Number(timeline.startYear);
    return { ...data, psdTimelines: { ...timelines, [axis]: { ...timeline, actions: [...actions, { title: 'Nouvelle action', description: '', start: startYear, end: startYear, color: 'from-sky-400/80 to-sky-500' }] } } };
  });

  const removeTimelineAction = (axis: string, actionIndex: number) => {
    if (!assertCanDelete('la suppression d’une action de jalon')) return;
    updateEditablePageData((data) => {
      const timelines = data.psdTimelines as Record<string, Record<string, unknown>>;
      const timeline = timelines[axis];
      return { ...data, psdTimelines: { ...timelines, [axis]: { ...timeline, actions: (timeline.actions as Record<string, unknown>[]).filter((_, index) => index !== actionIndex) } } };
    });
  };

  const updateElcsMetric = (categoryKey: string, group: 'primary' | 'secondary', rowIndex: number, field: string, value: string) => updateEditablePageData((data) => {
    const categories = data.elcsData as Record<string, Record<string, unknown>>;
    const category = categories[categoryKey];
    const metrics = category[group] as Record<string, unknown>[];
    const current = metrics[rowIndex][field];
    const nextValue = typeof current === 'number' ? (value.trim() === '' ? 0 : Number(value)) : value;
    if (typeof nextValue === 'number' && !Number.isFinite(nextValue)) return data;
    return { ...data, elcsData: { ...categories, [categoryKey]: { ...category, [group]: metrics.map((metric, index) => index === rowIndex ? { ...metric, [field]: nextValue } : metric) } } };
  });

  const updateElcsTitle = (categoryKey: string, title: string) => updateEditablePageData((data) => {
    const categories = data.elcsData as Record<string, Record<string, unknown>>;
    return { ...data, elcsData: { ...categories, [categoryKey]: { ...categories[categoryKey], title } } };
  });

  const addElcsMetric = (categoryKey: string, group: 'primary' | 'secondary') => updateEditablePageData((data) => {
    const categories = data.elcsData as Record<string, Record<string, unknown>>;
    const category = categories[categoryKey];
    const metrics = category[group] as Record<string, unknown>[];
    const template = metrics[0] || { name: '', value: 0, label: '' };
    const row = Object.fromEntries(Object.entries(template).map(([field, value]) => [field, field === 'name' || field === 'label' ? `Nouvel indicateur` : field === 'value' || field === 'average' ? 0 : value]));
    return { ...data, elcsData: { ...categories, [categoryKey]: { ...category, [group]: [...metrics, row] } } };
  });

  const removeElcsMetric = (categoryKey: string, group: 'primary' | 'secondary', rowIndex: number) => {
    if (!assertCanDelete('la suppression d’un indicateur ELCS')) return;
    updateEditablePageData((data) => {
      const categories = data.elcsData as Record<string, Record<string, unknown>>;
      const category = categories[categoryKey];
      return { ...data, elcsData: { ...categories, [categoryKey]: { ...category, [group]: (category[group] as Record<string, unknown>[]).filter((_, index) => index !== rowIndex) } } };
    });
  };

  // Helper functions for Budget & Transport (Rubrique Plan Stratégique)
  const getBudgetData = (): BudgetData => {
    const data = getEditablePageData();
    return (data.budgetData as BudgetData) || defaultBudgetData;
  };

  const updateBudgetSummary = (field: keyof BudgetData['summaryCards'], value: number) => {
    updateEditablePageData((data) => {
      const budget = (data.budgetData as BudgetData) || defaultBudgetData;
      return {
        ...data,
        budgetData: {
          ...budget,
          summaryCards: {
            ...budget.summaryCards,
            [field]: value,
          },
        },
      };
    });
  };

  const updateBudgetProject = (index: number, field: keyof BudgetProject, value: string | number) => {
    updateEditablePageData((data) => {
      const budget = (data.budgetData as BudgetData) || defaultBudgetData;
      const projects = [...budget.projects];
      if (!projects[index]) return data;
      projects[index] = { ...projects[index], [field]: field === 'budget' ? Number(value) || 0 : value };
      return {
        ...data,
        budgetData: {
          ...budget,
          projects,
        },
      };
    });
  };

  const addBudgetProject = () => {
    updateEditablePageData((data) => {
      const budget = (data.budgetData as BudgetData) || defaultBudgetData;
      const newProject: BudgetProject = {
        id: `proj-${Date.now()}`,
        title: 'Nouveau projet d’infrastructure',
        description: 'Description des travaux ou équipements prévus pour le cadre de vie.',
        period: '2026 – 2027',
        budget: 10000000,
        color: 'from-sky-100 to-sky-50',
      };
      return {
        ...data,
        budgetData: {
          ...budget,
          projects: [...budget.projects, newProject],
        },
      };
    });
  };

  const removeBudgetProject = (index: number) => {
    if (!assertCanDelete('la suppression d’un projet d’investissement')) return;
    updateEditablePageData((data) => {
      const budget = (data.budgetData as BudgetData) || defaultBudgetData;
      return {
        ...data,
        budgetData: {
          ...budget,
          projects: budget.projects.filter((_, i) => i !== index),
        },
      };
    });
  };

  const updateCashFlow = (yearIndex: number, field: keyof CashFlowYear, value: number) => {
    updateEditablePageData((data) => {
      const budget = (data.budgetData as BudgetData) || defaultBudgetData;
      const timeline = budget.financialTimeline.map((row, idx) => {
        if (idx !== yearIndex) return row;
        const updated = { ...row, [field]: value };
        if (field === 'capacite' || field === 'leviers') {
          updated.recettesTotales = (field === 'capacite' ? value : row.capacite) + (field === 'leviers' ? value : row.leviers);
        }
        return updated;
      });
      return {
        ...data,
        budgetData: {
          ...budget,
          financialTimeline: timeline,
        },
      };
    });
  };

  const updateTuitionSimulation = (index: number, field: keyof TuitionSimulation, value: number) => {
    updateEditablePageData((data) => {
      const budget = (data.budgetData as BudgetData) || defaultBudgetData;
      const sims = budget.tuitionSimulations.map((sim, idx) => idx === index ? { ...sim, [field]: value } : sim);
      return {
        ...data,
        budgetData: {
          ...budget,
          tuitionSimulations: sims,
        },
      };
    });
  };

  const getTransportData = (): TransportData => {
    const data = getEditablePageData();
    return (data.transportData as TransportData) || defaultTransportData;
  };

  const updateTransportCommune = (index: number, field: keyof TransportCommune, value: string | number) => {
    updateEditablePageData((data) => {
      const transport = (data.transportData as TransportData) || defaultTransportData;
      const communes = transport.communes.map((commune, idx) => idx === index ? { ...commune, [field]: field === 'total' ? Number(value) || 0 : value } : commune);
      return {
        ...data,
        transportData: {
          ...transport,
          communes,
        },
      };
    });
  };

  const addTransportCommune = () => {
    updateEditablePageData((data) => {
      const transport = (data.transportData as TransportData) || defaultTransportData;
      return {
        ...data,
        transportData: {
          ...transport,
          communes: [...transport.communes, { ville: 'Nouvelle commune', total: 10, part: '2 %' }],
        },
      };
    });
  };

  const removeTransportCommune = (index: number) => {
    if (!assertCanDelete('la suppression d’une commune de transport')) return;
    updateEditablePageData((data) => {
      const transport = (data.transportData as TransportData) || defaultTransportData;
      return {
        ...data,
        transportData: {
          ...transport,
          communes: transport.communes.filter((_, idx) => idx !== index),
        },
      };
    });
  };

  const updateTransportCircuit = (index: number, field: keyof TransportCircuit, value: string | number) => {
    updateEditablePageData((data) => {
      const transport = (data.transportData as TransportData) || defaultTransportData;
      const circuits = transport.circuits.map((c, idx) => idx === index ? { ...c, [field]: field === 'eleves' ? Number(value) || 0 : value } : c);
      return {
        ...data,
        transportData: {
          ...transport,
          circuits,
        },
      };
    });
  };

  const addTransportCircuit = () => {
    updateEditablePageData((data) => {
      const transport = (data.transportData as TransportData) || defaultTransportData;
      return {
        ...data,
        transportData: {
          ...transport,
          circuits: [...transport.circuits, { name: 'Nouvelle ligne de transport', eleves: 25, arrets: 'Arrêt 1, Arrêt 2, Lycée', horaireDepart: '07h20' }],
        },
      };
    });
  };

  const removeTransportCircuit = (index: number) => {
    if (!assertCanDelete('la suppression d’une ligne de transport')) return;
    updateEditablePageData((data) => {
      const transport = (data.transportData as TransportData) || defaultTransportData;
      return {
        ...data,
        transportData: {
          ...transport,
          circuits: transport.circuits.filter((_, idx) => idx !== index),
        },
      };
    });
  };

  const updateTransportStat = (field: keyof TransportData['stats'], value: string | number) => {
    updateEditablePageData((data) => {
      const transport = (data.transportData as TransportData) || defaultTransportData;
      return {
        ...data,
        transportData: {
          ...transport,
          stats: {
            ...transport.stats,
            [field]: value,
          },
        },
      };
    });
  };

  const addFilmLevel = () => {
    const film = getEditablePageData().filmAnnuelData as Record<string, unknown>;
    let key = 'nouveau-niveau';
    let suffix = 2;
    while (film[key]) key = `nouveau-niveau-${suffix++}`;
    updateEditablePageData((data) => ({ ...data, filmAnnuelData: { ...(data.filmAnnuelData as Record<string, unknown>), [key]: { level: 'Nouveau niveau', subtitle: 'Parcours annuel à compléter.', actions: [] } } }));
  };

  const importMedia = (file: File | undefined, onLoad: (dataUrl: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setStatus('Sélectionnez une image ou une vidéo.');
      return;
    }
    if (file.size > 350000) {
      setStatus('Le fichier doit faire moins de 350 Ko pour rester publiable dans le fichier JSON.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onLoad(reader.result);
    };
    reader.onerror = () => setStatus('Le fichier média n’a pas pu être importé.');
    reader.readAsDataURL(file);
  };

  const importContentImage = (file: File | undefined, onLoad: (dataUrl: string) => void) => {
    if (!file || !file.type.startsWith('image/')) {
      if (file) setStatus('Sélectionnez une image.');
      return;
    }
    if (file.size > 350000) {
      setStatus('L’image doit faire moins de 350 Ko pour rester publiable dans le fichier JSON.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onLoad(reader.result);
    };
    reader.onerror = () => setStatus('L’image n’a pas pu être importée.');
    reader.readAsDataURL(file);
  };

  const renderBlockPreview = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        return block.level === 3 ? (
          <h3 className="font-playfair text-lg font-bold text-french-blue">{block.text || 'Titre de sous-section (H3)'}</h3>
        ) : (
          <h2 className="font-playfair text-xl font-bold text-french-blue border-b pb-1">{block.text || 'Titre de section (H2)'}</h2>
        );
      case 'paragraph':
        return <p className="text-sm text-slate-700 leading-relaxed">{block.text || 'Contenu du paragraphe...'}</p>;
      case 'callout':
        return (
          <div className={`rounded-r-lg border-l-4 p-3 text-sm ${block.tone === 'gold' ? 'border-amber-500 bg-amber-50 text-amber-900' : block.tone === 'green' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-french-blue bg-blue-50 text-french-blue'}`}>
            <p className="font-bold">{block.title || 'Encart de mise en avant'}</p>
            <p className="text-xs mt-1 text-slate-700">{block.text || 'Texte de l’encart...'}</p>
          </div>
        );
      case 'quote':
        return (
          <blockquote className="border-l-2 border-french-blue pl-3 italic text-sm text-slate-600">
            « {block.text || 'Citation...'} »
            {block.author && <span className="block text-xs font-semibold text-french-blue not-italic mt-1">— {block.author}</span>}
          </blockquote>
        );
      case 'image':
        return (
          <div className="flex items-center gap-3">
            {block.src ? <img src={normalizeMediaUrl(block.src)} alt={block.alt} className="h-16 w-24 rounded object-cover border" /> : <div className="h-16 w-24 rounded bg-slate-200 flex items-center justify-center text-xs text-slate-400">Image</div>}
            <div className="text-xs text-slate-600">
              <p className="font-semibold">{block.alt || 'Sans texte alternatif'}</p>
              {block.caption && <p className="text-slate-400">Légende : {block.caption}</p>}
            </div>
          </div>
        );
      case 'button':
        return (
          <div className="pt-1">
            <span className="inline-flex items-center rounded-md bg-french-blue px-3 py-1.5 text-xs font-medium text-white shadow-sm">
              {block.label || 'Bouton d’action'} →
            </span>
          </div>
        );
      case 'list':
        return (
          <ul className="list-disc pl-5 text-xs text-slate-700 space-y-0.5">
            {block.items.map((item, idx) => <li key={idx}>{item || `Élément ${idx + 1}`}</li>)}
          </ul>
        );
      case 'table':
        return (
          <div className="text-xs text-slate-600">
            <p className="font-semibold">Tableau : {block.headers.join(' | ')}</p>
            <p className="text-slate-400">{block.rows.length} ligne(s) enregistrée(s)</p>
          </div>
        );
      case 'chart':
        return (
          <div className="text-xs text-slate-600">
            <p className="font-semibold">Graphique : {block.title || 'Données chiffrées'}</p>
            <p className="text-slate-400">{block.labels.length} série(s) ({block.labels.join(', ')})</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderBlockEditor = (block: ContentBlock, blockIndex: number) => {
    const textField = (field: Parameters<typeof updateBlockText>[1], label: string, value: string, multiline = false) => (
      <div className="grid gap-2">
        <Label>{label}</Label>
        {multiline
          ? <Textarea value={value} onChange={(event) => updateBlockText(blockIndex, field, event.target.value)} />
          : <Input value={value} onChange={(event) => updateBlockText(blockIndex, field, event.target.value)} />}
      </div>
    );
    switch (block.type) {
      case 'heading':
        return <>{textField('text', 'Titre', block.text)}<div className="grid gap-2"><Label>Niveau</Label><select className="h-10 rounded-md border px-3" value={block.level || 2} onChange={(event) => updateBlock(blockIndex, { level: Number(event.target.value) as 2 | 3 })}><option value="2">Titre 2</option><option value="3">Titre 3</option></select></div><TextStyleToolbar style={block.style} onChange={(patch) => updateBlockStyle(blockIndex, patch)} /></>;
      case 'paragraph':
        return <>{textField('text', 'Texte', block.text, true)}<TextStyleToolbar style={block.style} onChange={(patch) => updateBlockStyle(blockIndex, patch)} /></>;
      case 'quote':
        return <>{textField('text', 'Citation', block.text, true)}{textField('author', 'Auteur', block.author || '')}<TextStyleToolbar style={block.style} onChange={(patch) => updateBlockStyle(blockIndex, patch)} /></>;
      case 'button':
        return <>{textField('label', 'Libellé', block.label)}{textField('href', 'Lien', block.href)}</>;
      case 'image':
        return <>{textField('src', 'URL de l’image ou lien Google Drive public', block.src)}<MediaPreview src={block.src} /><label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-french-blue"><Upload size={16} /> Importer une image<input className="sr-only" type="file" accept="image/*" onChange={(event) => importMedia(event.target.files?.[0], (src) => updateBlock(blockIndex, { src }))} /></label>{textField('alt', 'Texte alternatif', block.alt)}{textField('caption', 'Légende', block.caption || '')}</>;
      case 'video':
        return <>{textField('src', 'URL de la vidéo ou lien Google Drive public', block.src)}<MediaPreview src={block.src} type="video" /><label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-french-blue"><Upload size={16} /> Importer une vidéo<input className="sr-only" type="file" accept="video/*" onChange={(event) => importMedia(event.target.files?.[0], (src) => updateBlock(blockIndex, { src }))} /></label>{textField('title', 'Titre de la vidéo', block.title || '')}</>;
      case 'embed':
        return <>{textField('src', 'URL intégrée', block.src)}{textField('title', 'Titre accessible', block.title)}<div className="grid gap-2"><Label>Hauteur (pixels)</Label><Input type="number" value={block.height || 420} onChange={(event) => updateBlock(blockIndex, { height: Number(event.target.value) || 420 })} /></div></>;
      case 'callout':
        return <>{textField('title', 'Titre', block.title)}{textField('text', 'Contenu', block.text, true)}<div className="grid gap-2"><Label>Style</Label><select className="h-10 rounded-md border px-3" value={block.tone || 'blue'} onChange={(event) => updateBlockText(blockIndex, 'tone', event.target.value)}><option value="blue">Bleu</option><option value="gold">Or</option><option value="green">Vert</option></select></div><TextStyleToolbar style={block.style} onChange={(patch) => updateBlockStyle(blockIndex, patch)} /></>;
      case 'list':
        return <div className="space-y-2"><Label>Éléments</Label>{block.items.map((item, itemIndex) => <div key={`item-${itemIndex}`} className="flex gap-2"><Input value={item} onChange={(event) => updateBlock(blockIndex, { items: block.items.map((current, index) => index === itemIndex ? event.target.value : current) })} aria-label={`Élément ${itemIndex + 1}`} /><Button type="button" size="icon" variant="ghost" onClick={() => updateBlock(blockIndex, { items: block.items.filter((_, index) => index !== itemIndex) })} aria-label={`Supprimer élément ${itemIndex + 1}`}><Trash2 /></Button></div>)}<Button type="button" size="sm" variant="outline" onClick={() => updateBlock(blockIndex, { items: [...block.items, 'Nouvel élément'] })}>Ajouter un élément</Button></div>;
      case 'gallery':
        return <div className="space-y-3"><Label>Images de la galerie</Label>{block.images.map((image, imageIndex) => <div key={`image-${imageIndex}`} className="grid gap-2 rounded border p-3 sm:grid-cols-[1fr_1fr_auto]"><Input value={image.src} onChange={(event) => updateBlock(blockIndex, { images: block.images.map((current, index) => index === imageIndex ? { ...current, src: normalizeMediaUrl(event.target.value) } : current) })} aria-label={`URL image ${imageIndex + 1}`} placeholder="URL de l’image" /><Input value={image.alt} onChange={(event) => updateBlock(blockIndex, { images: block.images.map((current, index) => index === imageIndex ? { ...current, alt: event.target.value } : current) })} aria-label={`Texte alternatif image ${imageIndex + 1}`} placeholder="Texte alternatif" /><Button type="button" size="icon" variant="ghost" onClick={() => updateBlock(blockIndex, { images: block.images.filter((_, index) => index !== imageIndex) })} aria-label={`Supprimer image ${imageIndex + 1}`}><Trash2 /></Button></div>)}<Button type="button" size="sm" variant="outline" onClick={() => updateBlock(blockIndex, { images: [...block.images, { src: '', alt: '' }] })}>Ajouter une image</Button></div>;
      case 'table':
        return <div className="space-y-3"><Label>Tableau</Label><div className="space-y-2"><p className="text-xs font-semibold text-slate-500">Colonnes</p>{block.headers.map((header, columnIndex) => <div key={`header-${columnIndex}`} className="flex gap-2"><Input value={header} onChange={(event) => updateBlock(blockIndex, { headers: block.headers.map((current, index) => index === columnIndex ? event.target.value : current) })} aria-label={`Nom colonne ${columnIndex + 1}`} /><Button type="button" size="icon" variant="ghost" onClick={() => updateBlock(blockIndex, { headers: block.headers.filter((_, index) => index !== columnIndex), rows: block.rows.map((row) => row.filter((_, index) => index !== columnIndex)) })} aria-label={`Supprimer colonne ${columnIndex + 1}`}><Trash2 /></Button></div>)}<Button type="button" size="sm" variant="outline" onClick={() => updateBlock(blockIndex, { headers: [...block.headers, `Colonne ${block.headers.length + 1}`], rows: block.rows.map((row) => [...row, '']) })}>Ajouter une colonne</Button></div><div className="space-y-2"><p className="text-xs font-semibold text-slate-500">Lignes</p>{block.rows.map((row, rowIndex) => <div key={`row-${rowIndex}`} className="flex flex-wrap gap-2 rounded border p-2">{block.headers.map((_, columnIndex) => <Input key={`cell-${columnIndex}`} className="min-w-32 flex-1" value={row[columnIndex] || ''} onChange={(event) => updateBlock(blockIndex, { rows: block.rows.map((current, index) => index === rowIndex ? current.map((cell, cellIndex) => cellIndex === columnIndex ? event.target.value : cell) : current) })} aria-label={`Ligne ${rowIndex + 1}, colonne ${columnIndex + 1}`} />)}<Button type="button" size="icon" variant="ghost" onClick={() => updateBlock(blockIndex, { rows: block.rows.filter((_, index) => index !== rowIndex) })} aria-label={`Supprimer ligne ${rowIndex + 1}`}><Trash2 /></Button></div>)}<Button type="button" size="sm" variant="outline" onClick={() => updateBlock(blockIndex, { rows: [...block.rows, block.headers.map(() => '')] })}>Ajouter une ligne</Button></div></div>;
      case 'chart':
        return <div className="space-y-3"><div className="grid gap-2"><Label>Titre du graphique</Label><Input value={block.title || ''} onChange={(event) => updateBlock(blockIndex, { title: event.target.value })} /></div><div className="space-y-2"><Label>Libellés et valeurs</Label>{block.labels.map((label, itemIndex) => <div key={`datum-${itemIndex}`} className="grid gap-2 sm:grid-cols-[1fr_160px_auto]"><Input value={label} onChange={(event) => updateBlock(blockIndex, { labels: block.labels.map((current, index) => index === itemIndex ? event.target.value : current) })} aria-label={`Libellé ${itemIndex + 1}`} placeholder="Libellé" /><Input type="number" step="any" value={block.values[itemIndex] ?? 0} onChange={(event) => updateBlock(blockIndex, { values: block.values.map((current, index) => index === itemIndex ? Number(event.target.value) || 0 : current) })} aria-label={`Valeur ${itemIndex + 1}`} /><Button type="button" size="icon" variant="ghost" onClick={() => updateBlock(blockIndex, { labels: block.labels.filter((_, index) => index !== itemIndex), values: block.values.filter((_, index) => index !== itemIndex) })} aria-label={`Supprimer donnée ${itemIndex + 1}`}><Trash2 /></Button></div>)}<Button type="button" size="sm" variant="outline" onClick={() => updateBlock(blockIndex, { labels: [...block.labels, 'Nouvelle donnée'], values: [...block.values, 0] })}>Ajouter une donnée</Button></div></div>;
      case 'divider':
        return <p className="text-sm text-slate-500">Séparateur visuel sans contenu.</p>;
    }
  };

  const renderRubriqueSubpages = (
    pillarId: string,
    pillarPath: string,
    pillarName: string
  ) => {
    const pillar = SITE_PILLARS.find((p) => p.id === pillarId || p.path === pillarPath);
    const pillarCustomPages = pages.filter(
      (p) => p.parent === pillarPath || (!p.parent && pillarPath === '/' && p.slug !== '/' && !SITE_PILLARS.some((sp) => sp.path === p.slug))
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/60">
          <div>
            <h4 className="font-bold text-sm text-french-blue flex items-center gap-2">
              <FolderTree className="h-4 w-4" /> Sous-pages et fiches rattachées à la rubrique « {pillarName} »
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Toutes les sous-rubriques et fiches projets dépendant de {pillarPath} sont ordonnées ici suivant l’arborescence officielle.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => addSubPage(pillarPath, `rubrique-${pillarId}`)}
            className="bg-french-blue hover:bg-blue-700 text-xs font-semibold"
          >
            <CornerDownRight className="mr-1.5 h-3.5 w-3.5" /> + Ajouter une sous-page
          </Button>
        </div>

        {/* If pillar has axes (Plan Stratégique) */}
        {pillar?.axes && (
          <div className="space-y-5">
            {pillar.axes.map((axis) => {
              const axisCustomPages = pages.filter(
                (p) => p.parent === `/plan-strategique/${axis.id}` || p.parent === axis.id
              );
              return (
                <div key={axis.id} className="rounded-xl border bg-white p-4 sm:p-5 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5">
                        {axis.badge}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{axis.name}</h4>
                        <p className="text-xs text-slate-500">{axis.description}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addSubPage(`/plan-strategique/${axis.id}`, `rubrique-${pillarId}`)}
                      className="text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <CornerDownRight className="mr-1 h-3.5 w-3.5" /> + Sous-page pour {axis.badge}
                    </Button>
                  </div>

                  {/* Axis official subpages */}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {axis.subpages.map((sub) => {
                      const pageIndex = pages.findIndex((p) => normalizePageSlug(p.slug) === normalizePageSlug(sub.path));
                      const isCustomized = pageIndex !== -1;
                      return (
                        <div
                          key={sub.path}
                          className={`p-3 rounded-lg border text-xs flex flex-col justify-between gap-2 transition-all ${
                            isCustomized ? 'border-french-blue/40 bg-blue-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-slate-900 line-clamp-1">{sub.name}</span>
                              {isCustomized ? (
                                <span className="rounded bg-blue-100 text-french-blue text-[10px] font-bold px-1.5 py-0.5">
                                  Personnalisé
                                </span>
                              ) : (
                                <span className="rounded bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5">
                                  Officiel
                                </span>
                              )}
                            </div>
                            <code className="text-[11px] text-slate-500 font-mono mt-0.5 block truncate">
                              {sub.path}
                            </code>
                            {sub.description && (
                              <p className="text-slate-500 mt-1 line-clamp-2 text-[11px]">{sub.description}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/60 justify-end">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => openRubriqueEditor(sub.path, sub.name, `/plan-strategique/${axis.id}`, `rubrique-${pillarId}`)}
                              className="h-7 text-xs text-french-blue"
                            >
                              <Pencil className="mr-1 h-3 w-3" /> Modifier les blocs
                            </Button>
                            <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                              <a href={`${sub.path}?draft=1`} target="_blank" rel="noreferrer">
                                <Eye className="mr-1 h-3 w-3" /> Voir
                              </a>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Axis custom pages */}
                  {axisCustomPages.length > 0 && (
                    <div className="pt-2 border-t space-y-2">
                      <p className="text-[11px] font-bold uppercase text-slate-500">
                        Sous-pages personnalisées créées pour cet axe ({axisCustomPages.length})
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {axisCustomPages.map((page) => {
                          const pageIndex = pages.findIndex((p) => p.slug === page.slug);
                          return (
                            <div
                              key={page.slug}
                              className="p-3 rounded-lg border border-amber-200 bg-amber-50/40 text-xs flex flex-col justify-between gap-2"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-semibold text-slate-900">{page.title}</span>
                                  <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5">
                                    Sous-page libre
                                  </span>
                                </div>
                                <code className="text-[11px] text-slate-500 font-mono">{page.slug}</code>
                                <p className="text-slate-600 mt-1 text-[11px]">{page.blocks.length} bloc(s)</p>
                              </div>
                              <div className="flex items-center gap-1 pt-2 border-t border-amber-200/60 justify-end">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openRubriqueEditor(page.slug, page.title, `/plan-strategique/${axis.id}`, `rubrique-${pillarId}`)}
                                  className="h-7 text-xs"
                                >
                                  <Pencil className="mr-1 h-3 w-3" /> Modifier
                                </Button>
                                <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                                  <a href={`${page.slug}?draft=1`} target="_blank" rel="noreferrer">
                                    <Eye className="mr-1 h-3 w-3" /> Voir
                                  </a>
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => duplicatePage(pageIndex)}
                                  className="h-7 text-xs text-slate-600"
                                  title="Dupliquer"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deletePage(pageIndex)}
                                  className="h-7 text-xs text-red-500 hover:text-red-700"
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Standard official subpages (if not axes) */}
        {pillar?.subpages && pillar.subpages.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Fiches officielles de {pillarName} ({pillar.subpages.length})
            </h4>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {pillar.subpages.map((sub) => {
                const pageIndex = pages.findIndex((p) => normalizePageSlug(p.slug) === normalizePageSlug(sub.path));
                const isCustomized = pageIndex !== -1;
                return (
                  <div
                    key={sub.path}
                    className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between gap-2.5 transition-all ${
                      isCustomized ? 'border-french-blue/40 bg-blue-50/30 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-slate-900 text-sm">{sub.name}</span>
                        {isCustomized ? (
                          <span className="rounded bg-blue-100 text-french-blue text-[10px] font-bold px-2 py-0.5">
                            Personnalisé
                          </span>
                        ) : (
                          <span className="rounded bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5">
                            Officiel
                          </span>
                        )}
                      </div>
                      <code className="text-[11px] text-slate-500 font-mono mt-0.5 block truncate">
                        {sub.path}
                      </code>
                      {sub.description && (
                        <p className="text-slate-500 mt-1 line-clamp-2 text-xs">{sub.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openRubriqueEditor(sub.path, sub.name, pillarPath, `rubrique-${pillarId}`)}
                        className="h-7 text-xs text-french-blue hover:bg-blue-50"
                      >
                        <Pencil className="mr-1 h-3 w-3" /> Modifier les blocs
                      </Button>
                      <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                        <a href={`${sub.path}?draft=1`} target="_blank" rel="noreferrer">
                          <Eye className="mr-1 h-3 w-3" /> Voir
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom subpages created by admin */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Sous-pages personnalisées rattachées ({pillarCustomPages.length})
            </h4>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => addSubPage(pillarPath, `rubrique-${pillarId}`)}
              className="text-xs h-7 border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <CornerDownRight className="mr-1 h-3 w-3" /> + Nouvelle sous-page
            </Button>
          </div>

          {pillarCustomPages.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
              <p className="text-xs text-slate-500">
                Aucune sous-page personnalisée n’a encore été ajoutée à cette rubrique.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addSubPage(pillarPath, `rubrique-${pillarId}`)}
                className="mt-3 text-xs bg-white text-french-blue hover:bg-blue-50"
              >
                <CornerDownRight className="mr-1.5 h-3.5 w-3.5" /> Créer la première sous-page de {pillarName}
              </Button>
            </div>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {pillarCustomPages.map((page) => {
                const pageIndex = pages.findIndex((p) => p.slug === page.slug);
                return (
                  <div
                    key={page.slug}
                    className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/30 text-xs flex flex-col justify-between gap-2.5 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-slate-900 text-sm">{page.title}</span>
                        <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">
                          Sous-page
                        </span>
                      </div>
                      <code className="text-[11px] text-slate-500 font-mono mt-0.5 block truncate">
                        {page.slug}
                      </code>
                      <p className="text-slate-600 mt-1 text-xs">
                        {page.blocks.length} bloc(s) de contenu configuré(s)
                      </p>
                    </div>

                    <div className="flex items-center gap-1 pt-2 border-t border-amber-200/60 justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openRubriqueEditor(page.slug, page.title, pillarPath, `rubrique-${pillarId}`)}
                        className="h-7 text-xs text-french-blue"
                      >
                        <Pencil className="mr-1 h-3 w-3" /> Modifier les blocs
                      </Button>
                      <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                        <a href={`${page.slug}?draft=1`} target="_blank" rel="noreferrer">
                          <Eye className="mr-1 h-3 w-3" /> Voir
                        </a>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => duplicatePage(pageIndex)}
                        className="h-7 text-xs text-slate-600"
                        title="Dupliquer"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePage(pageIndex)}
                        className="h-7 text-xs text-red-500 hover:text-red-700"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!authChecked) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6"><Card className="w-full max-w-md border-0 shadow-2xl"><CardContent className="space-y-4 p-8 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-french-blue text-2xl font-bold text-white">L</div><h1 className="font-playfair text-2xl font-bold text-french-blue">Vérification de sécurité</h1><p className="text-sm text-slate-600">Connexion sécurisée à l’espace de gestion LFJP…</p></CardContent></Card></div>;
  }
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-french-blue to-blue-900 p-4 sm:p-6">
        <Card className="w-full max-w-lg border-0 shadow-2xl overflow-hidden rounded-2xl">
          <div className="bg-slate-950 p-6 text-center border-b border-slate-800 text-white">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-french-blue text-2xl font-bold text-white shadow-lg font-playfair mb-3">
              L
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Lycée Français Jacques Prévert de Saly</p>
            <h1 className="mt-1 font-playfair text-2xl sm:text-3xl font-bold text-white">Espace d’administration</h1>
            <p className="mt-2 text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Gérez, créez, modifiez l’ensemble des contenus, pages, rubriques, sous-rubriques et données du site.
            </p>
          </div>

          <div className="bg-white p-6 space-y-5">
            {/* Exactly TWO clear Options: Éditeur vs Administrateur (SuperAdmin GitHub) */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setGateTab('editor');
                  setGateError('');
                  setGateEmail(editorAccount.email);
                  setGatePassword(editorAccount.password);
                }}
                className={`py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-2 ${
                  gateTab === 'editor'
                    ? 'bg-white text-french-blue shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="h-4 w-4 text-amber-500" />
                <span>Éditeur</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setGateTab('superadmin');
                  setGateError('');
                  setGateEmail(superAdminAccount.email);
                  setGatePassword(superAdminAccount.password || 'admin');
                }}
                className={`py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-2 ${
                  gateTab === 'superadmin'
                    ? 'bg-white text-french-blue shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>SuperAdmin</span>
              </button>
            </div>

            {/* OPTION 1: ÉDITEUR (Identifiants & Mot de passe) */}
            {gateTab === 'editor' && (
              <form onSubmit={handleGateLogin} className="space-y-4">
                <div className="rounded-lg bg-amber-50/80 border border-amber-200 p-3 text-xs text-amber-900 space-y-1 text-left">
                  <p className="font-bold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-amber-600" />
                    <span>Profil Éditeur de contenus</span>
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Connexion par identifiant et mot de passe. Permet la modification complète des textes, images, plannings et données du site sans risque de suppression accidentelle.
                  </p>
                </div>

                {gateError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{gateError}</span>
                  </div>
                )}

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-700">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      required
                      value={gateEmail}
                      onChange={(e) => setGateEmail(e.target.value)}
                      placeholder="editeur@lfjpsaly.org"
                      className="pl-9 text-xs h-10"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Mot de passe</label>
                    <button
                      type="button"
                      onClick={() => setShowGatePassword(!showGatePassword)}
                      className="text-[11px] text-french-blue hover:underline"
                    >
                      {showGatePassword ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type={showGatePassword ? 'text' : 'password'}
                      required
                      value={gatePassword}
                      onChange={(e) => setGatePassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 pr-9 text-xs h-10 font-mono"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-french-blue hover:bg-blue-700 text-white font-semibold text-xs h-10 shadow">
                  <Key className="mr-2 h-4 w-4" /> Se connecter comme Éditeur
                </Button>
              </form>
            )}

            {/* OPTION 2: ADMINISTRATEUR / SUPERADMIN (Compte GitHub) */}
            {gateTab === 'superadmin' && (
              <div className="space-y-4 py-2 text-left">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Profil Administrateur (SuperAdmin GitHub)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed text-[11px]">
                    Connexion officielle via votre compte GitHub pour le profil <strong>informatique-cmd</strong>. Confère l’accès complet au tableau de bord SuperAdmin : arborescence, gestion des pages, fiches projets et publication sur Vercel.
                  </p>
                </div>

                <Button asChild className="w-full bg-slate-950 hover:bg-black text-white font-semibold text-xs h-11 shadow-md">
                  <a href="/api/auth/github">
                    <Github className="mr-2 h-4 w-4 text-white" /> Se connecter avec le compte GitHub
                  </a>
                </Button>
              </div>
            )}

            {/* Return to Public Site */}
            <div className="pt-2 border-t border-slate-100 text-center">
              <Button asChild variant="ghost" className="w-full text-slate-500 hover:text-slate-900 text-xs">
                <Link to="/">
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Retour au site public
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  // =========================================================================
  // INTERFACE DÉDIÉE ÉDITEUR : GRAND FORMAT EN DIRECT (IN-SITU) EXCLUSIF
  // =========================================================================
  if (userProfile.role === 'editor') {
    return (
      <div className="flex flex-col h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden font-raleway select-none">
        {/* Simple, Non-Overflowing & Responsive Top Navigation Bar for Editor */}
        <header className="shrink-0 h-14 bg-slate-950 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between gap-2 z-30 shadow-md">
          {/* Left: Brand clickable to go to Home */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
            <button
              type="button"
              onClick={() => {
                setVisualRoute('/');
                setSelectedVisualElement(null);
                if (previewFrame.current) {
                  previewFrame.current.src = `/?draft=1&edit=${editorModeActive ? '1' : '0'}&embedded=1`;
                }
              }}
              className="flex items-center gap-2 shrink-0 text-left hover:opacity-85 transition-opacity focus:outline-hidden group cursor-pointer"
              title="Retourner à l'accueil du site (/)"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-french-blue text-sm font-bold text-white shadow-sm font-playfair group-hover:scale-105 transition-transform shrink-0">
                L
              </span>
              <div className="hidden sm:block leading-tight">
                <span className="font-playfair font-bold text-sm text-white group-hover:text-blue-300 transition-colors whitespace-nowrap">LFJP · Édition</span>
                <span className="text-[10px] text-amber-400 font-semibold block">
                  {userProfile.name}
                </span>
              </div>
            </button>
          </div>

          {/* Right: Harmonized, Non-Overflowing Responsive Actions Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Toggle Button Activer / Désactiver les modifications */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                const nextState = !editorModeActive;
                setEditorModeActive(nextState);
                if (!nextState) setSelectedVisualElement(null);
                previewFrame.current?.contentWindow?.postMessage({ type: 'lfjp-set-edit-mode', active: nextState }, window.location.origin);
              }}
              className={`h-8 text-xs font-semibold px-2.5 sm:px-3 shrink-0 transition-colors ${
                editorModeActive
                  ? 'border-amber-500 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 ring-1 ring-amber-500/30'
                  : 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200'
              }`}
              title={editorModeActive ? "Désactiver la modification (naviguer sur les liens du site)" : "Activer la modification directe des textes et images"}
            >
              <Pencil className={`h-3.5 w-3.5 shrink-0 ${editorModeActive ? 'text-amber-400 mr-1 sm:mr-1.5' : 'text-slate-400 mr-1 sm:mr-1.5'}`} />
              {editorModeActive ? (
                <>
                  <span className="hidden md:inline">Édition active</span>
                  <span className="md:hidden">Actif</span>
                </>
              ) : (
                <>
                  <span className="hidden md:inline">Modifier le site</span>
                  <span className="md:hidden">Modifier</span>
                </>
              )}
            </Button>

            {/* Status indicator: only when pending admin approval */}
            {pendingDeployment?.status === 'pending_admin_approval' && (
              <span
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold shrink-0 whitespace-nowrap"
                title="Modifications transmises au SuperAdmin pour validation"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>En attente Admin</span>
              </span>
            )}

            {/* Save local draft */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={saveDraft}
              className="h-8 text-xs px-2 sm:px-2.5 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 shrink-0"
              title="Enregistrer le brouillon sur cet appareil"
            >
              <Save className="h-3.5 w-3.5 text-french-blue sm:mr-1.5 shrink-0" />
              <span className="hidden lg:inline">Enregistrer le brouillon</span>
              <span className="hidden sm:inline lg:hidden">Brouillon</span>
            </Button>

            {/* Deploy to Vercel Button */}
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (canPublish) {
                  setIsSuperAdminDeployModalOpen(true);
                } else {
                  setIsEditorDeployModalOpen(true);
                }
              }}
              className="h-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs px-2.5 sm:px-3 shadow-md font-bold flex items-center gap-1.5 shrink-0"
              title={canPublish ? "Déployer directement vers Vercel (branche main)" : "Enregistrer pour publier sur Vercel (Validation finale par le SuperAdmin)"}
            >
              <Send className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">Déployer sur Vercel</span>
              <span className="md:hidden">Déployer</span>
            </Button>

            <div className="h-4 w-px bg-slate-800 hidden sm:block shrink-0" />

            {/* User and Logout */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="hidden 2xl:inline text-[11px] font-mono text-slate-400 px-1 truncate max-w-[140px]">
                {userProfile.email}
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={logout}
                className="h-8 text-xs text-slate-300 hover:text-red-400 hover:bg-slate-800 px-2 shrink-0"
                title="Se déconnecter"
              >
                <LogOut className="h-3.5 w-3.5 sm:mr-1 text-slate-400 shrink-0" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Status notification banner if pending approval with close option */}
        {pendingDeployment?.status === 'pending_admin_approval' && dismissedBannerId !== pendingDeployment.id && (
          <div className="shrink-0 bg-gradient-to-r from-amber-600 to-amber-700 border-b border-amber-500/40 px-3 sm:px-4 py-2 text-xs text-white flex items-center justify-between gap-3 shadow-sm transition-all">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse shrink-0" />
              <span className="truncate sm:whitespace-normal">
                <strong>Demande en cours transmise au SuperAdmin :</strong> Vos modifications ont été soumises pour déploiement Vercel le{' '}
                {new Date(pendingDeployment.submittedAt).toLocaleTimeString('fr-FR')}. Elles restent en brouillon sécurisé et seront mises en ligne dès validation.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditorDeployModalOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap"
                title="Modifier la note transmise au SuperAdmin"
              >
                Modifier la note
              </button>
              <button
                type="button"
                onClick={() => {
                  setDismissedBannerId(pendingDeployment.id);
                  if (typeof window !== 'undefined') {
                    window.sessionStorage.setItem('lfjp_dismissed_deployment_banner', pendingDeployment.id);
                  }
                }}
                className="p-1 rounded-md text-amber-100 hover:text-white hover:bg-white/20 transition-colors"
                title="Fermer cette notification"
                aria-label="Fermer la notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {pendingDeployment?.status === 'rejected' && dismissedBannerId !== pendingDeployment.id && (
          <div className="shrink-0 bg-red-600/90 border-b border-red-500 px-3 sm:px-4 py-2 text-xs text-white flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="h-4 w-4 text-white shrink-0" />
              <span className="truncate sm:whitespace-normal">
                <strong>Retour du SuperAdmin :</strong> « {pendingDeployment.feedback || 'Modifications à ajuster'} ». Vous pouvez continuer à éditer et renvoyer la demande dès que c’est prêt.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                size="sm"
                onClick={() => setIsEditorDeployModalOpen(true)}
                className="h-6 text-[11px] bg-white text-red-900 hover:bg-red-50 font-bold shrink-0 px-2"
              >
                Renvoyer
              </Button>
              <button
                type="button"
                onClick={() => {
                  setDismissedBannerId(pendingDeployment.id);
                  if (typeof window !== 'undefined') {
                    window.sessionStorage.setItem('lfjp_dismissed_deployment_banner', pendingDeployment.id);
                  }
                }}
                className="p-1 rounded-md text-red-100 hover:text-white hover:bg-white/20 transition-colors"
                title="Fermer cette notification"
                aria-label="Fermer la notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Clear Helper Banner when Edit Mode is active */}
        {editorModeActive && (
          <div className="shrink-0 bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                <strong>Mode modification activé :</strong> Cliquez sur n'importe quel texte ou image sur la page pour le modifier facilement.
              </span>
            </div>
            <span className="text-[11px] text-amber-300/80 hidden sm:inline">
              Pour naviguer sur les liens du site, désactivez la modification en haut
            </span>
          </div>
        )}

        {/* Main Workspace: 100% Full-Screen Grand Format Live Site + Content Inspector */}
        <div className="flex min-h-0 flex-1 overflow-hidden relative">
          {/* 100% Full Width Live Site Iframe */}
          <main className="flex-1 min-w-0 flex flex-col bg-slate-950 overflow-hidden relative">
            <div ref={previewCanvas} className="relative flex-1 min-h-0 w-full h-full overflow-hidden bg-slate-900">
              <iframe
                ref={previewFrame}
                key={`${visualRoute}-${editorModeActive ? 'edit' : 'nav'}`}
                title={`Aperçu interactif ${visualRoute}`}
                src={`${visualRoute}?draft=1&edit=${editorModeActive ? '1' : '0'}&embedded=1`}
                className="block w-full h-full bg-white border-0 shadow-inner"
              />

              {/* Visual Indicator pin on clicked element: ONLY when editorModeActive is true */}
              {editorModeActive && selectedVisualElement?.rect && (
                <div
                  className="absolute z-20 pointer-events-none inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 shadow-xl ring-2 ring-white animate-in fade-in text-[11px] font-bold"
                  style={{
                    left: Math.max(8, selectedVisualElement.rect.left),
                    top: Math.max(8, selectedVisualElement.rect.top - 36),
                  }}
                >
                  <Pencil className="h-3 w-3 fill-current" />
                  <span>En cours de modification</span>
                </div>
              )}
            </div>
          </main>

          {/* Right Slide-over Inspector for Selected Content (Text or Image): ONLY when editorModeActive is true */}
          {editorModeActive && selectedVisualElement && !inspectorCollapsed && (
            <aside className="w-96 shrink-0 border-l border-slate-800 bg-slate-950 flex flex-col overflow-hidden text-slate-100 shadow-2xl animate-in slide-in-from-right-4 duration-200">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                <span className="flex items-center gap-2 font-bold text-sm text-amber-300">
                  <Pencil className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>
                    {selectedVisualElement.kind === 'image'
                      ? 'Changer l’image'
                      : selectedVisualElement.kind === 'link'
                      ? 'Modifier le bouton / lien'
                      : 'Modifier le texte'}
                  </span>
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedVisualElement(null)}
                  className="h-7 text-xs text-slate-400 hover:text-white hover:bg-slate-800 px-2 flex items-center gap-1"
                  title="Fermer"
                >
                  <X className="h-4 w-4" />
                  <span>Fermer</span>
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {/* Text Editing Field */}
                {(selectedVisualElement.kind === 'text' || selectedVisualElement.kind === 'link') && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-slate-200 text-xs font-semibold flex items-center justify-between">
                        <span>Contenu du texte :</span>
                        <span className="text-[11px] text-emerald-400 font-normal">Aperçu direct sur la page</span>
                      </Label>
                      <Textarea
                        autoFocus={focusInspector}
                        value={selectedVisualElement.text || ''}
                        onFocus={() => setFocusInspector(false)}
                        onChange={(e) => updateVisualElement('text', e.target.value)}
                        placeholder="Tapez votre texte ici..."
                        className="bg-slate-900 border-slate-700 text-white min-h-[160px] text-sm leading-relaxed focus:border-amber-400 rounded-lg p-3"
                      />
                    </div>

                    {selectedVisualElement.href !== undefined && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                        <Label className="text-slate-300 text-xs font-medium">Adresse du lien (optionnel) :</Label>
                        <Input
                          value={selectedVisualElement.href || ''}
                          onChange={(e) => updateVisualElement('href', e.target.value)}
                          placeholder="/axe-1 ou https://..."
                          className="bg-slate-900 border-slate-700 text-white text-xs h-9 font-mono"
                        />
                      </div>
                    )}

                    <div className="pt-2 space-y-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          saveDraft();
                          setSelectedVisualElement(null);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 shadow-md flex items-center justify-center gap-2 h-9"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Enregistrer et fermer</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Image Editing Field */}
                {selectedVisualElement.kind === 'image' && (
                  <div className="space-y-3">
                    <div>
                      <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-amber-500/50 bg-amber-500/10 px-4 py-3 text-xs font-bold text-amber-200 hover:bg-amber-500/20 transition-colors shadow-sm">
                        <Upload className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>Choisir une photo sur mon ordinateur</span>
                        <input
                          className="sr-only"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              importContentImage(file, (dataUrl) => {
                                updateVisualElement('src', dataUrl);
                              });
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-300 text-xs font-medium">Ou coller l'adresse URL de l'image :</Label>
                      <Input
                        value={selectedVisualElement.src || ''}
                        onChange={(e) => updateVisualElement('src', e.target.value)}
                        placeholder="https://... ou /assets/..."
                        className="bg-slate-900 border-slate-700 text-white text-xs font-mono h-9"
                      />
                    </div>

                    {selectedVisualElement.src && (
                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-2 overflow-hidden">
                        <p className="text-[10px] text-slate-400 mb-1 font-semibold uppercase">Aperçu :</p>
                        <img
                          src={selectedVisualElement.src}
                          alt={selectedVisualElement.alt || 'Aperçu'}
                          className="max-h-44 w-full object-cover rounded-lg border border-slate-800"
                        />
                      </div>
                    )}

                    <div className="pt-2 space-y-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          saveDraft();
                          setSelectedVisualElement(null);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 shadow-md flex items-center justify-center gap-2 h-9"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Enregistrer l'image et fermer</span>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-[11px] text-slate-300 space-y-1.5">
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span>💡 Simple & Sécurisé</span>
                  </p>
                  <p className="leading-relaxed text-slate-400">
                    Modifiez simplement vos textes et photos. Lorsque tout est prêt, cliquez sur « Enregistrer pour publier sur Vercel » en haut pour envoyer la mise en ligne au SuperAdmin.
                  </p>
                </div>
              </div>
            </aside>
          )}


        </div>

        {/* Modal: Demande de Déploiement sur Vercel */}
        {isEditorDeployModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-slate-900">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 text-white">
                    <Send className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-playfair font-bold text-lg text-white">Déploiement sur Vercel</h3>
                    <p className="text-xs text-emerald-100">Transmission au SuperAdmin pour validation finale</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditorDeployModalOpen(false)}
                  className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEditorSubmitForDeploy} className="p-6 space-y-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-950 space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-sm text-emerald-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Vos modifications restent en brouillon sécurisé
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Toutes vos modifications sont sauvegardées. Lorsque vous confirmez l’envoi, le SuperAdmin recevra une notification instantanée avec vos modifications. Il vérifiera le site et déclenchera le déploiement en ligne sur Vercel.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Notes ou résumé des modifications (optionnel) :
                  </Label>
                  <Textarea
                    value={editorDeployNotes}
                    onChange={(e) => setEditorDeployNotes(e.target.value)}
                    placeholder="Ex : Actualisation des textes de présentation, modification des photos de la section Vision..."
                    className="text-xs min-h-[90px] bg-slate-50 border-slate-300"
                  />
                  <p className="text-[11px] text-slate-500">
                    Ce résumé permettra au SuperAdmin de vérifier rapidement vos changements avant de déployer.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditorDeployModalOpen(false)}
                    className="text-xs"
                  >
                    Continuer à modifier
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                  >
                    <Send className="mr-1.5 h-3.5 w-3.5" /> Transmettre pour déploiement Vercel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-raleway flex flex-col">
      {/* WordPress-style Top Admin Bar */}
      <header className="sticky top-0 z-50 h-12 bg-slate-950 text-slate-200 border-b border-slate-800 flex items-center justify-between px-3 sm:px-4 shadow-sm select-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            title="Menu"
          >
            {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-french-blue text-xs font-bold text-white shadow-sm font-playfair">
              L
            </span>
            <span className="font-playfair font-bold text-sm text-white hidden sm:inline">LFJP CMS</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <Link
            to="/?draft=1"
            target="_blank"
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            title="Ouvrir le site avec le brouillon actuel"
          >
            <Eye className="h-3.5 w-3.5 text-french-blue" />
            <span className="hidden md:inline">Voir le site en direct</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </Link>

          <span className="text-slate-600 hidden md:inline">|</span>

          {/* Quick Create Dropdown / Buttons */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveSection('pages');
                setPageSubTab('editor');
                addPage('default');
              }}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-400" />
              <span>Page</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSection('pages');
                setPageSubTab('editor');
                addSubPage();
              }}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              <CornerDownRight className="h-3.5 w-3.5 text-amber-400" />
              <span>Sous-page</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSection('rubriques');
                addCard();
              }}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-sky-400" />
              <span>Rubrique</span>
            </button>
          </div>
        </div>

        {/* Right side of Topbar: Status, Draft indicator, Save button, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              switchUserProfile(defaultAccounts[1]);
            }}
            className="h-8 text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40 px-2.5 flex items-center gap-1.5"
            title="Passer en vue Éditeur du site (édition directe in-situ)"
          >
            <Pencil className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Vue Éditeur</span>
          </Button>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Brouillon actif</span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={previewDraft}
            className="h-8 text-xs text-slate-200 hover:text-white hover:bg-slate-800 px-2"
          >
            <Eye className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Prévisualiser</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={saveDraft}
            className="h-8 bg-french-blue hover:bg-blue-700 text-white text-xs px-3 shadow-sm font-semibold"
          >
            <Save className="mr-1 h-3.5 w-3.5" />
            <span>Enregistrer</span>
          </Button>

          {canPublish && (
            <Button
              type="button"
              size="sm"
              onClick={() => setIsSuperAdminDeployModalOpen(true)}
              className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 shadow-md font-bold flex items-center gap-1.5 shrink-0"
              title="Publier directement toutes les modifications et déployer sur Vercel (branche main)"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Déployer vers Vercel</span>
            </Button>
          )}

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* User Profile / Role Indicator & Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-all text-left"
              title="Cliquez pour changer de profil ou vous connecter"
            >
              {canDelete ? (
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <User className="h-4 w-4 text-amber-400 shrink-0" />
              )}
              <div className="hidden md:block">
                <p className="text-[11px] font-bold text-white leading-tight truncate max-w-[150px]">
                  {userProfile.email}
                </p>
                <div className="flex items-center gap-1">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${canDelete ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className={`text-[10px] font-semibold leading-none ${canDelete ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {canDelete ? 'Admin (Tous droits)' : 'Éditeur (Modifs sans suppression)'}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:block" />
            </button>

            {/* Notification Badge for Pending Editor Deployments */}
            {pendingDeployment?.status === 'pending_admin_approval' && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  const el = document.getElementById('pending-deploy-banner');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-8 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-2.5 flex items-center gap-1.5 shadow-md animate-pulse ring-2 ring-amber-300"
                title="1 demande de déploiement Vercel en attente par l'éditeur"
              >
                <Bell className="h-3.5 w-3.5 fill-current" />
                <span className="hidden md:inline">1 Déploiement en attente</span>
                <span className="md:hidden">1</span>
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setIsProfileModalOpen(true)}
              title="Connexion / Changer de profil"
              className="h-8 text-xs text-slate-400 hover:text-white hover:bg-slate-800 px-2"
            >
              <Key className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={logout}
              title="Se déconnecter de la session d’administration"
              className="h-8 text-xs text-red-400 hover:text-red-200 hover:bg-red-950/60 border-red-900/60 px-2.5 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 text-red-400" />
              <span className="hidden sm:inline">Se déconnecter</span>
            </Button>

            <Button
              asChild
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800 px-2.5 flex items-center gap-1.5"
            >
              <Link to="/" title="Quitter et revenir au site public">
                <ArrowLeft className="h-3.5 w-3.5 text-french-blue" />
                <span className="hidden lg:inline">Site public</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* SuperAdmin Notification Banner for Editor Deployment Request */}
      {pendingDeployment?.status === 'pending_admin_approval' && (
        <div id="pending-deploy-banner" className="shrink-0 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white px-4 py-3 shadow-md border-b border-amber-600 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-2 z-40">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner shrink-0 animate-pulse">
              <AlertCircle className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-sm text-white flex items-center gap-2 flex-wrap">
                <span>Notification Éditeur : Modifications en attente de déploiement Vercel</span>
                <span className="bg-white/25 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded">
                  Action requise
                </span>
              </p>
              <p className="text-xs text-amber-100 mt-0.5 truncate max-w-2xl">
                L’éditeur <strong>{pendingDeployment.authorName}</strong> ({pendingDeployment.submittedBy}) a préparé des modifications le{' '}
                {new Date(pendingDeployment.submittedAt).toLocaleString('fr-FR')}.
                {pendingDeployment.notes && (
                  <span className="block italic text-white/95 mt-0.5">« {pendingDeployment.notes} »</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setActiveSection('edition-visuelle');
                setVisualExpanded(true);
              }}
              className="bg-white text-amber-950 hover:bg-amber-50 text-xs font-semibold shadow-xs"
            >
              <Eye className="mr-1.5 h-3.5 w-3.5 text-amber-800" /> Vérifier (Aperçu Grand Format)
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleAdminApproveAndDeploy}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" /> {isSaving ? 'Déploiement en cours…' : 'Valider & Déployer sur Vercel'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsRejectModalOpen(true)}
              className="bg-amber-800/40 border-amber-300/40 text-white hover:bg-amber-800/70 text-xs"
            >
              <X className="mr-1 h-3 w-3" /> Demander corrections
            </Button>
          </div>
        </div>
      )}

      {/* Main Admin Flex Wrapper: Left Sidebar + Central Workspace */}
      <div className="flex-1 flex min-h-[calc(100vh-48px)]">
        {/* Left Sidebar (WordPress-style) */}
        <aside
          className={`bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 transition-all duration-200 z-40 ${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          } ${
            isMobileSidebarOpen
              ? 'fixed inset-y-12 left-0 z-50 block shadow-2xl'
              : 'hidden lg:flex'
          }`}
        >
          <div className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-96px)]">
            {dynamicNavigationGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between px-3 pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {group.group}
                    </p>
                    {group.group.includes('RUBRIQUES') && (
                      <button
                        type="button"
                        onClick={() => openCreateRubriqueModal('last')}
                        title="Ajouter une rubrique"
                        className="text-slate-400 hover:text-white hover:bg-slate-800 p-0.5 rounded transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
                {group.items.map(({ id, label, Icon }) => {
                  const isActive = activeSection === id;
                  let badge: string | number | null = null;
                  if (id === 'pages') badge = pages.length;
                  if (id === 'rubriques') badge = rubriques.length;
                  if (id === 'messages') badge = content.home.messages.length;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setActiveSection(id);
                        setIsMobileSidebarOpen(false);
                      }}
                      title={label}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-french-blue text-white shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {!isSidebarCollapsed && (
                        <>
                          <span className="truncate flex-1 text-left">{label}</span>
                          {badge !== null && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer with Active Profile & Collapse Toggle */}
          <div className="p-2 border-t border-slate-800 space-y-2">
            {!isSidebarCollapsed ? (
              <div className="rounded-lg bg-slate-950/80 p-2.5 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${canDelete ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                    {canDelete ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate leading-tight">{userProfile.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{userProfile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/60">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${canDelete ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className={`text-[10px] font-semibold truncate ${canDelete ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {canDelete ? 'Admin (Tous droits)' : 'Éditeur (Sans suppression)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center justify-center gap-1 py-1 px-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 transition-colors"
                  >
                    <Key className="h-3 w-3" />
                    <span>Profils</span>
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center justify-center gap-1 py-1 px-1.5 rounded bg-red-950/60 hover:bg-red-900/80 text-[10px] text-red-300 transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOut className="h-3 w-3 text-red-400" />
                    <span>Quitter</span>
                  </button>
                </div>

                <Link
                  to="/"
                  className="flex items-center justify-center gap-1.5 w-full py-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3 w-3 text-french-blue" />
                  <span>Retour au site public</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-1">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Profils et comptes"
                >
                  <Key className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 rounded text-red-400 hover:text-red-200 hover:bg-red-950/50"
                  title="Se déconnecter"
                >
                  <LogOut className="h-4 w-4" />
                </button>
                <Link
                  to="/"
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Retour au site public"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors hidden lg:flex"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4 mx-auto" />
              ) : (
                <>
                  <PanelLeftClose className="h-4 w-4" />
                  <span>Réduire le menu</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Central Content Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumb & Section Header */}
          {(() => {
            const currentTab = dynamicNavigationGroups.flatMap((g) => g.items).find((t) => t.id === activeSection) || {
              id: activeSection,
              label: activeSection.startsWith('rubrique-') ? (rubriques.find((r) => `rubrique-${r.id}` === activeSection)?.name || 'Rubrique') : activeSection,
              description: activeSection.startsWith('rubrique-') ? (rubriques.find((r) => `rubrique-${r.id}` === activeSection)?.description || 'Gestion des contenus et sous-pages') : '',
            };

            return (
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-french-blue">Administration LFJP</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="capitalize">{currentTab.label}</span>
                  </div>
                  <h1 className="text-2xl font-bold font-playfair text-slate-900 mt-1">
                    {currentTab.label}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentTab.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={previewDraft}
                    className="bg-white hover:bg-slate-50 text-xs"
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5 text-french-blue" /> Aperçu du site
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      saveDraft();
                    }}
                    className="bg-french-blue hover:bg-blue-700 text-white text-xs"
                  >
                    <Save className="mr-1.5 h-3.5 w-3.5" /> Enregistrer le brouillon
                  </Button>
                </div>
              </div>
            );
          })()}

          {/* Real-time Status Alert / Toast Notification */}
          {status && (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-center justify-between gap-2 shadow-sm animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{status}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatus('')}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          )}

          {/* ===================== TAB 1: DASHBOARD ===================== */}
          <Card id="admin-panel-dashboard" role="tabpanel" hidden={activeSection !== 'dashboard'}>
            <CardHeader className="bg-gradient-to-r from-french-blue to-blue-800 text-white rounded-t-lg p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-blue-200 font-bold">
                    <span>Lycée Français Jacques Prévert</span>
                    <span>·</span>
                    <span>Système de Gestion de Contenu (CMS)</span>
                  </div>
                  <CardTitle className="text-2xl font-bold font-playfair mt-1 text-white">
                    Tableau de bord de gestion du site
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-sm mt-1 max-w-2xl">
                    Administrez, créez, modifiez et supprimez l’ensemble des contenus, pages, sous-rubriques, données et plannings du site en temps réel.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setActiveSection('publication');
                    }}
                    className="bg-white text-french-blue hover:bg-blue-50 font-semibold text-xs shadow"
                  >
                    <Send className="mr-1.5 h-3.5 w-3.5" /> Publier vers Vercel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Dynamic Rubriques of the site with full CRUD and reordering */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <FolderTree className="h-4 w-4 text-french-blue" /> Les Rubriques du Site ({rubriques.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Gérez, modifiez, dupliquez, classez et supprimez vos rubriques et accédez à tous leurs contenus et sous-pages.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setRubriqueModalMode('order');
                        setIsRubriqueModalOpen(true);
                      }}
                      className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <ArrowUpDown className="mr-1.5 h-3.5 w-3.5 text-french-blue" />
                      Classer les rubriques
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => openCreateRubriqueModal('last')}
                      className="bg-french-blue hover:bg-blue-700 text-white text-xs font-semibold"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      + Ajouter une rubrique
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {rubriques.map((rubrique, idx) => {
                    const IconComp = RUBRIQUE_ICONS[rubrique.iconName] || Sparkles;
                    const childPagesCount = pages.filter(
                      (p) => p.parent === rubrique.path || (rubrique.path !== '/' && p.slug.startsWith(rubrique.path + '/'))
                    ).length;

                    return (
                      <div
                        key={rubrique.id}
                        className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-french-blue hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="rounded bg-blue-100 text-french-blue text-[11px] font-bold px-2 py-0.5">
                              {rubrique.badge || `Rubrique ${idx + 1}`}
                            </span>
                            <div className="p-1.5 rounded-lg bg-blue-50 text-french-blue group-hover:bg-french-blue group-hover:text-white transition-colors">
                              <IconComp className="h-4 w-4" />
                            </div>
                          </div>

                          <div>
                            <h4 className="font-playfair font-bold text-base text-slate-900 line-clamp-1">
                              {rubrique.name}
                            </h4>
                            <code className="text-[11px] text-slate-500 font-mono block truncate">
                              {rubrique.path}
                            </code>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {rubrique.description}
                            </p>
                          </div>

                          {childPagesCount > 0 && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                              <FolderTree className="h-3 w-3 text-slate-400" />
                              <span>{childPagesCount} sous-page(s)</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t space-y-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setActiveSection(`rubrique-${rubrique.id}`)}
                            className="w-full bg-slate-50 hover:bg-french-blue hover:text-white text-french-blue text-xs font-semibold justify-between h-7 px-2"
                          >
                            <span>Gérer les contenus</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>

                          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100">
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveRubrique(rubrique.id, -1)}
                                title="Monter cette rubrique"
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === rubriques.length - 1}
                                onClick={() => moveRubrique(rubrique.id, 1)}
                                title="Descendre cette rubrique"
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => openEditRubriqueModal(rubrique)}
                                title="Modifier la rubrique"
                                className="p-1 rounded text-slate-500 hover:text-french-blue hover:bg-blue-50"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => duplicateRubrique(rubrique.id)}
                                title="Dupliquer la rubrique"
                                className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={!canDelete}
                                onClick={() => deleteRubrique(rubrique.id)}
                                title={canDelete ? "Supprimer la rubrique" : "Suppression désactivée pour le profil Éditeur Simple"}
                                className={`p-1 rounded transition-colors ${
                                  canDelete
                                    ? "text-red-500 hover:text-red-700 hover:bg-red-50"
                                    : "text-slate-300 cursor-not-allowed"
                                }`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KPIs & Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 rounded-xl border bg-white shadow-sm hover:border-french-blue/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pages & Sous-pages</span>
                    <FileText className="h-5 w-5 text-french-blue" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{pages.length}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {Object.keys(breadcrumbRoutes).length} rubriques officielles au total
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    onClick={() => setActiveSection('pages')}
                    className="p-0 h-auto text-xs text-french-blue font-semibold mt-3"
                  >
                    Gérer l’arborescence →
                  </Button>
                </div>

                <div className="p-4 rounded-xl border bg-white shadow-sm hover:border-french-blue/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rubrique Accueil</span>
                    <Layers3 className="h-5 w-5 text-sky-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{content.home.cards.length} cartes</p>
                  <p className="text-xs text-slate-500 mt-1">{content.home.messages.length} messages et actualités</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    onClick={() => setActiveSection('rubrique-accueil')}
                    className="p-0 h-auto text-xs text-french-blue font-semibold mt-3"
                  >
                    Ouvrir Rubrique Accueil →
                  </Button>
                </div>

                <div className="p-4 rounded-xl border bg-white shadow-sm hover:border-french-blue/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan Stratégique</span>
                    <Target className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">4 Axes (2026-2030)</p>
                  <p className="text-xs text-slate-500 mt-1">Jalons, Bac Blanc & Film Annuel</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    onClick={() => setActiveSection('rubrique-plan-strategique')}
                    className="p-0 h-auto text-xs text-french-blue font-semibold mt-3"
                  >
                    Ouvrir Plan Stratégique →
                  </Button>
                </div>

                <div className="p-4 rounded-xl border bg-white shadow-sm hover:border-french-blue/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Diagnostic & Données</span>
                    <ChartNoAxesCombined className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">Données & Graphes</p>
                  <p className="text-xs text-slate-500 mt-1">Enquête ELCS et Cantine</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    onClick={() => setActiveSection('rubrique-diagnostic')}
                    className="p-0 h-auto text-xs text-french-blue font-semibold mt-3"
                  >
                    Ouvrir Diagnostic & Données →
                  </Button>
                </div>
              </div>

              {/* Raccourcis Rapides (WordPress Quick Actions) */}
              <div className="rounded-xl border bg-slate-50/70 p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-french-blue" /> Actions rapides en 1 clic
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('pages');
                      setPageSubTab('editor');
                      addPage('default');
                    }}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-white text-left hover:border-french-blue hover:shadow-sm transition-all"
                  >
                    <Plus className="h-5 w-5 text-french-blue shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-slate-900">Créer une page principale</p>
                      <p className="text-[11px] text-slate-500">Ajouter une nouvelle page racine avec ses blocs de contenu</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('pages');
                      setPageSubTab('editor');
                      addSubPage();
                    }}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-white text-left hover:border-french-blue hover:shadow-sm transition-all"
                  >
                    <CornerDownRight className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-slate-900">Créer une sous-page</p>
                      <p className="text-[11px] text-slate-500">Rattacher une sous-rubrique à une page parent existante</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('rubrique-accueil');
                      setAccueilSubTab('cards');
                    }}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-white text-left hover:border-french-blue hover:shadow-sm transition-all"
                  >
                    <Layers3 className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-slate-900">Modifier les rubriques d’accueil</p>
                      <p className="text-[11px] text-slate-500">Éditer les cartes, images, liens et textes de la page d’accueil</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('rubrique-diagnostic');
                      setDiagnosticSubTab('restaurant');
                    }}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-white text-left hover:border-french-blue hover:shadow-sm transition-all"
                  >
                    <ChartNoAxesCombined className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-slate-900">Données de la cantine / restaurant</p>
                      <p className="text-[11px] text-slate-500">Mettre à jour les taux de satisfaction et budgets repas</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('rubrique-plan-strategique');
                      setPlanStrategiqueSubTab('bac-blanc');
                    }}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-white text-left hover:border-french-blue hover:shadow-sm transition-all"
                  >
                    <FileText className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-slate-900">Planning du Bac Blanc</p>
                      <p className="text-[11px] text-slate-500">Ajuster les dates, salles, surveillants et consignes</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('edition-visuelle')}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-white text-left hover:border-french-blue hover:shadow-sm transition-all"
                  >
                    <Pencil className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-slate-900">Personnaliser en direct (In-Situ)</p>
                      <p className="text-[11px] text-slate-500">Cliquer sur n’importe quel texte ou image sur le site pour l’éditer</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Workflow GitHub / Vercel Explanatory Card */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-french-blue" />
                  <h4 className="font-bold text-sm text-french-blue">Workflow de mise en ligne sécurisé (Sans base de données)</h4>
                </div>
                <div className="grid gap-4 md:grid-cols-3 text-xs text-slate-600">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">1. Modifications locales</p>
                    <p>Vos ajouts, modifications et suppressions sont instantanément conservés dans le brouillon de votre navigateur.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">2. Prévisualisation sur le site</p>
                    <p>Vous pouvez vous déplacer sur l’ensemble du site pour contrôler le rendu exact avant toute publication.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">3. GitHub ➔ Déploiement Vercel</p>
                    <p>Un clic sur « Créer une Preview » envoie vos fichiers sur GitHub et Vercel déploie la nouvelle version automatiquement.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="admin-panel-identite" role="tabpanel" aria-labelledby="admin-tab-identite" hidden={activeSection !== 'identite'}>
            <CardHeader>
              <CardTitle>Identité, en-tête et pied de page</CardTitle>
              <CardDescription>Ces informations sont partagées par toutes les pages et conservent la mise en forme actuelle du site.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2"><Label>Nom du site</Label><Input value={content.site.name} onChange={(event) => updateSite('name', event.target.value)} /></div>
              <div className="grid gap-2"><Label>Sous-titre</Label><Input value={content.site.tagline} onChange={(event) => updateSite('tagline', event.target.value)} /></div>
              <div className="grid gap-2"><Label>URL du logo ou lien Google Drive public</Label><Input value={content.site.logoUrl} onChange={(event) => updateSite('logoUrl', event.target.value)} /><MediaPreview src={content.site.logoUrl} /><label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-french-blue"><Upload size={16} /> Importer le logo<input className="sr-only" type="file" accept="image/*" onChange={(event) => importContentImage(event.target.files?.[0], (src) => updateSite('logoUrl', src))} /></label></div>
              <div className="grid gap-2"><Label>Texte alternatif du logo</Label><Input value={content.site.logoAlt} onChange={(event) => updateSite('logoAlt', event.target.value)} /></div>
              <div className="grid gap-2"><Label>Symbole du copyright</Label><Input value={content.site.footerCopyrightPrefix} onChange={(event) => updateSite('footerCopyrightPrefix', event.target.value)} placeholder="©" /></div>
              <div className="grid gap-2"><Label>Année du copyright</Label><Input type="number" value={content.site.footerYear} onChange={(event) => updateSite('footerYear', Number(event.target.value) || new Date().getFullYear())} /></div>
              <div className="grid gap-2"><Label>Texte du copyright</Label><Input value={content.site.footerCopyright} onChange={(event) => updateSite('footerCopyright', event.target.value)} /></div>
              <div className="grid gap-2"><Label>Texte complémentaire du pied de page</Label><Input value={content.site.footerPlan} onChange={(event) => updateSite('footerPlan', event.target.value)} /></div>
            </CardContent>
          </Card>

          {/* ===================== RUBRIQUE 1: ACCUEIL ===================== */}
          <Card
            id="admin-panel-rubrique-accueil"
            role="tabpanel"
            aria-labelledby="admin-tab-rubrique-accueil"
            hidden={activeSection !== 'rubrique-accueil' && activeSection !== 'accueil' && activeSection !== 'rubriques' && activeSection !== 'messages'}
          >
            <CardHeader className="border-b bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-french-blue border border-blue-200">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl text-french-blue font-playfair font-bold">
                        1. Rubrique Accueil
                      </CardTitle>
                      <span className="rounded bg-blue-100 text-french-blue text-xs font-semibold px-2 py-0.5">
                        Racine (/)
                      </span>
                    </div>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Gérez les cartes des rubriques phares, communications officielles, messages de direction, textes du Hero et sous-pages rattachées.
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="text-xs">
                    <a href="/?draft=1" target="_blank" rel="noreferrer">
                      <Eye className="mr-1.5 h-3.5 w-3.5 text-french-blue" /> Voir l’accueil
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openRubriqueEditor('/', 'Accueil', undefined, 'rubrique-accueil')}
                    className="text-xs text-french-blue hover:bg-blue-50"
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Modifier les blocs de la page
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addSubPage('/', 'rubrique-accueil')}
                    className="bg-french-blue hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    <CornerDownRight className="mr-1.5 h-3.5 w-3.5" /> + Sous-page
                  </Button>
                </div>
              </div>

              {/* Sub-tab navigation for Rubrique Accueil */}
              <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t">
                {[
                  { id: 'cards', label: `🗂️ Cartes des rubriques (${content.home.cards.length})` },
                  { id: 'messages', label: `📰 Mots officiels & Communications (${content.home.messages.length})` },
                  { id: 'hero', label: '✨ Titres & Textes du Hero' },
                  { id: 'subpages', label: '📄 Sous-pages de l’Accueil' },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    type="button"
                    size="sm"
                    variant={accueilSubTab === tab.id ? 'default' : 'outline'}
                    onClick={() => setAccueilSubTab(tab.id as typeof accueilSubTab)}
                    className={accueilSubTab === tab.id ? 'bg-french-blue text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50'}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              {/* Sub-tab 1: Cartes Rubriques */}
              {accueilSubTab === 'cards' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-french-blue">Cartes des rubriques phares</h4>
                      <p className="text-xs text-slate-500">Cartes thématiques avec liens, dégradés et images affichées sur la page d’accueil.</p>
                    </div>
                    <Button type="button" size="sm" onClick={addCard} className="bg-french-blue hover:bg-blue-700 text-xs">
                      <Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter une rubrique
                    </Button>
                  </div>

                  {content.home.cards.map((card, index) => (
                    <div key={`card-${index}`} className="grid gap-3 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-2">
                      <div className="flex items-center justify-between gap-2 md:col-span-2 border-b pb-2">
                        <span className="font-semibold text-french-blue">Rubrique {index + 1} : {card.title || 'Sans titre'}</span>
                        <div className="flex items-center gap-1">
                          <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveCard(index, -1)} disabled={index === 0}>
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveCard(index, 1)} disabled={index === content.home.cards.length - 1}>
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button type="button" size="sm" variant="outline" title="Dupliquer" onClick={() => duplicateCard(index)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => {
                            if (window.confirm(`Supprimer la rubrique « ${card.title} » ?`)) removeCard(index);
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-2"><Label>Titre</Label><Input value={card.title} onChange={(event) => updateCard(index, 'title', event.target.value)} /></div>
                      <div className="grid gap-2"><Label>Chemin interne</Label><Input value={card.path} onChange={(event) => updateCard(index, 'path', event.target.value)} /></div>
                      <div className="grid gap-2 md:col-span-2"><Label>Description</Label><Textarea value={card.description} onChange={(event) => updateCard(index, 'description', event.target.value)} /></div>
                      <div className="grid gap-2"><Label>Texte du lien</Label><Input value={card.linkLabel} onChange={(event) => updateCard(index, 'linkLabel', event.target.value)} /></div>
                      <div className="grid gap-2"><Label>Image de la rubrique</Label><Input value={card.image || ''} onChange={(event) => updateCard(index, 'image', event.target.value)} /><MediaPreview src={card.image || ''} /><label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-french-blue"><Upload size={16} /> Importer une image<input className="sr-only" type="file" accept="image/*" onChange={(event) => importContentImage(event.target.files?.[0], (src) => updateCard(index, 'image', src))} /></label></div>
                      <div className="md:col-span-2"><TextStyleToolbar style={card.style} onChange={(patch) => updateCardStyle(index, patch)} /></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 2: Messages & Mots officiels */}
              {accueilSubTab === 'messages' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-french-blue">Communications officielles et messages</h4>
                      <p className="text-xs text-slate-500">Mots du proviseur, du SCAC, et actualités majeures présentés sur l’accueil.</p>
                    </div>
                    <Button type="button" size="sm" onClick={addMessage} className="bg-french-blue hover:bg-blue-700 text-xs">
                      <Plus className="mr-1.5 h-4 w-4" /> Nouveau message
                    </Button>
                  </div>

                  {content.home.messages.map((message, index) => (
                    <div key={`message-${index}`} className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                        <div className="flex items-center gap-2 text-french-blue font-bold">
                          <Image size={18} />
                          <h3>{message.title || `Message ${index + 1}`}</h3>
                          {message.eyebrow && <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-french-blue">{message.eyebrow}</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveMessage(index, -1)} disabled={index === 0}>
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveMessage(index, 1)} disabled={index === content.home.messages.length - 1}>
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button type="button" size="sm" variant="outline" title="Dupliquer" onClick={() => duplicateMessage(index)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => removeMessage(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2"><Label>Rubrique / Surtitre (eyebrow)</Label><Input value={message.eyebrow} onChange={(event) => updateMessage(index, 'eyebrow', event.target.value)} placeholder="Ex: Mot du proviseur, Actualité..." /></div>
                        <div className="grid gap-2"><Label>Titre du message</Label><Input value={message.title} onChange={(event) => updateMessage(index, 'title', event.target.value)} /></div>
                      </div>

                      <div className="grid gap-3">
                        <Label>URL de l’image ou lien Google Drive public</Label>
                        <Input value={message.image} onChange={(event) => updateMessage(index, 'image', event.target.value)} placeholder="https://..." />
                        <MediaPreview src={message.image} />
                        <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-french-blue hover:bg-blue-50">
                          <Upload size={16} /> Importer une image
                          <input className="sr-only" type="file" accept="image/*" onChange={(event) => importContentImage(event.target.files?.[0], (src) => updateMessage(index, 'image', src))} />
                        </label>
                      </div>

                      <div className="grid gap-2">
                        <Label>Description de l’image (texte alternatif)</Label>
                        <Input value={message.imageAlt} onChange={(event) => updateMessage(index, 'imageAlt', event.target.value)} />
                      </div>

                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <input type="checkbox" checked={Boolean(message.wide)} onChange={(event) => updateMessage(index, 'wide', event.target.checked)} className="rounded border-slate-300" />
                        Afficher en format pleine largeur sur la page d’accueil
                      </label>

                      <div className="space-y-3 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold text-slate-900">Paragraphes du message ({message.paragraphs.length})</Label>
                          <Button type="button" size="sm" variant="outline" onClick={() => addMessageArrayItem(index, 'paragraphs')}>+ Ajouter un paragraphe</Button>
                        </div>
                        {message.paragraphs.map((paragraph, paragraphIndex) => (
                          <div key={`paragraph-${paragraphIndex}`} className="flex gap-2">
                            <Textarea className="min-h-[90px]" value={paragraph} onChange={(event) => updateMessageArray(index, 'paragraphs', paragraphIndex, event.target.value)} aria-label={`Paragraphe ${paragraphIndex + 1}`} />
                            <Button type="button" size="sm" variant="ghost" onClick={() => removeMessageArrayItem(index, 'paragraphs', paragraphIndex)} aria-label={`Supprimer le paragraphe ${paragraphIndex + 1}`} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold text-slate-900">Signature / Auteurs</Label>
                          <Button type="button" size="sm" variant="outline" onClick={() => addMessageArrayItem(index, 'signature')}>+ Ajouter une ligne de signature</Button>
                        </div>
                        {message.signature.map((line, lineIndex) => (
                          <div key={`signature-${lineIndex}`} className="flex gap-2">
                            <Input value={line} onChange={(event) => updateMessageArray(index, 'signature', lineIndex, event.target.value)} aria-label={`Ligne de signature ${lineIndex + 1}`} />
                            <Button type="button" size="sm" variant="ghost" onClick={() => removeMessageArrayItem(index, 'signature', lineIndex)} aria-label={`Supprimer la ligne ${lineIndex + 1}`} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 3: Hero & Titres */}
              {accueilSubTab === 'hero' && (
                <div className="space-y-5 rounded-xl border bg-white p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-french-blue border-b pb-2">Textes du Hero d’accueil</h4>
                  <div className="grid gap-2">
                    <Label htmlFor="hero-title">Titre principal</Label>
                    <Input id="hero-title" value={content.home.heroTitle} onChange={(event) => updateHome('heroTitle', event.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hero-subtitle">Sous-titre / Devise</Label>
                    <Input id="hero-subtitle" value={content.home.heroSubtitle} onChange={(event) => updateHome('heroSubtitle', event.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="section-title">Titre de la section principale</Label>
                    <Input id="section-title" value={content.home.sectionTitle} onChange={(event) => updateHome('sectionTitle', event.target.value)} />
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Sous-pages rattachées */}
              {accueilSubTab === 'subpages' && renderRubriqueSubpages('accueil', '/', 'Accueil')}
            </CardContent>
          </Card>

          {/* ===================== RUBRIQUE 2: MÉTHODE ===================== */}
          <Card
            id="admin-panel-rubrique-methode"
            role="tabpanel"
            aria-labelledby="admin-tab-rubrique-methode"
            hidden={activeSection !== 'rubrique-methode' && activeSection !== 'methode'}
          >
            <CardHeader className="border-b bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
                    <Sliders className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl text-sky-900 font-playfair font-bold">
                        2. Rubrique Méthode & Gouvernance
                      </CardTitle>
                      <span className="rounded bg-sky-100 text-sky-800 text-xs font-semibold px-2 py-0.5">
                        Pilier 1 (/methode)
                      </span>
                    </div>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Démarche participative en 7 étapes, comités de pilotage, calendrier de concertation et sous-pages méthodologiques.
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="text-xs">
                    <a href="/methode?draft=1" target="_blank" rel="noreferrer">
                      <Eye className="mr-1.5 h-3.5 w-3.5 text-sky-600" /> Voir la page
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openRubriqueEditor('/methode', 'Méthode', undefined, 'rubrique-methode')}
                    className="text-xs text-sky-700 hover:bg-sky-50 border-sky-300"
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Modifier les blocs de la page
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addSubPage('/methode', 'rubrique-methode')}
                    className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold"
                  >
                    <CornerDownRight className="mr-1.5 h-3.5 w-3.5" /> + Sous-page
                  </Button>
                </div>
              </div>

              {/* Sub-tab navigation for Rubrique Méthode */}
              <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t">
                {[
                  { id: 'content', label: '🧭 Démarche & Textes de Cadrage' },
                  { id: 'calendrier', label: '📅 Calendrier de concertation & Jalons' },
                  { id: 'subpages', label: '📄 Sous-pages & Documents de Méthode' },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    type="button"
                    size="sm"
                    variant={methodeSubTab === tab.id ? 'default' : 'outline'}
                    onClick={() => setMethodeSubTab(tab.id as typeof methodeSubTab)}
                    className={methodeSubTab === tab.id ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50'}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              {methodeSubTab === 'content' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-5 space-y-3">
                    <h4 className="font-bold text-sm text-sky-900 flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-sky-600" /> La démarche d'élaboration participative en 7 étapes
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      La méthode du Plan Stratégique de Développement (PSD) 2026-2030 repose sur une gouvernance concertée associant enseignants, parents d’élèves, personnels non-enseignants, élèves et partenaires institutionnels (AEFE, Ambassade de France, SCAC).
                    </p>
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                      {[
                        { step: '1', title: 'Cadrage stratégique', desc: 'Définition des orientations prioritaires et du calendrier' },
                        { step: '2', title: 'Diagnostic partagé', desc: 'Enquêtes ELCS, cantine, indicateurs et état des lieux' },
                        { step: '3', title: 'Ateliers de concertation', desc: 'Groupes de travail thématiques avec toutes les parties prenantes' },
                        { step: '4', title: 'Rédaction des 4 axes', desc: 'Déclinaison des objectifs opérationnels et fiches projets' },
                        { step: '5', title: 'Chiffrage & Jalons', desc: 'Budgétisation pluriannuelle et programmation temporelle' },
                        { step: '6', title: 'Validation démocratique', desc: 'Approbation en Conseil d’Établissement et transmission AEFE' },
                      ].map((item) => (
                        <div key={item.step} className="p-3 rounded-lg border bg-white text-xs">
                          <span className="font-bold text-sky-700">Étape {item.step} :</span>
                          <span className="font-semibold text-slate-900 ml-1">{item.title}</span>
                          <p className="text-slate-500 mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">Éditer les blocs de contenu de la page Méthode</h4>
                        <p className="text-xs text-slate-500">Ajoutez des paragraphes, des sections, des graphiques ou des citations.</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => openRubriqueEditor('/methode', 'Méthode', undefined, 'rubrique-methode')}
                        className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold"
                      >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" /> Ouvrir l’éditeur de blocs
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {methodeSubTab === 'calendrier' && (
                <div className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-sky-900">Calendrier de concertation & jalons de méthode</h4>
                      <p className="text-xs text-slate-500">Consultez et complétez les phases et échéances de concertation.</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => openRubriqueEditor('/methode/calendrier', 'Calendrier de concertation', '/methode', 'rubrique-methode')}
                      className="text-xs text-sky-700"
                    >
                      <Pencil className="mr-1 h-3 w-3" /> Éditer la page Calendrier
                    </Button>
                  </div>
                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="p-3 rounded-lg bg-slate-50 border">
                      <span className="font-bold text-french-blue">Phase 1 : Septembre – Octobre 2025</span>
                      <p className="mt-0.5 text-slate-600">Lancement des comités de pilotage, cadrage méthodologique et passation des enquêtes ELCS et restauration.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border">
                      <span className="font-bold text-french-blue">Phase 2 : Novembre – Décembre 2025</span>
                      <p className="mt-0.5 text-slate-600">Restitution des résultats d'enquêtes, ateliers participatifs et groupes de travail thématiques par cycle.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border">
                      <span className="font-bold text-french-blue">Phase 3 : Janvier – Mars 2026</span>
                      <p className="mt-0.5 text-slate-600">Rédaction des 4 axes stratégiques, élaboration des fiches actions et validation finale en Conseil d'Établissement.</p>
                    </div>
                  </div>
                </div>
              )}

              {methodeSubTab === 'subpages' && renderRubriqueSubpages('methode', '/methode', 'Méthode')}
            </CardContent>
          </Card>

          {/* ===================== RUBRIQUE 3: VISION, MISSIONS & VALEURS ===================== */}
          <Card
            id="admin-panel-rubrique-vision"
            role="tabpanel"
            aria-labelledby="admin-tab-rubrique-vision"
            hidden={activeSection !== 'rubrique-vision' && activeSection !== 'vision'}
          >
            <CardHeader className="border-b bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl text-rose-950 font-playfair font-bold">
                        3. Rubrique Vision, Missions & Valeurs
                      </CardTitle>
                      <span className="rounded bg-rose-100 text-rose-800 text-xs font-semibold px-2 py-0.5">
                        Pilier 2 (/vision-missions-valeurs)
                      </span>
                    </div>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Vision directrice 2030, {content.visionMissionsValeurs.missions.length} missions prioritaires et {content.visionMissionsValeurs.values.length} valeurs fondamentales.
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="text-xs">
                    <a href="/vision-missions-valeurs?draft=1" target="_blank" rel="noreferrer">
                      <Eye className="mr-1.5 h-3.5 w-3.5 text-rose-600" /> Voir la page
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openRubriqueEditor('/vision-missions-valeurs', 'Vision, Missions & Valeurs', undefined, 'rubrique-vision')}
                    className="text-xs text-rose-700 hover:bg-rose-50 border-rose-300"
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Modifier les blocs de la page
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addSubPage('/vision-missions-valeurs', 'rubrique-vision')}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                  >
                    <CornerDownRight className="mr-1.5 h-3.5 w-3.5" /> + Sous-page
                  </Button>
                </div>
              </div>

              {/* Sub-tab navigation for Rubrique Vision */}
              <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t">
                {[
                  { id: 'vision', label: `👁️ 1. Notre Vision (${content.visionMissionsValeurs.vision.length})` },
                  { id: 'missions', label: `🎯 2. Nos Missions (${content.visionMissionsValeurs.missions.length})` },
                  { id: 'valeurs', label: `💎 3. Nos Valeurs (${content.visionMissionsValeurs.values.length})` },
                  { id: 'subpages', label: '📄 Sous-pages & Fiches de Vision' },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    type="button"
                    size="sm"
                    variant={visionSubTab === tab.id ? 'default' : 'outline'}
                    onClick={() => setVisionSubTab(tab.id as typeof visionSubTab)}
                    className={visionSubTab === tab.id ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50'}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              {/* Sub-tab 1: Vision */}
              {visionSubTab === 'vision' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-french-blue">Vision directrice à l’horizon 2030</h4>
                      <p className="text-xs text-slate-500">Paragraphes décrivant l’ambition globale du LFJP.</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, vision: [...current.visionMissionsValeurs.vision, 'Nouveau paragraphe de vision.'] } }))}>
                      <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter un paragraphe
                    </Button>
                  </div>
                  {content.visionMissionsValeurs.vision.map((paragraph, index) => (
                    <div key={`vision-${index}`} className="flex items-start gap-2 rounded-lg border bg-slate-50 p-3 shadow-sm">
                      <div className="flex-1">
                        <Label className="text-xs text-slate-500 mb-1 block">Paragraphe {index + 1}</Label>
                        <Textarea className="bg-white min-h-[90px]" value={paragraph} onChange={(event) => updateVisionParagraph(index, event.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1 pt-5">
                        <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveVisionParagraph(index, -1)} disabled={index === 0}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveVisionParagraph(index, 1)} disabled={index === content.visionMissionsValeurs.vision.length - 1}>
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, vision: current.visionMissionsValeurs.vision.filter((_, itemIndex) => itemIndex !== index) } }))}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 2: Missions */}
              {visionSubTab === 'missions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-french-blue">Missions éducatives & institutionnelles ({content.visionMissionsValeurs.missions.length})</h4>
                      <p className="text-xs text-slate-500">Missions prioritaires portées par l’établissement.</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, missions: [...current.visionMissionsValeurs.missions, 'Nouvelle mission.'] } }))}>
                      <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter une mission
                    </Button>
                  </div>
                  {content.visionMissionsValeurs.missions.map((mission, index) => (
                    <div key={`mission-${index}`} className="flex items-start gap-3 rounded-lg border bg-slate-50 p-3 shadow-sm">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-french-blue text-xs font-bold text-white mt-1">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <Textarea className="bg-white min-h-[60px]" value={mission} onChange={(event) => updateMission(index, event.target.value)} aria-label={`Mission ${index + 1}`} />
                      </div>
                      <div className="flex items-center gap-1 pt-1">
                        <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveMission(index, -1)} disabled={index === 0}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveMission(index, 1)} disabled={index === content.visionMissionsValeurs.missions.length - 1}>
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button type="button" size="sm" variant="outline" title="Dupliquer" onClick={() => duplicateMission(index)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, missions: current.visionMissionsValeurs.missions.filter((_, itemIndex) => itemIndex !== index) } }))}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 3: Valeurs */}
              {visionSubTab === 'valeurs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-french-blue">Nos 5 Valeurs Fondamentales ({content.visionMissionsValeurs.values.length})</h4>
                      <p className="text-xs text-slate-500">Valeurs partagées par toute la communauté éducative du LFJP.</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, values: [...current.visionMissionsValeurs.values, { name: 'Nouvelle valeur', description: 'Description de la valeur.' }] } }))}>
                      <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter une valeur
                    </Button>
                  </div>
                  {content.visionMissionsValeurs.values.map((value, index) => (
                    <div key={`value-${index}`} className="space-y-3 rounded-lg border bg-slate-50 p-4 shadow-sm">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="font-semibold text-french-blue text-sm">Valeur {index + 1} : {value.name || 'Sans nom'}</span>
                        <div className="flex items-center gap-1">
                          <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveValue(index, -1)} disabled={index === 0}>
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveValue(index, 1)} disabled={index === content.visionMissionsValeurs.values.length - 1}>
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" size="sm" variant="outline" title="Dupliquer" onClick={() => duplicateValue(index)}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, values: current.visionMissionsValeurs.values.filter((_, itemIndex) => itemIndex !== index) } }))}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-3 md:grid-cols-[200px_minmax(0,1fr)]">
                        <div>
                          <Label className="text-xs">Nom de la valeur</Label>
                          <Input className="bg-white mt-1" value={value.name} onChange={(event) => updateValue(index, 'name', event.target.value)} aria-label={`Nom de la valeur ${index + 1}`} />
                        </div>
                        <div>
                          <Label className="text-xs">Description</Label>
                          <Textarea className="bg-white mt-1" value={value.description} onChange={(event) => updateValue(index, 'description', event.target.value)} aria-label={`Description de la valeur ${index + 1}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 4: Sous-pages */}
              {visionSubTab === 'subpages' && renderRubriqueSubpages('vision', '/vision-missions-valeurs', 'Vision, Missions & Valeurs')}
            </CardContent>
          </Card>

          {/* ===================== RUBRIQUE 4: DIAGNOSTIC & DONNÉES ===================== */}
          <Card
            id="admin-panel-rubrique-diagnostic"
            role="tabpanel"
            aria-labelledby="admin-tab-rubrique-diagnostic"
            hidden={activeSection !== 'rubrique-diagnostic' && activeSection !== 'diagnostic' && activeSection !== 'donnees-pages'}
          >
            <CardHeader className="border-b bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
                    <ChartNoAxesCombined className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl text-purple-950 font-playfair font-bold">
                        4. Rubrique Diagnostic, Enquêtes & Données Chiffrées
                      </CardTitle>
                      <span className="rounded bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5">
                        Pilier 3 (/diagnostic)
                      </span>
                    </div>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Toutes les données chiffrées, graphiques interactifs, enquêtes élèves/parents (ELCS) et restauration scolaire réunies directement dans leur rubrique.
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="text-xs">
                    <a href="/diagnostic?draft=1" target="_blank" rel="noreferrer">
                      <Eye className="mr-1.5 h-3.5 w-3.5 text-purple-600" /> Voir le diagnostic
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openRubriqueEditor('/diagnostic', 'Diagnostic', undefined, 'rubrique-diagnostic')}
                    className="text-xs text-purple-700 hover:bg-purple-50 border-purple-300"
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Modifier les blocs de la page
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addSubPage('/diagnostic', 'rubrique-diagnostic')}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
                  >
                    <CornerDownRight className="mr-1.5 h-3.5 w-3.5" /> + Sous-page
                  </Button>
                </div>
              </div>

              {/* Sub-tab navigation for Rubrique Diagnostic */}
              <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t">
                {[
                  { id: 'elcs', label: '🏫 Climat Scolaire (ELCS)' },
                  { id: 'restaurant', label: '🍽️ Restauration & Cantine' },
                  { id: 'rapports', label: '📑 Synthèse & Rapports' },
                  { id: 'subpages', label: '📄 Sous-pages du Diagnostic' },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    type="button"
                    size="sm"
                    variant={diagnosticSubTab === tab.id ? 'default' : 'outline'}
                    onClick={() => setDiagnosticSubTab(tab.id as typeof diagnosticSubTab)}
                    className={diagnosticSubTab === tab.id ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50'}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              {/* Sub-tab 1: ELCS */}
              {diagnosticSubTab === 'elcs' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-emerald-900">Enquête Climat Scolaire (ELCS)</h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Indicateurs de satisfaction des élèves et des parents avec comparaison aux moyennes et jauges visuelles en direct.
                      </p>
                    </div>
                  </div>

                  {Object.entries(getEditablePageData().elcsData as Record<string, Record<string, unknown>>).map(([categoryKey, category]) => (
                    <div key={categoryKey} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                      <div className="grid gap-1.5 border-b pb-3">
                        <Label className="font-bold text-sm text-slate-800">Titre de la catégorie</Label>
                        <Input
                          value={String(category.title || '')}
                          onChange={(event) => updateElcsTitle(categoryKey, event.target.value)}
                          className="font-semibold text-french-blue"
                        />
                      </div>

                      {(['primary', 'secondary'] as const).map((group) => (
                        <div key={group} className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              {group === 'primary' ? 'Indicateurs principaux (barres de progression)' : 'Points d’attention / Alertes'}
                            </h4>
                            <Button type="button" size="sm" variant="outline" onClick={() => addElcsMetric(categoryKey, group)} className="text-xs h-8">
                              <Plus className="mr-1 h-3 w-3" /> Ajouter un indicateur
                            </Button>
                          </div>

                          {(category[group] as Record<string, unknown>[]).map((metric, rowIndex) => (
                            <div key={`${group}-${rowIndex}`} className="space-y-2 rounded-lg border bg-slate-50 p-3">
                              <div className="grid gap-2 sm:grid-cols-[1.5fr_110px_1fr_100px_110px_auto]">
                                <Input
                                  aria-label="Nom de l’indicateur"
                                  value={String(metric.name || '')}
                                  onChange={(event) => updateElcsMetric(categoryKey, group, rowIndex, 'name', event.target.value)}
                                  placeholder="Indicateur"
                                  className="bg-white text-xs h-8"
                                />
                                <Input
                                  aria-label="Valeur de l’indicateur"
                                  value={String(metric.value ?? '')}
                                  onChange={(event) => updateElcsMetric(categoryKey, group, rowIndex, 'value', event.target.value)}
                                  placeholder="Valeur %"
                                  className="bg-white text-xs h-8"
                                />
                                <Input
                                  aria-label="Précision de l’indicateur"
                                  value={String(metric.label || '')}
                                  onChange={(event) => updateElcsMetric(categoryKey, group, rowIndex, 'label', event.target.value)}
                                  placeholder="Précision"
                                  className="bg-white text-xs h-8"
                                />
                                <Input
                                  aria-label="Moyenne comparée"
                                  type="number"
                                  step="any"
                                  value={metric.average === undefined ? '' : Number(metric.average)}
                                  onChange={(event) => updateElcsMetric(categoryKey, group, rowIndex, 'average', event.target.value)}
                                  placeholder="Moyenne"
                                  className="bg-white text-xs h-8"
                                />
                                <select
                                  className="h-8 rounded-md border bg-white px-2 text-xs"
                                  aria-label="Tendance"
                                  value={String(metric.trend || 'up')}
                                  onChange={(event) => updateElcsMetric(categoryKey, group, rowIndex, 'trend', event.target.value)}
                                >
                                  <option value="up">Progression ↑</option>
                                  <option value="down">Baisse ↓</option>
                                </select>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeElcsMetric(categoryKey, group, rowIndex)}
                                  aria-label="Supprimer l’indicateur"
                                  className="h-8 w-8 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>

                              {/* Live Graphical Preview Bar */}
                              {metric.value !== undefined && Number(metric.value) > 0 && (
                                <div className="flex items-center gap-2 pt-1">
                                  <span className="text-[10px] font-semibold text-slate-500">Jauge en direct :</span>
                                  <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                      style={{ width: `${Math.min(100, Math.max(0, Number(metric.value)))}%` }}
                                    />
                                  </div>
                                  <span className="text-[11px] font-bold text-emerald-700">{Number(metric.value)}%</span>
                                  {metric.average !== undefined && (
                                    <span className="text-[10px] text-slate-500">(Moyenne : {Number(metric.average)}%)</span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 2: Restauration */}
              {diagnosticSubTab === 'restaurant' && (
                <div className="space-y-8">
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-french-blue">Enquête Restauration Scolaire</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Modifiez les pourcentages, réponses ou budgets. Les jauges visuelles et graphiques du site s’adaptent automatiquement.
                      </p>
                    </div>
                  </div>

                  {restaurantEditorGroups.map((group) => (
                    <section key={group.title} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                      <h3 className="border-b pb-2 text-base font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-french-blue" /> {group.title}
                      </h3>
                      {group.datasets.map((dataset) => {
                        const rows = getRestaurantRows(dataset.key);
                        return (
                          <div key={dataset.key} className="space-y-3 pt-2">
                            <div className="flex items-center justify-between gap-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                {dataset.label} ({rows.length} lignes)
                              </h4>
                              <Button type="button" size="sm" variant="outline" onClick={() => addRestaurantRow(dataset.key)} className="text-xs h-8">
                                <Plus className="mr-1 h-3 w-3" /> Ajouter une ligne
                              </Button>
                            </div>
                            <div className="overflow-x-auto rounded-lg border">
                              <table className="w-full min-w-[640px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs text-slate-600 border-b">
                                  <tr>
                                    {dataset.fields.map((field) => (
                                      <th key={field.key} className="px-3 py-2.5 font-semibold">
                                        {field.label}
                                      </th>
                                    ))}
                                    <th className="px-3 py-2.5 font-semibold w-36">Jauge visuelle</th>
                                    <th className="w-16 px-3 py-2.5 text-right font-semibold">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {rows.map((row, rowIndex) => {
                                    const percentVal = typeof row.percentage === 'number'
                                      ? Number(row.percentage)
                                      : typeof row.value === 'number'
                                      ? Number(row.value)
                                      : null;

                                    return (
                                      <tr key={`${dataset.key}-${rowIndex}`} className="hover:bg-slate-50/70 transition-colors">
                                        {dataset.fields.map((field) => (
                                          <td key={field.key} className="px-2 py-2">
                                            <Input
                                              aria-label={`${dataset.label}, ${field.label}, ligne ${rowIndex + 1}`}
                                              type={field.type || 'text'}
                                              step={field.type === 'number' ? 'any' : undefined}
                                              value={String(row[field.key] ?? '')}
                                              onChange={(event) => updateRestaurantRow(dataset.key, rowIndex, field.key, event.target.value)}
                                              className="h-8 min-w-24 bg-white text-xs"
                                            />
                                          </td>
                                        ))}
                                        <td className="px-3 py-2">
                                          {percentVal !== null && percentVal >= 0 && (
                                            <div className="flex items-center gap-2">
                                              <div className="h-2 flex-1 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                                                <div
                                                  className="h-full rounded-full bg-french-blue transition-all duration-300"
                                                  style={{ width: `${Math.min(100, Math.max(0, percentVal))}%` }}
                                                />
                                              </div>
                                              <span className="text-[10px] font-bold text-french-blue w-8 text-right">
                                                {percentVal}%
                                              </span>
                                            </div>
                                          )}
                                        </td>
                                        <td className="px-2 py-2 text-right">
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => removeRestaurantRow(dataset.key, rowIndex)}
                                            aria-label={`Supprimer ${dataset.label}, ligne ${rowIndex + 1}`}
                                            className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </section>
                  ))}
                </div>
              )}

              {/* Sub-tab 3: Rapports & Synthèse */}
              {diagnosticSubTab === 'rapports' && (
                <div className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                  <div className="border-b pb-3">
                    <h4 className="font-bold text-sm text-purple-900">Rapports & Synthèses de Diagnostic</h4>
                    <p className="text-xs text-slate-500">Points forts et axes d'amélioration issus des consultations.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                      <h5 className="font-bold text-emerald-900 text-xs uppercase tracking-wide">Points forts identifiés</h5>
                      <ul className="mt-2 space-y-1.5 text-xs text-emerald-800 list-disc list-inside">
                        <li>Excellence des résultats aux examens (DNB & Baccalauréat)</li>
                        <li>Cadre de vie scolaire convivial et bienveillant</li>
                        <li>Forte implication des équipes pédagogiques</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <h5 className="font-bold text-amber-900 text-xs uppercase tracking-wide">Priorités de développement</h5>
                      <ul className="mt-2 space-y-1.5 text-xs text-amber-800 list-disc list-inside">
                        <li>Amélioration de la restauration scolaire (construction cantine)</li>
                        <li>Modernisation des équipements numériques (1 PC / lycéen)</li>
                        <li>Couverture et réaménagement des installations sportives</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Sous-pages */}
              {diagnosticSubTab === 'subpages' && renderRubriqueSubpages('diagnostic', '/diagnostic', 'Diagnostic')}
            </CardContent>
          </Card>

          {/* ===================== RUBRIQUE 5: PLAN STRATÉGIQUE (4 AXES) ===================== */}
          <Card
            id="admin-panel-rubrique-plan-strategique"
            role="tabpanel"
            aria-labelledby="admin-tab-rubrique-plan-strategique"
            hidden={activeSection !== 'rubrique-plan-strategique' && activeSection !== 'plan-strategique'}
          >
            <CardHeader className="border-b bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl text-emerald-950 font-playfair font-bold">
                        5. Rubrique Plan Stratégique de Développement (2026–2030)
                      </CardTitle>
                      <span className="rounded bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5">
                        Pilier 4 (/plan-strategique)
                      </span>
                    </div>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Gérez les 4 axes stratégiques, jalons temporels, fiches projets, organisation du Bac Blanc et Films Annuels.
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="text-xs">
                    <a href="/plan-strategique?draft=1" target="_blank" rel="noreferrer">
                      <Eye className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Voir le plan
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openRubriqueEditor('/plan-strategique', 'Plan Stratégique', undefined, 'rubrique-plan-strategique')}
                    className="text-xs text-emerald-700 hover:bg-emerald-50 border-emerald-300"
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Modifier les blocs de la page
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addSubPage('/plan-strategique', 'rubrique-plan-strategique')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    <CornerDownRight className="mr-1.5 h-3.5 w-3.5" /> + Sous-page
                  </Button>
                </div>
              </div>

              {/* Sub-tab navigation for Rubrique Plan Stratégique */}
              <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t">
                {[
                  { id: 'axes', label: '🎯 Les 4 Axes Stratégiques & Jalons (2026-2030)' },
                  { id: 'budgets', label: '💰 Budgets & Investissements Cadre de Vie' },
                  { id: 'transports', label: '🚌 Transport Scolaire & Données Familles' },
                  { id: 'bac-blanc', label: '🎓 Organisation du Bac Blanc' },
                  { id: 'film-annuel', label: '📅 Films Annuels par Cycle' },
                  { id: 'subpages', label: '📄 Fiches Projets & Sous-pages des 4 Axes' },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    type="button"
                    size="sm"
                    variant={planStrategiqueSubTab === tab.id ? 'default' : 'outline'}
                    onClick={() => setPlanStrategiqueSubTab(tab.id as typeof planStrategiqueSubTab)}
                    className={planStrategiqueSubTab === tab.id ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50'}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              {/* Sub-tab 1: 4 Axes & Jalons */}
              {planStrategiqueSubTab === 'axes' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2 border-b pb-3">
                    {[
                      { id: 'axe1', label: 'Axe 1 : Cadre de vie, bien-être et santé' },
                      { id: 'axe2', label: 'Axe 2 : Langues, interculturalité & international' },
                      { id: 'axe3', label: 'Axe 3 : Numérique, innovation & parcours' },
                      { id: 'axe4', label: 'Axe 4 : Réussites, citoyenneté & avenir' },
                    ].map(({ id, label }) => (
                      <Button
                        key={id}
                        type="button"
                        size="sm"
                        variant={selectedPsdAxis === id ? 'default' : 'outline'}
                        onClick={() => setSelectedPsdAxis(id as 'axe1' | 'axe2' | 'axe3' | 'axe4')}
                        className={selectedPsdAxis === id ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50'}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>

                  {(() => {
                    const currentData = getEditablePageData();
                    const timelines = currentData.psdTimelines as Record<string, { title?: string; startYear: number; endYear: number; actions: { title: string; description: string; start: number; end: number; color?: string }[] }>;
                    const axisData = timelines[selectedPsdAxis] || { title: 'Axe', startYear: 2026, endYear: 2030, actions: [] };

                    return (
                      <div className="space-y-5">
                        <div className="grid gap-4 rounded-lg border bg-slate-50 p-4 sm:grid-cols-2">
                          <div className="grid gap-2">
                            <Label>Année de début du plan</Label>
                            <Input
                              type="number"
                              value={axisData.startYear}
                              onChange={(e) => updateTimelineRange(selectedPsdAxis, 'startYear', Number(e.target.value) || 2026)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Année de fin du plan</Label>
                            <Input
                              type="number"
                              value={axisData.endYear}
                              onChange={(e) => updateTimelineRange(selectedPsdAxis, 'endYear', Number(e.target.value) || 2030)}
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-900 text-sm">Actions et sous-sections ({axisData.actions.length})</h4>
                            <Button type="button" size="sm" onClick={() => addTimelineAction(selectedPsdAxis)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                              <Plus className="mr-1 h-3.5 w-3.5" /> Nouvelle action pour cet axe
                            </Button>
                          </div>

                          {axisData.actions.length === 0 ? (
                            <p className="text-sm text-slate-500 py-4 text-center">Aucune action enregistrée pour cet axe. Cliquez sur « Ajouter une action ».</p>
                          ) : (
                            axisData.actions.map((action, actionIndex) => (
                              <div key={`action-${actionIndex}`} className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between gap-2 border-b pb-2">
                                  <span className="font-semibold text-sm text-french-blue">Action {actionIndex + 1} : {action.title || 'Nouvelle action'}</span>
                                  <div className="flex items-center gap-1">
                                    <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveTimelineAction(selectedPsdAxis, actionIndex, -1)} disabled={actionIndex === 0}>
                                      <ArrowUp className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveTimelineAction(selectedPsdAxis, actionIndex, 1)} disabled={actionIndex === axisData.actions.length - 1}>
                                      <ArrowDown className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button type="button" size="sm" variant="outline" title="Dupliquer" onClick={() => duplicateTimelineAction(selectedPsdAxis, actionIndex)}>
                                      <Copy className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => removeTimelineAction(selectedPsdAxis, actionIndex)}>
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div className="grid gap-1.5 sm:col-span-2">
                                    <Label className="text-xs">Intitulé de l’action ou projet</Label>
                                    <Input
                                      value={action.title}
                                      onChange={(e) => updateTimelineAction(selectedPsdAxis, actionIndex, 'title', e.target.value)}
                                    />
                                  </div>
                                  <div className="grid gap-1.5 sm:col-span-2">
                                    <Label className="text-xs">Description et objectifs</Label>
                                    <Textarea
                                      value={action.description}
                                      onChange={(e) => updateTimelineAction(selectedPsdAxis, actionIndex, 'description', e.target.value)}
                                      className="min-h-16"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Année de démarrage</Label>
                                    <Input
                                      type="number"
                                      value={action.start}
                                      min={axisData.startYear}
                                      max={axisData.endYear}
                                      onChange={(e) => updateTimelineAction(selectedPsdAxis, actionIndex, 'start', Number(e.target.value) || axisData.startYear)}
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Année d’achèvement</Label>
                                    <Input
                                      type="number"
                                      value={action.end}
                                      min={axisData.startYear}
                                      max={axisData.endYear}
                                      onChange={(e) => updateTimelineAction(selectedPsdAxis, actionIndex, 'end', Number(e.target.value) || axisData.endYear)}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Sub-tab: Budgets & Investissements Cadre de Vie */}
              {planStrategiqueSubTab === 'budgets' && (
                <div className="space-y-6">
                  {(() => {
                    const budget = getBudgetData();
                    const XOF_TO_EUR = 655.957;

                    return (
                      <>
                        {/* Header Banner */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5">
                                Axe 1 · Infrastructures & Cadre de Vie
                              </span>
                              <span className="text-xs text-slate-500 font-mono">
                                775 000 000 FCFA (1 181 480 €)
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mt-1">
                              Budget d’investissement du Cadre de Vie & Infrastructures
                            </h3>
                            <p className="text-xs text-slate-500">
                              Programmation 2026-2030 : climatisation, couverture sportive, cantine, flux de trésorerie et simulations d’écolages.
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Button asChild size="sm" variant="outline" className="text-xs text-french-blue hover:bg-blue-50">
                              <a href="/budget-cadre-vie-infrastructures?draft=1" target="_blank" rel="noreferrer">
                                <Eye className="mr-1.5 h-3.5 w-3.5" /> Voir la page publique Budget
                              </a>
                            </Button>
                            <Button type="button" size="sm" onClick={addBudgetProject} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                              <Plus className="mr-1.5 h-3.5 w-3.5" /> + Ajouter un projet d’investissement
                            </Button>
                          </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Investissement Total</span>
                              <Coins className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="mt-2">
                              <Input
                                type="number"
                                value={budget.summaryCards.totalInvestment}
                                onChange={(e) => updateBudgetSummary('totalInvestment', Number(e.target.value) || 0)}
                                className="bg-white font-bold text-emerald-900 text-lg h-9"
                              />
                              <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                                Soit environ {Math.round(budget.summaryCards.totalInvestment / XOF_TO_EUR).toLocaleString('fr-FR')} €
                              </p>
                            </div>
                          </div>

                          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Besoin de financement / Gap</span>
                              <AlertCircle className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="mt-2">
                              <Input
                                type="number"
                                value={budget.summaryCards.fundingGap}
                                onChange={(e) => updateBudgetSummary('fundingGap', Number(e.target.value) || 0)}
                                className="bg-white font-bold text-amber-900 text-lg h-9"
                              />
                              <p className="text-[11px] text-amber-700 mt-1 font-semibold">
                                Soit environ {Math.round(budget.summaryCards.fundingGap / XOF_TO_EUR).toLocaleString('fr-FR')} €
                              </p>
                            </div>
                          </div>

                          <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-sky-800 uppercase tracking-wide">Capacité totale estimée</span>
                              <Wallet className="h-5 w-5 text-sky-600" />
                            </div>
                            <div className="mt-2">
                              <Input
                                type="number"
                                value={budget.summaryCards.estimatedCapacity}
                                onChange={(e) => updateBudgetSummary('estimatedCapacity', Number(e.target.value) || 0)}
                                className="bg-white font-bold text-sky-900 text-lg h-9"
                              />
                              <p className="text-[11px] text-sky-700 mt-1 font-semibold">
                                Soit environ {Math.round(budget.summaryCards.estimatedCapacity / XOF_TO_EUR).toLocaleString('fr-FR')} € (Écolages + ANEFE)
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Projects List */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                              Les Grands Projets d’Infrastructures & Montants Dédiés ({budget.projects.length})
                            </h4>
                            <span className="text-xs text-slate-500">
                              Tous les montants sont en FCFA (avec conversion en € en direct)
                            </span>
                          </div>

                          <div className="grid gap-3.5 sm:grid-cols-2">
                            {budget.projects.map((project, idx) => (
                              <div key={project.id || `proj-${idx}`} className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
                                <div className="flex items-center justify-between border-b pb-2">
                                  <span className="font-bold text-sm text-french-blue">
                                    Projet {idx + 1} : {project.title || 'Sans titre'}
                                  </span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeBudgetProject(idx)}
                                    className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                    title="Supprimer ce projet"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>

                                <div className="grid gap-2.5">
                                  <div className="grid gap-1">
                                    <Label className="text-[11px] font-semibold text-slate-600">Intitulé du projet</Label>
                                    <Input
                                      value={project.title}
                                      onChange={(e) => updateBudgetProject(idx, 'title', e.target.value)}
                                      className="text-xs h-8 font-medium"
                                    />
                                  </div>

                                  <div className="grid gap-1">
                                    <Label className="text-[11px] font-semibold text-slate-600">Description des travaux</Label>
                                    <Textarea
                                      value={project.description}
                                      onChange={(e) => updateBudgetProject(idx, 'description', e.target.value)}
                                      className="text-xs min-h-[50px]"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="grid gap-1">
                                      <Label className="text-[11px] font-semibold text-slate-600">Période prévisionnelle</Label>
                                      <Input
                                        value={project.period}
                                        onChange={(e) => updateBudgetProject(idx, 'period', e.target.value)}
                                        className="text-xs h-8"
                                        placeholder="ex: 2026 – 2027"
                                      />
                                    </div>
                                    <div className="grid gap-1">
                                      <Label className="text-[11px] font-semibold text-slate-600">Budget alloué (FCFA)</Label>
                                      <Input
                                        type="number"
                                        value={project.budget}
                                        onChange={(e) => updateBudgetProject(idx, 'budget', e.target.value)}
                                        className="text-xs h-8 font-bold text-emerald-800"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded">
                                    <span className="text-slate-500">Contre-valeur :</span>
                                    <span className="font-bold text-slate-700">
                                      {Math.round(project.budget / XOF_TO_EUR).toLocaleString('fr-FR')} €
                                    </span>
                                    {project.link && (
                                      <Link to={project.link} className="text-french-blue hover:underline font-semibold ml-2">
                                        Fiche dédiée ↗
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Financial Timeline Table */}
                        <div className="space-y-3 rounded-xl border bg-slate-50 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Flux de trésorerie prévisionnels (2026 – 2030)
                              </h4>
                              <p className="text-[11px] text-slate-500">
                                Capacité d’autofinancement, leviers financiers ANEFE, dépenses programmées et solde net
                              </p>
                            </div>
                            <span className="text-[11px] font-semibold text-french-blue">5 années d’exercice</span>
                          </div>

                          <div className="overflow-x-auto rounded-lg border bg-white">
                            <table className="w-full text-left text-xs divide-y">
                              <thead className="bg-slate-100 font-semibold text-slate-700">
                                <tr>
                                  <th className="p-2.5">Année</th>
                                  <th className="p-2.5">Capacité annuelle (FCFA)</th>
                                  <th className="p-2.5">Leviers / Emprunt (FCFA)</th>
                                  <th className="p-2.5">Recettes totales (FCFA)</th>
                                  <th className="p-2.5">Dépenses (FCFA)</th>
                                  <th className="p-2.5 text-right">Solde net annuel</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y text-slate-700">
                                {budget.financialTimeline.map((flow, yearIdx) => {
                                  const solde = flow.recettesTotales - flow.depenses;
                                  return (
                                    <tr key={flow.year} className="hover:bg-slate-50">
                                      <td className="p-2.5 font-bold text-slate-900">{flow.year}</td>
                                      <td className="p-2.5">
                                        <Input
                                          type="number"
                                          value={flow.capacite}
                                          onChange={(e) => updateCashFlow(yearIdx, 'capacite', Number(e.target.value) || 0)}
                                          className="h-7 text-xs w-32"
                                        />
                                      </td>
                                      <td className="p-2.5">
                                        <Input
                                          type="number"
                                          value={flow.leviers}
                                          onChange={(e) => updateCashFlow(yearIdx, 'leviers', Number(e.target.value) || 0)}
                                          className="h-7 text-xs w-32"
                                        />
                                      </td>
                                      <td className="p-2.5 font-semibold text-slate-900">
                                        {flow.recettesTotales.toLocaleString('fr-FR')} FCFA
                                      </td>
                                      <td className="p-2.5">
                                        <Input
                                          type="number"
                                          value={flow.depenses}
                                          onChange={(e) => updateCashFlow(yearIdx, 'depenses', Number(e.target.value) || 0)}
                                          className="h-7 text-xs w-32 font-bold text-red-600"
                                        />
                                      </td>
                                      <td className="p-2.5 text-right font-bold">
                                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                                          solde >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          {solde.toLocaleString('fr-FR')} FCFA
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Tuition Simulations */}
                        <div className="space-y-3 rounded-xl border bg-white p-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                            Simulations d’ajustement des frais d’écolage & Recettes générées
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-5">
                            {budget.tuitionSimulations.map((sim, simIdx) => (
                              <div key={sim.year} className="rounded-lg border bg-slate-50 p-3 space-y-1.5 text-xs">
                                <span className="font-bold text-slate-900">{sim.year}</span>
                                <div>
                                  <Label className="text-[10px] text-slate-500">Hausse (%)</Label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={sim.increase}
                                    onChange={(e) => updateTuitionSimulation(simIdx, 'increase', Number(e.target.value) || 0)}
                                    className="h-7 text-xs font-semibold bg-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-slate-500">Recette additionnelle</Label>
                                  <Input
                                    type="number"
                                    value={sim.revenue}
                                    onChange={(e) => updateTuitionSimulation(simIdx, 'revenue', Number(e.target.value) || 0)}
                                    className="h-7 text-xs bg-white text-emerald-800 font-bold"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Sub-tab: Transport Scolaire & Données Familles */}
              {planStrategiqueSubTab === 'transports' && (
                <div className="space-y-6">
                  {(() => {
                    const transport = getTransportData();

                    return (
                      <>
                        {/* Header Banner */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-sky-100 text-sky-800 text-[11px] font-bold px-2 py-0.5">
                                Axe 1 · Cadre de Vie & Mobilités
                              </span>
                              <span className="text-xs text-slate-500 font-mono">
                                {transport.stats.totalEleves} élèves analysés (R1 + R2)
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mt-1">
                              Transport Scolaire & Distribution Géographique des Familles
                            </h3>
                            <p className="text-xs text-slate-500">
                              Données de domiciliation des élèves, analyse de la demande, circuits de ramassage et grille tarifaire.
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Button asChild size="sm" variant="outline" className="text-xs text-french-blue hover:bg-blue-50">
                              <a href="/transport-scolaire?draft=1" target="_blank" rel="noreferrer">
                                <Eye className="mr-1.5 h-3.5 w-3.5" /> Voir la page publique Transport
                              </a>
                            </Button>
                            <Button type="button" size="sm" onClick={addTransportCommune} className="bg-sky-600 hover:bg-sky-700 text-white text-xs">
                              <Plus className="mr-1.5 h-3.5 w-3.5" /> + Ajouter une commune
                            </Button>
                            <Button type="button" size="sm" onClick={addTransportCircuit} className="bg-french-blue hover:bg-blue-700 text-white text-xs">
                              <Plus className="mr-1.5 h-3.5 w-3.5" /> + Ajouter une ligne / circuit
                            </Button>
                          </div>
                        </div>

                        {/* Territorial Context KPI Cards */}
                        <div className="grid gap-3 sm:grid-cols-4">
                          <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800">Total Élèves (R1+R2)</span>
                            <Input
                              type="number"
                              value={transport.stats.totalEleves}
                              onChange={(e) => updateTransportStat('totalEleves', Number(e.target.value) || 0)}
                              className="mt-1 font-bold text-lg text-sky-900 bg-white h-9"
                            />
                          </div>

                          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Part résidant à Saly</span>
                            <Input
                              value={transport.stats.partSaly}
                              onChange={(e) => updateTransportStat('partSaly', e.target.value)}
                              className="mt-1 font-bold text-lg text-blue-900 bg-white h-9"
                              placeholder="49 %"
                            />
                          </div>

                          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">Périphérie immédiate</span>
                            <Input
                              value={transport.stats.partPeripherie}
                              onChange={(e) => updateTransportStat('partPeripherie', e.target.value)}
                              className="mt-1 font-bold text-lg text-indigo-900 bg-white h-9"
                              placeholder="42 %"
                            />
                          </div>

                          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Éloignés (&gt; 30 km)</span>
                            <Input
                              value={transport.stats.partEloignee}
                              onChange={(e) => updateTransportStat('partEloignee', e.target.value)}
                              className="mt-1 font-bold text-lg text-amber-900 bg-white h-9"
                              placeholder="9 %"
                            />
                          </div>
                        </div>

                        {/* Communes Distribution Table */}
                        <div className="rounded-xl border bg-white p-4 space-y-3">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                              Répartition des Familles par Commune ({transport.communes.length})
                            </h4>
                            <span className="text-xs text-slate-500">
                              Effectifs constatés d’après les adresses de rentrée
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs divide-y">
                              <thead className="bg-slate-50 font-semibold text-slate-700">
                                <tr>
                                  <th className="p-2.5">Ville / Commune</th>
                                  <th className="p-2.5">Total Élèves</th>
                                  <th className="p-2.5">Part estimée</th>
                                  <th className="p-2.5">Jauge de représentation</th>
                                  <th className="p-2.5 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y text-slate-700">
                                {transport.communes.map((c, cIdx) => {
                                  const numPart = parseInt(c.part, 10) || 0;
                                  return (
                                    <tr key={`commune-${cIdx}`} className="hover:bg-slate-50">
                                      <td className="p-2.5">
                                        <Input
                                          value={c.ville}
                                          onChange={(e) => updateTransportCommune(cIdx, 'ville', e.target.value)}
                                          className="h-7 text-xs font-semibold w-40"
                                        />
                                      </td>
                                      <td className="p-2.5">
                                        <Input
                                          type="number"
                                          value={c.total}
                                          onChange={(e) => updateTransportCommune(cIdx, 'total', e.target.value)}
                                          className="h-7 text-xs font-bold w-24 text-sky-900"
                                        />
                                      </td>
                                      <td className="p-2.5">
                                        <Input
                                          value={c.part}
                                          onChange={(e) => updateTransportCommune(cIdx, 'part', e.target.value)}
                                          className="h-7 text-xs w-20"
                                        />
                                      </td>
                                      <td className="p-2.5 w-48">
                                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                          <div
                                            className="h-full bg-sky-600 rounded-full transition-all"
                                            style={{ width: `${Math.min(100, Math.max(0, numPart))}%` }}
                                          />
                                        </div>
                                      </td>
                                      <td className="p-2.5 text-right">
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => removeTransportCommune(cIdx)}
                                          className="h-6 px-1.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                                          title="Supprimer la commune"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Bus Circuits and Lines */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                            Circuits et Lignes de Ramassage Préconisés ({transport.circuits.length})
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {transport.circuits.map((circuit, cirIdx) => (
                              <div key={`circuit-${cirIdx}`} className="rounded-xl border bg-white p-4 shadow-sm space-y-2.5">
                                <div className="flex items-center justify-between border-b pb-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <BusFront className="h-4 w-4 text-sky-600" />
                                    <span className="font-bold text-xs text-french-blue">Ligne {cirIdx + 1}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeTransportCircuit(cirIdx)}
                                    className="h-6 px-1.5 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>

                                <div className="space-y-2 text-xs">
                                  <div>
                                    <Label className="text-[10px] text-slate-500 font-semibold">Nom de la ligne</Label>
                                    <Input
                                      value={circuit.name}
                                      onChange={(e) => updateTransportCircuit(cirIdx, 'name', e.target.value)}
                                      className="text-xs h-7 font-medium"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <Label className="text-[10px] text-slate-500 font-semibold">Élèves transportés</Label>
                                      <Input
                                        type="number"
                                        value={circuit.eleves}
                                        onChange={(e) => updateTransportCircuit(cirIdx, 'eleves', e.target.value)}
                                        className="text-xs h-7 font-bold text-sky-800"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-[10px] text-slate-500 font-semibold">Départ</Label>
                                      <Input
                                        value={circuit.horaireDepart}
                                        onChange={(e) => updateTransportCircuit(cirIdx, 'horaireDepart', e.target.value)}
                                        className="text-xs h-7"
                                        placeholder="07h15"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-[10px] text-slate-500 font-semibold">Arrêts desservis</Label>
                                    <Input
                                      value={circuit.arrets}
                                      onChange={(e) => updateTransportCircuit(cirIdx, 'arrets', e.target.value)}
                                      className="text-xs h-7 text-slate-700"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tariff Grid */}
                        <div className="rounded-xl border bg-slate-50 p-4 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                            Grille Tarifaire Indicative par Zone
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {transport.tarifs.map((tarif, tIdx) => (
                              <div key={`tarif-${tIdx}`} className="p-3 rounded-lg border bg-white text-xs space-y-1">
                                <p className="font-bold text-french-blue">{tarif.zone}</p>
                                <p className="text-[11px] text-slate-500">{tarif.description}</p>
                                <div className="pt-2 border-t mt-2 flex items-center justify-between font-bold">
                                  <span className="text-slate-700">{tarif.mensuel.toLocaleString('fr-FR')} FCFA / mois</span>
                                  <span className="text-slate-500 text-[11px]">({tarif.annuel.toLocaleString('fr-FR')} FCFA / an)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Sub-tab 4: Bac Blanc */}
              {planStrategiqueSubTab === 'bac-blanc' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-french-blue">Organisation du Bac Blanc</h3>
                      <p className="text-xs text-slate-500">Gérez les journées, épreuves, salles et affectations de surveillance.</p>
                    </div>
                    <Button type="button" size="sm" onClick={addScheduleDay} className="bg-french-blue hover:bg-blue-700 text-white text-xs">
                      <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter une journée d’examen
                    </Button>
                  </div>
                  {(getEditablePageData().bacBlancSchedule as Record<string, unknown>[]).map((day, dayIndex) => (
                    <div key={`exam-day-${dayIndex}`} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="font-bold text-sm text-french-blue">
                          Journée {dayIndex + 1} : {String(day.label || 'Nouvelle date')}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeScheduleDay(dayIndex)}
                          className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Supprimer la journée
                        </Button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="grid gap-1">
                          <Label className="text-xs font-semibold">Date</Label>
                          <Input
                            type="date"
                            value={String(day.date || '')}
                            onChange={(event) => updateScheduleDay(dayIndex, 'date', event.target.value)}
                            className="text-xs"
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label className="text-xs font-semibold">Libellé affiché</Label>
                          <Input
                            value={String(day.label || '')}
                            onChange={(event) => updateScheduleDay(dayIndex, 'label', event.target.value)}
                            className="text-xs"
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label className="text-xs font-semibold">Épreuve / Thématique</Label>
                          <Input
                            value={String(day.focus || '')}
                            onChange={(event) => updateScheduleDay(dayIndex, 'focus', event.target.value)}
                            className="text-xs"
                          />
                        </div>
                        <div className="grid gap-1 sm:col-span-3">
                          <Label className="text-xs font-semibold">Note / Consignes logistiques</Label>
                          <Textarea
                            value={String(day.note || '')}
                            onChange={(event) => updateScheduleDay(dayIndex, 'note', event.target.value)}
                            className="text-xs min-h-[60px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Salles & Horaires ({((day.rooms as Record<string, unknown>[]) || []).length})
                          </h4>
                          <Button type="button" size="sm" variant="outline" onClick={() => addScheduleRoom(dayIndex)} className="text-xs h-7">
                            <Plus className="mr-1 h-3 w-3" /> Ajouter une salle
                          </Button>
                        </div>
                        {((day.rooms as Record<string, unknown>[]) || []).map((room, roomIndex) => (
                          <div key={`room-${roomIndex}`} className="grid gap-2.5 rounded-lg bg-slate-50 p-3 sm:grid-cols-2">
                            {([
                              ['room', 'Salle'], ['examTitle', 'Épreuve'], ['examTime', 'Horaire'], ['leadExaminer', 'Responsable'],
                              ['surveillanceTeam', 'Surveillance (noms séparés par virgules)'], ['notes', 'Note particulière'],
                            ] as const).map(([field, label]) => (
                              <div key={field} className="grid gap-1">
                                <Label className="text-[11px] font-semibold text-slate-600">{label}</Label>
                                <Input
                                  value={field === 'surveillanceTeam' ? ((room.surveillanceTeam as string[]) || []).join(', ') : String(room[field] || '')}
                                  onChange={(event) => updateScheduleRoom(dayIndex, roomIndex, field, event.target.value)}
                                  className="bg-white text-xs h-8"
                                />
                              </div>
                            ))}
                            <div className="sm:col-span-2 flex justify-end pt-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeScheduleRoom(dayIndex, roomIndex)}
                                className="h-7 text-xs text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="mr-1 h-3 w-3" /> Retirer cette salle
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 3: Films Annuels */}
              {planStrategiqueSubTab === 'film-annuel' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-french-blue">Films annuels & parcours par cycle</h3>
                      <p className="text-xs text-slate-500">Maternelle, Élémentaire, Collège, Lycée et actions d’orientation.</p>
                    </div>
                    <Button type="button" size="sm" onClick={addFilmLevel} className="bg-french-blue hover:bg-blue-700 text-white text-xs">
                      <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter un cycle / niveau
                    </Button>
                  </div>
                  {Object.entries(getEditablePageData().filmAnnuelData as Record<string, Record<string, unknown>>).map(([levelKey, level]) => (
                    <div key={levelKey} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="font-bold text-sm text-french-blue">Niveau : {String(level.level || levelKey)}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFilmLevel(levelKey)}
                          className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Supprimer ce niveau
                        </Button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-1">
                          <Label className="text-xs font-semibold">Nom du cycle</Label>
                          <Input
                            value={String(level.level || '')}
                            onChange={(event) => updateFilmLevel(levelKey, 'level', event.target.value)}
                            className="text-xs"
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label className="text-xs font-semibold">Chapeau introductif</Label>
                          <Input
                            value={String(level.subtitle || '')}
                            onChange={(event) => updateFilmLevel(levelKey, 'subtitle', event.target.value)}
                            className="text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Actions & Projets de {String(level.level || levelKey)} ({((level.actions as Record<string, unknown>[]) || []).length})
                          </h4>
                          <Button type="button" size="sm" variant="outline" onClick={() => addFilmAction(levelKey)} className="text-xs h-7">
                            <Plus className="mr-1 h-3 w-3" /> Ajouter une action
                          </Button>
                        </div>
                        {((level.actions as Record<string, unknown>[]) || []).map((action, actionIndex) => (
                          <div key={`action-${actionIndex}`} className="grid gap-2.5 rounded-lg bg-slate-50 p-3 sm:grid-cols-2">
                            {(['title', 'period', 'description', 'actors'] as const).map((field) => (
                              <div key={field} className="grid gap-1">
                                <Label className="text-[11px] font-semibold text-slate-600">
                                  {field === 'title' ? 'Intitulé de l’action' : field === 'period' ? 'Période' : field === 'description' ? 'Description' : 'Acteurs / Intervenants'}
                                </Label>
                                {field === 'description' ? (
                                  <Textarea
                                    value={String(action[field] || '')}
                                    onChange={(event) => updateFilmAction(levelKey, actionIndex, field, event.target.value)}
                                    className="bg-white text-xs min-h-[50px]"
                                  />
                                ) : (
                                  <Input
                                    value={String(action[field] || '')}
                                    onChange={(event) => updateFilmAction(levelKey, actionIndex, field, event.target.value)}
                                    className="bg-white text-xs h-8"
                                  />
                                )}
                              </div>
                            ))}
                            <div className="grid gap-1">
                              <Label className="text-[11px] font-semibold text-slate-600">Étape du parcours</Label>
                              <select
                                className="h-8 rounded-md border bg-white px-2 text-xs"
                                value={String(action.phase || 'Mieux se connaître')}
                                onChange={(event) => updateFilmAction(levelKey, actionIndex, 'phase', event.target.value)}
                              >
                                <option>Mieux se connaître</option>
                                <option>Plonger dans le monde professionnel</option>
                                <option>Finaliser les projets</option>
                              </select>
                            </div>
                            <div className="flex items-end justify-end">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFilmAction(levelKey, actionIndex)}
                                className="h-7 text-xs text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="mr-1 h-3 w-3" /> Supprimer l’action
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 4: Sous-pages */}
              {planStrategiqueSubTab === 'subpages' && renderRubriqueSubpages('plan-strategique', '/plan-strategique', 'Plan Stratégique')}
            </CardContent>
          </Card>

          {/* ===================== DYNAMIC CUSTOM RUBRIQUE WORKSPACE ===================== */}
          {(() => {
            const isOfficialHardcoded = ['rubrique-accueil', 'rubrique-methode', 'rubrique-vision', 'rubrique-diagnostic', 'rubrique-plan-strategique'].includes(activeSection);
            if (!activeSection.startsWith('rubrique-') || isOfficialHardcoded) return null;

            const targetId = activeSection.replace('rubrique-', '');
            const currentRubrique = rubriques.find((r) => r.id === targetId);
            if (!currentRubrique) return null;

            const IconComp = RUBRIQUE_ICONS[currentRubrique.iconName] || Sparkles;
            const primaryPage = pages.find((p) => normalizePageSlug(p.slug) === normalizePageSlug(currentRubrique.path));

            return (
              <Card id={`admin-panel-rubrique-${currentRubrique.id}`} role="tabpanel">
                <CardHeader className="border-b bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-blue-50 text-french-blue border border-blue-200">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-xl text-slate-900 font-playfair font-bold">
                            {currentRubrique.name}
                          </CardTitle>
                          <span className="rounded bg-blue-100 text-french-blue text-xs font-semibold px-2 py-0.5">
                            {currentRubrique.badge || 'Rubrique personnalisée'}
                          </span>
                          <code className="text-xs text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                            {currentRubrique.path}
                          </code>
                        </div>
                        <CardDescription className="text-xs text-slate-500 mt-1 max-w-2xl">
                          {currentRubrique.description}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button asChild size="sm" variant="outline" className="text-xs text-french-blue hover:bg-blue-50">
                        <a href={`${currentRubrique.path}?draft=1`} target="_blank" rel="noreferrer">
                          <Eye className="mr-1.5 h-3.5 w-3.5" /> Voir la page
                        </a>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openEditRubriqueModal(currentRubrique)}
                        className="text-xs"
                      >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" /> Modifier la rubrique
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => duplicateRubrique(currentRubrique.id)}
                        className="text-xs text-indigo-600 hover:bg-indigo-50"
                      >
                        <Copy className="mr-1.5 h-3.5 w-3.5" /> Dupliquer
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={!canDelete}
                        onClick={() => deleteRubrique(currentRubrique.id)}
                        title={canDelete ? "Supprimer cette rubrique" : "Suppression désactivée pour le profil Éditeur Simple"}
                        className={`text-xs ${
                          canDelete ? "text-red-500 hover:text-red-700 hover:bg-red-50" : "text-slate-300 cursor-not-allowed"
                        }`}
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Supprimer
                      </Button>
                    </div>
                  </div>

                  {/* Sub-tab navigation */}
                  <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t">
                    <Button
                      type="button"
                      size="sm"
                      variant={customRubriqueSubTab === 'content' ? 'default' : 'outline'}
                      onClick={() => setCustomRubriqueSubTab('content')}
                      className={customRubriqueSubTab === 'content' ? 'bg-french-blue text-white' : ''}
                    >
                      <FileText className="mr-1.5 h-3.5 w-3.5" /> 📄 Contenu & Blocs de la page principale
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={customRubriqueSubTab === 'subpages' ? 'default' : 'outline'}
                      onClick={() => setCustomRubriqueSubTab('subpages')}
                      className={customRubriqueSubTab === 'subpages' ? 'bg-french-blue text-white' : ''}
                    >
                      <FolderTree className="mr-1.5 h-3.5 w-3.5" /> 🌳 Sous-pages & Fiches rattachées
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  {customRubriqueSubTab === 'content' && (
                    <div className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                        <div>
                          <h4 className="font-bold text-sm text-french-blue">
                            Blocs de contenu de la page « {currentRubrique.name} » ({primaryPage ? primaryPage.blocks.length : 0} blocs)
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Éditez les titres, paragraphes, images, galeries, citations et tableaux de cette page.
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => openRubriqueEditor(currentRubrique.path, currentRubrique.name, undefined, activeSection)}
                          className="bg-french-blue hover:bg-blue-700 text-white text-xs font-semibold"
                        >
                          <Pencil className="mr-1.5 h-3.5 w-3.5" /> Ouvrir l’éditeur complet de blocs
                        </Button>
                      </div>

                      {primaryPage ? (
                        <div className="space-y-3">
                          <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-slate-700">Titre de la page</Label>
                            <Input
                              value={primaryPage.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPages((curr) => curr.map((p) => p.slug === primaryPage.slug ? { ...p, title: val } : p));
                              }}
                              className="text-sm font-semibold"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-slate-700">Description introductive</Label>
                            <Textarea
                              value={primaryPage.description || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPages((curr) => curr.map((p) => p.slug === primaryPage.slug ? { ...p, description: val } : p));
                              }}
                              className="text-xs min-h-[60px]"
                            />
                          </div>

                          <div className="pt-3 border-t">
                            <p className="text-xs font-bold uppercase text-slate-600 mb-2">
                              Aperçu des blocs présents :
                            </p>
                            <div className="space-y-2">
                              {primaryPage.blocks.map((block, bIdx) => (
                                <div key={bIdx} className="p-3 rounded-lg border bg-slate-50/70 text-xs flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border">
                                      {block.type}
                                    </span>
                                    <span className="text-slate-700 font-medium line-clamp-1">
                                      {'text' in block ? String(block.text || '') : 'title' in block ? String(block.title || '') : 'Bloc sans texte'}
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openRubriqueEditor(currentRubrique.path, currentRubrique.name, undefined, activeSection)}
                                    className="h-6 text-xs text-french-blue"
                                  >
                                    Éditer
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-xs text-slate-500">Aucun bloc configuré pour cette page.</p>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => openRubriqueEditor(currentRubrique.path, currentRubrique.name, undefined, activeSection)}
                            className="mt-3 bg-french-blue text-white text-xs"
                          >
                            Initialiser les blocs
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {customRubriqueSubTab === 'subpages' && renderRubriqueSubpages(currentRubrique.id, currentRubrique.path, currentRubrique.name)}
                </CardContent>
              </Card>
            );
          })()}

          <Card id="admin-panel-pages" role="tabpanel" aria-labelledby="admin-tab-pages" hidden={activeSection !== 'pages'}>
            <CardHeader className="flex-row items-center justify-between gap-4 flex-wrap border-b pb-4">
              <div>
                <CardTitle className="text-xl text-french-blue flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Pages, sous-pages, rubriques et sections
                </CardTitle>
                <CardDescription>
                  Créez, modifiez, organisez et supprimez toutes les pages, sous-rubriques et leurs blocs de contenu (titres, paragraphes, images, tableaux, etc.).
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => addPage('default')} size="sm" className="bg-french-blue hover:bg-blue-700">
                  <Plus className="mr-1.5 h-4 w-4" /> Nouvelle page principale
                </Button>
                <Button onClick={() => addSubPage()} size="sm" variant="outline" className="border-french-blue/30 text-french-blue hover:bg-blue-50">
                  <CornerDownRight className="mr-1.5 h-4 w-4" /> Nouvelle sous-page
                </Button>
                <Button onClick={() => addPage('project')} size="sm" variant="outline">
                  + Modèle Projet
                </Button>
                <Button onClick={() => addPage('gallery')} size="sm" variant="outline">
                  + Modèle Galerie
                </Button>
                <Button onClick={() => addPage('data')} size="sm" variant="outline">
                  + Modèle Données
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={pageTabMode === 'pillars' ? 'default' : 'outline'}
                    onClick={() => setPageTabMode('pillars')}
                    className={pageTabMode === 'pillars' ? 'bg-french-blue text-white shadow-sm' : ''}
                  >
                    <FolderTree className="mr-1.5 h-4 w-4" /> 🌳 Arborescence des 5 Piliers
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={pageTabMode === 'cms' ? 'default' : 'outline'}
                    onClick={() => setPageTabMode('cms')}
                    className={pageTabMode === 'cms' ? 'bg-french-blue text-white' : ''}
                  >
                    <FilePlus className="mr-1.5 h-4 w-4" /> 📄 Constructeur de Pages & Blocs ({pages.length})
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={pageTabMode === 'all-routes' ? 'default' : 'outline'}
                    onClick={() => setPageTabMode('all-routes')}
                    className={pageTabMode === 'all-routes' ? 'bg-french-blue text-white' : ''}
                  >
                    <ListPlus className="mr-1.5 h-4 w-4" /> 📑 Index des URLs ({Object.keys(breadcrumbRoutes).length})
                  </Button>
                </div>
                <div className="relative min-w-[240px] flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Filtrer l’arborescence par nom ou URL..."
                    value={pageSearchQuery}
                    onChange={(e) => setPageSearchQuery(e.target.value)}
                    className="pl-9 h-9 bg-white"
                  />
                </div>
              </div>

              {/* ================= MODE 1 : ARBORESCENCE DES 5 PILIERS ================= */}
              {pageTabMode === 'pillars' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 p-4 sm:p-5 shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <FolderTree className="h-5 w-5 text-french-blue" />
                      <h4 className="font-bold text-base text-french-blue">
                        Arborescence officielle harmonisée du PSD LFJP
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      L’ensemble des contenus, pages, sous-pages, blocs et données du site est articulé autour des <strong>5 Piliers directeurs</strong> de <code className="bg-white border px-1.5 py-0.5 rounded text-french-blue">psd-lfjp.vercel.app</code> :
                      <span className="font-medium text-slate-800"> 1. Accueil (/) · 2. Méthode (/methode) · 3. Vision & Valeurs (/vision-missions-valeurs) · 4. Diagnostic (/diagnostic) · 5. Plan Stratégique (/plan-strategique)</span>.
                      Cliquez sur le <strong>crayon ✏️</strong> pour modifier une page ou une sous-page, sur <strong>l’œil 👁️</strong> pour la consulter, ou sur <strong>↳ + Sous-page</strong> pour créer une nouvelle section rattachée.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {SITE_PILLARS.map((pillar) => {
                      const isExpanded = expandedPillars[pillar.id] !== false;
                      const pillarCustomPages = pages.filter((p) => p.parent === pillar.path || (!p.parent && pillar.path === '/' && p.slug !== '/'));
                      const searchMatch = !pageSearchQuery.trim() ||
                        pillar.name.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
                        pillar.path.toLowerCase().includes(pageSearchQuery.toLowerCase());

                      return (
                        <div key={pillar.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all">
                          {/* Pillar Header Card */}
                          <div className="p-4 sm:p-5 bg-slate-50/80 border-b flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <button
                                type="button"
                                onClick={() => togglePillar(pillar.id)}
                                className="p-1 rounded hover:bg-slate-200/70 text-slate-600 transition-colors"
                                title={isExpanded ? 'Réduire ce pilier' : 'Déplier ce pilier'}
                              >
                                {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                              </button>
                              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                                {pillar.iconName === 'Home' && <HomeIcon className="h-5 w-5 text-french-blue" />}
                                {pillar.iconName === 'Sliders' && <Sliders className="h-5 w-5 text-sky-600" />}
                                {pillar.iconName === 'Heart' && <Heart className="h-5 w-5 text-rose-600" />}
                                {pillar.iconName === 'ChartNoAxesCombined' && <ChartNoAxesCombined className="h-5 w-5 text-purple-600" />}
                                {pillar.iconName === 'Target' && <Target className="h-5 w-5 text-emerald-600" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-playfair text-base font-bold text-slate-900">{pillar.name}</h3>
                                  <span className="rounded bg-blue-100 text-french-blue text-[11px] font-semibold px-2 py-0.5">
                                    {pillar.badge}
                                  </span>
                                  <code className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {pillar.path}
                                  </code>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{pillar.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => openRubriqueEditor(pillar.path, pillar.name)}
                                className="h-8 text-xs text-french-blue hover:bg-blue-50"
                                title="Modifier les contenus et blocs de ce pilier"
                              >
                                <Pencil className="mr-1 h-3.5 w-3.5" /> Modifier les contenus
                              </Button>
                              <Button asChild size="sm" variant="ghost" className="h-8 text-xs" title="Voir la page">
                                <a href={`${pillar.path}?draft=1`} target="_blank" rel="noreferrer">
                                  <Eye className="mr-1 h-3.5 w-3.5" /> Voir
                                </a>
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => addSubPage(pillar.path)}
                                className="h-8 text-xs border-amber-300 text-amber-700 hover:bg-amber-50"
                                title="Ajouter une sous-page rattachée à ce pilier"
                              >
                                <CornerDownRight className="mr-1 h-3.5 w-3.5" /> + Sous-page
                              </Button>
                            </div>
                          </div>

                          {/* Pillar Body with subpages, axes & custom pages */}
                          {isExpanded && (
                            <div className="p-4 sm:p-5 space-y-5 bg-slate-50/30">
                              {/* 1. If Pillar has Axes (Plan Stratégique) */}
                              {pillar.axes && (
                                <div className="space-y-4">
                                  {pillar.axes.map((axis) => {
                                    const isAxisExpanded = expandedPillars[axis.id] !== false;
                                    const axisCustomPages = pages.filter((p) => p.parent === `/plan-strategique/${axis.id}` || axis.subpages.some((sub) => sub.path === p.parent));

                                    return (
                                      <div key={axis.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-xs">
                                        <div className="p-3.5 bg-slate-100/70 border-b flex flex-wrap items-center justify-between gap-2">
                                          <div className="flex items-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() => togglePillar(axis.id)}
                                              className="p-1 rounded hover:bg-slate-200 text-slate-500"
                                            >
                                              {isAxisExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            </button>
                                            <span className="rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5">
                                              {axis.badge}
                                            </span>
                                            <h4 className="font-semibold text-sm text-slate-900">{axis.name}</h4>
                                          </div>
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => addSubPage(`/plan-strategique/${axis.id}`)}
                                            className="h-7 text-xs text-amber-700 hover:bg-amber-50"
                                          >
                                            <Plus className="mr-1 h-3 w-3" /> Sous-page sur cet axe
                                          </Button>
                                        </div>

                                        {isAxisExpanded && (
                                          <div className="divide-y divide-slate-100">
                                            {axis.subpages
                                              .filter((sub) =>
                                                !pageSearchQuery.trim() ||
                                                sub.name.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
                                                sub.path.toLowerCase().includes(pageSearchQuery.toLowerCase())
                                              )
                                              .map((sub) => (
                                                <div key={sub.path} className="p-3 sm:px-4 flex flex-wrap items-center justify-between gap-2 hover:bg-slate-50/80 transition-colors">
                                                  <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                      <CornerDownRight className="h-3.5 w-3.5 text-french-blue shrink-0" />
                                                      <span className="font-semibold text-xs text-slate-900">{sub.name}</span>
                                                      <code className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                                                        {sub.path}
                                                      </code>
                                                    </div>
                                                    {sub.description && (
                                                      <p className="text-[11px] text-slate-500 ml-5.5 mt-0.5">{sub.description}</p>
                                                    )}

                                                    {/* Sub-subpages (ex: Film annuel 3e, 2nde, 1ere, Terminale) */}
                                                    {sub.subpages && (
                                                      <div className="ml-6 mt-2 space-y-1.5 border-l-2 border-indigo-200 pl-3">
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Sous-niveaux d’orientation :</p>
                                                        {sub.subpages.map((nested) => (
                                                          <div key={nested.path} className="flex items-center justify-between gap-2 text-xs py-1 hover:bg-indigo-50/50 rounded px-1.5">
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                              <span className="font-medium text-slate-700">{nested.name}</span>
                                                              <code className="text-[10px] text-slate-400 font-mono">{nested.path}</code>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                              <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => openRubriqueEditor(nested.path, nested.name, sub.path)}
                                                                className="h-6 px-1.5 text-[11px] text-french-blue hover:bg-blue-50"
                                                                title="Modifier les contenus"
                                                              >
                                                                <Pencil className="h-3 w-3" />
                                                              </Button>
                                                              <Button asChild size="sm" variant="ghost" className="h-6 px-1.5 text-[11px]">
                                                                <a href={`${nested.path}?draft=1`} target="_blank" rel="noreferrer">
                                                                  <Eye className="h-3 w-3" />
                                                                </a>
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>

                                                  <div className="flex items-center gap-1.5 shrink-0">
                                                    <Button
                                                      type="button"
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={() => openRubriqueEditor(sub.path, sub.name, pillar.path)}
                                                      className="h-7 text-xs text-french-blue hover:bg-blue-50"
                                                      title="Modifier les contenus et blocs de cette rubrique"
                                                    >
                                                      <Pencil className="mr-1 h-3 w-3" /> Modifier
                                                    </Button>
                                                    <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                                                      <a href={`${sub.path}?draft=1`} target="_blank" rel="noreferrer">
                                                        <Eye className="mr-1 h-3 w-3" /> Voir
                                                      </a>
                                                    </Button>
                                                    <Button
                                                      type="button"
                                                      size="sm"
                                                      variant="ghost"
                                                      onClick={() => addSubPage(sub.path)}
                                                      className="h-7 text-xs text-amber-600 hover:bg-amber-50"
                                                      title="Ajouter une sous-page"
                                                    >
                                                      <CornerDownRight className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              ))}

                                            {/* Custom pages attached to this Axe */}
                                            {axisCustomPages.map((cp) => {
                                              const pageIndex = pages.findIndex((p) => p.slug === cp.slug);
                                              return (
                                                <div key={cp.slug} className="p-3 sm:px-4 bg-amber-50/30 flex flex-wrap items-center justify-between gap-2 hover:bg-amber-50/60 transition-colors">
                                                  <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                      <CornerDownRight className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                                      <span className="font-bold text-xs text-french-blue">{cp.title}</span>
                                                      <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-semibold px-1.5 py-0.2">
                                                        Page Personnalisée
                                                      </span>
                                                      <code className="text-[11px] font-mono text-slate-500 bg-white px-1 py-0.2 rounded border">
                                                        {cp.slug}
                                                      </code>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 ml-5.5">{cp.description || `${cp.blocks.length} bloc(s) de contenu`}</p>
                                                  </div>
                                                  <div className="flex items-center gap-1.5 shrink-0">
                                                    <Button
                                                      type="button"
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={() => {
                                                        setSelectedPage(pageIndex);
                                                        setPageTabMode('cms');
                                                        setPageSubTab('editor');
                                                      }}
                                                      className="h-7 text-xs text-french-blue hover:bg-blue-50"
                                                    >
                                                      <Pencil className="mr-1 h-3 w-3" /> Modifier les blocs
                                                    </Button>
                                                    <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                                                      <a href={`${cp.slug}?draft=1`} target="_blank" rel="noreferrer">
                                                        <Eye className="mr-1 h-3 w-3" /> Voir
                                                      </a>
                                                    </Button>
                                                    <Button
                                                      type="button"
                                                      size="sm"
                                                      variant="ghost"
                                                      onClick={() => deletePage(pageIndex)}
                                                      className="h-7 text-xs text-red-500 hover:bg-red-50"
                                                      title="Supprimer cette page personnalisée"
                                                    >
                                                      <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* 2. If Pillar has direct subpages (ex: Diagnostic /elcs-analyse-complete) */}
                              {pillar.subpages && (
                                <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden shadow-xs">
                                  <div className="p-3 bg-purple-50/60 border-b flex items-center justify-between">
                                    <span className="font-bold text-xs text-purple-900 uppercase tracking-wider">
                                      Sous-sections & Rapports du Diagnostic
                                    </span>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setActiveSection('donnees-pages');
                                        setDonneesSubTab('elcs');
                                      }}
                                      className="h-7 text-xs text-purple-700 hover:bg-purple-100/50"
                                    >
                                      <ChartNoAxesCombined className="mr-1 h-3 w-3" /> Mettre à jour les indicateurs ELCS
                                    </Button>
                                  </div>

                                  {pillar.subpages.map((sub) => (
                                    <div key={sub.path} className="p-3 sm:px-4 flex flex-wrap items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                          <CornerDownRight className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                                          <span className="font-semibold text-xs text-slate-900">{sub.name}</span>
                                          <code className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                                            {sub.path}
                                          </code>
                                        </div>
                                        {sub.description && (
                                          <p className="text-[11px] text-slate-500 ml-5.5 mt-0.5">{sub.description}</p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          onClick={() => openRubriqueEditor(sub.path, sub.name, pillar.path)}
                                          className="h-7 text-xs text-french-blue hover:bg-blue-50"
                                          title="Modifier les contenus et blocs de cette rubrique"
                                        >
                                          <Pencil className="mr-1 h-3 w-3" /> Modifier
                                        </Button>
                                        <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                                          <a href={`${sub.path}?draft=1`} target="_blank" rel="noreferrer">
                                            <Eye className="mr-1 h-3 w-3" /> Voir
                                          </a>
                                        </Button>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => addSubPage(sub.path)}
                                          className="h-7 text-xs text-amber-600 hover:bg-amber-50"
                                        >
                                          <CornerDownRight className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* 3. If Pillar is Accueil (Show quick section cards) */}
                              {pillar.id === 'accueil' && (
                                <div className="grid gap-3 sm:grid-cols-3">
                                  <div className="p-3 rounded-lg border bg-white flex items-center justify-between">
                                    <div>
                                      <p className="font-semibold text-xs text-slate-800">Bannière & Accroches</p>
                                      <p className="text-[11px] text-slate-400">Titre hero, slogan et sous-titre</p>
                                    </div>
                                    <Button type="button" size="sm" variant="ghost" onClick={() => { setActiveSection('rubrique-accueil'); setAccueilSubTab('hero'); }} className="h-7 text-xs text-french-blue">
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="p-3 rounded-lg border bg-white flex items-center justify-between">
                                    <div>
                                      <p className="font-semibold text-xs text-slate-800">Cartes de Rubriques</p>
                                      <p className="text-[11px] text-slate-400">{content.home.cards.length} cartes interactives</p>
                                    </div>
                                    <Button type="button" size="sm" variant="ghost" onClick={() => { setActiveSection('rubrique-accueil'); setAccueilSubTab('cards'); }} className="h-7 text-xs text-french-blue">
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="p-3 rounded-lg border bg-white flex items-center justify-between">
                                    <div>
                                      <p className="font-semibold text-xs text-slate-800">Mots Officiels</p>
                                      <p className="text-[11px] text-slate-400">{content.home.messages.length} messages / actualités</p>
                                    </div>
                                    <Button type="button" size="sm" variant="ghost" onClick={() => { setActiveSection('rubrique-accueil'); setAccueilSubTab('messages'); }} className="h-7 text-xs text-french-blue">
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* 4. Custom CMS pages attached to this pillar directly */}
                              {pillarCustomPages.length > 0 && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50/20 p-3 space-y-2">
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                                    Pages personnalisées créées sous {pillar.name} ({pillarCustomPages.length}) :
                                  </p>
                                  <div className="divide-y divide-amber-100 bg-white rounded border">
                                    {pillarCustomPages.map((cp) => {
                                      const pageIndex = pages.findIndex((p) => p.slug === cp.slug);
                                      return (
                                        <div key={cp.slug} className="p-2.5 sm:px-3 flex items-center justify-between gap-2 text-xs">
                                          <div className="flex items-center gap-2 min-w-0">
                                            <CornerDownRight className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                                            <span className="font-bold text-french-blue">{cp.title}</span>
                                            <code className="text-[10px] text-slate-400 font-mono">{cp.slug}</code>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                setSelectedPage(pageIndex);
                                                setPageTabMode('cms');
                                                setPageSubTab('editor');
                                              }}
                                              className="h-6 px-2 text-[11px] text-french-blue"
                                            >
                                              <Pencil className="h-3 w-3 mr-1" /> Modifier
                                            </Button>
                                            <Button asChild size="sm" variant="ghost" className="h-6 px-1.5 text-[11px]">
                                              <a href={`${cp.slug}?draft=1`} target="_blank" rel="noreferrer">
                                                <Eye className="h-3 w-3" />
                                              </a>
                                            </Button>
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => deletePage(pageIndex)}
                                              className="h-6 px-1.5 text-red-500 hover:bg-red-50"
                                              title="Supprimer cette page"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= MODE 3 : TOUTES LES ROUTES ================= */}
              {pageTabMode === 'all-routes' && (
                <div className="space-y-3">
                  <div className="rounded-lg border bg-blue-50/50 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-french-blue mb-1">Index global des URLs du site LFJP</p>
                    <p className="text-xs text-slate-600">
                      Voici toutes les pages officielles et spécialisées intégrées au site. Cliquez sur « Modifier les contenus » pour ouvrir l’éditeur de cette rubrique, ou « Voir » pour consulter le rendu public.
                    </p>
                  </div>
                  <div className="divide-y rounded-lg border bg-white max-h-[500px] overflow-y-auto">
                    {Object.entries(breadcrumbRoutes)
                      .filter(([path, route]) =>
                        !pageSearchQuery.trim() ||
                        route.name.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
                        path.toLowerCase().includes(pageSearchQuery.toLowerCase())
                      )
                      .map(([path, route]) => (
                        <div key={path} className="flex flex-wrap items-center justify-between gap-3 p-3 hover:bg-slate-50 transition-colors">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-french-blue">{route.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{path} {route.parent ? `· Parent : ${route.parent}` : ''}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => openRubriqueEditor(path, route.name, route.parent)}
                              className="text-xs text-french-blue hover:bg-blue-50"
                            >
                              <Pencil className="mr-1 h-3.5 w-3.5" /> Modifier les contenus
                            </Button>
                            <Button asChild size="sm" variant="ghost" className="text-xs">
                              <a href={`${path}?draft=1`} target="_blank" rel="noreferrer">
                                <Eye className="mr-1 h-3.5 w-3.5" /> Voir
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ================= MODE 2 : CONSTRUCTEUR DE PAGES CMS ================= */}
              {pageTabMode === 'cms' && (
                pages.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50">
                  <FileText className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                  <h3 className="font-playfair text-lg font-bold text-slate-800">Aucune page personnalisée pour le moment</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 mb-5">
                    Vous pouvez créer de nouvelles pages principales ou des sous-pages, ajouter des sections, des graphiques et des images pour enrichir le site sans toucher au code.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button onClick={() => addPage('default')} className="bg-french-blue hover:bg-blue-700">
                      <Plus className="mr-1.5 h-4 w-4" /> Créer une nouvelle page
                    </Button>
                    <Button onClick={() => addPage('project')} variant="outline">
                      + Modèle Projet
                    </Button>
                    <Button onClick={() => addPage('data')} variant="outline">
                      + Modèle Données & Chiffres
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Sub-tab view toggle: Table list vs Block editor */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={pageSubTab === 'list' ? 'default' : 'outline'}
                        onClick={() => setPageSubTab('list')}
                        className={pageSubTab === 'list' ? 'bg-french-blue text-white' : ''}
                      >
                        <FileText className="mr-1.5 h-3.5 w-3.5" /> Liste des pages ({pages.length})
                      </Button>
                      {pages[selectedPage] && (
                        <Button
                          type="button"
                          size="sm"
                          variant={pageSubTab === 'editor' ? 'default' : 'outline'}
                          onClick={() => setPageSubTab('editor')}
                          className={pageSubTab === 'editor' ? 'bg-french-blue text-white' : ''}
                        >
                          <Pencil className="mr-1.5 h-3.5 w-3.5" /> Éditeur de blocs : {pages[selectedPage].title || 'Page'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {pageSubTab === 'list' ? (
                    <div className="space-y-4">
                      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 text-xs text-slate-600 border-b uppercase tracking-wider">
                            <tr>
                              <th className="px-4 py-3 font-semibold">Titre de la page</th>
                              <th className="px-4 py-3 font-semibold">Chemin URL</th>
                              <th className="px-4 py-3 font-semibold">Hiérarchie</th>
                              <th className="px-4 py-3 font-semibold text-center">Blocs</th>
                              <th className="px-4 py-3 font-semibold text-center">Menu</th>
                              <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {pages
                              .map((page, index) => ({ page, index }))
                              .filter(({ page }) =>
                                !pageSearchQuery.trim() ||
                                page.title.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
                                page.slug.toLowerCase().includes(pageSearchQuery.toLowerCase())
                              )
                              .map(({ page, index }) => (
                                <tr key={`${page.slug}-${index}`} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="px-4 py-3 font-medium text-slate-900">
                                    <div className="flex items-center gap-2">
                                      {page.parent && <CornerDownRight className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedPage(index);
                                          setPageSubTab('editor');
                                        }}
                                        className="text-left font-bold text-french-blue hover:underline"
                                      >
                                        {page.title || `Page ${index + 1}`}
                                      </button>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                                    {page.slug}
                                  </td>
                                  <td className="px-4 py-3 text-xs">
                                    {page.parent ? (
                                      <span className="rounded bg-amber-50 text-amber-700 px-2 py-0.5 font-medium border border-amber-200">
                                        Sous-page de : {page.parent}
                                      </span>
                                    ) : (
                                      <span className="rounded bg-slate-100 text-slate-600 px-2 py-0.5 font-medium">
                                        Page principale
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center text-xs font-semibold text-slate-700">
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5">
                                      {page.blocks.length} bloc(s)
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center text-xs">
                                    {page.showInNavigation !== false ? (
                                      <span className="text-emerald-600 font-semibold flex items-center justify-center gap-1">
                                        <Check className="h-3.5 w-3.5" /> Visible
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">Masqué</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedPage(index);
                                          setPageSubTab('editor');
                                        }}
                                        title="Modifier le contenu et les blocs"
                                        className="h-8 text-xs text-french-blue hover:bg-blue-50"
                                      >
                                        <Pencil className="mr-1 h-3.5 w-3.5" /> Modifier
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className="h-8 text-xs"
                                        title="Voir la page"
                                      >
                                        <a href={`${page.slug}?draft=1`} target="_blank" rel="noreferrer">
                                          <Eye className="h-3.5 w-3.5" />
                                        </a>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => addSubPage(page.slug)}
                                        title="Ajouter une sous-page rattachée à cette page"
                                        className="h-8 text-xs text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                                      >
                                        <CornerDownRight className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => duplicatePage(index)}
                                        title="Dupliquer"
                                        className="h-8 text-xs"
                                      >
                                        <Copy className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deletePage(index)}
                                        title="Supprimer la page"
                                        className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : pages[selectedPage] ? (
                    <div className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b">
                          <div className="flex items-center gap-2">
                            {activeRubriqueReturn ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setActiveSection(activeRubriqueReturn)}
                                className="text-xs text-french-blue border-french-blue/30 bg-blue-50/50 hover:bg-blue-100"
                              >
                                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> ← Retour à la rubrique
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setPageTabMode('pillars')}
                                className="text-xs text-french-blue border-french-blue/30 bg-blue-50/50 hover:bg-blue-100"
                              >
                                <FolderTree className="mr-1.5 h-3.5 w-3.5" /> ← Retour à l’Arborescence
                              </Button>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setPageSubTab('list')}
                              className="text-xs text-slate-600 hover:text-slate-900"
                            >
                              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Liste des pages ({pages.length})
                            </Button>
                          </div>
                          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                            Rubrique {selectedPage + 1} / {pages.length}
                          </span>
                        </div>

                        <div className="rounded-lg bg-blue-50/70 border border-blue-200/80 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <FolderTree className="h-4 w-4 text-french-blue shrink-0" />
                            <span className="text-slate-600 font-medium">Position dans l'arborescence :</span>
                            <span className="font-bold text-french-blue">
                              {pages[selectedPage].parent ? `${pages[selectedPage].parent} ➔ ` : 'Racine ➔ '}{pages[selectedPage].title}
                            </span>
                            <code className="bg-white border px-1.5 py-0.5 rounded font-mono text-[11px] text-slate-600">
                              {pages[selectedPage].slug}
                            </code>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {pages[selectedPage].blocks.length} bloc(s) de contenu
                          </span>
                        </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-french-blue font-playfair">{pages[selectedPage].title || 'Page'}</h3>
                            {pages[selectedPage].parent && (
                              <span className="rounded bg-amber-100 text-amber-800 text-[11px] px-2 py-0.5 font-semibold">
                                Sous-page de : {pages[selectedPage].parent}
                              </span>
                            )}
                            {pages[selectedPage].showInNavigation !== false && (
                              <span className="rounded bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 font-semibold">
                                Visible dans le menu
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            URL : <code className="bg-slate-100 px-1 py-0.5 rounded text-french-blue">{pages[selectedPage].slug}</code>
                            {' · '}
                            <a className="text-french-blue font-semibold hover:underline inline-flex items-center gap-1" href={`${pages[selectedPage].slug}?draft=1`} target="_blank" rel="noreferrer">
                              <Eye className="h-3 w-3" /> Prévisualiser sur le site
                            </a>
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Button type="button" size="sm" variant="outline" title="Monter dans l'ordre" onClick={() => movePage(selectedPage, -1)} disabled={selectedPage === 0}>
                            <ArrowUp className="mr-1 h-3.5 w-3.5" /> Monter
                          </Button>
                          <Button type="button" size="sm" variant="outline" title="Descendre dans l'ordre" onClick={() => movePage(selectedPage, 1)} disabled={selectedPage === pages.length - 1}>
                            <ArrowDown className="mr-1 h-3.5 w-3.5" /> Descendre
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => addSubPage(pages[selectedPage].slug)}>
                            <CornerDownRight className="mr-1 h-3.5 w-3.5" /> + Sous-page
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={duplicatePage}>
                            <Copy className="mr-1 h-3.5 w-3.5" /> Dupliquer
                          </Button>
                          <Button type="button" size="sm" variant="destructive" onClick={deletePage}>
                            <Trash2 className="mr-1 h-3.5 w-3.5" /> Supprimer
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 bg-slate-50 p-4 rounded-lg border">
                        <div className="grid gap-1.5">
                          <Label className="text-xs font-semibold">Titre principal de la page</Label>
                          <Input className="bg-white" value={pages[selectedPage].title} onChange={(event) => updatePage('title', event.target.value)} />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs font-semibold">Chemin URL (slug)</Label>
                          <Input className="bg-white" value={pages[selectedPage].slug} onChange={(event) => updatePage('slug', normalizePageSlug(event.target.value))} placeholder="/mon-chemin" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs font-semibold">Page parente (pour créer une sous-rubrique)</Label>
                          <select
                            className="h-10 rounded-md border px-3 text-sm bg-white"
                            value={pages[selectedPage].parent || ''}
                            onChange={(event) => updatePage('parent', event.target.value)}
                          >
                            <option value="">Aucune (Page principale / racine)</option>
                            <optgroup label="🏛️ Les 5 Piliers Fondamentaux">
                              <option value="/">1. Accueil (/)</option>
                              <option value="/methode">2. Méthode (/methode)</option>
                              <option value="/vision-missions-valeurs">3. Vision, Missions & Valeurs (/vision-missions-valeurs)</option>
                              <option value="/diagnostic">4. Diagnostic (/diagnostic)</option>
                              <option value="/plan-strategique">5. Plan Stratégique (/plan-strategique)</option>
                            </optgroup>
                            <optgroup label="🎯 Sous-pages du Plan Stratégique & Diagnostic">
                              {Object.entries(breadcrumbRoutes)
                                .filter(([path]) => path !== '/' && path !== '/methode' && path !== '/vision-missions-valeurs' && path !== '/diagnostic' && path !== '/plan-strategique')
                                .map(([path, route]) => (
                                  <option key={path} value={path}>
                                    {route.name} ({path})
                                  </option>
                                ))}
                            </optgroup>
                            {pages.filter((_, index) => index !== selectedPage).length > 0 && (
                              <optgroup label="📄 Autres pages personnalisées">
                                {pages.filter((_, index) => index !== selectedPage).map((candidate) => (
                                  <option key={candidate.slug} value={normalizePageSlug(candidate.slug)}>
                                    {candidate.title} — ({candidate.slug})
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs font-semibold">Libellé dans la barre de menu</Label>
                          <Input className="bg-white" value={pages[selectedPage].menuLabel || ''} onChange={(event) => updatePage('menuLabel', event.target.value)} placeholder="Laisser vide pour utiliser le titre" />
                        </div>
                        <div className="grid gap-1.5 sm:col-span-2">
                          <Label className="text-xs font-semibold">Description / Chapeau introductif</Label>
                          <Textarea className="bg-white min-h-[70px]" value={pages[selectedPage].description || ''} onChange={(event) => updatePage('description', event.target.value)} placeholder="Présentez brièvement cette page..." />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={pages[selectedPage].showInNavigation !== false}
                              onChange={(event) => setPages((current) => current.map((page, index) => index === selectedPage ? { ...page, showInNavigation: event.target.checked } : page))}
                              className="rounded border-slate-300 h-4 w-4 text-french-blue"
                            />
                            Afficher cette page dans la barre de navigation du site
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <Label className="text-base font-bold text-french-blue">
                              Sections, sous-sections et blocs de contenu ({pages[selectedPage].blocks.length})
                            </Label>
                            <p className="text-xs text-slate-500">
                              Structurez la page avec des sections (H2), des sous-sections (H3), des paragraphes et des éléments riches.
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg border bg-slate-50 p-3 space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Ajouter un bloc ou une section :</p>
                          <div className="flex flex-wrap gap-1.5">
                            <Button type="button" size="sm" onClick={() => addSection(2)} className="bg-french-blue hover:bg-blue-700 text-xs">
                              <Plus className="mr-1 h-3.5 w-3.5" /> Section (Titre H2)
                            </Button>
                            <Button type="button" size="sm" onClick={() => addSection(3)} variant="outline" className="text-xs border-french-blue/30 text-french-blue hover:bg-blue-50">
                              <Plus className="mr-1 h-3.5 w-3.5" /> Sous-section (H3)
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('paragraph')} className="text-xs">
                              + Paragraphe
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('callout')} className="text-xs">
                              + Encart clé
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('quote')} className="text-xs">
                              + Citation
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('image')} className="text-xs">
                              + Image
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('gallery')} className="text-xs">
                              + Galerie photos
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('list')} className="text-xs">
                              + Liste à puces
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('table')} className="text-xs">
                              + Tableau
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('chart')} className="text-xs">
                              + Graphique
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('button')} className="text-xs">
                              + Bouton d'action
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('video')} className="text-xs">
                              + Vidéo
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('embed')} className="text-xs">
                              + iFrame
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => addBlock('divider')} className="text-xs">
                              + Séparateur
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {pages[selectedPage].blocks.map((block, blockIndex) => {
                            const isSection = block.type === 'heading' && block.level === 2;
                            const isSubSection = block.type === 'heading' && block.level === 3;
                            return (
                              <div
                                key={`block-${blockIndex}`}
                                className={`space-y-3 rounded-lg border p-4 shadow-sm transition-all ${
                                  isSection
                                    ? 'bg-blue-50/70 border-french-blue/40 ring-1 ring-french-blue/20'
                                    : isSubSection
                                    ? 'bg-sky-50/50 border-sky-300'
                                    : 'bg-white border-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 border-b pb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700">
                                      {blockIndex + 1}
                                    </span>
                                    <span className={`font-semibold text-xs uppercase tracking-wide px-2 py-0.5 rounded ${
                                      isSection
                                        ? 'bg-french-blue text-white'
                                        : isSubSection
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}>
                                      {isSection ? 'Section principale (H2)' : isSubSection ? 'Sous-section (H3)' : block.type}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveBlock(blockIndex, -1)} disabled={blockIndex === 0}>
                                      <ArrowUp className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveBlock(blockIndex, 1)} disabled={blockIndex === pages[selectedPage].blocks.length - 1}>
                                      <ArrowDown className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button type="button" size="sm" variant="outline" title="Dupliquer ce bloc" onClick={() => duplicateBlock(blockIndex)}>
                                      <Copy className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button type="button" size="sm" variant="destructive" title="Supprimer ce bloc" onClick={() => removeBlock(blockIndex)}>
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>

                                {renderBlockEditor(block, blockIndex)}

                                <div className="mt-3 rounded border border-slate-200 bg-white/80 p-3 shadow-inner">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                                    <Eye className="h-3 w-3" /> Rendu visuel dans la page :
                                  </p>
                                  {renderBlockPreview(block)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
              )
            )}
            </CardContent>
          </Card>

          <Card id="admin-panel-edition-visuelle" role="tabpanel" aria-labelledby="admin-tab-edition-visuelle" hidden={activeSection !== 'edition-visuelle'} className={visualExpanded ? 'fixed inset-2 z-50 flex flex-col overflow-hidden bg-white shadow-2xl' : 'overflow-hidden'}>
            <CardHeader className="shrink-0 border-b bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="min-w-0"><CardTitle className="text-lg">Aperçu & édition</CardTitle><CardDescription className="truncate">{visualRoute} · cliquez sur un élément puis utilisez le crayon</CardDescription></div>
                  <div className="hidden h-8 w-px bg-slate-200 sm:block" />
                  <div className="flex items-center gap-1 rounded-md border bg-slate-50 p-1" aria-label="Panneaux de l’atelier">
                    <Button type="button" size="icon" variant="ghost" title={treeCollapsed ? 'Afficher l’arborescence' : 'Masquer l’arborescence'} aria-label={treeCollapsed ? 'Afficher l’arborescence' : 'Masquer l’arborescence'} onClick={() => setTreeCollapsed((collapsed) => !collapsed)}>{treeCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}</Button>
                    <Button type="button" size="icon" variant="ghost" title={inspectorCollapsed ? 'Afficher les propriétés' : 'Masquer les propriétés'} aria-label={inspectorCollapsed ? 'Afficher les propriétés' : 'Masquer les propriétés'} onClick={() => setInspectorCollapsed((collapsed) => !collapsed)}>{inspectorCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}</Button>
                  </div>
                  <div className="flex items-center gap-1 rounded-md border bg-slate-50 p-1" aria-label="Format d’aperçu">
                    {([{ id: 'desktop', label: 'Ordinateur', Icon: Monitor }, { id: 'tablet', label: 'Tablette', Icon: Tablet }, { id: 'mobile', label: 'Mobile', Icon: Smartphone }] as const).map(({ id, label, Icon }) => <Button key={id} type="button" size="icon" variant={previewViewport === id ? 'default' : 'ghost'} title={label} aria-label={label} onClick={() => setPreviewViewport(id)}><Icon className="h-4 w-4" /></Button>)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => saveDraft()}><Save className="h-4 w-4" /> Brouillon</Button>
                  <Button type="button" variant="outline" size="icon" title={visualExpanded ? 'Réduire l’éditeur' : 'Agrandir l’éditeur'} aria-label={visualExpanded ? 'Réduire l’éditeur' : 'Agrandir l’éditeur'} onClick={() => setVisualExpanded((expanded) => !expanded)}>{visualExpanded ? <Minimize2 /> : <Maximize2 />}</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className={editorGridClass}>
              {!treeCollapsed ? <nav className="max-h-32 space-y-1 overflow-y-auto border-b bg-slate-50 p-3 xl:max-h-none xl:border-b-0 xl:border-r" aria-label="Arborescence des pages">
                <div className="sticky top-0 z-10 mb-2 flex items-center justify-between bg-slate-50 pb-2"><h3 className="text-xs font-semibold uppercase text-slate-500">Arborescence</h3><Button type="button" size="icon" variant="ghost" title="Masquer l’arborescence" aria-label="Masquer l’arborescence" onClick={() => setTreeCollapsed(true)}><PanelLeftClose className="h-4 w-4" /></Button></div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">Pages et rubriques</h3>
                {Object.entries(breadcrumbRoutes)
                  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
                  .map(([path, route]) => {
                    let depth = 0;
                    let parent = route.parent;
                    while (parent && parent !== '/' && depth < 5) {
                      depth += 1;
                      parent = (breadcrumbRoutes as Record<string, { parent?: string }>)[parent]?.parent;
                    }
                    return <button key={path} type="button" onClick={() => { setVisualRoute(path); setSelectedVisualElement(null); }} className={`block w-full truncate rounded px-2 py-1.5 text-left text-sm ${visualRoute === path ? 'bg-french-blue text-white' : 'text-slate-700 hover:bg-blue-50'}`} style={{ paddingLeft: `${8 + depth * 12}px` }} title={path}>{route.name}</button>;
                  })}
                {pages.map((page) => (
                  <button key={page.slug} type="button" onClick={() => { setVisualRoute(normalizePageSlug(page.slug)); setSelectedVisualElement(null); }} className={`block w-full truncate rounded px-2 py-1.5 text-left text-sm ${visualRoute === normalizePageSlug(page.slug) ? 'bg-french-blue text-white' : 'text-slate-700 hover:bg-blue-50'}`} style={{ paddingLeft: `${8 + (page.parent ? 24 : 0)}px` }} title={page.slug}>{page.title}</button>
                ))}
                {Object.keys((getEditablePageData().filmAnnuelData as Record<string, unknown>)).filter((level) => !(breadcrumbRoutes as Record<string, unknown>)[`/film-annuel/${level}`]).map((level) => (
                  <button key={`film-${level}`} type="button" onClick={() => { setVisualRoute(`/film-annuel/${level}`); setSelectedVisualElement(null); }} className={`block w-full truncate rounded px-2 py-1.5 pl-8 text-left text-sm ${visualRoute === `/film-annuel/${level}` ? 'bg-french-blue text-white' : 'text-slate-700 hover:bg-blue-50'}`}>Film annuel — {level}</button>
                ))}
              </nav> : <div className="hidden flex-col items-center gap-2 border-r bg-slate-50 py-3 xl:flex"><Button type="button" size="icon" variant="ghost" title="Afficher l’arborescence" aria-label="Afficher l’arborescence" onClick={() => setTreeCollapsed(false)}><PanelLeftOpen className="h-4 w-4" /></Button><span className="[writing-mode:vertical-rl] text-[10px] font-semibold uppercase text-slate-400">Pages</span></div>}
              <div className="flex min-h-[72vh] min-w-0 flex-col overflow-hidden bg-slate-200 xl:min-h-0">
                <div className="flex shrink-0 items-center justify-between border-b bg-white px-3 py-2 text-xs text-slate-600">
                  <span className="truncate">{visualRoute}</span>
                  <span className="ml-2">{previewViewport === 'desktop' ? 'Ordinateur' : previewViewport === 'tablet' ? 'Tablette' : 'Mobile'} · brouillon</span>
                </div>
                <div ref={previewCanvas} className="relative flex min-h-0 flex-1 justify-center overflow-auto p-3 sm:p-5">
                  <div className="relative min-h-full bg-white shadow-lg transition-[width] duration-200" style={{ width: previewViewport === 'desktop' ? '100%' : previewViewport === 'tablet' ? '820px' : '390px', maxWidth: '100%' }}>
                <iframe
                  ref={previewFrame}
                  key={visualRoute}
                  title={`Aperçu ${visualRoute}`}
                  src={`${visualRoute}?draft=1&edit=1&embedded=1`}
                  className={`block min-h-[640px] bg-white ${visualExpanded ? 'h-full' : 'h-[72vh]'} w-full`}
                  style={{ height: visualExpanded ? 'calc(100vh - 126px)' : undefined }}
                />
                    {selectedVisualElement?.rect && <button type="button" className="absolute z-20 inline-flex h-9 w-9 items-center justify-center rounded-md bg-french-blue text-white shadow-lg ring-2 ring-white hover:bg-blue-800" style={{ left: Math.max(4, selectedVisualElement.rect.left), top: Math.max(4, selectedVisualElement.rect.top - 42) }} title="Modifier cet élément" aria-label="Modifier cet élément" onClick={() => { setInspectorCollapsed(false); setFocusInspector(true); }}><Pencil className="h-4 w-4" /></button>}
                  </div>
                </div>
              </div>
              {!inspectorCollapsed && <aside className="min-h-0 space-y-3 overflow-y-auto border-l bg-white p-4" aria-label="Propriétés de l’élément sélectionné">
                <div className="flex items-center justify-between"><h3 className="text-xs font-semibold uppercase text-slate-500">Inspecteur</h3><Button type="button" size="icon" variant="ghost" title="Masquer l’inspecteur" aria-label="Masquer l’inspecteur" onClick={() => setInspectorCollapsed(true)}><PanelRightClose className="h-4 w-4" /></Button></div>
                {!selectedVisualElement ? <p className="text-sm text-slate-500">Sélectionnez un texte, un lien ou une image dans l’aperçu.</p> : (
                  <>
                    <p className="text-xs text-slate-500">{selectedVisualElement.kind === 'image' ? 'Image' : selectedVisualElement.kind === 'link' ? 'Lien' : 'Texte'}</p>
                    {selectedVisualElement.kind === 'text' && <>
                      <div className="grid gap-1"><Label htmlFor="selected-text"><Pencil className="mr-1 inline h-3.5 w-3.5" />Contenu</Label><Textarea autoFocus={focusInspector} id="selected-text" value={selectedVisualElement.text || ''} onFocus={() => setFocusInspector(false)} onChange={(event) => updateVisualElement('text', event.target.value)} /></div>
                      {selectedVisualElement.linkPath && <div className="grid gap-1"><Label htmlFor="selected-text-link">Adresse du lien</Label><Input id="selected-text-link" value={selectedVisualElement.href || ''} onChange={(event) => updateVisualElement('href', event.target.value)} /></div>}
                    </>}
                    {selectedVisualElement.kind === 'image' && <>
                      <div className="grid gap-1"><Label htmlFor="selected-image-src">Source de l’image</Label><Input id="selected-image-src" value={selectedVisualElement.src || ''} onChange={(event) => updateVisualElement('src', event.target.value)} /></div>
                      <div className="grid gap-1"><Label htmlFor="selected-image-alt">Texte alternatif</Label><Input id="selected-image-alt" value={selectedVisualElement.alt || ''} onChange={(event) => updateVisualElement('alt', event.target.value)} /></div>
                      <MediaPreview src={selectedVisualElement.src || ''} />
                    </>}
                    {selectedVisualElement.kind === 'link' && <div className="grid gap-1"><Label htmlFor="selected-link">Adresse</Label><Input id="selected-link" value={selectedVisualElement.href || ''} onChange={(event) => updateVisualElement('href', event.target.value)} /></div>}
                    <Button type="button" size="sm" variant="ghost" onClick={() => setSelectedVisualElement(null)}>Désélectionner</Button>
                  </>
                )}
                <p className="text-xs text-slate-500">Les textes, médias et liens de la page s’éditent depuis le crayon; les graphiques utilisent les séries dans Données & graphes.</p>
              </aside>}
              {inspectorCollapsed && <div className="hidden items-start justify-center border-l bg-white p-2 xl:flex"><Button type="button" size="icon" variant="ghost" title="Afficher l’inspecteur" aria-label="Afficher l’inspecteur" onClick={() => setInspectorCollapsed(false)}><PanelRightOpen className="h-4 w-4" /></Button></div>}
            </CardContent>
          </Card>

          <Card id="admin-panel-acces" role="tabpanel" aria-labelledby="admin-tab-acces" hidden={activeSection !== 'acces'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-french-blue" /> Accès des collaborateurs</CardTitle>
              <CardDescription>Les comptes de cette liste peuvent modifier les contenus, créer des Previews et publier après validation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Active Profile & Role Management Card (Admin vs Simple Editor) */}
              <div className="rounded-xl border bg-gradient-to-r from-slate-50 to-blue-50/40 p-5 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${canDelete ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                      {canDelete ? <ShieldCheck className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{userProfile.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          canDelete ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                        }`}>
                          {canDelete ? 'Administrateur (Tous droits)' : 'Éditeur Simple (Sans suppression)'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{userProfile.email}</p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setProfileModalTab('login');
                      setIsProfileModalOpen(true);
                    }}
                    className="bg-french-blue hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    <User className="mr-1.5 h-3.5 w-3.5" /> Changer de profil / Se connecter
                  </Button>
                </div>

                {/* Editable Accounts Vault List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Key className="h-4 w-4 text-french-blue" />
                        Identifiants & Mots de passe modifiables ({configuredAccounts.length})
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Vous pouvez modifier les adresses email et mots de passe. Dès modification, chaque profil peut se connecter immédiatement avec ses nouveaux identifiants.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {configuredAccounts.filter((a) => a.id !== 'superadmin').map((acc) => {
                      const isEditingThis = editingAccountId === acc.id;
                      const isEditor = acc.role === 'editor';

                      return (
                        <div
                          key={acc.id}
                          className={`rounded-xl border p-4 shadow-xs space-y-3 bg-white transition-all ${
                            isEditor ? 'hover:border-amber-400' : 'hover:border-french-blue'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                              {isEditor ? (
                                <User className="h-4 w-4 text-amber-600" />
                              ) : (
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                              )}
                              <span className="font-bold text-xs text-slate-900">{acc.name}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isEditor ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isEditor ? 'Éditeur Simple' : 'Admin Principal'}
                            </span>
                          </div>

                          {isEditingThis ? (
                            /* Edit Credentials Form */
                            <div className="space-y-2.5 pt-1">
                              <div>
                                <Label className="text-[11px] font-semibold text-slate-700">Adresse Email</Label>
                                <Input
                                  value={editFormEmail}
                                  onChange={(e) => setEditFormEmail(e.target.value)}
                                  className="text-xs h-8 mt-1 font-mono bg-white"
                                  placeholder="nouvel-email@lfjpsaly.org"
                                />
                              </div>
                              <div>
                                <Label className="text-[11px] font-semibold text-slate-700">Nouveau Mot de passe</Label>
                                <Input
                                  value={editFormPassword}
                                  onChange={(e) => setEditFormPassword(e.target.value)}
                                  className="text-xs h-8 mt-1 font-mono bg-white"
                                  placeholder="••••••••"
                                />
                              </div>
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingAccountId(null)}
                                  className="h-7 text-xs text-slate-500"
                                >
                                  Annuler
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => handleUpdateAccountCredentials(acc.id, editFormEmail, editFormPassword)}
                                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                >
                                  Enregistrer
                                </Button>
                              </div>
                            </div>
                          ) : (
                            /* Read-only view with edit button */
                            <div className="space-y-2 text-xs">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-500">Email de connexion :</span>
                                  <code className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">{acc.email}</code>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-500">Mot de passe actuel :</span>
                                  <code className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{acc.password}</code>
                                </div>
                                <p className="text-[11px] text-slate-500 pt-1">
                                  {isEditor
                                    ? 'Modifications de tous les contenus autorisées · Suppressions bloquées.'
                                    : 'Tous droits : créations, modifications, réorganisation et suppressions.'}
                                </p>
                              </div>

                              <div className="pt-2 border-t flex items-center justify-between">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingAccountId(acc.id);
                                    setEditFormEmail(acc.email);
                                    setEditFormPassword(acc.password);
                                    setEditFormName(acc.name);
                                  }}
                                  className="h-7 text-xs text-french-blue hover:bg-blue-50"
                                >
                                  <Pencil className="mr-1 h-3 w-3" /> Modifier l’identifiant & mot de passe
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    switchUserProfile(acc);
                                  }}
                                  className="h-7 text-xs text-slate-700 hover:bg-slate-100 font-semibold"
                                >
                                  Activer ce profil →
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-900">Compte connecté GitHub (Mode GitOps)</p>
                <p className="mt-1 text-sm text-emerald-800">{user.login}{authorizedUsers.includes(user.login) ? ' · accès administrateur confirmé' : ''}</p>
              </div>
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Comptes autorisés</h3>
                  <p className="mt-1 text-sm text-slate-600">Chaque collaborateur utilise son propre compte GitHub; aucun partage de mot de passe n’est nécessaire.</p>
                </div>
                {authorizedUsers.length ? <ul className="divide-y rounded-md border bg-white">{authorizedUsers.map((login) => <li key={login} className="flex items-center gap-3 px-4 py-3"><Github className="h-4 w-4 text-slate-500" /><span className="font-medium text-slate-800">{login}</span>{login === user.login && <span className="ml-auto text-xs font-semibold text-emerald-700">Vous</span>}</li>)}</ul> : <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Aucun compte autorisé n’est configuré. Vérifiez `ADMIN_GITHUB_USERS` dans les variables Vercel.</p>}
              </section>
              <section className="space-y-2 rounded-md border bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">Ajouter ou retirer une personne</h3>
                <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
                  <li>Dans Vercel, ouvrez le projet PSD-LFJP puis <strong>Settings → Environment Variables</strong>.</li>
                  <li>Modifiez `ADMIN_GITHUB_USERS` avec les identifiants GitHub séparés par des virgules, par exemple `compte-1,compte-2`.</li>
                  <li>Enregistrez puis redéployez l’environnement Production.</li>
                </ol>
                <p className="text-xs text-slate-500">La liste n’est volontairement pas modifiable ici: seul un administrateur du projet Vercel peut accorder un accès, ce qui évite qu’un visiteur s’ajoute lui-même.</p>
                <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-french-blue hover:underline"><Settings2 className="h-4 w-4" /> Ouvrir Vercel</a>
              </section>
            </CardContent>
          </Card>

          {/* ===================== TAB: PUBLICATION & EXPORT ===================== */}
          <Card id="admin-panel-publication" role="tabpanel" aria-labelledby="admin-tab-publication" hidden={activeSection !== 'publication'}>
            <CardHeader className="border-b bg-white">
              <CardTitle className="text-xl text-french-blue flex items-center gap-2">
                <Send className="h-5 w-5" /> Centre de publication & déploiement GitHub / Vercel
              </CardTitle>
              <CardDescription>
                Synchronisation sécurisée du site sans base de données : contrôlez vos brouillons, exportez vos sauvegardes et déployez automatiquement sur Vercel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Flux de déploiement Éditeur -> Vercel (Validation SuperAdmin) */}
              {pendingDeployment && (
                <div
                  className={`rounded-xl border p-5 shadow-sm space-y-3.5 ${
                    pendingDeployment.status === 'pending_admin_approval'
                      ? 'border-amber-400 bg-amber-50/70'
                      : pendingDeployment.status === 'approved_and_deployed'
                      ? 'border-emerald-400 bg-emerald-50/60'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/70 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                        <Send className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          Demande de déploiement Vercel reçue de l’Éditeur
                        </h4>
                        <p className="text-xs text-slate-500">
                          Soumis par <strong>{pendingDeployment.authorName}</strong> ({pendingDeployment.submittedBy}) le{' '}
                          {new Date(pendingDeployment.submittedAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        pendingDeployment.status === 'pending_admin_approval'
                          ? 'bg-amber-200 text-amber-900 animate-pulse'
                          : pendingDeployment.status === 'approved_and_deployed'
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-red-200 text-red-900'
                      }`}
                    >
                      {pendingDeployment.status === 'pending_admin_approval'
                        ? '⏳ Action requise : En attente de validation'
                        : pendingDeployment.status === 'approved_and_deployed'
                        ? '✅ Validé et déployé sur Vercel'
                        : '❌ Demande rejetée avec remarques'}
                    </span>
                  </div>

                  {pendingDeployment.notes && (
                    <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs text-slate-700">
                      <span className="font-bold text-slate-800 block mb-1">Résumé des modifications fournies par l’éditeur :</span>
                      <p className="italic">« {pendingDeployment.notes} »</p>
                    </div>
                  )}

                  {pendingDeployment.status === 'pending_admin_approval' && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setActiveSection('edition-visuelle');
                          setVisualExpanded(true);
                        }}
                        className="text-xs bg-white text-slate-800 hover:bg-slate-50"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5 text-french-blue" /> Examiner en Grand Format
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAdminApproveAndDeploy}
                        disabled={isSaving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                      >
                        <Send className="h-3.5 w-3.5" /> {isSaving ? 'Déploiement en cours…' : 'Valider & Déployer sur Vercel'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setIsRejectModalOpen(true)}
                        className="text-xs text-amber-800 border-amber-300 hover:bg-amber-100/60"
                      >
                        <X className="mr-1 h-3 w-3" /> Demander corrections
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Publication Status & Action Bar */}
              <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">1. Prévisualisation & Publication</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Testez vos modifications en direct sur le site avant de déclencher la mise en production.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={previewDraft} variant="outline" className="text-xs">
                      <Eye className="mr-1.5 h-3.5 w-3.5 text-french-blue" /> Prévisualiser tout le site
                    </Button>
                    <Button onClick={saveDraft} variant="outline" className="text-xs">
                      <Save className="mr-1.5 h-3.5 w-3.5" /> Enregistrer le brouillon
                    </Button>
                    <Button onClick={resetDraft} variant="ghost" className="text-xs text-slate-500 hover:text-red-600">
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Réinitialiser
                    </Button>
                  </div>
                </div>

                {/* Workflow Status Banner */}
                <div className="rounded-xl border p-4 bg-gradient-to-r from-blue-50/70 via-slate-50 to-emerald-50/50 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-xs text-slate-900">
                        Comment les modifications arrivent-elles sur Vercel ?
                      </span>
                    </div>
                    {user?.login && !user.login.includes('@') ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5">
                        <Github className="h-3 w-3" /> Connecté GitHub : @{user.login} (Prêt à publier)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5">
                        Mode Édition ({userProfile.email})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Le site fonctionne en architecture <strong>GitOps</strong> : toute mise à jour sur Vercel provient d’un commit sur la branche GitHub.
                  </p>
                  <ul className="text-xs text-slate-600 list-disc pl-5 space-y-1">
                    <li>
                      <strong>Option A (SuperAdmin GitHub)</strong> : Connectez-vous avec GitHub pour créer la Pull Request et la déployer sur Vercel en 1 clic.
                    </li>
                    <li>
                      <strong>Option B (Publication transparente pour Éditeur & Admin)</strong> : En ajoutant la variable <code>GITHUB_TOKEN</code> dans vos réglages Vercel, tout clic de publication des éditeurs envoie directement les fichiers sur GitHub et Vercel se met à jour automatiquement !
                    </li>
                  </ul>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border bg-blue-50/60 space-y-2">
                    <h4 className="font-semibold text-xs text-french-blue uppercase tracking-wider flex items-center gap-1.5">
                      <Github className="h-4 w-4" /> Déploiement Vercel via GitHub
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Cliquez ci-dessous pour envoyer vos modifications vers une branche de prévisualisation GitHub. Vercel générera automatiquement un lien de preview dédié.
                    </p>
                    <Button
                      onClick={createPullRequest}
                      disabled={isSaving}
                      className="bg-french-blue hover:bg-blue-700 text-white text-xs mt-2 w-full sm:w-auto"
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" /> {isSaving ? 'Génération de la Preview…' : 'Créer une Preview GitHub / Vercel'}
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg border bg-slate-50 space-y-2">
                    <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Validation & Mise en production
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Une fois la Pull Request vérifiée sur Vercel, publiez définitivement en production pour actualiser le site officiel.
                    </p>
                    {pullRequest ? (
                      <div className="space-y-2">
                        <Button
                          onClick={publishPullRequest}
                          disabled={isSaving}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs w-full sm:w-auto font-semibold"
                        >
                          <Check className="mr-1.5 h-3.5 w-3.5" /> Publier définitivement en production
                        </Button>
                        <p className="text-[11px] text-slate-600">
                          Lien actif :{' '}
                          <a className="font-semibold text-french-blue underline" href={pullRequest.url} target="_blank" rel="noreferrer">
                            Voir la Pull Request #{pullRequest.number} sur GitHub
                          </a>
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic pt-2">
                        Aucune Pull Request active. Cliquez sur « Créer une Preview » pour démarrer le déploiement.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* JSON Backup & Restore section */}
              <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Database className="h-4 w-4 text-french-blue" /> 2. Sauvegarde & Restauration (Export / Import JSON)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Téléchargez l'intégralité des données du site sous forme de fichiers JSON, ou restaurez une sauvegarde précédente.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={exportJsonFiles}
                    variant="outline"
                    className="text-xs text-slate-700 border-slate-300 hover:bg-slate-50"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5 text-french-blue" />
                    Télécharger la sauvegarde complète (JSON)
                  </Button>

                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                    <Upload className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Restaurer une sauvegarde JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      className="sr-only"
                      onChange={(event) => importJsonBackup(event.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>

              {/* Architecture Info Banner */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2 text-xs text-slate-600">
                <p className="font-bold text-slate-800 text-sm">Architecture CMS LFJP :</p>
                <p>
                  Ce CMS fonctionne selon le modèle <strong>GitOps</strong> : vos contenus sont stockés dans des fichiers JSON versionnés dans le dépôt GitHub. Lorsque vous publiez, Vercel compile automatiquement le site statique ultra-rapide et sécurisé, sans risque d'attaque sur une base SQL et sans frais d'hébergement de serveur.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* =========================================================================
          MODAL 1: PROFIL D'ACCÈS & RÔLES (ADMIN vs ÉDITEUR SIMPLE)
          ========================================================================= */}
      {isProfileModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-french-blue to-blue-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-white">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-lg text-white">Profil d’accès & Identifiants</h3>
                  <p className="text-xs text-blue-200">Gérez vos comptes et modifiez vos adresses email et mots de passe</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex border-b bg-slate-50 px-6 pt-3 gap-3">
              <button
                type="button"
                onClick={() => setProfileModalTab('login')}
                className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  profileModalTab === 'login'
                    ? 'border-french-blue text-french-blue'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Key className="h-3.5 w-3.5" />
                <span>Connexion & Choix du profil</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileModalTab('manage')}
                className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  profileModalTab === 'manage'
                    ? 'border-french-blue text-french-blue'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Modifier les identifiants & mots de passe</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {profileModalTab === 'login' ? (
                <>
                  {/* Active Profile Status Badge */}
                  <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                    canDelete ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}>
                    {canDelete ? (
                      <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Lock className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm">{userProfile.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          canDelete ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                        }`}>
                          {canDelete ? 'Administrateur (Tous droits)' : 'Éditeur Simple (Sans suppression)'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 font-mono">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> {userProfile.email}
                      </p>
                      <p className="text-xs leading-relaxed mt-1 text-slate-700">
                        {canDelete
                          ? '✅ Droits complets : Vous pouvez modifier tous les textes, photos, données, et supprimer des pages, rubriques ou blocs.'
                          : '🔒 Droits restreints : Vous pouvez modifier librement tous les textes, photos, chiffres, budgets et transports, mais la suppression est strictement désactivée pour protéger les données du site.'}
                      </p>
                    </div>
                  </div>

                  {/* Exact TWO Login Options per requirements */}
                  <div className="space-y-4">
                    {/* Option 1: Administrateur / SuperAdmin GitHub */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" /> Profil 1 : Administrateur (SuperAdmin GitHub)
                        </span>
                        <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded flex items-center gap-1">
                          <Github className="h-3 w-3" /> GitHub
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Droits administrateur complets pour <strong>informatique-cmd</strong> ({superAdminAccount.email}). Permet la validation des demandes de déploiement et la mise en production sur Vercel.
                      </p>
                      <Button asChild size="sm" className="w-full bg-slate-900 hover:bg-black text-white text-xs h-9 shadow-sm font-semibold">
                        <a href="/api/auth/github">
                          <Github className="mr-1.5 h-3.5 w-3.5" /> Se connecter via GitHub
                        </a>
                      </Button>
                    </div>

                    {/* Option 2: Éditeur (Email + Password) */}
                    <form onSubmit={handleLoginSubmit} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                          <User className="h-4 w-4 text-amber-600" /> Profil 2 : Éditeur (Identifiant & Mot de passe)
                        </span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          Édition Grand Format
                        </span>
                      </div>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        Accès réservé à l’Édition Grand Format en direct. Vos modifications sont conservées en brouillon et soumises à la validation de l’administrateur pour Vercel.
                      </p>
                      <div className="grid gap-2">
                        <div className="grid gap-1">
                          <Label className="text-[11px] font-semibold text-slate-700">Adresse email Éditeur</Label>
                          <Input
                            type="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="editeur@lfjpsaly.org"
                            className="text-xs h-8 bg-white font-mono"
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label className="text-[11px] font-semibold text-slate-700">Mot de passe</Label>
                          <Input
                            type="password"
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="text-xs h-8 bg-white font-mono"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        size="sm"
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold h-9 shadow-sm"
                      >
                        <Key className="mr-1.5 h-3.5 w-3.5" /> Se connecter comme Éditeur
                      </Button>
                    </form>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setProfileModalTab('manage')}
                      className="text-xs text-french-blue"
                    >
                      <Pencil className="mr-1 h-3 w-3" /> Changer email ou mot de passe
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsProfileModalOpen(false);
                          logout();
                        }}
                        className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut className="mr-1.5 h-3.5 w-3.5" /> Déconnexion
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsProfileModalOpen(false)}
                        className="text-xs"
                      >
                        Fermer
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                /* MANAGE CREDENTIALS TAB */
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-3.5 text-xs text-blue-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Key className="h-4 w-4 text-french-blue" /> Modification des identifiants & mots de passe
                    </p>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Modifiez ici l'adresse email et le mot de passe de l'Administrateur ou de l'Éditeur. Dès enregistrement, les personnes pourront se connecter directement avec leurs nouveaux identifiants.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* SuperAdmin GitHub Account Info */}
                    <div className="rounded-xl border p-4 bg-slate-50/80 space-y-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          <span className="font-bold text-xs text-slate-900">Compte Administrateur (SuperAdmin GitHub)</span>
                        </div>
                        <span className="text-[10px] bg-slate-900 text-white font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Github className="h-3 w-3" /> GitHub
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        L’administrateur principal se connecte directement via son compte GitHub (<strong>informatique-cmd</strong> / <strong>{superAdminAccount.email}</strong>). Ce profil détient les droits absolus (création, modification, suppression et déploiement direct vers Vercel).
                      </p>
                    </div>

                    {/* Editor Account Settings */}
                    <div className="rounded-xl border p-4 bg-slate-50/60 space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-amber-600" />
                          <span className="font-bold text-xs text-slate-900">Compte Éditeur Simple (Sans suppression)</span>
                        </div>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                          Éditeur
                        </span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <Label className="text-[11px] font-semibold text-slate-700">Email Éditeur</Label>
                          <Input
                            id="editor-email-field"
                            defaultValue={editorAccount.email}
                            className="text-xs h-8 mt-1 font-mono bg-white"
                            placeholder="editeur@lfjpsaly.org"
                          />
                        </div>
                        <div>
                          <Label className="text-[11px] font-semibold text-slate-700">Mot de passe Éditeur</Label>
                          <Input
                            id="editor-pass-field"
                            defaultValue={editorAccount.password}
                            className="text-xs h-8 mt-1 font-mono bg-white"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            const emailEl = document.getElementById('editor-email-field') as HTMLInputElement;
                            const passEl = document.getElementById('editor-pass-field') as HTMLInputElement;
                            if (emailEl && passEl) {
                              handleUpdateAccountCredentials('editor', emailEl.value, passEl.value);
                            }
                          }}
                          className="h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                        >
                          Enregistrer les identifiants Éditeur
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setProfileModalTab('login')}
                      className="text-xs text-french-blue"
                    >
                      ← Retour à la connexion
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setIsProfileModalOpen(false)}
                      className="text-xs"
                    >
                      Terminer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: GESTION & CLASSEMENT DES RUBRIQUES (AJOUT, MODIFICATION, ORDRE)
          ========================================================================= */}
      {isRubriqueModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-french-blue to-blue-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-white">
                  {rubriqueModalMode === 'order' ? (
                    <ArrowUpDown className="h-6 w-6" />
                  ) : (
                    <FolderTree className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-lg text-white">
                    {rubriqueModalMode === 'create'
                      ? 'Ajouter une nouvelle rubrique'
                      : rubriqueModalMode === 'edit'
                      ? 'Modifier la rubrique'
                      : 'Classer et ordonner les rubriques'}
                  </h3>
                  <p className="text-xs text-blue-200">
                    {rubriqueModalMode === 'order'
                      ? 'Positionnez vos rubriques après Accueil, Méthode ou selon votre choix'
                      : 'Définissez le nom, le chemin URL, l’icône et l’emplacement'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRubriqueModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {rubriqueModalMode === 'order' ? (
                /* ORDER MODE: Interactive List with Up/Down and "Classer après..." */
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
                    <p className="font-semibold">💡 Classement personnalisé :</p>
                    <p className="mt-0.5">
                      Utilisez les flèches <strong>Monter ↑</strong> et <strong>Descendre ↓</strong> ou le menu déroulant <strong>« Classer après »</strong> pour placer instantanément une rubrique après Accueil, après Méthode, etc.
                    </p>
                  </div>

                  <div className="divide-y rounded-xl border bg-slate-50/50">
                    {rubriques.map((rubrique, idx) => {
                      const IconComp = RUBRIQUE_ICONS[rubrique.iconName] || Sparkles;
                      return (
                        <div
                          key={rubrique.id}
                          className="p-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-white transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-french-blue text-white text-xs font-bold">
                              {idx + 1}
                            </span>
                            <div className="p-1.5 rounded-lg bg-blue-50 text-french-blue shrink-0">
                              <IconComp className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-900 truncate">
                                {rubrique.name}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono truncate">
                                {rubrique.path}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Reorder Dropdown: "Classer après..." */}
                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  moveRubriqueAfter(rubrique.id, e.target.value);
                                }
                              }}
                              className="text-[11px] h-7 px-2 bg-white border border-slate-300 rounded text-slate-700"
                            >
                              <option value="">Classer après...</option>
                              <option value="first">Placer au début</option>
                              {rubriques
                                .filter((other) => other.id !== rubrique.id)
                                .map((other) => (
                                  <option key={other.id} value={other.id}>
                                    Après {other.name}
                                  </option>
                                ))}
                              <option value="last">Placer à la fin</option>
                            </select>

                            {/* Up / Down buttons */}
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveRubrique(rubrique.id, -1)}
                                title="Monter"
                                className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === rubriques.length - 1}
                                onClick={() => moveRubrique(rubrique.id, 1)}
                                title="Descendre"
                                className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      onClick={() => setIsRubriqueModalOpen(false)}
                      className="bg-french-blue hover:bg-blue-700 text-white text-xs font-semibold"
                    >
                      Terminer le classement
                    </Button>
                  </div>
                </div>
              ) : (
                /* CREATE OR EDIT FORM */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveRubrique();
                  }}
                  className="space-y-4"
                >
                  <div className="grid gap-3">
                    <div className="grid gap-1">
                      <Label className="text-xs font-semibold text-slate-700">
                        Intitulé de la rubrique *
                      </Label>
                      <Input
                        required
                        value={rubriqueForm.name || ''}
                        onChange={(e) => setRubriqueForm({ ...rubriqueForm, name: e.target.value })}
                        placeholder="Ex : Coopération & Rayonnement, Projets Pédagogiques..."
                        className="text-xs h-9 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1">
                        <Label className="text-xs font-semibold text-slate-700">Chemin URL / Slug</Label>
                        <Input
                          value={rubriqueForm.path || ''}
                          onChange={(e) => setRubriqueForm({ ...rubriqueForm, path: e.target.value })}
                          placeholder="/cooperation"
                          className="text-xs h-9 font-mono bg-white"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-xs font-semibold text-slate-700">Badge court</Label>
                        <Input
                          value={rubriqueForm.badge || ''}
                          onChange={(e) => setRubriqueForm({ ...rubriqueForm, badge: e.target.value })}
                          placeholder="Ex : Pilier 5, Projets..."
                          className="text-xs h-9 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <Label className="text-xs font-semibold text-slate-700">Description résumée</Label>
                      <Textarea
                        value={rubriqueForm.description || ''}
                        onChange={(e) => setRubriqueForm({ ...rubriqueForm, description: e.target.value })}
                        placeholder="Description des contenus, enjeux et sous-pages rattachés à cette rubrique."
                        className="text-xs min-h-[60px] bg-white"
                      />
                    </div>

                    {/* Icon Selection */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Icône représentative</Label>
                      <div className="grid grid-cols-6 gap-2 pt-1">
                        {[
                          'Sparkles', 'BookOpen', 'GraduationCap', 'Globe2',
                          'Compass', 'Layers3', 'Award', 'Heart',
                          'Sliders', 'FileText', 'Users', 'Target'
                        ].map((icName) => {
                          const IconItem = RUBRIQUE_ICONS[icName] || Sparkles;
                          const isSel = (rubriqueForm.iconName || 'Sparkles') === icName;
                          return (
                            <button
                              key={icName}
                              type="button"
                              onClick={() => setRubriqueForm({ ...rubriqueForm, iconName: icName })}
                              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                                isSel
                                  ? 'border-french-blue bg-blue-50 text-french-blue ring-2 ring-french-blue/30 font-bold'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                              title={icName}
                            >
                              <IconItem className="h-5 w-5" />
                              <span className="text-[9px] truncate max-w-full">{icName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Position Placement (for Creation) */}
                    {rubriqueModalMode === 'create' && (
                      <div className="space-y-1.5 pt-2 border-t">
                        <Label className="text-xs font-semibold text-slate-700">
                          Classement : Où positionner cette nouvelle rubrique ?
                        </Label>
                        <select
                          value={rubriquePlacement}
                          onChange={(e) => setRubriquePlacement(e.target.value)}
                          className="w-full text-xs h-9 px-3 bg-white border border-slate-300 rounded-lg text-slate-800"
                        >
                          <option value="first">Au tout début (Position 1)</option>
                          <option value="after:accueil">Après la rubrique Accueil</option>
                          <option value="after:methode">Après la rubrique Méthode</option>
                          <option value="after:vision">Après la rubrique Vision, Missions & Valeurs</option>
                          <option value="after:diagnostic">Après la rubrique Diagnostic</option>
                          <option value="after:plan-strategique">Après le Plan Stratégique</option>
                          {rubriques
                            .filter((r) => !['accueil', 'methode', 'vision', 'diagnostic', 'plan-strategique'].includes(r.id))
                            .map((r) => (
                              <option key={r.id} value={`after:${r.id}`}>
                                Après {r.name}
                              </option>
                            ))}
                          <option value="last">À la fin de la liste (Dernière)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRubriqueModalOpen(false)}
                      className="text-xs"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-french-blue hover:bg-blue-700 text-white text-xs font-semibold"
                    >
                      {rubriqueModalMode === 'create' ? '+ Créer et insérer la rubrique' : 'Enregistrer les modifications'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Demande de corrections par le SuperAdmin */}
      {isRejectModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 text-slate-900">
            <div className="bg-amber-600 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Demander des corrections à l’Éditeur
              </h3>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAdminReject} className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Indiquez à l’éditeur ce qui doit être modifié avant que le déploiement sur Vercel ne soit validé :
              </p>
              <Textarea
                required
                value={rejectFeedback}
                onChange={(e) => setRejectFeedback(e.target.value)}
                placeholder="Ex : Veuillez corriger la faute dans le titre du second paragraphe et vérifier le format de l'image..."
                className="text-xs min-h-[90px]"
              />
              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="text-xs"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                >
                  Envoyer les remarques
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Déploiement Direct Vercel pour SuperAdmin */}
      {isSuperAdminDeployModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-slate-900">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-white">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-lg text-white">Déployer sur Vercel</h3>
                  <p className="text-xs text-emerald-100">Publication directe sur la branche main (SuperAdmin)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSuperAdminDeployModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs space-y-2">
                <p className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Prêt pour la mise en ligne immédiate
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Un commit atomique unique sera poussé sur la branche <strong className="text-slate-800">main</strong> du dépôt GitHub. Vercel lancera automatiquement la compilation de production sur <strong className="text-french-blue">psd-lfjp.vercel.app</strong>.
                </p>
                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    📂 Rubriques : <strong>{rubriques.length}</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    📄 Pages CMS : <strong>{pages.length}</strong>
                  </div>
                </div>
              </div>

              {pendingDeployment && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                  <p className="font-bold">Demande d’éditeur en attente :</p>
                  <p className="text-[11px] text-amber-800">Ce déploiement validera et fusionnera également la demande soumise par {pendingDeployment.authorName} ({pendingDeployment.submittedBy}).</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Note de version / message du commit (optionnel) :
                </Label>
                <Input
                  value={superAdminDeployNotes}
                  onChange={(e) => setSuperAdminDeployNotes(e.target.value)}
                  placeholder="Ex : Ajout de la rubrique Contact et mise à jour des données"
                  className="text-xs bg-slate-50 border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSuperAdminDeployModalOpen(false)}
                  disabled={isSaving}
                  className="text-xs"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleSuperAdminDirectDeploy}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 px-4 shadow-md"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Déploiement en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Confirmer le déploiement Vercel</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
