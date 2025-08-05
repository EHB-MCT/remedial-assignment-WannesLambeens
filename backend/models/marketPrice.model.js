import mongoose from "mongoose";

const MarketPriceSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("MarketPrice", MarketPriceSchema);
