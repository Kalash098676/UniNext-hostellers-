require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const WardenProfile = require("../models/WardenProfile");
const connectDB = require("../config/db");

async function seedAdmin() {
  try {
    await connectDB();
    console.log("Connected to MongoDB Atlas.");

    const email = process.env.ADMIN_EMAIL || "admin@uninest.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@123456";
    const name = "System Administrator";

    let adminUser = await User.findOne({ email });

    if (adminUser) {
      console.log(`Admin user already exists with email: ${email}`);
      adminUser.role = "ROLE_WARDEN";
      adminUser.password = await bcrypt.hash(password, 10);
      await adminUser.save();
      console.log("Admin password and role updated.");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      adminUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "ROLE_WARDEN",
        contactNo: "9876543210",
      });
      console.log(`Admin user created: ${email}`);
    }

    let profile = await WardenProfile.findOne({ userId: adminUser._id });
    if (!profile) {
      await WardenProfile.create({
        userId: adminUser._id,
        hostelType: "BOYS_HOSTEL",
        contactNo: "9876543210",
      });
    }

    console.log("\n=== ADMIN CREDENTIALS ===");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("Role: ROLE_WARDEN (Admin)");
    console.log("=========================\n");

    process.exit(0);
  } catch (error) {
    console.error("Admin seed error:", error);
    process.exit(1);
  }
}

seedAdmin();
