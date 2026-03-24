"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { WorkflowType, WorkflowsData, Project } from "@/lib/types";
import { getProjects, addProject, deleteProject } from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjectsList] = useState<Project[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedType, setSelectedType] = useState<WorkflowType | null>(null);
  const [modalStep, setModalStep] = useState<"type" | "name">("type");

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/workflows.json");
        const data: WorkflowsData = await res.json();
        setWorkflows(data.workflows);
        setProjectsList(getProjects());
      } catch (err) {
        console.error("Failed to load workflows:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openNewProjectModal = useCallback(() => {
    setNewName("");
    setSelectedType(null);
    setModalStep("type");
    setIsModalOpen(true);
  }, []);

  const handleSelectType = useCallback((wf: WorkflowType) => {
    setSelectedType(wf);
    setModalStep("name");
  }, []);

  const handleCreate = useCallback(() => {
    if (!selectedType || !newName.trim()) return;
    const project = addProject(
      newName.trim(),
      selectedType.id,
      selectedType.name,
      selectedType.icon,
      selectedType.color
    );
    setProjectsList(getProjects());
    setIsModalOpen(false);
    router.push(`/workflow/${project.typeId}?projectId=${project.id}`);
  }, [selectedType, newName, router]);

  const handleDelete = useCallback((id: string) => {
    deleteProject(id);
    setProjectsList(getProjects());
    setDeleteId(null);
  }, []);

  const handleOpenProject = useCallback(
    (project: Project) => {
      router.push(`/workflow/${project.typeId}?projectId=${project.id}`);
    },
    [router]
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* ─── HEADER ─── */}
      <header className="relative overflow-hidden border-b border-border text-center py-12 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs text-indigo-300 mb-5 tracking-wide">
            🚀 دليل المطور الاحترافي
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-l from-[#e8eaf0] via-[#a5b4fc] to-[#818cf8] bg-clip-text text-transparent mb-3 tracking-tight">
            Workflow Guide
          </h1>
          <p className="text-muted text-sm max-w-md mx-auto">
            أنشئ مشاريعك وتابع تقدمك خطوة بخطوة
          </p>
        </div>
      </header>

      {/* ─── MAIN ─── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-text">
            مشاريعي
            {projects.length > 0 && (
              <span className="text-sm text-muted font-normal mr-2">
                ({projects.length})
              </span>
            )}
          </h2>
          <button
            onClick={openNewProjectModal}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-indigo-400 transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            مشروع جديد
          </button>
        </div>

        {/* Project List */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-muted text-sm mb-6">لا توجد مشاريع بعد</p>
            <button
              onClick={openNewProjectModal}
              className="px-6 py-3 bg-surface border border-dashed border-border rounded-xl text-sm text-muted hover:bg-surface2 hover:border-primary/40 hover:text-dim transition-all cursor-pointer"
            >
              + أنشئ مشروعك الأول
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group bg-surface border border-border rounded-xl p-5 cursor-pointer hover:bg-surface2 hover:border-opacity-60 transition-all duration-200 relative"
                style={{
                  ["--hover-border" as string]: project.typeColor,
                }}
                onClick={() => handleOpenProject(project)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    project.typeColor + "50";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "";
                }}
              >
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(project.id);
                  }}
                  className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="حذف المشروع"
                >
                  ✕
                </button>

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: `${project.typeColor}15`,
                      border: `1px solid ${project.typeColor}40`,
                    }}
                  >
                    {project.typeIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted mt-1">{project.typeName}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted">
                      <span>
                        {project.completedSteps.length} خطوة مكتملة
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(project.createdAt).toLocaleDateString("ar-SA")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="text-center py-8 text-muted text-xs border-t border-border">
        صُنع بـ ❤️ للمطورين — Next.js + TypeScript + TailwindCSS
      </footer>

      {/* ─── DELETE CONFIRMATION ─── */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setDeleteId(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-sm animate-scale-in text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="font-semibold text-text mb-2">حذف المشروع؟</h3>
            <p className="text-sm text-muted mb-6">
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg border border-border bg-surface text-muted text-sm hover:bg-surface2 transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-400 transition cursor-pointer"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── NEW PROJECT MODAL ─── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-5 flex items-center justify-between z-10 rounded-t-2xl">
              <div className="flex items-center gap-3">
                {modalStep === "name" && (
                  <button
                    onClick={() => setModalStep("type")}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface2 text-muted hover:text-text transition-all cursor-pointer"
                  >
                    →
                  </button>
                )}
                <h2 className="text-lg font-semibold text-text">
                  {modalStep === "type"
                    ? "اختر نوع سير العمل"
                    : "اسم المشروع"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface2 text-muted hover:text-text transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalStep === "type" ? (
                <div className="space-y-4">
                  {workflows.map((wf) => (
                    <div
                      key={wf.id}
                      onClick={() => handleSelectType(wf)}
                      className="rounded-xl p-5 cursor-pointer transition-all duration-200 border bg-surface2/50 border-border hover:bg-surface2"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                          style={{
                            background: `${wf.color}15`,
                            border: `1px solid ${wf.color}40`,
                          }}
                        >
                          {wf.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-text mb-1">
                            {wf.name}
                          </h3>
                          <p className="text-xs text-dim leading-relaxed mb-3">
                            {wf.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted">
                            <span className="flex items-center gap-1">
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: wf.color }}
                              />
                              {wf.stats.phases} مرحلة
                            </span>
                            <span>{wf.stats.steps} خطوة</span>
                            <span>{wf.stats.tools} أدوات</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Selected type summary */}
                  {selectedType && (
                    <div className="flex items-center gap-3 p-4 bg-surface2/50 rounded-xl border border-border">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                        style={{
                          background: `${selectedType.color}15`,
                          border: `1px solid ${selectedType.color}40`,
                        }}
                      >
                        {selectedType.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-text">
                          {selectedType.name}
                        </div>
                        <div className="text-xs text-muted">
                          {selectedType.stats.phases} مرحلة ·{" "}
                          {selectedType.stats.steps} خطوة
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Name input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                      اسم المشروع
                    </label>
                    <input
                      type="text"
                      autoFocus
                      placeholder="مثال: تطبيق إدارة المهام..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newName.trim()) handleCreate();
                      }}
                      className="w-full bg-background border border-border rounded-xl px-5 py-4 text-text placeholder:text-muted/60 text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>

                  {/* Create button */}
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                      newName.trim()
                        ? "bg-primary text-white hover:bg-indigo-400 shadow-lg shadow-primary/25"
                        : "bg-surface2 text-muted border border-border cursor-not-allowed"
                    }`}
                  >
                    🚀 إنشاء المشروع
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
