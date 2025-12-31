require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const redisClient = require("./config/redis");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
