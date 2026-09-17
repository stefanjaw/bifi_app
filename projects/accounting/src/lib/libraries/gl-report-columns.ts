import { tableColumn } from '@avalantec/base-app/resource';
import {
  trialBalanceRow,
  ledgerLine,
  incomeExpenseRow,
  taxBalanceRow,
  customerSalesRow,
} from '../services/crud-gl-reports';

export const glTrialBalanceColumns: tableColumn<trialBalanceRow>[] = [
  { field: 'accountCode', title: 'code', type: 'text' },
  { field: 'accountName', title: 'name', type: 'text' },
  { field: 'currencyCode', title: 'currency', type: 'text' },
  { field: 'debit', title: 'debit', type: 'number' },
  { field: 'credit', title: 'credit', type: 'number' },
  { field: 'saldo', title: 'saldo', type: 'number' },
];

export const glPygColumns: tableColumn<incomeExpenseRow>[] = [
  { field: 'accountCode', title: 'code', type: 'text' },
  { field: 'accountName', title: 'name', type: 'text' },
  { field: 'nature', title: 'nature', type: 'text' },
  { field: 'currencyCode', title: 'currency', type: 'text' },
  { field: 'debit', title: 'debit', type: 'number' },
  { field: 'credit', title: 'credit', type: 'number' },
  { field: 'saldo', title: 'saldo', type: 'number' },
];

export const glTaxColumns: tableColumn<taxBalanceRow>[] = [
  { field: 'taxName', title: 'name', type: 'text' },
  { field: 'taxType', title: 'type', type: 'text' },
  { field: 'currencyCode', title: 'currency', type: 'text' },
  { field: 'debit', title: 'debit', type: 'number' },
  { field: 'credit', title: 'credit', type: 'number' },
  { field: 'saldo', title: 'saldo', type: 'number' },
];

export const glCustomerColumns: tableColumn<customerSalesRow>[] = [
  { field: 'contactName', title: 'name', type: 'text' },
  { field: 'currencyCode', title: 'currency', type: 'text' },
  { field: 'sales', title: 'sales', type: 'number' },
];

export const glLedgerColumns: tableColumn<ledgerLine>[] = [
  { field: 'date', title: 'date', type: 'date' },
  { field: 'reference', title: 'reference', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  { field: 'currencyCode', title: 'currency', type: 'text' },
  { field: 'debit', title: 'debit', type: 'number' },
  { field: 'credit', title: 'credit', type: 'number' },
  { field: 'runningSaldo', title: 'runningSaldo', type: 'number' },
];
