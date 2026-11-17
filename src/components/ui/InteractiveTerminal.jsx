import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon, Sparkles, CornerDownLeft, Play } from "lucide-react";
import { usePerformance } from "../../context/PerformanceContext";
import { playTactileClick } from "../../utils/audio";

const COMMAND_OUTPUTS = {
  whoami: `Candidate: Ayush Kavathiya
Degree:    B.Tech Computer Science (Semester 6)
Status:    ⚡ Seeking Summer / Fall 2026-2027 SWE Internship
Passions:  High-performance Full Stack, Android, Desktop Tooling, and Distributed Systems.`,

  "cat skills.json": `{
  "frontend": ["React 18", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  "backend": ["Node.js", "Express", "RESTful APIs", "PHP", "WebSockets"],
  "databases": ["MySQL", "PostgreSQL", "SQLite", "Data Modeling"],
  "systems_and_tools": ["Python", "Android (Java/Kotlin)", "Tauri", "Git/GitHub", "Linux"],
  "soft_skills": ["High Learning Velocity", "Independent Problem Solver", "Clean Architecture"]
}`,

  "git status": `On branch main
Your branch is up to date with 'origin/production'.

Changes to be committed:
  (ready for internship interview)
    new file:   high-impact-engineer.ts
    modified:   team-velocity.go (+1000 lines)

nothing to commit, working tree clean. Ready to deploy day 1!`,

  "sudo hire-intern ayush": `[AUTHENTICATING ROOT ACCESS...]
Password verified: **********
[SUCCESS]: Offer Letter generated!
Starting onboarding protocol for Ayush Kavathiya...
Status: 🚀 Ready to solve real-world problems and ship production code!`,

  help: `Available commands:
  • whoami                 - View background, degree & internship target
  • cat skills.json        - Inspect verified technical stack
  • git status             - Check repository & readiness status
  • sudo hire-intern ayush - Fun recruitment easter egg!
  • clear                  - Clear terminal screen`,

  skills: `{
  "frontend": ["React 18", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  "backend": ["Node.js", "Express", "RESTful APIs", "PHP", "WebSockets"],
  "databases": ["MySQL", "PostgreSQL", "SQLite", "Data Modeling"],
  "systems_and_tools": ["Python", "Android (Java/Kotlin)", "Tauri", "Git/GitHub", "Linux"],
  "soft_skills": ["High Learning Velocity", "Independent Problem Solver", "Clean Architecture"]
}`,

  status: `On branch main
Your branch is up to date with 'origin/production'.
Changes ready for interview: High-impact software engineer ready for Day 1!`,

  hire: `[AUTHENTICATING ROOT ACCESS...]
Password verified: **********
[SUCCESS]: Offer Letter generated!
Status: 🚀 Ready to solve real-world problems and ship production code!`,
};

