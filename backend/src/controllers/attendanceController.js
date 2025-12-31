const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");

// Get student's attendance
exports.getAttendance = async (req, res) => {
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
      attendance: profile.attendance,
    });
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all assigned students' attendance (for counsellors)
exports.getStudentsAttendance = async (req, res) => {
  try {
    const counsellorId = req.user._id;

    // Get all assigned students
    const students = await User.find({
      counsellorId,
      role: "student",
    }).select("firstName lastName email enrollmentNo");

    // Get their profiles
    const studentIds = students.map((s) => s._id);
    const profiles = await StudentProfile.find({
      userId: { $in: studentIds },
    });

    // Combine data
    const attendanceData = students.map((student) => {
      const profile = profiles.find(
        (p) => p.userId.toString() === student._id.toString()
      );
      return {
        student: {
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
          enrollmentNo: student.enrollmentNo,
        },
        attendance: profile?.attendance || {
          totalClasses: 0,
          classesAttended: 0,
          percentage: 0,
        },
      };
    });

    res.json({
      success: true,
      count: attendanceData.length,
      data: attendanceData,
    });
  } catch (error) {
    console.error("Get Students Attendance Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get attendance by subject
exports.getAttendanceBySubject = async (req, res) => {
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
      subjects: profile.attendance?.subjects || [],
    });
  } catch (error) {
    console.error("Get Attendance by Subject Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
