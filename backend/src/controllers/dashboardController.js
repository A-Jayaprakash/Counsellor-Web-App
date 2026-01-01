const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const OnDutyRequest = require("../models/OnDutyRequest");
const Announcement = require("../models/Announcement");
const cacheService = require("../services/cacheService");

// Cache TTL constants (in seconds)
const DASHBOARD_STATS_TTL = 5 * 60; // 5 minutes
const ANNOUNCEMENTS_TTL = 10 * 60; // 10 minutes

// Get dashboard stats for current user
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const cacheKey = `dashboard:stats:${userId}:${userRole}`;

    // Try to get from cache
    const cachedStats = await cacheService.get(cacheKey);
    if (cachedStats) {
      return res.json({
        success: true,
        stats: cachedStats,
        cached: true,
      });
    }

    let stats = {};

    if (userRole === "student") {
      // Student dashboard stats - parallel queries
      const [profile, pendingODs, approvedODs] = await Promise.all([
        StudentProfile.findOne({ userId }),
        OnDutyRequest.countDocuments({
          studentId: userId,
          status: "pending",
        }),
        OnDutyRequest.countDocuments({
          studentId: userId,
          status: "approved",
        }),
      ]);

      stats = {
        attendance: profile?.attendance?.percentage || 0,
        totalClasses: profile?.attendance?.totalClasses || 0,
        classesAttended: profile?.attendance?.classesAttended || 0,
        gpa: profile?.marks?.gpa || 0,
        cgpa: profile?.marks?.cgpa || 0,
        pendingODs,
        approvedODs,
        semester: profile?.marks?.semester || 1,
      };
    } else if (userRole === "counsellor") {
      // Counsellor dashboard stats - parallel queries
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [assignedStudents, pendingODs, todayODs, totalODs] =
        await Promise.all([
          User.countDocuments({
            counsellorId: userId,
            role: "student",
          }),
          OnDutyRequest.countDocuments({
            counsellorId: userId,
            status: "pending",
          }),
          OnDutyRequest.countDocuments({
            counsellorId: userId,
            createdAt: { $gte: todayStart },
          }),
          OnDutyRequest.countDocuments({ counsellorId: userId }),
        ]);

      stats = {
        assignedStudents,
        pendingODs,
        todayODs,
        totalODs,
      };
    } else if (userRole === "admin") {
      // Admin dashboard stats - parallel queries
      const [totalUsers, totalStudents, totalCounsellors, totalAnnouncements] =
        await Promise.all([
          User.countDocuments(),
          User.countDocuments({ role: "student" }),
          User.countDocuments({
            role: "counsellor",
          }),
          Announcement.countDocuments({
            isActive: true,
          }),
        ]);

      stats = {
        totalUsers,
        totalStudents,
        totalCounsellors,
        totalAnnouncements,
      };
    }

    // Cache the stats
    await cacheService.set(cacheKey, stats, DASHBOARD_STATS_TTL);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get recent announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const userRole = req.user.role;
    const limit = parseInt(req.query.limit) || 10;
    const cacheKey = `dashboard:announcements:${userRole}:${limit}`;

    // Try to get from cache (use !== null to handle empty arrays correctly)
    const cachedAnnouncements = await cacheService.get(cacheKey);
    if (cachedAnnouncements !== null) {
      return res.json({
        success: true,
        count: cachedAnnouncements.length,
        announcements: cachedAnnouncements,
        cached: true,
      });
    }

    const query = {
      isActive: true,
      $and: [
        {
          $or: [{ targetRole: "all" }, { targetRole: userRole }],
        },
        {
          $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }],
        },
      ],
    };

    const announcements = await Announcement.find(query)
      .populate("adminId", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit);

    // Cache the announcements
    await cacheService.set(cacheKey, announcements, ANNOUNCEMENTS_TTL);

    res.json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("Get Announcements Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get recent activities
exports.getRecentActivities = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const limit = parseInt(req.query.limit) || 10;

    let activities = [];

    if (userRole === "student") {
      const recentODs = await OnDutyRequest.find({ studentId: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("status reason createdAt");

      activities = recentODs.map((od) => ({
        type: "OD_REQUEST",
        status: od.status,
        description: od.reason.substring(0, 50) + "...",
        date: od.createdAt,
      }));
    } else if (userRole === "counsellor") {
      const recentODs = await OnDutyRequest.find({ counsellorId: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("studentId", "firstName lastName");

      activities = recentODs.map((od) => ({
        type: "OD_REQUEST",
        status: od.status,
        student: `${od.studentId.firstName} ${od.studentId.lastName}`,
        description: od.reason.substring(0, 50) + "...",
        date: od.createdAt,
      }));
    }

    res.json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("Recent Activities Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
