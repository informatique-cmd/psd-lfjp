import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Eye, Pencil, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { applyPageTextOverrides, getNodePath, loadPageTextOverrides, pageTextDraftStorageKey, type PageElementOverride, type PageTextOverrides } from '@/lib/pageOverrides';

const PageTextEditor = () => {
  const location = useLocation();
  const isEditorRoute = location.pathname === '/espace-direction' || location.pathname === '/admin';
  const editingRequested = new URLSearchParams(location.search).get('edit') === '1';
  const embedded = new URLSearchParams(location.search).get('embedded') === '1';
  const [isEditing, setIsEditing] = useState(editingRequested);
  const [overrides, setOverrides] = useState<PageTextOverrides>(loadPageTextOverrides);
  const [status, setStatus] = useState('');

  useEffect(() => setIsEditing(editingRequested), [editingRequested]);

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
    if (!isEditing || isEditorRoute) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const root = document.getElementById('root');
      if (!root || !root.contains(target)) return;

      const element = target instanceof Element ? target : target.parentElement;
      if (!element || element.closest('[data-page-text-editor]')) return;

      let path: string | null = null;
      let patch: PageElementOverride | null = null;
      const image = element.closest('img');
      const anchor = element.closest('a');
      const textNode = target.nodeType === Node.TEXT_NODE
        ? target
        : document.caretRangeFromPoint?.(event.clientX, event.clientY)?.startContainer || null;

      if (embedded) {
        if (element.closest('button,[role="tab"],input,textarea,select,[data-radix-collection-item]')) return;
        let selectedPath: string | null = null;
        let selected: PageElementOverride & { kind: 'text' | 'image' | 'link'; path: string; linkPath?: string } | null = null;
        if (image instanceof HTMLImageElement) {
          selectedPath = getNodePath(root, image);
          if (selectedPath) selected = { kind: 'image', path: selectedPath, src: image.getAttribute('src') || '', alt: image.alt };
        } else if (target === anchor && anchor instanceof HTMLAnchorElement) {
          selectedPath = getNodePath(root, anchor);
          if (selectedPath) selected = { kind: 'link', path: selectedPath, href: anchor.getAttribute('href') || '' };
        } else if (textNode?.nodeType === Node.TEXT_NODE && textNode.textContent?.trim()) {
          selectedPath = getNodePath(root, textNode);
          const textAnchor = textNode.parentElement?.closest('a');
          const linkPath = textAnchor ? getNodePath(root, textAnchor) || undefined : undefined;
          if (selectedPath) selected = { kind: 'text', path: selectedPath, text: textNode.textContent || '', href: textAnchor?.getAttribute('href') || undefined, linkPath };
        }
        if (!selected) return;
        event.preventDefault();
        event.stopPropagation();
        window.parent.postMessage({ type: 'lfjp-cms-select', page: location.pathname, selection: selected }, window.location.origin);
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const editTextNode = (textNode: Node | null) => {
        if (!textNode || textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent?.trim()) return false;
        path = getNodePath(root, textNode);
        const text = window.prompt('Modifier ce texte', textNode.textContent);
        if (text === null) return true;
        patch = { text };
        return true;
      };

      if (image instanceof HTMLImageElement) {
        path = getNodePath(root, image);
        const src = window.prompt('URL ou chemin de l’image', image.currentSrc || image.src);
        if (src === null) return;
        const alt = window.prompt('Texte alternatif de l’image', image.alt);
        if (alt === null) return;
        patch = { src, alt };
      } else if (target.nodeType === Node.TEXT_NODE) {
        if (!editTextNode(target) || !patch) return;
      } else if (anchor instanceof HTMLAnchorElement && element === anchor) {
        path = getNodePath(root, anchor);
        const href = window.prompt('Adresse du lien', anchor.getAttribute('href') || '');
        if (href === null) return;
        if (href && !href.startsWith('/') && !/^https?:\/\//i.test(href)) {
          setStatus('Le lien doit être une adresse http(s) ou un chemin interne commençant par /.');
          return;
        }
        patch = { href };
      } else {
        if (!editTextNode(textNode) || !patch) return;
      }

      if (!path || !patch) return;
      const next = {
        ...overrides,
        [location.pathname]: {
          ...overrides[location.pathname],
          [path]: { ...overrides[location.pathname]?.[path], ...patch },
        },
      };
      setOverrides(next);
      window.localStorage.setItem(pageTextDraftStorageKey, JSON.stringify(next));
      setStatus('Modification enregistrée dans le brouillon de ce navigateur.');
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [embedded, isEditing, isEditorRoute, location.pathname, overrides]);

  const resetCurrentPage = () => {
    const next = { ...overrides };
    delete next[location.pathname];
    setOverrides(next);
    window.localStorage.setItem(pageTextDraftStorageKey, JSON.stringify(next));
    setStatus('Les modifications de cette page ont été retirées du brouillon.');
  };

  if (!editingRequested || isEditorRoute || embedded) return null;

  return createPortal(
    <div data-page-text-editor className="fixed bottom-4 right-4 z-[100] flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-md border bg-white p-2 shadow-xl">
      <Button type="button" size="sm" variant={isEditing ? 'default' : 'outline'} onClick={() => setIsEditing((value) => !value)}>
        {isEditing ? <X /> : <Pencil />}
        {isEditing ? 'Terminer' : 'Modifier la page'}
      </Button>
      <Button type="button" size="icon" variant="ghost" title="Ouvrir la page sans mode édition" aria-label="Ouvrir la page sans mode édition" onClick={() => window.location.assign(location.pathname + '?draft=1')}>
        <Eye />
      </Button>
      <Button type="button" size="icon" variant="ghost" title="Annuler les changements de cette page" aria-label="Annuler les changements de cette page" onClick={resetCurrentPage}>
        <RotateCcw />
      </Button>
      {status && <span className="max-w-56 text-xs text-slate-600">{status}</span>}
    </div>,
    document.body,
  );
};

export default PageTextEditor;