import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
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
  shares: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    default: "0.00",
  },
});

// 📌 Unieke combinatie: 1 speler mag per ticker slechts 1 portfolio entry hebben
PortfolioSchema.index({ playerId: 1, ticker: 1 }, { unique: true });

export default mongoose.model("Portfolio", PortfolioSchema);
