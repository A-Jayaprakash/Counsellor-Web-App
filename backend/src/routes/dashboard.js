const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getAnnouncements,
  getRecentActivities,
} = require("../controllers/dashboardController");

// All routes require authentication
router.use(authMiddleware);

// GET /api/dashboard/stats - Get user-specific dashboard statistics
router.get("/stats", getDashboardStats);

// GET /api/dashboard/announcements - Get recent announcements
router.get("/announcements", getAnnouncements);

// GET /api/dashboard/activities - Get recent activities
router.get("/activities", getRecentActivities);

module.exports = router;
