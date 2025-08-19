export type resource = string;
export type policyAction = 'create' | 'read' | 'update' | 'delete';
export type conditionOperator = '==' | '!=' | '>' | '<' | 'in';

export interface condition<TModel> {
  key: keyof TModel;
  operator: conditionOperator;
  value: any; // literal o "{{user.id}}"
}

export interface policy<TResource extends resource, TModel> {
  resource: TResource;
  action: policyAction;
  conditions: condition<TModel>[];
}
interface role {
  _id: string;
  name: string;
  policies: policy<any, any>[];
  active: boolean;
}

export interface user {
  _id: string;
  authId: string;
  provider: string;
  username: string;
  email: string;
  picture: string;
  roles: role[];
  // name: string;
  // lastName: string;
  // companyRoles: { company: company; role: role }[];
}
