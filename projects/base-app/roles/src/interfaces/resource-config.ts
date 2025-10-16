import { resource } from '@avalantec/base-app/interfaces';

export interface resourceConfig {
  name: resource;
  keySuggesstions: {
    key: string;
    name: string;
  }[];
}
