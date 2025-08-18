const API_BASE = "http://localhost:3000/api";

export async function fetchPlayers() {
  const res = await fetch(`${API_BASE}/players`);
  if (!res.ok) throw new Error("Failed to fetch players");
  return res.json();
}

export async function fetchPlayerSummary(id) {
  const res = await fetch(`${API_BASE}/players/${id}/summary`);
  if (!res.ok) throw new Error("Failed to fetch player summary");
  return res.json();
}
