const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const OnDutyRequest = require("../models/OnDutyRequest");
const Announcement = require("../models/Announcement");

// Get dashboard stats for current user
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === "student") {
      // Student dashboard stats
      const profile = await StudentProfile.findOne({ userId });
      const pendingODs = await OnDutyRequest.countDocuments({
        studentId: userId,
        status: "pending",
      });
      const approvedODs = await OnDutyRequest.countDocuments({
        studentId: userId,
        status: "approved",
      });

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
      // Counsellor dashboard stats
      const assignedStudents = await User.countDocuments({
        counsellorId: userId,
        role: "student",
      });
      const pendingODs = await OnDutyRequest.countDocuments({
        counsellorId: userId,
        status: "pending",
      });
      const todayODs = await OnDutyRequest.countDocuments({
        counsellorId: userId,
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
      });

      stats = {
        assignedStudents,
        pendingODs,
        todayODs,
        totalODs: await OnDutyRequest.countDocuments({ counsellorId: userId }),
      };
    } else if (userRole === "admin") {
      // Admin dashboard stats
      const totalUsers = await User.countDocuments();
      const totalStudents = await User.countDocuments({ role: "student" });
      const totalCounsellors = await User.countDocuments({
        role: "counsellor",
      });
      const totalAnnouncements = await Announcement.countDocuments({
        isActive: true,
      });

      stats = {
        totalUsers,
        totalStudents,
        totalCounsellors,
        totalAnnouncements,
      };
    }

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

    const query = {
      isActive: true,
      $or: [{ targetRole: "all" }, { targetRole: userRole }],
      $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }],
    };

    const announcements = await Announcement.find(query)
      .populate("adminId", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit);

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
