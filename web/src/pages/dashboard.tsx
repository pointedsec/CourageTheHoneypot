import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import LoggedLayout from "@/app/layouts/LoggedLayout";
import TopUsersChart from "@/app/components/TopUsersChart";
import TopPasswordsChart from "@/app/components/TopPasswordsChart";
import AttemptsByIPChart from "@/app/components/AttemptsByIPChart";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800"];

export const getServerSideProps: GetServerSideProps = async () => {
    const totalAttempts = Number(await prisma.intentos.count());
    const activeSessions = Number(await prisma.sesion.count({ where: { end_time: null } }));
    const totalCommands = Number(await prisma.comandos.count());

    const attemptsPerDay = await prisma.$queryRawUnsafe<
        { day: string; attempts: bigint }[]
    >(
        `SELECT strftime('%Y-%m-%d', timestamp) AS day, COUNT(*) AS attempts 
     FROM intentos GROUP BY day ORDER BY day DESC LIMIT 7;`
    );

    // Convertimos BigInt a Number
    const formattedAttempts = attemptsPerDay.map((entry) => ({
        ...entry,
        attempts: Number(entry.attempts),
    }));

    // Últimos 5 intentos de acceso
    const latestAttempts = await prisma.intentos.findMany({
        orderBy: { timestamp: "desc" },
        take: 5,
        select: {
            ip: true,
            username: true,
            password: true,
            timestamp: true,
        }
    });


    // Convertimos Date a string para evitar errores de serialización
    const formattedLatestAttempts = latestAttempts.map((attempt) => ({
        ...attempt,
        // @ts-ignore
        timestamp: attempt.timestamp.toISOString(),
    }));

    // Top 5 usuarios más usados
    const topUsers = await prisma.intentos.groupBy({
        by: ["username"],
        _count: {
            username: true,
        },
        orderBy: {
            _count: {
                username: "desc",
            },
        },
        take: 5,
    });

    // Top 5 contraseñas mas usadas
    const topPasswords = await prisma.intentos.groupBy({
        by: ["password"],
        _count: {
            password: true,
        },
        orderBy: {
            _count: {
                password: "desc",
            },
        },
        take: 5,
    });

    // Numero de intentos por IP
    const attemptsByIP = await prisma.intentos.groupBy({
        by: ["ip"],
        _count: {
            ip: true,
        },
        orderBy: {
            _count: {
                ip: "desc",
            },
        },
    });

    return {
        props: {
            totalAttempts,
            activeSessions,
            totalCommands,
            attemptsPerDay: formattedAttempts,
            latestAttempts: formattedLatestAttempts,
            topUsers,
            topPasswords,
            attemptsByIP
        },
    };
};

// @ts-ignore
export default function Dashboard({ totalAttempts, activeSessions, totalCommands, attemptsPerDay, latestAttempts, topUsers, topPasswords, attemptsByIP }) {
    return (
        <LoggedLayout>
            <div className="min-h-screen bg-gray-900 text-white p-6">
                <h1 className="text-4xl font-bold text-center text-blue-400">📊 Dashboard</h1>
                <p className="text-center text-gray-400">Visión general de la actividad registrada.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-semibold text-green-400">Intentos Totales</h2>
                        <p className="text-3xl font-bold">{totalAttempts}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-semibold text-yellow-400">Sesiones Activas</h2>
                        <p className="text-3xl font-bold">{activeSessions}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-semibold text-red-400">Comandos Ejecutados</h2>
                        <p className="text-3xl font-bold">{totalCommands}</p>
                    </div>
                </div>

                <div className="mt-12 bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-blue-400 mb-4">📈 Intentos por Día</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={attemptsPerDay}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="day" stroke="#bbb" />
                            <YAxis stroke="#bbb" />
                            <Tooltip />
                            <Bar dataKey="attempts" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* 🔥 Últimos intentos de acceso */}
                <div className="mt-12 bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-red-400 mb-4">🔐 Últimos Intentos de Acceso</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th className="text-left text-gray-300">IP</th>
                                    <th className="text-left text-gray-300">Usuario</th>
                                    <th className="text-left text-gray-300">Contraseña</th>
                                    <th className="text-left text-gray-300">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestAttempts.map((attempt: any, index: any) => (
                                    <tr key={index} className="hover:bg-gray-700">
                                        <td className="text-white">{attempt.ip}</td>
                                        <td className="text-white">{attempt.username}</td>
                                        <td className="text-white">{attempt.password}</td>
                                        <td className="text-gray-400" suppressHydrationWarning>{new Date(attempt.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Medias */}
                <div className="mt-12">
                    <TopUsersChart topUsers={topUsers} />
                </div>
                <div className="mt-12">
                    <TopPasswordsChart topPasswords={topPasswords} />
                </div>
                <div className="mt-12">
                    <AttemptsByIPChart attemptsByIP={attemptsByIP} />
                </div>
            </div>
        </LoggedLayout>
    );
}
