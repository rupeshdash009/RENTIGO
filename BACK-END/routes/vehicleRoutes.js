const express = require("express");

const {
  createVehicle,
  getVehicles,
  getOwnerVehicles,
  getVehicleById,
  updateVehicle,
  updateVehicleStatus,
  deleteVehicle,
} = require("../controllers/vehicleController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public approved vehicles
router.get("/", getVehicles);

// Owner vehicles - keep before /:id
router.get(
  "/owner/my-vehicles",
  protect,
  authorize("owner", "admin"),
  getOwnerVehicles,
);

// Owner creates vehicle
router.post("/", protect, authorize("owner", "admin"), createVehicle);

// Owner updates vehicle status
router.put(
  "/:id/status",
  protect,
  authorize("owner", "admin"),
  updateVehicleStatus,
);

// Owner updates vehicle
router.put("/:id", protect, authorize("owner", "admin"), updateVehicle);

// Owner deletes vehicle
router.delete("/:id", protect, authorize("owner", "admin"), deleteVehicle);

// Public vehicle details - keep last
router.get("/:id", getVehicleById);

module.exports = router;
