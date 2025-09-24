import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import type { ApiError } from "../types/auth";

interface RegisterFormProps {
  switchToLogin: () => void;
}

export default function RegisterForm({ switchToLogin }: RegisterFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.email.length < 3) {
      newErrors.email = "Email must be at least 3 characters";
    }

    if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      console.log("Registration successful:", response);
      navigate("/products");
    } catch (error) {
      const apiError = error as ApiError;
      setApiError(apiError.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-1/2 flex flex-col justify-center items-center p-8">
      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-6 w-full max-w-md"
      >
        <h1 className="text-[42px] font-semibold font-poppins leading-[1] tracking-[0px] self-start">
          Register
        </h1>

        {/* API Error Message */}
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {apiError}
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className={`w-full h-12 px-4 rounded-lg border ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-300"
              } focus:outline-none focus:ring-2 transition-colors`}
              required
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
            {!formData.name && (
              <span className="absolute left-[95px] top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                *
              </span>
            )}
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full h-12 px-4 rounded-lg border ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-300"
              } focus:outline-none focus:ring-2 transition-colors`}
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {!formData.email && (
              <span className="absolute left-[56px] top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                *
              </span>
            )}
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`w-full h-12 px-4 rounded-lg border ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-300"
              } focus:outline-none focus:ring-2 transition-colors`}
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            {!formData.password && (
              <span className="absolute left-[85px] top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                *
              </span>
            )}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className={`w-full h-12 px-4 rounded-lg border ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-300"
              } focus:outline-none focus:ring-2 transition-colors`}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
            {!formData.confirmPassword && (
              <span className="absolute left-[160px] top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                *
              </span>
            )}
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
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
              Registering...
            </span>
          ) : (
            "Register"
          )}
        </button>
      </form>

      <div className="flex flex-row justify-center items-center gap-2 mt-6">
        <p className="text-gray-600">Already have an account?</p>
        <button
          className="text-orange-500 font-semibold hover:underline transition-colors"
          onClick={switchToLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
