import api from "./api";
import { setUser, clearUser } from "./userService";

export const AuthService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });

    if (response.data.token)
      localStorage.setItem("authToken", response.data.token);
    if (response.data.user) setUser(response.data.user);

    return response.data;
  },

  register: async (userData: {
    email: string;
    username: string;
    avatar: File | null;
    password: string;
    password_confirmation: string;
  }) => {
    const formData = new FormData();
    formData.append("email", userData.email);
    formData.append("username", userData.username);
    formData.append("password", userData.password);
    formData.append("password_confirmation", userData.password_confirmation);
    if (userData.avatar instanceof File)
      formData.append("avatar", userData.avatar);

    const response = await api.post("/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.token)
      localStorage.setItem("authToken", response.data.token);
    if (response.data.user) setUser(response.data.user);

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    clearUser();
  },

  isAuthenticated: () => !!localStorage.getItem("authToken"),
  getToken: () => localStorage.getItem("authToken"),
};
