import { useEffect, useState } from "react";
import {
  Bike,
  CalendarClock,
  Car,
  IndianRupee,
  PlusCircle,
} from "lucide-react";
import API from "../api/axios";
import StatCard from "../components/StatCard";

function OwnerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const [vehicleForm, setVehicleForm] = useState({
    vehicleName: "",
    vehicleNumber: "",
    brand: "",
    model: "",
    modelYear: "",
    type: "two-wheeler",
    fuelType: "petrol",
    transmission: "manual",
    priceDaily: "",
    priceWeekly: "",
    priceMonthly: "",
    location: "",
  });

  const getOwnerVehicles = async () => {
    try {
      const res = await API.get("/vehicles/owner/my-vehicles");
      setVehicles(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const getOwnerBookings = async () => {
    try {
      const res = await API.get("/bookings/owner");
      setBookings(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getOwnerVehicles();
    getOwnerBookings();
  }, []);

  const changeHandler = (e) => {
    setVehicleForm({ ...vehicleForm, [e.target.name]: e.target.value });
  };

  const addVehicleHandler = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        ...vehicleForm,
        modelYear: Number(vehicleForm.modelYear),
        priceDaily: Number(vehicleForm.priceDaily),
        priceWeekly: Number(vehicleForm.priceWeekly),
        priceMonthly: Number(vehicleForm.priceMonthly),
      };

      const res = await API.post("/vehicles", payload);
      setMessage(res.data.message);

      setVehicleForm({
        vehicleName: "",
        vehicleNumber: "",
        brand: "",
        model: "",
        modelYear: "",
        type: "two-wheeler",
        fuelType: "petrol",
        transmission: "manual",
        priceDaily: "",
        priceWeekly: "",
        priceMonthly: "",
        location: "",
      });

      getOwnerVehicles();
    } catch (error) {
      setMessage(error.response?.data?.message || "Vehicle add failed");
    }
  };

  const approveHandler = async (bookingId) => {
    try {
      await API.put(`/bookings/${bookingId}/approve`);
      getOwnerBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Approve failed");
    }
  };

  const rejectHandler = async (bookingId) => {
    try {
      await API.put(`/bookings/${bookingId}/reject`);
      getOwnerBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Reject failed");
    }
  };

  const updateStatusHandler = async (vehicleId, status) => {
    try {
      await API.put(`/vehicles/${vehicleId}/status`, { status });
      getOwnerVehicles();
    } catch (error) {
      alert(error.response?.data?.message || "Status update failed");
    }
  };

  const deleteVehicleHandler = async (vehicleId) => {
    const confirmDelete = window.confirm("Delete this vehicle?");
    if (!confirmDelete) return;
    try {
      await API.delete(`/vehicles/${vehicleId}`);
      getOwnerVehicles();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const approvedBookings = bookings.filter(
    (b) => b.status === "approved",
  ).length;

  return (
    <section className="mx-auto max-w-7xl pt-8">
      <div className="mb-8">
        <h1 className="page-title text-4xl md:text-5xl">Owner Dashboard</h1>
        <p className="page-subtitle mt-3">
          Manage your fleet, pricing, booking requests, and rental status.
        </p>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value={vehicles.length}
          icon={<Car />}
        />
        <StatCard
          title="Pending Requests"
          value={pendingBookings}
          icon={<CalendarClock />}
        />
        <StatCard
          title="Approved Bookings"
          value={approvedBookings}
          icon={<Bike />}
        />
        <StatCard title="Revenue View" value="Soon" icon={<IndianRupee />} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass h-fit rounded-[2rem] p-6">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <PlusCircle />
          </div>

          <h2 className="text-2xl font-black text-slate-950">
            Add New Vehicle
          </h2>

          {message && (
            <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
              {message}
            </div>
          )}

          <form onSubmit={addVehicleHandler} className="mt-6 grid gap-4">
            <input
              className="input-style"
              name="vehicleName"
              placeholder="Vehicle Name"
              value={vehicleForm.vehicleName}
              onChange={changeHandler}
            />

            <input
              className="input-style"
              name="vehicleNumber"
              placeholder="Vehicle Number"
              value={vehicleForm.vehicleNumber}
              onChange={changeHandler}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="input-style"
                name="brand"
                placeholder="Brand"
                value={vehicleForm.brand}
                onChange={changeHandler}
              />

              <input
                className="input-style"
                name="model"
                placeholder="Model"
                value={vehicleForm.model}
                onChange={changeHandler}
              />
            </div>

            <input
              className="input-style"
              name="modelYear"
              placeholder="Model Year"
              value={vehicleForm.modelYear}
              onChange={changeHandler}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <select
                className="input-style"
                name="type"
                value={vehicleForm.type}
                onChange={changeHandler}
              >
                <option value="two-wheeler">Two Wheeler</option>
                <option value="four-wheeler">Four Wheeler</option>
              </select>

              <select
                className="input-style"
                name="fuelType"
                value={vehicleForm.fuelType}
                onChange={changeHandler}
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="cng">CNG</option>
              </select>
            </div>

            <select
              className="input-style"
              name="transmission"
              value={vehicleForm.transmission}
              onChange={changeHandler}
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>

            <div className="grid gap-4 sm:grid-cols-3">
              <input
                className="input-style"
                name="priceDaily"
                placeholder="Daily ₹"
                value={vehicleForm.priceDaily}
                onChange={changeHandler}
              />

              <input
                className="input-style"
                name="priceWeekly"
                placeholder="Weekly ₹"
                value={vehicleForm.priceWeekly}
                onChange={changeHandler}
              />

              <input
                className="input-style"
                name="priceMonthly"
                placeholder="Monthly ₹"
                value={vehicleForm.priceMonthly}
                onChange={changeHandler}
              />
            </div>

            <input
              className="input-style"
              name="location"
              placeholder="Location"
              value={vehicleForm.location}
              onChange={changeHandler}
            />

            <button className="btn-primary w-full" type="submit">
              Add Vehicle
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="glass rounded-[2rem] p-6">
            <h2 className="mb-5 text-2xl font-black text-slate-950">
              My Vehicles
            </h2>

            {vehicles.length === 0 ? (
              <p className="text-slate-500">No vehicles added yet.</p>
            ) : (
              <div className="grid gap-4">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    className="rounded-3xl bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-slate-950">
                          {vehicle.vehicleName}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {vehicle.vehicleNumber} • {vehicle.type} • ₹
                          {vehicle.priceDaily}/day
                        </p>
                      </div>

                      <span className="badge mt-1 inline-block bg-emerald-50 text-emerald-700 shrink-0">
                        {vehicle.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <select
                        className="input-style py-1.5 text-sm"
                        value={vehicle.status}
                        onChange={(e) =>
                          updateStatusHandler(vehicle._id, e.target.value)
                        }
                      >
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Maintenance</option>
                      </select>

                      <button
                        className="rounded-2xl bg-red-600 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-red-700"
                        onClick={() => deleteVehicleHandler(vehicle._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass rounded-[2rem] p-6">
            <h2 className="mb-5 text-2xl font-black text-slate-950">
              Booking Requests
            </h2>

            {bookings.length === 0 ? (
              <p className="text-slate-500">No booking requests yet.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-3xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <h3 className="text-lg font-black text-slate-950">
                          {booking.vehicle?.vehicleName}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Customer: {booking.user?.name} • {booking.user?.email}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {booking.startDate?.slice(0, 10)} to{" "}
                          {booking.endDate?.slice(0, 10)} • ₹
                          {booking.totalAmount}
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

                    {booking.status === "pending" && (
                      <div className="mt-5 flex gap-3">
                        <button
                          className="btn-primary"
                          onClick={() => approveHandler(booking._id)}
                        >
                          Approve
                        </button>

                        <button
                          className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
                          onClick={() => rejectHandler(booking._id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OwnerDashboard;
