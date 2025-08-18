import { useEffect, useState } from "react";
import { fetchPlayers } from "../api/players";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers()
      .then(setPlayers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading players...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welkom bij de beurs!</h1>
      <p className="mb-4">Kies een speler om aan de slag te gaan.</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {players.map((player) => (
          <button
            key={player._id}
            onClick={() => navigate(`/player/${player._id}`)}
            className="border p-4 rounded hover:bg-gray-100"
          >
            {player.name}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Link to="/trades" className="text-blue-600 hover:underline">
          Bekijk alle recente trades
        </Link>
      </div>
    </div>
  );
}
