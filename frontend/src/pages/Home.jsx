import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:3000/health")
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("Failed to connect"));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Healthcheck</h1>
      <p>Status: {status}</p>
    </div>
  );
}
