import { policyAction, policyType, resource } from '@avalantec/base-app/interfaces';

export type permission =
  | `${resource}:${policyAction}`
  | `${resource}:${policyType}`
  | `${resource}:${policyAction}:${policyType}`;
