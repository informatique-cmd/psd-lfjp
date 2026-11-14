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

async function fetchJsonFromGithub(token: string, base: string, path: string): Promise<{ data: Record<string, unknown> | null; sha?: string }> {
  try {
    const file = await githubRequest(
      token,
      `/repos/${repositoryOwner}/${repositoryName}/contents/${path}?ref=${encodeURIComponent(base)}`
    );
    if (file && typeof file.content === 'string') {
      const decoded = Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf8');
      const parsed: unknown = JSON.parse(decoded);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return { data: parsed as Record<string, unknown>, sha: file.sha };
      }
    }
  } catch {
    // fallback to bundled file
  }
  return { data: null };
}

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
      return res.status(200).json({ pageData: null, siteContent: null, source: 'bundled' });
    }
    const [pageDataRes, siteContentRes] = await Promise.all([
      fetchJsonFromGithub(token, base, 'src/content/pageData.json'),
      fetchJsonFromGithub(token, base, 'src/content/siteContent.json'),
    ]);

    return res.status(200).json({
      pageData: pageDataRes.data,
      siteContent: siteContentRes.data,
      source: pageDataRes.data || siteContentRes.data ? 'github' : 'bundled',
      sha: pageDataRes.sha,
    });
  } catch (err) {
    console.warn('[published content] fallback to bundled content:', err);
    return res.status(200).json({ pageData: null, siteContent: null, source: 'bundled' });
  }
}