export default function InteractiveTerminal() {
  const { showToast } = usePerformance();
  const [history, setHistory] = useState([
    {
      id: "init-1",
      cmd: "whoami",
      text: COMMAND_OUTPUTS["whoami"],
      isTyping: false,
    },
    {
      id: "init-2",
      cmd: "help",
      text: COMMAND_OUTPUTS["help"],
      isTyping: false,
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalBodyRef = useRef(null);
  const typeIntervalRef = useRef(null);
  const cmdIntervalRef = useRef(null);

  // Safely scroll ONLY the terminal's internal container (NEVER the page window)
  const scrollTerminalToBottom = () => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    return () => {
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      if (cmdIntervalRef.current) clearInterval(cmdIntervalRef.current);
    };
  }, []);

  // Animate typewriter stream of command output
  const streamOutput = (cmdName, fullText) => {
    const entryId = "entry-" + Date.now();
    
    // Add entry with empty text and cursor active
    setHistory((prev) => [
      ...prev,
      { id: entryId, cmd: cmdName, text: "", isTyping: true },
    ]);

    let charIdx = 0;
    // Pacing: stream 2-3 characters every 14ms for ultra fluid typing
    const chunkSize = fullText.length > 250 ? 3 : 2;
    const speed = 14;

    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);

    typeIntervalRef.current = setInterval(() => {
      charIdx = Math.min(charIdx + chunkSize, fullText.length);
      const partialText = fullText.slice(0, charIdx);
      const isComplete = charIdx >= fullText.length;

      setHistory((prev) =>
        prev.map((item) =>
          item.id === entryId
            ? { ...item, text: partialText, isTyping: !isComplete }
            : item
        )
      );

      scrollTerminalToBottom();

      if (isComplete) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
        setIsProcessing(false);
        playTactileClick("success");

        if (cmdName.includes("hire")) {
          showToast("🎉 Offer sent! Let's connect!");
        }
      }
    }, speed);
  };

  // Triggered when user clicks a quick command pill
  const handlePillClick = (targetCmd) => {
    if (isProcessing) return;
    playTactileClick("light");

    if (targetCmd === "clear") {
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      if (cmdIntervalRef.current) clearInterval(cmdIntervalRef.current);
      setHistory([]);
      setInputVal("");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    setInputVal("");

    if (cmdIntervalRef.current) clearInterval(cmdIntervalRef.current);

    // Step 1: Type the command into the input box character-by-character
    let cmdCharIdx = 0;
    cmdIntervalRef.current = setInterval(() => {
      cmdCharIdx++;
      setInputVal(targetCmd.slice(0, cmdCharIdx));

      if (cmdCharIdx >= targetCmd.length) {
        clearInterval(cmdIntervalRef.current);
        cmdIntervalRef.current = null;

        // Step 2: Pause briefly, then execute and stream output
        setTimeout(() => {
          setInputVal("");
          const output =
            COMMAND_OUTPUTS[targetCmd] ||
            `Command not found: "${targetCmd}". Type 'help' to see valid commands.`;
          streamOutput(targetCmd, output);
        }, 160);
      }
    }, 28);
  };

  // Triggered when user presses Enter in input
  const handleInputSubmit = (e) => {
    if (e) e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd || isProcessing) return;

    if (cmd === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    }

    setIsProcessing(true);
    const rawCmd = inputVal;
    setInputVal("");

    const output =
      COMMAND_OUTPUTS[cmd] ||
      `Command not found: "${rawCmd}". Type 'help' to see valid commands.`;

    streamOutput(rawCmd, output);
  };

  return (
    <section id="terminal" className="relative px-6 py-16 lg:py-24 w-full scroll-mt-28">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-gold/20 text-xs font-mono text-gold-light mb-3 shadow-glass-gold">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Interactive Recruiter Playground</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Inspect the Codebase & Mindset.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/50 max-w-xl mx-auto">
            Click any command pill below to watch the live terminal type and stream the output in real-time.
          </p>

          {/* Quick Command Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {[
              "whoami",
              "cat skills.json",
              "git status",
              "sudo hire-intern ayush",
              "clear",
            ].map((btnCmd) => (
              <button
                key={btnCmd}
                disabled={isProcessing}
                onClick={() => handlePillClick(btnCmd)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 active:scale-95 ${
                  isProcessing
                    ? "opacity-50 cursor-not-allowed bg-white/[0.02] border-white/[0.05] text-white/40"
                    : "bg-white/[0.05] border-white/[0.1] hover:border-gold/50 hover:bg-gold/15 text-white/80 hover:text-gold-light shadow-sm"
                }`}
              >
                <Play className="w-2.5 h-2.5 fill-current opacity-70" />
                <span>{btnCmd}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Terminal Glass Container */}
        <motion.div
          data-cursor="terminal"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="liquid-glass rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
        >
          {/* macOS / visionOS Style Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.04] border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>

            <div className="text-xs font-mono text-white/50 tracking-wider">
              ayush@engineering-terminal: ~ (bash)
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-gold-light/80">
              <Sparkles className="w-3 h-3" />
              <span>v2.6-live</span>
            </div>
          </div>

          {/* Terminal Console Content (Scrolls internally without moving the page) */}
          <div
            ref={terminalBodyRef}
            className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-white/80 max-h-[380px] overflow-y-auto space-y-4 hide-scrollbar"
          >
            {history.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center gap-2 text-gold-light font-medium">
                  <span className="text-sapphire-light">ayush@macbook:~$</span>
                  <span>{item.cmd}</span>
                </div>
                <pre className="text-white/75 whitespace-pre-wrap leading-relaxed pl-4 border-l border-white/15">
                  {item.text}
                  {item.isTyping && (
                    <span className="inline-block w-2 h-4 bg-gold-light animate-pulse ml-0.5 align-middle" />
                  )}
                </pre>
              </div>
            ))}

            {/* Active Command Input Line */}
            <form onSubmit={handleInputSubmit} className="flex items-center gap-2 pt-2">
              <span className="text-sapphire-light shrink-0">ayush@macbook:~$</span>
              <input
                type="text"
                value={inputVal}
                disabled={isProcessing}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={isProcessing ? "Executing command..." : "type 'help' or click any button above..."}
                className="w-full bg-transparent border-none outline-none text-gold-light font-mono text-xs sm:text-sm placeholder:text-white/25 disabled:opacity-50"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="submit"
                disabled={isProcessing || !inputVal.trim()}
                className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-colors"
                title="Execute"
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
