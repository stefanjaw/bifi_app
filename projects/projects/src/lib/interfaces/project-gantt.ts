import { GanttItem } from '@avalantec/base-app/resource';
import { projectStage } from '../modules/project-stages/interfaces/project-stage';

export interface ganttProject extends GanttItem {
  stage?: projectStage;
  priority?: string;
  contactName?: string;
}
