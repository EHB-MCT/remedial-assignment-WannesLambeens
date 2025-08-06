export function groupOrdersBySymbol(orders) {
  const grouped = {};

  for (const order of orders) {
    const symbol = order.symbol;

    if (!grouped[symbol]) {
      grouped[symbol] = { buy: [], sell: [] };
    }

    grouped[symbol][order.type].push(order);
  }

  return grouped;
}
