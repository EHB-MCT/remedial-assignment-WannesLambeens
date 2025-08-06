import express from "express";
import Order from "../models/order.model.js";
import { orderSchema } from "../validators/order.schema.js";

const router = express.Router();

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    // 1. Validatie
    const parsed = orderSchema.parse(req.body);

    // 2. Extra checks
    if (parsed.type === "MARKET" && parsed.limitPrice) {
      return res.status(400).json({
        error: "Market orders should not include a limitPrice",
      });
    }

    if (parsed.type === "LIMIT" && !parsed.limitPrice) {
      return res.status(400).json({
        error: "Limit orders must include a limitPrice",
      });
    }

    // 3. Order aanmaken
    const order = await Order.create({
      ...parsed,
      remaining: parsed.quantity,
    });

    res.status(201).json(order);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors });
    }
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
