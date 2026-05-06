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
import { CrudTaxes } from '@avalantec/base-app/taxes';
import { tax } from '../../interfaces/tax';
import { CrudAccounts } from '../../services/crud-accounts';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaxFormService, TaxFormModel } from '../../services/tax-form';

@Component({
  selector: 'bifi-app-tax-form',
  imports: [FormModule, ReactiveFormsModule, InputText, SelectModule, ToggleSwitchModule, ProgressBarModule, InputNumberModule],
  templateUrl: './tax-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxForm {
  private formService = inject(TaxFormService);
  private crudTaxes = inject(CrudTaxes);
  private crudAccounts = inject(CrudAccounts);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  taxResource = this.crudTaxes.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });
  accountsResource = this.crudAccounts.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(
    () => this.taxResource.isLoading() || this.accountsResource.isLoading(),
  );
  isSubmitLoading = signal(false);

  form = this.formService.form;
  accounts = this.accountsResource.value;

  taxTypeOptions = [
    { label: 'Sales', value: 'sales' },
    { label: 'Purchase', value: 'purchase' },
  ];

  constructor() {
    effect(() => {
      const entry = this.taxResource.value() as tax | undefined;
      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          taxType: entry.taxType,
          percentage: entry.percentage,
          accountId: entry.accountId?._id ?? '',
          active: entry.active ?? true,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<TaxFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudTaxes.put({ _id: this.id(), data: rawValue as any })
      : this.crudTaxes.post({ data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => { this.isSubmitLoading.set(false); this.goBack(); },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/accounting/taxes']);
  }
}
