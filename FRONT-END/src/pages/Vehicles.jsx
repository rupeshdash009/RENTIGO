import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import useAutoRefresh from "../hooks/useAutoRefresh";
import VehicleCard from "../components/VehicleCard";

const API_BASE_URL = "https://rento-backend-gmlw.onrender.com/api";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    type: "",
    fuelType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchVehicles = useCallback(async () => {
    try {
      setMessage("");

      const params = {};

      if (filters.type) params.type = filters.type;
      if (filters.fuelType) params.fuelType = filters.fuelType;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await axios.get(`${API_BASE_URL}/vehicles`, {
        params,
      });

      const data = Array.isArray(res.data) ? res.data : res.data.vehicles || [];

      setVehicles(data);
    } catch (error) {
      console.error("VEHICLES LOAD ERROR:", error);
      setMessage(error.response?.data?.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useAutoRefresh(fetchVehicles, 30000);

  const locations = useMemo(() => {
    return [...new Set(vehicles.map((v) => v.location).filter(Boolean))];
  }, [vehicles]);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      fuelType: "",
      location: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                RentiGo Fleet
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
                Find your ride
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Browse available two-wheelers and four-wheelers with real-time
                availability and pricing.
              </p>
            </div>

            <button
              onClick={fetchVehicles}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-5">
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="">All types</option>
              <option value="two-wheeler">Two Wheeler</option>
              <option value="four-wheeler">Four Wheeler</option>
            </select>

            <select
              name="fuelType"
              value={filters.fuelType}
              onChange={handleChange}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="">All fuel</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="cng">CNG</option>
            </select>

            <select
              name="location"
              value={filters.location}
              onChange={handleChange}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <input
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min daily price"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />

            <input
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max daily price"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {vehicles.length}
              </span>{" "}
              vehicles
            </p>

            <button
              onClick={resetFilters}
              className="text-sm font-bold text-slate-600 hover:text-slate-950"
            >
              Reset filters
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
            Loading vehicles...
          </div>
        ) : vehicles.length === 0 ? (
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-10 text-center shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              No vehicles found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing filters or refresh again.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Vehicles;
