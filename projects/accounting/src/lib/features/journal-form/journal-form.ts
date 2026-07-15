import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudJournals } from '../../services/crud-journals';
import { CrudAccounts } from '../../services/crud-accounts';
import { CrudCurrencies } from '@avalantec/base-app/currency';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JournalFormService, JournalFormModel } from '../../services/journal-form';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-journal-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    SelectModule,
    ToggleSwitchModule,
    ProgressBarModule,
    TranslatePipe,
  ],
  templateUrl: './journal-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalForm {
  private formService = inject(JournalFormService);
  private crudJournals = inject(CrudJournals);
  private crudAccounts = inject(CrudAccounts);
  private crudCurrencies = inject(CrudCurrencies);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  journalResource = this.crudJournals.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });
  accountsResource = this.crudAccounts.get({});
  currenciesResource = this.crudCurrencies.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(
    () =>
      this.journalResource.isLoading() ||
      this.accountsResource.isLoading() ||
      this.currenciesResource.isLoading()
  );
  isSubmitLoading = signal(false);

  form = this.formService.form;
  accounts = this.accountsResource.value;
  currencies = this.currenciesResource.value;

  private translationService = inject(TranslationService);

  journalTypeOptions = [
    { label: this.translationService.translate('options.sales', {}, 'accounting'), value: 'sales' },
    {
      label: this.translationService.translate('options.purchase', {}, 'accounting'),
      value: 'purchase',
    },
    { label: this.translationService.translate('options.cash', {}, 'accounting'), value: 'cash' },
    { label: this.translationService.translate('options.bank', {}, 'accounting'), value: 'bank' },
    {
      label: this.translationService.translate('options.general', {}, 'accounting'),
      value: 'general',
    },
  ];

  constructor() {
    effect(() => {
      const entry = this.journalResource.value();
      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          code: entry.code,
          journalType: entry.journalType,
          defaultDebitAccountId: entry.defaultDebitAccountId?._id ?? '',
          defaultCreditAccountId: entry.defaultCreditAccountId?._id ?? '',
          currencyId: entry.currencyId?._id ?? '',
          active: entry.active ?? true,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<JournalFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const payload: any = {
      ...rawValue,
      defaultDebitAccountId: rawValue.defaultDebitAccountId || undefined,
      defaultCreditAccountId: rawValue.defaultCreditAccountId || undefined,
      currencyId: rawValue.currencyId || undefined,
    };
    const action = this.isUpdate()
      ? this.crudJournals.put({ _id: this.id(), data: payload })
      : this.crudJournals.post({ data: payload });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/accounting/journals']);
  }
}
