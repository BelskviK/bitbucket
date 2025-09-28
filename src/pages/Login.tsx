import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import LoginBanner from "@/assets/LoginBanner.svg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterRoute = location.pathname === "/register";

  const switchToRegister = () => navigate("/register");
  const switchToLogin = () => navigate("/login");

  return (
    <div className="w-full h-[1000px] flex flex-row">
      {/* Left Banner */}
      <div className="w-full max-w-[948px] h-full relative">
        <img
          src={LoginBanner}
          alt="Login Banner"
          className="absolute left-0 bottom-0 w-full h-full object-cover object-left"
        />
      </div>

      {/* Right Form */}
      <div className="w-full h-full">
        <div className="w-full h-full">
          {isRegisterRoute ? (
            <div className=" pt-[152px]">
              <RegisterForm switchToLogin={switchToLogin} />
            </div>
          ) : (
            <div className="  pt-[241px]">
              <LoginForm switchToRegister={switchToRegister} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
