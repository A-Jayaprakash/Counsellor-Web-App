const express = require("express");
const router = express.Router();
const OnDutyRequest = require("../models/OnDutyRequest");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");

// Submit OD request (student only)
router.post(
  "/",
  authMiddleware,
  rbacMiddleware("student"),
  async (req, res) => {
    try {
      const { startDate, endDate, reason, documents } = req.body;

      // Validation
      if (!startDate || !endDate || !reason) {
        return res.status(400).json({
          success: false,
          message: "Start date, end date, and reason are required",
        });
      }

      // Check if end date is after start date
      if (new Date(endDate) < new Date(startDate)) {
        return res.status(400).json({
          success: false,
          message: "End date must be after start date",
        });
      }

      // Get student's counsellor
      const student = await User.findById(req.user._id);

      if (!student.counsellorId) {
        return res.status(400).json({
          success: false,
          message: "No counsellor assigned to you. Please contact admin.",
        });
      }

      // Create OD request
      const odRequest = await OnDutyRequest.create({
        studentId: req.user._id,
        counsellorId: student.counsellorId,
        startDate,
        endDate,
        reason,
        documents: documents || [],
      });

      // Populate student and counsellor details
      await odRequest.populate(
        "studentId",
        "firstName lastName email enrollmentNo"
      );
      await odRequest.populate("counsellorId", "firstName lastName email");

      res.status(201).json({
        success: true,
        message: "OD request submitted successfully",
        odRequest,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Get all OD requests for current student
router.get(
  "/my-requests",
  authMiddleware,
  rbacMiddleware("student"),
  async (req, res) => {
    try {
      const { status } = req.query;

      const query = { studentId: req.user._id };

      if (status) {
        query.status = status;
      }

      const requests = await OnDutyRequest.find(query)
        .sort({ createdAt: -1 })
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
  }
);

// Get pending OD requests for counsellor
router.get(
  "/pending",
  authMiddleware,
  rbacMiddleware("counsellor"),
  async (req, res) => {
    try {
      const requests = await OnDutyRequest.find({
        counsellorId: req.user._id,
        status: "pending",
      })
        .sort({ createdAt: -1 })
        .populate(
          "studentId",
          "firstName lastName email enrollmentNo department semester"
        );

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
  }
);

// Get all OD requests for counsellor (with filters)
router.get(
  "/counsellor/all",
  authMiddleware,
  rbacMiddleware("counsellor"),
  async (req, res) => {
    try {
      const { status, startDate, endDate } = req.query;

      const query = { counsellorId: req.user._id };

      if (status) {
        query.status = status;
      }

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const requests = await OnDutyRequest.find(query)
        .sort({ createdAt: -1 })
        .populate(
          "studentId",
          "firstName lastName email enrollmentNo department"
        );

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
  }
);

// Get single OD request details
router.get("/:odId", authMiddleware, async (req, res) => {
  try {
    const request = await OnDutyRequest.findById(req.params.odId)
      .populate("studentId", "firstName lastName email enrollmentNo department")
      .populate("counsellorId", "firstName lastName email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "OD request not found",
      });
    }

    // Check access permissions
    const isStudent =
      req.user._id.toString() === request.studentId._id.toString();
    const isCounsellor =
      req.user._id.toString() === request.counsellorId._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isStudent && !isCounsellor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Approve OD request (counsellor only)
router.patch(
  "/:odId/approve",
  authMiddleware,
  rbacMiddleware("counsellor"),
  async (req, res) => {
    try {
      const { remarks } = req.body;

      const request = await OnDutyRequest.findById(req.params.odId);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "OD request not found",
        });
      }

      // Check if counsellor owns this request
      if (request.counsellorId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Check if already processed
      if (request.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: `Request already ${request.status}`,
        });
      }

      // Update request
      request.status = "approved";
      request.counsellorRemarks = remarks || "";
      request.approvedAt = new Date();

      await request.save();

      await request.populate("studentId", "firstName lastName email");

      res.json({
        success: true,
        message: "OD request approved successfully",
        request,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Reject OD request (counsellor only)
router.patch(
  "/:odId/reject",
  authMiddleware,
  rbacMiddleware("counsellor"),
  async (req, res) => {
    try {
      const { remarks } = req.body;

      if (!remarks) {
        return res.status(400).json({
          success: false,
          message: "Remarks are required for rejection",
        });
      }

      const request = await OnDutyRequest.findById(req.params.odId);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "OD request not found",
        });
      }

      // Check if counsellor owns this request
      if (request.counsellorId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Check if already processed
      if (request.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: `Request already ${request.status}`,
        });
      }

      // Update request
      request.status = "rejected";
      request.counsellorRemarks = remarks;
      request.rejectedAt = new Date();

      await request.save();

      await request.populate("studentId", "firstName lastName email");

      res.json({
        success: true,
        message: "OD request rejected",
        request,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Delete OD request (student only, only if pending)
router.delete(
  "/:odId",
  authMiddleware,
  rbacMiddleware("student"),
  async (req, res) => {
    try {
      const request = await OnDutyRequest.findById(req.params.odId);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "OD request not found",
        });
      }

      // Check if student owns this request
      if (request.studentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Can only delete pending requests
      if (request.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Cannot delete processed requests",
        });
      }

      await OnDutyRequest.findByIdAndDelete(req.params.odId);

      res.json({
        success: true,
        message: "OD request deleted successfully",
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
