const mongoose = require("mongoose");

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Error:", err);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");



  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;