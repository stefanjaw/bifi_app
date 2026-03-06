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
import { BaseForm, FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudCurrencies } from '../../services/crud-currencies';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface CurrencyFormModel {
  name: string;
  code: string;
  symbol: string;
  decimalPrecision: number;
  active: boolean;
  isDefault: boolean;
}

@Component({
  selector: 'bifi-app-currency-form',
  imports: [FormModule, ReactiveFormsModule, InputText, InputNumberModule, ToggleSwitchModule, ProgressBarModule],
  templateUrl: './currency-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyForm extends BaseForm<CurrencyFormModel> {
  private crudCurrencies = inject(CrudCurrencies);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  currencyResource = this.crudCurrencies.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  isUpdate = computed(() => !!this.id());
  isLoading = this.currencyResource.isLoading;
  isSubmitLoading = signal(false);

  override createForm() {
    return this.fb.group<CurrencyFormModel>({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      symbol: ['', [Validators.required]],
      decimalPrecision: [2],
      active: [true],
      isDefault: [false],
    });
  }

  constructor() {
    super();
    effect(() => {
      const entry = this.currencyResource.value();
      if (entry) {
        this.patchValue({
          name: entry.name,
          code: entry.code,
          symbol: entry.symbol,
          decimalPrecision: entry.decimalPrecision ?? 2,
          active: entry.active ?? true,
          isDefault: entry.isDefault ?? false,
        });
        this.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<CurrencyFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudCurrencies.put({ _id: this.id(), data: rawValue as any })
      : this.crudCurrencies.post({ data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/settings/currencies']);
  }
}
