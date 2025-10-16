import { policy } from './policy';

export interface role {
  _id: string;
  name: string;
  policies: policy<any, any>[];
  active: boolean;
}
