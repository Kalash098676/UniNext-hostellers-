require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Preference = require("../models/Preference");
const Room = require("../models/Room");
const connectDB = require("../config/db");

const dummyStudents = [
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@uninest.com",
    gender: "MALE",
    branch: "Computer Science",
    year: 3,
    hostelType: "BOYS_HOSTEL",
    contactNo: "9812345601",
    pref: {
      scheduleType: "NIGHT_PERSON",
      cleanlinessLevel: "HIGH",
      noisePreference: "QUIET",
      studyPreference: "ALONE",
      allergy: "NONE",
      roomTempPreference: "COOL",
      roomType: "TWO",
    },
  },
  {
    name: "Rohan Verma",
    email: "rohan.verma@uninest.com",
    gender: "MALE",
    branch: "Computer Science",
    year: 3,
    hostelType: "BOYS_HOSTEL",
    contactNo: "9812345602",
    pref: {
      scheduleType: "NIGHT_PERSON",
      cleanlinessLevel: "HIGH",
      noisePreference: "QUIET",
      studyPreference: "ALONE",
      allergy: "NONE",
      roomTempPreference: "COOL",
      roomType: "TWO",
    },
  },
  {
    name: "Kabir Mehta",
    email: "kabir.mehta@uninest.com",
    gender: "MALE",
    branch: "Information Technology",
    year: 2,
    hostelType: "BOYS_HOSTEL",
    contactNo: "9812345603",
    pref: {
      scheduleType: "MORNING_PERSON",
      cleanlinessLevel: "MEDIUM",
      noisePreference: "OKAY",
      studyPreference: "GROUP",
      allergy: "NONE",
      roomTempPreference: "NORMAL",
      roomType: "TWO",
    },
  },
  {
    name: "Devansh Gupta",
    email: "devansh.gupta@uninest.com",
    gender: "MALE",
    branch: "Information Technology",
    year: 2,
    hostelType: "BOYS_HOSTEL",
    contactNo: "9812345604",
    pref: {
      scheduleType: "MORNING_PERSON",
      cleanlinessLevel: "MEDIUM",
      noisePreference: "OKAY",
      studyPreference: "GROUP",
      allergy: "NONE",
      roomTempPreference: "NORMAL",
      roomType: "TWO",
    },
  },
  {
    name: "Ananya Iyer",
    email: "ananya.iyer@uninest.com",
    gender: "FEMALE",
    branch: "Electronics",
    year: 3,
    hostelType: "GIRLS_HOSTEL",
    contactNo: "9812345605",
    pref: {
      scheduleType: "NIGHT_PERSON",
      cleanlinessLevel: "HIGH",
      noisePreference: "QUIET",
      studyPreference: "ALONE",
      allergy: "PERFUME",
      roomTempPreference: "COOL",
      roomType: "TWO",
    },
  },
  {
    name: "Priya Nair",
    email: "priya.nair@uninest.com",
    gender: "FEMALE",
    branch: "Electronics",
    year: 3,
    hostelType: "GIRLS_HOSTEL",
    contactNo: "9812345606",
    pref: {
      scheduleType: "NIGHT_PERSON",
      cleanlinessLevel: "HIGH",
      noisePreference: "QUIET",
      studyPreference: "ALONE",
      allergy: "PERFUME",
      roomTempPreference: "COOL",
      roomType: "TWO",
    },
  },
];

async function seedData() {
  try {
    await connectDB();
    console.log("Connected to MongoDB Atlas.");

    // Seed default rooms
    const defaultRooms = [
      { roomNumber: "101", block: "A", floor: 1, capacity: 2, hostelType: "BOYS_HOSTEL" },
      { roomNumber: "102", block: "A", floor: 1, capacity: 2, hostelType: "BOYS_HOSTEL" },
      { roomNumber: "103", block: "B", floor: 1, capacity: 3, hostelType: "BOYS_HOSTEL" },
      { roomNumber: "201", block: "C", floor: 2, capacity: 2, hostelType: "GIRLS_HOSTEL" },
      { roomNumber: "202", block: "C", floor: 2, capacity: 2, hostelType: "GIRLS_HOSTEL" },
    ];

    for (const r of defaultRooms) {
      await Room.findOneAndUpdate(
        { roomNumber: r.roomNumber },
        r,
        { upsert: true, new: true }
      );
    }
    console.log("Default rooms verified/created.");

    const hashedPassword = await bcrypt.hash("Student@123", 10);

    for (const s of dummyStudents) {
      let user = await User.findOne({ email: s.email });
      if (!user) {
        user = await User.create({
          name: s.name,
          email: s.email,
          password: hashedPassword,
          role: "ROLE_STUDENT",
          contactNo: s.contactNo,
        });
        console.log(`Created dummy student user: ${s.name}`);
      }

      await StudentProfile.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          branch: s.branch,
          year: s.year,
          gender: s.gender,
          hostelType: s.hostelType,
          parentContactNo: "9876543210",
          profileComplete: true,
          roomId: "Not Assigned",
        },
        { upsert: true }
      );

      await Preference.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          ...s.pref,
        },
        { upsert: true }
      );
    }

    console.log("\n=== DUMMY STUDENTS SEEDED SUCCESSFULLY ===");
    console.log("All dummy students have complete profiles & preferences for matching.");
    console.log("Default Password for dummy students: Student@123");
    console.log("==========================================");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedData();
