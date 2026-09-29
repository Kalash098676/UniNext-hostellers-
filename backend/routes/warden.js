const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const WardenProfile = require("../models/WardenProfile");
const StaffProfile = require("../models/StaffProfile");
const StudentProfile = require("../models/StudentProfile");
const Preference = require("../models/Preference");
const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");
const Notification = require("../models/Notification");

// GET /api/warden/profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const profile = await WardenProfile.findOne({ userId: req.user.id });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      contactNo: profile?.contactNo || user.contactNo,
      hostelType: profile?.hostelType || null,
    });
  } catch (error) {
    console.error("Get warden profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/warden/update-profile
router.put("/update-profile", auth, async (req, res) => {
  try {
    const { name, email, contactNo, hostelType } = req.body;

    await User.findByIdAndUpdate(req.user.id, { name, email, contactNo });

    let profile = await WardenProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new WardenProfile({ userId: req.user.id });
    }
    profile.contactNo = contactNo;
    profile.hostelType = hostelType;
    await profile.save();

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update warden profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/warden/update-profile/update-password
router.put("/update-profile/update-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/warden/all-students
router.get("/all-students", auth, async (req, res) => {
  try {
    const students = await User.find({ role: "ROLE_STUDENT" }).select("-password");

    const studentsWithProfiles = await Promise.all(
      students.map(async (student) => {
        const profile = await StudentProfile.findOne({ userId: student._id });
        return {
          id: student._id,
          name: student.name,
          email: student.email,
          avatar: "👤",
          room: profile?.roomId || "Not Assigned",
          date: student.createdAt.toISOString().split("T")[0],
          status: profile?.profileComplete ? "Active" : "Pending",
          gender: profile?.gender || null,
          branch: profile?.branch || null,
          year: profile?.year || null,
        };
      })
    );

    res.json(studentsWithProfiles);
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/warden/student/:id
router.get("/student/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Student not found" });

    const profile = await StudentProfile.findOne({ userId: req.params.id });
    const preference = await Preference.findOne({ userId: req.params.id });

    res.json({ user, profile, preference });
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/warden/all-staff
router.get("/all-staff", auth, async (req, res) => {
  try {
    const staffMembers = await User.find({ role: "ROLE_STAFF" }).select("-password");

    const staffWithProfiles = await Promise.all(
      staffMembers.map(async (staff) => {
        const profile = await StaffProfile.findOne({ userId: staff._id });
        return {
          id: staff._id,
          name: staff.name,
          email: staff.email,
          dept: profile?.dept || "MAINTENANCE",
          shift: profile?.shift || "MORNING",
          hostelType: profile?.hostelType || "BOYS_HOSTEL",
          createdAt: staff.createdAt,
        };
      })
    );

    res.json(staffWithProfiles);
  } catch (error) {
    console.error("Get all staff error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/warden/register-staff
router.post("/register-staff", auth, async (req, res) => {
  try {
    const { name, email, dept, shift, hostelType, generatedPassword } = req.body;

    if (!name || !email || !generatedPassword) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "ROLE_STAFF",
    });

    await StaffProfile.create({
      userId: user._id,
      dept: dept || "MAINTENANCE",
      shift: shift || "MORNING",
      hostelType: hostelType || "BOYS_HOSTEL",
    });

    await Notification.create({
      message: `New staff member ${name} added`,
      type: "GENERAL",
    });

    res.status(201).json({ message: "Staff registered successfully", staff: { id: user._id, name, email, dept, shift, hostelType } });
  } catch (error) {
    console.error("Register staff error:", error);
    res.status(500).json({ message: "Server error registering staff" });
  }
});

// DELETE /api/warden/staff/:id
router.delete("/staff/:id", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await StaffProfile.findOneAndDelete({ userId: req.params.id });
    res.json({ message: "Staff member removed successfully" });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({ message: "Server error deleting staff" });
  }
});

// GET /api/warden/dashboard
router.get("/dashboard", auth, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "ROLE_STUDENT" });
    const complaints = await Complaint.find();
    const feedbacks = await Feedback.find();

    const pendingComplaints = complaints.filter(c => c.status === "PENDING").length;
    const urgentComplaints = complaints.filter(c => c.priority === "HIGH").length;
    const inProgressComplaints = complaints.filter(c => c.status === "IN_PROGRESS").length;

    const averageRating = feedbacks.length === 0 ? 0 :
      (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);

    res.json({
      totalStudents,
      pendingComplaints,
      urgentComplaints,
      inProgressComplaints,
      averageRating,
      maxRating: 5,
      todayRating: averageRating,
      pendingMatches: 0,
      completedMatches: 0,
      studentGrowth: "+New",
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;