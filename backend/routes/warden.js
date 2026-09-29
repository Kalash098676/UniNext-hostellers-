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
const VisitorPass = require("../models/VisitorPass");
const Room = require("../models/Room");
const RoommateMatch = require("../models/RoommateMatch");

// GET /api/warden/profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const profile = await WardenProfile.findOne({ userId: req.user.id });

    res.json({
      id: user._id,
      name: user?.name || "Warden",
      email: user?.email || "",
      contactNo: profile?.contactNo || user?.contactNo || "",
      hostelType: profile?.hostelType || "BOYS_HOSTEL",
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

// GET /api/warden/dashboard - Comprehensive Analytics Overview
router.get("/dashboard", auth, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "ROLE_STUDENT" });
    const studentProfiles = await StudentProfile.find();
    
    const verifiedStudents = studentProfiles.filter(sp => sp.profileComplete).length;
    const pendingVerification = Math.max(0, totalStudents - verifiedStudents);

    // Room stats
    let rooms = await Room.find();
    if (rooms.length === 0) {
      rooms = await Room.insertMany([
        { roomNumber: "101", block: "A", floor: 1, capacity: 2, hostelType: "BOYS_HOSTEL" },
        { roomNumber: "102", block: "A", floor: 1, capacity: 2, hostelType: "BOYS_HOSTEL" },
        { roomNumber: "103", block: "B", floor: 1, capacity: 3, hostelType: "BOYS_HOSTEL" },
        { roomNumber: "201", block: "C", floor: 2, capacity: 2, hostelType: "GIRLS_HOSTEL" },
        { roomNumber: "202", block: "C", floor: 2, capacity: 2, hostelType: "GIRLS_HOSTEL" },
      ]);
    }
    const totalCapacity = rooms.reduce((acc, r) => acc + (r.capacity || 2), 0);
    const occupiedBeds = studentProfiles.filter(sp => sp.roomId && sp.roomId !== "Not Assigned").length;
    const availableBeds = Math.max(0, totalCapacity - occupiedBeds);
    const occupancyPercentage = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

    // Complaints stats
    const complaints = await Complaint.find();
    const pendingComplaints = complaints.filter(c => c.status === "PENDING").length;
    const inProgressComplaints = complaints.filter(c => c.status === "IN_PROGRESS").length;
    const resolvedComplaints = complaints.filter(c => c.status === "RESOLVED").length;
    const urgentComplaints = complaints.filter(c => c.priority === "HIGH").length;

    // Staff stats
    const totalStaff = await User.countDocuments({ role: "ROLE_STAFF" });

    // Visitor passes stats
    const visitorPasses = await VisitorPass.find();
    const pendingPasses = visitorPasses.filter(vp => vp.status === "PENDING").length;

    // Feedback average
    const feedbacks = await Feedback.find();
    const averageRating = feedbacks.length === 0 ? 0 :
      (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);

    // Recent Activity Feed
    const recentStudents = await User.find({ role: "ROLE_STUDENT" }).sort({ createdAt: -1 }).limit(5);
    const recentComplaints = await Complaint.find().sort({ createdAt: -1 }).limit(5);
    const recentPasses = await VisitorPass.find().sort({ createdAt: -1 }).limit(5);

    const activityFeed = [
      ...recentStudents.map(s => ({
        id: s._id,
        type: "STUDENT_REGISTRATION",
        title: `New Student Registered: ${s.name}`,
        time: s.createdAt,
        badge: "New Student",
      })),
      ...recentComplaints.map(c => ({
        id: c._id,
        type: "COMPLAINT",
        title: `Complaint: ${c.title} (${c.status})`,
        time: c.createdAt,
        badge: c.priority,
      })),
      ...recentPasses.map(p => ({
        id: p._id,
        type: "VISITOR_PASS",
        title: `Visitor Pass: ${p.visitorName} (${p.status})`,
        time: p.createdAt,
        badge: p.status,
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

    res.json({
      totalStudents,
      verifiedStudents,
      pendingVerification,
      totalRooms: rooms.length,
      occupiedBeds,
      availableBeds,
      occupancyPercentage,
      totalComplaints: complaints.length,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      urgentComplaints,
      totalStaff,
      pendingPasses,
      averageRating,
      activityFeed,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/warden/all-students
router.get("/all-students", auth, async (req, res) => {
  try {
    const { search, branch, year, hostelType, status } = req.query;

    let userQuery = { role: "ROLE_STUDENT" };
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const students = await User.find(userQuery).select("-password").sort({ createdAt: -1 });

    let studentsWithProfiles = await Promise.all(
      students.map(async (student) => {
        const profile = await StudentProfile.findOne({ userId: student._id });
        return {
          id: student._id,
          name: student.name,
          email: student.email,
          contactNo: student.contactNo || "N/A",
          room: profile?.roomId || "Not Assigned",
          gender: profile?.gender || "N/A",
          branch: profile?.branch || "N/A",
          year: profile?.year || "N/A",
          hostelType: profile?.hostelType || "BOYS_HOSTEL",
          parentContactNo: profile?.parentContactNo || "N/A",
          profileComplete: profile?.profileComplete || false,
          status: profile?.profileComplete ? "VERIFIED" : "PENDING",
          registrationDate: student.createdAt ? student.createdAt.toISOString().split("T")[0] : "N/A",
        };
      })
    );

    if (branch) studentsWithProfiles = studentsWithProfiles.filter(s => s.branch === branch);
    if (year) studentsWithProfiles = studentsWithProfiles.filter(s => String(s.year) === String(year));
    if (hostelType) studentsWithProfiles = studentsWithProfiles.filter(s => s.hostelType === hostelType);
    if (status) studentsWithProfiles = studentsWithProfiles.filter(s => s.status === status);

    res.json(studentsWithProfiles);
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/warden/register-student
router.post("/register-student", auth, async (req, res) => {
  try {
    const { name, email, password, contactNo, branch, year, gender, hostelType, roomId, parentContactNo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNo,
      role: "ROLE_STUDENT",
    });

    await StudentProfile.create({
      userId: user._id,
      branch: branch || "Computer Science",
      year: year || 1,
      gender: gender || "MALE",
      hostelType: hostelType || "BOYS_HOSTEL",
      roomId: roomId || "Not Assigned",
      parentContactNo: parentContactNo || "",
      profileComplete: true,
    });

    if (roomId && roomId !== "Not Assigned") {
      await Room.findOneAndUpdate({ roomNumber: roomId }, { $inc: { occupiedBeds: 1 } });
    }

    res.status(201).json({ message: "Student registered successfully", userId: user._id });
  } catch (error) {
    console.error("Register student error:", error);
    res.status(500).json({ message: "Server error registering student" });
  }
});

// PUT /api/warden/student/:id
router.put("/student/:id", auth, async (req, res) => {
  try {
    const { name, email, contactNo, branch, year, gender, hostelType, roomId, parentContactNo, profileComplete } = req.body;

    await User.findByIdAndUpdate(req.params.id, { name, email, contactNo });

    let profile = await StudentProfile.findOne({ userId: req.params.id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.params.id });
    }

    const oldRoom = profile.roomId;
    profile.branch = branch;
    profile.year = year;
    profile.gender = gender;
    profile.hostelType = hostelType;
    profile.roomId = roomId;
    profile.parentContactNo = parentContactNo;
    if (profileComplete !== undefined) profile.profileComplete = profileComplete;

    await profile.save();

    if (oldRoom !== roomId) {
      if (oldRoom && oldRoom !== "Not Assigned") {
        await Room.findOneAndUpdate({ roomNumber: oldRoom }, { $inc: { occupiedBeds: -1 } });
      }
      if (roomId && roomId !== "Not Assigned") {
        await Room.findOneAndUpdate({ roomNumber: roomId }, { $inc: { occupiedBeds: 1 } });
      }
    }

    res.json({ message: "Student record updated successfully" });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ message: "Server error updating student" });
  }
});

// PUT /api/warden/student/:id/verify
router.put("/student/:id/verify", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const profile = await StudentProfile.findOne({ userId: req.params.id });

    if (!profile) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    profile.profileComplete = status === "VERIFIED";
    await profile.save();

    res.json({ message: `Student status updated to ${status}` });
  } catch (error) {
    console.error("Verify student error:", error);
    res.status(500).json({ message: "Server error updating verification status" });
  }
});

// DELETE /api/warden/student/:id
router.delete("/student/:id", auth, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.params.id });
    if (profile && profile.roomId && profile.roomId !== "Not Assigned") {
      await Room.findOneAndUpdate({ roomNumber: profile.roomId }, { $inc: { occupiedBeds: -1 } });
    }

    await User.findByIdAndDelete(req.params.id);
    await StudentProfile.findOneAndDelete({ userId: req.params.id });
    await Preference.findOneAndDelete({ userId: req.params.id });
    await Complaint.deleteMany({ userId: req.params.id });
    await VisitorPass.deleteMany({ userId: req.params.id });

    res.json({ message: "Student record deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ message: "Server error deleting student" });
  }
});

// --- ROOM MANAGEMENT ENDPOINTS ---

// GET /api/warden/rooms
router.get("/rooms", auth, async (req, res) => {
  try {
    let rooms = await Room.find().sort({ roomNumber: 1 });

    if (rooms.length === 0) {
      const defaultRooms = [
        { roomNumber: "101", block: "A", floor: 1, capacity: 2, hostelType: "BOYS_HOSTEL" },
        { roomNumber: "102", block: "A", floor: 1, capacity: 2, hostelType: "BOYS_HOSTEL" },
        { roomNumber: "103", block: "B", floor: 1, capacity: 3, hostelType: "BOYS_HOSTEL" },
        { roomNumber: "201", block: "C", floor: 2, capacity: 2, hostelType: "GIRLS_HOSTEL" },
        { roomNumber: "202", block: "C", floor: 2, capacity: 2, hostelType: "GIRLS_HOSTEL" },
      ];
      rooms = await Room.insertMany(defaultRooms);
    }

    const roomsWithOccupants = await Promise.all(
      rooms.map(async (room) => {
        const studentProfiles = await StudentProfile.find({ roomId: room.roomNumber });
        const occupants = await Promise.all(
          studentProfiles.map(async (sp) => {
            const u = await User.findById(sp.userId).select("name email contactNo");
            return { id: sp.userId, name: u?.name || "Student", email: u?.email || "", branch: sp.branch, year: sp.year };
          })
        );

        return {
          id: room._id,
          roomNumber: room.roomNumber,
          block: room.block,
          floor: room.floor,
          capacity: room.capacity,
          occupiedBeds: occupants.length,
          hostelType: room.hostelType,
          status: occupants.length >= room.capacity ? "FULL" : room.status,
          occupants,
        };
      })
    );

    res.json(roomsWithOccupants);
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({ message: "Server error fetching rooms" });
  }
});

// POST /api/warden/rooms - Create or Update Room
router.post("/rooms", auth, async (req, res) => {
  try {
    const { roomNumber, block, floor, capacity, hostelType } = req.body;

    if (!roomNumber) return res.status(400).json({ message: "Room number is required" });

    const cleanRoomNum = String(roomNumber).trim();
    const cleanBlock = block ? String(block).replace(/Block\s*/i, "").trim() : "A";

    let existing = await Room.findOne({ roomNumber: cleanRoomNum });
    if (existing) {
      existing.block = cleanBlock;
      existing.floor = Number(floor) || 1;
      existing.capacity = Number(capacity) || 2;
      existing.hostelType = hostelType || "BOYS_HOSTEL";
      await existing.save();
      return res.status(200).json({ message: `Room ${cleanRoomNum} updated successfully!`, room: existing });
    }

    const room = await Room.create({
      roomNumber: cleanRoomNum,
      block: cleanBlock,
      floor: Number(floor) || 1,
      capacity: Number(capacity) || 2,
      hostelType: hostelType || "BOYS_HOSTEL",
      status: "AVAILABLE",
    });

    res.status(201).json({ message: `Room ${cleanRoomNum} created successfully!`, room });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ message: "Error creating room: " + error.message });
  }
});

