import Order from "../models/order.model.js";
import Player from "../models/player.model.js";
import Portfolio from "../models/portfolio.model.js";
import Trade from "../models/trade.model.js";

const num = (v) => Number(typeof v?.toString === "function" ? v.toString() : v || 0);

async function incEmbeddedPortfolio(player, ticker, deltaQty) {
  const i = player.portfolio.findIndex((p) => p.ticker === ticker);
  if (i === -1) {
    if (deltaQty > 0) player.portfolio.push({ ticker, quantity: deltaQty });
  } else {
    player.portfolio[i].quantity = num(player.portfolio[i].quantity) + deltaQty;
    if (player.portfolio[i].quantity <= 0) player.portfolio.splice(i, 1);
  }
}


export async function applyTick() {
  const buyOrders = await Order.find({
    side: "BUY",
    status: "OPEN",
    type: "LIMIT",
  }).sort({ limitPrice: -1, createdAt: 1 });

  const sellOrders = await Order.find({
    side: "SELL",
    status: "OPEN",
    type: "LIMIT",
  }).sort({ limitPrice: 1, createdAt: 1 });

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

      const buyPrice = num(buyOrder.limitPrice);
      const sellPrice = num(sellOrder.limitPrice);
      if (buyPrice < sellPrice) continue;

      const buyRem = num(buyOrder.remaining);
      const sellRem = num(sellOrder.remaining);
      if (buyRem <= 0 || sellRem <= 0) continue;

      const quantityToTrade = Math.min(buyRem, sellRem);
      const tradePrice = sellPrice;
      const tradeValue = quantityToTrade * tradePrice;

      const buyer = await Player.findById(buyOrder.playerId);
      const seller = await Player.findById(sellOrder.playerId);
      if (!buyer || !seller) continue;

      // Ensure buyer still has cash
      if (num(buyer.cash) < tradeValue) continue;

      // Ensure seller has shares (check embedded first, then collection)
      const sellerPosIdx = seller.portfolio.findIndex(p => p.ticker === sellOrder.ticker);
      const sellerEmbeddedQty = sellerPosIdx >= 0 ? num(seller.portfolio[sellerPosIdx].quantity) : 0;
      let sellerHasEnough = sellerEmbeddedQty >= quantityToTrade;

      if (!sellerHasEnough) {
        const portfolioEntry = await Portfolio.findOne({
          playerId: seller._id,
          ticker: sellOrder.ticker,
        });
        sellerHasEnough = portfolioEntry && num(portfolioEntry.shares) >= quantityToTrade;
        if (!sellerHasEnough) continue; // skip this pair if seller lacks shares
      }

      // ---- perform trade ----

      buyer.cash = num(buyer.cash) - tradeValue;
      await incEmbeddedPortfolio(buyer, buyOrder.ticker, +quantityToTrade);
      await Portfolio.findOneAndUpdate(
        { playerId: buyer._id, ticker: buyOrder.ticker },
        { $inc: { shares: quantityToTrade } },
        { upsert: true, new: true }
      );
      await buyer.save();

      seller.cash = num(seller.cash) + tradeValue;
      await incEmbeddedPortfolio(seller, sellOrder.ticker, -quantityToTrade);
      await Portfolio.findOneAndUpdate(
        { playerId: seller._id, ticker: sellOrder.ticker },
        { $inc: { shares: -quantityToTrade } },
        { upsert: true, new: true }
      );
      await seller.save();

      buyOrder.remaining = buyRem - quantityToTrade;
      sellOrder.remaining = sellRem - quantityToTrade;
      if (buyOrder.remaining <= 0) buyOrder.status = "FILLED";
      else buyOrder.status = "PARTIAL";
      if (sellOrder.remaining <= 0) sellOrder.status = "FILLED";
      else sellOrder.status = "PARTIAL";
      await buyOrder.save();
      await sellOrder.save();

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

let _interval = null;

export function startMatchingLoop(intervalMs = 1000) {
  if (_interval) return; 
  _interval = setInterval(async () => {
    try {
      await applyTick();
    } catch (err) {
      console.error("Matcher error:", err);
    }
  }, intervalMs);
  console.log(`Matcher running every ${intervalMs}ms`);
}

export function stopMatchingLoop() {
  if (_interval) {
    clearInterval(_interval);
    _interval = null;
    console.log("⏹Matcher stopped");
  }
}
