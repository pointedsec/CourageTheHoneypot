import SessionList from "@/app/components/SessionList";
import LoggedLayout from "@/app/layouts/LoggedLayout";
import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => { 
    const prisma = new PrismaClient();
    const sessions = await prisma.sesion.findMany({
        orderBy: {
            start_time: 'desc'
        },
        include: {
            intentos: {
                select: {
                    ip: true,
                }
            },
            comandos: {
                select: {
                    command: true
                }
            }
        }
    });

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formattedSessions = sessions.map((session) => ({
        id: session.id,
        createdAt: session.start_time ? formatDate(session.start_time) : null,
        endTime: session.end_time ? formatDate(session.end_time) : null,
        ip: session.intentos[0]?.ip || null,
        total_cmds: session.comandos?.length || 0
    }));

    return {
        props: {
            sessions: formattedSessions
        }
    };
};

export default function Sessions({ sessions }: { sessions: { id: string, createdAt: string|null, endTime: string|null, ip: string|null, total_cmds: number }[] }) {
  return (
    <LoggedLayout>
        <SessionList sessions={sessions} />
    </LoggedLayout>
  );
}
