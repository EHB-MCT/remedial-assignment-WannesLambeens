import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx"; 
import PlayerDashboard from "./pages/PlayerDashboard.jsx";
import NewOrderForm from "./pages/NewOrderForm.jsx";
import Trades from "./pages/Trades.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Start altijd op login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Publieke routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* (optioneel) legacy home blijft bereikbaar op /home */}
        <Route path="/home" element={<Home />} />

        {/* Beschermde routes */}
        <Route
          path="/player/:id"
          element={
            <ProtectedRoute>
              <PlayerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players/:id/new-order"
          element={
            <ProtectedRoute>
              <NewOrderForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trades"
          element={
            <ProtectedRoute>
              <Trades />
            </ProtectedRoute>
          }
        />

        {/* Fallback: onbekende paden -> login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
