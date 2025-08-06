import express from "express";
import { applyTick } from "../services/tick.service.js";

const router = express.Router();

// POST /api/admin/tick
router.post("/tick", async (req, res) => {
  try {
    const result = await applyTick(); // 👉 matching + prijs
    res.json({ status: "tick applied", ...result });
  } catch (err) {
    console.error("❌ Tick failed:", err);
    res.status(500).json({ error: "Tick failed" });
  }
});

export default router;
