'use server';
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
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
  if (req.method === 'POST') {
    const username = req.body.username
    const password = req.body.password
    const hashed_password = crypto.createHash('md5').update(process.env.ADMIN_PASSWORD_SALT + password).digest('hex')
    if (username === process.env.ADMIN_USERNAME && hashed_password === process.env.ADMIN_PASSWORD) {
      // @ts-ignore
      session.username = username
      // @ts-ignore
      session.authenticated = true
      await session.save()
      res.status(303).redirect('/dashboard?msg=success')
    } else {
      res.status(401).redirect('/login?msg=error')
    }
  }
}