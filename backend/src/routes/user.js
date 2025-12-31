const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");

// Get current user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update current user profile
router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;

    const allowedUpdates = { firstName, lastName, department };

    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const user = await User.findByIdAndUpdate(req.user._id, allowedUpdates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get assigned students (for counsellors only)
router.get(
  "/students",
  authMiddleware,
  rbacMiddleware("counsellor", "admin"),
  async (req, res) => {
    try {
      const students = await User.find({
        counsellorId: req.user._id,
        role: "student",
      }).select("-password");

      res.json({
        success: true,
        count: students.length,
        students,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Get user by ID (counsellors can view their students, admins can view all)
router.get(
  "/:userId",
  authMiddleware,
  rbacMiddleware("counsellor", "admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Counsellors can only view their assigned students
      if (
        req.user.role === "counsellor" &&
        user.counsellorId?.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
