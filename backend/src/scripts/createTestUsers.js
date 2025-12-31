require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../config/database");

const testUsers = [
  {
    email: "student@test.com",
    password: "Test1234!",
    firstName: "Test",
    lastName: "Student",
    role: "student",
  },
  {
    email: "counsellor@test.com",
    password: "Counsellor123!",
    firstName: "John",
    lastName: "Counsellor",
    role: "counsellor",
  },
  {
    email: "admin@test.com",
    password: "Admin123!",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
  },
];

const createTestUsers = async () => {
  try {
    await connectDB();

    console.log("🔄 Creating/Updating test users...\n");

    for (const userData of testUsers) {
      let user = await User.findOne({ email: userData.email });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      if (user) {
        // Update existing user
        user.password = hashedPassword;
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        user.role = userData.role;
        await user.save();
        console.log(`✅ Updated: ${userData.email}`);
      } else {
        // Create new user
        user = await User.create({
          ...userData,
          password: hashedPassword,
        });
        console.log(`✅ Created: ${userData.email}`);
      }
    }

    // Assign counsellor to student
    const student = await User.findOne({ email: "student@test.com" });
    const counsellor = await User.findOne({ email: "counsellor@test.com" });

    if (student && counsellor) {
      student.counsellorId = counsellor._id;
      await student.save();
      console.log("✅ Counsellor assigned to student\n");
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 TEST ACCOUNTS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    testUsers.forEach((user) => {
      console.log(`${user.role.toUpperCase()}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}\n`);
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createTestUsers();
