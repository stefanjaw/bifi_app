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
import { CrudAccounts } from '../../services/crud-accounts';
import { CrudCurrencies } from '@avalantec/base-app/currency';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountFormService, AccountFormModel } from '../../services/account-form';

@Component({
  selector: 'bifi-app-account-form',
  imports: [FormModule, ReactiveFormsModule, InputText, SelectModule, ToggleSwitchModule, ProgressBarModule],
  templateUrl: './account-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountForm {
  private formService = inject(AccountFormService);
  private crudAccounts = inject(CrudAccounts);
  private crudCurrencies = inject(CrudCurrencies);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  accountResource = this.crudAccounts.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });
  accountsResource = this.crudAccounts.get({});
  currenciesResource = this.crudCurrencies.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(
    () =>
      this.accountResource.isLoading() ||
      this.accountsResource.isLoading() ||
      this.currenciesResource.isLoading(),
  );
  isSubmitLoading = signal(false);

  form = this.formService.form;
  accounts = this.accountsResource.value;
  currencies = this.currenciesResource.value;

  accountTypeOptions = [
    { label: 'Asset', value: 'asset' },
    { label: 'Liability', value: 'liability' },
    { label: 'Equity', value: 'equity' },
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

  constructor() {
    effect(() => {
      const entry = this.accountResource.value();
      if (entry) {
        this.formService.patchValue({
          companyId: entry.companyId?._id ?? '',
          code: entry.code,
          name: entry.name,
          type: entry.type,
          parentAccountId: entry.parentAccountId?._id ?? '',
          currencyId: entry.currencyId?._id ?? '',
          active: entry.active ?? true,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<AccountFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const payload: any = {
      ...rawValue,
      companyId: rawValue.companyId || undefined,
      parentAccountId: rawValue.parentAccountId || undefined,
      currencyId: rawValue.currencyId || undefined,
    };
    const action = this.isUpdate()
      ? this.crudAccounts.put({ _id: this.id(), data: payload })
      : this.crudAccounts.post({ data: payload });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/accounting/accounts']);
  }
}
