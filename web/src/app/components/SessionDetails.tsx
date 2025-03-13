import React from "react";
import { FaDownload } from "react-icons/fa";

const SessionDetails = ({ session }: { session: any }) => {
  const downloadJSON = () => {
    const jsonData = JSON.stringify(session, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `session_${session.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-lg space-y-6 animate-fade-in">
      <div className="bg-base-100 p-4 rounded-lg shadow flex justify-between items-center">
        <h2 className="text-2xl font-bold">Detalles de la Sesión #{session.id}</h2>
        <button 
          onClick={downloadJSON} 
          className="btn btn-warning flex items-center gap-2 shadow-lg transition-transform transform hover:scale-105">
          <FaDownload className="w-5 h-5" /> Descargar JSON
        </button>
      </div>

      <div className="bg-base-100 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Resumen de la Sesión</h3>
        <p><strong>ID de Sesión:</strong> {session.id}</p>
        <p><strong>Inicio:</strong> {session.createdAt}</p>
        <p><strong>Fin:</strong> {session.endTime || "Sesión activa"}</p>
        <p><strong>Comandos Ejecutados:</strong> {session.comandos.length}</p>
        <p><strong>Intentos de Acceso:</strong> {session.intentos.length}</p>
      </div>

      <div className="bg-base-100 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Intentos de Acceso</h3>
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>IP</th>
                <th>Usuario</th>
                <th>Contraseña</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {session.intentos.map((attempt: any) => (
                <tr key={attempt.id} className={attempt.status === "OK" ? "text-green-400" : "text-red-400"}>
                  <td>{attempt.id}</td>
                  <td>{attempt.ip}</td>
                  <td>{attempt.username}</td>
                  <td>{attempt.password}</td>
                  <td>{attempt.status}</td>
                  <td>{attempt.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-base-100 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Comandos Ejecutados</h3>
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono h-60 overflow-y-auto border border-gray-700">
          {session.comandos.map((cmd: any, index: number) => (
            <div key={index} className="mb-2">
              <p className="text-yellow-400">$ {cmd.command}</p>
              <p className="pl-4">{atob(cmd.respuesta_comando)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;