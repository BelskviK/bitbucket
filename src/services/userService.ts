import type { AuthResponse } from "../types/auth";

let currentUser: AuthResponse["user"] | null = null;

export const getUser = (): AuthResponse["user"] | null => {
  if (currentUser) return currentUser;

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }

  return null;
};

export const setUser = (user: AuthResponse["user"]) => {
  currentUser = user;
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearUser = () => {
  currentUser = null;
  localStorage.removeItem("user");
};
