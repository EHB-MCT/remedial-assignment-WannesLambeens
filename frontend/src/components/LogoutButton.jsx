import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded">
      Logout
    </button>
  );
}
