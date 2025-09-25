// src/components/ProfileImg.tsx
import defaultProfile from "../assets/DefaultProfileImg.svg";

interface ProfileImgProps {
  avatar?: string;
  className?: string;
}

export default function ProfileImg({ avatar, className }: ProfileImgProps) {
  return (
    <img
      src={avatar || defaultProfile}
      alt="Profile"
      className={`w-full h-full rounded-full object-cover ${className || ""}`}
    />
  );
}
