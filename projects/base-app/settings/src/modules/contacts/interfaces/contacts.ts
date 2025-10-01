export interface contact {
  _id: string;
  name: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  parentId?: contact;
  type: 'individual' | 'company';
  active: boolean;
}
