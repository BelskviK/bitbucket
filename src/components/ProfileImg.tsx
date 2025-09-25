import defaultProfile from "../assets/DefaultProfileImg.svg";
import type { ProfileImgProps } from "../types";

export default function ProfileImg({ avatar, className }: ProfileImgProps) {
  return (
    <img
      src={avatar || defaultProfile}
      alt="Profile"
      className={`w-full h-full rounded-full object-cover ${className || ""}`}
    />
  );
}
