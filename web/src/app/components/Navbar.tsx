import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import NotificationModal from "./NotificationModal";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const [totalSessions, setTotalSessions] = useState(0);
  const [newSessions, setNewSessions] = useState(0);
  const [unseenSessions, setUnseenSessions] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const fetchSessions = useCallback(async () => {
    const res = await fetch("/api/getTotalSessions");
    const data = await res.json();
    const currentTotal = data.totalSessions;

    const storedTotal = Number(localStorage.getItem("storedTotalSessions")) || currentTotal;
    const difference = Math.max(0, currentTotal - storedTotal);

    setNewSessions(difference);
    setUnseenSessions(difference); // Se muestra en el badge hasta que se abra el modal.
    setTotalSessions(currentTotal);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setUnseenSessions(0); // Cuando se abre el modal, eliminamos las notificaciones visibles.
    localStorage.setItem("storedTotalSessions", totalSessions.toString()); // Guardamos el nuevo total.
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost btn-circle text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-white flex flex-col gap-2">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/sessions">Sesiones</Link></li>
            <li><Link href="/changePassword">Cambiar contraseña</Link></li>
            <li><button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => router.push('/api/logout')}>
               <FaSignOutAlt className="mr-2"/>
              <span>Cerrar sesión</span>
            </button></li>
          </ul>
        </div>
      </div>

      <div className="navbar-center">
        <Link href="/dashboard" className="btn btn-ghost text-xl text-white">
          CourageTheHoneypot Web Panel
        </Link>
      </div>

      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle text-white" onClick={handleOpenModal}>
          <div className="indicator text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unseenSessions > 0 && <span className="badge badge-xs badge-primary indicator-item">{unseenSessions}</span>}
          </div>
        </button>
      </div>

      {isModalOpen && <NotificationModal newSessions={newSessions} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Navbar;
