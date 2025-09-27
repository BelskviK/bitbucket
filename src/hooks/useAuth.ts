// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "@/contexts/authcontext";
import type { AuthContextType } from "@/types"; // Centralized imports

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
