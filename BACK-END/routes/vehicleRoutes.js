const express = require("express");

const {
  addVehicle,
  getVehicles,
  getVehicleById,
} = require("../controllers/vehicleController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getVehicles);
router.get("/:id", getVehicleById);

router.post("/", protect, authorize("agency", "admin"), addVehicle);

module.exports = router;
