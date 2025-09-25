// User related types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

// Authentication related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  password_confirmation: string;
  username: string;
  avatar?: File | null;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  message?: string;
}

// Error handling
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Context types
export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}
