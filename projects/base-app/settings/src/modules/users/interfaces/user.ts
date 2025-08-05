import { company } from '../../companies';
import { role } from '../../roles';

export interface baseUser {
  _id: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
  companyRoles: { company: company; role: role }[];
}
