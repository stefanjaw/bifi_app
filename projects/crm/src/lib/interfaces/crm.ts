export type Stage = 'New' | 'Contacted' | 'Qualified' | 'Won' | 'Lost';

export interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  stage: Stage;
  description: string;
  contactId: string | null;
}
