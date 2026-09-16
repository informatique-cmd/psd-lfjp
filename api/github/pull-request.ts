import { randomBytes } from 'node:crypto';
import { getSessionToken, githubRequest, repositoryName, repositoryOwner, type ApiRequest, type ApiResponse } from '../_github';

export const runtime = 'nodejs';
export const config = { runtime: 'nodejs20.x' };

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ error: 'Connecte-toi avec GitHub avant de créer une Preview.' });
  const body = req.body && typeof req.body === 'object' ? req.body as { content?: unknown; files?: Record<string, unknown> } : {};
  const files = body.files
    ? Object.entries(body.files).filter(([, content]) => typeof content === 'string').map(([path, content]) => ({ path, content: content as string }))
    : typeof body.content === 'string' ? [{ path: 'src/content/siteContent.json', content: body.content }] : [];
  if (files.length === 0 || files.some((file) => file.content.length > 500000 || !/^src\/content\/[a-zA-Z0-9._-]+\.json$/.test(file.path))) {
    return res.status(400).json({ error: 'Contenu invalide ou trop volumineux.' });
  }
  const user = await githubRequest(token, '/user');
  const allowedUsers = (process.env.ADMIN_GITHUB_USERS || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (allowedUsers.length > 0 && !allowedUsers.includes(user.login)) return res.status(403).json({ error: 'Ce compte GitHub n’est pas autorisé.' });

  const base = process.env.GITHUB_BASE_BRANCH || 'main';
  const branch = `admin/content-${new Date().toISOString().slice(0, 10)}-${randomBytes(4).toString('hex')}`;
  const ref = await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/git/ref/heads/${base}`);
  await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/git/refs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: ref.object.sha }),
  });
  const commits = [];
  for (const file of files) {
    const existing = await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/contents/${file.path}?ref=${encodeURIComponent(base)}`);
    const commit = await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/contents/${file.path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'content: update site content from admin',
        content: Buffer.from(`${file.content.trim()}\n`, 'utf8').toString('base64'),
        branch,
        sha: existing.sha,
      }),
    });
    commits.push(commit);
  }
  const pullRequest = await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/pulls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'content: mise à jour depuis l’administration',
      head: branch,
      base,
      body: `Mise à jour préparée depuis l’espace administration par @${user.login}.\n\nUne Preview Vercel sera générée avant toute fusion en production.`,
    }),
  });
  return res.status(201).json({ url: pullRequest.html_url, number: pullRequest.number, branch, commits: commits.map((commit) => commit.commit?.html_url) });
}
