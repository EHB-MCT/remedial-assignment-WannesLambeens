import express from "express";
import Symbol from "../models/symbol.model.js";

const router = express.Router();

// GET /api/symbols
router.get("/", async (req, res) => {
  try {
    const symbols = await Symbol.find();
    res.json(symbols);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
