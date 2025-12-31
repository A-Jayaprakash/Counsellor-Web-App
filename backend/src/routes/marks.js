const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getMarks, getMarksSummary } = require("../controllers/marksController");

// All routes require authentication
router.use(authMiddleware);

// GET /api/marks/:studentId - Get student's marks
router.get("/:studentId", getMarks);

// GET /api/marks/:studentId/summary - Get marks summary
router.get("/:studentId/summary", getMarksSummary);

module.exports = router;
