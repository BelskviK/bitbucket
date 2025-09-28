// src/components/auth/AvatarInput.tsx
import { useRef } from "react";
import UploadPhoto from "@/assets/UploadPhoto.svg";
import { useAvatarInput } from "@/hooks/useAvatarInput";
import { AVATAR_CONSTANTS } from "@/constants";

interface AvatarInputProps {
  onAvatarChange: (avatar: File | null) => void;
  initialAvatar?: string;
}

export default function AvatarInput({
  onAvatarChange,
  initialAvatar = "",
}: AvatarInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, handleFileSelect, handleRemove } = useAvatarInput({
    initialAvatar,
  });

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await handleFileSelect(file);
        onAvatarChange(file);
      } catch (error) {
        onAvatarChange(null);
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveClick = () => {
    handleRemove();
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className="flex flex-row items-center gap-[15px]"
      style={{
        width: AVATAR_CONSTANTS.DIMENSIONS.CONTAINER.WIDTH,
        height: AVATAR_CONSTANTS.DIMENSIONS.CONTAINER.HEIGHT,
      }}
    >
      {/* Upload area - always show the upload section */}
      <div
        className="flex flex-row items-center gap-2 cursor-pointer"
        onClick={handleUploadClick}
      >
        {/* Show uploaded image or default upload icon */}
        {state.avatarPreview ? (
          <img
            src={state.avatarPreview}
            alt="Avatar preview"
            className="rounded-full object-cover"
            style={{
              width: AVATAR_CONSTANTS.DIMENSIONS.PREVIEW.WIDTH,
              height: AVATAR_CONSTANTS.DIMENSIONS.PREVIEW.HEIGHT,
            }}
          />
        ) : (
          <img
            src={UploadPhoto}
            alt="Upload"
            className="rounded-full object-cover"
            style={{
              width: AVATAR_CONSTANTS.DIMENSIONS.PREVIEW.WIDTH,
              height: AVATAR_CONSTANTS.DIMENSIONS.PREVIEW.HEIGHT,
            }}
          />
        )}

        {/* Show different text based on whether image is uploaded or not */}
        <div className="font-poppins font-normal text-[14px] leading-[100%] text-center">
          {state.avatarPreview
            ? AVATAR_CONSTANTS.STRINGS.UPLOAD_NEW
            : AVATAR_CONSTANTS.STRINGS.UPLOAD_IMAGE}
        </div>
      </div>

      {/* Remove button - only show when image is uploaded */}
      {state.avatarPreview && (
        <button
          type="button"
          onClick={handleRemoveClick}
          className="font-poppins font-normal text-[14px] leading-[100%] text-center hover:text-red-700 transition-colors"
        >
          {AVATAR_CONSTANTS.STRINGS.REMOVE}
        </button>
      )}

      {/* Loading state */}
      {state.isLoading && (
        <div className="flex items-center justify-center">
          <div
            className="animate-spin rounded-full border-b-2 border-gray-900"
            style={{
              width: AVATAR_CONSTANTS.STRINGS.LOADING_SPINNER_SIZE,
              height: AVATAR_CONSTANTS.STRINGS.LOADING_SPINNER_SIZE,
            }}
          ></div>
          <span className="ml-2">{AVATAR_CONSTANTS.STRINGS.PROCESSING}</span>
        </div>
      )}

      {/* Error display */}
      {state.error && (
        <div className="text-red-500 text-sm mt-2">{state.error}</div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={AVATAR_CONSTANTS.VALIDATION.ACCEPTED_TYPES}
        className="hidden"
      />
    </div>
  );
}
