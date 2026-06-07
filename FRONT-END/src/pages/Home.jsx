import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  Car,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

function Home() {
  return (
    <section className="mx-auto max-w-7xl pt-10">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
            Modern Vehicle Rental Management System
          </div>

          <h1 className="page-title text-5xl leading-tight md:text-7xl">
            Rent vehicles faster with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RentiGo
            </span>
          </h1>

          <p className="page-subtitle mt-6 max-w-xl text-lg leading-8">
            A centralized MERN platform where customers book two-wheelers and
            four-wheelers, while owners manage fleet, pricing, availability, and
            booking requests.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/vehicles"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Browse Vehicles <ArrowRight size={18} />
            </Link>

            <Link to="/customer-register" className="btn-secondary text-center">
              Create Customer Account
            </Link>
          </div>
        </div>

        <div className="glass relative rounded-[2rem] p-6">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-blue-300/40 blur-3xl"></div>
          <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-purple-300/40 blur-3xl"></div>

          <div className="relative rounded-[1.5rem] bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white text-blue-700 shadow-sm">
              <Car size={64} />
            </div>

            <h2 className="text-3xl font-black text-slate-950">
              Smart Rental Dashboard
            </h2>

            <p className="mt-3 text-slate-600">
              Real-time availability, booking status, owner approval, and
              conflict-free rental flow.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <CalendarCheck className="mb-3 text-blue-600" />
                <p className="text-sm font-medium text-slate-700">
                  Easy Booking
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <ShieldCheck className="mb-3 text-emerald-600" />
                <p className="text-sm font-medium text-slate-700">
                  Secure Login
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <TrendingUp className="mb-3 text-purple-600" />
                <p className="text-sm font-medium text-slate-700">
                  Fleet Growth
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
