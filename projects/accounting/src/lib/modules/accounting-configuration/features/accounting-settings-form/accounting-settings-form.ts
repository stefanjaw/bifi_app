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
import { CrudAccountingSettings } from '../../services/crud-accounting-settings';
import {
  AccountingSettingsForm,
  AccountingSettingsFormModel,
} from '../../services/accounting-settings-form';
import { accountingSettings } from '../../interfaces/accounting-settings';
import { account } from '../../../../interfaces/account';
import { CrudAccounts } from '../../../../services/crud-accounts';
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
  private destroy$ = inject(DestroyRef);

  protected form = this.formService.form;
  protected isSubmitLoading = signal(false);

  protected settingsResource = this.crudAccountingSettings.getSettings();

  protected sequencesResource = this.crudSequences.get({
    id: signal(''),
    getInactive: signal(false),
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
