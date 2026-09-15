import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

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

const secret = () => {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('ADMIN_SESSION_SECRET doit contenir au moins 32 caractères.');
  return createHash('sha256').update(value).digest();
};

const encode = (value: Buffer) => value.toString('base64url');
const decode = (value: string) => Buffer.from(value, 'base64url');

export const encryptToken = (token: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', secret(), iv);
  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return `${encode(iv)}.${encode(cipher.getAuthTag())}.${encode(encrypted)}`;
};

export const decryptToken = (value: string) => {
  const [ivValue, tagValue, encryptedValue] = value.split('.');
  if (!ivValue || !tagValue || !encryptedValue) return null;
  try {
    const decipher = createDecipheriv('aes-256-gcm', secret(), decode(ivValue));
    decipher.setAuthTag(decode(tagValue));
    return Buffer.concat([decipher.update(decode(encryptedValue)), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
};

export const getCookies = (header = '') => Object.fromEntries(
  header.split(';').map((part) => part.trim().split('=').map(decodeURIComponent)).filter(([key, value]) => key && value)
);

export const getSessionToken = (req: { headers: { cookie?: string } }) =>
  decryptToken(getCookies(req.headers.cookie).lfjp_admin_session || '');

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
