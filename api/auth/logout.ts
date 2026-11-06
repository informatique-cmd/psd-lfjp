import { clearCookie, type ApiRequest, type ApiResponse } from '../_github.js';

export const runtime = 'nodejs';

export default function handler(req: ApiRequest, res: ApiResponse) {
  clearCookie(res);
  return res.status(200).json({ success: true, message: 'Déconnexion effectuée.' });
}
