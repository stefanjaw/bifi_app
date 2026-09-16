import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudAccountingSettings, glSweepResult } from '../../services/crud-accounting-settings';
import {
  AccountingSettingsForm,
  AccountingSettingsFormModel,
} from '../../services/accounting-settings-form';
import { accountingSettings } from '../../interfaces/accounting-settings';
import { account } from '../../../../interfaces/account';
import { currency } from '@avalantec/base-app/currency';
import { CrudAccounts } from '../../../../services/crud-accounts';
import { CrudCurrencies } from '@avalantec/base-app/currency';
import { CrudSequences, sequence } from '@avalantec/base-app/sequences';
import { TranslatePipe } from '@avalantec/base-app/i18n';

/**
 * Accounting configuration page (singleton settings). Phase A1 adds the
 * purchase payable fallback account used by purchase-oriented invoices.
 */
@Component({
  selector: 'bifi-app-accounting-settings-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    SelectModule,
    ButtonModule,
    TextareaModule,
    ProgressBarModule,
    TranslatePipe,
  ],
  templateUrl: './accounting-settings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountingSettingsPage {
  private crudAccountingSettings = inject(CrudAccountingSettings);
  private formService = inject(AccountingSettingsForm);
  private crudSequences = inject(CrudSequences);
  private crudAccounts = inject(CrudAccounts);
  private crudCurrencies = inject(CrudCurrencies);
  private destroy$ = inject(DestroyRef);

  protected form = this.formService.form;
  protected isSubmitLoading = signal(false);
  protected isSweepRunning = signal(false);
  protected sweepResult = signal<glSweepResult | null>(null);

  protected settingsResource = this.crudAccountingSettings.getSettings();

  protected sequencesResource = this.crudSequences.get({
    id: signal(''),
    getInactive: signal(false),
  });

  private currenciesResource = this.crudCurrencies.get<currency>({
    triggerRequest: signal(true),
  });

  private accountsResource = this.crudAccounts.get<account>({
    triggerRequest: signal(true),
  });

  protected sequenceOptions = computed<sequence[]>(() => {
    const data = this.sequencesResource.value();
    return Array.isArray(data) ? data : [];
  });

  protected accountOptions = computed<account[]>(() => {
    const data = this.accountsResource.value();
    return Array.isArray(data) ? data : [];
  });

  protected currencyOptions = computed<currency[]>(() => {
    const data = this.currenciesResource.value();
    return Array.isArray(data) ? data : [];
  });

  protected loading = computed(
    () =>
      (this.settingsResource.isLoading() && !this.settingsResource.error()) ||
      this.sequencesResource.isLoading() ||
      this.accountsResource.isLoading()
  );

  constructor() {
    effect(() => {
      const raw = this.settingsResource.value();
      if (!raw) return;
      const settings = raw as accountingSettings;

      this.formService.patchValue({
        invoiceSequence: this.resolveId(settings.invoiceSequence),
        purchasePayableAccountId: this.resolveId(settings.purchasePayableAccountId),
        description: settings.description ?? '',
      });
    });
  }

  /**
   * Runs one GL sweep pass over pending stock movements (Phase B2)
   */
  protected runGlSweep() {
    if (this.isSweepRunning()) return;
    this.isSweepRunning.set(true);
    this.sweepResult.set(null);
    this.crudAccountingSettings
      .postPendingMovements()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          this.isSweepRunning.set(false);
          this.sweepResult.set(res);
        },
        error: () => this.isSweepRunning.set(false),
      });
  }

  /** Resolves an autopopulated reference (object) or raw string into an _id */
  private resolveId(value: unknown): string {
    if (!value) return '';
    if (typeof value === 'object' && (value as any)._id) return (value as any)._id;
    return String(value);
  }

  protected handleSubmit(state: FormValueState<AccountingSettingsFormModel>) {
    this.isSubmitLoading.set(true);

    const rawValue = state.rawValue;
    const payload: Record<string, any> = {};
    if (rawValue.invoiceSequence) payload['invoiceSequence'] = rawValue.invoiceSequence;
    if (rawValue.purchasePayableAccountId)
      payload['purchasePayableAccountId'] = rawValue.purchasePayableAccountId;
    if (rawValue.discountGrantedAccountId)
      payload['discountGrantedAccountId'] = rawValue.discountGrantedAccountId;
    const inv = rawValue.inventoryAccounts;
    if (
      inv &&
      (inv.inventoryAccountId ||
        inv.cogsAccountId ||
        inv.adjustmentLossAccountId ||
        inv.apPendingAccountId ||
        inv.defaultCurrencyId)
    )
      payload['inventoryAccounts'] = inv;
    if (rawValue.description) payload['description'] = rawValue.description;

    this.crudAccountingSettings
      .putSettings(payload)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.settingsResource.reload();
        },
        error: () => {
          this.isSubmitLoading.set(false);
        },
      });
  }
}
