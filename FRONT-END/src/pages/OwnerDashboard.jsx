import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarCheck,
  Car,
  CheckCircle2,
  IndianRupee,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Wand2,
  XCircle,
} from "lucide-react";
import API from "../api/axios";

const emptyVehicleForm = {
  vehicleName: "",
  vehicleNumber: "",
  brand: "",
  model: "",
  variant: "",
  modelYear: "",
  type: "two-wheeler",
  bodyType: "",
  fuelType: "petrol",
  transmission: "manual",
  priceDaily: "",
  priceWeekly: "",
  priceMonthly: "",
  depositAmount: "",
  location: "",
  description: "",
  imageUrl: "",
  status: "available",
};

const vehiclePresets = [
  {
    vehicleName: "Honda Activa 6G",
    brand: "Honda",
    model: "Activa",
    variant: "6G",
    type: "two-wheeler",
    bodyType: "Scooter",
    fuelType: "petrol",
    transmission: "automatic",
    priceDaily: 450,
    imageUrl:
      "https://images.pexels.com/photos/2798304/pexels-photo-2798304.jpeg",
    specs: {
      engineCC: 110,
      mileageKmpl: 45,
      seatingCapacity: 2,
      features: ["Easy ride", "Good mileage", "City friendly"],
    },
  },
  {
    vehicleName: "TVS Jupiter",
    brand: "TVS",
    model: "Jupiter",
    variant: "ZX",
    type: "two-wheeler",
    bodyType: "Scooter",
    fuelType: "petrol",
    transmission: "automatic",
    priceDaily: 430,
    imageUrl:
      "https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg",
    specs: {
      engineCC: 110,
      mileageKmpl: 48,
      seatingCapacity: 2,
      features: ["Smooth ride", "Family scooter", "Fuel efficient"],
    },
  },
  {
    vehicleName: "Ola S1 Pro",
    brand: "Ola",
    model: "S1",
    variant: "Pro",
    type: "two-wheeler",
    bodyType: "Electric Scooter",
    fuelType: "electric",
    transmission: "automatic",
    priceDaily: 650,
    imageUrl:
      "https://images.pexels.com/photos/163407/scooter-vespa-vehicle-motorcycle-163407.jpeg",
    specs: {
      batteryRangeKm: 150,
      seatingCapacity: 2,
      features: ["Electric", "Smart display", "Low running cost"],
    },
  },
  {
    vehicleName: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    model: "Classic",
    variant: "350",
    type: "two-wheeler",
    bodyType: "Bike",
    fuelType: "petrol",
    transmission: "manual",
    priceDaily: 950,
    imageUrl:
      "https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg",
    specs: {
      engineCC: 350,
      mileageKmpl: 35,
      seatingCapacity: 2,
      features: ["Cruiser", "Powerful engine", "Premium ride"],
    },
  },
  {
    vehicleName: "Maruti Suzuki Swift",
    brand: "Maruti Suzuki",
    model: "Swift",
    variant: "ZXI",
    type: "four-wheeler",
    bodyType: "Hatchback",
    fuelType: "petrol",
    transmission: "manual",
    priceDaily: 1800,
    imageUrl:
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
    specs: {
      engineCC: 1197,
      mileageKmpl: 22,
      seatingCapacity: 5,
      features: ["Compact", "AC", "Music system"],
    },
  },
  {
    vehicleName: "Hyundai Creta",
    brand: "Hyundai",
    model: "Creta",
    variant: "SX",
    type: "four-wheeler",
    bodyType: "SUV",
    fuelType: "diesel",
    transmission: "manual",
    priceDaily: 3200,
    imageUrl:
      "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
    specs: {
      engineCC: 1497,
      mileageKmpl: 18,
      seatingCapacity: 5,
      features: ["SUV", "AC", "Touchscreen", "Spacious"],
    },
  },
  {
    vehicleName: "Kia Seltos",
    brand: "Kia",
    model: "Seltos",
    variant: "HTX",
    type: "four-wheeler",
    bodyType: "SUV",
    fuelType: "petrol",
    transmission: "automatic",
    priceDaily: 3400,
    imageUrl:
      "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg",
    specs: {
      engineCC: 1497,
      mileageKmpl: 17,
      seatingCapacity: 5,
      features: ["Automatic", "Premium cabin", "SUV"],
    },
  },
  {
    vehicleName: "Toyota Fortuner",
    brand: "Toyota",
    model: "Fortuner",
    variant: "Legender",
    type: "four-wheeler",
    bodyType: "SUV",
    fuelType: "diesel",
    transmission: "automatic",
    priceDaily: 6500,
    imageUrl:
      "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
    specs: {
      engineCC: 2755,
      mileageKmpl: 12,
      seatingCapacity: 7,
      features: ["Luxury SUV", "7 seater", "Automatic"],
    },
  },
];

