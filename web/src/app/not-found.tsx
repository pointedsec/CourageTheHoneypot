"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = 1; // Asegurar volumen al máximo
      video.muted = false; // Intentar iniciar con sonido
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsMuted(false)) // Si se reproduce con sonido, quitar mute
          .catch(() => setIsMuted(true)); // Si falla, dejarlo muteado
      }
    }
  }, []);

  const unmuteVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
      videoRef.current.play();
      setIsMuted(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video de fondo */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/panic_404.mp4"
        autoPlay
        loop
        playsInline
      />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white text-center p-6">
        <h1 className="text-6xl font-bold">¡404! Página no encontrada</h1>
        <p className="text-xl mt-4">"¡El horror! ¡El horror! ¡Muriel, no encuentro esta página!"</p>
        <p className="text-lg mt-2">
          Parece que te perdiste en el Medio de Ninguna Parte. ¡Mejor regresa antes de que algo raro pase!
        </p>
        <Link href="/dashboard" className="btn btn-primary mt-6">Volver a Casa</Link>

        {/* Botón para activar sonido si es necesario */}
        {isMuted && (
          <button onClick={unmuteVideo} className="btn btn-warning mt-4">
            🔊 Activar sonido
          </button>
        )}
      </div>
    </div>
  );
}
