const express = require("express");

const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Customer creates booking
router.post("/", protect, authorize("customer"), createBooking);

// Customer booking history
router.get("/my-bookings", protect, authorize("customer"), getMyBookings);

// Owner booking requests
router.get(
  "/owner/bookings",
  protect,
  authorize("owner", "admin"),
  getOwnerBookings,
);

// Owner approves booking
router.put(
  "/:id/approve",
  protect,
  authorize("owner", "admin"),
  approveBooking,
);

// Owner rejects booking
router.put("/:id/reject", protect, authorize("owner", "admin"), rejectBooking);

// Customer cancels booking
router.put(
  "/:id/cancel",
  protect,
  authorize("customer", "admin"),
  cancelBooking,
);

module.exports = router;
