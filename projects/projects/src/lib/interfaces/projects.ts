import { contact, user } from '@avalantec/base-app/interfaces';
import { projectStage } from '../modules/project-stages/interfaces/project-stage';

export interface project {
  _id: string;
  number?: string;
  name: string;
  description: string;
  createdBy: user;
  stage: projectStage;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  contactId?: contact;
  dateStart: Date;
  dateEnd: Date;
  sequence: number;
  active: boolean;
}
