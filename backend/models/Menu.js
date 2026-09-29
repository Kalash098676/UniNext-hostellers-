const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    meals: {
      MONDAY: {
        BREAKFAST: [String],
        LUNCH: [String],
        SNACKS: [String],
        DINNER: [String],
      },
      TUESDAY: {
        BREAKFAST: [String],
        LUNCH: [String],
        SNACKS: [String],
        DINNER: [String],
      },
      WEDNESDAY: {
        BREAKFAST: [String],
        LUNCH: [String],
        SNACKS: [String],
        DINNER: [String],
      },
      THURSDAY: {
        BREAKFAST: [String],
        LUNCH: [String],
        SNACKS: [String],
        DINNER: [String],
      },
      FRIDAY: {
        BREAKFAST: [String],
        LUNCH: [String],
        SNACKS: [String],
        DINNER: [String],
      },
      SATURDAY: {
        BREAKFAST: [String],
        LUNCH: [String],
        SNACKS: [String],
        DINNER: [String],
      },
      SUNDAY: {
        BREAKFAST: [String],
        LUNCH: [String],
        SNACKS: [String],
        DINNER: [String],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);