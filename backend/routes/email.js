const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");

// POST /api/email/send-staff-credentials
router.post("/send-staff-credentials", auth, async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    // stub — just log for now
    console.log("Email stub called:");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Body:", body);

    res.json({ message: "Email sent successfully (stub)" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;