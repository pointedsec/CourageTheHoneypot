import { prisma } from "./prisma";

export async function getDashboardData() {
  const totalAttempts = await prisma.intentos.count();
  const activeSessions = await prisma.sesion.count({ where: { end_time: null } });
  const totalCommands = await prisma.comandos.count();

  const attemptsPerDay = await prisma.$queryRawUnsafe(
    `SELECT strftime('%Y-%m-%d', timestamp) AS day, COUNT(*) AS attempts 
     FROM intentos GROUP BY day ORDER BY day DESC LIMIT 7;`
  );

  const logs = await prisma.intentos.findMany({
    orderBy: { timestamp: "desc" },
    take: 10,
  });

  return { totalAttempts, activeSessions, totalCommands, attemptsPerDay, logs };
}
