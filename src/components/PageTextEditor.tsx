import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { applyPageTextOverrides, getNodePath, loadPageTextOverrides, pageTextDraftStorageKey, type PageElementOverride, type PageTextOverrides } from '@/lib/pageOverrides';
import { loadActiveUserProfile } from '@/data/adminProfilesAndRubriques';

const PageTextEditor = () => {
  const location = useLocation();
  const isEditorRoute = location.pathname === '/espace-direction' || location.pathname === '/admin';
  const editParam = new URLSearchParams(location.search).get('edit');
  const embedded = new URLSearchParams(location.search).get('embedded') === '1';
  const editingRequested = editParam === '1' && embedded;
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [overrides, setOverrides] = useState<PageTextOverrides>(loadPageTextOverrides);

  const checkAuth = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    const hasLocal = window.sessionStorage.getItem('lfjp_admin_local_session') === '1' || window.localStorage.getItem('lfjp_admin_active_session') === '1';
    if (hasLocal) {
      setIsAdmin(true);
      if (editingRequested) setIsEditing(true);
      else setIsEditing(false);
      return;
    }

    // Do not burden normal site visitors with an auth network roundtrip on every page route
    if (!editingRequested && !embedded) {
      setIsAdmin(false);
      setIsEditing(false);
      return;
    }

    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.user?.login) {
          loadActiveUserProfile();
          setIsAdmin(true);
          setIsEditing(editingRequested);
        } else {
          setIsAdmin(false);
          setIsEditing(false);
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setIsEditing(false);
      });
  }, [editingRequested, embedded]);

  useEffect(() => {
    checkAuth();
    window.addEventListener('lfjp_auth_changed', checkAuth);
    return () => window.removeEventListener('lfjp_auth_changed', checkAuth);
  }, [checkAuth]);

  // Synchronize route change to parent admin iframe
  useEffect(() => {
    if (embedded) {
      window.parent.postMessage({ type: 'lfjp-route-change', path: location.pathname }, window.location.origin);
    }
  }, [embedded, location.pathname]);

  // Listen to dynamic edit mode toggle messages from parent admin window
  useEffect(() => {
    const handleMsg = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'lfjp-set-edit-mode') {
        setIsEditing(Boolean(event.data.active));
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  useEffect(() => {
    const syncOverrides = (event: StorageEvent) => {
      if (event.key !== pageTextDraftStorageKey || !event.newValue) return;
      try {
        setOverrides(JSON.parse(event.newValue) as PageTextOverrides);
      } catch {
        // ignore draft parse error
      }
    };
    window.addEventListener('storage', syncOverrides);
    return () => window.removeEventListener('storage', syncOverrides);
  }, []);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root || isEditorRoute) return;

    const pageOverrides = overrides[location.pathname];
    if (!pageOverrides || Object.keys(pageOverrides).length === 0) {
      return;
    }

    let rafId: number | null = null;
    const apply = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        applyPageTextOverrides(root, location.pathname, overrides);
      });
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { childList: true, subtree: true, characterData: false });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [isEditorRoute, location.pathname, overrides]);

  // When modification mode is active inside the Visual Editor iframe, intercept clicks on links and buttons in capture phase
  // so that clicking anywhere on the page allows selecting and editing the text/content instead of navigating away!
  useEffect(() => {
    if (!embedded || !isAdmin || !isEditing || isEditorRoute) return;
    const interceptClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const root = document.getElementById('root');
      if (!root || !root.contains(target)) return;

      const element = target instanceof Element ? target : target.parentElement;
      if (element?.closest('[data-page-text-editor]')) return;

      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener('click', interceptClick, true);
    return () => document.removeEventListener('click', interceptClick, true);
  }, [embedded, isAdmin, isEditing, isEditorRoute]);

  useEffect(() => {
    if (!embedded || !isAdmin || !isEditing || isEditorRoute) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const root = document.getElementById('root');
      if (!root || !root.contains(target)) return;

      const element = target instanceof Element ? target : target.parentElement;
      if (!element || element.closest('[data-page-text-editor]')) return;

      const image = element.closest('img');
      const anchor = element.closest('a');
      const button = element.closest('button');

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
        let selectedPath: string | null = null;
        let selected: PageElementOverride & { kind: 'text' | 'image' | 'link'; path: string; linkPath?: string; rect?: { left: number; top: number; width: number; height: number } } | null = null;

        if (image instanceof HTMLImageElement) {
          selectedPath = getNodePath(root, image);
          const rect = image.getBoundingClientRect();
          if (selectedPath) selected = { kind: 'image', path: selectedPath, src: image.getAttribute('src') || '', alt: image.alt, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } };
        } else if (textNode?.nodeType === Node.TEXT_NODE && textNode.textContent?.trim()) {
          selectedPath = getNodePath(root, textNode);
          const textAnchor = textNode.parentElement?.closest('a') || anchor;
          const linkPath = textAnchor ? getNodePath(root, textAnchor) || undefined : undefined;
          const rect = (textNode as Text).parentElement?.getBoundingClientRect() || element.getBoundingClientRect();
          if (selectedPath) selected = { kind: 'text', path: selectedPath, text: textNode.textContent || '', href: textAnchor?.getAttribute('href') || undefined, linkPath, rect: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : undefined };
        } else if (anchor instanceof HTMLAnchorElement) {
          selectedPath = getNodePath(root, anchor);
          const rect = anchor.getBoundingClientRect();
          if (selectedPath) selected = { kind: 'text', path: selectedPath, text: anchor.textContent?.trim() || 'Lien', href: anchor.getAttribute('href') || '', rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } };
        } else if (button instanceof HTMLButtonElement) {
          selectedPath = getNodePath(root, button);
          const rect = button.getBoundingClientRect();
          if (selectedPath) selected = { kind: 'text', path: selectedPath, text: button.textContent?.trim() || 'Bouton', rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } };
        }

        if (!selected) return;
        event.preventDefault();
        event.stopPropagation();
        window.parent.postMessage({ type: 'lfjp-cms-select', page: location.pathname, selection: selected }, window.location.origin);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [embedded, isAdmin, isEditing, isEditorRoute, location.pathname, overrides]);

  // Bottom floating widget is removed entirely to keep the view clean and unhindered.
  return null;
};

export default PageTextEditor;