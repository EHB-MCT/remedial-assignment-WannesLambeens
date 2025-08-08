import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [playerId, setPlayerId] = useState(() => {
    return localStorage.getItem("playerId") || null;
  });

  const login = (id) => {
    setPlayerId(id);
    localStorage.setItem("playerId", id);
  };

  const logout = () => {
    setPlayerId(null);
    localStorage.removeItem("playerId");
  };

  return (
    <AuthContext.Provider value={{ playerId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
