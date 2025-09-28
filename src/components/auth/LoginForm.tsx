// src/components/auth/LoginForm.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import { useAuth } from "@/hooks/useAuth";
import type { LoginCredentials } from "@/types";
import { Input } from "@/components/common/Input";

interface LoginFormProps {
  switchToRegister: () => void;
}

interface ApiErrorResponse {
  response?: {
    status: number;
    data: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}

export default function LoginForm({ switchToRegister }: LoginFormProps) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/products");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    // Clear password error when user starts typing in either field
    if (errors.password && errors.password === "Email or password incorrect") {
      setErrors({
        ...errors,
        password: "",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Frontend validation
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.login(
        formData.email,
        formData.password
      );

      if (response.user) {
        setUser(response.user);
      }

      console.log("Login successful:", response);
      navigate("/products");
    } catch (error: unknown) {
      console.log("Login error:", error);

      const apiError = error as ApiErrorResponse;

      // Handle 422 validation errors from Laravel
      if (apiError.response?.status === 422) {
        const errorData = apiError.response.data;

        // Extract field-specific errors from the API response
        if (errorData.errors) {
          const fieldErrors: Record<string, string> = {};

          // Map API errors to field names - take the first error message for each field
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[field] = messages[0];
            }
          });

          setErrors(fieldErrors);
        } else if (errorData.message) {
          // For login errors, show "Email or password incorrect" under password field
          setErrors({
            password: "Email or password incorrect",
          });
        }
      } else {
        // For other types of login errors, also show under password field
        setErrors({
          password: "Email or password incorrect",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mb-16 -ml-10">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-[554px] flex flex-col gap-[24px]"
        noValidate
      >
        <div className="h-[63px] flex text-center justify-start items-center mb-[24px]">
          <h1 className="font-semibold text-[42px] leading-[100%] tracking-[0px] text-[#0B1E59]">
            Log in
          </h1>
        </div>

        <div className="flex flex-col gap-6 w-full mb-[20px]">
          {/* Email Field */}
          <div className="relative">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              error={errors.email}
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Password Field - Now shows "Email or password incorrect" for login errors */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              error={errors.password}
              showPasswordToggle={true}
              onTogglePassword={togglePasswordVisibility}
              showPassword={showPassword}
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-[554px] h-[41px] bg-[#FF4000] text-white rounded-[10px] px-[20px] py-[10px]
            flex items-center justify-center gap-[10px] font-poppins font-normal text-[14px] leading-[100%]
            tracking-[0] hover:bg-[#e63900] disabled:bg-orange-300 transition-colors`}
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
            "Log in"
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
