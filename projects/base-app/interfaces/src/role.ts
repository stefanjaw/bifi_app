import { policy, policyAction } from './policy';

export interface role {
  _id: string;
  name: string;
  policies: { policyId: policy<any, any>; actions: policyAction[] }[];
  active: boolean;
}
