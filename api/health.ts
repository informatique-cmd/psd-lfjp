export default function handler(req: { method?: string }, res: { status: (code: number) => { json: (body: unknown) => void } }) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' });
  return res.status(200).json({ ok: true, service: 'lfjp-api' });
}
