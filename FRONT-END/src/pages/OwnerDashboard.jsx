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

const emptyVehicleForm = {
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
  images: "",
  status: "available",
};

function OwnerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyVehicleForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOwnerData = useCallback(async () => {
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/vehicles/owner/my-vehicles`, authConfig()),
        axios.get(`${API_BASE_URL}/bookings/owner/bookings`, authConfig()),
      ]);

      setVehicles(
        Array.isArray(vehiclesRes.data)
          ? vehiclesRes.data
          : vehiclesRes.data.vehicles || [],
      );

      setBookings(
        Array.isArray(bookingsRes.data)
          ? bookingsRes.data
          : bookingsRes.data.bookings || [],
      );
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load owner data");
    } finally {
      setLoading(false);
    }
  }, []);

  useAutoRefresh(fetchOwnerData, 15000);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm(emptyVehicleForm);
    setEditingId(null);
  };

  const buildPayload = () => {
    return {
      ...form,
      modelYear: Number(form.modelYear),
      priceDaily: Number(form.priceDaily),
      priceWeekly: Number(form.priceWeekly),
      priceMonthly: Number(form.priceMonthly),
      images: form.images
        ? form.images
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean)
        : [],
    };
  };

  const submitVehicle = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = buildPayload();

      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/vehicles/${editingId}`,
          payload,
          authConfig(),
        );

        alert("Vehicle updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/vehicles`, payload, authConfig());

        alert("Vehicle added successfully. Waiting for admin approval.");
      }

      resetForm();
      triggerDataRefresh();
      await fetchOwnerData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save vehicle");
    } finally {
      setSaving(false);
    }
  };

  const editVehicle = (vehicle) => {
    setEditingId(vehicle._id);

    setForm({
      vehicleName: vehicle.vehicleName || "",
      vehicleNumber: vehicle.vehicleNumber || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      modelYear: vehicle.modelYear || "",
      type: vehicle.type || "two-wheeler",
      fuelType: vehicle.fuelType || "petrol",
      transmission: vehicle.transmission || "manual",
      priceDaily: vehicle.priceDaily || "",
      priceWeekly: vehicle.priceWeekly || "",
      priceMonthly: vehicle.priceMonthly || "",
      location: vehicle.location || "",
      images: vehicle.images?.join(", ") || "",
      status: vehicle.status || "available",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteVehicle = async (vehicleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/vehicles/${vehicleId}`, authConfig());

      triggerDataRefresh();
      await fetchOwnerData();
      alert("Vehicle deleted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete vehicle");
    }
  };

  const updateVehicleStatus = async (vehicleId, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}/vehicles/${vehicleId}/status`,
        { status },
        authConfig(),
      );

      triggerDataRefresh();
      await fetchOwnerData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update vehicle status");
    }
  };

  const approveBooking = async (bookingId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/bookings/${bookingId}/approve`,
        {},
        authConfig(),
      );

      triggerDataRefresh();
      await fetchOwnerData();
      alert("Booking approved");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve booking");
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/bookings/${bookingId}/reject`,
        {},
        authConfig(),
      );

      triggerDataRefresh();
      await fetchOwnerData();
      alert("Booking rejected");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject booking");
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
      status === "maintenance" ||
      status === "failed"
    ) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Owner Panel
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-950">
                Owner Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Manage fleet, booking approvals and vehicle status.
              </p>
            </div>

            <button
              onClick={fetchOwnerData}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-10 text-center text-slate-500 shadow-sm">
            Loading owner dashboard...
          </div>
        ) : (
          <>
            <form
              onSubmit={submitVehicle}
              className="mb-8 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-xl"
            >
              <h2 className="text-xl font-black text-slate-950">
                {editingId ? "Edit Vehicle" : "Add Vehicle"}
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <input
                  name="vehicleName"
                  value={form.vehicleName}
                  onChange={handleChange}
                  placeholder="Vehicle name"
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />

                <input
                  name="vehicleNumber"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  placeholder="Vehicle number"
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none"
                />

                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Brand"
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />

                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="Model"
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />

                <input
                  name="modelYear"
                  type="number"
                  value={form.modelYear}
                  onChange={handleChange}
                  placeholder="Model year"
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                >
                  <option value="two-wheeler">Two Wheeler</option>
                  <option value="four-wheeler">Four Wheeler</option>
                </select>

                <select
                  name="fuelType"
                  value={form.fuelType}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="cng">CNG</option>
                </select>

                <select
                  name="transmission"
                  value={form.transmission}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Location"
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />

                <input
                  name="priceDaily"
                  type="number"
                  value={form.priceDaily}
                  onChange={handleChange}
                  placeholder="Daily price"
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />

                <input
                  name="priceWeekly"
                  type="number"
                  value={form.priceWeekly}
                  onChange={handleChange}
                  placeholder="Weekly price"
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />

                <input
                  name="priceMonthly"
                  type="number"
                  value={form.priceMonthly}
                  onChange={handleChange}
                  placeholder="Monthly price"
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />

                <input
                  name="images"
                  value={form.images}
                  onChange={handleChange}
                  placeholder="Image URLs separated by comma"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none md:col-span-3"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  disabled={saving}
                  className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Vehicle"
                      : "Add Vehicle"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className="grid gap-8 xl:grid-cols-2">
              <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-xl">
                <h2 className="text-xl font-black text-slate-950">
                  My Vehicles
                </h2>

                <div className="mt-5 space-y-4">
                  {vehicles.length === 0 ? (
                    <p className="text-sm text-slate-500">No vehicles added.</p>
                  ) : (
                    vehicles.map((vehicle) => (
                      <div
                        key={vehicle._id}
                        className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex justify-between gap-3">
                          <div>
                            <h3 className="font-black text-slate-950">
                              {vehicle.vehicleName}
                            </h3>

                            <p className="text-sm text-slate-500">
                              {vehicle.vehicleNumber} • {vehicle.brand}{" "}
                              {vehicle.model}
                            </p>
                          </div>

                          <span
                            className={`h-fit rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                              vehicle.approvalStatus,
                            )}`}
                          >
                            {vehicle.approvalStatus}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                              vehicle.status,
                            )}`}
                          >
                            {vehicle.status}
                          </span>

                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">
                            ₹{vehicle.priceDaily}/day
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => editVehicle(vehicle)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              updateVehicleStatus(
                                vehicle._id,
                                vehicle.status === "maintenance"
                                  ? "available"
                                  : "maintenance",
                              )
                            }
                            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100"
                          >
                            {vehicle.status === "maintenance"
                              ? "Set Available"
                              : "Set Maintenance"}
                          </button>

                          <button
                            onClick={() => deleteVehicle(vehicle._id)}
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-xl">
                <h2 className="text-xl font-black text-slate-950">
                  Booking Requests
                </h2>

                <div className="mt-5 space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No booking requests.
                    </p>
                  ) : (
                    bookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex justify-between gap-3">
                          <div>
                            <h3 className="font-black text-slate-950">
                              {booking.vehicle?.vehicleName || "Vehicle"}
                            </h3>

                            <p className="text-sm text-slate-500">
                              Customer: {booking.user?.name || "N/A"}
                            </p>
                          </div>

                          <span
                            className={`h-fit rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                              booking.status,
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                          <p>
                            Start:{" "}
                            <b>
                              {new Date(booking.startDate).toLocaleDateString()}
                            </b>
                          </p>

                          <p>
                            End:{" "}
                            <b>
                              {new Date(booking.endDate).toLocaleDateString()}
                            </b>
                          </p>

                          <p>
                            Plan: <b>{booking.rentalPlan}</b>
                          </p>

                          <p>
                            Amount: <b>₹{booking.totalAmount}</b>
                          </p>

                          <p>
                            Payment: <b>{booking.paymentStatus || "unpaid"}</b>
                          </p>
                        </div>

                        {booking.status === "pending" && (
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => approveBooking(booking._id)}
                              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => rejectBooking(booking._id)}
                              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default OwnerDashboard;
