const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const MaintenanceBlock = require("../models/MaintenanceBlock");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const checkDateOverlap = (startDate, endDate) => {
  return {
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  };
};

const calculateTotalAmount = (vehicle, rentalPlan, startDate, endDate) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((endDate - startDate) / msPerDay);

  if (days <= 0) {
    return 0;
  }

  if (rentalPlan === "weekly") {
    return Math.ceil(days / 7) * vehicle.priceWeekly;
  }

  if (rentalPlan === "monthly") {
    return Math.ceil(days / 30) * vehicle.priceMonthly;
  }

  return days * vehicle.priceDaily;
};

const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, rentalPlan } = req.body;

    if (!vehicleId || !startDate || !endDate || !rentalPlan) {
      return res.status(400).json({
        message: "Vehicle, start date, end date and rental plan are required",
      });
    }

    if (!isValidObjectId(vehicleId)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid date selected",
      });
    }

    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    if (!["daily", "weekly", "monthly"].includes(rentalPlan)) {
      return res.status(400).json({
        message: "Invalid rental plan",
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    if (vehicle.status !== "available") {
      return res.status(400).json({
        message: "Vehicle is not available right now",
      });
    }

    if (vehicle.approvalStatus !== "approved") {
      return res.status(400).json({
        message: "Vehicle is not approved by admin yet",
      });
    }

    const existingBooking = await Booking.findOne({
      vehicle: vehicle._id,
      status: { $in: ["pending", "approved"] },
      ...checkDateOverlap(parsedStartDate, parsedEndDate),
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "Vehicle is already booked for selected dates",
      });
    }

    const maintenanceBlock = await MaintenanceBlock.findOne({
      vehicle: vehicle._id,
      status: "active",
      ...checkDateOverlap(parsedStartDate, parsedEndDate),
    });

    if (maintenanceBlock) {
      return res.status(409).json({
        message: "Vehicle is blocked for maintenance during selected dates",
      });
    }

    const totalAmount = calculateTotalAmount(
      vehicle,
      rentalPlan,
      parsedStartDate,
      parsedEndDate,
    );

    if (totalAmount <= 0) {
      return res.status(400).json({
        message: "Invalid booking amount",
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      owner: vehicle.owner,
      vehicle: vehicle._id,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      rentalPlan,
      totalAmount,
      status: "pending",
      paymentStatus: "unpaid",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("vehicle")
      .populate("user", "name email phone")
      .populate("owner", "name email phone");

    return res.status(201).json({
      message: "Booking request sent successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);
    return res.status(500).json({
      message: "Failed to create booking",
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("vehicle")
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("GET MY BOOKINGS ERROR:", error);
    return res.status(500).json({
      message: "Failed to load bookings",
    });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const query = {};

    if (req.user.role === "admin") {
      // Admin can see all owner bookings
    } else {
      query.owner = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate("vehicle")
      .populate("user", "name email phone")
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("GET OWNER BOOKINGS ERROR:", error);
    return res.status(500).json({
      message: "Failed to load owner bookings",
    });
  }
};

const approveBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id).populate("vehicle");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      booking.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to approve this booking",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        message: "Only pending bookings can be approved",
      });
    }

    const approvedConflict = await Booking.findOne({
      _id: { $ne: booking._id },
      vehicle: booking.vehicle._id,
      status: "approved",
      ...checkDateOverlap(booking.startDate, booking.endDate),
    });

    if (approvedConflict) {
      return res.status(409).json({
        message: "Another approved booking already exists for these dates",
      });
    }

    const maintenanceBlock = await MaintenanceBlock.findOne({
      vehicle: booking.vehicle._id,
      status: "active",
      ...checkDateOverlap(booking.startDate, booking.endDate),
    });

    if (maintenanceBlock) {
      return res.status(409).json({
        message: "Vehicle is under maintenance for selected dates",
      });
    }

    booking.status = "approved";
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("vehicle")
      .populate("user", "name email phone")
      .populate("owner", "name email phone");

    return res.status(200).json({
      message: "Booking approved successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("APPROVE BOOKING ERROR:", error);
    return res.status(500).json({
      message: "Failed to approve booking",
    });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      booking.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to reject this booking",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        message: "Only pending bookings can be rejected",
      });
    }

    booking.status = "rejected";
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("vehicle")
      .populate("user", "name email phone")
      .populate("owner", "name email phone");

    return res.status(200).json({
      message: "Booking rejected successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("REJECT BOOKING ERROR:", error);
    return res.status(500).json({
      message: "Failed to reject booking",
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to cancel this booking",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Completed booking cannot be cancelled",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Paid booking cannot be cancelled from here",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("vehicle")
      .populate("user", "name email phone")
      .populate("owner", "name email phone");

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);
    return res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
  cancelBooking,
};
