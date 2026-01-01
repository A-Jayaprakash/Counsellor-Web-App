const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Announcement = require("../models/Announcement");
const OnDutyRequest = require("../models/OnDutyRequest");
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const cacheService = require("../services/cacheService");

// All routes require admin role
router.use(authMiddleware, rbacMiddleware("admin"));

// ==================== USER MANAGEMENT ====================

// Get all users with filters
router.get("/users", async (req, res) => {
  try {
    const { role, department, search } = req.query;

    const query = {};

    if (role) query.role = role;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { enrollmentNo: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update user role
router.patch("/users/:userId/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!["student", "counsellor", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Invalidate user cache to ensure fresh authorization data
    await cacheService.del(`user:${user._id.toString()}`);
    // Also invalidate dashboard stats cache for this user since role affects dashboard
    await cacheService.delByPattern(`dashboard:stats:${user._id.toString()}:*`);

    res.json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Assign counsellor to student
router.patch("/users/:studentId/assign-counsellor", async (req, res) => {
  try {
    const { counsellorId } = req.body;

    // Verify counsellor exists
    const counsellor = await User.findOne({
      _id: counsellorId,
      role: "counsellor",
    });

    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: "Counsellor not found",
      });
    }

    // Fetch current student to get old counsellorId before updating
    const currentStudent = await User.findById(req.params.studentId).select(
      "counsellorId"
    );

    if (!currentStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const oldCounsellorId = currentStudent.counsellorId;

    // Update student
    const student = await User.findByIdAndUpdate(
      req.params.studentId,
      { counsellorId },
      { new: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Invalidate user cache to ensure fresh authorization data
    await cacheService.del(`user:${student._id.toString()}`);
    // Invalidate attendance cache for this student
    await cacheService.del(`attendance:${student._id.toString()}`);

    // Invalidate old counsellor's cache if student was previously assigned
    if (
      oldCounsellorId &&
      oldCounsellorId.toString() !== counsellorId.toString()
    ) {
      await cacheService.del(
        `attendance:counsellor:${oldCounsellorId.toString()}`
      );
      await cacheService.delByPattern(
        `dashboard:stats:${oldCounsellorId.toString()}:*`
      );
    }

    // Invalidate new counsellor's cache
    await cacheService.del(`attendance:counsellor:${counsellorId.toString()}`);
    // Invalidate new counsellor's dashboard stats cache to reflect updated assignedStudents count
    await cacheService.delByPattern(
      `dashboard:stats:${counsellorId.toString()}:*`
    );
    // Invalidate dashboard stats cache for student
    await cacheService.delByPattern(
      `dashboard:stats:${student._id.toString()}:*`
    );

    res.json({
      success: true,
      message: "Counsellor assigned successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete user
router.delete("/users/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Invalidate user cache
    await cacheService.del(`user:${user._id.toString()}`);
    // Invalidate related caches
    await cacheService.delByPattern(`dashboard:stats:${user._id.toString()}:*`);
    if (user.counsellorId) {
      await cacheService.del(
        `attendance:counsellor:${user.counsellorId.toString()}`
      );
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== ANNOUNCEMENT MANAGEMENT ====================

// Create announcement
router.post("/announcements", async (req, res) => {
  try {
    const { title, content, targetRole, department, priority, expiresAt } =
      req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const announcement = await Announcement.create({
      adminId: req.user._id,
      title,
      content,
      targetRole: targetRole || "all",
      department,
      priority: priority || "medium",
      expiresAt,
    });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all announcements
router.get("/announcements", async (req, res) => {
  try {
    const { isActive, targetRole } = req.query;

    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (targetRole) {
      query.targetRole = targetRole;
    }

    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .populate("adminId", "firstName lastName email");

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

// Update announcement
router.patch("/announcements/:announcementId", async (req, res) => {
  try {
    const {
      title,
      content,
      targetRole,
      department,
      priority,
      isActive,
      expiresAt,
    } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.announcementId,
      { title, content, targetRole, department, priority, isActive, expiresAt },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.json({
      success: true,
      message: "Announcement updated successfully",
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete announcement
router.delete("/announcements/:announcementId", async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(
      req.params.announcementId
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== OD MANAGEMENT ====================

// View all OD requests
router.get("/onduty", async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    const query = {};

    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const requests = await OnDutyRequest.find(query)
      .sort({ createdAt: -1 })
      .populate("studentId", "firstName lastName email enrollmentNo")
      .populate("counsellorId", "firstName lastName email");

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
