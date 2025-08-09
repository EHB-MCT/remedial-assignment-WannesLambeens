import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [playerId, setPlayerId] = useState(localStorage.getItem("playerId"));

  useEffect(() => {
    if (playerId) {
      localStorage.setItem("playerId", playerId);
    } else {
      localStorage.removeItem("playerId");
    }
  }, [playerId]);

  const login = (id) => setPlayerId(id);
  const logout = () => setPlayerId(null);

  return (
    <AuthContext.Provider value={{ playerId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
