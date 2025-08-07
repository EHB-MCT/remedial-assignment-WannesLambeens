import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function NewOrderForm() {
  const { id } = useParams(); // speler-ID
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ticker: "",
    side: "BUY",
    type: "LIMIT",
    quantity: "",
    limitPrice: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        ...formData,
        playerId: id,
        quantity: formData.quantity.toString(),
        limitPrice: formData.limitPrice ? formData.limitPrice.toString() : undefined,
      };

      await axios.post("http://localhost:3000/api/orders", payload);

      alert("Order succesvol geplaatst");
      navigate(`/player/${id}`);
    } catch (err) {
      console.error("Order aanmaken mislukt:", err);
      setError(err.response?.data?.error || "Er ging iets mis.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Nieuwe Order Plaatsen</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Ticker</label>
          <input
            type="text"
            name="ticker"
            value={formData.ticker}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="AAPL"
          />
        </div>

        <div>
          <label className="block mb-1">Side</label>
          <select
            name="side"
            value={formData.side}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Order Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="LIMIT">Limit</option>
            <option value="MARKET">Market</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Aantal aandelen</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full border p-2 rounded"
            placeholder="10"
          />
        </div>

        {formData.type === "LIMIT" && (
          <div>
            <label className="block mb-1">Limit Prijs (€)</label>
            <input
              type="number"
              name="limitPrice"
              value={formData.limitPrice}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full border p-2 rounded"
              placeholder="150.00"
            />
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Plaats Order
        </button>
      </form>
    </div>
  );
}
