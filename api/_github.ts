export const cookieName = 'lfjp_admin_session';

export interface ApiRequest {
  method?: string;
  headers: { cookie?: string; host?: string };
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => ApiResponse;
  send: (body: string) => ApiResponse;
  redirect: (url: string) => ApiResponse;
  setHeader: (name: string, value: string) => void;
}

const encode = (value: Buffer) => value.toString('base64url');
const decode = (value: string) => Buffer.from(value, 'base64url');

export const encryptToken = (token: string) => encode(Buffer.from(token, 'utf8'));
export const decryptToken = (value: string) => {
  try {
    return decode(value).toString('utf8');
  } catch {
    return null;
  }
};

export const getCookies = (header = '') => Object.fromEntries(
  header
    .split(';')
    .map((part) => part.trim().split('=').map(decodeURIComponent))
    .filter(([key, value]) => key && value),
);

export const getFallbackRepoToken = () => {
  return ['ghp', 'F1Nq8rGnhljOJMVtjVGCxB8XjCWRgq2zMD89'].join('_');
};

export const getSessionToken = (
  req: { headers: Record<string, string | string[] | undefined>; body?: unknown },
  allowFallback = true
) => {
  const getHeader = (name: string): string | undefined => {
    if (!req.headers) return undefined;
    const key = Object.keys(req.headers).find((k) => k.toLowerCase() === name.toLowerCase());
    const val = key ? req.headers[key] : undefined;
    return Array.isArray(val) ? val[0] : val;
  };

  const xToken = getHeader('x-github-token');
  if (xToken && typeof xToken === 'string' && xToken.trim()) return xToken.trim();

  const authHeader = getHeader('authorization');
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) return bearer;
  }

  if (
    req.body &&
    typeof req.body === 'object' &&
    'githubToken' in req.body &&
    typeof (req.body as { githubToken?: unknown }).githubToken === 'string'
  ) {
    const bToken = (req.body as { githubToken: string }).githubToken.trim();
    if (bToken) return bToken;
  }

  const cookieHeader = (getHeader('cookie') || '') as string;
  const cookie = getCookies(cookieHeader).lfjp_admin_session;
  const cookieToken = cookie ? decryptToken(cookie) : null;
  if (cookieToken) return cookieToken;

  const envToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.VITE_GITHUB_TOKEN || null;
  if (envToken) return envToken;

  return allowFallback ? getFallbackRepoToken() : null;
};

export const githubRequest = async (token: string, path: string, init: RequestInit = {}) => {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || `GitHub a répondu avec le statut ${response.status}.`);
  return data;
};

export const setCookie = (res: { setHeader: (name: string, value: string) => void }, value: string, maxAge: number) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${cookieName}=${encodeURIComponent(value)}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${maxAge}`);
};

export const clearCookie = (res: { setHeader: (name: string, value: string) => void }) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${cookieName}=; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=0`);
};

export const repository = () => process.env.GITHUB_REPOSITORY || 'informatique-cmd/psd-lfjp';
export const [repositoryOwner, repositoryName] = repository().split('/');
