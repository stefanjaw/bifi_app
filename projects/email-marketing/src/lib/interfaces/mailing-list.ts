export interface mailingList {
  _id: string;
  name: string;
  description?: string;
  subscriberCount?: number;
  active: boolean;
}
