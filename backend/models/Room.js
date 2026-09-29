const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    block: { type: String, required: true, default: "A" },
    floor: { type: Number, required: true, default: 1 },
    capacity: { type: Number, required: true, default: 2 },
    occupiedBeds: { type: Number, default: 0 },
    hostelType: {
      type: String,
      enum: ["BOYS_HOSTEL", "GIRLS_HOSTEL"],
      default: "BOYS_HOSTEL",
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "FULL", "MAINTENANCE"],
      default: "AVAILABLE",
    },
    amenities: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
