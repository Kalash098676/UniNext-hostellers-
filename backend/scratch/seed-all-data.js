require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const WardenProfile = require("../models/WardenProfile");
const StaffProfile = require("../models/StaffProfile");
const Preference = require("../models/Preference");
const Complaint = require("../models/Complaint");
const VisitorPass = require("../models/VisitorPass");
const Feedback = require("../models/Feedback");
const Menu = require("../models/Menu");
const Notification = require("../models/Notification");
const Room = require("../models/Room");
const RoommateMatch = require("../models/RoommateMatch");

async function seedAll() {
  try {
    await connectDB();
    console.log("Connected to MongoDB Atlas database 'uninest'.");

    const defaultPassword = await bcrypt.hash("Student@123", 10);
    const adminPassword = await bcrypt.hash("Admin@123456", 10);

    // 1. Seed Admin User
    let admin = await User.findOne({ email: "admin@uninest.com" });
    if (!admin) {
      admin = await User.create({
        name: "Hostel Chief Warden",
        email: "admin@uninest.com",
        password: adminPassword,
        role: "ROLE_WARDEN",
        contactNo: "9876543210",
      });
      console.log("✓ Admin user created");
    }
    await WardenProfile.findOneAndUpdate(
      { userId: admin._id },
      { userId: admin._id, hostelType: "BOYS_HOSTEL", contactNo: "9876543210" },
      { upsert: true }
    );

    // 2. Seed Staff Users
    const staffMembersData = [
      { name: "Ramesh Kumar", email: "ramesh.maintenance@uninest.com", dept: "MAINTENANCE", shift: "MORNING" },
      { name: "Suresh Singh", email: "suresh.security@uninest.com", dept: "SECURITY", shift: "NIGHT" },
    ];
    for (const s of staffMembersData) {
      let staffUser = await User.findOne({ email: s.email });
      if (!staffUser) {
        staffUser = await User.create({
          name: s.name,
          email: s.email,
          password: defaultPassword,
          role: "ROLE_STAFF",
        });
      }
      await StaffProfile.findOneAndUpdate(
        { userId: staffUser._id },
        { userId: staffUser._id, dept: s.dept, shift: s.shift, hostelType: "BOYS_HOSTEL" },
        { upsert: true }
      );
    }
    console.log("✓ Staff members created");

    // 3. Seed Rooms
    const roomsData = [
      { roomNumber: "101", block: "A", floor: 1, capacity: 2, hostelType: "BOYS_HOSTEL" },
      { roomNumber: "102", block: "A", floor: 1, capacity: 2, hostelType: "BOYS_HOSTEL" },
      { roomNumber: "103", block: "B", floor: 1, capacity: 3, hostelType: "BOYS_HOSTEL" },
      { roomNumber: "201", block: "C", floor: 2, capacity: 2, hostelType: "GIRLS_HOSTEL" },
      { roomNumber: "202", block: "C", floor: 2, capacity: 2, hostelType: "GIRLS_HOSTEL" },
    ];
    for (const r of roomsData) {
      await Room.findOneAndUpdate({ roomNumber: r.roomNumber }, r, { upsert: true });
    }
    console.log("✓ Rooms created");

    // 4. Seed Students with Profiles & Preferences
    const studentsList = [
      { name: "Aarav Sharma", email: "aarav@uninest.com", gender: "MALE", branch: "Computer Science", year: 3, room: "101", pref: { scheduleType: "NIGHT_PERSON", cleanlinessLevel: "HIGH", noisePreference: "QUIET", studyPreference: "ALONE", allergy: "NONE", roomTempPreference: "COOL", roomType: "TWO" } },
      { name: "Rohan Verma", email: "rohan@uninest.com", gender: "MALE", branch: "Computer Science", year: 3, room: "101", pref: { scheduleType: "NIGHT_PERSON", cleanlinessLevel: "HIGH", noisePreference: "QUIET", studyPreference: "ALONE", allergy: "NONE", roomTempPreference: "COOL", roomType: "TWO" } },
      { name: "Kabir Mehta", email: "kabir@uninest.com", gender: "MALE", branch: "Information Technology", year: 2, room: "102", pref: { scheduleType: "MORNING_PERSON", cleanlinessLevel: "MEDIUM", noisePreference: "OKAY", studyPreference: "GROUP", allergy: "NONE", roomTempPreference: "NORMAL", roomType: "TWO" } },
      { name: "Devansh Gupta", email: "devansh@uninest.com", gender: "MALE", branch: "Information Technology", year: 2, room: "102", pref: { scheduleType: "MORNING_PERSON", cleanlinessLevel: "MEDIUM", noisePreference: "OKAY", studyPreference: "GROUP", allergy: "NONE", roomTempPreference: "NORMAL", roomType: "TWO" } },
      { name: "Ananya Iyer", email: "ananya@uninest.com", gender: "FEMALE", branch: "Electronics", year: 3, room: "201", pref: { scheduleType: "NIGHT_PERSON", cleanlinessLevel: "HIGH", noisePreference: "QUIET", studyPreference: "ALONE", allergy: "PERFUME", roomTempPreference: "COOL", roomType: "TWO" } },
      { name: "Priya Nair", email: "priya@uninest.com", gender: "FEMALE", branch: "Electronics", year: 3, room: "201", pref: { scheduleType: "NIGHT_PERSON", cleanlinessLevel: "HIGH", noisePreference: "QUIET", studyPreference: "ALONE", allergy: "PERFUME", roomTempPreference: "COOL", roomType: "TWO" } },
      { name: "Aditya Singh", email: "aditya@uninest.com", gender: "MALE", branch: "Mechanical", year: 1, room: "103", pref: { scheduleType: "FLEXIBLE", cleanlinessLevel: "HIGH", noisePreference: "QUIET", studyPreference: "ALONE", allergy: "NONE", roomTempPreference: "NORMAL", roomType: "THREE" } },
      { name: "Siddharth Das", email: "siddharth@uninest.com", gender: "MALE", branch: "Mechanical", year: 1, room: "103", pref: { scheduleType: "FLEXIBLE", cleanlinessLevel: "HIGH", noisePreference: "QUIET", studyPreference: "ALONE", allergy: "NONE", roomTempPreference: "NORMAL", roomType: "THREE" } },
    ];

    const studentUserDocs = [];
    for (const s of studentsList) {
      let u = await User.findOne({ email: s.email });
      if (!u) {
        u = await User.create({
          name: s.name,
          email: s.email,
          password: defaultPassword,
          role: "ROLE_STUDENT",
          contactNo: "9876543210",
        });
      }
      studentUserDocs.push(u);

      await StudentProfile.findOneAndUpdate(
        { userId: u._id },
        {
          userId: u._id,
          branch: s.branch,
          year: s.year,
          gender: s.gender,
          hostelType: s.gender === "FEMALE" ? "GIRLS_HOSTEL" : "BOYS_HOSTEL",
          roomId: s.room,
          parentContactNo: "9811122233",
          profileComplete: true,
        },
        { upsert: true }
      );

      await Preference.findOneAndUpdate(
        { userId: u._id },
        { userId: u._id, ...s.pref },
        { upsert: true }
      );
    }
    console.log("✓ Students, Profiles & Preferences created");

    // Recalculate room occupied beds
    for (const r of roomsData) {
      const occupantsCount = await StudentProfile.countDocuments({ roomId: r.roomNumber });
      await Room.findOneAndUpdate(
        { roomNumber: r.roomNumber },
        { occupiedBeds: occupantsCount, status: occupantsCount >= r.capacity ? "FULL" : "AVAILABLE" }
      );
    }

    // 5. Seed Complaints
    const sampleComplaints = [
      { userId: studentUserDocs[0]._id, title: "AC Water Leakage", description: "Water leaking from room AC unit onto study table.", roomId: "101", priority: "HIGH", status: "IN_PROGRESS" },
      { userId: studentUserDocs[2]._id, title: "Wi-Fi Router Signal Weak", description: "Signal disconnects frequently in Room 102.", roomId: "102", priority: "MEDIUM", status: "PENDING" },
      { userId: studentUserDocs[4]._id, title: "Bathroom Light Switch Repair", description: "Main mirror switch in room 201 is flickering.", roomId: "201", priority: "LOW", status: "RESOLVED" },
    ];
    for (const c of sampleComplaints) {
      await Complaint.create(c);
    }
    console.log("✓ Maintenance complaints created");

    // 6. Seed Visitor Passes
    const samplePasses = [
      { userId: studentUserDocs[0]._id, visitorName: "Mahesh Sharma", relation: "Parent", phone: "9876543210", visitDate: "2026-10-02", visitTime: "11:00 AM", reason: "Bringing winter clothes", passCode: "VP-9821-4412", status: "APPROVED" },
      { userId: studentUserDocs[4]._id, visitorName: "Sunita Iyer", relation: "Parent", phone: "9811223344", visitDate: "2026-10-03", visitTime: "02:30 PM", reason: "Family Visit", passCode: "VP-5531-1029", status: "PENDING" },
    ];
    for (const vp of samplePasses) {
      await VisitorPass.create(vp);
    }
    console.log("✓ Visitor passes created");

    // 7. Seed Weekly Mess Menu
    await Menu.deleteMany({});
    await Menu.create({
      meals: {
        MONDAY: {
          BREAKFAST: ["Poha", "Boiled Eggs", "Tea / Coffee", "Banana"],
          LUNCH: ["Dal Tadka", "Mix Veg", "Jeera Rice", "Roti", "Salad"],
          SNACKS: ["Samosa", "Masala Chai"],
          DINNER: ["Paneer Butter Masala", "Dal Makhani", "Naan / Roti", "Gulab Jamun"],
        },
        TUESDAY: {
          BREAKFAST: ["Aloo Paratha", "Curd", "Tea / Coffee"],
          LUNCH: ["Rajma Masala", "Steamed Rice", "Roti", "Cucumber Salad"],
          SNACKS: ["Veg Cutlet", "Tea"],
          DINNER: ["Kadhai Chicken / Kadhai Paneer", "Biryani Rice", "Butter Roti", "Kheer"],
        },
        WEDNESDAY: {
          BREAKFAST: ["Idli Sambar", "Coconut Chutney", "Coffee"],
          LUNCH: ["Kadi Pakoda", "Jeera Rice", "Chapati", "Papad"],
          SNACKS: ["Bread Pakora", "Tea"],
          DINNER: ["Sev Tamatar", "Dal Fry", "Plain Rice", "Roti", "Rasgulla"],
        },
        THURSDAY: {
          BREAKFAST: ["Chole Bhature", "Lassi / Tea"],
          LUNCH: ["Veg Kolhapuri", "Yellow Dal", "Rice", "Phulka"],
          SNACKS: ["Dhokla", "Green Chutney", "Tea"],
          DINNER: ["Malai Kofta", "Jeera Rice", "Butter Naan", "Ice Cream"],
        },
        FRIDAY: {
          BREAKFAST: ["Puri Bhaji", "Tea / Milk"],
          LUNCH: ["Palak Paneer", "Dal Makhani", "Peas Pulao", "Roti"],
          SNACKS: ["Pav Bhaji", "Lemon Tea"],
          DINNER: ["Chicken Curry / Egg Curry / Shahi Paneer", "Veg Pulao", "Roti", "Halwa"],
        },
        SATURDAY: {
          BREAKFAST: ["Uttapam", "Tomato Chutney", "Tea"],
          LUNCH: ["Aloo Gobi", "Dal Tadka", "Steamed Rice", "Roti"],
          SNACKS: ["Bhel Puri", "Tea"],
          DINNER: ["Mix Veg Handi", "Dal Fry", "Jeera Rice", "Jalebi"],
        },
        SUNDAY: {
          BREAKFAST: ["Masala Dosa", "Sambar", "Filter Coffee"],
          LUNCH: ["Special Sunday Thali", "Veg Dum Biryani", "Raita", "Sweet Paan"],
          SNACKS: ["French Fries", "Cold Coffee"],
          DINNER: ["Dal Makhani", "Paneer Do Pyaza", "Stuffed Naan", "Brownie with Ice Cream"],
        },
      },
    });
    console.log("✓ Weekly Mess Menu created");

    // 8. Seed Feedbacks
    const sampleFeedbacks = [
      { userId: studentUserDocs[0]._id, rating: 5, comment: "Paneer Butter Masala on Monday dinner was delicious!" },
      { userId: studentUserDocs[1]._id, rating: 4, comment: "Breakfast variety is great. Keep it up." },
      { userId: studentUserDocs[4]._id, rating: 5, comment: "Idli Sambar on Wednesday morning was very fresh." },
    ];
    for (const fb of sampleFeedbacks) {
      await Feedback.create(fb);
    }
    console.log("✓ Student meal feedbacks created");

    // 9. Seed Notifications
    const sampleNotifications = [
      { message: "Weekly Hostel Cleanliness Inspection scheduled for Friday at 10 AM.", type: "GENERAL" },
      { message: "Mess Special Sunday Lunch Thali starts from 12:30 PM.", type: "GENERAL" },
    ];
    for (const n of sampleNotifications) {
      await Notification.create(n);
    }
    console.log("✓ System notifications created");

    console.log("\n==================================================");
    console.log("🎉 ALL MONGODB ATLAS COLLECTIONS SEEDED SUCCESSFULLY!");
    console.log("==================================================");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedAll();
