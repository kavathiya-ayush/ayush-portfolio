import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CornerDownLeft } from "lucide-react";
import { usePerformanceActions } from "../../context/PerformanceContext";
import { playTactileClick } from "../../utils/audio";
import { profile, projects, stackCategories } from "../../data/portfolio";

const COFFEE_FRAMES = [
  `[SIMULATED BREWER]
  Step 1/3 · Grinding dark roast beans...
       .  .  .
     [=========]
      |       |`,

  `[SIMULATED BREWER]
  Step 2/3 · Blooming pour-over (92°C)...
       ~  ~
      ( (  ) )
     [=========]
      |~~~~~~~|`,

  `[SIMULATED BREWER]
  Step 3/3 · Extracting espresso notes...
        ( (
         ) )
      ........
      |      |]
      \\      /
       \`----'`,

  `[SIMULATED BREWER — READY]
        (  (
         )  )
      ........
      |      |]   Obsidian Roast · Single Origin
      \\      /    Status: Ready for code review.
       \`----'     Note: Simulated caffeine only.`,
];

const FORTUNES = [
  "\"Make it work, make it right, make it fast — in that exact order.\" — Kent Beck",
  "\"Simplicity is prerequisite for reliability.\" — Edsger W. Dijkstra",
  "\"Clean data structures usually eliminate half the code you thought you needed.\"",
  "\"A working utility used by real people teaches more than ten unfinished prototypes.\"",
  "\"Good error handling is respect for the person using your software on a bad connection.\"",
  "\"Readability outlives cleverness every time a repository is revisited six months later.\"",
];

const ALIASES = {
  skills: "cat skills.json",
  "cat skills": "cat skills.json",
  status: "git status",
  hire: "sudo hire-intern ayush",
  "sudo hire": "sudo hire-intern ayush",
  coffee: "brew coffee",
};

const QUICK_COMMANDS = [
  "whoami",
  "cat skills.json",
  "git status",
  "brew coffee",
  "fortune",
  "sudo hire-intern ayush",
  "clear",
];

