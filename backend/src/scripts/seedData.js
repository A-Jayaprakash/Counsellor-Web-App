require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const connectDB = require("../config/database");

const seedData = async () => {
  try {
    await connectDB();

    // Find the existing student
    const student = await User.findOne({ email: "student@test.com" });

    if (!student) {
      console.log("❌ Student not found. Please create a student first.");
      process.exit(1);
    }

    // Check if profile already exists
    let profile = await StudentProfile.findOne({ userId: student._id });

    if (profile) {
      console.log("✅ Profile already exists, updating...");
    } else {
      console.log("Creating new student profile...");
      profile = new StudentProfile({ userId: student._id });
    }

    // Add sample data
    profile.studentId = "STU2025001";
    profile.attendance = {
      totalClasses: 120,
      classesAttended: 102,
      percentage: 85,
      subjects: [
        {
          name: "Mathematics",
          code: "MATH101",
          classes: 30,
          attended: 27,
          percentage: 90,
        },
        {
          name: "Physics",
          code: "PHY101",
          classes: 30,
          attended: 25,
          percentage: 83.33,
        },
        {
          name: "Chemistry",
          code: "CHEM101",
          classes: 30,
          attended: 24,
          percentage: 80,
        },
        {
          name: "Programming",
          code: "CS101",
          classes: 30,
          attended: 26,
          percentage: 86.67,
        },
      ],
      lastUpdated: new Date(),
    };

    profile.marks = {
      semester: 1,
      subjects: [
        {
          name: "Mathematics",
          code: "MATH101",
          internalMarks: 45,
          externalMarks: 78,
          totalMarks: 123,
          maxMarks: 150,
          grade: "A",
        },
        {
          name: "Physics",
          code: "PHY101",
          internalMarks: 42,
          externalMarks: 72,
          totalMarks: 114,
          maxMarks: 150,
          grade: "A",
        },
        {
          name: "Chemistry",
          code: "CHEM101",
          internalMarks: 38,
          externalMarks: 68,
          totalMarks: 106,
          maxMarks: 150,
          grade: "B+",
        },
        {
          name: "Programming",
          code: "CS101",
          internalMarks: 48,
          externalMarks: 85,
          totalMarks: 133,
          maxMarks: 150,
          grade: "A+",
        },
      ],
      gpa: 8.5,
      cgpa: 8.5,
      lastUpdated: new Date(),
    };

    await profile.save();

    console.log("✅ Sample data created successfully!");
    console.log("Student ID:", student._id);
    console.log("Profile ID:", profile._id);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
