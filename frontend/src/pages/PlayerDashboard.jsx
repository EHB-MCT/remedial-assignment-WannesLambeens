import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPlayerSummary } from "../api/players";

export default function PlayerDashboard() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayerSummary(id)
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!summary) return <p>Kon spelergegevens niet ophalen.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Speler: {summary.name}</h2>
      <p className="mb-4">
        💰 Cash: €{parseFloat(summary.cash?.$numberDecimal || 0).toFixed(2)}
      </p>

      <h3 className="text-lg font-semibold mt-4">📊 Portfolio</h3>
      {summary.portfolio.length === 0 ? (
        <p className="text-sm text-gray-500">Geen aandelen</p>
      ) : (
        <ul className="list-disc list-inside">
          {summary.portfolio.map((item) => (
            <li key={item._id}>
              {item.ticker}: {parseFloat(item.shares?.$numberDecimal || 0).toFixed(2)} aandelen
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-lg font-semibold mt-6">📄 Open Orders</h3>
      {summary.openOrders.length === 0 ? (
        <p className="text-sm text-gray-500">Geen openstaande orders</p>
      ) : (
        <ul className="list-disc list-inside">
          {summary.openOrders.map((order) => (
            <li key={order._id}>
              [{order.side}] {order.ticker} –{" "}
              {parseFloat(order.remaining?.$numberDecimal || 0).toFixed(2)} stuks @ €
              {parseFloat(order.limitPrice?.$numberDecimal || 0).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
