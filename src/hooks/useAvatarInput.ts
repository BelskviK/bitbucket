// src/hooks/useAvatarInput.ts
import { useState, useCallback } from "react";

interface AvatarInputState {
  avatarPreview: string;
  isLoading: boolean;
  error?: string;
}

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

const DEFAULT_VALIDATION_RULES = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  maxWidth: 2000,
  maxHeight: 2000,
};

export const useAvatarInput = (initialAvatar: string = "") => {
  const [state, setState] = useState<AvatarInputState>({
    avatarPreview: initialAvatar,
    isLoading: false,
    error: undefined,
  });

  const validateFile = useCallback((file: File): FileValidationResult => {
    if (!file.type.startsWith("image/")) {
      return {
        isValid: false,
        error: "Please select an image file",
      };
    }

    if (!DEFAULT_VALIDATION_RULES.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Please select a valid image file (JPEG, PNG, GIF, WebP)",
      };
    }

    if (file.size > DEFAULT_VALIDATION_RULES.maxSize) {
      return {
        isValid: false,
        error: `File size should be less than ${
          DEFAULT_VALIDATION_RULES.maxSize / (1024 * 1024)
        }MB`,
      };
    }

    return { isValid: true };
  }, []);

  const createImagePreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;

          img.onload = () => {
            if (
              img.width > DEFAULT_VALIDATION_RULES.maxWidth ||
              img.height > DEFAULT_VALIDATION_RULES.maxHeight
            ) {
              reject(
                new Error(
                  `Image dimensions should be less than ${DEFAULT_VALIDATION_RULES.maxWidth}x${DEFAULT_VALIDATION_RULES.maxHeight} pixels`
                )
              );
            } else {
              // Use object URL for better performance with large images
              const objectUrl = URL.createObjectURL(file);
              resolve(objectUrl);
            }
          };

          img.onerror = () => reject(new Error("Failed to load image"));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(
    async (file: File): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true, error: undefined }));

      try {
        const validation = validateFile(file);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        const previewUrl = await createImagePreview(file);

        setState((prev) => ({
          ...prev,
          avatarPreview: previewUrl,
          isLoading: false,
          error: undefined,
        }));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to process image";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          avatarPreview: "",
        }));
        throw err; // Re-throw to let component handle it
      }
    },
    [validateFile, createImagePreview]
  );

  const handleRemove = useCallback(() => {
    // Revoke object URL to prevent memory leaks
    if (state.avatarPreview && state.avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(state.avatarPreview);
    }

    setState({
      avatarPreview: "",
      isLoading: false,
      error: undefined,
    });
  }, [state.avatarPreview]);

  const setError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: undefined }));
  }, []);

  return {
    state,
    handleFileSelect,
    handleRemove,
    setError,
    clearError,
  };
};
