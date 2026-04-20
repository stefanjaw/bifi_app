export type GanttViewMode = 'Day' | 'Week' | 'Month' | 'Year';

export interface GanttItem {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  parentId: string | null;
  sequence: number;
}

export interface GanttDependency {
  from: string;
  to: string;
}
