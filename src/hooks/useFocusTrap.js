import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  'object[data]',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Accessible Focus Trap & Focus Restoration Hook
 * - Uses a ref for onClose so internal modal re-renders never reset the trap
 * - Captures previously focused element before opening
 * - Moves focus cleanly into the modal/drawer container
 * - Loops Tab / Shift+Tab within visible focusable descendants
 * - Closes on Escape and restores focus back to the trigger element
 */
export function useFocusTrap(isOpen, containerRef, onClose) {
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const focusables = getVisibleFocusables(container);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        container.focus();
      }
    });

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (e.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;
      const focusables = getVisibleFocusables(container);

      if (focusables.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current.focus === "function" &&
        document.contains(previousFocusRef.current)
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, containerRef]);
}

function getVisibleFocusables(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) =>
      el instanceof HTMLElement &&
      !el.hasAttribute("inert") &&
      el.offsetParent !== null
  );
}
