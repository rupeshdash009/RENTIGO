const express = require("express");

const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("customer", "admin"),
  createBooking
);

router.get(
  "/my-bookings",
  protect,
  authorize("customer", "admin"),
  getMyBookings
);

router.get(
  "/owner",
  protect,
  authorize("agency", "admin"),
  getOwnerBookings
);

router.put(
  "/:id/approve",
  protect,
  authorize("agency", "admin"),
  approveBooking
);

router.put(
  "/:id/reject",
  protect,
  authorize("agency", "admin"),
  rejectBooking
);

module.exports = router;