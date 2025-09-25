import { useState, useRef } from "react";
import ProfileImg from "./ProfileImg";
import UploadPhoto from "../assets/UploadPhoto.svg";

interface AvatarInputProps {
  onAvatarChange: (avatar: File | null) => void;
  currentAvatar?: string;
}

export default function AvatarInput({
  onAvatarChange,
  currentAvatar = "",
}: AvatarInputProps) {
  const [avatarPreview, setAvatarPreview] = useState(currentAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      onAvatarChange(file); // Send File object directly
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setAvatarPreview("");
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-[578px] h-[140px] flex flex-row items-center gap-[15px]">
      {/* Profile image preview */}
      <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Avatar preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <ProfileImg avatar={currentAvatar} />
        )}
      </div>
      <div
        onClick={handleUploadClick}
        className="font-poppins font-normal text-[14px] leading-[100%] text-center cursor-pointer hover:text-orange-500 transition-colors"
      >
        Upload new
      </div>

      <button
        type="button"
        onClick={handleRemove}
        className="font-poppins font-normal text-[14px] leading-[100%] text-center hover:text-red-700 transition-colors"
      >
        Remove
      </button>
      {/* Show "Upload new" and "Remove" buttons only when an image is uploaded */}
      {!avatarPreview && (
        /* Show upload button only when no image is uploaded */
        <div
          className="flex flex-row items-center gap-2 cursor-pointer"
          onClick={handleUploadClick}
        >
          <img
            src={UploadPhoto}
            alt="Upload"
            className="w-[100px] h-[100px] rounded-full object-cover"
          />
          <div className="font-poppins font-normal text-[14px] leading-[100%] text-center">
            Upload Image
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
