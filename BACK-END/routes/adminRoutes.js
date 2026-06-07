const express = require("express");

const {
  getAllUsers,
  getAllOwners,
  toggleUserStatus,
  getAllVehicles,
  approveVehicle,
  rejectVehicle,
  getAllBookings,
  getAdminAnalytics,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.get("/owners", getAllOwners);
router.put("/users/:id/status", toggleUserStatus);

router.get("/vehicles", getAllVehicles);
router.put("/vehicles/:id/approve", approveVehicle);
router.put("/vehicles/:id/reject", rejectVehicle);

router.get("/bookings", getAllBookings);
router.get("/analytics", getAdminAnalytics);

module.exports = router;
