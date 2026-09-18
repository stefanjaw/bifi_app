import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { FormModule } from '@avalantec/base-app/form';
import { ToastManager } from '@avalantec/base-app/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ProgressBarModule } from 'primeng/progressbar';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { TableLayout } from '@avalantec/base-app/resource';
import { TagModule } from 'primeng/tag';
import { CrudGlReports, trialBalanceRow, ledgerReport } from '../../services/crud-gl-reports';
import {
  glTrialBalanceColumns,
  glLedgerColumns,
  glPygColumns,
  glTaxColumns,
  glCustomerColumns,
} from '../../libraries/gl-report-columns';
import { CrudCurrencies } from '@avalantec/base-app/currency';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

/**
 * Reports screen (Phase L3): Balanza (from->to) per (account+currency),
 * Legacy drill-down Ledger per account, PyG Year totals, Tax balances
 * and customer sales (rappel base), plus the automatic closing action.
 */
@Component({
  selector: 'bifi-app-gl-reports-list',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    TableLayout,
    TableModule,
    TagModule,
    FormModule,
    TabsModule,
    ProgressBarModule,
    TranslatePipe,
  ],
  templateUrl: './gl-reports-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlReportsList {
  private crudGlReports = inject(CrudGlReports);
  private crudCurrencies = inject(CrudCurrencies);
  private destroyRef = inject(DestroyRef);
  private toastManager = inject(ToastManager);
  private translationService = inject(TranslationService);

  protected isLoading = signal(false);
  protected isClosingRunning = signal(false);
  protected closingResult = signal<string | null>(null);

  /** Selected year for income-expenses/customer-sales/closing (default now) */
  protected selectedYear = signal<number>(new Date().getFullYear());

  /** Trial balance filters + results (Balanza tab). PrimeNG's datepicker can write
   * `null` into the model (clear button / unparsable input), so the type is nullable. */
  protected fromDate = signal<Date | null>(new Date(new Date().getFullYear(), 0, 1));
  protected toDate = signal<Date | null>(new Date(new Date().getFullYear(), 11, 31));
  protected selectedCurrencyId = signal<string>('');
  protected trialRows = signal<trialBalanceRow[]>([]);
  protected totalDebit = signal<number>(0);
  protected totalCredit = signal<number>(0);
  protected balanced = signal<boolean>(false);

  /** Ledger tab (drill-down of an account from the balanza) */
  protected ledgerAccountId = signal<string | null>(null);
  protected ledgerAccountName = signal<string | null>(null);
  protected ledgerReport = signal<ledgerReport | null>(null);

  /** PyG tab */
  protected pygRows = signal<import('../../services/crud-gl-reports').incomeExpenseRow[]>([]);
  protected incomeTotal = signal(0);
  protected expenseTotal = signal(0);
  protected resultAmount = signal(0);

  /** IVA tab */
  protected ivaRows = signal<import('../../services/crud-gl-reports').taxBalanceRow[]>([]);

  /** Customer sales tab (rappel base) */
  protected customerRows = signal<import('../../services/crud-gl-reports').customerSalesRow[]>([]);

  currenciesResource = this.crudCurrencies.get({});

  protected currencies = this.currenciesResource.value;
  protected glTrialBalanceColumns = glTrialBalanceColumns;
  protected glLedgerColumns = glLedgerColumns;
  protected pygColumns = glPygColumns;
  protected taxColumns = glTaxColumns;
  protected customerColumns = glCustomerColumns;

  protected currentView = signal<'balanza' | 'pyg' | 'iva' | 'customerSales'>('balanza');

  /** Runs the report matching the currently-active tab */
  runCurrentView() {
    switch (this.currentView()) {
      case 'balanza':
        return this.runBalanza();
      case 'pyg':
        return this.runPyG();
      case 'iva':
        return this.runIva();
      case 'customerSales':
        return this.runCustomerSales();
    }
  }

  protected currencyOptions = computed(() => this.currencies() ?? []);

  /**
   * Formats the selected From/To dates for the report queries.
   * @returns The ISO date strings, or `null` when the datepicker was cleared
   * (PrimeNG writes `null` into the model), so callers can bail out safely.
   */
  private dateRangeParams(): { from: string; to: string } | null {
    const from = this.fromDate();
    const to = this.toDate();
    if (!from || !to) {
      this.toastManager.showError(
        this.translationService.translate('reports.invalidDates', {}, 'accounting')
      );
      return null;
    }
    return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
  }

  /** Runs the trial balance (Balanza) for the selected range + currency */
  runBalanza() {
    const range = this.dateRangeParams();
    if (!range) return;
    this.isLoading.set(true);
    this.crudGlReports
      .getTrialBalance(range.from, range.to, this.selectedCurrencyId())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(report => {
        this.trialRows.set(report.rows ?? []);
        this.totalDebit.set(report.totalDebit ?? 0);
        this.totalCredit.set(report.totalCredit ?? 0);
        this.balanced.set(report.balanced ?? false);
      });
  }

  /** Opens the Ledger drill-down of a Balanza row. Arrow property: the
   * TableLayout invokes `[onClickRow]` as a bare callback, which would
   * lose `this` for a regular method (found by the 2026-09-18 re-test). */
  drillDown = (row: trialBalanceRow) => {
    const range = this.dateRangeParams();
    if (!range) return;
    this.isLoading.set(true);
    this.crudGlReports
      .getLedger(row.accountId, range.from, range.to, this.selectedCurrencyId())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(report => {
        this.ledgerAccountId.set(row.accountId);
        this.ledgerAccountName.set(row.accountName ?? row.accountCode ?? null);
        this.ledgerReport.set(report);
      });
  };

  backToBalanza() {
    this.ledgerAccountId.set(null);
    this.ledgerReport.set(null);
  }

  runPyG() {
    this.isLoading.set(true);
    const currencyId = this.selectedCurrencyId();
    this.crudGlReports.getIncomeExpenses(String(this.selectedYear()), currencyId).subscribe({
      next: report => {
        this.pygRows.set(report.rows ?? []);
        this.incomeTotal.set(report.incomeTotal ?? 0);
        this.expenseTotal.set(report.expenseTotal ?? 0);
        this.resultAmount.set(report.result ?? 0);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  /** Runs the tax balances (IVA) for the selected range */
  runIva() {
    const range = this.dateRangeParams();
    if (!range) return;
    this.isLoading.set(true);
    this.crudGlReports
      .getTaxBalances(range.from, range.to)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(res => {
        this.ivaRows.set(res.rows ?? []);
      });
  }

  runCustomerSales() {
    this.isLoading.set(true);
    const currencyId = this.selectedCurrencyId();
    this.crudGlReports.getCustomerSales(String(this.selectedYear()), currencyId).subscribe({
      next: res => {
        this.customerRows.set(res.rows ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  runClosing() {
    if (this.isClosingRunning()) return;
    this.isClosingRunning.set(true);
    this.closingResult.set(null);
    const currencyId = this.selectedCurrencyId();
    this.crudGlReports.runClosingEntries(String(this.selectedYear()), currencyId).subscribe({
      next: res => {
        this.isClosingRunning.set(false);
        this.closingResult.set(`periodo ${res.period}: ${res.resultAmount}`);
      },
      error: () => this.isClosingRunning.set(false),
    });
  }
}
