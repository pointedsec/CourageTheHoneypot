"use client"
export default function FixDatabase() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-red-500 animate-pulse">
              ⚠ Database Error ⚠
            </h1>
            <p className="text-lg text-gray-300">
              No se pudo validar la base de datos. Puede que el archivo no exista o esté dañado.
            </p>
    
            <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full">
              <h2 className="text-xl font-semibold text-blue-400">🔍 Posibles soluciones:</h2>
              <ul className="list-disc text-gray-400 text-left pl-5 mt-3 space-y-2">
                <li>📌 Verifica que la variable de entorno <code className="text-green-400">DATABASE_URL</code> está configurada correctamente. Debe tener un valor como el siguiente <code>DATABASE_URL="file:/home/andres/Desktop/Proyectos/CourageTheHoneypot/honeypot/ssh_honeypot.db"</code></li>
                <li>🛠 Asegúrate de que la base de datos tiene el formato correcto.</li>
                <li>💾 Si el archivo de la base de datos no existe o está corrupto, ejecútalo:</li>
              </ul>
    
              <div className="mt-4 bg-gray-900 p-3 rounded-lg border border-gray-700 text-green-400">
                <code>python3 RUTA_PROYECTO_RAIZ/honeypot/create_database.py</code>
              </div>
              <ul className="list-disc text-gray-400 text-left pl-5 mt-3 space-y-2">
                <li>🛠 Una vez ejecutado, reinicia el servidor web y debería de funcionar.</li>
              </ul>
            </div>
    
            <button
              className="mt-6 btn btn-primary btn-lg shadow-md hover:shadow-xl transition-all"
              onClick={() => window.location.replace("/dashboard")}
            >
              Reintentar Conexión 🔄
            </button>
          </div>
        </div>
      );
}
