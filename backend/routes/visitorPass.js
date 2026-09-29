const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const VisitorPass = require("../models/VisitorPass");
const Notification = require("../models/Notification");

// POST /api/visitor-pass — Request or issue a visitor pass
router.post("/", auth, async (req, res) => {
  try {
    const { studentId, visitorName, relation, phone, visitDate, visitTime, reason, status } = req.body;

    if (!visitorName || !relation || !phone || !visitDate || !visitTime) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const passCode = `VP-${Date.now().toString().slice(-4)}-${randomSuffix}`;

    // Target student: either specified studentId or req.user.id
    const targetUserId = studentId || req.user.id;

    const pass = await VisitorPass.create({
      userId: targetUserId,
      visitorName,
      relation,
      phone,
      visitDate,
      visitTime,
      reason: reason || "Personal Visit",
      passCode,
      status: status || "APPROVED",
    });

    const populatedPass = await VisitorPass.findById(pass._id).populate("userId", "name email contactNo");

    await Notification.create({
      message: `Visitor pass issued for ${visitorName} (${passCode})`,
      type: "GENERAL",
    });

    res.status(201).json(populatedPass);
  } catch (error) {
    console.error("Create visitor pass error:", error);
    res.status(500).json({ message: "Server error creating visitor pass" });
  }
});

// GET /api/visitor-pass/my — Get student's visitor passes
router.get("/my", auth, async (req, res) => {
  try {
    const passes = await VisitorPass.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(passes);
  } catch (error) {
    console.error("Get visitor passes error:", error);
    res.status(500).json({ message: "Server error fetching visitor passes" });
  }
});

// GET /api/visitor-pass/all — Get all visitor passes (warden/staff)
router.get("/all", auth, async (req, res) => {
  try {
    const passes = await VisitorPass.find()
      .populate("userId", "name email contactNo")
      .sort({ createdAt: -1 });
    res.json(passes);
  } catch (error) {
    console.error("Get all visitor passes error:", error);
    res.status(500).json({ message: "Server error fetching visitor passes" });
  }
});

// PUT /api/visitor-pass/:id/status — Approve / Reject / Expire pass
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["APPROVED", "PENDING", "REJECTED", "EXPIRED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const pass = await VisitorPass.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    ).populate("userId", "name email");

    if (!pass) {
      return res.status(404).json({ message: "Visitor pass not found" });
    }

    res.json(pass);
  } catch (error) {
    console.error("Update visitor pass status error:", error);
    res.status(500).json({ message: "Server error updating visitor pass status" });
  }
});

// DELETE /api/visitor-pass/:id — Cancel a pass
router.delete("/:id", auth, async (req, res) => {
  try {
    const pass = await VisitorPass.findOneAndDelete({ _id: req.params.id });
    if (!pass) {
      return res.status(404).json({ message: "Pass not found" });
    }
    res.json({ message: "Visitor pass cancelled successfully" });
  } catch (error) {
    console.error("Cancel visitor pass error:", error);
    res.status(500).json({ message: "Server error cancelling pass" });
  }
});

module.exports = router;
