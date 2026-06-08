import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Car, Fuel, MapPin, Bike, IndianRupee } from "lucide-react";

function VehicleCard({
  vehicle,
  isOwnerView = false,
  onUpdateStatus,
  onDelete,
}) {
  const vehicleId = vehicle?._id || vehicle?.id;
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = Array.isArray(vehicle?.images)
    ? vehicle.images.find(Boolean)
    : vehicle?.images;

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const statusColors = {
    available: "bg-emerald-50 text-emerald-700",
    maintenance: "bg-yellow-50 text-yellow-700",
    inactive: "bg-red-50 text-red-700",
  };

  const statusClass = statusColors[vehicle?.status] ?? "bg-red-50 text-red-700";
  const fallbackIcon =
    vehicle?.type === "two-wheeler" ? (
      <Bike size={72} className="text-blue-600" />
    ) : (
      <Car size={72} className="text-purple-600" />
    );

  return (
    <div className="glass-soft group overflow-hidden rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-xl">
      {/* Vehicle image / icon */}
      <div className="mb-5 flex h-44 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50">
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={vehicle?.vehicleName || "Vehicle"}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          fallbackIcon
        )}
      </div>

      {/* Name, meta, status badge */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-950">
            {vehicle?.vehicleName || "Vehicle"}
          </h3>
          <p className="text-sm text-slate-500">
            {vehicle?.brand || "Brand"} {vehicle?.model || ""}{" "}
            {vehicle?.modelYear ? `• ${vehicle.modelYear}` : ""}
          </p>
          {/* Vehicle number visible in owner view */}
          {isOwnerView && vehicle?.vehicleNumber && (
            <p className="mt-0.5 text-sm text-slate-400">
              {vehicle.vehicleNumber}
            </p>
          )}
        </div>

        <span className={`badge h-fit ${statusClass}`}>
          {vehicle?.status || "available"}
        </span>
      </div>

      {/* Details */}
      <div className="mb-5 space-y-3 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <MapPin size={17} className="text-blue-600" />
          {vehicle?.location || "Location not added"}
        </p>

        <p className="flex items-center gap-2 capitalize">
          <Fuel size={17} className="text-purple-600" />
          {vehicle?.fuelType || "fuel"} • {vehicle?.transmission || "manual"}
        </p>

        <p className="flex items-center gap-2">
          <IndianRupee size={17} className="text-emerald-600" />
          <span className="font-bold text-slate-950">
            {vehicle?.priceDaily || 0}
          </span>
          <span>/ day</span>
        </p>
      </div>

      {/* Approval status (owner view only) */}
      {isOwnerView && (
        <div className="mb-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          <p>
            Approval:{" "}
            <span className="font-bold capitalize">
              {vehicle?.approvalStatus || "pending"}
            </span>
          </p>
          {vehicle?.rejectionReason && (
            <p className="mt-1 text-red-600">
              Reason: {vehicle.rejectionReason}
            </p>
          )}
        </div>
      )}

      {/* Owner management controls */}
      {isOwnerView ? (
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
            onClick={() => onUpdateStatus?.(vehicleId, "available")}
          >
            Available
          </button>
          <button
            className="rounded-2xl bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700 transition hover:bg-yellow-100"
            onClick={() => onUpdateStatus?.(vehicleId, "maintenance")}
          >
            Maintenance
          </button>
          <button
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            onClick={() => onUpdateStatus?.(vehicleId, "inactive")}
          >
            Inactive
          </button>
          <button
            className="rounded-2xl bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
            onClick={() => onDelete?.(vehicleId)}
          >
            Delete
          </button>
        </div>
      ) : vehicleId ? (
        <Link
          to={`/vehicles/${vehicleId}`}
          className="btn-primary block text-center"
        >
          View Details
        </Link>
      ) : (
        <button disabled className="btn-secondary w-full opacity-60">
          Invalid Vehicle
        </button>
      )}
    </div>
  );
}

export default VehicleCard;
