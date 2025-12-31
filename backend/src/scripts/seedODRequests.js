require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const OnDutyRequest = require("../models/OnDutyRequest");
const connectDB = require("../config/database");

const seedODRequests = async () => {
  try {
    await connectDB();

    // Find student and create counsellor
    const student = await User.findOne({ email: "student@test.com" });

    if (!student) {
      console.log("❌ Student not found");
      process.exit(1);
    }

    // Create or find counsellor
    let counsellor = await User.findOne({ email: "counsellor@test.com" });

    if (!counsellor) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Counsellor123!", salt);

      counsellor = await User.create({
        email: "counsellor@test.com",
        password: hashedPassword,
        firstName: "John",
        lastName: "Counsellor",
        role: "counsellor",
      });
      console.log("✅ Counsellor created");
    }

    // Assign counsellor to student
    student.counsellorId = counsellor._id;
    await student.save();
    console.log("✅ Counsellor assigned to student");

    // Clear existing OD requests
    await OnDutyRequest.deleteMany({ studentId: student._id });

    // Create sample OD requests
    const odRequests = [
      {
        studentId: student._id,
        counsellorId: counsellor._id,
        startDate: new Date("2025-12-15"),
        endDate: new Date("2025-12-16"),
        reason: "Attending IEEE Technical Workshop on Machine Learning",
        status: "approved",
        counsellorRemarks: "Approved. Educational event.",
        approvedAt: new Date("2025-12-14"),
      },
      {
        studentId: student._id,
        counsellorId: counsellor._id,
        startDate: new Date("2025-12-20"),
        endDate: new Date("2025-12-20"),
        reason: "Participating in Inter-College Hackathon",
        status: "pending",
      },
      {
        studentId: student._id,
        counsellorId: counsellor._id,
        startDate: new Date("2025-12-10"),
        endDate: new Date("2025-12-11"),
        reason: "Medical emergency - Family member hospitalized",
        status: "rejected",
        counsellorRemarks: "Please provide medical certificate for approval.",
        rejectedAt: new Date("2025-12-09"),
      },
    ];

    await OnDutyRequest.insertMany(odRequests);

    console.log("✅ Sample OD requests created!");
    console.log("Student:", student.email);
    console.log("Counsellor:", counsellor.email);
    console.log("Password: Counsellor123!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding OD requests:", error);
    process.exit(1);
  }
};

seedODRequests();
