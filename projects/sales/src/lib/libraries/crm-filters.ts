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
  { field: 'title', label: 'sales.filters.title', type: 'string' },
  { field: 'stage.name', label: 'sales.filters.stage', type: 'string' },
  { field: 'contact.name', label: 'sales.filters.contact', type: 'string' },
  { field: 'company.name', label: 'sales.filters.company', type: 'string' },
  { field: 'salesperson.username', label: 'sales.filters.salesperson', type: 'string' },
  { field: 'owner.username', label: 'sales.filters.owner', type: 'string' },
  { field: 'probability', label: 'sales.filters.probability', type: 'string' },
  { field: 'amount', label: 'sales.filters.amount', type: 'string' },
  { field: 'expectedCloseDate', label: 'sales.filters.expectedCloseDate', type: 'date' },
  { field: 'actualCloseDate', label: 'sales.filters.actualCloseDate', type: 'date' },
  { field: 'createdAt', label: 'sales.filters.createdDate', type: 'date' },
  { field: 'active', label: 'sales.filters.active', type: 'boolean' },
];
