import { NextApiRequest, NextApiResponse } from 'next';

import { TOKEN_KEY } from '@/constants/common.constant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.cookies[TOKEN_KEY];
    const { redirectTo } = req.body;

    if (token) {
      if (redirectTo) {
        res.setHeader('Location', redirectTo);
        res.statusCode = 302;
        res.end();
      }
      return res.status(200).json({ authenticated: true });
    } else {
      return res.status(401).json({ authenticated: false });
    }
  } catch (error) {
    return res.status(401).json({ authenticated: false });
  }
}
