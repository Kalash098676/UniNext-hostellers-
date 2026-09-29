
require("dotenv").config();
const mongoose = require("mongoose");

// Import your existing Mongoose models
const User = require("./models/User");
const StudentProfile = require("./models/StudentProfile");
const WardenProfile = require("./models/WardenProfile");
const StaffProfile = require("./models/StaffProfile");
const Complaint = require("./models/Complaint");
const Feedback = require("./models/Feedback");
const Menu = require("./models/Menu");
const Notification = require("./models/Notification");
const Preference = require("./models/Preference");
const RoommateMatch = require("./models/RoommateMatch");
const VisitorPass = require("./models/VisitorPass");

const models = [
  User,
  StudentProfile,
  WardenProfile,
  StaffProfile,
  Complaint,
  Feedback,
  Menu,
  Notification,
  Preference,
  RoommateMatch,
  VisitorPass,
];

async function setupAtlas() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB Atlas");
    console.log("Database:", mongoose.connection.name);

    for (const Model of models) {
      const collectionName = Model.collection.collectionName;

      try {
        await Model.createCollection();
        console.log("Created collection:", collectionName);
      } catch (error) {
        if (
          error.code === 48 ||
          error.codeName === "NamespaceExists"
        ) {
          console.log("Collection already exists:", collectionName);
        } else {
          throw error;
        }
      }

      await Model.createIndexes();
      console.log("Indexes checked:", collectionName);
    }

    console.log("Atlas setup completed successfully!");
  } catch (error) {
    console.error("Atlas setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

setupAtlas();