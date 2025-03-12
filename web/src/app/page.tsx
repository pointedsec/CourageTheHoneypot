'use server'

import { redirect } from 'next/navigation'

export default async function Index() {
    redirect('/dashboard')
    return <h1>No deberías de ver esto...</h1>
}