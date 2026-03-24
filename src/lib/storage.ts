// localStorage helper functions
import type { Project } from "./types";

const KEYS = {
  PROJECTS: "wf_projects",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// --- Generate unique ID ---
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// --- Get all projects ---
export function getProjects(): Project[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEYS.PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

// --- Save all projects ---
function saveProjects(projects: Project[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
}

// --- Add a new project ---
export function addProject(
  name: string,
  typeId: string,
  typeName: string,
  typeIcon: string,
  typeColor: string
): Project {
  const project: Project = {
    id: generateId(),
    name,
    typeId,
    typeName,
    typeIcon,
    typeColor,
    createdAt: Date.now(),
    openPhases: [],
    openSteps: [],
    completedSteps: [],
  };
  const projects = getProjects();
  projects.unshift(project);
  saveProjects(projects);
  return project;
}

// --- Get a single project by ID ---
export function getProject(projectId: string): Project | null {
  const projects = getProjects();
  return projects.find((p) => p.id === projectId) || null;
}

// --- Update a project ---
export function updateProject(
  projectId: string,
  updates: Partial<Pick<Project, "name" | "openPhases" | "openSteps" | "completedSteps">>
): void {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === projectId);
  if (idx === -1) return;
  projects[idx] = { ...projects[idx], ...updates };
  saveProjects(projects);
}

// --- Delete a project ---
export function deleteProject(projectId: string): void {
  const projects = getProjects().filter((p) => p.id !== projectId);
  saveProjects(projects);
}
