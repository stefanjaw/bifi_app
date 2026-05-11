import { filter, filterFieldConfig } from '@avalantec/base-app/resource';
import { crm } from '../interfaces/crm';

export const crmFilters: filter<crm>[] = [
  {
    field: 'title',
    type: 'string',
  },
  {
    field: 'company.name',
    type: 'string',
  },
  {
    field: 'contact.name',
    type: 'string',
  },
  {
    field: 'stage',
    type: 'string',
  },
];

export const crmFilterFields: filterFieldConfig<crm>[] = [
  { field: 'title', label: 'Title', type: 'string' },
  { field: 'stage.name', label: 'Stage', type: 'string' },
  { field: 'contact.name', label: 'Contact', type: 'string' },
  { field: 'company.name', label: 'Company', type: 'string' },
  { field: 'salesperson.username', label: 'Salesperson', type: 'string' },
  { field: 'owner.username', label: 'Owner', type: 'string' },
  { field: 'probability', label: 'Probability (%)', type: 'string' },
  { field: 'amount', label: 'Amount', type: 'string' },
  { field: 'expectedCloseDate', label: 'Expected Close Date', type: 'date' },
  { field: 'actualCloseDate', label: 'Actual Close Date', type: 'date' },
  { field: 'createdAt', label: 'Created Date', type: 'date' },
  { field: 'active', label: 'Active', type: 'boolean' },
];
