import { useCallback, useState } from "react";
import axios from "axios";
import useAutoRefresh from "../hooks/useAutoRefresh";
import { triggerDataRefresh } from "../utils/dataRefresh";
import PaymentButton from "../components/PaymentButton";

const API_BASE_URL = "https://rento-backend-gmlw.onrender.com/api";

const authConfig = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setMessage("");

      const res = await axios.get(
        `${API_BASE_URL}/bookings/my-bookings`,
        authConfig(),
      );

      const data = Array.isArray(res.data) ? res.data : res.data.bookings || [];

      setBookings(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useAutoRefresh(fetchBookings, 10000);

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmCancel) return;

    try {
      await axios.put(
        `${API_BASE_URL}/bookings/${bookingId}/cancel`,
        {},
        authConfig(),
      );

      triggerDataRefresh();
      await fetchBookings();
      alert("Booking cancelled successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const badgeClass = (status) => {
    if (status === "approved" || status === "paid") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "pending" || status === "unpaid") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (
      status === "rejected" ||
      status === "cancelled" ||
      status === "failed"
    ) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Customer
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">
                My Bookings
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Track your bookings, approval status and payment status.
              </p>
            </div>

            <button
              onClick={fetchBookings}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-10 text-center text-slate-500 shadow-sm">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-10 text-center shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              No bookings yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Book a vehicle to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur-xl"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row">
                  <div className="flex gap-4">
                    <img
                      src={
                        booking.vehicle?.images?.[0] ||
                        "https://placehold.co/400x260?text=RentiGo"
                      }
                      alt={booking.vehicle?.vehicleName || "Vehicle"}
                      className="h-28 w-32 rounded-3xl object-cover"
                    />

                    <div>
                      <h2 className="text-xl font-black text-slate-950">
                        {booking.vehicle?.vehicleName || "Vehicle"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {booking.vehicle?.brand} {booking.vehicle?.model}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                            booking.status,
                          )}`}
                        >
                          Booking: {booking.status}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                            booking.paymentStatus,
                          )}`}
                        >
                          Payment: {booking.paymentStatus || "unpaid"}
                        </span>

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold capitalize text-slate-700">
                          {booking.rentalPlan}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-[260px] rounded-3xl bg-slate-50 p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Start</span>
                        <span className="font-bold text-slate-900">
                          {formatDate(booking.startDate)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">End</span>
                        <span className="font-bold text-slate-900">
                          {formatDate(booking.endDate)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
                        <span className="text-slate-500">Total</span>
                        <span className="text-lg font-black text-slate-950">
                          ₹{booking.totalAmount || 0}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {booking.status === "approved" &&
                        booking.paymentStatus !== "paid" && (
                          <PaymentButton
                            booking={booking}
                            onPaymentSuccess={fetchBookings}
                          />
                        )}

                      {booking.status === "pending" && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyBookings;
