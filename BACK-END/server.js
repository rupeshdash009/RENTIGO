const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const { paymentWebhook } = require("./controllers/paymentController");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://rento-smart.vercel.app",
  "https://rento-bay-ten.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 80,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhook,
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("RentiGo API is running");
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/payments", paymentRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
