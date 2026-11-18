import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { setSoundEnabled as syncAudioEnabled, playTactileClick } from "../utils/audio";

const SOUND_STORAGE_KEY = "ayush_atelier_sound";

const PerformanceActionsContext = createContext(null);
const ActiveSectionContext = createContext("home");
const OverlayStateContext = createContext(null);
const ToastContext = createContext(null);

export function PerformanceProvider({ children }) {
  const [toastMessage, setToastMessage] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isFastPassOpen, setIsFastPassOpen] = useState(false);
  const [isProjectOverlayOpen, setIsProjectOverlayOpen] = useState(false);
  const [activeSection, setActiveSectionState] = useState("home");
  // Strictly OFF by default (opt-in only)
  const [soundEnabled, setSoundEnabledState] = useState(false);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.remove("perf-mode");
    try {
      localStorage.removeItem("ayush_portfolio_eco");
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      if (saved === "true") {
        setSoundEnabledState(true);
        syncAudioEnabled(true);
      } else {
        syncAudioEnabled(false);
      }
    } catch {
      syncAudioEnabled(false);
    }
  }, []);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3000);
  }, []);

  const setActiveSection = useCallback((nextSection) => {
    setActiveSectionState((prev) => (prev === nextSection ? prev : nextSection));
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      syncAudioEnabled(next);
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      } catch {
        // ignore storage errors
      }
      if (next) {
        playTactileClick("light");
        showToast("Interface sound enabled");
      } else {
        showToast("Interface sound muted");
      }
      return next;
    });
  }, [showToast]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Stable action references: consumers using only actions NEVER re-render on scroll/state updates
  const actionsValue = useMemo(
    () => ({
      showToast,
      setIsResumeOpen,
      setIsFastPassOpen,
      setIsProjectOverlayOpen,
      setActiveSection,
      toggleSound,
    }),
    [showToast, setActiveSection, toggleSound]
  );

  const overlayValue = useMemo(
    () => ({
      isResumeOpen,
      isFastPassOpen,
      isProjectOverlayOpen,
      soundEnabled,
    }),
    [isResumeOpen, isFastPassOpen, isProjectOverlayOpen, soundEnabled]
  );

  return (
    <PerformanceActionsContext.Provider value={actionsValue}>
      <OverlayStateContext.Provider value={overlayValue}>
        <ActiveSectionContext.Provider value={activeSection}>
          <ToastContext.Provider value={toastMessage}>
            {children}
          </ToastContext.Provider>
        </ActiveSectionContext.Provider>
      </OverlayStateContext.Provider>
    </PerformanceActionsContext.Provider>
  );
}

export function usePerformanceActions() {
  const ctx = useContext(PerformanceActionsContext);
  if (!ctx) {
    throw new Error("usePerformanceActions must be used within a PerformanceProvider");
  }
  return ctx;
}

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}

export function useOverlayState() {
  const ctx = useContext(OverlayStateContext);
  if (!ctx) {
    throw new Error("useOverlayState must be used within a PerformanceProvider");
  }
  return ctx;
}

export function useToastMessage() {
  return useContext(ToastContext);
}

export function usePerformance() {
  const actions = usePerformanceActions();
  const overlays = useOverlayState();
  const activeSection = useActiveSection();
  const toastMessage = useToastMessage();
  return {
    ...actions,
    ...overlays,
    activeSection,
    toastMessage,
  };
}
