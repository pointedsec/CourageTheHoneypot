'use server';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getIronSession } from 'iron-session';

if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_PASSWORD_SALT) {
  throw new Error('Missing environment variables')
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession(req, res, {
    password: process.env.SESSION_SECRET || 'super_secret_key',
    cookieName: 'session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    }
  })
  // @ts-ignore
  if (req.method === 'GET' && session.authenticated) {
    session.destroy();
    res.status(200).redirect('/login')
  }
}