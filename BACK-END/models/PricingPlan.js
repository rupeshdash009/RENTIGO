const mongoose = require("mongoose");

const pricingPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      enum: ["two-wheeler", "four-wheeler"],
      required: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    dailyRate: {
      type: Number,
      required: true,
    },

    weeklyRate: {
      type: Number,
      required: true,
    },

    monthlyRate: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.PricingPlan ||
  mongoose.model("PricingPlan", pricingPlanSchema);
