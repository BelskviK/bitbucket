// src/hooks/useAvatarInput.ts
import { useState, useCallback, useEffect, useMemo } from "react";

interface AvatarInputState {
  avatarPreview: string;
  isLoading: boolean;
  error?: string;
}

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

interface UseAvatarInputProps {
  initialAvatar?: string;
  validationRules?: {
    maxSize?: number;
    allowedTypes?: string[];
    maxWidth?: number;
    maxHeight?: number;
  };
}

interface UseAvatarInputReturn {
  state: AvatarInputState;
  handleFileSelect: (file: File) => Promise<void>;
  handleRemove: () => void;
  setError: (error: string) => void;
  clearError: () => void;
  validateFile: (file: File) => FileValidationResult;
}

const DEFAULT_VALIDATION_RULES = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
  maxWidth: 2000,
  maxHeight: 2000,
};

const ERROR_MESSAGES = {
  INVALID_FILE_TYPE: "Please select an image file",
  UNSUPPORTED_FORMAT:
    "Please select a valid image file (JPEG, PNG, GIF, WebP, SVG)",
  FILE_TOO_LARGE: (maxSizeMB: number) =>
    `File size should be less than ${maxSizeMB}MB`,
  IMAGE_TOO_LARGE: (maxWidth: number, maxHeight: number) =>
    `Image dimensions should be less than ${maxWidth}x${maxHeight} pixels`,
  FAILED_TO_LOAD: "Failed to load image",
  FAILED_TO_READ: "Failed to read file",
  PROCESSING_FAILED: "Failed to process image",
} as const;

export const useAvatarInput = ({
  initialAvatar = "",
  validationRules = {},
}: UseAvatarInputProps = {}): UseAvatarInputReturn => {
  // Fix: Wrap mergedValidationRules in useMemo to prevent unnecessary re-renders
  const mergedValidationRules = useMemo(
    () => ({
      ...DEFAULT_VALIDATION_RULES,
      ...validationRules,
    }),
    [validationRules]
  );

  const [state, setState] = useState<AvatarInputState>({
    avatarPreview: initialAvatar,
    isLoading: false,
    error: undefined,
  });

  // Clean up object URLs on unmount or when avatar changes
  useEffect(() => {
    return () => {
      if (state.avatarPreview && state.avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(state.avatarPreview);
      }
    };
  }, [state.avatarPreview]);

  const validateFile = useCallback(
    (file: File): FileValidationResult => {
      if (!file.type.startsWith("image/")) {
        return {
          isValid: false,
          error: ERROR_MESSAGES.INVALID_FILE_TYPE,
        };
      }

      if (!mergedValidationRules.allowedTypes.includes(file.type)) {
        return {
          isValid: false,
          error: ERROR_MESSAGES.UNSUPPORTED_FORMAT,
        };
      }

      if (file.size > mergedValidationRules.maxSize) {
        const maxSizeMB = mergedValidationRules.maxSize / (1024 * 1024);
        return {
          isValid: false,
          error: ERROR_MESSAGES.FILE_TOO_LARGE(maxSizeMB),
        };
      }

      return { isValid: true };
    },
    [mergedValidationRules]
  );

  const validateImageDimensions = useCallback(
    (file: File): Promise<FileValidationResult> => {
      return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl); // Clean up immediately after loading

          if (
            img.width > mergedValidationRules.maxWidth ||
            img.height > mergedValidationRules.maxHeight
          ) {
            resolve({
              isValid: false,
              error: ERROR_MESSAGES.IMAGE_TOO_LARGE(
                mergedValidationRules.maxWidth,
                mergedValidationRules.maxHeight
              ),
            });
          } else {
            resolve({ isValid: true });
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve({
            isValid: false,
            error: ERROR_MESSAGES.FAILED_TO_LOAD,
          });
        };

        img.src = objectUrl;
      });
    },
    [mergedValidationRules]
  );

  const createImagePreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          // Use object URL for better performance with large images
          const objectUrl = URL.createObjectURL(file);
          resolve(objectUrl);
        } else {
          reject(new Error(ERROR_MESSAGES.FAILED_TO_READ));
        }
      };

      reader.onerror = () => reject(new Error(ERROR_MESSAGES.FAILED_TO_READ));
      reader.readAsDataURL(file); // Still read as data URL for initial validation
    });
  }, []);

  const handleFileSelect = useCallback(
    async (file: File): Promise<void> => {
      // Clear previous error and set loading state
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: undefined,
      }));

      try {
        // Step 1: Basic file validation
        const basicValidation = validateFile(file);
        if (!basicValidation.isValid) {
          throw new Error(basicValidation.error);
        }

        // Step 2: Image dimension validation (only for non-SVG images)
        if (!file.type.includes("svg")) {
          const dimensionValidation = await validateImageDimensions(file);
          if (!dimensionValidation.isValid) {
            throw new Error(dimensionValidation.error);
          }
        }

        // Step 3: Create preview
        const previewUrl = await createImagePreview(file);

        // Clean up previous preview if it was an object URL
        if (state.avatarPreview && state.avatarPreview.startsWith("blob:")) {
          URL.revokeObjectURL(state.avatarPreview);
        }

        // Step 4: Update state with new preview
        setState({
          avatarPreview: previewUrl,
          isLoading: false,
          error: undefined,
        });
      } catch (err) {
        // Clean up any created object URLs on error
        if (err instanceof Error && err.message.includes("blob:")) {
          URL.revokeObjectURL(err.message);
        }

        const errorMessage =
          err instanceof Error ? err.message : ERROR_MESSAGES.PROCESSING_FAILED;

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          // Keep the existing avatar preview on error
          avatarPreview: prev.avatarPreview,
        }));

        throw err; // Re-throw to let component handle it
      }
    },
    [
      validateFile,
      validateImageDimensions,
      createImagePreview,
      state.avatarPreview,
    ]
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

  // Fix: Remove reset function from return type since it's not in the interface
  // const reset = useCallback(() => {
  //   if (state.avatarPreview && state.avatarPreview.startsWith("blob:")) {
  //     URL.revokeObjectURL(state.avatarPreview);
  //   }

  //   setState({
  //     avatarPreview: initialAvatar,
  //     isLoading: false,
  //     error: undefined,
  //   });
  // }, [initialAvatar, state.avatarPreview]);

  return {
    state,
    handleFileSelect,
    handleRemove,
    setError,
    clearError,
    validateFile,
    // Remove reset from return object since it's not in the interface
  };
};

// Export validation function for external use
export const validateAvatarFile = (
  file: File,
  validationRules = {}
): FileValidationResult => {
  const mergedRules = {
    ...DEFAULT_VALIDATION_RULES,
    ...validationRules,
  };

  if (!file.type.startsWith("image/")) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_FILE_TYPE,
    };
  }

  if (!mergedRules.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.UNSUPPORTED_FORMAT,
    };
  }

  if (file.size > mergedRules.maxSize) {
    const maxSizeMB = mergedRules.maxSize / (1024 * 1024);
    return {
      isValid: false,
      error: ERROR_MESSAGES.FILE_TOO_LARGE(maxSizeMB),
    };
  }

  return { isValid: true };
};
