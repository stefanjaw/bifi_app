import { user } from '@avalantec/base-app/interfaces';
import { taskStage } from '../../task-stages/interfaces/task-stage';
import { file } from '@avalantec/base-app/resource';
import { project } from '@avalantec/projects';
import { taskType } from '../../task-types';

export interface task {
  _id: string;
  name: string;
  description: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  plannedDuration?: number;
  progress: number;
  stage?: taskStage;
  projectId?: project;
  typeId?: taskType;
  dependencyIds?: task[];
  parentId?: task;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: user;
  updatedBy: user;
  assigned?: user;
  attachments?: file[];
  childIds?: task[];
  active: boolean;
  isMilestone?: boolean;
  sequence?: number;
}
