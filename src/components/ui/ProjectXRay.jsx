import { useState, useEffect, useRef } from "react";
import { ArrowRight, Layers, Cpu } from "lucide-react";
import { playTactileClick } from "../../utils/audio";

/**
 * PROJECT X-RAY — Interactive Architecture Explorer
 * - Renders each project's genuine architecture nodes & layer flow
 * - Keyboard accessible (Tab / ArrowLeft / ArrowRight / Home / End)
 * - Highlights connected upstream & downstream components on selection
 * - Responsive cleanly from 360px mobile to desktop
 */
export default function ProjectXRay({ project }) {
  const nodes = project?.architecture?.nodes || [];
  const [selectedId, setSelectedId] = useState(nodes[0]?.id || null);
  const nodeRefs = useRef([]);

  useEffect(() => {
    setSelectedId(project?.architecture?.nodes?.[0]?.id || null);
  }, [project?.slug, project?.architecture?.nodes]);

  if (!nodes.length) return null;

  const selectedNode = nodes.find((n) => n.id === selectedId) || nodes[0];

  // Bidirectional connection awareness: nodes this node connects to OR nodes connecting to this node
  const connectedIds = new Set(selectedNode.connectsTo || []);
  nodes.forEach((n) => {
    if (n.connectsTo?.includes(selectedNode.id)) {
      connectedIds.add(n.id);
    }
  });

  const connectedLabels = nodes
    .filter((n) => connectedIds.has(n.id) && n.id !== selectedNode.id)
    .map((n) => n.label);

  const handleNodeKeyDown = (e, idx) => {
    const last = nodes.length - 1;
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = idx === last ? 0 : idx + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = idx === 0 ? last : idx - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;

    if (next !== null) {
      e.preventDefault();
      setSelectedId(nodes[next].id);
      nodeRefs.current[next]?.focus();
    }
  };

  return (
    <div className="space-y-6">
      {/* Architecture Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-porcelain/10">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
          <Cpu className="w-3.5 h-3.5" />
          <span>System Topology — {nodes.length} Components</span>
        </div>
        <span className="font-mono text-[11px] text-stone-dark">
          Select any node to inspect communication
        </span>
      </div>

      <p className="text-xs sm:text-sm text-stone leading-relaxed font-light">
        {project.architecture.summary}
      </p>

      {/* Interactive Architectural Flow Canvas */}
      <div className="relative p-4 sm:p-6 rounded-xl bg-obsidian border border-porcelain/12 overflow-hidden">
        {/* Subtle blueprint grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(244,241,234,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,241,234,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Responsive Selectable Node Topology */}
        <div
          role="group"
          aria-label={`${project.title} architecture components`}
          className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {nodes.map((node, idx) => {
            const isSelected = node.id === selectedNode.id;
            const isConnected = connectedIds.has(node.id) && !isSelected;

            return (
              <button
                key={node.id}
                ref={(el) => {
                  nodeRefs.current[idx] = el;
                }}
                type="button"
                aria-pressed={isSelected}
                data-cursor="magnetic"
                onKeyDown={(e) => handleNodeKeyDown(e, idx)}
                onClick={() => {
                  playTactileClick("light");
                  setSelectedId(node.id);
                }}
                className={`group text-left p-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? "border-champagne bg-champagne/[0.11] shadow-[0_0_24px_-10px_rgba(201,169,110,0.45)]"
                    : isConnected
                    ? "border-champagne/45 bg-obsidian-elevated/95"
                    : "border-porcelain/12 bg-obsidian-elevated/70 opacity-75 hover:opacity-100 hover:border-porcelain/25"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-champagne">
                    0{idx + 1} · {node.layer}
                  </span>
                  {isSelected && (
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-champagne text-obsidian font-semibold">
                      Active
                    </span>
                  )}
                  {isConnected && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-champagne-light">
                      Linked
                    </span>
                  )}
                </div>

                <p className="font-serif text-lg sm:text-xl text-porcelain leading-snug">
                  {node.label}
                </p>

                <p className="mt-1.5 font-mono text-[11px] text-stone-dark">
                  {node.tech}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Component Inspection Readout */}
      <div
        aria-live="polite"
        className="p-5 rounded-xl bg-obsidian-elevated border border-champagne/25 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-porcelain/10">
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-champagne block">
              {selectedNode.layer} Component
            </span>
            <h4 className="font-serif text-2xl font-light text-porcelain mt-0.5">
              {selectedNode.label}
            </h4>
          </div>
          <span className="font-mono text-[11px] px-3 py-1 rounded-full border border-porcelain/15 text-porcelain/90 bg-obsidian/70">
            {selectedNode.tech}
          </span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-dark block mb-1">
              Responsibility
            </span>
            <p className="text-porcelain/90 leading-relaxed font-light">
              {selectedNode.role}
            </p>
          </div>

          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-dark block mb-1">
              Inter-Component Communication
            </span>
            <p className="text-stone leading-relaxed font-light">
              {selectedNode.communicationNote}
            </p>
          </div>

          {connectedLabels.length > 0 && (
            <div className="pt-2 border-t border-porcelain/[0.08] flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-champagne mr-1">
                <Layers className="w-3 h-3" />
                <span>Communicates With</span>
              </span>
              {connectedLabels.map((label) => {
                const target = nodes.find((n) => n.label === label);
                return (
                  <button
                    key={label}
                    type="button"
                    data-cursor="magnetic"
                    onClick={() => target && setSelectedId(target.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-porcelain/15 hover:border-champagne/45 font-mono text-[11px] text-porcelain/85 hover:text-champagne-light transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-champagne" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

