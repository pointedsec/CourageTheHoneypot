import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    // Check Content-Type
    if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: "Content-Type must be application/json" });
    }
    const { pwd, salt } = req.body;
    if (!pwd){
        return res.status(400).json({ error: "Missing parameter pwd" });
    }
    if (!salt){
        return res.status(400).json({ error: "Missing parameter salt" });
    }
    const hashed_password = crypto.createHash('md5').update(salt + pwd).digest('hex')
    return res.status(200).json({
        status: "ok",
        message: "Hash generado, reemplaza el hash (ADMIN_PASSWORD) y el salt (ADMIN_PASSWORD_SALT) en el archivo .env o en el docker-compose.yml",
        hash: hashed_password
    })
  }