// routes/trade.routes.js
import express from "express";
import Trade from "../models/trade.model.js";

const router = express.Router();

// GET /api/trades/last-price/:ticker
router.get("/last-price/:ticker", async (req, res) => {
  try {
    const { ticker } = req.params;

    const lastTrade = await Trade.findOne({ ticker: ticker.toUpperCase() })
      .sort({ ts: -1 });

    if (!lastTrade) {
      return res.status(404).json({ error: "No trades found for this ticker" });
    }

    res.json({
      ticker: lastTrade.ticker,
      lastPrice: parseFloat(lastTrade.price.toString()),
      ts: lastTrade.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
