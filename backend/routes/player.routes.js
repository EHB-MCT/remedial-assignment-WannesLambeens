import express from "express";
import Player from "../models/player.model.js";

const router = express.Router();

// POST /api/players
router.post("/", async (req, res) => {
  try {
    const { name, cash } = req.body;

    if (!name || !cash) {
      return res.status(400).json({ error: "Name and cash are required" });
    }

    const player = new Player({ name, cash });
    await player.save();

    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
