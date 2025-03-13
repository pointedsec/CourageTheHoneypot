import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

async function getTotalSessions() {
    const sessions = await prisma.sesion.findMany()
    return sessions.length
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    return res.status(200).json({
        status: "ok",
        message: "Total sessions",
        totalSessions: await getTotalSessions()
    });
  }