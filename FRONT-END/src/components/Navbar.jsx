import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Car,
  Menu,
  X,
  LogIn,
  BriefcaseBusiness,
  CalendarCheck,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/customer-login");
    window.location.reload();
  };

  const closeMenu = () => setOpen(false);

  const navClass = ({ isActive }) =>
    isActive
      ? "rounded-full bg-slate-950/90 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-sm"
      : "rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white/40 hover:text-slate-900";

  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-white/30 bg-white/30 px-4 py-3 shadow-sm shadow-black/5 backdrop-blur-2xl ring-1 ring-white/20 transition-all">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/80 text-white shadow-lg shadow-slate-900/20 backdrop-blur-sm">
            <Car size={22} />
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-black tracking-tight text-slate-950">
              Rento
            </h1>
            <p className="text-xs font-medium text-slate-500">Smart rentals</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full bg-white/40 p-1 shadow-inner backdrop-blur-sm md:flex">
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
              Owner Dashboard
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin-dashboard" className={navClass}>
              Admin Dashboard
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {!user ? (
            <>
              <Link
                to="/staff"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur-sm transition hover:bg-white/50"
              >
                <BriefcaseBusiness size={16} />
                Staff Portal
              </Link>

              <Link
                to="/customer-login"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950/90 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <LogIn size={16} />
                Login
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-white/40 bg-white/30 px-4 py-2 text-sm backdrop-blur-sm">
                <span className="font-semibold text-slate-950">
                  {user.name}
                </span>
                <span className="ml-2 rounded-full bg-white/60 px-2 py-0.5 text-xs font-bold capitalize text-slate-600 backdrop-blur-sm">
                  {user.role}
                </span>
              </div>

              <button
                onClick={logoutHandler}
                className="inline-flex items-center gap-2 rounded-full bg-red-100/60 px-4 py-2 text-sm font-bold text-red-700 backdrop-blur-sm transition hover:bg-red-200/70"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/40 text-slate-700 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-3 max-w-7xl rounded-[28px] border border-white/30 bg-white/30 p-3 shadow-sm shadow-black/5 backdrop-blur-2xl ring-1 ring-white/20 md:hidden">
          <div className="grid gap-2">
            <MobileLink to="/" onClick={closeMenu} icon={<Car size={18} />}>
              Home
            </MobileLink>

            <MobileLink
              to="/vehicles"
              onClick={closeMenu}
              icon={<Car size={18} />}
            >
              Vehicles
            </MobileLink>

            {user?.role === "customer" && (
              <MobileLink
                to="/my-bookings"
                onClick={closeMenu}
                icon={<CalendarCheck size={18} />}
              >
                My Bookings
              </MobileLink>
            )}

            {user?.role === "owner" && (
              <MobileLink
                to="/owner-dashboard"
                onClick={closeMenu}
                icon={<LayoutDashboard size={18} />}
              >
                Owner Dashboard
              </MobileLink>
            )}

            {user?.role === "admin" && (
              <MobileLink
                to="/admin-dashboard"
                onClick={closeMenu}
                icon={<ShieldCheck size={18} />}
              >
                Admin Dashboard
              </MobileLink>
            )}

            {!user ? (
              <>
                <MobileLink
                  to="/staff"
                  onClick={closeMenu}
                  icon={<BriefcaseBusiness size={18} />}
                >
                  Staff Portal
                </MobileLink>

                <Link
                  onClick={closeMenu}
                  to="/customer-login"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950/90 px-4 py-3 text-sm font-bold text-white backdrop-blur-sm"
                >
                  <LogIn size={18} />
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={logoutHandler}
                className="flex items-center justify-center gap-2 rounded-2xl bg-red-100/60 px-4 py-3 text-sm font-bold text-red-700 backdrop-blur-sm"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MobileLink({ to, onClick, icon, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-white/40 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white/60"
    >
      <span className="text-slate-600">{icon}</span>
      {children}
    </Link>
  );
}

export default Navbar;
