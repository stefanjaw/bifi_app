import { tableColumn } from '@avalantec/base-app/resource';
import { admissionGoal, intervention, outcome } from '../interfaces/care-plan';

/** Table columns for admission goals list */
export const admissionGoalColumns: tableColumn<admissionGoal>[] = [
  { field: 'contentTitle', title: 'title', type: 'text' },
  { field: 'contentBody', title: 'body', type: 'text' },
  { field: 'state', title: 'state', type: 'text' },
  { field: 'priority', title: 'priority', type: 'number' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Table columns for interventions list */
export const interventionColumns: tableColumn<intervention>[] = [
  { field: 'contentTitle', title: 'title', type: 'text' },
  { field: 'contentBody', title: 'body', type: 'text' },
  { field: 'state', title: 'state', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Table columns for outcomes list */
export const outcomeColumns: tableColumn<outcome>[] = [
  { field: 'contentTitle', title: 'title', type: 'text' },
  { field: 'contentBody', title: 'body', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];
