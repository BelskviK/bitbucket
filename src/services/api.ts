import axios from "axios";

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

    // Store token if available in response
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  },

  // Register method (if you have a register endpoint)
  register: async (userData: {
    email: string;
    password: string;
    name?: string;
    // Add other registration fields as needed
  }) => {
    const response = await api.post("/register", userData);

    // Store token if available in response
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
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
