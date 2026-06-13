import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Briefcase, Car, LogOut, UserRound } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const loadUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    const handleStorage = () => loadUser();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("rento-auth-change", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("rento-auth-change", handleStorage);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const navClass = ({ isActive }) =>
    `rounded-2xl px-5 py-3 text-sm font-black transition ${
      isActive
        ? "bg-white text-slate-950 shadow-lg"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/85 px-4 py-4 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-lg shadow-black/30">
            <Car size={22} />
          </div>

          <div>
            <h1 className="text-xl font-black leading-none text-white">
              Rento
            </h1>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              Smart rentals
            </p>
          </div>
        </NavLink>

        <div className="hidden items-center gap-2 rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-1 shadow-sm backdrop-blur-xl md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          <NavLink to="/vehicles" className={navClass}>
            Vehicles
          </NavLink>

          {user?.role === "customer" && (
            <NavLink to="/my-bookings" className={navClass}>
              My Bookings
            </NavLink>
          )}

          {user?.role === "owner" && (
            <NavLink to="/owner-dashboard" className={navClass}>
              Dashboard
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin-dashboard" className={navClass}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <NavLink
              to="/staff"
              className="hidden items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-black text-slate-100 shadow-sm transition hover:bg-slate-800 sm:inline-flex"
            >
              <Briefcase size={17} />
              Staff Portal
            </NavLink>
          )}

          {user && (
            <div className="hidden items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-black text-slate-100 sm:flex">
              <UserRound size={16} />
              <span>{user.name}</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                {user.role}
              </span>
            </div>
          )}

          {user ? (
            <button
              onClick={logoutHandler}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-900/60 bg-red-950/50 px-5 py-3 text-sm font-black text-red-300 transition hover:bg-red-950"
            >
              <LogOut size={17} />
              Logout
            </button>
          ) : (
            <NavLink
              to="/customer-login"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-black/30 transition hover:bg-slate-200"
            >
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
