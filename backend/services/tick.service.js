import Order from "../models/order.model.js";
import Player from "../models/player.model.js";
import Portfolio from "../models/portfolio.model.js";
import Trade from "../models/trade.model.js";

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
  let pricesUpdated = 0;

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
      if (buyer.cash < tradeValue) continue;

      // Buyer update
      buyer.cash -= tradeValue;
      await Portfolio.findOneAndUpdate(
        { playerId: buyer._id, ticker: buyOrder.ticker },
        { $inc: { shares: quantityToTrade } },
        { upsert: true }
      );
      await buyer.save();

      // Seller update
      seller.cash += tradeValue;
      const portfolioEntry = await Portfolio.findOne({ playerId: seller._id, ticker: sellOrder.ticker });
      if (!portfolioEntry || parseFloat(portfolioEntry.shares.toString()) < quantityToTrade) {
        throw new Error("Verkoper heeft dit aandeel niet in portefeuille");
      }

      portfolioEntry.shares = (
        parseFloat(portfolioEntry.shares.toString()) - quantityToTrade
      ).toFixed(2);
      await portfolioEntry.save();
      await seller.save();

      // Update orders
      buyOrder.remaining = (parseFloat(buyOrder.remaining.toString()) - quantityToTrade).toFixed(2);
      sellOrder.remaining = (parseFloat(sellOrder.remaining.toString()) - quantityToTrade).toFixed(2);

      if (parseFloat(buyOrder.remaining) <= 0) buyOrder.status = "FILLED";
      if (parseFloat(sellOrder.remaining) <= 0) sellOrder.status = "FILLED";

      await buyOrder.save();
      await sellOrder.save();

      // Save trade in DB
      await Trade.create({
        ticker: buyOrder.ticker,
        price: tradePrice,
        quantity: quantityToTrade,
        buyOrderId: buyOrder._id,
        sellOrderId: sellOrder._id,
      });

      tradesMatched += 1;
      pricesUpdated += 1;
    }
  }

  return {
    status: "tick applied",
    buyOrdersCount: buyOrders.length,
    sellOrdersCount: sellOrders.length,
    tradesMatched,
    pricesUpdated,
  };
}
