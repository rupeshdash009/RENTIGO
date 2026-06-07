const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");

const createVehicle = async (req, res) => {
  try {
    const {
      vehicleName,
      vehicleNumber,
      brand,
      model,
      modelYear,
      type,
      fuelType,
      transmission,
      priceDaily,
      priceWeekly,
      priceMonthly,
      location,
      images,
    } = req.body;

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      vehicleName,
      vehicleNumber,
      brand,
      model,
      modelYear,
      type,
      fuelType,
      transmission,
      priceDaily,
      priceWeekly,
      priceMonthly,
      location,
      images: images || [],
      status: "available",
      approvalStatus: "pending",
    });

    res.status(201).json({
      message: "Vehicle added successfully. Waiting for admin approval.",
      vehicle,
    });
  } catch (error) {
    console.error("CREATE VEHICLE ERROR:", error);
    res.status(500).json({
      message: "Vehicle creation failed",
      error: error.message,
    });
  }
};

const getVehicles = async (req, res) => {
  try {
    const { type, fuelType, location, minPrice, maxPrice } = req.query;

    const filter = {
      status: "available",
      approvalStatus: "approved",
    };

    if (type) filter.type = type;
    if (fuelType) filter.fuelType = fuelType;
    if (location) filter.location = { $regex: location, $options: "i" };

    if (minPrice || maxPrice) {
      filter.priceDaily = {};
      if (minPrice) filter.priceDaily.$gte = Number(minPrice);
      if (maxPrice) filter.priceDaily.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("GET VEHICLES ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch vehicles",
      error: error.message,
    });
  }
};

const getOwnerVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("GET OWNER VEHICLES ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch owner vehicles",
      error: error.message,
    });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    const vehicle = await Vehicle.findById(vehicleId).populate(
      "owner",
      "name email",
    );

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error("GET VEHICLE BY ID ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch vehicle",
      error: error.message,
    });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    if (
      vehicle.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not allowed to update this vehicle",
      });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error("UPDATE VEHICLE ERROR:", error);
    res.status(500).json({
      message: "Vehicle update failed",
      error: error.message,
    });
  }
};

const updateVehicleStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["available", "maintenance", "inactive"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid vehicle status",
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    if (
      vehicle.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not allowed to update this vehicle status",
      });
    }

    vehicle.status = status;
    await vehicle.save();

    res.status(200).json({
      message: "Vehicle status updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error("UPDATE VEHICLE STATUS ERROR:", error);
    res.status(500).json({
      message: "Vehicle status update failed",
      error: error.message,
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    if (
      vehicle.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not allowed to delete this vehicle",
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("DELETE VEHICLE ERROR:", error);
    res.status(500).json({
      message: "Vehicle delete failed",
      error: error.message,
    });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getOwnerVehicles,
  getVehicleById,
  updateVehicle,
  updateVehicleStatus,
  deleteVehicle,
};
