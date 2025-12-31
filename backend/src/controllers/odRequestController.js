const OnDutyRequest = require("../models/OnDutyRequest");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

// Create new OD request (Student only)
exports.createODRequest = async (req, res) => {
  try {
    const { startDate, endDate, reason, documents } = req.body;
    const studentId = req.user._id;

    // Get student's counsellor
    const student = await User.findById(studentId);
    if (!student.counsellorId) {
      return res.status(400).json({
        success: false,
        message: "No counsellor assigned. Please contact admin.",
      });
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Create OD request
    const odRequest = await OnDutyRequest.create({
      studentId,
      counsellorId: student.counsellorId,
      startDate,
      endDate,
      reason,
      documents: documents || [],
    });

    // Create audit log
    await AuditLog.create({
      userId: studentId,
      action: "OD_CREATED",
      resourceType: "OnDutyRequest",
      resourceId: odRequest._id,
      newValues: { startDate, endDate, reason },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      message: "OD request submitted successfully",
      odRequest,
    });
  } catch (error) {
    console.error("Create OD Request Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all OD requests (filtered by role)
exports.getODRequests = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const userId = req.user._id;
    const userRole = req.user.role;

    let query = {};

    // Filter by role
    if (userRole === "student") {
      query.studentId = userId;
    } else if (userRole === "counsellor") {
      query.counsellorId = userId;
    }
    // Admin can see all requests (no filter)

    // Additional filters
    if (status) {
      query.status = status;
    }
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const odRequests = await OnDutyRequest.find(query)
      .populate("studentId", "firstName lastName email enrollmentNo")
      .populate("counsellorId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: odRequests.length,
      odRequests,
    });
  } catch (error) {
    console.error("Get OD Requests Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single OD request by ID
exports.getODRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const odRequest = await OnDutyRequest.findById(id)
      .populate("studentId", "firstName lastName email enrollmentNo")
      .populate("counsellorId", "firstName lastName email");

    if (!odRequest) {
      return res.status(404).json({
        success: false,
        message: "OD request not found",
      });
    }

    // Authorization check
    if (
      userRole === "student" &&
      odRequest.studentId._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (
      userRole === "counsellor" &&
      odRequest.counsellorId._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not your assigned student",
      });
    }

    res.json({
      success: true,
      odRequest,
    });
  } catch (error) {
    console.error("Get OD Request Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update OD request (Student can edit pending requests only)
exports.updateODRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, reason, documents } = req.body;
    const studentId = req.user._id;

    const odRequest = await OnDutyRequest.findById(id);

    if (!odRequest) {
      return res.status(404).json({
        success: false,
        message: "OD request not found",
      });
    }

    // Only student can update their own pending requests
    if (odRequest.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (odRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot edit approved/rejected requests",
      });
    }

    // Validate dates if provided
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const oldValues = {
      startDate: odRequest.startDate,
      endDate: odRequest.endDate,
      reason: odRequest.reason,
    };

    // Update fields
    if (startDate) odRequest.startDate = startDate;
    if (endDate) odRequest.endDate = endDate;
    if (reason) odRequest.reason = reason;
    if (documents) odRequest.documents = documents;

    await odRequest.save();

    // Create audit log
    await AuditLog.create({
      userId: studentId,
      action: "USER_UPDATED",
      resourceType: "OnDutyRequest",
      resourceId: odRequest._id,
      oldValues,
      newValues: { startDate, endDate, reason },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "OD request updated successfully",
      odRequest,
    });
  } catch (error) {
    console.error("Update OD Request Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete OD request (Student can delete pending requests only)
exports.deleteODRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    const odRequest = await OnDutyRequest.findById(id);

    if (!odRequest) {
      return res.status(404).json({
        success: false,
        message: "OD request not found",
      });
    }

    // Only student can delete their own pending requests
    if (odRequest.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (odRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete approved/rejected requests",
      });
    }

    await OnDutyRequest.findByIdAndDelete(id);

    // Create audit log
    await AuditLog.create({
      userId: studentId,
      action: "USER_DELETED",
      resourceType: "OnDutyRequest",
      resourceId: odRequest._id,
      oldValues: {
        startDate: odRequest.startDate,
        endDate: odRequest.endDate,
        reason: odRequest.reason,
      },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "OD request deleted successfully",
    });
  } catch (error) {
    console.error("Delete OD Request Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve OD request (Counsellor only)
exports.approveODRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    const counsellorId = req.user._id;

    const odRequest = await OnDutyRequest.findById(id);

    if (!odRequest) {
      return res.status(404).json({
        success: false,
        message: "OD request not found",
      });
    }

    // Check if counsellor owns this request
    if (odRequest.counsellorId.toString() !== counsellorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not your assigned student",
      });
    }

    if (odRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    odRequest.status = "approved";
    odRequest.counsellorRemarks = remarks || "";
    odRequest.approvedAt = new Date();

    await odRequest.save();

    // Create audit log
    await AuditLog.create({
      userId: counsellorId,
      action: "OD_APPROVED",
      resourceType: "OnDutyRequest",
      resourceId: odRequest._id,
      newValues: { status: "approved", remarks },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "OD request approved successfully",
      odRequest,
    });
  } catch (error) {
    console.error("Approve OD Request Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reject OD request (Counsellor only)
exports.rejectODRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    const counsellorId = req.user._id;

    if (!remarks) {
      return res.status(400).json({
        success: false,
        message: "Remarks are required for rejection",
      });
    }

    const odRequest = await OnDutyRequest.findById(id);

    if (!odRequest) {
      return res.status(404).json({
        success: false,
        message: "OD request not found",
      });
    }

    // Check if counsellor owns this request
    if (odRequest.counsellorId.toString() !== counsellorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not your assigned student",
      });
    }

    if (odRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    odRequest.status = "rejected";
    odRequest.counsellorRemarks = remarks;
    odRequest.rejectedAt = new Date();

    await odRequest.save();

    // Create audit log
    await AuditLog.create({
      userId: counsellorId,
      action: "OD_REJECTED",
      resourceType: "OnDutyRequest",
      resourceId: odRequest._id,
      newValues: { status: "rejected", remarks },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "OD request rejected",
      odRequest,
    });
  } catch (error) {
    console.error("Reject OD Request Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get OD statistics
exports.getODStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let query = {};

    if (userRole === "student") {
      query.studentId = userId;
    } else if (userRole === "counsellor") {
      query.counsellorId = userId;
    }

    const [total, pending, approved, rejected] = await Promise.all([
      OnDutyRequest.countDocuments(query),
      OnDutyRequest.countDocuments({ ...query, status: "pending" }),
      OnDutyRequest.countDocuments({ ...query, status: "approved" }),
      OnDutyRequest.countDocuments({ ...query, status: "rejected" }),
    ]);

    res.json({
      success: true,
      stats: {
        total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    console.error("Get OD Stats Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
