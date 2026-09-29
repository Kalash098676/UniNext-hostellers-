const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const Complaint = require("../models/Complaint");

// POST /api/complaint — student files a complaint
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, roomId } = req.body;

    const complaint = await Complaint.create({
      userId: req.user.id,
      title,
      description,
      roomId,
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error("Complaint error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /api/complaint/my — student gets their own complaints
router.get("/my", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(complaints);
  } catch (error) {
    console.error("Get complaints error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /api/complaint — warden gets all complaints
router.get("/", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error("Get all complaints error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// PUT /api/complaint/:id — warden updates complaint status
router.put("/:id", auth, async (req, res) => {
  try {
    const { status, priority } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, priority },
      { returnDocument: "after" }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    console.error("Update complaint error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;