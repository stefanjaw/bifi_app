import { filter } from '@avalantec/base-app/resource';
import { admissionGoal, intervention, outcome } from '../interfaces/care-plan';

/** Search filters for admission goals list */
export const admissionGoalFilters: filter<admissionGoal>[] = [
  { field: 'state', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Search filters for interventions list */
export const interventionFilters: filter<intervention>[] = [
  { field: 'state', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Search filters for outcomes list */
export const outcomeFilters: filter<outcome>[] = [{ field: 'active', type: 'boolean' }];
