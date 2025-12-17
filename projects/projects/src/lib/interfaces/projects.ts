import { user } from '@avalantec/base-app/interfaces';

export interface project {
  _id: string;
  name: string;
  description: string;
  createdBy: user;
  active: boolean;
}
