import { tableColumn } from '@avalantec/base-app/resource';
import { branchOffice } from '../interfaces/branch-office';

export const branchOfficeColumns: tableColumn<branchOffice>[] = [
  {
    field: 'companyId.name',
    title: 'Company',
    type: 'text',
  },
  {
    field: 'name',
    title: 'Branch Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'branchCode',
    title: 'Code',
    type: 'text',
    sortable: true,
  },
  {
    field: 'address',
    title: 'Address',
    type: 'text',
  },
];
