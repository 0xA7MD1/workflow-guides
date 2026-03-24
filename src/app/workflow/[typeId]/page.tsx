"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import type { WorkflowType, WorkflowsData, Project } from "@/lib/types";
import { getProject, updateProject } from "@/lib/storage";

export default function WorkflowPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeId = params.typeId as string;
  const projectId = searchParams.get("projectId") || "";

  const [workflow, setWorkflow] = useState<WorkflowType | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [openPhasesSet, setOpenPhasesSet] = useState<Set<number>>(new Set());
  const [openStepsSet, setOpenStepsSet] = useState<Set<string>>(new Set());
  const [completedStepsSet, setCompletedStepsSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* ─── Load data ─── */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/workflows.json");
        const data: WorkflowsData = await res.json();
        const found = data.workflows.find((w) => w.id === typeId);

        if (!found) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setWorkflow(found);

        // Load project data
        if (projectId) {
          const proj = getProject(projectId);
          if (proj) {
            setProject(proj);
            setOpenPhasesSet(new Set(proj.openPhases));
            setOpenStepsSet(new Set(proj.openSteps));
            setCompletedStepsSet(new Set(proj.completedSteps));
          }
        }
      } catch (err) {
        console.error("Failed to load workflow:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [typeId, projectId]);

  /* ─── Persist helper ─── */
  const persist = useCallback(
    (
      phases: Set<number>,
      steps: Set<string>,
      completed: Set<string>
    ) => {
      if (!projectId) return;
      updateProject(projectId, {
        openPhases: [...phases],
        openSteps: [...steps],
        completedSteps: [...completed],
      });
    },
    [projectId]
  );

  /* ─── Toggle Phase ─── */
  const togglePhase = useCallback(
    (idx: number) => {
      setOpenPhasesSet((prev) => {
        const next = new Set(prev);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        persist(next, openStepsSet, completedStepsSet);
        return next;
      });
    },
    [persist, openStepsSet, completedStepsSet]
  );

  /* ─── Toggle Step ─── */
  const toggleStep = useCallback(
    (key: string) => {
      setOpenStepsSet((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        persist(openPhasesSet, next, completedStepsSet);
        return next;
      });
    },
    [persist, openPhasesSet, completedStepsSet]
  );

  /* ─── Toggle Completed Step ─── */
  const toggleCompleted = useCallback(
    (key: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setCompletedStepsSet((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        persist(openPhasesSet, openStepsSet, next);
        return next;
      });
    },
    [persist, openPhasesSet, openStepsSet]
  );

  /* ─── Expand / Collapse All ─── */
  const expandAll = useCallback(() => {
    if (!workflow) return;
    const allPhases = new Set(workflow.phases.map((_, i) => i));
    const allSteps = new Set<string>();
    workflow.phases.forEach((phase, pIdx) => {
      phase.steps.forEach((_, sIdx) => {
        allSteps.add(`${pIdx}-${sIdx}`);
      });
    });
    setOpenPhasesSet(allPhases);
    setOpenStepsSet(allSteps);
    persist(allPhases, allSteps, completedStepsSet);
  }, [workflow, persist, completedStepsSet]);

  const collapseAll = useCallback(() => {
    const empty = new Set<number>();
    const emptyStr = new Set<string>();
    setOpenPhasesSet(empty);
    setOpenStepsSet(emptyStr);
    persist(empty, emptyStr, completedStepsSet);
  }, [persist, completedStepsSet]);

  /* ─── Progress ─── */
  const progress = useMemo(() => {
    if (!workflow) return 0;
    const totalSteps = workflow.phases.reduce((sum, p) => sum + p.steps.length, 0);
    if (totalSteps === 0) return 0;
    return Math.round((completedStepsSet.size / totalSteps) * 100);
  }, [workflow, completedStepsSet]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !workflow) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-muted text-lg">⚠️ لم يتم العثور على نوع سير العمل</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-surface border border-border rounded-lg text-sm text-muted hover:bg-surface2 hover:text-text transition cursor-pointer"
        >
          ← الرجوع للرئيسية
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ─── HEADER ─── */}
      <header className="relative overflow-hidden border-b border-border py-10 px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% -20%, ${workflow.color}18, transparent 70%)`,
          }}
        />
        <div className="relative z-10 max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm text-muted hover:text-text transition cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="rotate-180"
              >
                <path
                  d="M6 12l4-4-4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              الرجوع
            </button>
            <div
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: `${workflow.color}15`,
                color: workflow.color,
                border: `1px solid ${workflow.color}30`,
              }}
            >
              {workflow.icon} {workflow.name}
            </div>
          </div>

          <div className="text-center">
            {project?.name && (
              <div className="text-dim text-sm mb-2">مشروع</div>
            )}
            <h1
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{
                background: `linear-gradient(135deg, #e8eaf0 0%, ${workflow.color} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {project?.name || workflow.name}
            </h1>
            <p className="text-muted text-sm mb-6">{workflow.description}</p>

            <div className="flex justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div
                  className="text-xl font-bold"
                  style={{ color: workflow.color }}
                >
                  {workflow.stats.phases}
                </div>
                <div className="text-xs text-muted uppercase tracking-wider">
                  مرحلة
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-xl font-bold"
                  style={{ color: workflow.color }}
                >
                  {completedStepsSet.size}/{workflow.stats.steps}
                </div>
                <div className="text-xs text-muted uppercase tracking-wider">
                  خطوة مكتملة
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-xl font-bold"
                  style={{ color: workflow.color }}
                >
                  {progress}%
                </div>
                <div className="text-xs text-muted uppercase tracking-wider">
                  التقدم
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN ─── */}
      <main className="max-w-[1100px] mx-auto px-5 py-10 flex-1 w-full">
        {/* Progress Bar */}
        <div className="h-1 bg-border rounded-full mb-8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${workflow.color}, ${workflow.phases[Math.floor(workflow.phases.length / 2)]?.color || workflow.color}, ${workflow.phases[workflow.phases.length - 1]?.color || workflow.color})`,
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2.5 justify-end mb-6">
          <button
            onClick={expandAll}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-muted text-xs font-medium hover:bg-surface2 hover:text-text hover:border-primary transition-all cursor-pointer"
          >
            فتح الكل
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-muted text-xs font-medium hover:bg-surface2 hover:text-text hover:border-primary transition-all cursor-pointer"
          >
            إغلاق الكل
          </button>
        </div>

        {/* Phases */}
        <div className="space-y-4 w-full">
          {workflow.phases.map((phase, pIdx) => {
            const isOpen = openPhasesSet.has(pIdx);
            const colorAlpha10 = `${phase.color}1a`;
            const colorAlpha30 = `${phase.color}4d`;

            // Phase completion
            const phaseStepKeys = phase.steps.map((_, sIdx) => `${pIdx}-${sIdx}`);
            const phaseCompleted = phaseStepKeys.filter((k) =>
              completedStepsSet.has(k)
            ).length;
            const phaseTotal = phase.steps.length;

            return (
              <div key={pIdx}>
                <div
                  className={`rounded-xl overflow-hidden border transition-all duration-300 w-full min-w-0 ${
                    isOpen
                      ? "shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                      : "border-border"
                  }`}
                  style={{
                    background: "var(--color-surface)",
                    borderColor: isOpen ? phase.color : undefined,
                    boxShadow: isOpen
                      ? `0 0 0 1px ${colorAlpha10}, 0 4px 24px rgba(0,0,0,0.3)`
                      : undefined,
                  }}
                >
                  {/* Phase Header */}
                  <div
                    className="flex items-center gap-4 p-5 cursor-pointer select-none hover:bg-surface2 transition-colors duration-200"
                    onClick={() => togglePhase(pIdx)}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2 transition-all duration-300"
                      style={{
                        color: phaseCompleted === phaseTotal && phaseTotal > 0 ? "#22c55e" : phase.color,
                        borderColor: phaseCompleted === phaseTotal && phaseTotal > 0 ? "#22c55e" : phase.color,
                        background: phaseCompleted === phaseTotal && phaseTotal > 0 ? "#22c55e1a" : colorAlpha10,
                      }}
                    >
                      {phaseCompleted === phaseTotal && phaseTotal > 0 ? "✓" : String(phase.num).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-text">
                        {phase.title}
                      </div>
                      <div className="text-xs text-muted">
                        {phase.subtitle}
                        {phaseCompleted > 0 && (
                          <span className="mr-2">
                            · {phaseCompleted}/{phaseTotal}
                          </span>
                        )}
                      </div>
                    </div>
                    {isOpen && (
                      <span
                        className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                        style={{
                          color: phase.color,
                          background: colorAlpha10,
                          border: `1px solid ${phase.color}`,
                        }}
                      >
                        {phase.tool}
                      </span>
                    )}
                    <div
                      className={`w-7 h-7 flex items-center justify-center rounded-md text-muted shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Phase Body */}
                  {isOpen && (
                    <div className="px-6 pb-6 animate-fade-down w-full min-w-0">
                      <div className="space-y-2.5">
                        {phase.steps.map((step, sIdx) => {
                          const stepKey = `${pIdx}-${sIdx}`;
                          const isStepOpen = openStepsSet.has(stepKey);
                          const isDone = completedStepsSet.has(stepKey);

                          return (
                            <div
                              key={sIdx}
                              className={`rounded-lg border overflow-hidden transition-colors duration-200 w-full min-w-0 ${
                                isDone ? "opacity-70" : ""
                              } ${
                                isStepOpen
                                  ? "border-opacity-50"
                                  : "border-border"
                              }`}
                              style={{
                                background: "var(--color-surface2)",
                                borderColor: isStepOpen
                                  ? colorAlpha30
                                  : undefined,
                              }}
                            >
                              {/* Step Header */}
                              <div
                                className="flex items-center gap-3 p-4 cursor-pointer select-none hover:bg-white/[0.03] transition-colors duration-150"
                                onClick={() => toggleStep(stepKey)}
                              >
                                {/* Checkbox */}
                                <button
                                  onClick={(e) => toggleCompleted(stepKey, e)}
                                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                    isDone
                                      ? "bg-green-500 border-green-500 text-white"
                                      : "border-border hover:border-dim"
                                  }`}
                                >
                                  {isDone && (
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                    >
                                      <path
                                        d="M2.5 6l2.5 2.5 4.5-5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </button>
                                <div
                                  className={`w-2 h-2 rounded-full shrink-0 transition-opacity duration-200 ${
                                    isStepOpen ? "opacity-100" : "opacity-60"
                                  }`}
                                  style={{ background: phase.color }}
                                />
                                <div
                                  className={`flex-1 text-sm font-medium transition-colors duration-200 ${
                                    isDone
                                      ? "line-through text-muted"
                                      : isStepOpen
                                      ? "text-text"
                                      : "text-dim"
                                  }`}
                                >
                                  {step.title}
                                </div>
                                <div
                                  className={`text-[10px] text-muted shrink-0 transition-transform duration-200 ${
                                    isStepOpen ? "rotate-180" : ""
                                  }`}
                                >
                                  ▼
                                </div>
                              </div>

                              {/* Step Body */}
                              {isStepOpen && (
                                <div className="px-4 pb-4 space-y-3.5 animate-fade-down">
                                  <div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted mb-2 flex items-center gap-1.5 after:content-[''] after:flex-1 after:h-px after:bg-border">
                                      وش تسوي
                                    </div>
                                    <p className="text-[13.5px] text-dim leading-relaxed">
                                      {step.desc}
                                    </p>
                                  </div>
                                  <div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted mb-2 flex items-center gap-1.5 after:content-[''] after:flex-1 after:h-px after:bg-border">
                                      الأداة
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {step.tools.map((tool, tIdx) => (
                                        <span
                                          key={tIdx}
                                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25"
                                        >
                                          🔧 {tool}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted mb-2 flex items-center gap-1.5 after:content-[''] after:flex-1 after:h-px after:bg-border">
                                      الـ Output
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {step.outputs.map((output, oIdx) => (
                                        <span
                                          key={oIdx}
                                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                                        >
                                          📤 {output}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted mb-2 flex items-center gap-1.5 after:content-[''] after:flex-1 after:h-px after:bg-border">
                                      نصيحة
                                    </div>
                                    <div className="bg-yellow-400/[0.06] border border-yellow-400/20 rounded-lg p-3 flex gap-2.5 items-start">
                                      <span className="text-base shrink-0 mt-0.5">
                                        💡
                                      </span>
                                      <span className="text-[12.5px] text-yellow-300 leading-relaxed">
                                        {step.tip}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {pIdx < workflow.phases.length - 1 && (
                  <div className="flex items-center justify-center py-1.5 text-border text-lg">
                    ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <footer className="text-center py-8 text-muted text-xs border-t border-border">
        صُنع بـ ❤️ للمطورين — Next.js + TypeScript + TailwindCSS
      </footer>
    </>
  );
}
