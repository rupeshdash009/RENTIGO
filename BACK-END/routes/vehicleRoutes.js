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

router.get("/", getVehicles);

router.get(
  "/owner/my-vehicles",
  protect,
  authorize("owner", "admin"),
  getOwnerVehicles,
);

router.post("/", protect, authorize("owner", "admin"), createVehicle);

router.put(
  "/:id/status",
  protect,
  authorize("owner", "admin"),
  updateVehicleStatus,
);

router.put("/:id", protect, authorize("owner", "admin"), updateVehicle);

router.delete("/:id", protect, authorize("owner", "admin"), deleteVehicle);

router.get("/:id", getVehicleById);

module.exports = router;
