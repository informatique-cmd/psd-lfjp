import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Eye, LogOut, Pencil, RotateCcw, ShieldCheck, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { applyPageTextOverrides, getNodePath, loadPageTextOverrides, pageTextDraftStorageKey, type PageElementOverride, type PageTextOverrides } from '@/lib/pageOverrides';
import { loadActiveUserProfile, type UserProfile } from '@/data/adminProfilesAndRubriques';

const PageTextEditor = () => {
  const location = useLocation();
  const isEditorRoute = location.pathname === '/espace-direction' || location.pathname === '/admin';
  const editingRequested = new URLSearchParams(location.search).get('edit') === '1';
  const embedded = new URLSearchParams(location.search).get('embedded') === '1';
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const hasLocal = window.sessionStorage.getItem('lfjp_admin_local_session') === '1' || window.localStorage.getItem('lfjp_admin_active_session') === '1';
    return hasLocal ? loadActiveUserProfile() : null;
  });
  const [authChecked, setAuthChecked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [overrides, setOverrides] = useState<PageTextOverrides>(loadPageTextOverrides);
  const [status, setStatus] = useState('');
  const [selectedElement, setSelectedElement] = useState<(PageElementOverride & { kind: 'text' | 'image' | 'link'; path: string; linkPath?: string; rect?: { left: number; top: number; width: number; height: number } }) | null>(null);

  const checkAuth = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    const hasLocal = window.sessionStorage.getItem('lfjp_admin_local_session') === '1' || window.localStorage.getItem('lfjp_admin_active_session') === '1';
    if (hasLocal) {
      const profile = loadActiveUserProfile();
      setCurrentUser(profile);
      setIsAdmin(true);
      if (editingRequested || embedded) setIsEditing(true);
      setAuthChecked(true);
      return;
    }

    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.user?.login) {
          const profile = loadActiveUserProfile();
          setCurrentUser(profile);
          setIsAdmin(true);
          setIsEditing(Boolean(editingRequested || embedded));
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
          setIsEditing(false);
        }
      })
      .catch(() => {
        setCurrentUser(null);
        setIsAdmin(false);
        setIsEditing(false);
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, [editingRequested, embedded]);

  useEffect(() => {
    checkAuth();
    window.addEventListener('lfjp_auth_changed', checkAuth);
    return () => window.removeEventListener('lfjp_auth_changed', checkAuth);
  }, [checkAuth]);

  const handleLogout = async () => {
    window.sessionStorage.removeItem('lfjp_admin_local_session');
    window.localStorage.removeItem('lfjp_admin_active_session');
    window.localStorage.removeItem('lfjp_preview_active');
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      void err;
    }
    setCurrentUser(null);
    setIsAdmin(false);
    setIsEditing(false);
    setSelectedElement(null);
    window.dispatchEvent(new Event('lfjp_auth_changed'));
  };

  useEffect(() => {
    const syncOverrides = (event: StorageEvent) => {
      if (event.key !== pageTextDraftStorageKey || !event.newValue) return;
      try {
        setOverrides(JSON.parse(event.newValue) as PageTextOverrides);
      } catch {
        setStatus('Le brouillon visuel n’a pas pu être chargé.');
      }
    };
    window.addEventListener('storage', syncOverrides);
    return () => window.removeEventListener('storage', syncOverrides);
  }, []);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root || isEditorRoute) return;
    const apply = () => applyPageTextOverrides(root, location.pathname, overrides);
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isEditorRoute, location.pathname, overrides]);

  useEffect(() => {
    if (!isAdmin || !isEditing || isEditorRoute) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const root = document.getElementById('root');
      if (!root || !root.contains(target)) return;

      const element = target instanceof Element ? target : target.parentElement;
      if (!element || element.closest('[data-page-text-editor]')) return;
      if (element.closest('button,input,textarea,select,[data-radix-collection-item]')) return;

      const image = element.closest('img');
      const anchor = element.closest('a');
      const findTextNode = (node: Node): Text | null => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) return node as Text;
        for (const child of Array.from(node.childNodes)) {
          const match = findTextNode(child);
          if (match) return match;
        }
        return null;
      };
      const rangeNode = document.caretRangeFromPoint?.(event.clientX, event.clientY)?.startContainer || null;
      const textNode = target.nodeType === Node.TEXT_NODE
        ? target as Text
        : rangeNode?.nodeType === Node.TEXT_NODE
          ? rangeNode as Text
          : findTextNode(element);

      if (embedded) {
        if (element.closest('button,[role="tab"],input,textarea,select,[data-radix-collection-item]')) return;
        let selectedPath: string | null = null;
        let selected: PageElementOverride & { kind: 'text' | 'image' | 'link'; path: string; linkPath?: string; rect?: { left: number; top: number; width: number; height: number } } | null = null;
        if (image instanceof HTMLImageElement) {
          selectedPath = getNodePath(root, image);
          const rect = image.getBoundingClientRect();
          if (selectedPath) selected = { kind: 'image', path: selectedPath, src: image.getAttribute('src') || '', alt: image.alt, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } };
        } else if (target === anchor && anchor instanceof HTMLAnchorElement) {
          selectedPath = getNodePath(root, anchor);
          const rect = anchor.getBoundingClientRect();
          if (selectedPath) selected = { kind: 'link', path: selectedPath, href: anchor.getAttribute('href') || '', rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } };
        } else if (textNode?.nodeType === Node.TEXT_NODE && textNode.textContent?.trim()) {
          selectedPath = getNodePath(root, textNode);
          const textAnchor = textNode.parentElement?.closest('a');
          const linkPath = textAnchor ? getNodePath(root, textAnchor) || undefined : undefined;
          const rect = (textNode as Text).parentElement?.getBoundingClientRect();
          if (selectedPath) selected = { kind: 'text', path: selectedPath, text: textNode.textContent || '', href: textAnchor?.getAttribute('href') || undefined, linkPath, rect: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : undefined };
        }
        if (!selected) return;
        event.preventDefault();
        event.stopPropagation();
        window.parent.postMessage({ type: 'lfjp-cms-select', page: location.pathname, selection: selected }, window.location.origin);
        return;
      }

      let selection: (PageElementOverride & { kind: 'text' | 'image' | 'link'; path: string; linkPath?: string; rect?: { left: number; top: number; width: number; height: number } }) | null = null;
      if (image instanceof HTMLImageElement) {
        const imagePath = getNodePath(root, image);
        const rect = image.getBoundingClientRect();
        if (imagePath) selection = { kind: 'image', path: imagePath, src: image.getAttribute('src') || '', alt: image.alt, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } };
      } else if (target.nodeType === Node.TEXT_NODE) {
        const textPath = getNodePath(root, target);
        const textAnchor = target.parentElement?.closest('a');
        const rect = target.parentElement?.getBoundingClientRect();
        if (textPath) selection = { kind: 'text', path: textPath, text: target.textContent || '', href: textAnchor?.getAttribute('href') || undefined, linkPath: textAnchor ? getNodePath(root, textAnchor) || undefined : undefined, rect: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : undefined };
      } else if (anchor instanceof HTMLAnchorElement && element === anchor) {
        const anchorPath = getNodePath(root, anchor);
        const rect = anchor.getBoundingClientRect();
        if (anchorPath) selection = { kind: 'link', path: anchorPath, href: anchor.getAttribute('href') || '', rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } };
      } else {
        if (textNode?.nodeType !== Node.TEXT_NODE || !textNode.textContent?.trim()) return;
        const textPath = getNodePath(root, textNode);
        const textAnchor = textNode.parentElement?.closest('a');
        const rect = textNode.parentElement?.getBoundingClientRect();
        if (textPath) selection = { kind: 'text', path: textPath, text: textNode.textContent || '', href: textAnchor?.getAttribute('href') || undefined, linkPath: textAnchor ? getNodePath(root, textAnchor) || undefined : undefined, rect: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : undefined };
      }
      if (!selection) return;
      event.preventDefault();
      event.stopPropagation();
      setSelectedElement(selection);
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [embedded, isAdmin, isEditing, isEditorRoute, location.pathname, overrides]);

  const saveSelectedElement = (field: 'text' | 'src' | 'alt' | 'href', value: string) => {
    if (!selectedElement) return;
    if (field === 'href' && value && !value.startsWith('/') && !/^https?:\/\//i.test(value)) {
      setStatus('Le lien doit être une adresse http(s) ou un chemin interne commençant par /.');
      return;
    }
    const path = field === 'href' ? selectedElement.linkPath || selectedElement.path : selectedElement.path;
    const next = { ...overrides, [location.pathname]: { ...overrides[location.pathname], [path]: { ...overrides[location.pathname]?.[path], [field]: value } } };
    setOverrides(next);
    window.localStorage.setItem(pageTextDraftStorageKey, JSON.stringify(next));
    setSelectedElement((current) => current ? { ...current, [field]: value } : current);
    setStatus('Brouillon mis à jour.');
  };

  const resetCurrentPage = () => {
    const next = { ...overrides };
    delete next[location.pathname];
    setOverrides(next);
    setSelectedElement(null);
    window.localStorage.setItem(pageTextDraftStorageKey, JSON.stringify(next));
    setStatus('Les modifications de cette page ont été retirées du brouillon.');
  };

  if (!authChecked || !isAdmin || isEditorRoute) return null;

  return createPortal(
    <div data-page-text-editor className="fixed inset-0 z-[100] pointer-events-none">
      <div className="pointer-events-auto fixed bottom-4 right-4 flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-2 rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-2 shadow-2xl z-[100]">
      {embedded ? (
        <span className="px-2 text-xs font-semibold text-french-blue">Sélectionnez un élément à modifier</span>
      ) : (
        <>
          {/* Authenticated User Role Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-800">
            {currentUser?.canDelete ? (
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            ) : (
              <User className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            )}
            <span className="max-w-[140px] sm:max-w-[200px] truncate">
              {currentUser?.role === 'editor' ? 'Éditeur' : 'Admin'} : {currentUser?.email || 'Connecté'}
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            variant={isEditing ? 'default' : 'outline'}
            onClick={() => setIsEditing((value) => !value)}
            className="text-xs h-8 font-semibold shadow-xs"
          >
            {isEditing ? <X className="h-3.5 w-3.5 mr-1" /> : <Pencil className="h-3.5 w-3.5 mr-1 text-french-blue" />}
            {isEditing ? 'Terminer l’édition' : 'Modifier cette page'}
          </Button>

          {isEditing && (
            <>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8" title="Ouvrir la page en aperçu" aria-label="Ouvrir la page en aperçu" onClick={() => setIsEditing(false)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8" title="Annuler les changements de cette page" aria-label="Annuler les changements de cette page" onClick={resetCurrentPage}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </>
          )}

          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-xs h-8 text-french-blue hover:text-blue-800 hover:bg-blue-50 px-2 flex items-center gap-1"
          >
            <a href="/admin">
              <span>Admin</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleLogout}
            title="Se déconnecter et masquer la barre d’édition"
            className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 flex items-center gap-1"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Quitter</span>
          </Button>

          {status && <span className="max-w-44 text-[11px] text-slate-600 truncate">{status}</span>}
        </>
      )}
      </div>
      {!embedded && isEditing && selectedElement?.rect && <Button type="button" size="icon" className="pointer-events-auto fixed h-9 w-9 rounded-md shadow-lg ring-2 ring-white" style={{ left: Math.max(8, selectedElement.rect.left), top: Math.max(8, selectedElement.rect.top - 44) }} title="Modifier cet élément" aria-label="Modifier cet élément" onClick={() => document.getElementById('page-element-editor')?.focus()}><Pencil className="h-4 w-4" /></Button>}
      {!embedded && isEditing && selectedElement && <section className="pointer-events-auto fixed bottom-20 right-4 z-[101] max-h-[70vh] w-[min(380px,calc(100vw-2rem))] overflow-y-auto rounded-md border bg-white p-4 shadow-2xl" aria-label="Propriétés de l’élément sélectionné">
        <div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-slate-500">Inspecteur de page</p><h2 className="font-semibold text-slate-900">{selectedElement.kind === 'image' ? 'Image' : selectedElement.kind === 'link' ? 'Lien' : 'Texte sélectionné'}</h2></div><Button type="button" size="icon" variant="ghost" title="Désélectionner" aria-label="Désélectionner" onClick={() => setSelectedElement(null)}><X className="h-4 w-4" /></Button></div>
        {selectedElement.kind === 'text' && <div className="grid gap-2"><label htmlFor="page-element-editor" className="text-sm font-medium">Contenu</label><textarea id="page-element-editor" autoFocus className="min-h-28 w-full rounded-md border p-2 text-sm" value={selectedElement.text || ''} onChange={(event) => saveSelectedElement('text', event.target.value)} /></div>}
        {selectedElement.kind === 'image' && <div className="grid gap-3"><div className="grid gap-1"><label htmlFor="page-image-source" className="text-sm font-medium">Source de l’image</label><input id="page-image-source" className="h-10 rounded-md border px-3 text-sm" value={selectedElement.src || ''} onChange={(event) => saveSelectedElement('src', event.target.value)} /></div><div className="grid gap-1"><label htmlFor="page-image-alt" className="text-sm font-medium">Texte alternatif</label><input id="page-image-alt" className="h-10 rounded-md border px-3 text-sm" value={selectedElement.alt || ''} onChange={(event) => saveSelectedElement('alt', event.target.value)} /></div></div>}
        {selectedElement.kind === 'link' && <div className="grid gap-1"><label htmlFor="page-link-href" className="text-sm font-medium">Adresse du lien</label><input id="page-link-href" className="h-10 rounded-md border px-3 text-sm" value={selectedElement.href || ''} onChange={(event) => saveSelectedElement('href', event.target.value)} /></div>}
        {selectedElement.kind === 'text' && selectedElement.linkPath && <div className="mt-3 grid gap-1"><label htmlFor="page-text-link-href" className="text-sm font-medium">Adresse du lien</label><input id="page-text-link-href" className="h-10 rounded-md border px-3 text-sm" value={selectedElement.href || ''} onChange={(event) => saveSelectedElement('href', event.target.value)} /></div>}
        {status && <p className="mt-3 text-xs text-slate-600">{status}</p>}
        <p className="mt-3 text-xs text-slate-500">Les modifications sont enregistrées dans le brouillon de ce navigateur.</p>
      </section>}
    </div>,
    document.body,
  );
};

export default PageTextEditor;