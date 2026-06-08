const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: "owner" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(owners);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch owners",
      error: error.message,
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: user.isActive ? "User activated" : "User deactivated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vehicles",
      error: error.message,
    });
  }
};

const approveVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    vehicle.approvalStatus = "approved";
    vehicle.rejectionReason = "";
    await vehicle.save();

    res.status(200).json({
      message: "Vehicle approved successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Vehicle approval failed",
      error: error.message,
    });
  }
};

const rejectVehicle = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    vehicle.approvalStatus = "rejected";
    vehicle.rejectionReason = rejectionReason || "Rejected by admin";
    await vehicle.save();

    res.status(200).json({
      message: "Vehicle rejected successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Vehicle rejection failed",
      error: error.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("owner", "name email")
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalOwners = await User.countDocuments({ role: "owner" });
    const totalVehicles = await Vehicle.countDocuments();
    const approvedVehicles = await Vehicle.countDocuments({
      approvalStatus: "approved",
    });
    const pendingVehicles = await Vehicle.countDocuments({
      approvalStatus: "pending",
    });
    const rejectedVehicles = await Vehicle.countDocuments({
      approvalStatus: "rejected",
    });

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const approvedBookings = await Booking.countDocuments({
      status: "approved",
    });
    const rejectedBookings = await Booking.countDocuments({
      status: "rejected",
    });
    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });

    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["approved", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const bookingConversionRate =
      totalBookings > 0
        ? Math.round((approvedBookings / totalBookings) * 100)
        : 0;

    const vehicleUtilizationRate =
      totalVehicles > 0
        ? Math.round((approvedBookings / totalVehicles) * 100)
        : 0;

    res.status(200).json({
      totalUsers,
      totalOwners,
      totalVehicles,
      approvedVehicles,
      pendingVehicles,
      rejectedVehicles,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      completedBookings,
      totalRevenue,
      bookingConversionRate,
      vehicleUtilizationRate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getAllOwners,
  toggleUserStatus,
  getAllVehicles,
  approveVehicle,
  rejectVehicle,
  getAllBookings,
  getAdminAnalytics,
};
