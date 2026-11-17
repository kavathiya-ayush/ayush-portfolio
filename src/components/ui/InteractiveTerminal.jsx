import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon, Sparkles, CornerDownLeft, Play } from "lucide-react";
import { usePerformance } from "../../context/PerformanceContext";

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
};

export default function InteractiveTerminal() {
  const { showToast } = usePerformance();
  const [history, setHistory] = useState([
    { cmd: "whoami", output: COMMAND_OUTPUTS["whoami"] },
    {
      cmd: "help",
      output: COMMAND_OUTPUTS["help"],
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const terminalBottomRef = useRef(null);

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    }

    if (cmd === "sudo hire-intern ayush" || cmd === "hire" || cmd === "sudo hire") {
      showToast("🎉 Offer sent! Let's connect!");
    }

    const output =
      COMMAND_OUTPUTS[cmd] ||
      `Command not found: "${rawCmd}". Type 'help' to see valid commands.`;

    setHistory((prev) => [...prev, { cmd: rawCmd, output }]);
    setInputVal("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
    }
  };

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <section id="terminal" className="relative px-6 py-16 lg:py-24 w-full">
      <div className="max-w-5xl mx-auto">
        {/* Section Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-gold/20 text-xs font-mono text-gold-light mb-3">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Interactive Recruiter Playground</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Inspect the Codebase & Mindset.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/50 max-w-xl mx-auto">
            Test commands directly in this simulated browser sandbox or click the quick tags below.
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
                onClick={() => executeCommand(btnCmd)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-gold/40 hover:bg-gold/10 text-xs font-mono text-white/70 hover:text-gold-light transition-all duration-200"
              >
                <Play className="w-2.5 h-2.5 fill-current opacity-60" />
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
          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>

            <div className="text-xs font-mono text-white/40 tracking-wider">
              ayush@engineering-terminal: ~ (bash)
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-gold-light/60">
              <Sparkles className="w-3 h-3" />
              <span>v2.6-live</span>
            </div>
          </div>

          {/* Terminal Console Content */}
          <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-white/80 max-h-[380px] overflow-y-auto space-y-4 hide-scrollbar">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-gold-light font-medium">
                  <span className="text-sapphire-light">ayush@macbook:~$</span>
                  <span>{item.cmd}</span>
                </div>
                <pre className="text-white/70 whitespace-pre-wrap leading-relaxed pl-4 border-l border-white/10">
                  {item.output}
                </pre>
              </div>
            ))}

            {/* Active Command Input Line */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sapphire-light shrink-0">ayush@macbook:~$</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type 'help' or any command..."
                className="w-full bg-transparent border-none outline-none text-gold-light font-mono text-xs sm:text-sm placeholder:text-white/20"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                onClick={() => executeCommand(inputVal)}
                className="shrink-0 p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
                title="Execute"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
            <div ref={terminalBottomRef} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

