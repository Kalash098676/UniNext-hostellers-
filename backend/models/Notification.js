const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["NEW_STUDENT", "NEW_COMPLAINT", "NEW_FEEDBACK", "GENERAL"],
      default: "GENERAL",
    },
    unread: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);