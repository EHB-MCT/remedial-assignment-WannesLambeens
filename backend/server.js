// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import playerRoutes from "./routes/player.routes.js"; // POST /api/players

dotenv.config();

const app = express();

// ----- Config -----
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// ----- Middleware -----
app.use(cors());
app.use(express.json()); // parse JSON bodies

// ----- Healthcheck -----
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ----- API Routes -----
app.use("/api/players", playerRoutes);

// ----- 404 fallback -----
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ----- Global error handler -----
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ----- DB connect & start -----
async function start() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      // options optional in modern mongoose
    });
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
}

start();
