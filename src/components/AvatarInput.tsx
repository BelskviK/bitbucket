// src/components/AvatarInput.tsx
import { useAuth } from "../hooks/useAuth";
import ProfileImg from "./ProfileImg";
import UploadPhoto from "../assets/UploadPhoto.svg";

export default function AvatarInput() {
  const { user } = useAuth();

  return (
    <div className="w-[578px] h-[140px] flex flex-row items-center    gap-[15px]">
      {/* Profile image */}
      <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
        <ProfileImg avatar={user?.avatar} />
      </div>

      {/* Upload new */}
      <div className="font-poppins font-normal text-[14px] leading-[100%] text-center">
        Upload new
      </div>

      {/* Remove */}
      <div className="font-poppins font-normal text-[14px] leading-[100%] text-center">
        Remove
      </div>

      {/* Upload image */}
      <div className="flex flex-row items-center gap-2">
        <img
          src={UploadPhoto}
          alt="Upload"
          className="w-[100px] h-[100px] rounded-full object-cover"
        />
        <div className="font-poppins font-normal text-[14px] leading-[100%] text-center">
          Upload Image
        </div>
      </div>
    </div>
  );
}
