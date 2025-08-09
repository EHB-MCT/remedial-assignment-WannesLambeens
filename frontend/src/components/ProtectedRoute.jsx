import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { playerId } = useAuth();

  if (!playerId) {
    return <Navigate to="/login" />;
  }

  return children;
}
