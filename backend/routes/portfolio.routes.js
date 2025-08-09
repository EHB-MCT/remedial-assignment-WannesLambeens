import express from "express";
import Player from "../models/player.model.js";

const router = express.Router();

router.post("/buy", async (req, res) => {
  const { playerId, ticker, price, quantity } = req.body;

  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const totalCost = price * quantity;
    if (player.cash < totalCost) {
      return res.status(400).json({ message: "Not enough cash" });
    }

    // Zoek of aandeel al in portfolio zit
    const stock = player.portfolio.find((item) => item.ticker === ticker);
    if (stock) {
      stock.quantity += quantity;
    } else {
      player.portfolio.push({ ticker, quantity });
    }

    player.cash -= totalCost;

    await player.save();

    res.status(200).json({ message: "Stock purchased successfully", cash: player.cash, portfolio: player.portfolio });
  } catch (err) {
    console.error("Buy failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/sell", async (req, res) => {
  const { playerId, ticker, quantity, price } = req.body;

  if (!playerId || !ticker || !quantity || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: "Player not found" });

    const holding = player.portfolio.find((item) => item.ticker === ticker);
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ error: "Not enough shares to sell" });
    }

    // Update quantity or remove from portfolio
    if (holding.quantity === quantity) {
      player.portfolio = player.portfolio.filter((item) => item.ticker !== ticker);
    } else {
      holding.quantity -= quantity;
    }

    player.cash += quantity * price;

    await player.save();
    res.status(200).json({ message: "Sale successful", portfolio: player.portfolio, cash: player.cash });
  } catch (err) {
    console.error("Sell error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
