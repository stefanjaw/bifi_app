export interface SearchDestination {
  _id?: string;
  key: string;
  label: string;
  route: string;
  icon?: string;
  group?: string;
  keywords?: string[];
  description?: string;
  resource?: string;
  active?: boolean;
  isSystem?: boolean;
}

export interface SearchResultGroup {
  group: string;
  items: SearchDestination[];
}
