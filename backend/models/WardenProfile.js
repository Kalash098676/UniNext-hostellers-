const mongoose = require("mongoose");

const wardenProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    contactNo: { type: String },
    hostelType: { type: String, enum: ["BOYS_HOSTEL", "GIRLS_HOSTEL"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WardenProfile", wardenProfileSchema);