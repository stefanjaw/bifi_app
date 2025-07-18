export type statusVariant =
  | 'under-service'
  | 'overdue'
  | 'due'
  | 'in-pm'
  | 'pm-not-set';

export type statusCardState = {
  title: string;
  className: string;
  icon: string;
};
