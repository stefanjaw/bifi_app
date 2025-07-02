export interface company {
  _id: string;
  name: string;
  legalId: string;
  email: string;
  phone: string;
  website: string;
  logoUrl: string;
  address: string;
  ownerId?: string;
  settings?: Record<string, any>;
}
