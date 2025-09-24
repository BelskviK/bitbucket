// src/context/AuthContext.ts
import { createContext } from "react";
import type { AuthResponse } from "../types/auth";

export interface AuthContextType {
  user: AuthResponse["user"] | null;
  setUser: (user: AuthResponse["user"]) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
