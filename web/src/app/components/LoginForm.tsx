'use client';
export default function LoginForm() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold text-white">CourageTheHoneypot Login</h1>
      <form
        method="post"
        action="/api/login"
        className="flex flex-col gap-4 mt-6"
      >
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="input input-bordered input-primary w-full max-w-xs text-white"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="input input-bordered input-primary w-full max-w-xs text-white"
        />
        <button type="submit" className="btn btn-primary text-white">
          Iniciar sesión
        </button>
      </form>
      <p className="text-white mt-4 text-sm cursor-pointer underline"
          // @ts-ignore
          onClick={() => document.getElementById("passwordModal").showModal()}
        >
          ¿Olvidaste tu contraseña?
        </p>
        <dialog id="passwordModal" className="modal">
          <div className="modal-box text-white">
            <h3 className="font-bold text-lg">Como reestablecer la contraseña</h3>
            <p className="py-4 text-slate-300">
              Solo el administrador puede reestablecer la contraseña.
            </p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Cerrar</button>
              </form>
            </div>
          </div>
        </dialog>
    </div>
  );
}
