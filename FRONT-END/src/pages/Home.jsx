import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Car,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Star,
  Users,
  Clock,
  MapPin,
  Zap,
  ChevronDown,
  Quote,
} from "lucide-react";

/* ─── Scroll-reveal hook (kept original but enhanced with framer) ─── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target, duration]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Section wrapper using Framer Motion ─── */
function Section({ children, className = "", id = "" }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.12 });
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Data (unchanged) ─── */
const features = [
  {
    icon: <CalendarCheck size={28} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Instant Booking",
    desc: "Select your dates, pick a vehicle, and confirm in under 60 seconds with real-time availability checks.",
  },
  {
    icon: <ShieldCheck size={28} />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    title: "Verified & Secure",
    desc: "JWT-based authentication, role-separated dashboards, and encrypted data at every layer.",
  },
  {
    icon: <TrendingUp size={28} />,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    title: "Owner Analytics",
    desc: "Track fleet utilization, booking trends, and revenue from a powerful owner dashboard.",
  },
  {
    icon: <Zap size={28} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Real-time Status",
    desc: "Booking approvals, rejections, and updates reflect instantly for both owners and customers.",
  },
  {
    icon: <MapPin size={28} />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    title: "Location Filters",
    desc: "Browse vehicles near your pickup location with distance-aware search and smart sorting.",
  },
  {
    icon: <Clock size={28} />,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    title: "Flexible Duration",
    desc: "Hourly, daily, or weekly rentals. Pricing auto-adjusts based on duration and vehicle type.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create your account",
    desc: "Register as a customer in minutes. Owners get a separate onboarding flow to list their fleet.",
  },
  {
    num: "02",
    title: "Browse the fleet",
    desc: "Filter by vehicle type, price range, location, and availability window.",
  },
  {
    num: "03",
    title: "Request a booking",
    desc: "Pick your dates, review the pricing summary, and send your booking request.",
  },
  {
    num: "04",
    title: "Owner approves",
    desc: "The vehicle owner reviews and confirms. You get notified instantly.",
  },
  {
    num: "05",
    title: "Ride & return",
    desc: "Collect the vehicle, complete your rental, and leave a review when done.",
  },
];

const fleet = [
  {
    type: "Motorcycles",
    icon: "🏍️",
    desc: "Nimble, fuel-efficient, perfect for city commutes and short trips.",
    tag: "Most popular",
  },
  {
    type: "Scooters",
    icon: "🛵",
    desc: "Easy to ride, great for beginners, ideal for urban exploration.",
    tag: "Beginner friendly",
  },
  {
    type: "Sedans",
    icon: "🚗",
    desc: "Comfortable four-wheelers for family outings and long-distance travel.",
    tag: "Family choice",
  },
  {
    type: "SUVs",
    icon: "🚙",
    desc: "Spacious and powerful for off-road adventures and group trips.",
    tag: "Premium",
  },
];

const plans = [
  {
    name: "Pay-as-you-go",
    price: "₹0",
    sub: "No monthly fee",
    perks: [
      "Pay only when you book",
      "Access to all vehicles",
      "Instant booking requests",
      "Email notifications",
    ],
    cta: "/customer-register",
    highlight: false,
  },
  {
    name: "Rento  Pro",
    price: "₹199",
    sub: "per month",
    perks: [
      "Priority booking queue",
      "10% discount on all rentals",
      "Dedicated support chat",
      "Early access to new fleet",
      "Booking history export",
    ],
    cta: "/customer-register",
    highlight: true,
  },
  {
    name: "Fleet Owner",
    price: "₹499",
    sub: "per month",
    perks: [
      "List unlimited vehicles",
      "Owner analytics dashboard",
      "Custom pricing rules",
      "Conflict detection engine",
      "Revenue reports",
    ],
    cta: "/owner-register",
    highlight: false,
  },
];

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Student, Pune",
    text: "Booked a scooter for my college commute in literally 2 minutes. The owner approved within the hour. This app is a lifesaver.",
    stars: 5,
  },
  {
    name: "Priya Nair",
    role: "Fleet Owner, Kochi",
    text: "I listed 6 bikes and within a week had bookings every day. The dashboard shows me everything — revenue, pending requests, conflicts. Incredible.",
    stars: 5,
  },
  {
    name: "Rohan Das",
    role: "Traveller, Bhubaneswar",
    text: "Used Rento  to rent an SUV for a weekend trip to Chilika. Super smooth experience from booking to return. Will use again.",
    stars: 5,
  },
];

