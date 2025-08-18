import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NewOrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // form state
  const [ticker, setTicker] = useState("");
  const [side, setSide] = useState("BUY");
  const [type, setType] = useState("LIMIT");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [latestPrices, setLatestPrices] = useState([]);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [pricesError, setPricesError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLatest() {
      setPricesLoading(true);
      setPricesError("");
      try {
        const res = await axios.get("http://localhost:3000/api/trades/latest");
        if (!cancelled) {
          // Sorteer alfabetisch op ticker 
          const items = Array.isArray(res.data) ? res.data : [];
          items.sort((a, b) => a.ticker.localeCompare(b.ticker));
          setLatestPrices(items);
        }
      } catch (e) {
        if (!cancelled) setPricesError("Kon laatste prijzen niet laden.");
      } finally {
        if (!cancelled) setPricesLoading(false);
      }
    }

    loadLatest();

    // refreshen zodat prijzen updaten
    const iv = setInterval(loadLatest, 5000);
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, []);

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
        quantity: Number(quantity),
        ...(type === "LIMIT" && { limitPrice: Number(limitPrice) }),
      };

      await axios.post("http://localhost:3000/api/orders", payload);
      setMessage("Order geplaatst");
      setTimeout(() => navigate(`/player/${id}`), 1200);
    } catch (err) {
      console.error(err);
      setError("Fout bij order plaatsen.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
      {/* FORM */}
      <div className="p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Nieuwe Order {ticker ? `– ${ticker}` : ""}
        </h2>

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

      {/* SIDEBAR: laatste prijzen */}
      <aside className="p-4 border rounded shadow h-fit">
        <h3 className="text-lg font-semibold mb-3">
          Laatst verhandelde prijzen
        </h3>

        {pricesLoading && <p>Bezig met laden…</p>}
        {pricesError && <p className="text-red-600">{pricesError}</p>}

        {!pricesLoading && !pricesError && latestPrices.length === 0 && (
          <p className="text-sm text-gray-500">Nog geen trades.</p>
        )}

        <ul className="divide-y">
          {latestPrices.map((row) => (
            <li
              key={row.ticker}
              className="py-2 flex items-center justify-between"
            >
              <button
                type="button"
                className="font-mono underline"
                onClick={() => setTicker(row.ticker)}
                title="Gebruik deze ticker in het formulier"
              >
                {row.ticker}
              </button>
              <div className="text-right">
                <div className="font-medium">
                  €{Number(row.price).toFixed(2)}
                </div>
                {row.createdAt && (
                  <div className="text-xs text-gray-500">
                    {new Date(row.createdAt).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
