import { getCookies } from './_github';

export const runtime = 'nodejs';

export default function handler(req: { headers: { cookie?: string } }, res: { status: (code: number) => { json: (body: unknown) => void } }) {
  return res.status(200).json({ ok: true, cookies: getCookies(req.headers.cookie) });
}
