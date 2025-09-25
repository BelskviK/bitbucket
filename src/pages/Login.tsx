import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import LoginBanner from "../assets/LoginBanner.svg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterRoute = location.pathname === "/register";

  const switchToRegister = () => navigate("/register");
  const switchToLogin = () => navigate("/login");

  return (
    <div className="w-full h-full flex flex-row">
      {/* Left Banner */}
      <div className="w-full max-w-[948px] h-full relative">
        <img
          src={LoginBanner}
          alt="Login Banner"
          className="absolute left-0 bottom-0 w-full h-full object-full object-left "
        />
      </div>

      {/* Right Form */}
      <div className="w-full flex justify-center items-center">
        {/* Form wrapper with max width */}
        <div className="w-full max-w-[554px] flex flex-col justify-center items-center">
          {isRegisterRoute ? (
            <RegisterForm switchToLogin={switchToLogin} />
          ) : (
            <LoginForm switchToRegister={switchToRegister} />
          )}
        </div>
      </div>
    </div>
  );
}
