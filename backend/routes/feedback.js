const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const Feedback = require("../models/Feedback");

// POST /api/feedback — student submits feedback
router.post("/", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const feedback = await Feedback.create({
      userId: req.user.id,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/feedback/my — student gets their own feedbacks
router.get("/my", auth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(feedbacks);
  } catch (error) {
    console.error("Get feedbacks error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/feedback — warden gets all feedbacks
router.get("/", auth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Get all feedbacks error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;