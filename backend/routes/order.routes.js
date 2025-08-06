import express from "express";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import { orderSchema } from "../schemas/order.schema.js";

const router = express.Router();

// ✅ POST /api/orders - Plaats een nieuwe order
router.post("/", async (req, res) => {
  try {
    const parsed = orderSchema.parse(req.body);

    const order = new Order({
      playerId: parsed.playerId,
      ticker: parsed.ticker,
      side: parsed.side,
      type: parsed.type,
      quantity: mongoose.Types.Decimal128.fromString(parsed.quantity),
      remaining: mongoose.Types.Decimal128.fromString(parsed.quantity),
      limitPrice: parsed.limitPrice
        ? mongoose.Types.Decimal128.fromString(parsed.limitPrice)
        : null,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET /api/orders - (optioneel) lijst alle orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
