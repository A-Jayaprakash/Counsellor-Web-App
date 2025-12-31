const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "USER_CREATED",
        "USER_UPDATED",
        "USER_DELETED",
        "LOGIN",
        "LOGOUT",
        "OD_CREATED",
        "OD_APPROVED",
        "OD_REJECTED",
        "ANNOUNCEMENT_CREATED",
        "ANNOUNCEMENT_UPDATED",
        "ANNOUNCEMENT_DELETED",
      ],
    },
    resourceType: {
      type: String,
      enum: ["User", "OnDutyRequest", "Announcement", "StudentProfile"],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    oldValues: {
      type: mongoose.Schema.Types.Mixed,
    },
    newValues: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
