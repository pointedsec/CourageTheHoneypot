import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Íconos para menú móvil

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-base-100 shadow-lg">
      <div className="navbar">
        {/* Logo */}
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl text-white">
            CourageTheHoneypot
          </Link>
        </div>

        {/* Menú Desktop */}
        <div className="hidden md:flex">
          <ul className="menu menu-horizontal px-1 flex items-center justify-center gap-4">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/sessions">Sesiones SSH</Link></li>
            <li><Link href="/commands">Comandos</Link></li>
            <li><Link href="/attempts">Intentos</Link></li>
            <li>
              <button className="btn text-white btn-error" onClick={() => window.location.href = "/api/logout"}>
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>

        {/* Botón menú hamburguesa (móvil) */}
        <div className="md:hidden">
          <button className="btn btn-ghost" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú desplegable en móvil */}
      {isOpen && (
        <div className="md:hidden bg-base-200 p-4">
          <ul className="menu flex flex-col gap-4">
            <li><Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
            <li><Link href="/sessions" onClick={() => setIsOpen(false)}>Sesiones SSH</Link></li>
            <li><Link href="/commands" onClick={() => setIsOpen(false)}>Comandos</Link></li>
            <li><Link href="/attempts" onClick={() => setIsOpen(false)}>Intentos</Link></li>
            <li>
              <button className="btn text-white btn-error w-full" onClick={() => window.location.href = "/api/logout"}>
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
