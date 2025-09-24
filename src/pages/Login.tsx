import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import LoginBanner from "../assets/LoginBanner.svg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we should show login or register form based on route
  const isRegisterRoute = location.pathname === "/register";

  const switchToRegister = () => {
    navigate("/register");
  };

  const switchToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="w-full flex flex-row h-screen pt-[80px] h-[calc(100vh-80px)]">
      {/* Left Banner */}
      <div className="w-1/2 h-full relative">
        <img
          src={LoginBanner}
          alt="Login Banner"
          className="absolute left-0 top-0 w-full h-full object-cover object-left"
        />
      </div>

      {/* Form Section */}
      {isRegisterRoute ? (
        <RegisterForm switchToLogin={switchToLogin} />
      ) : (
        <LoginForm switchToRegister={switchToRegister} />
      )}
    </div>
  );
}
