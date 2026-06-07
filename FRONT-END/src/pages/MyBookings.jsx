import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import API from "../api/axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    try {
      const res = await API.get("/bookings/my-bookings");
      setBookings(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <section className="mx-auto max-w-7xl pt-8">
      <div className="mb-8">
        <h1 className="page-title text-4xl">My Bookings</h1>
        <p className="page-subtitle mt-3">
          Track your vehicle booking requests and approval status.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-soft rounded-3xl p-8 text-center text-slate-600">
          No bookings found.
        </div>
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="glass-soft rounded-3xl p-5 md:flex md:items-center md:justify-between"
            >
              <div className="flex gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <CalendarCheck />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-950">
                    {booking.vehicle?.vehicleName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {booking.startDate?.slice(0, 10)} to{" "}
                    {booking.endDate?.slice(0, 10)}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Plan: {booking.rentalPlan} • Total: ₹{booking.totalAmount}
                  </p>
                </div>
              </div>

              <span
                className={`badge mt-4 inline-block md:mt-0 ${
                  booking.status === "approved"
                    ? "bg-emerald-50 text-emerald-700"
                    : booking.status === "rejected"
                    ? "bg-red-50 text-red-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyBookings;