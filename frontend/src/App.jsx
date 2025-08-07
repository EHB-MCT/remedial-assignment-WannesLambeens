import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PlayerDashboard from "./pages/PlayerDashboard.jsx";
import NewOrderForm from "./pages/NewOrderForm.jsx";
import Trades from "./pages/Trades.jsx"; 

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:id" element={<PlayerDashboard />} />
        <Route path="/players/:id/new-order" element={<NewOrderForm />} />
        <Route path="/trades" element={<Trades />} /> {}
      </Routes>
    </Router>
  );
}
