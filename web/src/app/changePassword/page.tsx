"use client";

import { useState } from "react";
import LoggedLayout from "../layouts/LoggedLayout";

export default function ChangePassword() {
  const [hash, setHash] = useState<string | null>(null);

  const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const pwd = formData.get("password") as string;
    const salt = formData.get("salt") as string;
    const res = await fetch("/api/generateNewHash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pwd, salt }),
    });
    const data = await res.json();
    setHash(data.hash);
  };
  return (
    <LoggedLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-900 p-10">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center text-white">🔐 Cambiar Contraseña</h2>
          <p className="text-gray-400 text-center mb-6">
            Introduce la nueva contraseña y el salt a utilizar.
          </p>

          <form className="space-y-4" onSubmit={async (e) => await handleSubmit(e)}>
            <div>
              <label className="block text-white font-medium">Nueva Contraseña</label>
              <input
                type="password"
                className="w-full p-3 rounded bg-gray-700 text-white focus:ring focus:ring-blue-500"
                placeholder="Introduce la nueva contraseña"
                name="password"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium">Salt</label>
              <input
                type="text"
                className="w-full p-3 rounded bg-gray-700 text-white focus:ring focus:ring-blue-500"
                placeholder="Introduce el salt"
                name="salt"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition"
            >
              Generar Hash
            </button>
          </form>

          {hash && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg text-white text-center">
              <p className="text-green-400 font-medium">✅ Hash generado:</p>
              <code className="break-all text-sm">{hash}</code>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-bold text-white">📌 Instrucciones para cambiar la contraseña</h3>
            <p className="text-gray-400 text-sm mt-2">Sigue estos pasos para aplicar el cambio:</p>

            <div className="mt-4 space-y-2 text-gray-300 text-sm">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white font-bold px-2 py-1 rounded-full text-xs">1</span>
                <span>Copiar el hash generado arriba.</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white font-bold px-2 py-1 rounded-full text-xs">2</span>
                <span>Editar el archivo <code className="bg-gray-700 px-1 rounded">.env</code> o el <code className="bg-gray-700 px-1 rounded">docker-compose.yml</code>.</span>
              </div>

              <div className="p-4 bg-gray-700 rounded text-sm">
                <p className="text-gray-300">Si usas <code>.env</code>, cambia la variable:</p>
                <code className="block bg-gray-800 p-2 rounded text-green-400">
                  ADMIN_PASSWORD=nuevo_hash<br />
                  ADMIN_PASSWORD_SALT=nuevo_salt
                </code>
              </div>

              <div className="p-4 bg-gray-700 rounded text-sm">
                <p className="text-gray-300">Si usas <code>docker-compose.yml</code>, edita el entorno:</p>
                <code className="block bg-gray-800 p-2 rounded text-green-400">
                  environment:<br />
                  &nbsp;&nbsp;- ADMIN_PASSWORD=nuevo_hash<br />
                  &nbsp;&nbsp;- ADMIN_PASSWORD_SALT=nuevo_salt
                </code>
              </div>

              <div className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white font-bold px-2 py-1 rounded-full text-xs">3</span>
                <span>Guardar cambios y reiniciar el contenedor. (O el servicio si no estas utilizando docker)</span>
              </div>

              <div className="p-4 bg-gray-700 rounded text-sm">
                <code className="block bg-gray-800 p-2 rounded text-green-400">
                  docker-compose up -d --build
                </code>
              </div>

              <div className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white font-bold px-2 py-1 rounded-full text-xs">4</span>
                <span>¡Listo! Inicia sesión con la nueva contraseña.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoggedLayout>
  );
}
