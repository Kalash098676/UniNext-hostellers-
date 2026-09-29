const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNo: { type: String },
    role: {
      type: String,
      enum: ["ROLE_STUDENT", "ROLE_WARDEN", "ROLE_STAFF"],
      default: "ROLE_STUDENT",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);