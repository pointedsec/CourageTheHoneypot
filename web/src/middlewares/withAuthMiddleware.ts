import type { NextFetchEvent, NextRequest } from 'next/server';
import { CustomMiddleware } from './chain';
import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

async function getIronSessionData() {
    const session = await getIronSession(await cookies(), {
        password: process.env.SESSION_SECRET || '12345678901234567890123456789012',
        cookieName: 'session',
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production',
        }
    })
    return session
}

export function withAuthMiddleware(middleware: CustomMiddleware): CustomMiddleware {

    return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
        const session = await getIronSessionData()
        //@ts-ignore
        const user = session.username

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        return middleware(request, event, response);
    };

}