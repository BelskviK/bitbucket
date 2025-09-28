// src/components/auth/RegisterForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import type { RegisterCredentials } from "@/types";
import AvatarInput from "@/components/auth/AvatarInput";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/common/Input";

interface RegisterFormProps {
  switchToLogin: () => void;
}

interface RegisterFormData extends Omit<RegisterCredentials, "avatar"> {
  avatar: File | null;
  password_confirmation: string;
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

export default function RegisterForm({ switchToLogin }: RegisterFormProps) {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    avatar: null as File | null,
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

  const handleAvatarChange = (avatar: File | null) => {
    setFormData({
      ...formData,
      avatar: avatar,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setErrors({}); // Clear previous errors

    // Frontend validation
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

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

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Please confirm your password";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.register({
        email: formData.email,
        username: formData.username,
        avatar: formData.avatar,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      if (response.user) {
        setUser(response.user);
      }
      console.log("Registration successful:", response);
      navigate("/products");
    } catch (error: unknown) {
      console.log("Registration error:", error);

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

          // Show generic API error message if no field-specific errors but there's a message
          if (errorData.message && Object.keys(fieldErrors).length === 0) {
            setApiError(errorData.message);
          }
        } else if (errorData.message) {
          setApiError(errorData.message);
        }
      } else {
        // Handle other types of errors
        setApiError(
          apiError.response?.data?.message ||
            apiError.message ||
            "Registration failed. Please try again."
        );
      }
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
    <div className="w-full h-full flex flex-col justify-center items-center mb-16 -ml-10">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-[554px] flex flex-col gap-[24px]"
        noValidate
      >
        <div className="h-[63px] flex text-center justify-start items-center">
          <h1 className="font-semibold text-[42px] leading-[100%] tracking-[0px] text-[#0B1E59]">
            Registration
          </h1>
        </div>

        {/* Avatar Input Section */}
        <div>
          <AvatarInput
            onAvatarChange={handleAvatarChange}
            initialAvatar={
              formData.avatar ? URL.createObjectURL(formData.avatar) : ""
            }
          />
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {apiError}
          </div>
        )}

        <div className="flex flex-col gap-6 w-full mb-[24px]">
          {/* Username Field */}
          <div className="relative">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              error={errors.username}
              required
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

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

          {/* Password Field */}
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

          {/* Confirm Password Field */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirmation"
              placeholder="Confirm Password"
              error={errors.password_confirmation}
              showPasswordToggle={true}
              onTogglePassword={toggleConfirmPasswordVisibility}
              showPassword={showConfirmPassword}
              required
              value={formData.password_confirmation}
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
              Registering...
            </span>
          ) : (
            "Register"
          )}
        </button>
      </form>

      <div className="flex flex-row items-center justify-center gap-2 mt-[24px]">
        <p className="font-poppins font-normal text-[14px] leading-[100%] tracking-[0] text-[#3E424A] text-center">
          Already member?
        </p>
        <button
          className="font-poppins font-medium text-[14px] leading-[100%] tracking-[0] text-[#FF4000] text-center hover:underline transition-colors"
          onClick={switchToLogin}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
