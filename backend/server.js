// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import playerRoutes from "./routes/player.routes.js";
import symbolRoutes from "./routes/symbol.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import tradeRoutes from "./routes/trades.routes.js";
import authRoutes from "./routes/auth.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";

import { startMatchingLoop } from "./services/tick.service.js";

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
app.use("/api/symbols", symbolRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

// ----- 404 fallback -----
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ----- Global error handler -----
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ----- DB connect & server start -----
async function start() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    startMatchingLoop();

    const server = app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });

    const shutdown = () => {
      console.log("Shutting down...");
      server.close(() => mongoose.connection.close(false, () => process.exit(0)));
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
}

start();
