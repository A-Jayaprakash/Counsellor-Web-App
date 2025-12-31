require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const redisClient = require("./config/redis");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const dashboardRoutes = require("./routes/dashboard");
const odRequestRoutes = require("./routes/odRequest");
const adminRoutes = require("./routes/admin");
const attendanceRoutes = require("./routes/attendance");
const marksRoutes = require("./routes/marks");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/od-requests", odRequestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    message: "ACMS Backend API",
    status: "Running",
    timestamp: new Date(),
  });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await redisClient.ping();
    res.json({
      status: "healthy",
      mongodb: "connected",
      redis: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
