const MaintenanceBlock = require("../models/MaintenanceBlock");
const Vehicle = require("../models/Vehicle");

const createMaintenanceBlock = async (req, res) => {
  try {
    const { vehicleId, reason, startDate, endDate } = req.body;

    if (!vehicleId || !reason || !startDate || !endDate) {
      return res.status(400).json({
        message: "Vehicle, reason, start date and end date are required",
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);

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
        message: "Not allowed to block this vehicle",
      });
    }

    const block = await MaintenanceBlock.create({
      vehicle: vehicle._id,
      owner: vehicle.owner,
      reason,
      startDate,
      endDate,
      status: "active",
    });

    vehicle.status = "maintenance";
    await vehicle.save();

    res.status(201).json({
      message: "Vehicle blocked for maintenance",
      block,
    });
  } catch (error) {
    console.error("CREATE MAINTENANCE ERROR:", error);
    res.status(500).json({
      message: "Maintenance block failed",
      error: error.message,
    });
  }
};

const getOwnerMaintenanceBlocks = async (req, res) => {
  try {
    const blocks = await MaintenanceBlock.find({
      owner: req.user._id,
    })
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.status(200).json(blocks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch maintenance blocks",
      error: error.message,
    });
  }
};

const cancelMaintenanceBlock = async (req, res) => {
  try {
    const block = await MaintenanceBlock.findById(req.params.id);

    if (!block) {
      return res.status(404).json({
        message: "Maintenance block not found",
      });
    }

    if (
      block.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not allowed to cancel this block",
      });
    }

    block.status = "cancelled";
    await block.save();

    const vehicle = await Vehicle.findById(block.vehicle);
    if (vehicle) {
      vehicle.status = "available";
      await vehicle.save();
    }

    res.status(200).json({
      message: "Maintenance block cancelled",
      block,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel maintenance block",
      error: error.message,
    });
  }
};

module.exports = {
  createMaintenanceBlock,
  getOwnerMaintenanceBlocks,
  cancelMaintenanceBlock,
};
