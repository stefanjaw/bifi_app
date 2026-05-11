export type GanttViewMode = 'Day' | 'Week' | 'Month' | 'Year' | 'Overview';

export interface GanttItem {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  parentId: string | null;
  sequence: number;
  color?: string;
}

export interface GanttDependency {
  from: string;
  to: string;
}
