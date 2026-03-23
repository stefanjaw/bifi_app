import { user } from '@avalantec/base-app/interfaces';
import { helpdeskStage } from './helpdesk-stage';

export interface ticketActivityEntry {
  _id: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  changedBy?: user;
  createdAt?: string;
}

export interface ticketAttachment {
  fileId: string;
  name: string;
  mimeType: string;
  size: number;
}

export interface ticket {
  _id: string;
  name: string;
  description?: string;
  internalNotes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'task' | 'helpdesk';
  stage?: helpdeskStage;
  assigned?: user;
  senderUser?: user;
  followers?: user[];
  tags?: string[];
  category?: string;
  appModule?: string;
  attachments?: ticketAttachment[];
  slaResponseDeadline?: string;
  slaResolutionDeadline?: string;
  resolvedAt?: string;
  closedAt?: string;
  taskIds?: string[];
  activityHistory?: ticketActivityEntry[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
