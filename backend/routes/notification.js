const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const Notification = require("../models/Notification");

// GET all notifications (supports GET / and GET /all)
router.get(["/", "/all"], auth, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create notification
router.post("/", auth, async (req, res) => {
  try {
    const { message, type } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const notification = await Notification.create({
      message,
      type: type || "GENERAL",
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT mark as read
router.put("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { unread: false },
      { returnDocument: "after" }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Update notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;