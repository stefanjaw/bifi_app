import { permission } from '../../permissions';

export interface role {
  _id: string;
  name: string;
  description?: string;
  permissions: permission[];
}
