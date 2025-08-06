import express from "express";
import Player from "../models/player.model.js";
import Portfolio from "../models/portfolio.model.js";
import Order from "../models/order.model.js";

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


// GET /api/players/:id/summary
router.get("/:id/summary", async (req, res) => {
  const playerId = req.params.id;

  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    const [portfolio, openOrders] = await Promise.all([
      Portfolio.find({ playerId }),
      Order.find({ playerId, status: "OPEN" }),
    ]);

    res.json({
      name: player.name,
      cash: player.cash,
      portfolio,
      openOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
