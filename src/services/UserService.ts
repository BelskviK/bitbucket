import type { User } from "@/types";

let currentUser: User | null = null;

export const getUser = (): User | null => {
  if (currentUser) return currentUser;

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
      return currentUser;
    } catch (error) {
      console.error("Error parsing user data:", error);
      clearUser();
    }
  }

  return null;
};

export const setUser = (user: User | null) => {
  currentUser = user;
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    clearUser();
  }
};

export const clearUser = () => {
  currentUser = null;
  localStorage.removeItem("user");
};
