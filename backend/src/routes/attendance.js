const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const {
  getAttendance,
  getStudentsAttendance,
  getAttendanceBySubject,
} = require("../controllers/attendanceController");

// All routes require authentication
router.use(authMiddleware);

// GET /api/attendance/:studentId - Get student's attendance
router.get("/:studentId", getAttendance);

// GET /api/attendance/:studentId/subjects - Get attendance by subject
router.get("/:studentId/subjects", getAttendanceBySubject);

// GET /api/attendance/counsellor/students - Get all assigned students' attendance
router.get(
  "/counsellor/students",
  rbacMiddleware("counsellor", "admin"),
  getStudentsAttendance
);

module.exports = router;
