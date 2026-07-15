import { tableColumn } from '@avalantec/base-app/resource';
import { branchOffice } from '../interfaces/branch-office';

export const branchOfficeColumns: tableColumn<branchOffice>[] = [
  {
    field: 'companyId.name',
    title: 'company',
    type: 'text',
  },
  {
    field: 'name',
    title: 'branchName',
    type: 'text',
    sortable: true,
  },
  {
    field: 'branchCode',
    title: 'code',
    type: 'text',
    sortable: true,
  },
  {
    field: 'address',
    title: 'address',
    type: 'text',
  },
];
