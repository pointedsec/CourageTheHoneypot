import SessionDetails from "@/app/components/SessionDetails";
import LoggedLayout from "@/app/layouts/LoggedLayout";
import { PrismaClient } from "@prisma/client";

export const getServerSideProps = async ({params}: {params: {id: number}}) => {
    const id  = params?.id
    const prisma = new PrismaClient();
    const session = await prisma.sesion.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            comandos: true,
            intentos: true
        }
    })
    if (!session) {
        return {
            notFound: true
        }
    }
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }
    // Map comandos and intentos timestamps to human readable format
    const formattedComandos = session?.comandos.map((comando) => {
        return {
            ...comando,
            timestamp: comando.timestamp ? formatDate(comando.timestamp) : null
        }
    })
    const formattedIntentos = session?.intentos.map((intento) => {
        return {
            ...intento,
            timestamp: intento.timestamp ? formatDate(intento.timestamp) : null
        }
    })
    const formattedSession = {
        id: session?.id,
        createdAt: session?.start_time ? formatDate(session?.start_time) : null,
        endTime: session?.end_time ? formatDate(session?.end_time) : null,
        comandos: formattedComandos,
        intentos: formattedIntentos
    }
    console.log(formattedSession)
    return {
        props: { session: formattedSession }
    }
}

export default function Session({ session }: { session: any }) {
    return (
        <LoggedLayout>
            <SessionDetails session={session} />
        </LoggedLayout>
    )
}