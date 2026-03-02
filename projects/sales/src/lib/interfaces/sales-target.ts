import { user } from '@avalantec/base-app/interfaces';

export interface salesTarget {
  _id: string;
  name: string;
  year: number;
  month: number;
  targetAmount: number;
  currency: string;
  salesperson?: user;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
