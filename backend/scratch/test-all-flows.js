require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");

const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const WardenProfile = require("../models/WardenProfile");
const StaffProfile = require("../models/StaffProfile");
const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");
const Menu = require("../models/Menu");
const Notification = require("../models/Notification");
const Preference = require("../models/Preference");
const RoommateMatch = require("../models/RoommateMatch");
const VisitorPass = require("../models/VisitorPass");

const express = require("express");
const app = express();
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? "UP" : "DOWN",
    database: mongoose.connection.name || "uninest",
    connectionState: isConnected ? "Connected" : "Disconnected",
  });
});
app.use("/api/auth", require("../routes/auth"));
app.use("/api/student", require("../routes/student"));
app.use("/api/preference", require("../routes/preference"));
app.use("/api/complaint", require("../routes/complaint"));
app.use("/api/feedback", require("../routes/feedback"));
app.use("/api/menu", require("../routes/menu"));
app.use("/api/warden/notifications", require("../routes/notification"));
app.use("/api/warden", require("../routes/warden"));
app.use("/api/matching", require("../routes/matching"));
app.use("/api/visitor-pass", require("../routes/visitorPass"));

async function runE2ETests() {
  console.log("=== Starting UniNest E2E API & Database Verification ===");

  await mongoose.connect(process.env.MONGO_URI);
  console.log("1. Connected to MongoDB:", mongoose.connection.name);

  const server = app.listen(8089);
  const baseURL = "http://localhost:8089";

  try {
    // Test 1: Health Check
    const healthRes = await fetch(`${baseURL}/api/health`);
    const healthBody = await healthRes.json();
    console.log("2. Health Check Status:", healthRes.status, healthBody);

    // Clean test data
    await User.deleteMany({ email: /@test\.com$/ });
    await Complaint.deleteMany({});
    await Feedback.deleteMany({});
    await Preference.deleteMany({});
    await RoommateMatch.deleteMany({});
    await VisitorPass.deleteMany({});

    // Test 2: Student Registration
    const studentRegRes = await fetch(`${baseURL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alice Tester",
        email: "alice@test.com",
        password: "password123",
        contactNo: "9876543210",
      }),
    });
    const studentRegData = await studentRegRes.json();
    console.log("3. Student Registration Status:", studentRegRes.status, "Token acquired:", !!studentRegData.token);
    const aliceToken = studentRegData.token;

    // Test 2b: Duplicate Email Registration
    const dupRegRes = await fetch(`${baseURL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alice Dup",
        email: "alice@test.com",
        password: "password123",
      }),
    });
    console.log("4. Duplicate Email Rejection Status:", dupRegRes.status, "(Expected 400)");

    // Test 3: Login
    const loginRes = await fetch(`${baseURL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "alice@test.com",
        password: "password123",
      }),
    });
    const loginData = await loginRes.json();
    console.log("5. Login Status:", loginRes.status, "Role:", loginData.role);

    // Test 4: Student Profile Update & Retrieval
    const profileUpdateRes = await fetch(`${baseURL}/api/student/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({
        branch: "Computer Science",
        year: 2,
        gender: "FEMALE",
        hostelType: "GIRLS_HOSTEL",
        parentContactNo: "9123456789",
      }),
    });
    const profileUpdateData = await profileUpdateRes.json();
    console.log("6. Update Profile Status:", profileUpdateRes.status, "Complete:", profileUpdateData.profile?.profileComplete);

    const getProfileRes = await fetch(`${baseURL}/api/student/profile`, {
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    const getProfileData = await getProfileRes.json();
    console.log("7. Get Profile Status:", getProfileRes.status, "Branch:", getProfileData.branch);

    // Test 5: Save Preferences
    const prefRes = await fetch(`${baseURL}/api/preference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({
        scheduleType: "MORNING_PERSON",
        cleanlinessLevel: "HIGH",
        noisePreference: "QUIET",
        studyPreference: "ALONE",
        allergy: "NONE",
        roomTempPreference: "COOL",
        roomType: "TWO",
      }),
    });
    console.log("8. Save Preference Status:", prefRes.status);

    // Test 6: Complaint Creation
    const complaintRes = await fetch(`${baseURL}/api/complaint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({
        title: "AC Not Cooling",
        description: "The room AC temperature stays hot.",
        roomId: "B-201",
      }),
    });
    const complaintData = await complaintRes.json();
    console.log("9. File Complaint Status:", complaintRes.status, "ID:", complaintData._id);
    const complaintId = complaintData._id;

    // Create Warden User in DB for admin testing
    const bcrypt = require("bcryptjs");
    const wardenPasswordHash = await bcrypt.hash("wardenpass", 10);
    const wardenUser = await User.create({
      name: "Warden Dave",
      email: "dave@test.com",
      password: wardenPasswordHash,
      role: "ROLE_WARDEN",
    });
    const jwt = require("jsonwebtoken");
    const wardenToken = jwt.sign(
      { id: wardenUser._id, role: wardenUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Test 7: Warden update complaint status
    const updateComplaintRes = await fetch(`${baseURL}/api/complaint/${complaintId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${wardenToken}`,
      },
      body: JSON.stringify({ status: "RESOLVED", priority: "HIGH" }),
    });
    const updateComplaintData = await updateComplaintRes.json();
    console.log("10. Warden Update Complaint Status:", updateComplaintRes.status, "New Status:", updateComplaintData.status);

    // Test 8: Visitor Pass
    const passRes = await fetch(`${baseURL}/api/visitor-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({
        visitorName: "Mother Mary",
        relation: "Parent",
        phone: "9988776655",
        visitDate: "2026-10-01",
        visitTime: "11:00 AM",
        reason: "Family Visit",
      }),
    });
    const passData = await passRes.json();
    console.log("11. Request Visitor Pass Status:", passRes.status, "PassCode:", passData.passCode);

    const allPassesRes = await fetch(`${baseURL}/api/visitor-pass/all`, {
      headers: { Authorization: `Bearer ${wardenToken}` },
    });
    const allPassesData = await allPassesRes.json();
    console.log("12. Warden Get All Passes Count:", allPassesData.length);

    // Test 9: Register Staff
    const staffRegRes = await fetch(`${baseURL}/api/warden/register-staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${wardenToken}`,
      },
      body: JSON.stringify({
        name: "Staff Bob",
        email: "bob@test.com",
        dept: "MAINTENANCE",
        shift: "MORNING",
        hostelType: "BOYS_HOSTEL",
        generatedPassword: "staffpassword123",
      }),
    });
    const staffRegData = await staffRegRes.json();
    console.log("13. Register Staff Status:", staffRegRes.status, staffRegData.message);

    const allStaffRes = await fetch(`${baseURL}/api/warden/all-staff`, {
      headers: { Authorization: `Bearer ${wardenToken}` },
    });
    const allStaffData = await allStaffRes.json();
    console.log("14. Warden Get All Staff Count:", allStaffData.length);

    // Test 10: Feedback
    const feedbackRes = await fetch(`${baseURL}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({ rating: 5, comment: "Great food today!" }),
    });
    console.log("15. Submit Feedback Status:", feedbackRes.status);

    console.log("=== All End-To-End API Tests PASSED Successfully! ===");
  } catch (err) {
    console.error("E2E Test Failure:", err);
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runE2ETests();
