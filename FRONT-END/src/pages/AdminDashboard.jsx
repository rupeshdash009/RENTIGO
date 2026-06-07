import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  Car,
  CalendarCheck,
  IndianRupee,
  CheckCircle,
  XCircle,
} from "lucide-react";
import API from "../api/axios";
import StatCard from "../components/StatCard";

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  const getData = async () => {
    try {
      const [analyticsRes, usersRes, ownersRes, vehiclesRes, bookingsRes] =
        await Promise.all([
          API.get("/admin/analytics"),
          API.get("/admin/users"),
          API.get("/admin/owners"),
          API.get("/admin/vehicles"),
          API.get("/admin/bookings"),
        ]);

      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setOwners(ownersRes.data);
      setVehicles(vehiclesRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const approveVehicle = async (id) => {
    try {
      await API.put(`/admin/vehicles/${id}/approve`);
      getData();
    } catch (error) {
      alert(error.response?.data?.message || "Approve failed");
    }
  };

  const rejectVehicle = async (id) => {
    try {
      const reason = prompt("Enter rejection reason:");
      await API.put(`/admin/vehicles/${id}/reject`, {
        rejectionReason: reason || "Rejected by admin",
      });
      getData();
    } catch (error) {
      alert(error.response?.data?.message || "Reject failed");
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      await API.put(`/admin/users/${id}/status`);
      getData();
    } catch (error) {
      alert(error.response?.data?.message || "Status update failed");
    }
  };

  if (!analytics) {
    return (
      <section className="mx-auto max-w-7xl pt-8">
        <div className="glass-soft rounded-3xl p-8 text-center text-slate-600">
          Loading admin dashboard...
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl pt-8">
      <div className="mb-8">
        <h1 className="page-title text-4xl md:text-5xl">Admin Dashboard</h1>
        <p className="page-subtitle mt-3">
          Manage users, owners, vehicles, bookings, approvals, and platform
          analytics.
        </p>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-4">
        <StatCard
          title="Customers"
          value={analytics.totalUsers}
          icon={<Users />}
        />
        <StatCard
          title="Owners"
          value={analytics.totalOwners}
          icon={<Building2 />}
        />
        <StatCard
          title="Vehicles"
          value={analytics.totalVehicles}
          icon={<Car />}
        />
        <StatCard
          title="Bookings"
          value={analytics.totalBookings}
          icon={<CalendarCheck />}
        />
        <StatCard
          title="Revenue"
          value={`₹${analytics.totalRevenue}`}
          icon={<IndianRupee />}
        />
        <StatCard
          title="Pending Vehicles"
          value={analytics.pendingVehicles}
          icon={<Car />}
        />
        <StatCard
          title="Booking Conversion"
          value={`${analytics.bookingConversionRate}%`}
          icon={<CheckCircle />}
        />
        <StatCard
          title="Vehicle Utilization"
          value={`${analytics.vehicleUtilizationRate}%`}
          icon={<CheckCircle />}
        />
      </div>

      <div className="grid gap-8">
        <div className="glass rounded-[2rem] p-6">
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            Vehicle Approval Requests
          </h2>

          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="rounded-3xl bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">
                      {vehicle.vehicleName}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {vehicle.vehicleNumber} • {vehicle.type} •{" "}
                      {vehicle.location}
                    </p>

                    <p className="text-sm text-slate-500">
                      Owner: {vehicle.owner?.name} • {vehicle.owner?.email}
                    </p>
                  </div>

                  <span
                    className={`badge h-fit ${
                      vehicle.approvalStatus === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : vehicle.approvalStatus === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {vehicle.approvalStatus}
                  </span>
                </div>

                {vehicle.approvalStatus === "pending" && (
                  <div className="mt-5 flex gap-3">
                    <button
                      className="btn-primary flex items-center gap-2"
                      onClick={() => approveVehicle(vehicle._id)}
                    >
                      <CheckCircle size={18} /> Approve
                    </button>

                    <button
                      className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white"
                      onClick={() => rejectVehicle(vehicle._id)}
                    >
                      <XCircle size={18} className="inline" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[2rem] p-6">
          <h2 className="mb-5 text-2xl font-black text-slate-950">Customers</h2>

          <div className="grid gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="rounded-3xl bg-white p-4 shadow-sm md:flex md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-black text-slate-950">{user.name}</h3>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>

                <button
                  onClick={() => toggleUserStatus(user._id)}
                  className={`mt-3 rounded-2xl px-5 py-2 font-bold md:mt-0 ${
                    user.isActive
                      ? "bg-red-50 text-red-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[2rem] p-6">
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            Rental Owners
          </h2>

          <div className="grid gap-4">
            {owners.map((owner) => (
              <div
                key={owner._id}
                className="rounded-3xl bg-white p-4 shadow-sm md:flex md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-black text-slate-950">{owner.name}</h3>
                  <p className="text-sm text-slate-500">{owner.email}</p>
                </div>

                <button
                  onClick={() => toggleUserStatus(owner._id)}
                  className={`mt-3 rounded-2xl px-5 py-2 font-bold md:mt-0 ${
                    owner.isActive
                      ? "bg-red-50 text-red-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {owner.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[2rem] p-6">
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            All Bookings
          </h2>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-3xl bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h3 className="font-black text-slate-950">
                      {booking.vehicle?.vehicleName}
                    </h3>

                    <p className="text-sm text-slate-500">
                      Customer: {booking.user?.name} • Owner:{" "}
                      {booking.owner?.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {booking.startDate?.slice(0, 10)} to{" "}
                      {booking.endDate?.slice(0, 10)} • ₹{booking.totalAmount}
                    </p>
                  </div>

                  <span
                    className={`badge h-fit ${
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
