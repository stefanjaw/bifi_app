import { user } from '@avalantec/base-app/interfaces';
import { taskProject } from '../../task-projects/interfaces/task-projects';
import { taskStage } from '../../task-stages/interfaces/task-stage';
import { file } from '@avalantec/base-app/resource';

export interface task {
  _id: string;
  name: string;
  description: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  plannedDuration?: number;
  progress: number;
  stage?: taskStage;
  projectId?: taskProject;
  dependencyIds?: task[];
  parentId?: task;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: user;
  updatedBy: user;
  assigned?: user;
  attachments?: file[];
  childIds?: task[];
  active: boolean;
}
