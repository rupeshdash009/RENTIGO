const Vehicle = require("../models/vehicle");

// Add vehicle
const addVehicle = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      vehicleType,
      fuelType,
      transmission,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      location,
      image,
    } = req.body;

    if (
      !name ||
      !brand ||
      !model ||
      !vehicleType ||
      !fuelType ||
      !pricePerDay ||
      !pricePerWeek ||
      !pricePerMonth ||
      !location
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const vehicle = await Vehicle.create({
      name,
      brand,
      model,
      vehicleType,
      fuelType,
      transmission,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      location,
      image,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Vehicle creation failed",
      error: error.message,
    });
  }
};

// Get all vehicles
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Vehicles fetched successfully",
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Vehicles fetch failed",
      error: error.message,
    });
  }
  const filter = {
    status: "available",
    approvalStatus: "approved",
  };
};

// Get single vehicle
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "owner",
      "name email role",
    );

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      message: "Vehicle fetched successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Vehicle fetch failed",
      error: error.message,
    });
  }
};

module.exports = {
  addVehicle,
  getVehicles,
  getVehicleById,
};
