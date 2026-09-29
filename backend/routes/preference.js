const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const Preference = require("../models/Preference");

// POST /api/preference
router.post("/", auth, async (req, res) => {
  try {
    const {
      scheduleType,
      cleanlinessLevel,
      noisePreference,
      studyPreference,
      allergy,
      roomTempPreference,
      roomType,
    } = req.body;

    let preference = await Preference.findOne({ userId: req.user.id });

    if (!preference) {
      preference = new Preference({ userId: req.user.id });
    }

    preference.scheduleType = scheduleType;
    preference.cleanlinessLevel = cleanlinessLevel;
    preference.noisePreference = noisePreference;
    preference.studyPreference = studyPreference;
    preference.allergy = allergy;
    preference.roomTempPreference = roomTempPreference;
    preference.roomType = roomType;

    await preference.save();

    res.status(201).json({ message: "Preferences saved successfully", preference });
  } catch (error) {
    console.error("Preference error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/preference
router.get("/", auth, async (req, res) => {
  try {
    const preference = await Preference.findOne({ userId: req.user.id });
    if (!preference) {
      // return res.status(404).json({ message: "No preferences found" });
       return res.status(200).json(null);
    }
    res.json(preference);
  } catch (error) {
    console.error("Get preference error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;