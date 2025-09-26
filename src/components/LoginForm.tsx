import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authservice";
import { useAuth } from "../hooks/useAuth";
import type { ApiError, LoginCredentials } from "../types";

interface LoginFormProps {
  switchToRegister: () => void;
}

export default function LoginForm({ switchToRegister }: LoginFormProps) {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Use LoginCredentials interface for better type safety
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    let valid = true;

    if (credentials.email.length < 3) {
      setEmailError("Email must be at least 3 characters");
      valid = false;
    } else {
      setEmailError("");
    }

    if (credentials.password.length < 3) {
      setPasswordError("Password must be at least 3 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    setIsLoading(true);

    try {
      // Use the credentials object directly
      const response = await AuthService.login(
        credentials.email,
        credentials.password
      );

      if (response.user) {
        setUser(response.user);
      }

      console.log("Login successful:", response);
      navigate("/products");
    } catch (error) {
      const apiError = error as ApiError;
      setApiError(apiError.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update individual fields
  const handleEmailChange = (email: string) => {
    setCredentials((prev) => ({ ...prev, email }));
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (password: string) => {
    setCredentials((prev) => ({ ...prev, password }));
    if (passwordError) setPasswordError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center -ml-16 mb-36">
      <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
        <h1 className="text-[42px] font-semibold font-poppins leading-[1] tracking-[0px] self-start mb-[24px]">
          Log in
        </h1>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {apiError}
          </div>
        )}

        <div className="flex flex-col gap-6 w-full">
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
              value={credentials.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={isLoading}
            />
            {!credentials.email && (
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
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full h-12 px-4 pr-12 rounded-lg border ${
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-300"
              } focus:outline-none focus:ring-2 transition-colors`}
              required
              value={credentials.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              disabled={isLoading}
            />
            {!credentials.password && (
              <span className="absolute left-[85px] top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                *
              </span>
            )}

            {/* Eye Icon */}
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              onClick={togglePasswordVisibility}
              disabled={isLoading}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>

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
