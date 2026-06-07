import { Link, NavLink, useNavigate } from "react-router-dom";
import { Car, Menu, X } from "lucide-react";
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

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-700 bg-blue-50 px-4 py-2 rounded-full font-bold"
      : "text-slate-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-full transition font-medium";

  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <Car size={24} />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-950">
              RentiGo
            </h1>
            <p className="text-xs text-slate-500">Vehicle Rental System</p>
          </div>
        </Link>

        <button
          className="block rounded-xl bg-slate-100 p-2 text-slate-800 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>

        <div className="hidden items-center gap-2 md:flex">
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

          {!user ? (
            <>
              <Link to="/customer-login" className="btn-secondary">
                Login
              </Link>

              <Link to="/customer-register" className="btn-primary">
                Register
              </Link>
            </>
          ) : (
            <button onClick={logoutHandler} className="btn-primary">
              Logout
            </button>
          )}
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-3 flex max-w-7xl flex-col gap-2 rounded-3xl p-4 md:hidden">
          <Link onClick={() => setOpen(false)} to="/" className="btn-secondary">
            Home
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/vehicles"
            className="btn-secondary"
          >
            Vehicles
          </Link>

          {user?.role === "customer" && (
            <Link
              onClick={() => setOpen(false)}
              to="/my-bookings"
              className="btn-secondary"
            >
              My Bookings
            </Link>
          )}

          {user?.role === "owner" && (
            <Link
              onClick={() => setOpen(false)}
              to="/owner-dashboard"
              className="btn-secondary"
            >
              Owner Dashboard
            </Link>
          )}

          {!user ? (
            <>
              <Link
                onClick={() => setOpen(false)}
                to="/customer-login"
                className="btn-secondary"
              >
                Login
              </Link>

              <Link
                onClick={() => setOpen(false)}
                to="/customer-register"
                className="btn-primary text-center"
              >
                Register
              </Link>
            </>
          ) : (
            <button onClick={logoutHandler} className="btn-primary">
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;