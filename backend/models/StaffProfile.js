const mongoose = require("mongoose");

const staffProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    dept: {
      type: String,
      enum: ["MAINTENANCE", "SECURITY", "HOUSEKEEPING", "MESS", "CLEANING", "LAUNDRY"],
    },
    shift: {
      type: String,
      enum: ["MORNING", "AFTERNOON", "NIGHT", "FULL_DAY"],
    },
    hostelType: { type: String, enum: ["BOYS_HOSTEL", "GIRLS_HOSTEL"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StaffProfile", staffProfileSchema);