const locations = [
  "Bhubaneswar",
  "Cuttack",
  "Puri",
  "Rourkela",
  "Sambalpur",
  "Balasore",
];

const colors = ["White", "Black", "Silver", "Grey", "Blue", "Red"];

const normalizeArray = (data, keys = []) => {
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateVehicleNumber = () => {
  const district = randomNumber(1, 31).toString().padStart(2, "0");
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const first = letters[randomNumber(0, letters.length - 1)];
  const second = letters[randomNumber(0, letters.length - 1)];
  const number = randomNumber(1000, 9999);

  return `OD${district}${first}${second}${number}`;
};

const buildRandomVehicleFromPreset = (preset) => {
  const modelYear = randomNumber(2022, 2026);
  const daily = preset.priceDaily + randomNumber(-150, 250);
  const safeDaily = Math.max(daily, 300);
  const weekly = safeDaily * 6;
  const monthly = safeDaily * 24;
  const location = locations[randomNumber(0, locations.length - 1)];
  const color = colors[randomNumber(0, colors.length - 1)];

  return {
    form: {
      vehicleName: preset.vehicleName,
      vehicleNumber: generateVehicleNumber(),
      brand: preset.brand,
      model: preset.model,
      variant: preset.variant,
      modelYear,
      type: preset.type,
      bodyType: preset.bodyType,
      fuelType: preset.fuelType,
      transmission: preset.transmission,
      priceDaily: safeDaily,
      priceWeekly: weekly,
      priceMonthly: monthly,
      depositAmount: Math.round(safeDaily * 1.5),
      location,
      description: `${preset.vehicleName} ${modelYear} model available in ${location}. Clean, verified and ready for rental.`,
      imageUrl: preset.imageUrl,
      status: "available",
    },
    specs: {
      ...preset.specs,
      color,
    },
  };
};

const formatPrice = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

function OwnerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState(emptyVehicleForm);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState("");
  const [generatedSpecs, setGeneratedSpecs] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [vehiclesRes, bookingsRes] = await Promise.all([
        API.get("/vehicles/owner/my-vehicles"),
        API.get("/bookings/owner/bookings"),
      ]);

      setVehicles(
        normalizeArray(vehiclesRes.data, ["vehicles", "data", "items"]),
      );

      setBookings(
        normalizeArray(bookingsRes.data, ["bookings", "data", "items"]),
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load owner dashboard. Please login again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const handleFocus = () => {
      fetchDashboardData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchDashboardData]);

  const stats = useMemo(() => {
    const pendingBookings = bookings.filter((booking) => {
      const status = booking.status || booking.bookingStatus;
      return status === "pending";
    }).length;

    const approvedBookings = bookings.filter((booking) => {
      const status = booking.status || booking.bookingStatus;
      return status === "approved";
    }).length;

    const availableVehicles = vehicles.filter(
      (vehicle) => vehicle.status === "available",
    ).length;

    return {
      totalVehicles: vehicles.length,
      availableVehicles,
      pendingBookings,
      approvedBookings,
    };
  }, [vehicles, bookings]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyPreset = (preset) => {
    const generated = buildRandomVehicleFromPreset(preset);
    setFormData(generated.form);
    setGeneratedSpecs(generated.specs);
  };

  const handleUseSelected = () => {
    if (selectedPresetIndex === "") {
      setError("Please choose a vehicle variant first.");
      return;
    }

    setError("");
    applyPreset(vehiclePresets[Number(selectedPresetIndex)]);
  };

  const handleRandomGenerate = () => {
    const preset = vehiclePresets[randomNumber(0, vehiclePresets.length - 1)];
    setSelectedPresetIndex("");
    setError("");
    applyPreset(preset);
  };

  const resetForm = () => {
    setFormData(emptyVehicleForm);
    setGeneratedSpecs({});
    setEditingId(null);
    setSelectedPresetIndex("");
  };

  const buildPayload = () => {
    return {
      vehicleName: formData.vehicleName.trim(),
      vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      variant: formData.variant.trim(),
      modelYear: Number(formData.modelYear),
      type: formData.type,
      bodyType: formData.bodyType.trim(),
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      priceDaily: Number(formData.priceDaily),
      priceWeekly: Number(formData.priceWeekly),
      priceMonthly: Number(formData.priceMonthly),
      depositAmount: Number(formData.depositAmount || 0),
      location: formData.location.trim(),
      description: formData.description.trim(),
      images: formData.imageUrl ? [formData.imageUrl.trim()] : [],
      status: formData.status,
      specs: generatedSpecs || {},
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = buildPayload();

      if (editingId) {
        await API.put(`/vehicles/${editingId}`, payload);
        setMessage("Vehicle updated successfully.");
      } else {
        await API.post("/vehicles", payload);
        setMessage("Vehicle added successfully. Waiting for admin approval.");
      }

      resetForm();
      fetchDashboardData();
    } catch (error) {
      setError(error.response?.data?.message || "Vehicle save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingId(vehicle._id);

    setFormData({
      vehicleName: vehicle.vehicleName || "",
      vehicleNumber: vehicle.vehicleNumber || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      variant: vehicle.variant || "",
      modelYear: vehicle.modelYear || "",
      type: vehicle.type || "two-wheeler",
      bodyType: vehicle.bodyType || "",
      fuelType: vehicle.fuelType || "petrol",
      transmission: vehicle.transmission || "manual",
      priceDaily: vehicle.priceDaily || "",
      priceWeekly: vehicle.priceWeekly || "",
      priceMonthly: vehicle.priceMonthly || "",
      depositAmount: vehicle.depositAmount || "",
      location: vehicle.location || "",
      description: vehicle.description || "",
      imageUrl: vehicle.images?.[0] || "",
      status: vehicle.status || "available",
    });

    setGeneratedSpecs(vehicle.specs || {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteVehicle = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?",
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");
      await API.delete(`/vehicles/${id}`);
      setMessage("Vehicle deleted successfully.");
      fetchDashboardData();
    } catch (error) {
      setError(error.response?.data?.message || "Vehicle delete failed.");
    }
  };

  const handleVehicleStatus = async (id, status) => {
    try {
      setError("");
      setMessage("");
      await API.put(`/vehicles/${id}/status`, { status });
      setMessage(`Vehicle marked as ${status}.`);
      fetchDashboardData();
    } catch (error) {
      setError(
        error.response?.data?.message || "Vehicle status update failed.",
      );
    }
  };

  const handleApproveBooking = async (id) => {
    try {
      setError("");
      setMessage("");
      await API.put(`/bookings/${id}/approve`);
      setMessage("Booking approved successfully.");
      fetchDashboardData();
    } catch (error) {
      setError(error.response?.data?.message || "Booking approval failed.");
    }
  };

  const handleRejectBooking = async (id) => {
    try {
      setError("");
      setMessage("");
      await API.put(`/bookings/${id}/reject`);
      setMessage("Booking rejected successfully.");
      fetchDashboardData();
    } catch (error) {
      setError(error.response?.data?.message || "Booking rejection failed.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-8 text-center">
            <RefreshCw className="mx-auto mb-3 animate-spin text-blue-300" />
            <p className="font-bold text-slate-300">
              Loading owner dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">
                Owner Panel
              </p>
              <h1 className="mt-3 text-3xl font-black text-white">
                Owner Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Add vehicles, generate realistic data, and manage bookings.
              </p>
            </div>

            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-700"
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>
        </section>

        {(error || message) && (
          <section
            className={`rounded-2xl border px-5 py-4 text-sm font-bold ${
              error
                ? "border-red-900/60 bg-red-950/50 text-red-300"
                : "border-emerald-900/60 bg-emerald-950/50 text-emerald-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              {error || message}
            </div>
          </section>
        )}

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Vehicles",
              value: stats.totalVehicles,
              icon: <Car size={22} />,
            },
            {
              label: "Available",
              value: stats.availableVehicles,
              icon: <CheckCircle2 size={22} />,
            },
            {
              label: "Pending Bookings",
              value: stats.pendingBookings,
              icon: <CalendarCheck size={22} />,
            },
            {
              label: "Approved Bookings",
              value: stats.approvedBookings,
              icon: <IndianRupee size={22} />,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                {item.icon}
              </div>
              <p className="text-3xl font-black text-white">{item.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                {item.label}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-white">
              Quick Vehicle Generator
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Choose any vehicle variant or generate a random vehicle. Details
              like year, number, price, location and image will auto-fill.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <select
              value={selectedPresetIndex}
              onChange={(event) => setSelectedPresetIndex(event.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
            >
              <option value="">Choose vehicle variant</option>
              {vehiclePresets.map((preset, index) => (
                <option key={preset.vehicleName} value={index}>
                  {preset.vehicleName}
                </option>
              ))}
            </select>

            <button
              onClick={handleUseSelected}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-slate-800"
            >
              <Plus size={17} />
              Use Selected
            </button>

            <button
              onClick={handleRandomGenerate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4 text-sm font-black text-white transition hover:from-blue-500 hover:to-purple-500"
            >
              <Wand2 size={17} />
              Generate Random
            </button>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black text-white">
                {editingId ? "Edit Vehicle" : "Add Vehicle"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Fill details manually or use the generator above.
              </p>
            </div>

            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-black text-slate-200 transition hover:bg-slate-800"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <input
                name="vehicleName"
                value={formData.vehicleName}
                onChange={handleInputChange}
                placeholder="Vehicle name"
                required
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <input
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                placeholder="Vehicle number"
                required
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold uppercase text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <input
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Brand"
                required
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <input
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="Model"
                required
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <input
                name="variant"
                value={formData.variant}
                onChange={handleInputChange}
                placeholder="Variant"
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <input
                type="number"
                name="modelYear"
                value={formData.modelYear}
                onChange={handleInputChange}
                placeholder="Model year"
                required
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none focus:border-blue-500"
              >
                <option value="two-wheeler">Two Wheeler</option>
                <option value="four-wheeler">Four Wheeler</option>
              </select>

              <input
                name="bodyType"
                value={formData.bodyType}
                onChange={handleInputChange}
                placeholder="Body type"
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none focus:border-blue-500"
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="cng">CNG</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none focus:border-blue-500"
              >
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>

              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Location"
                required
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <input
                type="number"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleInputChange}
                placeholder="Deposit amount"
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <input
                type="number"
                name="priceDaily"
                value={formData.priceDaily}
                onChange={handleInputChange}
                placeholder="Daily price"
                required
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <input
                type="number"
                name="priceWeekly"
                value={formData.priceWeekly}
                onChange={handleInputChange}
                placeholder="Weekly price"
                required
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <input
                type="number"
                name="priceMonthly"
                value={formData.priceMonthly}
                onChange={handleInputChange}
                placeholder="Monthly price"
                required
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none focus:border-blue-500"
              >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>

              <input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="Image URL"
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500 lg:col-span-2"
              />
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Vehicle description"
              rows="4"
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/40 transition hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              <Plus size={18} />
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Vehicle"
                  : "Add Vehicle"}
            </button>
          </form>
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="mb-5 text-2xl font-black text-white">My Vehicles</h2>

          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center text-slate-400">
              No vehicles found. Add your first vehicle above.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950"
                >
                  <img
                    src={
                      vehicle.images?.[0] ||
                      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"
                    }
                    alt={vehicle.vehicleName}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-white">
                          {vehicle.vehicleName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {vehicle.brand} {vehicle.model}
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-950/50 px-3 py-1 text-xs font-black capitalize text-blue-300">
                        {vehicle.approvalStatus || "pending"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-slate-900 p-3">
                        <p className="text-slate-400">Daily</p>
                        <p className="font-black text-white">
                          {formatPrice(vehicle.priceDaily)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-900 p-3">
                        <p className="text-slate-400">Status</p>
                        <p className="font-black capitalize text-white">
                          {vehicle.status}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEditVehicle(vehicle)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-black text-white hover:bg-slate-700"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleVehicleStatus(
                            vehicle._id,
                            vehicle.status === "available"
                              ? "inactive"
                              : "available",
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-950/60 px-4 py-2 text-xs font-black text-blue-300 hover:bg-blue-950"
                      >
                        <RefreshCw size={14} />
                        Toggle
                      </button>

                      <button
                        onClick={() => handleDeleteVehicle(vehicle._id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-950/60 px-4 py-2 text-xs font-black text-red-300 hover:bg-red-950"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="mb-5 text-2xl font-black text-white">
            Booking Requests
          </h2>

          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center text-slate-400">
              No booking requests found.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const status = booking.status || booking.bookingStatus;
                const paymentStatus = booking.paymentStatus || "unpaid";
                const vehicle = booking.vehicle || {};
                const customer = booking.customer || booking.user || {};

                return (
                  <div
                    key={booking._id}
                    className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div>
                        <h3 className="text-lg font-black text-white">
                          {vehicle.vehicleName || "Vehicle"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          Customer: {customer.name || "Customer"} ·{" "}
                          {customer.email || "No email"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-blue-950/50 px-3 py-1 text-xs font-black capitalize text-blue-300">
                            Booking: {status}
                          </span>

                          <span className="rounded-full bg-amber-950/50 px-3 py-1 text-xs font-black capitalize text-amber-300">
                            Payment: {paymentStatus}
                          </span>

                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-black text-slate-300">
                            {formatPrice(
                              booking.totalPrice ||
                                booking.totalAmount ||
                                booking.amount,
                            )}
                          </span>
                        </div>
                      </div>

                      {status === "pending" && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleApproveBooking(booking._id)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-500"
                          >
                            <CheckCircle2 size={17} />
                            Approve
                          </button>

                          <button
                            onClick={() => handleRejectBooking(booking._id)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white hover:bg-red-500"
                          >
                            <XCircle size={17} />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default OwnerDashboard;
