const mongoose = require("mongoose");

const roommateMatchSchema = new mongoose.Schema(
  {
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    hostelType: {
      type: String,
      enum: ["BOYS_HOSTEL", "GIRLS_HOSTEL"],
      required: true,
    },
    roomType: {
      type: String,
      enum: ["TWO", "THREE", "FOUR", "FIVE"],
      required: true,
    },
    compatibilityScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["INCOMPLETE", "COMPLETE", "CONFIRMED"],
      default: "INCOMPLETE",
    },
    roomId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RoommateMatch", roommateMatchSchema);
