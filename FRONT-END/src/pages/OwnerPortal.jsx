import { Link } from "react-router-dom";
import { Building2, LogIn, UserPlus, ShieldCheck } from "lucide-react";

function OwnerPortal() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-4">
      <div className="glass w-full max-w-5xl rounded-[2rem] p-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <Building2 size={32} />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-950">
            Rental Owner Portal
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            This area is for rental owners and platform admins. Owners can
            manage vehicles and booking requests. Admins can approve listings,
            users, bookings, and reports.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Link
            to="/owner-login"
            className="rounded-3xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <LogIn />
            </div>

            <h2 className="text-2xl font-black text-slate-950">Owner Login</h2>

            <p className="mt-2 text-sm text-slate-500">
              Already have an owner account? Login and manage your fleet.
            </p>
          </Link>

          <Link
            to="/owner-register"
            className="rounded-3xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <UserPlus />
            </div>

            <h2 className="text-2xl font-black text-slate-950">
              Owner Register
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              New rental agency? Create an owner account and add vehicles.
            </p>
          </Link>

          <Link
            to="/admin-login"
            className="rounded-3xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <ShieldCheck />
            </div>

            <h2 className="text-2xl font-black text-slate-950">Admin Login</h2>

            <p className="mt-2 text-sm text-slate-500">
              Platform admin access for approvals, users, bookings and reports.
            </p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="font-bold text-blue-700">
            Back to customer website
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OwnerPortal;
