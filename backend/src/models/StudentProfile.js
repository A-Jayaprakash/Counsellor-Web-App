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

module.exports =
  mongoose.models.StudentProfile ||
  mongoose.model("StudentProfile", studentProfileSchema);
