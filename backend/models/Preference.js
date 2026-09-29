const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    scheduleType: { type: String, enum: ["MORNING_PERSON", "NIGHT_PERSON", "FLEXIBLE"] },
    cleanlinessLevel: { type: String, enum: ["HIGH", "MEDIUM", "LOW"] },
    noisePreference: { type: String, enum: ["QUIET", "OKAY", "NOISY"] },
    studyPreference: { type: String, enum: ["ALONE", "GROUP", "FLEXIBLE"] },
    allergy: { type: String, enum: ["NONE","DIRT", "PERFUME", "OTHERS"] },
    roomTempPreference: { type: String, enum: ["CHILLED", "COOL", "NORMAL", "FLEXIBLE"] },
    roomType: { type: String, enum: [ "TWO", "THREE", "FOUR", "FIVE"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Preference", preferenceSchema);