import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Player from "../models/player.model.js";
import { updatePortfolio } from "./portfolio.service.js"; // zorg dat dit bestaat

export async function applyTick() {
  const buyOrders = await Order.find({ side: "BUY", status: "OPEN", type: "LIMIT" }).sort({
    limitPrice: -1,
    createdAt: 1,
  });

  const sellOrders = await Order.find({ side: "SELL", status: "OPEN", type: "LIMIT" }).sort({
    limitPrice: 1,
    createdAt: 1,
  });

  let tradesMatched = 0;

  for (const buyOrder of buyOrders) {
    for (const sellOrder of sellOrders) {
      if (
        buyOrder.ticker !== sellOrder.ticker ||
        sellOrder.status !== "OPEN" ||
        buyOrder.status !== "OPEN"
      ) {
        continue;
      }

      const buyPrice = parseFloat(buyOrder.limitPrice.toString());
      const sellPrice = parseFloat(sellOrder.limitPrice.toString());

      if (buyPrice < sellPrice) continue;

      const quantityToTrade = Math.min(
        parseFloat(buyOrder.remaining.toString()),
        parseFloat(sellOrder.remaining.toString())
      );

      const tradePrice = sellPrice;
      const tradeValue = quantityToTrade * tradePrice;

      const buyer = await Player.findById(buyOrder.playerId);
      const seller = await Player.findById(sellOrder.playerId);

      if (!buyer || !seller) continue;

      const buyerCash = parseFloat(buyer.cash.toString());

      if (buyerCash < tradeValue) continue;

      // ✅ Cash updates
      buyer.cash = mongoose.Types.Decimal128.fromString((buyerCash - tradeValue).toFixed(2));
      seller.cash = mongoose.Types.Decimal128.fromString(
        (parseFloat(seller.cash.toString()) + tradeValue).toFixed(2)
      );

      await buyer.save();
      await seller.save();

      // ✅ Portfolio updates
      await updatePortfolio(buyer._id, buyOrder.ticker, quantityToTrade);      // koper krijgt aandelen
      await updatePortfolio(seller._id, sellOrder.ticker, -quantityToTrade);   // verkoper verliest aandelen

      // ✅ Order updates
      buyOrder.remaining = mongoose.Types.Decimal128.fromString(
        (parseFloat(buyOrder.remaining.toString()) - quantityToTrade).toFixed(2)
      );
      sellOrder.remaining = mongoose.Types.Decimal128.fromString(
        (parseFloat(sellOrder.remaining.toString()) - quantityToTrade).toFixed(2)
      );

      if (parseFloat(buyOrder.remaining.toString()) <= 0) {
        buyOrder.status = "FILLED";
      }

      if (parseFloat(sellOrder.remaining.toString()) <= 0) {
        sellOrder.status = "FILLED";
      }

      await buyOrder.save();
      await sellOrder.save();

      tradesMatched += 1;
    }
  }

  return {
    status: "tick applied",
    buyOrdersCount: buyOrders.length,
    sellOrdersCount: sellOrders.length,
    tradesMatched,
  };
}
