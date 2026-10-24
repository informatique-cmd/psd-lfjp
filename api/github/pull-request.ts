import { randomBytes } from 'node:crypto';
import { getSessionToken, githubRequest, repositoryName, repositoryOwner, type ApiRequest, type ApiResponse } from '../_github.js';

export const runtime = 'nodejs';

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
  const allowedUsers = (process.env.ADMIN_GITHUB_USERS || 'informatique-cmd,direction-lfjp').split(',').map((item) => item.trim()).filter(Boolean);
  if (allowedUsers.length === 0 || !allowedUsers.includes(user.login)) return res.status(403).json({ error: 'Ce compte GitHub n’est pas autorisé à déployer sur le site.' });

  const base = process.env.GITHUB_BASE_BRANCH || 'main';

  // Direct deployment to production (main branch)
  if (body.directDeploy) {
    try {
      // 1. Get latest commit SHA on base branch
      const ref = await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/git/ref/heads/${base}`);
      const parentSha = ref.object.sha;

      // 2. Create Tree with all modified files in a single atomic transaction
      const treePayload = {
        base_tree: parentSha,
        tree: files.map((file) => ({
          path: file.path,
          mode: '100644',
          type: 'blob',
          content: `${file.content.trim()}\n`,
        })),
      };
      const tree = await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/git/trees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treePayload),
      });

      // 3. Create a single commit referencing the new tree
      const commit = await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/git/commits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `content: publication des modifications [production deploy by @${user.login}]`,
          tree: tree.sha,
          parents: [parentSha],
        }),
      });

      // 4. Update the branch ref to point to the new commit
      await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/git/refs/heads/${base}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sha: commit.sha,
          force: false,
        }),
      });

      return res.status(200).json({
        success: true,
        directDeploy: true,
        branch: base,
        commitSha: commit.sha,
        commitUrl: commit.html_url,
        message: 'Déploiement en production réussi ! Les modifications sont publiées sur la branche principale et le site Vercel est en cours de mise à jour.',
        commits: [commit.html_url],
      });
    } catch (atomicErr) {
      console.warn('Atomic tree commit failed, falling back to sequential contents update:', atomicErr);
      const commits = [];
      for (const file of files) {
        let sha: string | undefined;
        try {
          const existing = await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/contents/${file.path}?ref=${encodeURIComponent(base)}`);
          sha = existing.sha;
        } catch {
          // file may be newly created
        }
        const commit = await githubRequest(token, `/repos/${repositoryOwner}/${repositoryName}/contents/${file.path}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `content: update ${file.path} [production deploy by @${user.login}]`,
            content: Buffer.from(`${file.content.trim()}\n`, 'utf8').toString('base64'),
            branch: base,
            ...(sha ? { sha } : {}),
          }),
        });
        commits.push(commit);
      }
      return res.status(200).json({
        success: true,
        directDeploy: true,
        branch: base,
        message: 'Déploiement en production réussi ! Les modifications sont publiées sur la branche principale.',
        commits: commits.map((c) => c.commit?.html_url),
      });
    }
  }

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
