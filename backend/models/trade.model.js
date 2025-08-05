import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  quantity: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  ts: {
    type: Date,
    default: Date.now,
  },
  buyOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  sellOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
});

// 📌 Index voor snelle opzoeking van trades per ticker, chronologisch
TradeSchema.index({ ticker: 1, ts: 1 });

export default mongoose.model("Trade", TradeSchema);
