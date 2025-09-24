// src/context/AuthProvider.tsx
import { useState, type ReactNode } from "react"; // Added 'type' for ReactNode
import { AuthContext, type AuthContextType } from "./AuthContext";
import type { AuthResponse } from "../types/auth";
import { getUser, setUser as setStoredUser } from "../services/userService";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<AuthResponse["user"] | null>(getUser());

  const setUser = (user: AuthResponse["user"]) => {
    setStoredUser(user);
    setUserState(user);
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
