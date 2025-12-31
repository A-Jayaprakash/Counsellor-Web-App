const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    targetRole: {
      type: String,
      enum: ["student", "counsellor", "all"],
      default: "all",
    },
    department: {
      type: String,
      default: null,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
announcementSchema.index({ targetRole: 1, isActive: 1 });
announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ expiresAt: 1 });

module.exports =
  mongoose.models.Announcement ||
  mongoose.model("Announcement", announcementSchema);
