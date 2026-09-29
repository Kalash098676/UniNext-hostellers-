require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Room = require("../models/Room");
const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");

async function testRoomOps() {
  try {
    await connectDB();
    console.log("Connected to DB.");

    // Test creating a room
    const roomNumber = "TEST-101";
    await Room.deleteMany({ roomNumber });

    const newRoom = await Room.create({
      roomNumber,
      block: "A",
      floor: 1,
      capacity: 2,
      hostelType: "BOYS_HOSTEL",
    });
    console.log("SUCCESS creating room:", newRoom);

    // Test listing rooms
    const rooms = await Room.find();
    console.log("Rooms count:", rooms.length);

    // Test allocating a student
    const student = await User.findOne({ role: "ROLE_STUDENT" });
    if (student) {
      let profile = await StudentProfile.findOne({ userId: student._id });
      if (!profile) {
        profile = await StudentProfile.create({ userId: student._id, profileComplete: true });
      }
      profile.roomId = roomNumber;
      await profile.save();
      console.log("SUCCESS allocating room to student:", student.name);
    }

    process.exit(0);
  } catch (err) {
    console.error("TEST ROOM OPS ERROR:", err);
    process.exit(1);
  }
}

testRoomOps();
