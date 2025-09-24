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

export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
