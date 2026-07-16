import { tableColumn } from '@avalantec/base-app/resource';
import { recurrentTask } from '../interfaces/recurrent-task';

/** Column definitions for recurrent tasks table */
export const recurrentTaskColumns: tableColumn<recurrentTask>[] = [
  { field: 'title', title: 'title', type: 'text' },
  { field: 'stage', title: 'stage', type: 'text' },
  { field: 'priority', title: 'priority', type: 'text' },
  { field: 'repetitionSequence', title: 'repetitionSequence', type: 'text' },
  { field: 'startDate', title: 'startDate', type: 'date' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];
