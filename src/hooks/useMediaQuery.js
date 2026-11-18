import { useState, useEffect } from "react";

/**
 * Lightweight matchMedia hook for mounting only the active responsive subtree
 * (prevents hidden desktop/mobile trees from decoding duplicate images or running hidden motion nodes).
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

