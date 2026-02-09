export interface bcdTransportOption {
  _id: string;
  code: string;
  name: string;
  description?: string;
  type: 'aircraft' | 'vessel';
  active: boolean;
}
