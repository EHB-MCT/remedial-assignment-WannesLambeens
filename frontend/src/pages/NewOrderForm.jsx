import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function NewOrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticker, setTicker] = useState("");
  const [side, setSide] = useState("BUY");
  const [type, setType] = useState("LIMIT");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const payload = {
        playerId: id,
        ticker,
        side,
        type,
        quantity,
        ...(type === "LIMIT" && { limitPrice }),
      };

      await axios.post("http://localhost:3000/api/orders", payload);
      setMessage("Order geplaatst");
      setTimeout(() => navigate(`/player/${id}`), 2000);
    } catch (err) {
      console.error(err);
      setError("Fout bij order plaatsen.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Nieuwe Order</h2>

      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Ticker</label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Aantal aandelen</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <div>
          <label className="block font-medium">Order type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="LIMIT">LIMIT</option>
            <option value="MARKET">MARKET</option>
          </select>
        </div>

        {type === "LIMIT" && (
          <div>
            <label className="block font-medium">Limietprijs (€)</label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              min="0.01"
              step="0.01"
            />
          </div>
        )}

        <div>
          <label className="block font-medium">Koop of verkoop</label>
          <select
            value={side}
            onChange={(e) => setSide(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Order plaatsen
        </button>
      </form>
    </div>
  );
}
