const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");

// Get student's marks
exports.getMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const requesterId = req.user._id;
    const requesterRole = req.user.role;

    // Authorization check
    if (requesterRole === "student" && studentId !== requesterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const profile = await StudentProfile.findOne({
      userId: studentId,
    }).populate("userId", "firstName lastName email enrollmentNo");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Check if counsellor is authorized
    if (requesterRole === "counsellor") {
      const student = await User.findById(studentId);
      if (student.counsellorId?.toString() !== requesterId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not your assigned student",
        });
      }
    }

    res.json({
      success: true,
      student: profile.userId,
      marks: profile.marks,
    });
  } catch (error) {
    console.error("Get Marks Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get marks summary (GPA/CGPA)
exports.getMarksSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const requesterId = req.user._id;
    const requesterRole = req.user.role;

    // Authorization check
    if (requesterRole === "student" && studentId !== requesterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const profile = await StudentProfile.findOne({ userId: studentId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.json({
      success: true,
      summary: {
        gpa: profile.marks?.gpa || 0,
        cgpa: profile.marks?.cgpa || 0,
        semester: profile.marks?.semester || 1,
        totalSubjects: profile.marks?.subjects?.length || 0,
      },
    });
  } catch (error) {
    console.error("Get Marks Summary Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
