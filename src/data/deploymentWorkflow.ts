export interface PendingDeploymentRequest {
  id: string;
  status: 'pending_admin_approval' | 'approved_and_deployed' | 'rejected';
  submittedAt: string;
  submittedBy: string;
  authorName: string;
  notes?: string;
  modifiedSummary?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  feedback?: string;
}

export const DEPLOYMENT_REQUEST_KEY = 'lfjp_pending_deployment_request';

export function loadPendingDeploymentRequest(): PendingDeploymentRequest | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DEPLOYMENT_REQUEST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === 'string' && typeof parsed.status === 'string') {
      return parsed as PendingDeploymentRequest;
    }
  } catch (err) {
    console.error('Failed to parse pending deployment request', err);
  }
  return null;
}

export function savePendingDeploymentRequest(request: PendingDeploymentRequest | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!request) {
      window.localStorage.removeItem(DEPLOYMENT_REQUEST_KEY);
    } else {
      window.localStorage.setItem(DEPLOYMENT_REQUEST_KEY, JSON.stringify(request));
    }
    window.dispatchEvent(new CustomEvent('lfjp_deployment_workflow_changed', { detail: request }));
  } catch (err) {
    console.error('Failed to save pending deployment request', err);
  }
}

export function submitEditorDraft(
  submittedBy: string,
  authorName: string,
  notes: string = ''
): PendingDeploymentRequest {
  const newRequest: PendingDeploymentRequest = {
    id: `req-${Date.now()}`,
    status: 'pending_admin_approval',
    submittedAt: new Date().toISOString(),
    submittedBy,
    authorName,
    notes: notes.trim(),
    modifiedSummary: 'Modifications de contenus effectuées en mode Édition In-Situ (textes, visuels, pages).',
  };
  savePendingDeploymentRequest(newRequest);
  return newRequest;
}

export function approveDeploymentRequest(
  requestId: string,
  reviewedBy: string = 'informatique@lfjpsaly.org'
): void {
  const current = loadPendingDeploymentRequest();
  if (current && current.id === requestId) {
    const updated: PendingDeploymentRequest = {
      ...current,
      status: 'approved_and_deployed',
      reviewedAt: new Date().toISOString(),
      reviewedBy,
    };
    savePendingDeploymentRequest(updated);
  }
}

export function rejectDeploymentRequest(
  requestId: string,
  feedback: string,
  reviewedBy: string = 'informatique@lfjpsaly.org'
): void {
  const current = loadPendingDeploymentRequest();
  if (current && current.id === requestId) {
    const updated: PendingDeploymentRequest = {
      ...current,
      status: 'rejected',
      feedback: feedback.trim(),
      reviewedAt: new Date().toISOString(),
      reviewedBy,
    };
    savePendingDeploymentRequest(updated);
  }
}
