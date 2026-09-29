const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    branch: { type: String },
    year: { type: Number },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    hostelType: { type: String, enum: ["BOYS_HOSTEL", "GIRLS_HOSTEL"] },
    roomId: { type: String },
    parentContactNo: { type: String },
    profileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);