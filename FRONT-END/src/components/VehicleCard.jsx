import { Link } from "react-router-dom";
import { Car, Fuel, MapPin, Bike, IndianRupee } from "lucide-react";

function VehicleCard({ vehicle }) {
  return (
    <div className="glass-soft group overflow-hidden rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex h-44 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50">
        {vehicle.type === "two-wheeler" ? (
          <Bike size={72} className="text-blue-600" />
        ) : (
          <Car size={72} className="text-purple-600" />
        )}
      </div>

      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-950">
            {vehicle.vehicleName}
          </h3>
          <p className="text-sm text-slate-500">
            {vehicle.brand} {vehicle.model} • {vehicle.modelYear}
          </p>
        </div>

        <span className="badge bg-emerald-50 text-emerald-700">
          {vehicle.status || "available"}
        </span>
      </div>

      <div className="mb-5 space-y-3 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <MapPin size={17} className="text-blue-600" />
          {vehicle.location}
        </p>

        <p className="flex items-center gap-2 capitalize">
          <Fuel size={17} className="text-purple-600" />
          {vehicle.fuelType} • {vehicle.transmission}
        </p>

        <p className="flex items-center gap-2">
          <IndianRupee size={17} className="text-emerald-600" />
          <span className="font-bold text-slate-950">{vehicle.priceDaily}</span>
          <span>/ day</span>
        </p>
      </div>

      <Link
        to={`/vehicles/${vehicle._id}`}
        className="btn-primary block text-center"
      >
        View Details
      </Link>
    </div>
  );
}

export default VehicleCard;