import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import type { ApiError } from "../types/auth";
import AvatarInput from "./AvatarInput";

interface RegisterFormProps {
  switchToLogin: () => void;
}

export default function RegisterForm({ switchToLogin }: RegisterFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    avatar: "",
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.username.trim()) {
      newErrors.username = "Name is required";
    }

    if (formData.email.length < 3) {
      newErrors.email = "Email must be at least 3 characters";
    }

    if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        email: formData.email,
        username: formData.username,
        avatar: formData.avatar,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center -ml-16 mb-16">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-[554px] flex flex-col gap-6"
      >
        <h1 className="text-[46px] font-bold font-poppins   tracking-[0px] self-start">
          Registration
        </h1>
        <div className="">
          <AvatarInput />
        </div>
        {/* API Error Message */}
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {apiError}
          </div>
        )}

        <div className="flex flex-col gap-6 w-full">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={`w-full h-[42px] px-4 rounded-lg border ${
                errors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-300"
              } placeholder-gray-800 placeholder-opacity-100 font-poppins font-normal text-[16px] leading-[21px] tracking-[0px] focus:outline-none focus:ring-2 transition-colors`}
              required
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />

            {!formData.username && (
              <span className="absolute left-[89px] top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                *
              </span>
            )}
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full h-[42px] px-4 rounded-lg border ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-300"
              } placeholder-gray-800 placeholder-opacity-100 font-poppins font-normal text-[16px] leading-[21px] tracking-[0px] focus:outline-none focus:ring-2 transition-colors`}
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
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={`w-full h-[42px] px-4 pr-12 rounded-lg border ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-300"
              } placeholder-gray-800 placeholder-opacity-100 font-poppins font-normal text-[16px] leading-[21px] tracking-[0px] focus:outline-none focus:ring-2 transition-colors`}
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

            {/* Eye Icon for Password */}
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

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirmation"
              placeholder="Confirm Password"
              className={`w-full h-[42px] px-4 pr-12 rounded-lg border ${
                errors.password_confirmation
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-300"
              } placeholder-gray-800 placeholder-opacity-100 font-poppins font-normal text-[16px] leading-[21px] tracking-[0px] focus:outline-none focus:ring-2 transition-colors`}
              required
              value={formData.password_confirmation}
              onChange={handleChange}
              disabled={isLoading}
            />
            {!formData.password_confirmation && (
              <span className="absolute left-[147px] top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                *
              </span>
            )}

            {/* Eye Icon for Confirm Password */}
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              onClick={toggleConfirmPasswordVisibility}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
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

            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation}
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
        <p className="text-gray-600">Already member?</p>
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
