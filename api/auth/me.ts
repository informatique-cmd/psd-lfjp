import { githubRequest, getSessionToken, type ApiRequest, type ApiResponse } from '../_github.js';

export const runtime = 'nodejs';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' });
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ user: null });
  try {
    const user = await githubRequest(token, '/user');
    const allowedUsers = (process.env.ADMIN_GITHUB_USERS || '').split(',').map((item) => item.trim()).filter(Boolean);
    if (allowedUsers.length === 0 || !allowedUsers.includes(user.login)) return res.status(403).json({ user: null, error: 'Ce compte GitHub n’est pas autorisé à accéder à l’administration.' });
    return res.status(200).json({ user: { login: user.login, avatar_url: user.avatar_url } });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : 'GitHub est temporairement indisponible.' });
  }
}
