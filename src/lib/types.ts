// Type definitions for workflow data

export interface WorkflowStep {
  title: string;
  desc: string;
  tools: string[];
  outputs: string[];
  tip: string;
}

export interface WorkflowPhase {
  num: number;
  color: string;
  title: string;
  subtitle: string;
  tool: string;
  steps: WorkflowStep[];
}

export interface WorkflowType {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  stats: {
    phases: number;
    steps: number;
    tools: number;
  };
  phases: WorkflowPhase[];
}

export interface WorkflowsData {
  workflows: WorkflowType[];
}

// --- Project Model ---
export interface Project {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
  typeIcon: string;
  typeColor: string;
  createdAt: number;
  openPhases: number[];
  openSteps: string[];
  completedSteps: string[];
}
