export interface searchDestination {
  _id: string;
  key: string;
  label: string;
  route: string;
  icon?: string;
  group?: string;
  keywords?: string[];
  description?: string;
  resource?: string;
  scope?: string;
  active: boolean;
  isSystem?: boolean;
}

export interface searchDestinationSyncResult {
  inserted: number;
  updated: number;
  deactivated: number;
}
