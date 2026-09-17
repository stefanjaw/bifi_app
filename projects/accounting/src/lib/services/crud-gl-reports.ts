import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Observable } from 'rxjs';

/** Row of the trial balance report (per account + currency) */
export interface trialBalanceRow {
  accountId: string;
  accountCode?: string;
  accountName?: string;
  accountType?: string;
  currencyId: string;
  currencyCode?: string;
  debit: number;
  credit: number;
  saldo: number;
}

export interface trialBalanceReport {
  from?: string;
  to?: string;
  currencyId?: string;
  rows: trialBalanceRow[];
  totalDebit: number;
  totalCredit: number;
  balanced: boolean;
}

export interface ledgerLine {
  date: string;
  journalEntryId: string;
  reference?: string;
  currencyId: string;
  currencyCode?: string;
  description?: string;
  debit: number;
  credit: number;
  runningSaldo: number;
}

export interface ledgerReport {
  accountId: string;
  from?: string;
  to?: string;
  currencyId?: string;
  openingBalance: number;
  rows: ledgerLine[];
  closingBalance: number;
  totalDebit: number;
  totalCredit: number;
}

export interface incomeExpenseRow extends Omit<trialBalanceRow, 'accountType'> {
  nature: 'income' | 'expense';
}

export interface incomeExpenseReport {
  period: string;
  from: string;
  to: string;
  rows: incomeExpenseRow[];
  incomeTotal: number;
  expenseTotal: number;
  result: number;
}

export interface taxBalanceRow {
  taxAccountId: string;
  taxName?: string;
  taxType?: string;
  currencyId: string;
  currencyCode?: string;
  debit: number;
  credit: number;
  saldo: number;
}

export interface customerSalesRow {
  contactId: string;
  contactName?: string;
  currencyId: string;
  currencyCode?: string;
  sales: number;
}

export interface closingEntriesResult {
  period: string;
  closingEntryId?: string;
  openingEntryId?: string;
  resultAmount: number;
}

/**
 * Read-side client for the GL reports (Phase L2/L2b endpoints). Reports
 * are GET only; the closing-runs action posts with a simple body.
 */
@Injectable({ providedIn: 'root' })
export class CrudGlReports extends ApiRequestManager<trialBalanceRow> {
  constructor() {
    super();
    super.endpoint = 'accounting/gl';
  }

  /** Trial balance report (Ej. 35) */
  getTrialBalance(
    from: string,
    to: string,
    currencyId?: string,
    accountTypes?: string
  ): Observable<trialBalanceReport> {
    const params: Record<string, string> = { from, to };
    if (currencyId) params['currencyId'] = currencyId;
    if (accountTypes) params['accountTypes'] = accountTypes;
    return this._httpClient.get<trialBalanceReport>(`${this._apiURL}/accounting/gl/trial-balance`, {
      params,
    });
  }

  /** Detailed ledger for one account (Ej. 6) */
  getLedger(
    accountId: string,
    from: string,
    to: string,
    currencyId?: string
  ): Observable<ledgerReport> {
    const params: Record<string, string> = { from, to };
    if (currencyId) params['currencyId'] = currencyId;
    return this._httpClient.get<ledgerReport>(`${this._apiURL}/accounting/gl/ledger/${accountId}`, {
      params,
    });
  }

  /** Income/expense totals for a fiscal year (Ej. 36 + closing base) */
  getIncomeExpenses(period: string, currencyId?: string): Observable<incomeExpenseReport> {
    const params: Record<string, string> = { period };
    if (currencyId) params['currencyId'] = currencyId;
    return this._httpClient.get<incomeExpenseReport>(
      `${this._apiURL}/accounting/gl/income-expenses`,
      { params }
    );
  }

  /** Tax-account balances for a period (Ej. 19 base) */
  getTaxBalances(from: string, to: string): Observable<{ rows: taxBalanceRow[] }> {
    return this._httpClient.get<{ rows: taxBalanceRow[] }>(
      `${this._apiURL}/accounting/gl/tax-balances`,
      { params: { from, to } }
    );
  }

  /** Customer sales totals for a year (Ej. 9 rappel base) */
  getCustomerSales(
    period: string,
    currencyId?: string
  ): Observable<{ period: string; rows: customerSalesRow[] }> {
    const params: Record<string, string> = { period };
    if (currencyId) params['currencyId'] = currencyId;
    return this._httpClient.get<{ period: string; rows: customerSalesRow[] }>(
      `${this._apiURL}/accounting/gl/customer-sales`,
      { params }
    );
  }

  /**
   * Generates the automatic closing entries (asientos 6/7/8 + apertura)
   * @param period - 4-digit fiscal year
   * @param currencyId - Optional currency filter (omitted when empty so the DTO whitelist accepts the payload)
   */
  runClosingEntries(period: string, currencyId?: string): Observable<closingEntriesResult> {
    return this._httpClient.post<closingEntriesResult>(
      `${this._apiURL}/accounting/gl/closing-entries`,
      { period, ...(currencyId ? { currencyId } : {}) }
    );
  }
}
