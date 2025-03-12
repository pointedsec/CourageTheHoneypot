import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

async function getIronSessionData() {
    const session = await getIronSession(await cookies(), {
        password: process.env.SESSION_SECRET || 'super_secret_key',
        cookieName: 'session',
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production',
        }})
    return session
}
export async function middleware(request: NextRequest) {

    const session = await getIronSessionData()
    //@ts-ignore
    const user = session.username

    if(!user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
}
