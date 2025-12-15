// Internal application models
export interface ganttTask {
  id: string;
  name: string;
  start: string; // ISO string date YYYY-MM-DD
  end: string; // ISO string date YYYY-MM-DD
  progress: number;
  parentId: string | null;
  level: number;
  children: ganttTask[];
  isExpanded: boolean;
}

export interface ganttDependency {
  from: string;
  to: string;
}

export interface ganttData {
  tasks: Omit<ganttTask, 'level' | 'children' | 'isExpanded'>[];
  dependencies: ganttDependency[];
}
