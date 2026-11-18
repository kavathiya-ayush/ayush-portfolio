/**
 * Optional, opt-in tactile audio feedback using Web Audio API.
 * Strictly OFF by default — plays ONLY when the visitor enables sound explicitly.
 */
let audioCtx = null;
let soundEnabledState = false;

export function setSoundEnabled(enabled) {
  soundEnabledState = Boolean(enabled);
}

export function isSoundEnabled() {
  return soundEnabledState;
}

export function playTactileClick(type = "light") {
  if (!soundEnabledState || typeof window === "undefined") return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";

    if (type === "light") {
      osc.frequency.setValueAtTime(760, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, audioCtx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.035);
    } else if (type === "success") {
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, audioCtx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.045, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.07);
    }
  } catch {
    // Ignore audio context errors gracefully
  }
}
