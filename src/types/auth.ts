// src\types\auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
  // Add other registration fields as needed
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    avatar?: string; // Add this
  };
  message?: string;
}
