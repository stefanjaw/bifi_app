import { user } from '@avalantec/base-app/core';

export interface activityHistory<TDocument = any> {
  _id: string;
  title: string;
  details?: string;
  performDate: Date;
  model: string;
  modelId: TDocument;
  userId?: user;
  metadata?: any;
}
