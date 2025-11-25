export type statusVariant =
  | 'active'
  | 'awaiting-commissioning'
  | 'under-service'
  | 'decommissioned'
  | 'due'
  | 'overdue'
  | 'in-pm'
  | 'pm-not-set';

export interface statusCardState {
  title: string;
  className: string;
  icon: string;
}
