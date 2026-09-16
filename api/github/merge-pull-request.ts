import { getSessionToken, githubRequest, repositoryName, repositoryOwner, type ApiRequest, type ApiResponse } from '../_github';

export const runtime = 'nodejs';
export const config = { runtime: 'nodejs20.x' };

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ error: 'Connecte-toi avec GitHub avant de publier.' });
  const pullNumberValue = req.body && typeof req.body === 'object' ? (req.body as { pullNumber?: unknown }).pullNumber : null;
  const pullNumber = Number(pullNumberValue);
  if (!Number.isInteger(pullNumber) || pullNumber < 1) return res.status(400).json({ error: 'Numéro de Pull Request invalide.' });
  const user = await githubRequest(token, '/user');
  const allowedUsers = (process.env.ADMIN_GITHUB_USERS || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (allowedUsers.length > 0 && !allowedUsers.includes(user.login)) return res.status(403).json({ error: 'Ce compte GitHub n’est pas autorisé à publier.' });

  const pullRequest = await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/pulls/${pullNumber}`);
  if (pullRequest.state !== 'open') return res.status(409).json({ error: 'Cette Pull Request n’est plus ouverte.' });
  if (pullRequest.mergeable === false) return res.status(409).json({ error: 'GitHub indique que cette Pull Request ne peut pas être fusionnée.' });
  const merge = await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/pulls/${pullNumber}/merge`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merge_method: 'squash', commit_title: 'content: publish changes from admin' }),
  });
  if (!merge.merged) return res.status(409).json({ error: merge.message || 'La publication n’a pas été acceptée par GitHub.' });
  return res.status(200).json({ message: 'Publication effectuée.', url: pullRequest.html_url });
}
