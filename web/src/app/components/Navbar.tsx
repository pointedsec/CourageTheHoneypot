export default function Navbar() {
  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl text-white" href="/">Si, Soy Honeypot</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><button className="btn text-white btn-error" onClick={() => window.location.href = "/api/logout"}> Cerrar sesión </button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
