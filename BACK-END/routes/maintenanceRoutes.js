const express = require("express");

const {
  createMaintenanceBlock,
  getOwnerMaintenanceBlocks,
  cancelMaintenanceBlock,
} = require("../controllers/maintenanceController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("owner", "admin"), createMaintenanceBlock);

router.get(
  "/owner",
  protect,
  authorize("owner", "admin"),
  getOwnerMaintenanceBlocks,
);

router.put(
  "/:id/cancel",
  protect,
  authorize("owner", "admin"),
  cancelMaintenanceBlock,
);

module.exports = router;
