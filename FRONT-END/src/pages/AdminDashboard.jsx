import { useCallback, useState } from "react";
import axios from "axios";
import useAutoRefresh from "../hooks/useAutoRefresh";
import { triggerDataRefresh } from "../utils/dataRefresh";

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

function AdminDashboard() {
  const [analytics, setAnalytics] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("vehicles");
  const [loading, setLoading] = useState(true);

  const fetchAdminData = useCallback(async () => {
    try {
      const [analyticsRes, vehiclesRes, usersRes, ownersRes, bookingsRes] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/admin/analytics`, authConfig()),
          axios.get(`${API_BASE_URL}/admin/vehicles`, authConfig()),
          axios.get(`${API_BASE_URL}/admin/users`, authConfig()),
          axios.get(`${API_BASE_URL}/admin/owners`, authConfig()),
          axios.get(`${API_BASE_URL}/admin/bookings`, authConfig()),
        ]);

      setAnalytics(analyticsRes.data || {});

      setVehicles(
        Array.isArray(vehiclesRes.data)
          ? vehiclesRes.data
          : vehiclesRes.data.vehicles || [],
      );

      setUsers(
        Array.isArray(usersRes.data)
          ? usersRes.data
          : usersRes.data.users || [],
      );

      setOwners(
        Array.isArray(ownersRes.data)
          ? ownersRes.data
          : ownersRes.data.owners || [],
      );

      setBookings(
        Array.isArray(bookingsRes.data)
          ? bookingsRes.data
          : bookingsRes.data.bookings || [],
      );
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useAutoRefresh(fetchAdminData, 15000);

  const approveVehicle = async (vehicleId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/vehicles/${vehicleId}/approve`,
        {},
        authConfig(),
      );

      triggerDataRefresh();
      await fetchAdminData();
      alert("Vehicle approved");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve vehicle");
    }
  };

  const rejectVehicle = async (vehicleId) => {
    const rejectionReason = window.prompt("Enter rejection reason:");

    if (!rejectionReason) return;

    try {
      await axios.put(
        `${API_BASE_URL}/admin/vehicles/${vehicleId}/reject`,
        { rejectionReason },
        authConfig(),
      );

      triggerDataRefresh();
      await fetchAdminData();
      alert("Vehicle rejected");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject vehicle");
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/users/${userId}/status`,
        {},
        authConfig(),
      );

      triggerDataRefresh();
      await fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user status");
    }
  };

  const badgeClass = (status) => {
    if (status === "approved" || status === "available" || status === "paid") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "pending" || status === "unpaid") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (
      status === "rejected" ||
      status === "cancelled" ||
      status === "inactive" ||
      status === "failed"
    ) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const cards = [
    {
      label: "Users",
      value: analytics.totalUsers ?? users.length,
    },
    {
      label: "Owners",
      value: analytics.totalOwners ?? owners.length,
    },
    {
      label: "Vehicles",
      value: analytics.totalVehicles ?? vehicles.length,
    },
    {
      label: "Bookings",
      value: analytics.totalBookings ?? bookings.length,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Admin Panel
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Manage users, owners, vehicle approvals and bookings.
              </p>
            </div>

            <button
              onClick={fetchAdminData}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-10 text-center text-slate-500 shadow-sm">
            Loading admin dashboard...
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-4">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-xl"
                >
                  <p className="text-sm font-bold text-slate-500">
                    {card.label}
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-slate-950">
                    {card.value}
                  </h2>
                </div>
              ))}
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              {["vehicles", "users", "owners", "bookings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-2xl px-5 py-3 text-sm font-bold capitalize transition ${
                    activeTab === tab
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "vehicles" && (
              <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-xl">
                <h2 className="text-xl font-black text-slate-950">
                  Vehicle Listings
                </h2>

                <div className="mt-5 space-y-4">
                  {vehicles.length === 0 ? (
                    <p className="text-sm text-slate-500">No vehicles found.</p>
                  ) : (
                    vehicles.map((vehicle) => (
                      <div
                        key={vehicle._id}
                        className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex flex-col justify-between gap-4 md:flex-row">
                          <div>
                            <h3 className="font-black text-slate-950">
                              {vehicle.vehicleName}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {vehicle.vehicleNumber} • {vehicle.brand}{" "}
                              {vehicle.model}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              Owner: {vehicle.owner?.name || "N/A"} •{" "}
                              {vehicle.location}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                                  vehicle.approvalStatus,
                                )}`}
                              >
                                Approval: {vehicle.approvalStatus}
                              </span>

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                                  vehicle.status,
                                )}`}
                              >
                                Status: {vehicle.status}
                              </span>
                            </div>
                          </div>

                          {vehicle.approvalStatus === "pending" && (
                            <div className="flex h-fit gap-2">
                              <button
                                onClick={() => approveVehicle(vehicle._id)}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() => rejectVehicle(vehicle._id)}
                                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeTab === "users" && (
              <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-xl">
                <h2 className="text-xl font-black text-slate-950">Customers</h2>

                <div className="mt-5 space-y-4">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="flex flex-col justify-between gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center"
                    >
                      <div>
                        <h3 className="font-black text-slate-950">
                          {user.name}
                        </h3>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${
                            user.isActive
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-red-200 bg-red-50 text-red-700"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>

                        <button
                          onClick={() => toggleUserStatus(user._id)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
                        >
                          Toggle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "owners" && (
              <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-xl">
                <h2 className="text-xl font-black text-slate-950">Owners</h2>

                <div className="mt-5 space-y-4">
                  {owners.map((owner) => (
                    <div
                      key={owner._id}
                      className="flex flex-col justify-between gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center"
                    >
                      <div>
                        <h3 className="font-black text-slate-950">
                          {owner.name}
                        </h3>
                        <p className="text-sm text-slate-500">{owner.email}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${
                            owner.isActive
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-red-200 bg-red-50 text-red-700"
                          }`}
                        >
                          {owner.isActive ? "Active" : "Inactive"}
                        </span>

                        <button
                          onClick={() => toggleUserStatus(owner._id)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
                        >
                          Toggle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "bookings" && (
              <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-xl">
                <h2 className="text-xl font-black text-slate-950">
                  All Bookings
                </h2>

                <div className="mt-5 space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-sm text-slate-500">No bookings found.</p>
                  ) : (
                    bookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex flex-col justify-between gap-3 md:flex-row">
                          <div>
                            <h3 className="font-black text-slate-950">
                              {booking.vehicle?.vehicleName || "Vehicle"}
                            </h3>

                            <p className="text-sm text-slate-500">
                              Customer: {booking.user?.name || "N/A"} • Owner:{" "}
                              {booking.owner?.name || "N/A"}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              ₹{booking.totalAmount} • {booking.rentalPlan}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`h-fit rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                                booking.status,
                              )}`}
                            >
                              {booking.status}
                            </span>

                            <span
                              className={`h-fit rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                                booking.paymentStatus,
                              )}`}
                            >
                              {booking.paymentStatus || "unpaid"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
