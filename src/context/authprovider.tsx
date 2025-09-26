import { useState, type ReactNode } from "react";
import { AuthContext } from "./authcontext";
import type { AuthContextType, User } from "../types"; // Centralized imports
import { getUser, setUser as setStoredUser } from "../services/userservice";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<User | null>(getUser());

  const setUser = (user: User | null) => {
    setStoredUser(user);
    setUserState(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  const value: AuthContextType = {
    user,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
