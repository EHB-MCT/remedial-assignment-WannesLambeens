import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  side: {
    type: String,
    enum: ["BUY", "SELL"],
    required: true,
  },
  type: {
    type: String,
    enum: ["LIMIT", "MARKET"],
    required: true,
  },
  quantity: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  remaining: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  limitPrice: {
    type: mongoose.Schema.Types.Decimal128,
    default: null,
  },
  status: {
    type: String,
    enum: ["OPEN", "FILLED", "CANCELLED"],
    default: "OPEN",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 📌 Index: snel zoeken op orderboek (per ticker, status, type)
OrderSchema.index(
  { ticker: 1, status: 1, side: 1, limitPrice: 1, createdAt: 1 },
  {
    collation: { locale: "en", strength: 2 },
  }
);

export default mongoose.model("Order", OrderSchema);
