import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// ⬇️ Load environment variables from .env
dotenv.config();

// ⬇️ Create Express app
const app = express();

// ⬇️ Enable JSON request parsing
app.use(express.json());

// ⬇️ Environment variables
const { PORT = 3000, MONGODB_URI } = process.env;

// ⬇️ Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // ⬇️ Start Express server only after DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop server if DB fails
  });

// Optional: basic health check route
app.get("/", (req, res) => {
  res.send("📈 Stock webgame backend is running!");
});
