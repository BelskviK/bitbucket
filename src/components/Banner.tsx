import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import loginIcon from "../assets/LoginIcon.svg";

export default function Banner() {
  return (
    <header className="fixed w-full h-[80px] bg-white shadow z-50 flex justify-between items-center py-[10px] px-[100px]">
      {/* Logo */}
      <img src={Logo} alt="Logo" className="w-[180px] h-[24px]" />

      {/* Login button */}
      <Link to="/login">
        <button className="flex items-center justify-center w-[64px] h-[20px] gap-[8px]">
          <img src={loginIcon} alt="Login Icon" />
          <span className="w-[36px] h-[18px] font-poppins font-medium text-[12px] leading-[18px] text-black">
            Login
          </span>
        </button>
      </Link>
    </header>
  );
}
