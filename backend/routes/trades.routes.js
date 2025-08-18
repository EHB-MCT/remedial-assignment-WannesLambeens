import express from "express";
import Trade from "../models/trade.model.js";

const router = express.Router();

router.get("/last-price/:ticker", async (req, res) => {
  try {
    const { ticker } = req.params;

    const lastTrade = await Trade.findOne({ ticker: ticker.toUpperCase() })
      .sort({ ts: -1, createdAt: -1 });

    if (!lastTrade) {
      return res.status(404).json({ error: "No trades found for this ticker" });
    }

    res.json({
      ticker: lastTrade.ticker,
      lastPrice: parseFloat(lastTrade.price.toString()),
      ts: lastTrade.ts ?? lastTrade.createdAt ?? null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/latest", async (_req, res) => {
  try {
    const rows = await Trade.aggregate([
      // sorteer zodat per ticker de nieuwste trade eerst komt
      { $sort: { ticker: 1, ts: -1, createdAt: -1 } },
      {
        $group: {
          _id: "$ticker",
          ticker: { $first: "$ticker" },
          price: { $first: "$price" }, // Decimal128
          createdAt: { $first: { $ifNull: ["$ts", "$createdAt"] } },
        },
      },
      {
        $project: {
          _id: 0,
          ticker: 1,
          price: { $toDouble: "$price" }, // Decimal128 -> Number
          createdAt: 1,
        },
      },
      { $sort: { ticker: 1 } },
    ]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
