import { useEffect } from "react";
import type { RefObject } from "react";

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, ref, onClose]);
};
