import { useState, useEffect } from 'react';

export const AUTH_STORAGE_KEY = 'lfjp-admin-auth-user-v4';
export const ACTIVE_SESSION_KEY = 'lfjp_admin_active_session';
export const LOCAL_SESSION_KEY = 'lfjp_admin_local_session';

export type PrivilegedRole = 'superadmin' | 'editor';

/**
 * Returns the currently authenticated privileged role ('superadmin' | 'editor'),
 * or null if the visitor is an unauthenticated public user.
 *
 * Security Rule:
 * URL parameters alone (?edit=1, ?draft=1, ?embedded=1) are NEVER trusted on their own.
 * There MUST be an authenticated session proof in sessionStorage/localStorage.
 */
export function getAuthenticatedPrivilegedRole(): PrivilegedRole | null {
  if (typeof window === 'undefined') return null;
  try {
    const hasActiveSession =
      window.sessionStorage.getItem(LOCAL_SESSION_KEY) === '1' ||
      window.localStorage.getItem(ACTIVE_SESSION_KEY) === '1';

    if (!hasActiveSession) return null;

    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const role = parsed.role;
      if (role === 'superadmin' || role === 'editor') {
        return role;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function isPrivilegedUser(): boolean {
  return getAuthenticatedPrivilegedRole() !== null;
}

/**
 * Determines whether editor controls (toolbars, edit boxes, input forms, add/delete buttons)
 * should be rendered.
 *
 * Strict Rule:
 * - Public site visitors (unauthenticated): ALWAYS false.
 * - Authenticated Editor/SuperAdmin: true when in editor route (/espace-direction, /admin)
 *   or embedded inside the admin preview iframe (embedded=1 / window.self !== window.top)
 *   or when explicitly toggled.
 */
export function shouldShowEditorControls(): boolean {
  if (typeof window === 'undefined') return false;

  const role = getAuthenticatedPrivilegedRole();
  if (!role) {
    // Unauthenticated public visitors NEVER see editor controls!
    return false;
  }

  // Authenticated Editor or SuperAdmin has full access to editing panels and live sync
  return true;
}

/**
 * React hook to reactively subscribe to privileged access state across the app.
 */
export function usePrivilegedAccess(): {
  isPrivileged: boolean;
  role: PrivilegedRole | null;
  showEditorControls: boolean;
} {
  const [role, setRole] = useState<PrivilegedRole | null>(() => getAuthenticatedPrivilegedRole());
  const [showControls, setShowControls] = useState<boolean>(() => shouldShowEditorControls());

  useEffect(() => {
    const update = () => {
      setRole(getAuthenticatedPrivilegedRole());
      setShowControls(shouldShowEditorControls());
    };

    window.addEventListener('storage', update);
    window.addEventListener('lfjp_auth_changed', update);
    window.addEventListener('lfjp_draft_cleared', update);

    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('lfjp_auth_changed', update);
      window.removeEventListener('lfjp_draft_cleared', update);
    };
  }, []);

  return {
    isPrivileged: role !== null,
    role,
    showEditorControls: showControls,
  };
}
