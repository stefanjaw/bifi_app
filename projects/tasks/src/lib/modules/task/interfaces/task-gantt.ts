import { GanttDependency, GanttItem, GanttViewMode } from '@avalantec/base-app/resource';
import { taskStage } from '../../task-stages/interfaces/task-stage';

export type { GanttDependency, GanttViewMode };

export interface ganttTask extends GanttItem {
  stage?: taskStage;
  priority?: string;
  projectId?: string;
  projectName?: string;
  assignedUserName?: string;
}

export interface ganttData {
  tasks: GanttItem[];
  dependencies: GanttDependency[];
}
