export type statusVariant =
  | 'active'
  | 'awaiting-comissioning'
  | 'under-service'
  | 'decomissioned'
  | 'due'
  | 'overdue'
  | 'in-pm'
  | 'pm-not-set';

export interface statusCardState {
  title: string;
  className: string;
  icon: string;
}
