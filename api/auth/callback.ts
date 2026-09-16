import { getCookies, encryptToken, setCookie, type ApiRequest, type ApiResponse } from '../_github';

export const runtime = 'nodejs';
export const config = { runtime: 'nodejs20.x' };

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') return res.status(405).send('Méthode non autorisée.');
  const code = req.query?.code;
  const state = req.query?.state;
  if (Array.isArray(code) || Array.isArray(state)) return res.status(400).send('Paramètres OAuth invalides.');
  const cookies = getCookies(req.headers.cookie);
  if (!code || !state || state !== cookies.lfjp_oauth_state) return res.status(400).send('État OAuth invalide.');
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET || !process.env.ADMIN_SESSION_SECRET) {
    return res.status(500).send('La connexion GitHub n’est pas configurée.');
  }
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code }),
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) return res.status(502).send('GitHub n’a pas délivré de jeton.');
  setCookie(res, encryptToken(tokenData.access_token), 60 * 60 * 8);
  return res.redirect('/admin');
}
