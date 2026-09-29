const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

dotenv.config();

const dns = require("dns");
try {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (e) {
  // Ignore DNS setServers error if not supported in environment
}

connectDB();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during development & testing
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Database health check endpoint
app.get("/api/health", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? "UP" : "DOWN",
    database: mongoose.connection.name || "uninest",
    connectionState: isConnected ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/student", require("./routes/student"));
app.use("/api/preference", require("./routes/preference"));
app.use("/api/complaint", require("./routes/complaint"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/menu", require("./routes/menu"));
app.use("/api/warden/notifications", require("./routes/notification"));
app.use("/api/warden", require("./routes/warden"));
app.use("/api/email", require("./routes/email"));
app.use("/api/matching", require("./routes/matching"));
app.use("/api/visitor-pass", require("./routes/visitorPass"));

app.get("/", (req, res) => res.send("UniNest API is running smoothly"));

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));