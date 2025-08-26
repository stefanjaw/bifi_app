import { resource } from '@avalantec/base-app/core';

export interface resourceConfig {
  name: resource;
  keySuggesstions: {
    key: string;
    name: string;
  }[];
}
