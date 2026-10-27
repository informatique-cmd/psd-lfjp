import fs from 'node:fs';
import path from 'node:path';
import type { ApiRequest, ApiResponse } from '../_github.js';

export const runtime = 'nodejs';

let cachedDeploymentRequest: unknown = null;
const tmpPath = path.join('/tmp', 'lfjp-pending-deployment.json');

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method === 'GET') {
    if (!cachedDeploymentRequest) {
      try {
        if (fs.existsSync(tmpPath)) {
          cachedDeploymentRequest = JSON.parse(fs.readFileSync(tmpPath, 'utf8'));
        }
      } catch {
        // ignore
      }
    }
    return res.status(200).json({ request: cachedDeploymentRequest });
  }

  if (req.method === 'POST') {
    const body = req.body && typeof req.body === 'object' ? req.body : null;
    cachedDeploymentRequest = body;
    try {
      if (body) {
        fs.writeFileSync(tmpPath, JSON.stringify(body), 'utf8');
      } else if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    } catch {
      // ignore
    }
    return res.status(200).json({ success: true, request: cachedDeploymentRequest });
  }

  return res.status(405).json({ error: 'Méthode non autorisée.' });
}