export default function InteractiveTerminal() {
  const { showToast } = usePerformanceActions();
  const shouldReduceMotion = useReducedMotion();
  const lastFortuneIdxRef = useRef(-1);

  const commandOutputs = useMemo(() => {
    const skillsObject = {};
    stackCategories.forEach((group) => {
      skillsObject[group.id] = group.items.map((item) => item.name);
    });
    skillsObject.languages_spoken = profile.languages;

    const projectLines = projects
      .map(
        (p) =>
          `  ${p.index}  ${p.title.padEnd(28, " ")} [${
            p.featured ? "featured" : "archive "
          }] (${p.category})`
      )
      .join("\n");

    return {
      whoami: `Candidate : ${profile.name}
Education : ${profile.degreeFull}
Languages : ${profile.languages.join(", ")}
Email     : ${profile.email}
Status    : ${profile.availability}`,

      "cat skills.json": JSON.stringify(skillsObject, null, 2),

      "git status": `On branch main (simulated browser shell)
Portfolio synchronized with resume PDF.

Recorded projects:
${projectLines}`,

      "sudo hire-intern ayush": `[SIMULATED SHELL — RECRUITER CHECKLIST]
  ✓ Candidate    : ${profile.name} (${profile.degree})
  ✓ Availability : ${profile.availability}
  ✓ Live Demos   : Chat Wala · RedCell-Connect · Shivam Pump Stock · Omni Tool Convertor
  ✓ Resume PDF   : Available via "Resume" or "Quick Overview" in top bar
  → Next Step    : ${profile.email} | ${profile.phone}`,

      help: `Simulated shell commands (browser sandbox — no OS commands executed):
  whoami                 — Profile, BCA university track & email
  cat skills.json        — Synchronized technical toolkit from resume
  git status             — Summary of featured & archived projects
  brew coffee            — Simulated ASCII pour-over sequence
  fortune                — Grounded engineering aphorism
  sudo hire-intern ayush — Recruiter quick-hire checklist
  clear                  — Reset console buffer`,
    };
  }, []);

  const [history, setHistory] = useState(() => [
    {
      id: "init-1",
      cmd: "whoami",
      text: commandOutputs.whoami,
      isTyping: false,
    },
    {
      id: "init-2",
      cmd: "help",
      text: commandOutputs.help,
      isTyping: false,
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const terminalBodyRef = useRef(null);
  const typeIntervalRef = useRef(null);
  const cmdIntervalRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const frameTimersRef = useRef([]);

  const scrollTerminalToBottom = () => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  };

  const clearActiveTimers = () => {
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
    if (cmdIntervalRef.current) {
      clearInterval(cmdIntervalRef.current);
      cmdIntervalRef.current = null;
    }
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    frameTimersRef.current.forEach((id) => clearTimeout(id));
    frameTimersRef.current = [];
  };

  useEffect(() => {
    return () => clearActiveTimers();
  }, []);

  const pickFortune = () => {
    let nextIdx = Math.floor(Math.random() * FORTUNES.length);
    if (nextIdx === lastFortuneIdxRef.current) {
      nextIdx = (nextIdx + 1) % FORTUNES.length;
    }
    lastFortuneIdxRef.current = nextIdx;
    return `[SIMULATED FORTUNE]\n  ${FORTUNES[nextIdx]}`;
  };

  const runCoffeeSequence = (cmdDisplay) => {
    const entryId = `entry-${Date.now()}`;

    if (shouldReduceMotion) {
      setHistory((prev) => [
        ...prev,
        {
          id: entryId,
          cmd: cmdDisplay,
          text: COFFEE_FRAMES[COFFEE_FRAMES.length - 1],
          isTyping: false,
        },
      ]);
      setIsProcessing(false);
      window.requestAnimationFrame(scrollTerminalToBottom);
      return;
    }

    setHistory((prev) => [
      ...prev,
      { id: entryId, cmd: cmdDisplay, text: COFFEE_FRAMES[0], isTyping: true },
    ]);
    window.requestAnimationFrame(scrollTerminalToBottom);

    COFFEE_FRAMES.slice(1).forEach((frameText, idx) => {
      const isLast = idx === COFFEE_FRAMES.length - 2;
      const timer = setTimeout(() => {
        setHistory((prev) =>
          prev.map((item) =>
            item.id === entryId
              ? { ...item, text: frameText, isTyping: !isLast }
              : item
          )
        );
        scrollTerminalToBottom();
        if (isLast) {
          setIsProcessing(false);
          playTactileClick("success");
        }
      }, (idx + 1) * 420);
      frameTimersRef.current.push(timer);
    });
  };

  const streamOutput = (cmdDisplay, fullText) => {
    const entryId = `entry-${Date.now()}`;
    setHistory((prev) => [
      ...prev,
      { id: entryId, cmd: cmdDisplay, text: "", isTyping: true },
    ]);

    if (shouldReduceMotion) {
      setHistory((prev) =>
        prev.map((item) =>
          item.id === entryId ? { ...item, text: fullText, isTyping: false } : item
        )
      );
      setIsProcessing(false);
      window.requestAnimationFrame(scrollTerminalToBottom);
      if (cmdDisplay.toLowerCase().includes("hire")) {
        showToast("Ready to connect — open Quick Overview or Contact anytime");
      }
      return;
    }

    let charIdx = 0;
    const chunkSize = fullText.length > 240 ? 3 : 2;
    const speed = 13;

    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);

    typeIntervalRef.current = setInterval(() => {
      charIdx = Math.min(charIdx + chunkSize, fullText.length);
      const partial = fullText.slice(0, charIdx);
      const done = charIdx >= fullText.length;

      setHistory((prev) =>
        prev.map((item) =>
          item.id === entryId
            ? { ...item, text: partial, isTyping: !done }
            : item
        )
      );

      scrollTerminalToBottom();

      if (done) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
        setIsProcessing(false);
        playTactileClick("success");
        if (cmdDisplay.toLowerCase().includes("hire")) {
          showToast("Ready to connect — open Quick Overview or Contact anytime");
        }
      }
    }, speed);
  };

  const executeNormalizedCommand = (rawDisplay) => {
    const normalized = rawDisplay.trim().toLowerCase();
    const mapped = ALIASES[normalized] || normalized;

    if (mapped === "brew coffee") {
      runCoffeeSequence(rawDisplay);
      return;
    }
    if (mapped === "fortune") {
      streamOutput(rawDisplay, pickFortune());
      return;
    }

    const output =
      commandOutputs[mapped] ||
      `Unknown command: "${rawDisplay}". Run 'help' to list simulated commands.`;
    streamOutput(rawDisplay, output);
  };

  const handlePillClick = (targetCmd) => {
    if (isProcessing) return;
    playTactileClick("light");

    if (targetCmd === "clear") {
      clearActiveTimers();
      setHistory([]);
      setInputVal("");
      setIsProcessing(false);
      return;
    }

    if (shouldReduceMotion) {
      setIsProcessing(true);
      executeNormalizedCommand(targetCmd);
      return;
    }

    setIsProcessing(true);
    setInputVal("");
    clearActiveTimers();

    let idx = 0;
    cmdIntervalRef.current = setInterval(() => {
      idx += 1;
      setInputVal(targetCmd.slice(0, idx));

      if (idx >= targetCmd.length) {
        clearInterval(cmdIntervalRef.current);
        cmdIntervalRef.current = null;

        pauseTimerRef.current = setTimeout(() => {
          setInputVal("");
          executeNormalizedCommand(targetCmd);
        }, 150);
      }
    }, 26);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || isProcessing) return;

    if (trimmed.toLowerCase() === "clear") {
      clearActiveTimers();
      setHistory([]);
      setInputVal("");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    setInputVal("");
    executeNormalizedCommand(trimmed);
  };

  return (
    <section
      id="terminal"
      className="relative px-5 sm:px-10 py-24 sm:py-32 scroll-mt-24 border-t border-porcelain/[0.08]"
    >
      <div className="max-w-[1040px] mx-auto">
        {/* Editorial Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
              <span>03</span>
              <span className="w-8 h-px bg-champagne/45" />
              <span>Interactive Console</span>
            </div>
            <h2 className="font-serif text-editorial-lg font-light text-porcelain">
              Inspect via <span className="italic text-champagne-pale">Command Line.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-stone max-w-sm font-light leading-relaxed">
            A simulated browser console for quick profile lookup—plus a few quiet Easter eggs like <code className="text-champagne-light">brew coffee</code> and <code className="text-champagne-light">fortune</code>.
          </p>
        </motion.div>

        {/* Quick Command Strip */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {QUICK_COMMANDS.map((btnCmd) => (
            <button
              key={btnCmd}
              type="button"
              disabled={isProcessing}
              data-cursor="magnetic"
              onClick={() => handlePillClick(btnCmd)}
              className={`px-3.5 py-1.5 rounded-full border font-mono text-[11px] tracking-wide transition-colors duration-200 ${
                isProcessing
                  ? "opacity-40 border-porcelain/[0.07] text-stone-dark"
                  : "border-porcelain/[0.12] bg-obsidian-elevated text-porcelain/85 hover:border-champagne/55 hover:text-champagne-light"
              }`}
            >
              <span className="text-champagne/80 mr-1.5">$</span>
              {btnCmd}
            </button>
          ))}
        </div>

        {/* Obsidian Atelier Precision Terminal Frame */}
        <motion.div
          data-cursor="terminal"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl overflow-hidden bg-[#0E0E12] border border-porcelain/[0.12] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 terminal-scanlines opacity-70"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-porcelain/25 to-transparent"
          />

          {/* Console Chrome Header */}
          <div className="relative z-10 flex items-center justify-between px-5 py-3.5 bg-obsidian-elevated/90 border-b border-porcelain/[0.08]">
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full border border-porcelain/25 bg-porcelain/[0.08]" />
              <span className="w-2.5 h-2.5 rounded-full border border-porcelain/25 bg-porcelain/[0.08]" />
              <span className="w-2.5 h-2.5 rounded-full border border-champagne/50 bg-champagne/25" />
            </div>

            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-dark">
              ayush@atelier — simulated shell
            </span>

            <span className="font-mono text-[11px] tracking-[0.14em] text-champagne/90">
              {isProcessing ? "RUNNING" : "SIMULATED"}
            </span>
          </div>

          {/* Scrollable Console Buffer */}
          <div
            ref={terminalBodyRef}
            className="relative z-10 p-5 sm:p-7 font-mono text-xs sm:text-[13px] max-h-[390px] overflow-y-auto space-y-5 hide-scrollbar"
          >
            {history.map((entry) => (
              <div key={entry.id} className="space-y-2">
                <div className="flex items-center gap-2.5 text-porcelain">
                  <span className="text-champagne">ayush@atelier:~$</span>
                  <span className="text-porcelain/95">{entry.cmd}</span>
                </div>
                <pre className="text-stone whitespace-pre-wrap leading-[1.72] pl-4 border-l border-porcelain/[0.12]">
                  {entry.text}
                  {entry.isTyping && !shouldReduceMotion && (
                    <span className="inline-block w-[7px] h-[14px] bg-champagne-light animate-caret-blink ml-1 align-middle" />
                  )}
                </pre>
              </div>
            ))}

            {/* Active Command Prompt */}
            <form
              onSubmit={handleInputSubmit}
              className="flex items-center gap-2.5 pt-2 border-t border-porcelain/[0.06]"
            >
              <label htmlFor="atelier-terminal-input" className="text-champagne shrink-0">
                ayush@atelier:~$
              </label>
              <input
                id="atelier-terminal-input"
                type="text"
                value={inputVal}
                disabled={isProcessing}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  isProcessing
                    ? "Running simulated command..."
                    : "try 'brew coffee', 'fortune', or 'help'"
                }
                autoComplete="off"
                spellCheck="false"
                className="w-full bg-transparent border-none outline-none text-porcelain font-mono text-xs sm:text-[13px] placeholder:text-stone-dark/80 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isProcessing || !inputVal.trim()}
                aria-label="Execute simulated command"
                className="shrink-0 p-1.5 rounded-lg text-stone hover:text-champagne-light disabled:opacity-30 transition-colors"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
