import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import API from "../api/axios";
import VehicleCard from "../components/VehicleCard";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    type: "",
    fuelType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const getVehicles = async () => {
    try {
      setLoading(true);

      const res = await API.get("/vehicles", {
        params: filters,
      });

      setVehicles(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVehicles();
  }, []);

  const changeHandler = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const searchHandler = (e) => {
    e.preventDefault();
    getVehicles();
  };

  return (
    <section className="mx-auto max-w-7xl pt-8">
      <div className="mb-8">
        <h1 className="page-title text-4xl md:text-5xl">
          Available Vehicles
        </h1>
        <p className="page-subtitle mt-3 max-w-2xl">
          Search and book two-wheelers or four-wheelers based on location, fuel,
          type, and price.
        </p>
      </div>

      <form onSubmit={searchHandler} className="glass mb-8 rounded-[2rem] p-5">
        <div className="grid gap-4 md:grid-cols-6">
          <select
            className="input-style"
            name="type"
            value={filters.type}
            onChange={changeHandler}
          >
            <option value="">All Types</option>
            <option value="two-wheeler">Two Wheeler</option>
            <option value="four-wheeler">Four Wheeler</option>
          </select>

          <select
            className="input-style"
            name="fuelType"
            value={filters.fuelType}
            onChange={changeHandler}
          >
            <option value="">All Fuel</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="cng">CNG</option>
          </select>

          <input
            className="input-style"
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={changeHandler}
          />

          <input
            className="input-style"
            type="number"
            name="minPrice"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={changeHandler}
          />

          <input
            className="input-style"
            type="number"
            name="maxPrice"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={changeHandler}
          />

          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Search size={18} /> Search
          </button>
        </div>
      </form>

      {loading ? (
        <div className="glass-soft rounded-3xl p-8 text-center text-slate-600">
          Loading vehicles...
        </div>
      ) : vehicles.length === 0 ? (
        <div className="glass-soft rounded-3xl p-8 text-center text-slate-600">
          No vehicles found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Vehicles;