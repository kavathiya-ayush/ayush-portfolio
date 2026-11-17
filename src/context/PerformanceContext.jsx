import { createContext, useContext, useState, useEffect } from "react";

const PerformanceContext = createContext();

export function PerformanceProvider({ children }) {
  const [toastMessage, setToastMessage] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    // Ensure perf-mode is permanently removed
    document.documentElement.classList.remove("perf-mode");
    localStorage.removeItem("ayush_portfolio_eco");
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2800);
  };

  return (
    <PerformanceContext.Provider
      value={{
        isEcoMode: false,
        toastMessage,
        showToast,
        isResumeOpen,
        setIsResumeOpen,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
}
