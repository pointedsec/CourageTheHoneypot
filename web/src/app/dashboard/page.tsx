import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import Dashboard from "../components/Dashboard";

async function getIronSessionData() {
  const session = await getIronSession(await cookies(), {
    password: process.env.SESSION_SECRET || "super_secret_key",
    cookieName: "session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
  return session;
}
export default async function Home({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
  // Get "msg" parameter
  const msg = (await searchParams).msg;
  const session = await getIronSessionData();
  return (
    <Dashboard username={session.username} msg={msg}/>
  )
}
