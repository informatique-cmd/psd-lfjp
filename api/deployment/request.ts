import type { ApiRequest, ApiResponse } from '../_github.js';

export const runtime = 'nodejs';

// In-memory cache for serverless invocation
let cachedDeploymentRequest: unknown = null;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ request: cachedDeploymentRequest });
  }

  if (req.method === 'POST') {
    const body = req.body && typeof req.body === 'object' ? req.body : null;
    cachedDeploymentRequest = body;
    return res.status(200).json({ success: true, request: cachedDeploymentRequest });
  }

  return res.status(405).json({ error: 'Méthode non autorisée.' });
}
