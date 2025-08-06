import express from "express";
import Player from "../models/player.model.js";
import Portfolio from "../models/portfolio.model.js";
import Order from "../models/order.model.js";

const router = express.Router();

// ✅ GET /api/players - alle spelers ophalen
router.get("/", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST /api/players - nieuwe speler aanmaken
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const newPlayer = new Player({ name, cash: 10000 });
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /api/players/:id/summary - speler overzicht ophalen
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

export default router;
