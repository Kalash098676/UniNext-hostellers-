const mongoose = require("mongoose");

const visitorPassSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visitorName: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
    visitDate: { type: String, required: true },
    visitTime: { type: String, required: true },
    reason: { type: String, required: true },
    passCode: { type: String, required: true },
    status: {
      type: String,
      enum: ["APPROVED", "PENDING", "REJECTED", "EXPIRED"],
      default: "APPROVED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VisitorPass", visitorPassSchema);
