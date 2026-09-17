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
import { FormModule } from '@avalantec/base-app/form';
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
import { TranslatePipe } from '@avalantec/base-app/i18n';

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

  protected isLoading = signal(false);
  protected isClosingRunning = signal(false);
  protected closingResult = signal<string | null>(null);

  /** Selected year for income-expenses/customer-sales/closing (default now) */
  protected selectedYear = signal<number>(new Date().getFullYear());

  /** Trial balance filters + results (Balanza tab) */
  protected fromDate = signal<Date>(new Date(new Date().getFullYear(), 0, 1));
  protected toDate = signal<Date>(new Date(new Date().getFullYear(), 11, 31));
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

  /** Tab value strings map 1:1 to view names */
  onTabChange(event: any) {
    this.currentView.set(
      (event.tab?.title ?? event.index) as 'balanza' | 'pyg' | 'iva' | 'customerSales'
    );
  }

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

  protected onDateChange(event: any): void {
    const dates = event as Date[];
    if (Array.isArray(dates) && dates.length === 2) {
      this.fromDate.set(dates[0]);
      this.toDate.set(dates[1]);
    }
  }

  runBalanza() {
    this.isLoading.set(true);
    const from = this.fromDate().toISOString().slice(0, 10);
    const to = this.toDate().toISOString().slice(0, 10);
    const currencyId = this.selectedCurrencyId();
    this.crudGlReports.getTrialBalance(from, to, currencyId).subscribe({
      next: report => {
        this.trialRows.set(report.rows ?? []);
        this.totalDebit.set(report.totalDebit ?? 0);
        this.totalCredit.set(report.totalCredit ?? 0);
        this.balanced.set(report.balanced ?? false);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  drillDown(row: trialBalanceRow) {
    this.isLoading.set(true);
    const from = this.fromDate().toISOString().slice(0, 10);
    const to = this.toDate().toISOString().slice(0, 10);
    const currencyId = this.selectedCurrencyId();
    this.crudGlReports.getLedger(row.accountId, from, to, currencyId).subscribe({
      next: report => {
        this.ledgerAccountId.set(row.accountId);
        this.ledgerAccountName.set(row.accountName ?? row.accountCode ?? null);
        this.ledgerReport.set(report);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

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

  runIva() {
    this.isLoading.set(true);
    const from = this.fromDate().toISOString().slice(0, 10);
    const to = this.toDate().toISOString().slice(0, 10);
    this.crudGlReports.getTaxBalances(from, to).subscribe({
      next: res => {
        this.ivaRows.set(res.rows ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
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
