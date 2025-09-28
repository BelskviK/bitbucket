// src/hooks/useStickyScroll.ts
import { useState, useEffect, useRef, useCallback } from "react";

interface UseStickyScrollOptions {
  /** Distance in pixels to scroll before element becomes sticky */
  scrollOffset?: number;
  /** Root element selector for scroll container */
  rootSelector?: string;
}

interface StickyScrollState {
  isSticky: boolean;
  shouldShow: boolean;
  elementHeight: number;
}

export const useStickyScroll = ({
  scrollOffset = 100,
  rootSelector = "main",
}: UseStickyScrollOptions = {}) => {
  const [state, setState] = useState<StickyScrollState>({
    isSticky: false,
    shouldShow: true,
    elementHeight: 0,
  });

  const elementRef = useRef<HTMLDivElement>(null);
  const originalPositionRef = useRef<number>(0);

  // Memoize the updateOriginalPosition function to prevent unnecessary re-renders
  const updateOriginalPosition = useCallback(() => {
    const scrollContainer = document.querySelector(rootSelector) as HTMLElement;
    if (elementRef.current && scrollContainer) {
      const rect = elementRef.current.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      originalPositionRef.current =
        rect.top - containerRect.top + scrollContainer.scrollTop;

      setState((prev) => ({
        ...prev,
        elementHeight: elementRef.current?.offsetHeight || 0,
      }));
    }
  }, [rootSelector]);

  // Memoize the scroll handler to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    const scrollContainer = document.querySelector(rootSelector) as HTMLElement;
    if (!elementRef.current || !scrollContainer) return;

    const scrollTop = scrollContainer.scrollTop;
    const triggerPoint = originalPositionRef.current - scrollOffset;

    // Check if we've scrolled past the trigger point
    const shouldBeSticky = scrollTop > triggerPoint;

    // Element should show when:
    // 1. We haven't reached the trigger point yet (normal position)
    // 2. We're past the trigger point (sticky position)
    const shouldShow = scrollTop <= triggerPoint || shouldBeSticky;

    setState((prev) => ({
      ...prev,
      isSticky: shouldBeSticky,
      shouldShow: shouldShow,
    }));
  }, [rootSelector, scrollOffset]);

  useEffect(() => {
    const scrollContainer = document.querySelector(rootSelector) as HTMLElement;
    if (!scrollContainer) return;

    // Initial position setup
    updateOriginalPosition();

    // Add scroll event listener
    scrollContainer.addEventListener("scroll", handleScroll);

    // Add resize observer to update positions when layout changes
    const resizeObserver = new ResizeObserver(updateOriginalPosition);
    resizeObserver.observe(scrollContainer);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [handleScroll, updateOriginalPosition, rootSelector]);

  return {
    elementRef,
    isSticky: state.isSticky,
    shouldShow: state.shouldShow,
    elementHeight: state.elementHeight,
  };
};
