import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Bike,
  CalendarDays,
  Car,
  Fuel,
  IndianRupee,
  MapPin,
  Settings,
} from "lucide-react";
import API from "../api/axios";

function VehicleDetails() {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    rentalPlan: "daily",
  });

  const getVehicle = async () => {
    try {
      const res = await API.get(`/vehicles/${id}`);
      setVehicle(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "Vehicle load failed");
    }
  };

  useEffect(() => {
    getVehicle();
  }, [id]);

  const changeHandler = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const bookingHandler = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await API.post("/bookings", {
        vehicleId: id,
        ...bookingData,
      });

      setMessage(res.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Booking failed");
    }
  };

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-7xl pt-10">
        <div className="glass-soft rounded-3xl p-8 text-center text-slate-600">
          Loading vehicle...
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl pt-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass rounded-[2rem] p-6">
          <div className="mb-6 flex h-80 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-50 to-purple-50">
            {vehicle.type === "two-wheeler" ? (
              <Bike size={120} className="text-blue-600" />
            ) : (
              <Car size={120} className="text-purple-600" />
            )}
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div>
              <h1 className="text-4xl font-black text-slate-950">
                {vehicle.vehicleName}
              </h1>
              <p className="mt-2 text-slate-500">
                {vehicle.brand} {vehicle.model} • {vehicle.modelYear}
              </p>
            </div>

            <span className="badge h-fit bg-emerald-50 text-emerald-700">
              {vehicle.status}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info icon={<MapPin />} label="Location" value={vehicle.location} />
            <Info icon={<Fuel />} label="Fuel Type" value={vehicle.fuelType} />
            <Info
              icon={<Settings />}
              label="Transmission"
              value={vehicle.transmission}
            />
            <Info icon={<Car />} label="Vehicle Type" value={vehicle.type} />
          </div>

          <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xl font-black text-slate-950">
              Pricing Plans
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <Price title="Daily" price={vehicle.priceDaily} />
              <Price title="Weekly" price={vehicle.priceWeekly} />
              <Price title="Monthly" price={vehicle.priceMonthly} />
            </div>
          </div>
        </div>

        <div className="glass h-fit rounded-[2rem] p-6">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <CalendarDays />
          </div>

          <h2 className="text-3xl font-black text-slate-950">Book Vehicle</h2>
          <p className="mt-2 text-slate-500">
            Select date range and rental plan. Owner will approve your request.
          </p>

          {message && (
            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={bookingHandler} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Start Date
              </label>
              <input
                className="input-style"
                type="date"
                name="startDate"
                value={bookingData.startDate}
                onChange={changeHandler}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                End Date
              </label>
              <input
                className="input-style"
                type="date"
                name="endDate"
                value={bookingData.endDate}
                onChange={changeHandler}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Rental Plan
              </label>
              <select
                className="input-style"
                name="rentalPlan"
                value={bookingData.rentalPlan}
                onChange={changeHandler}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <button className="btn-primary w-full" type="submit">
              Send Booking Request
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="mb-3 text-blue-600">{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-bold capitalize text-slate-950">{value}</p>
    </div>
  );
}

function Price({ title, price }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 flex items-center text-2xl font-black text-slate-950">
        <IndianRupee size={20} />
        {price}
      </p>
    </div>
  );
}

export default VehicleDetails;