/* ─── Component with Framer Motion animations ─── */
export default function Home() {
  // For staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* ══════════ 1. HERO ══════════ */}
      <section className="relative overflow-hidden bg-white px-6 pt-20 pb-24 sm:px-10 lg:px-20">
        {/* background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* animated blobs with framer */}
        <motion.div
          className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-blue-100/60 blur-3xl"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-24 -left-12 h-[320px] w-[320px] rounded-full bg-purple-100/60 blur-3xl"
          animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left with framer motion */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-start"
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                Vehicle Rental Platform
              </span>

              <h1 className="text-5xl font-black leading-[1.07] tracking-tight text-slate-950 sm:text-6xl xl:text-7xl">
                Rent smarter.
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Move faster.
                  </span>
                  <motion.span
                    className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-purple-100 rounded"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-500">
                A centralized platform where customers book two-wheelers and
                four-wheelers while owners manage fleet, pricing, and booking
                requests — all in real time.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/vehicles"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:shadow-blue-300"
                  >
                    Browse Vehicles <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/customer-register"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                  >
                    Create Account
                  </Link>
                </motion.div>
              </div>

              <div className="mt-10 flex items-center gap-6">
                {[
                  ["2,400+", "Vehicles listed"],
                  ["98%", "Booking success"],
                  ["4.9★", "Avg. rating"],
                ].map(([val, lbl]) => (
                  <div key={lbl} className="text-center">
                    <p className="text-xl font-black text-slate-900">{val}</p>
                    <p className="text-xs text-slate-400">{lbl}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right card with framer motion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
              className="relative"
            >
              <div className="rounded-[2rem] border border-slate-100 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 shadow-2xl shadow-slate-100">
                <div className="mb-5 flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.05 }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg"
                  >
                    <Car size={28} />
                  </motion.div>
                  <div>
                    <p className="font-bold text-slate-900">
                      Smart Rental Dashboard
                    </p>
                    <p className="text-xs text-slate-400">
                      Live fleet · owner approvals · conflict-free
                    </p>
                  </div>
                </div>

                {/* mock booking card with pulse animation */}
                <motion.div
                  whileHover={{
                    y: -2,
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  }}
                  className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Active booking</p>
                      <p className="font-bold text-slate-800">
                        Honda Activa 6G
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      Confirmed
                    </span>
                  </div>
                  <div className="mt-3 flex gap-4 text-xs text-slate-500">
                    <span>📅 Jun 10 – Jun 13</span>
                    <span>💰 ₹1,200 total</span>
                  </div>
                </motion.div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    {
                      icon: <CalendarCheck size={18} />,
                      label: "Easy Booking",
                      color: "text-blue-600 bg-blue-50",
                    },
                    {
                      icon: <ShieldCheck size={18} />,
                      label: "Secure Login",
                      color: "text-emerald-600 bg-emerald-50",
                    },
                    {
                      icon: <TrendingUp size={18} />,
                      label: "Fleet Growth",
                      color: "text-purple-600 bg-purple-50",
                    },
                  ].map(({ icon, label, color }) => (
                    <motion.div
                      key={label}
                      whileHover={{ y: -3, scale: 1.02 }}
                      className="flex flex-col items-center gap-2 rounded-xl bg-white p-3 shadow-sm border border-slate-100"
                    >
                      <span className={`rounded-lg p-2 ${color}`}>{icon}</span>
                      <p className="text-center text-xs font-medium text-slate-600">
                        {label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* owner requests strip */}
                <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50 p-3">
                  <p className="mb-2 text-xs font-semibold text-purple-700">
                    Owner — pending requests
                  </p>
                  {[
                    { v: "Royal Enfield Classic", t: "Jun 15–17" },
                    { v: "Maruti Swift", t: "Jun 20–22" },
                  ].map(({ v, t }) => (
                    <div
                      key={v}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-xs text-slate-600">
                        {v} · {t}
                      </span>
                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-200"
                        >
                          ✓
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-100"
                        >
                          ✕
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* scroll hint */}
          <motion.div
            className="mt-16 flex justify-center"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="flex flex-col items-center gap-1 text-slate-300">
              <span className="text-xs">Scroll to explore</span>
              <ChevronDown size={18} className="animate-bounce" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ 2. STATS ══════════ */}
      <Section className="border-y border-slate-100 bg-slate-50 px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              {
                val: 2400,
                suffix: "+",
                label: "Vehicles Listed",
                icon: <Car size={20} />,
                color: "text-blue-600",
              },
              {
                val: 18000,
                suffix: "+",
                label: "Bookings Completed",
                icon: <CalendarCheck size={20} />,
                color: "text-purple-600",
              },
              {
                val: 950,
                suffix: "+",
                label: "Verified Owners",
                icon: <ShieldCheck size={20} />,
                color: "text-indigo-600",
              },
              {
                val: 99,
                suffix: "%",
                label: "Uptime Guaranteed",
                icon: <TrendingUp size={20} />,
                color: "text-blue-600",
              },
            ].map(({ val, suffix, label, icon, color }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-1 text-center"
              >
                <span className={`mb-1 ${color}`}>{icon}</span>
                <p className="text-4xl font-black text-slate-900">
                  <Counter target={val} suffix={suffix} />
                </p>
                <p className="text-sm text-slate-400">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════ 3. FEATURES ══════════ */}
      <Section id="features" className="px-6 py-24 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Why Rento
            </span>
            <h2 className="text-4xl font-black text-slate-900">
              Everything you need, nothing you don't
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto">
              Built for speed, transparency, and scale — from a solo scooter
              hire to a 500-vehicle fleet.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map(({ icon, color, bg, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className={`mb-4 inline-flex rounded-xl p-3 ${bg} ${color}`}
                >
                  {icon}
                </motion.div>
                <h3 className="mb-2 font-bold text-slate-900">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════════ 4. HOW IT WORKS ══════════ */}
      <Section
        id="how-it-works"
        className="bg-gradient-to-br from-blue-600 to-purple-700 px-6 py-24 sm:px-10 lg:px-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-100">
              The Process
            </span>
            <h2 className="text-4xl font-black text-white">How Rento works</h2>
            <p className="mt-3 text-blue-100 max-w-md mx-auto">
              From account creation to keys in hand — five clear steps.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-10 left-10 right-10 h-0.5 bg-white/10 hidden lg:block" />
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 lg:grid-cols-5"
            >
              {steps.map(({ num, title, desc }) => (
                <motion.div
                  key={num}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="relative flex flex-col items-start lg:items-center text-left lg:text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-3xl font-black text-white"
                  >
                    {num}
                  </motion.div>
                  <h4 className="mb-1 font-bold text-white">{title}</h4>
                  <p className="text-xs leading-relaxed text-blue-100">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="mt-14 flex justify-center gap-4 flex-wrap">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/customer-register"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:shadow-xl"
              >
                Get started free <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/vehicles"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View fleet
              </Link>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ══════════ 5. FLEET TYPES ══════════ */}
      <Section id="fleet" className="px-6 py-24 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-purple-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-600">
              Our Fleet
            </span>
            <h2 className="text-4xl font-black text-slate-900">
              Two-wheelers & four-wheelers
            </h2>
            <p className="mt-3 text-slate-400 max-w-lg mx-auto">
              Whatever your journey demands, Rento has a vehicle for it.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {fleet.map(({ type, icon, desc, tag }) => (
              <motion.div
                key={type}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-lg"
              >
                <span className="absolute top-4 right-4 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600">
                  {tag}
                </span>
                <div className="mb-4 text-5xl">{icon}</div>
                <h3 className="mb-2 font-bold text-slate-900">{type}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                <Link
                  to="/vehicles"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition group-hover:gap-2"
                >
                  Browse {type} <ArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════════ 6. PRICING ══════════ */}
      <Section
        id="pricing"
        className="bg-slate-50 px-6 py-24 sm:px-10 lg:px-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Pricing
            </span>
            <h2 className="text-4xl font-black text-slate-900">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-slate-400 max-w-md mx-auto">
              No hidden fees. No surprises. Choose the plan that fits your role.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 lg:grid-cols-3"
          >
            {plans.map(({ name, price, sub, perks, cta, highlight }) => (
              <motion.div
                key={name}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition ${
                  highlight
                    ? "border-blue-300 bg-gradient-to-b from-blue-600 to-purple-600 text-white"
                    : "border-slate-100 bg-white text-slate-900"
                }`}
              >
                {highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-0.5 text-xs font-bold text-amber-900">
                    Most Popular
                  </span>
                )}
                <p
                  className={`text-sm font-semibold ${highlight ? "text-blue-100" : "text-slate-400"}`}
                >
                  {name}
                </p>
                <div className="mt-3 flex items-end gap-1">
                  <span
                    className={`text-5xl font-black ${highlight ? "text-white" : "text-slate-900"}`}
                  >
                    {price}
                  </span>
                  <span
                    className={`mb-2 text-sm ${highlight ? "text-blue-100" : "text-slate-400"}`}
                  >
                    {sub}
                  </span>
                </div>
                <ul className="mt-6 flex flex-col gap-3 flex-1">
                  {perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        size={15}
                        className={`mt-0.5 shrink-0 ${highlight ? "text-blue-200" : "text-emerald-500"}`}
                      />
                      <span
                        className={
                          highlight ? "text-blue-50" : "text-slate-600"
                        }
                      >
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={cta}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
                    highlight
                      ? "bg-white text-blue-700 hover:bg-blue-50"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                  }`}
                >
                  Get started <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════════ 7. TESTIMONIALS + CTA ══════════ */}
      <Section id="testimonials" className="px-6 py-24 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Reviews
            </span>
            <h2 className="text-4xl font-black text-slate-900">
              Loved by renters & owners
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 lg:grid-cols-3"
          >
            {testimonials.map(({ name, role, text, stars }) => (
              <motion.div
                key={name}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <Quote size={20} className="mb-3 text-slate-200" />
                <p className="text-sm leading-relaxed text-slate-600">
                  "{text}"
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {name}
                    </p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA strip */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-20 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-purple-700 px-10 py-14 text-center shadow-2xl shadow-blue-200"
          >
            <h2 className="text-4xl font-black text-white">
              Ready to hit the road?
            </h2>
            <p className="mt-3 text-blue-100 max-w-md mx-auto">
              Join thousands of customers and owners already using Rento to
              simplify vehicle rentals.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/customer-register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition hover:shadow-xl"
                >
                  Start as Customer <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/owner-register"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  List your fleet
                </Link>
              </motion.div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {[
                <Users size={14} />,
                <ShieldCheck size={14} />,
                <Zap size={14} />,
              ].map((icon, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-blue-100"
                >
                  {icon}
                  {
                    [
                      "No credit card required",
                      "Cancel any time",
                      "Instant access",
                    ][i]
                  }
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