// PUT /api/warden/rooms/:id
router.put("/rooms/:id", auth, async (req, res) => {
  try {
    const { roomNumber, block, floor, capacity, hostelType, status } = req.body;
    const cleanBlock = block ? String(block).replace(/Block\s*/i, "").trim() : "A";

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { roomNumber: String(roomNumber).trim(), block: cleanBlock, floor: Number(floor), capacity: Number(capacity), hostelType, status },
      { returnDocument: "after" }
    );

    res.json({ message: "Room updated successfully", room });
  } catch (error) {
    console.error("Update room error:", error);
    res.status(500).json({ message: "Server error updating room" });
  }
});

// POST /api/warden/rooms/allocate - Bulletproof Allocation
router.post("/rooms/allocate", auth, async (req, res) => {
  try {
    const { studentId, roomNumber } = req.body;

    if (!studentId || !roomNumber) {
      return res.status(400).json({ message: "Student and room number are required" });
    }

    const cleanRoomNum = String(roomNumber).trim();

    let room = await Room.findOne({ roomNumber: cleanRoomNum });
    if (!room) {
      room = await Room.create({
        roomNumber: cleanRoomNum,
        block: "A",
        floor: 1,
        capacity: 2,
        hostelType: "BOYS_HOSTEL",
      });
    }

    let profile = await StudentProfile.findOne({ userId: studentId });
    if (!profile) {
      profile = await StudentProfile.create({
        userId: studentId,
        roomId: cleanRoomNum,
        profileComplete: true,
      });
    } else {
      const oldRoom = profile.roomId;
      profile.roomId = cleanRoomNum;
      await profile.save();

      if (oldRoom && oldRoom !== "Not Assigned" && oldRoom !== cleanRoomNum) {
        await Room.findOneAndUpdate({ roomNumber: oldRoom }, { $inc: { occupiedBeds: -1 } });
      }
    }

    const currentOccupants = await StudentProfile.countDocuments({ roomId: cleanRoomNum });
    room.occupiedBeds = currentOccupants;
    if (room.occupiedBeds >= room.capacity) {
      room.status = "FULL";
    } else {
      room.status = "AVAILABLE";
    }
    await room.save();

    res.json({ message: `Student allocated to room ${cleanRoomNum} successfully`, room });
  } catch (error) {
    console.error("Allocate room error:", error);
    res.status(500).json({ message: "Server error allocating room: " + error.message });
  }
});

