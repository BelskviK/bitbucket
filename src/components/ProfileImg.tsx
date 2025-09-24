// src\components\ProfileImg.tsx
import defaultProfile from "../assets/DefaultProfileImg.png"; // 40x40 placeholder

interface ProfileImgProps {
  avatar?: string;
}

export default function ProfileImg({ avatar }: ProfileImgProps) {
  return (
    <img
      src={avatar || defaultProfile}
      alt="Profile"
      className="w-[40px] h-[40px] rounded-full object-cover"
    />
  );
}
