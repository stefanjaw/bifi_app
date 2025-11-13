export type resource = string;
export type policyAction = 'create' | 'read' | 'update' | 'delete';
export type conditionOperator = '==' | '!=' | '>' | '<' | 'in';
export type policyType = 'view' | 'menu' | 'model';

export interface condition<TModel> {
  key: keyof TModel;
  operator: conditionOperator;
  value: any; // literal o "{{user.id}}"
}

export interface policy<TResource extends resource, TModel> {
  _id: string;
  name: string;
  resource: TResource;
  type: policyType;
  conditions: condition<TModel>[];
}
