const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    counsellorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attendance: {
      totalClasses: { type: Number, default: 0 },
      classesAttended: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      subjects: [
        {
          name: String,
          classes: Number,
          attended: Number,
          percentage: Number,
        },
      ],
      lastUpdated: Date,
    },
    marks: {
      semester: Number,
      subjects: [
        {
          name: String,
          internalMarks: Number,
          externalMarks: Number,
          totalMarks: Number,
          grade: String,
        },
      ],
      gpa: Number,
      lastUpdated: Date,
    },
  },
  { timestamps: true }
);

// Indexes for performance
studentProfileSchema.index({ userId: 1 }); // Primary lookup field
studentProfileSchema.index({ counsellorId: 1 }); // For counsellor queries
studentProfileSchema.index({ studentId: 1 }); // Already unique, but explicit index

module.exports =
  mongoose.models.StudentProfile ||
  mongoose.model("StudentProfile", studentProfileSchema);
