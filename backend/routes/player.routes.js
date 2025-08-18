import express from "express";
import Player from "../models/player.model.js";
import Order from "../models/order.model.js";

const router = express.Router();

/**
 * GET /api/players
 */
router.get("/", async (req, res) => {
  try {
    const players = await Player.find({}, { username: 1 }).lean();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/players
 */
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // unieke username check
    const existing = await Player.findOne({ username }).lean();
    if (existing) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const newPlayer = new Player({
      username,
      password,          // wordt gehashed in PlayerSchema.pre('save')
      cash: 10000,
      portfolio: [],
    });

    await newPlayer.save();
    // geef geen password terug
    res.status(201).json({
      _id: newPlayer._id,
      username: newPlayer.username,
      cash: newPlayer.cash,
      portfolio: newPlayer.portfolio,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/players/id/summary
 */
router.get("/:id/summary", async (req, res) => {
  const playerId = req.params.id;

  try {
    const player = await Player.findById(
      playerId,
      { username: 1, cash: 1, portfolio: 1 }
    ).lean();

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    const openOrders = await Order.find(
      { playerId, status: "OPEN" },
      { ticker: 1, side: 1, type: 1, remaining: 1, limitPrice: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      username: player.username,
      cash: Number(player.cash) || 0,
      portfolio: (player.portfolio || []).map((p) => ({
        ticker: p.ticker,
        quantity: Number(p.quantity) || 0,
      })),
      openOrders: openOrders.map((o) => ({
        _id: o._id.toString(),
        ticker: o.ticker,
        side: o.side,
        type: o.type,
        remaining: Number(o.remaining),
        limitPrice: Number(o.limitPrice),
        createdAt: o.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
