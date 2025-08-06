// portfolio.service.js
import Portfolio from "../models/portfolio.model.js";
import mongoose from "mongoose";

export async function updatePortfolio(playerId, ticker, quantityChange) {
  const portfolioItem = await Portfolio.findOne({ playerId, ticker });

  if (portfolioItem) {
    portfolioItem.quantity = mongoose.Types.Decimal128.fromString(
      (parseFloat(portfolioItem.quantity) + quantityChange).toFixed(2)
    );

    if (parseFloat(portfolioItem.quantity) <= 0) {
      await Portfolio.deleteOne({ _id: portfolioItem._id });
    } else {
      await portfolioItem.save();
    }
  } else if (quantityChange > 0) {
    await Portfolio.create({
      playerId,
      ticker,
      quantity: mongoose.Types.Decimal128.fromString(quantityChange.toFixed(2)),
    });
  } else {
    throw new Error("Verkoper heeft dit aandeel niet in portefeuille");
  }
}
