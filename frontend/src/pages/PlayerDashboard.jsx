import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";

export default function PlayerDashboard() {
  const { id } = useParams();
  const { playerId, logout } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return navigate("/login");

    const fetchSummary = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/players/${id}/summary`
        );
        setSummary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [id, playerId, navigate]);

  if (loading) return <p>Loading...</p>;
  if (!summary) return <p>Kon spelergegevens niet ophalen.</p>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-2">
          Speler: {summary.username}
        </h2>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="text-sm px-3 py-1 rounded border"
        >
          Log out
        </button>
      </div>

      <p className="mb-4">Cash: €{Number(summary.cash).toFixed(2)}</p>

      <h3 className="text-lg font-semibold mt-4">Portfolio</h3>
      {!summary.portfolio || summary.portfolio.length === 0 ? (
        <p className="text-sm text-gray-500">Geen aandelen</p>
      ) : (
        <ul className="list-disc list-inside">
          {summary.portfolio.map((item, idx) => (
            <li key={`${item.ticker}-${idx}`}>
              {item.ticker}: {Number(item.quantity).toFixed(2)} aandelen
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-lg font-semibold mt-6">Open Orders</h3>
      {!summary.openOrders || summary.openOrders.length === 0 ? (
        <p className="text-sm text-gray-500">Geen openstaande orders</p>
      ) : (
        <ul className="list-disc list-inside">
          {summary.openOrders.map((order) => (
            <li key={order._id}>
              [{order.side}] {order.ticker} – {Number(order.remaining)} stuks @ €
              {Number(order.limitPrice).toFixed(2)}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          to={`/players/${id}/new-order?side=BUY`}
          className="px-3 py-2 border rounded"
        >
          Koop
        </Link>
        <Link
          to={`/players/${id}/new-order?side=SELL`}
          className="px-3 py-2 border rounded"
        >
          Verkoop
        </Link>
      </div>
    </div>
  );
}
