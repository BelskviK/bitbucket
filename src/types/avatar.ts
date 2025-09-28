// src/types/avatar.ts
export interface AvatarInputState {
  avatarPreview: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AvatarInputProps {
  onAvatarChange: (avatar: File | null) => void;
  currentAvatar?: string;
}

export interface UseAvatarInputReturn {
  state: AvatarInputState;
  handleFileSelect: (file: File) => Promise<void>;
  handleRemove: () => void;
}

export interface UseAvatarInputProps {
  currentAvatar?: string;
}
