const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");

// GET /api/student/profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const profile = await StudentProfile.findOne({ userId: req.user.id });

    res.json({
      name: user.name,
      email: user.email,
      contactNo: user.contactNo,
      branch: profile?.branch || null,
      year: profile?.year || null,
      gender: profile?.gender || null,
      hostelType: profile?.hostelType || null,
      roomId: profile?.roomId || null,
      parentContactNo: profile?.parentContactNo || null,
      profileComplete: profile?.profileComplete || false,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/student/profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { branch, year, gender, hostelType, parentContactNo } = req.body;

    let profile = await StudentProfile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = new StudentProfile({ userId: req.user.id });
    }

    profile.branch = branch || profile.branch;
    profile.year = year || profile.year;
    profile.gender = gender || profile.gender;
    profile.hostelType = hostelType || profile.hostelType;
    profile.parentContactNo = parentContactNo || profile.parentContactNo;
    profile.profileComplete = true;

    await profile.save();

    res.json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;