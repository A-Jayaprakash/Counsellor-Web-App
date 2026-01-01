const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const cacheService = require("../services/cacheService");

// Cache TTL constants (in seconds)
const MARKS_TTL = 30 * 60; // 30 minutes

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

    const cacheKey = `marks:${studentId}`;

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
        marks: cachedData.marks,
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
      marks: profile.marks,
    };

    // Cache the marks data
    await cacheService.set(cacheKey, responseData, MARKS_TTL);

    res.json({
      success: true,
      ...responseData,
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

    const cacheKey = `marks:summary:${studentId}`;

    // Try to get from cache
    const cachedSummary = await cacheService.get(cacheKey);
    if (cachedSummary !== null) {
      return res.json({
        success: true,
        summary: cachedSummary,
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

    const summary = {
      gpa: profile.marks?.gpa || 0,
      cgpa: profile.marks?.cgpa || 0,
      semester: profile.marks?.semester || 1,
      totalSubjects: profile.marks?.subjects?.length || 0,
    };

    // Cache the summary data
    await cacheService.set(cacheKey, summary, MARKS_TTL);

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Get Marks Summary Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
