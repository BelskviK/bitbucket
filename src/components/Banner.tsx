// src/components/Banner.tsx
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import loginIcon from "../assets/LoginIcon.svg";
import ProfileImg from "./ProfileImg";
import { useAuth } from "../hooks/useAuth";

export default function Banner() {
  const { user } = useAuth();

  return (
    <header className="w-[1920px] h-[80px] bg-white  fixed   z-50 flex justify-between items-center py-[10px] px-[100px]">
      {/* Logo with Link */}
      <Link to="/products">
        <img
          src={Logo}
          alt="Logo"
          className="w-[180px] h-[24px] my-[28px] cursor-pointer hover:opacity-80 transition-opacity"
        />
      </Link>

      {/* Right side */}
      <div>
        {!user ? (
          <Link to="/login">
            <button className="flex items-center justify-center w-[64px] h-[20px] gap-[8px]">
              <img src={loginIcon} alt="Login Icon" />
              <span className="w-[36px] h-[18px] font-poppins font-medium text-[12px] leading-[18px] text-black">
                Login
              </span>
            </button>
          </Link>
        ) : (
          <div className="w-[40px] h-[40px]">
            <ProfileImg avatar={user?.avatar} />
          </div>
        )}
      </div>
    </header>
  );
}
