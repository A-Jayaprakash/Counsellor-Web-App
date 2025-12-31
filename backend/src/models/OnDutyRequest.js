const mongoose = require("mongoose");

const onDutyRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    counsellorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      maxlength: 500,
    },
    documents: [
      {
        filename: String,
        url: String,
        uploadedAt: Date,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    counsellorRemarks: {
      type: String,
      maxlength: 500,
    },
    approvedAt: Date,
    rejectedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
onDutyRequestSchema.index({ studentId: 1, status: 1 });
onDutyRequestSchema.index({ counsellorId: 1, status: 1 });
onDutyRequestSchema.index({ createdAt: -1 });

module.exports =
  mongoose.models.OnDutyRequest ||
  mongoose.model("OnDutyRequest", onDutyRequestSchema);

module.exports = mongoose.model("OnDutyRequest", onDutyRequestSchema);
