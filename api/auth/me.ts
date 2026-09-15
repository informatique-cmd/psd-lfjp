import { githubRequest, getSessionToken, type ApiRequest, type ApiResponse } from '../_github';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' });
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ user: null });
  const user = await githubRequest(token, '/user');
  return res.status(200).json({ user: { login: user.login, avatar_url: user.avatar_url } });
}
