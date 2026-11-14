import {
  getFallbackRepoToken,
  getSessionToken,
  githubRequest,
  repositoryName,
  repositoryOwner,
  type ApiRequest,
  type ApiResponse,
} from '../_github.js';

export const runtime = 'nodejs';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');

  const token = getSessionToken(req, true) || getFallbackRepoToken();
  const base = process.env.GITHUB_BASE_BRANCH || 'main';

  try {
    if (!token) {
      return res.status(200).json({ pageData: null, source: 'bundled' });
    }
    const data = await githubRequest(
      token,
      `/repos/${repositoryOwner}/${repositoryName}/contents/src/content/pageData.json?ref=${encodeURIComponent(base)}`
    );
    if (data && typeof data.content === 'string') {
      const decoded = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8');
      const parsed: unknown = JSON.parse(decoded);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return res.status(200).json({ pageData: parsed, source: 'github', sha: data.sha });
      }
    }
    return res.status(200).json({ pageData: null, source: 'bundled' });
  } catch (err) {
    console.warn('[published content] fallback to bundled pageData:', err);
    return res.status(200).json({ pageData: null, source: 'bundled' });
  }
}
