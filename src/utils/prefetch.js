// Centralized lazy loaders + intent-based prefetchers (zero visible loading delay)
let resumePromise = null;
let fastPassPromise = null;
let xrayPromise = null;
let inspectorPromise = null;
let terminalPromise = null;

export function loadResumeModal() {
  if (!resumePromise) resumePromise = import("../components/ui/ResumeModal");
  return resumePromise;
}

export function loadFastPassModal() {
  if (!fastPassPromise) fastPassPromise = import("../components/ui/RecruiterFastPassModal");
  return fastPassPromise;
}

export function loadProjectXRay() {
  if (!xrayPromise) xrayPromise = import("../components/ui/ProjectXRay");
  return xrayPromise;
}

export function loadScreenInspector() {
  if (!inspectorPromise) inspectorPromise = import("../components/ui/ScreenInspector");
  return inspectorPromise;
}

export function loadInteractiveTerminal() {
  if (!terminalPromise) terminalPromise = import("../components/ui/InteractiveTerminal");
  return terminalPromise;
}

const warmedImages = new Set();
export function warmDecodeImage(src) {
  if (!src || typeof window === "undefined" || warmedImages.has(src)) return;
  warmedImages.add(src);
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  if (typeof img.decode === "function") {
    img.decode().catch(() => {});
  }
}

