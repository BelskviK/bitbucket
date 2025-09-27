import { useRef } from "react";
import ProfileImg from "@/components/common/ProfileImg";
import UploadPhoto from "@/assets/UploadPhoto.svg";
import { useAvatarInput } from "@/hooks/useAvatarInput";

interface AvatarInputProps {
  onAvatarChange: (avatar: File | null) => void;
  currentAvatar?: string;
}

export default function AvatarInput({
  onAvatarChange,
  currentAvatar = "",
}: AvatarInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, handleFileSelect, handleRemove } =
    useAvatarInput(currentAvatar);

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await handleFileSelect(file);
        onAvatarChange(file); // Send File object to parent
      } catch (error) {
        // Error is already handled in the hook state
        onAvatarChange(null);
        // You can show the error from state.error in your UI instead of alert
        if (error instanceof Error) {
          alert(error.message); // Keep alert for now, but consider better error handling
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
    <div className="w-[578px] h-[140px] flex flex-row items-center gap-[15px]">
      {/* Profile image preview */}
      <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
        {state.avatarPreview ? (
          <img
            src={state.avatarPreview}
            alt="Avatar preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <ProfileImg avatar={currentAvatar} />
        )}
      </div>

      {/* Show action buttons only when an image is uploaded */}

      <>
        <div
          onClick={handleUploadClick}
          className="font-poppins font-normal text-[14px] leading-[100%] text-center cursor-pointer hover:text-orange-500 transition-colors"
        >
          Upload new
        </div>

        <button
          type="button"
          onClick={handleRemoveClick}
          className="font-poppins font-normal text-[14px] leading-[100%] text-center hover:text-red-700 transition-colors"
        >
          Remove
        </button>
      </>

      {/* Show upload area only when no image is uploaded */}
      {!state.avatarPreview && (
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

      {/* Loading state */}
      {state.isLoading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="ml-2">Processing image...</span>
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
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
