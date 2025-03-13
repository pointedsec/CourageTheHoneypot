import React from "react";

interface NotificationsModalProps {
  newSessions: number;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ newSessions, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-white">
    <div className="bg-base-100 p-6 rounded-lg shadow-lg w-80 text-center">
      <h2 className="text-xl font-bold mb-4">Notificaciones</h2>
      <p className="text-lg">
        {newSessions > 0 
          ? `Hay ${newSessions} sesiones nuevas abiertas.`
          : "No existen nuevas sesiones abiertas."}
      </p>
      <button onClick={onClose} className="btn btn-primary mt-4">Cerrar</button>
    </div>
  </div>
);

export default NotificationsModal;
