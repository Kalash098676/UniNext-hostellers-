const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const Notification = require("../models/Notification");

// GET /api/warden/notifications
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/warden/notifications/:id — mark as read
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