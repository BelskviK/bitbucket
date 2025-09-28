// src/components/common/Input.tsx
import React from "react";
import { useLocation } from "react-router-dom";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  error,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword,
  className = "",
  required,
  placeholder,
  value,
  ...props
}) => {
  const location = useLocation();
  const isCheckout = location.pathname === "/checkout";

  const baseStyles =
    "w-full h-[42px] px-4 rounded-lg border font-normal text-sm leading-none tracking-normal text-customText placeholder:text-customText focus:outline-none focus:ring-2 transition-colors";

  const errorStyles = error
    ? "border-customOrange focus:ring-customOrange"
    : "border-gray-300 focus:ring-orange-300";

  return (
    <div className="relative">
      <input
        className={`${baseStyles} ${errorStyles} ${className}`}
        placeholder={placeholder}
        value={value}
        {...props}
      />
      {/* Required asterisk - hidden if /checkout */}
      {required && !value && !isCheckout && (
        <span
          className="absolute top-1/2 -translate-y-1/2 text-customOrange pointer-events-none"
          style={{
            left:
              placeholder === "Username"
                ? "92px"
                : placeholder === "Email"
                ? "58px"
                : placeholder === "Password"
                ? "88px"
                : placeholder === "Confirm Password"
                ? "150px"
                : placeholder === "Name"
                ? "62px"
                : placeholder === "Surname"
                ? "82px"
                : placeholder === "Address"
                ? "76px"
                : placeholder === "Zip code"
                ? "78px"
                : "16px",
          }}
        >
          *
        </span>
      )}

      {/* Password toggle eye icon */}
      {showPasswordToggle && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          onClick={onTogglePassword}
          disabled={props.disabled}
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
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
      )}

      {/* Error message */}
      {error && (
        <p className="absolute -bottom-4 left-0 font-light text-[10px] leading-[1] tracking-[0px] text-customOrange mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
