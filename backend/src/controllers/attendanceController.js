const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const cacheService = require("../services/cacheService");

// Cache TTL constants (in seconds)
const ATTENDANCE_TTL = 30 * 60; // 30 minutes

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

    const cacheKey = `attendance:${studentId}`;

    // Try to get from cache
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      // Still need to check authorization for cached data
      if (requesterRole === "counsellor") {
        const student = await User.findById(studentId).select("counsellorId");
        if (student?.counsellorId?.toString() !== requesterId.toString()) {
          return res.status(403).json({
            success: false,
            message: "Not your assigned student",
          });
        }
      }
      return res.json({
        success: true,
        student: cachedData.student,
        attendance: cachedData.attendance,
        cached: true,
      });
    }

    // Fetch profile and student (for authorization) in parallel
    const [profile, student] = await Promise.all([
      StudentProfile.findOne({
        userId: studentId,
      }).populate("userId", "firstName lastName email enrollmentNo"),
      requesterRole === "counsellor"
        ? User.findById(studentId).select("counsellorId")
        : Promise.resolve(null),
    ]);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Check if counsellor is authorized
    if (requesterRole === "counsellor" && student?.counsellorId?.toString() !== requesterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not your assigned student",
      });
    }

    const responseData = {
      student: profile.userId,
      attendance: profile.attendance,
    };

    // Cache the attendance data
    await cacheService.set(cacheKey, responseData, ATTENDANCE_TTL);

    res.json({
      success: true,
      ...responseData,
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
    const cacheKey = `attendance:counsellor:${counsellorId}`;

    // Try to get from cache
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        count: cachedData.length,
        data: cachedData,
        cached: true,
      });
    }

    // Get all assigned students first
    const students = await User.find({
      counsellorId,
      role: "student",
    }).select("firstName lastName email enrollmentNo");

    // Get their profiles in parallel
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

    // Cache the attendance data
    await cacheService.set(cacheKey, attendanceData, ATTENDANCE_TTL);

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

    const cacheKey = `attendance:subjects:${studentId}`;

    // Try to get from cache
    const cachedSubjects = await cacheService.get(cacheKey);
    if (cachedSubjects !== null) {
      return res.json({
        success: true,
        subjects: cachedSubjects,
        cached: true,
      });
    }

    const profile = await StudentProfile.findOne({ userId: studentId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const subjects = profile.attendance?.subjects || [];

    // Cache the subjects data
    await cacheService.set(cacheKey, subjects, ATTENDANCE_TTL);

    res.json({
      success: true,
      subjects,
    });
  } catch (error) {
    console.error("Get Attendance by Subject Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
