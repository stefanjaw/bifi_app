import { ganttTask } from './task-gantt';

export type viewMode = 'Day' | 'Week' | 'Month' | 'Year';

export type dragMode =
  | { type: 'move'; task: ganttTask; initialX: number; initialStart: Date; initialEnd: Date }
  | { type: 'resizeEnd'; task: ganttTask; initialX: number; initialEnd: Date }
  | null;