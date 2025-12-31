const express = require("express");
const router = express.Router();
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const OnDutyRequest = require("../models/OnDutyRequest");
const Announcement = require("../models/Announcement");
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");

// Get dashboard stats for students
router.get(
  "/student/stats",
  authMiddleware,
  rbacMiddleware("student"),
  async (req, res) => {
    try {
      // Get student profile
      const profile = await StudentProfile.findOne({ userId: req.user._id });

      // Get OD stats
      const odStats = await OnDutyRequest.aggregate([
        { $match: { studentId: req.user._id } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Get recent announcements
      const announcements = await Announcement.find({
        $or: [{ targetRole: "student" }, { targetRole: "all" }],
        isActive: true,
        $or: [{ expiresAt: { $gte: new Date() } }, { expiresAt: null }],
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("adminId", "firstName lastName");

      // Format OD stats
      const odStatusMap = {
        pending: 0,
        approved: 0,
        rejected: 0,
      };

      odStats.forEach((stat) => {
        odStatusMap[stat._id] = stat.count;
      });

      res.json({
        success: true,
        stats: {
          attendance: {
            percentage: profile?.attendance?.percentage || 0,
            totalClasses: profile?.attendance?.totalClasses || 0,
            attended: profile?.attendance?.classesAttended || 0,
          },
          marks: {
            gpa: profile?.marks?.gpa || 0,
            cgpa: profile?.marks?.cgpa || 0,
            semester: profile?.marks?.semester || 1,
          },
          onDuty: odStatusMap,
        },
        announcements,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Get dashboard stats for counsellors
router.get(
  "/counsellor/stats",
  authMiddleware,
  rbacMiddleware("counsellor"),
  async (req, res) => {
    try {
      // Count assigned students
      const totalStudents = await User.countDocuments({
        counsellorId: req.user._id,
        role: "student",
      });

      // Count pending OD requests
      const pendingOD = await OnDutyRequest.countDocuments({
        counsellorId: req.user._id,
        status: "pending",
      });

      // Get recent OD requests
      const recentODRequests = await OnDutyRequest.find({
        counsellorId: req.user._id,
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("studentId", "firstName lastName email enrollmentNo");

      // Get students with low attendance
      const lowAttendanceStudents = await StudentProfile.find({
        counsellorId: req.user._id,
        "attendance.percentage": { $lt: 75 },
      })
        .populate("userId", "firstName lastName email enrollmentNo")
        .limit(10);

      res.json({
        success: true,
        stats: {
          totalStudents,
          pendingOD,
          lowAttendanceCount: lowAttendanceStudents.length,
        },
        recentODRequests,
        lowAttendanceStudents,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Get dashboard stats for admin
router.get(
  "/admin/stats",
  authMiddleware,
  rbacMiddleware("admin"),
  async (req, res) => {
    try {
      // Count all users by role
      const userStats = await User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]);

      // Count all OD requests by status
      const odStats = await OnDutyRequest.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Count active announcements
      const activeAnnouncements = await Announcement.countDocuments({
        isActive: true,
        $or: [{ expiresAt: { $gte: new Date() } }, { expiresAt: null }],
      });

      // Get recent activity (last 10 OD requests)
      const recentActivity = await OnDutyRequest.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("studentId", "firstName lastName email")
        .populate("counsellorId", "firstName lastName");

      // Format stats
      const userStatsMap = {};
      userStats.forEach((stat) => {
        userStatsMap[stat._id] = stat.count;
      });

      const odStatsMap = {};
      odStats.forEach((stat) => {
        odStatsMap[stat._id] = stat.count;
      });

      res.json({
        success: true,
        stats: {
          users: {
            students: userStatsMap.student || 0,
            counsellors: userStatsMap.counsellor || 0,
            admins: userStatsMap.admin || 0,
            total: Object.values(userStatsMap).reduce((a, b) => a + b, 0),
          },
          onDuty: {
            pending: odStatsMap.pending || 0,
            approved: odStatsMap.approved || 0,
            rejected: odStatsMap.rejected || 0,
            total: Object.values(odStatsMap).reduce((a, b) => a + b, 0),
          },
          announcements: {
            active: activeAnnouncements,
          },
        },
        recentActivity,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Get all announcements for current user
router.get("/announcements", authMiddleware, async (req, res) => {
  try {
    const query = {
      isActive: true,
      $or: [{ expiresAt: { $gte: new Date() } }, { expiresAt: null }],
    };

    // Filter by role
    if (req.user.role !== "admin") {
      query.$or = [{ targetRole: req.user.role }, { targetRole: "all" }];
    }

    const announcements = await Announcement.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .populate("adminId", "firstName lastName")
      .limit(20);

    res.json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
