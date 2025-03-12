import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Importa la instancia de Prisma

const EXPECTED_TABLES = ["intentos", "sesion", "comandos"];

async function isValidDatabase(): Promise<boolean> {
  try {
    const results = await Promise.all(
      EXPECTED_TABLES.map((table) =>
        prisma.$queryRawUnsafe(`PRAGMA table_info(${table})`)
      )
    );

    for (let i = 0; i < EXPECTED_TABLES.length; i++) {
      // @ts-ignore
      if (!results[i] || results[i].length === 0) {
        console.error(`Table ${EXPECTED_TABLES[i]} does not exist.`);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Error verifying database:", error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const isValid = await isValidDatabase();
  if (!isValid) {
    return res.status(500).json({
      status: "error",
      message: "Invalid or missing database",
    });
  }

  return res.status(200).json({
    status: "ok",
    message: "Database is valid",
  });
}