// --- STAFF MANAGEMENT ---

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

    res.status(201).json({ message: "Staff registered successfully", staff: { id: user._id, name, email } });
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

// GET /api/warden/reports - Live database report summary
router.get("/reports", auth, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "ROLE_STUDENT" });
    const rooms = await Room.find();
    const complaints = await Complaint.find();
    const visitorPasses = await VisitorPass.find();

    const reportData = {
      timestamp: new Date().toISOString(),
      studentMetrics: {
        total: totalStudents,
        verified: await StudentProfile.countDocuments({ profileComplete: true }),
        pending: await StudentProfile.countDocuments({ profileComplete: false }),
      },
      roomMetrics: {
        totalRooms: rooms.length,
        totalCapacity: rooms.reduce((sum, r) => sum + (r.capacity || 2), 0),
        occupiedBeds: await StudentProfile.countDocuments({ roomId: { $ne: "Not Assigned" } }),
      },
      complaintMetrics: {
        total: complaints.length,
        pending: complaints.filter(c => c.status === "PENDING").length,
        inProgress: complaints.filter(c => c.status === "IN_PROGRESS").length,
        resolved: complaints.filter(c => c.status === "RESOLVED").length,
      },
      visitorPassMetrics: {
        total: visitorPasses.length,
        approved: visitorPasses.filter(vp => vp.status === "APPROVED").length,
        pending: visitorPasses.filter(vp => vp.status === "PENDING").length,
        rejected: visitorPasses.filter(vp => vp.status === "REJECTED").length,
      },
    };

    res.json(reportData);
  } catch (error) {
    console.error("Reports error:", error);
    res.status(500).json({ message: "Server error generating reports" });
  }
});

module.exports = router;