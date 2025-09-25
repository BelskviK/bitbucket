// src\services\api.ts
import axios from "axios";
import { setUser } from "./userService";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://api.redseam.redberryinternship.ge/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API service methods
export const authService = {
  // Login method
  login: async (email: string, password: string) => {
    const response = await api.post("/login", {
      email,
      password,
    });

    // Store token and user if available in response
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    if (response.data.user) {
      setUser(response.data.user); // This saves to localStorage
    }

    return response.data;
  }, // src/services/api.ts
  // src/services/api.ts
  register: async (userData: {
    email: string;
    username: string;
    avatar: File | null; // Change to File | null
    password: string;
    password_confirmation: string;
  }) => {
    const formData = new FormData();
    formData.append("email", userData.email);
    formData.append("username", userData.username);
    formData.append("password", userData.password);
    formData.append("password_confirmation", userData.password_confirmation);

    // Only add avatar if it's provided
    if (userData.avatar instanceof File) {
      formData.append("avatar", userData.avatar);
    }

    const response = await api.post("/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    if (response.data.user) {
      setUser(response.data.user); // This saves to localStorage
    }
    return response.data;
  },

  // Logout method
  logout: () => {
    localStorage.removeItem("authToken");
    // Optional: Make API call to invalidate token on server
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem("authToken");
  },
};

export default api;
