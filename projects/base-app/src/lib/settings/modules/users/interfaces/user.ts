import { company } from '../../companies';
import { role } from '../../roles';

export interface user {
  _id: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
  companyRoles: { company: company; role: role }[];
}
