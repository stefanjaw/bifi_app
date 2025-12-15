import { user } from '@avalantec/base-app/interfaces';

export interface taskProject {
  _id: string;
  name: string;
  description: string;
  createdBy: user;
  active: boolean;
}
