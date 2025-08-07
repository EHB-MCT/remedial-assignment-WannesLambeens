import { useEffect, useState } from "react";
import axios from "axios";

export default function Trades() {
  const [ticker, setTicker] = useState("AAPL");
  const [lastPrice, setLastPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticker) return;

    setLoading(true);
    axios
      .get(`http://localhost:3000/api/trades/last-price/${ticker}`)
      .then((res) => setLastPrice(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ticker]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Trade Info</h2>

      <label className="block mb-2">
        Kies ticker:
        <select
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="ml-2 border px-2 py-1"
        >
          <option value="AAPL">AAPL</option>
          <option value="GOOG">GOOG</option>
          <option value="TSLA">TSLA</option>
        </select>
      </label>

      {loading ? (
        <p>Bezig met laden...</p>
      ) : lastPrice ? (
        <div className="mt-4">
          <p>Ticker: {lastPrice.ticker}</p>
          <p>Laatste prijs: €{lastPrice.lastPrice.toFixed(2)}</p>
          <p>
            Laatste trade:{" "}
            {lastPrice.ts ? new Date(lastPrice.ts).toLocaleString() : "Onbekend"}
        </p>
        </div>
      ) : (
        <p>Geen trades gevonden voor {ticker}.</p>
      )}
    </div>
  );
}
