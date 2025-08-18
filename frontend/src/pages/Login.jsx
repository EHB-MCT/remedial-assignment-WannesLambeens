import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        username,
        password,
      });

      const playerId = res.data.playerId;
      login(playerId); 
      navigate(`/player/${playerId}`);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label>Username:</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            className="border p-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>

      {/* Registratie link */}
      <p className="mt-4">
        Nog geen account?{" "}
        <Link to="/register" className="text-blue-600 underline">
          Klik hier om te registreren
        </Link>
      </p>
    </div>
  );
}
