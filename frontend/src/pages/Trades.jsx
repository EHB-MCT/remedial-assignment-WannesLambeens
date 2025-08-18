import { useEffect, useState } from "react";
import axios from "axios";

export default function Trades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/trades") 
      .then((res) => setTrades(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Recente Trades</h2>

      {loading ? (
        <p>Trades aan het laden...</p>
      ) : trades.length === 0 ? (
        <p className="text-gray-500">Er zijn nog geen trades gebeurd.</p>
      ) : (
        <ul className="list-disc list-inside space-y-2">
          {trades.map((trade) => (
            <li key={trade._id}>
              <strong>{trade.ticker}</strong> — {trade.quantity} stuks @ €
              {parseFloat(trade.price).toFixed(2)} <br />
              <span className="text-sm text-gray-500">
                {new Date(trade.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
