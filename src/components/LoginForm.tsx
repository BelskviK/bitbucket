// src/components/LoginForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import type { ApiError } from "../types/auth";

interface LoginFormProps {
  switchToRegister: () => void;
}

export default function LoginForm({ switchToRegister }: LoginFormProps) {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Use AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    let valid = true;

    if (email.length < 3) {
      setEmailError("Email must be at least 3 characters");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 3) {
      setPasswordError("Password must be at least 3 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    setIsLoading(true);

    try {
      // Call login API
      const response = await authService.login(email, password);

      // Save user to AuthContext (this will trigger re-renders)
      if (response.user) {
        setUser(response.user); // This updates the context state
      }

      console.log("Login successful:", response);

      // Navigate to products page
      navigate("/products");
    } catch (error) {
      const apiError = error as ApiError;
      setApiError(apiError.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-1/2 flex flex-col justify-center items-center p-8">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-6 w-full max-w-md"
      >
        <h1 className="text-[42px] font-semibold font-poppins leading-[1] tracking-[0px] self-start">
          Log in
        </h1>

        {/* API Error Message */}
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {apiError}
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className={`w-full h-12 px-4 rounded-lg border ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-300"
              } focus:outline-none focus:ring-2 transition-colors`}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {!email && (
              <span className="absolute left-[56px] top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                *
              </span>
            )}
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className={`w-full h-12 px-4 rounded-lg border ${
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-300"
              } focus:outline-none focus:ring-2 transition-colors`}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {!password && (
              <span className="absolute left-[85px] top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                *
              </span>
            )}
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300 transition-colors mt-4 flex items-center justify-center"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="flex flex-row justify-center items-center gap-2 mt-6">
        <p className="text-gray-600">Not a member?</p>
        <button
          className="text-orange-500 font-semibold hover:underline transition-colors"
          onClick={switchToRegister}
        >
          Register
        </button>
      </div>
    </div>
  );
}
