import type { ApiRequest, ApiResponse } from '../_github';

export const runtime = 'nodejs';

export default function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' });
  if (!process.env.GITHUB_CLIENT_ID || !process.env.ADMIN_SESSION_SECRET) {
    return res.status(500).json({ error: 'La connexion GitHub n’est pas configurée.' });
  }
  const state = globalThis.crypto.randomUUID();
  const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `lfjp_oauth_state=${state}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=600`);
  return res.redirect(`https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(process.env.GITHUB_CLIENT_ID)}&redirect_uri=${encodeURIComponent(`${appUrl}/api/auth/callback`)}&scope=repo&state=${state}`);
}
